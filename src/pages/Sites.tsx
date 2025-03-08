
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SiteCard from "@/components/cards/SiteCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Loader2 } from "lucide-react";
import { Site } from "@/types/types";
import { useNavigate } from "react-router-dom";

const Sites = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  
  // Fetch sites from Supabase
  const { data: sites = [], isLoading } = useQuery({
    queryKey: ["sites"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sites")
        .select("*");
      
      if (error) throw error;
      
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
    }
  });

  const filteredSites = sites.filter((site) =>
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        {filteredSites.map((site) => (
          <SiteCard key={site.id} site={site} />
        ))}
        {filteredSites.length === 0 && (
          <div className="col-span-full text-center py-10">
            <h3 className="text-lg font-medium">No sites found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sites;
