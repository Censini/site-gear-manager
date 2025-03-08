
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EquipmentTab from "./EquipmentTab";
import ConnectionsTab from "./ConnectionsTab";
import IPRangesTab from "./IPRangesTab";
import { Equipment, NetworkConnection, IPRange } from "@/types/types";

interface SiteResourcesCardProps {
  siteId: string;
  equipment: Equipment[];
  connections: NetworkConnection[];
  ipRanges: IPRange[];
}

const SiteResourcesCard = ({ siteId, equipment, connections, ipRanges }: SiteResourcesCardProps) => {
  const navigate = useNavigate();
  
  const handleAddEquipment = () => {
    navigate(`/equipment/add?siteId=${siteId}`);
  };
  
  const handleAddConnection = () => {
    navigate(`/connections/add?siteId=${siteId}`);
  };
  
  const handleAddIPRange = () => {
    navigate(`/ipam/add?siteId=${siteId}`);
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
            <div className="mb-4 flex justify-end">
              <Button onClick={handleAddEquipment} size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Equipment
              </Button>
            </div>
            <EquipmentTab equipment={equipment} />
          </TabsContent>
          
          <TabsContent value="connections">
            <div className="mb-4 flex justify-end">
              <Button onClick={handleAddConnection} size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Connection
              </Button>
            </div>
            <ConnectionsTab connections={connections} />
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
