
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EquipmentTab from "./EquipmentTab";
import ConnectionsTab from "./ConnectionsTab";
import IPRangesTab from "./IPRangesTab";
import { Equipment, NetworkConnection, IPRange } from "@/types/types";
import SelectExistingEquipment from "../equipment/SelectExistingEquipment";
import SelectExistingConnection from "../connection/SelectExistingConnection";

interface SiteResourcesCardProps {
  siteId: string;
  equipment: Equipment[];
  connections: NetworkConnection[];
  ipRanges: IPRange[];
  onRefresh?: () => Promise<void>;
}

const SiteResourcesCard = ({ siteId, equipment, connections, ipRanges, onRefresh }: SiteResourcesCardProps) => {
  const navigate = useNavigate();
  const [showExistingEquipment, setShowExistingEquipment] = useState(false);
  const [showExistingConnection, setShowExistingConnection] = useState(false);
  
  const handleAddEquipment = () => {
    navigate(`/equipment/add?siteId=${siteId}`);
  };
  
  const handleAddConnection = () => {
    navigate(`/connections/add?siteId=${siteId}`);
  };
  
  const handleAddIPRange = () => {
    navigate(`/ipam/add?siteId=${siteId}`);
  };

  const handleEquipmentSuccess = () => {
    setShowExistingEquipment(false);
    if (onRefresh) onRefresh();
  };

  const handleConnectionSuccess = () => {
    setShowExistingConnection(false);
    if (onRefresh) onRefresh();
  };
  
  return (
    <Card className="md:col-span-2">
      <Tabs defaultValue="equipment">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Site Resources</CardTitle>
            <TabsList>
              <TabsTrigger value="equipment">Equipment</TabsTrigger>
              <TabsTrigger value="connections">Connections</TabsTrigger>
              <TabsTrigger value="ip">IP Ranges</TabsTrigger>
            </TabsList>
          </div>
        </CardHeader>
        <CardContent>
          <TabsContent value="equipment">
            {showExistingEquipment ? (
              <SelectExistingEquipment 
                siteId={siteId} 
                onCancel={() => setShowExistingEquipment(false)} 
                onSuccess={handleEquipmentSuccess}
              />
            ) : (
              <>
                <div className="mb-4 flex justify-end gap-2">
                  <Button onClick={() => setShowExistingEquipment(true)} size="sm" variant="outline">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Assign Existing
                  </Button>
                  <Button onClick={handleAddEquipment} size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New
                  </Button>
                </div>
                <EquipmentTab equipment={equipment} />
              </>
            )}
          </TabsContent>
          
          <TabsContent value="connections">
            {showExistingConnection ? (
              <SelectExistingConnection
                siteId={siteId}
                onCancel={() => setShowExistingConnection(false)}
                onSuccess={handleConnectionSuccess}
              />
            ) : (
              <>
                <div className="mb-4 flex justify-end gap-2">
                  <Button onClick={() => setShowExistingConnection(true)} size="sm" variant="outline">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Assign Existing
                  </Button>
                  <Button onClick={handleAddConnection} size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Connection
                  </Button>
                </div>
                <ConnectionsTab connections={connections} onRefresh={onRefresh} />
              </>
            )}
          </TabsContent>
          
          <TabsContent value="ip">
            <div className="mb-4 flex justify-end">
              <Button onClick={handleAddIPRange} size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add IP Range
              </Button>
            </div>
            <IPRangesTab ipRanges={ipRanges} />
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default SiteResourcesCard;
