
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatusBadge from "@/components/ui/StatusBadge";
import EquipmentTypeIcon from "@/components/ui/EquipmentTypeIcon";
import { ArrowLeft, Edit, Building, Mail, MapPin, Phone, Loader2, Trash2 } from "lucide-react";
import { Equipment, NetworkConnection, IPRange } from "@/types/types";
import { toast } from "sonner";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const SiteDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // More debugging logs
  console.log("Site ID from URL:", id);
  console.log("Site ID type:", typeof id);
  
  // Fetch site data from Supabase
  const { data: site, isLoading: isLoadingSite, error: siteError } = useQuery({
    queryKey: ["site", id],
    queryFn: async () => {
      if (!id) throw new Error("No site ID provided");
      
      console.log("Fetching site with ID:", id);
      
      try {
        const { data, error } = await supabase
          .from("sites")
          .select("*")
          .eq("id", id)
          .maybeSingle();
        
        if (error) {
          console.error("Error fetching site:", error);
          throw error;
        }
        
        if (!data) {
          console.error("No site found with ID:", id);
          throw new Error("Site not found");
        }
        
        console.log("Site data retrieved:", data);
        
        return {
          id: data.id,
          name: data.name,
          location: data.location,
          country: data.country,
          address: data.address || "",
          contactName: data.contact_name || "",
          contactEmail: data.contact_email || "",
          contactPhone: data.contact_phone || ""
        };
      } catch (error) {
        console.error("Error in site query:", error);
        toast.error("Failed to load site details");
        throw error;
      }
    }
  });
  
  // Fetch equipment data for this site
  const { data: equipment = [], isLoading: isLoadingEquipment } = useQuery({
    queryKey: ["equipment", "site", id],
    enabled: !!id,
    queryFn: async () => {
      console.log("Fetching equipment for site:", id);
      
      try {
        const { data, error } = await supabase
          .from("equipment")
          .select("*")
          .eq("site_id", id);
        
        if (error) {
          console.error("Error fetching equipment:", error);
          throw error;
        }
        
        console.log("Equipment data retrieved:", data);
        
        return data.map(item => ({
          id: item.id,
          name: item.name,
          siteId: item.site_id || "",
          type: item.type,
          model: item.model,
          manufacturer: item.manufacturer,
          ipAddress: item.ip_address || "",
          macAddress: item.mac_address || "",
          firmware: item.firmware || "",
          installDate: item.install_date || "",
          status: item.status,
          netbios: item.netbios || ""
        } as Equipment));
      } catch (error) {
        console.error("Error in equipment query:", error);
        toast.error("Failed to load equipment data");
        return [];
      }
    }
  });
  
  // Fetch network connections for this site
  const { data: connections = [], isLoading: isLoadingConnections } = useQuery({
    queryKey: ["connections", "site", id],
    enabled: !!id,
    queryFn: async () => {
      console.log("Fetching connections for site:", id);
      
      try {
        const { data, error } = await supabase
          .from("network_connections")
          .select("*")
          .eq("site_id", id);
        
        if (error) {
          console.error("Error fetching connections:", error);
          throw error;
        }
        
        console.log("Connections data retrieved:", data);
        
        return data.map(item => ({
          id: item.id,
          siteId: item.site_id || "",
          type: item.type,
          provider: item.provider,
          contractRef: item.contract_ref || "",
          bandwidth: item.bandwidth || "",
          sla: item.sla || "",
          status: item.status
        } as NetworkConnection));
      } catch (error) {
        console.error("Error in connections query:", error);
        toast.error("Failed to load connection data");
        return [];
      }
    }
  });
  
  // Fetch IP ranges for this site
  const { data: ipRanges = [], isLoading: isLoadingIPRanges } = useQuery({
    queryKey: ["ipRanges", "site", id],
    enabled: !!id,
    queryFn: async () => {
      console.log("Fetching IP ranges for site:", id);
      
      try {
        const { data, error } = await supabase
          .from("ip_ranges")
          .select("*")
          .eq("site_id", id);
        
        if (error) {
          console.error("Error fetching IP ranges:", error);
          throw error;
        }
        
        console.log("IP ranges data retrieved:", data);
        
        return data.map(item => ({
          id: item.id,
          siteId: item.site_id || "",
          range: item.range,
          description: item.description || "",
          isReserved: item.is_reserved || false,
          dhcpScope: item.dhcp_scope || false
        } as IPRange));
      } catch (error) {
        console.error("Error in IP ranges query:", error);
        toast.error("Failed to load IP range data");
        return [];
      }
    }
  });

  // Function to handle site deletion
  const deleteSite = async () => {
    if (!id) return;
    
    try {
      const { error } = await supabase
        .from("sites")
        .delete()
        .eq("id", id);
      
      if (error) {
        console.error("Error deleting site:", error);
        toast.error("Failed to delete site");
        return;
      }
      
      toast.success("Site deleted successfully");
      navigate("/sites");
    } catch (error) {
      console.error("Error in delete operation:", error);
      toast.error("An error occurred while deleting the site");
    }
  };

  // Show loading state
  if (isLoadingSite || isLoadingEquipment || isLoadingConnections || isLoadingIPRanges) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show error state
  if (siteError || !site) {
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
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="flex items-center gap-1 flex-1 md:flex-none" onClick={() => navigate(`/sites/edit/${id}`)}>
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="flex items-center gap-1 flex-1 md:flex-none">
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the site
                  "{site.name}" and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={deleteSite} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
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
