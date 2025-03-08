
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EquipmentTab from "./EquipmentTab";
import ConnectionsTab from "./ConnectionsTab";
import IPRangesTab from "./IPRangesTab";
import { Equipment, NetworkConnection, IPRange } from "@/types/types";

interface SiteResourcesCardProps {
  equipment: Equipment[];
  connections: NetworkConnection[];
  ipRanges: IPRange[];
}

const SiteResourcesCard = ({ equipment, connections, ipRanges }: SiteResourcesCardProps) => {
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
            <EquipmentTab equipment={equipment} />
          </TabsContent>
          
          <TabsContent value="connections">
            <ConnectionsTab connections={connections} />
          </TabsContent>
          
          <TabsContent value="ip">
            <IPRangesTab ipRanges={ipRanges} />
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default SiteResourcesCard;
