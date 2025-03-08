
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Site } from "@/types/types";
import SearchBar from "@/components/sites/SearchBar";
import SitesList from "@/components/sites/SitesList";
import { useSiteSearch } from "@/hooks/useSiteSearch";

const Sites = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
    retry: 1,
    initialData: [],
    staleTime: 1000
  });

  // Force refetch when component mounts to ensure fresh data
  useEffect(() => {
    refetch();
  }, [refetch]);

  // Filter sites based on search term
  const { searchTerm, setSearchTerm, filteredSites } = useSiteSearch(Array.isArray(data) ? data : []);

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
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <Button 
          className="flex items-center gap-1 w-full md:w-auto"
          onClick={() => navigate("/sites/add")}
        >
          <Plus className="h-4 w-4" />
          <span>Add Site</span>
        </Button>
      </div>
      
      <SitesList sites={filteredSites} refetchSites={refetch} />
    </div>
  );
};

export default Sites;
