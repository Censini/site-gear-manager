
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Loader2, Edit, Trash2 } from "lucide-react";
import { Site } from "@/types/types";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";

const Sites = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [siteToDelete, setSiteToDelete] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch sites from Supabase
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["sites"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("sites")
          .select("*");
        
        if (error) throw error;
        
        console.log("Fetched sites:", data);
        
        return data.map(site => ({
          id: site.id,
          name: site.name,
          location: site.location,
          country: site.country,
          address: site.address || "",
          contactName: site.contact_name || "",
          contactEmail: site.contact_email || "",
          contactPhone: site.contact_phone || ""
        } as Site));
      } catch (error) {
        console.error("Error fetching sites:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load sites. Please try again later.",
        });
        return [];
      }
    },
    // Ensure the query doesn't retry infinitely on error
    retry: 1,
    // Initialize with empty array if data is undefined
    initialData: [],
    // Don't cache for too long to ensure freshness
    staleTime: 1000
  });

  // Force refetch when component mounts to ensure fresh data
  useEffect(() => {
    refetch();
  }, [refetch]);

  // Ensure sites is always an array
  const sites = Array.isArray(data) ? data : [];

  // Filter sites based on search term
  const filteredSites = sites.filter((site) =>
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle site deletion
  const handleDeleteSite = async (siteId: string) => {
    if (!siteId) return;
    
    setIsDeleting(true);
    setSiteToDelete(siteId);
    
    try {
      // First check if there are related records
      const { data: equipmentData } = await supabase
        .from("equipment")
        .select("id")
        .eq("site_id", siteId);
        
      const { data: connectionsData } = await supabase
        .from("network_connections")
        .select("id")
        .eq("site_id", siteId);
        
      const { data: ipRangesData } = await supabase
        .from("ip_ranges")
        .select("id")
        .eq("site_id", siteId);
      
      // Delete related records if they exist
      if (equipmentData && equipmentData.length > 0) {
        await supabase
          .from("equipment")
          .delete()
          .eq("site_id", siteId);
      }
      
      if (connectionsData && connectionsData.length > 0) {
        await supabase
          .from("network_connections")
          .delete()
          .eq("site_id", siteId);
      }
      
      if (ipRangesData && ipRangesData.length > 0) {
        await supabase
          .from("ip_ranges")
          .delete()
          .eq("site_id", siteId);
      }
      
      // Delete the site
      const { error } = await supabase
        .from("sites")
        .delete()
        .eq("id", siteId);
      
      if (error) throw error;
      
      // Update cache
      queryClient.invalidateQueries({ queryKey: ["sites"] });
      
      toast({
        title: "Site deleted",
        description: "Site has been successfully deleted",
      });
      
      refetch();
    } catch (error) {
      console.error("Error deleting site:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete site. Please try again.",
      });
    } finally {
      setIsDeleting(false);
      setSiteToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Sites</h1>
      
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search sites..."
            className="pl-8 max-w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button 
          className="flex items-center gap-1 w-full md:w-auto"
          onClick={() => navigate("/sites/add")}
        >
          <Plus className="h-4 w-4" />
          <span>Add Site</span>
        </Button>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredSites.length > 0 ? (
          filteredSites.map((site) => (
            <Card key={site.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="cursor-pointer hover:text-primary" onClick={() => navigate(`/sites/${site.id}`)}>
                  {site.name}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pb-2">
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>{site.location}, {site.country}</p>
                  {site.address && <p>{site.address}</p>}
                  {site.contactName && <p>Contact: {site.contactName}</p>}
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-end gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/sites/edit/${site.id}`);
                  }}
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="flex items-center gap-1"
                      disabled={isDeleting && siteToDelete === site.id}
                    >
                      {isDeleting && siteToDelete === site.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      <span>Delete</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the site "{site.name}" and all of its associated data.
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDeleteSite(site.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <h3 className="text-lg font-medium">No sites found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? "Try adjusting your search terms" : "Add your first site to get started"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sites;
