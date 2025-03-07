
import { useParams, useNavigate } from "react-router-dom";
import { getSiteById, getEquipmentBySiteId, getNetworkConnectionsBySiteId, getIPRangesBySiteId } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatusBadge from "@/components/ui/StatusBadge";
import EquipmentTypeIcon from "@/components/ui/EquipmentTypeIcon";
import { ArrowLeft, Edit, Building, Mail, MapPin, Phone } from "lucide-react";

const SiteDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const site = getSiteById(id || "");
  
  const equipment = site ? getEquipmentBySiteId(site.id) : [];
  const connections = site ? getNetworkConnectionsBySiteId(site.id) : [];
  const ipRanges = site ? getIPRangesBySiteId(site.id) : [];

  if (!site) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-bold">Site not found</h2>
        <p className="text-muted-foreground mb-4">The site you're looking for doesn't exist.</p>
        <Button onClick={() => navigate("/sites")}>Go back to Sites</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate("/sites")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{site.name}</h1>
        </div>
        <Button variant="outline" className="flex items-center gap-1 w-full md:w-auto">
          <Edit className="h-4 w-4" />
          <span>Edit</span>
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Site Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Building className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Location</p>
                <p>{site.location}, {site.country}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Address</p>
                <p>{site.address}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Contact Email</p>
                <p>{site.contactEmail}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Contact Phone</p>
                <p>{site.contactPhone}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {equipment.map((item) => (
                      <TableRow 
                        key={item.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => navigate(`/equipment/${item.id}`)}
                      >
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <EquipmentTypeIcon type={item.type} className="text-muted-foreground" />
                            <span className="capitalize">{item.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>{item.ipAddress}</TableCell>
                        <TableCell>
                          <StatusBadge status={item.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                    {equipment.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No equipment found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="connections">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Contract Ref</TableHead>
                      <TableHead>Bandwidth</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {connections.map((connection) => (
                      <TableRow key={connection.id}>
                        <TableCell className="font-medium capitalize">{connection.type}</TableCell>
                        <TableCell>{connection.provider}</TableCell>
                        <TableCell>{connection.contractRef}</TableCell>
                        <TableCell>{connection.bandwidth}</TableCell>
                        <TableCell>
                          <StatusBadge status={connection.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                    {connections.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No connections found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="ip">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>IP Range</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>DHCP Scope</TableHead>
                      <TableHead>Reserved</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ipRanges.map((range) => (
                      <TableRow key={range.id}>
                        <TableCell className="font-medium">{range.range}</TableCell>
                        <TableCell>{range.description}</TableCell>
                        <TableCell>{range.dhcpScope ? "Yes" : "No"}</TableCell>
                        <TableCell>{range.isReserved ? "Yes" : "No"}</TableCell>
                      </TableRow>
                    ))}
                    {ipRanges.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No IP ranges found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default SiteDetail;
