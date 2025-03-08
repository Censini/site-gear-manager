
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, Link as LinkIcon, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EquipmentTab from "./EquipmentTab";
import ConnectionsTab from "./ConnectionsTab";
import IPRangesTab from "./IPRangesTab";
import { Equipment, NetworkConnection, IPRange } from "@/types/types";
import { 
  useGetUnassignedEquipment,
  useGetUnassignedConnections,
  useGetUnassignedIPRanges
} from "@/hooks/useGetUnassignedItems";
import { useAssignEquipment } from "@/hooks/useAssignEquipment";
import { useAssignConnection } from "@/hooks/useAssignConnection";
import { useAssignIPRange } from "@/hooks/useAssignIPRange";
import AssignExistingItemDialog from "./AssignExistingItemDialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface SiteResourcesCardProps {
  siteId: string;
  equipment: Equipment[];
  connections: NetworkConnection[];
  ipRanges: IPRange[];
}

const SiteResourcesCard = ({ siteId, equipment, connections, ipRanges }: SiteResourcesCardProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("equipment");
  
  // Dialog state
  const [showAssignEquipmentDialog, setShowAssignEquipmentDialog] = useState(false);
  const [showAssignConnectionDialog, setShowAssignConnectionDialog] = useState(false);
  const [showAssignIPRangeDialog, setShowAssignIPRangeDialog] = useState(false);
  
  // Assign mutations
  const assignEquipment = useAssignEquipment();
  const assignConnection = useAssignConnection();
  const assignIPRange = useAssignIPRange();
  
  // Unassigned items queries
  const { 
    data: unassignedEquipment = [], 
    isLoading: isLoadingEquipment 
  } = useGetUnassignedEquipment();
  
  const { 
    data: unassignedConnections = [], 
    isLoading: isLoadingConnections 
  } = useGetUnassignedConnections();
  
  const { 
    data: unassignedIPRanges = [], 
    isLoading: isLoadingIPRanges 
  } = useGetUnassignedIPRanges();
  
  // Handle navigation to add new items
  const handleAddEquipment = () => {
    navigate(`/equipment/add?siteId=${siteId}`);
  };
  
  const handleAddConnection = () => {
    navigate(`/connections/add?siteId=${siteId}`);
  };
  
  const handleAddIPRange = () => {
    navigate(`/ipam/add?siteId=${siteId}`);
  };
  
  // Handle assigning existing items
  const handleAssignEquipment = async (equipmentId: string) => {
    await assignEquipment.mutateAsync({ equipmentId, siteId });
    setShowAssignEquipmentDialog(false);
  };
  
  const handleAssignConnection = async (connectionId: string) => {
    await assignConnection.mutateAsync({ connectionId, siteId });
    setShowAssignConnectionDialog(false);
  };
  
  const handleAssignIPRange = async (ipRangeId: string) => {
    await assignIPRange.mutateAsync({ ipRangeId, siteId });
    setShowAssignIPRangeDialog(false);
  };
  
  return (
    <Card className="md:col-span-2">
      <Tabs defaultValue="equipment" onValueChange={setActiveTab}>
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Equipment
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleAddEquipment}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setShowAssignEquipmentDialog(true)}
                    disabled={unassignedEquipment.length === 0}
                  >
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Assign Existing
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <EquipmentTab equipment={equipment} />
            
            <AssignExistingItemDialog
              isOpen={showAssignEquipmentDialog}
              onClose={() => setShowAssignEquipmentDialog(false)}
              onConfirm={handleAssignEquipment}
              title="Assign Existing Equipment"
              items={unassignedEquipment}
              isLoading={isLoadingEquipment}
              isSubmitting={assignEquipment.isPending}
              type="equipment"
            />
          </TabsContent>
          
          <TabsContent value="connections">
            <div className="mb-4 flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Connection
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleAddConnection}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setShowAssignConnectionDialog(true)}
                    disabled={unassignedConnections.length === 0}
                  >
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Assign Existing
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <ConnectionsTab connections={connections} />
            
            <AssignExistingItemDialog
              isOpen={showAssignConnectionDialog}
              onClose={() => setShowAssignConnectionDialog(false)}
              onConfirm={handleAssignConnection}
              title="Assign Existing Connection"
              items={unassignedConnections}
              isLoading={isLoadingConnections}
              isSubmitting={assignConnection.isPending}
              type="connection"
            />
          </TabsContent>
          
          <TabsContent value="ip">
            <div className="mb-4 flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add IP Range
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleAddIPRange}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setShowAssignIPRangeDialog(true)}
                    disabled={unassignedIPRanges.length === 0}
                  >
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Assign Existing
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <IPRangesTab ipRanges={ipRanges} />
            
            <AssignExistingItemDialog
              isOpen={showAssignIPRangeDialog}
              onClose={() => setShowAssignIPRangeDialog(false)}
              onConfirm={handleAssignIPRange}
              title="Assign Existing IP Range"
              items={unassignedIPRanges}
              isLoading={isLoadingIPRanges}
              isSubmitting={assignIPRange.isPending}
              type="iprange"
            />
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default SiteResourcesCard;
