import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Site } from "@/types/types";
import SearchBar from "@/components/sites/SearchBar";
import SitesList from "@/components/sites/SitesList";
import { useSiteSearch } from "@/hooks/useSiteSearch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Types pour le tri
type SortField = "name" | "location" | "country";
type SortDirection = "asc" | "desc";

const Sites = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // États pour le tri
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  
  // Fetch sites from Supabase
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["sites"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("sites")
          .select("*");
        
        if (error) throw error;
        
        console.log("Sites récupérés:", data);
        
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
        console.error("Erreur lors de la récupération des sites:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les sites. Veuillez réessayer plus tard.",
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

  // Sort sites based on sortField and sortDirection
  const sortedSites = [...filteredSites].sort((a, b) => {
    // Handle case insensitive string comparison
    const compareValues = (valA: string, valB: string) => {
      const strA = (valA || "").toLowerCase();
      const strB = (valB || "").toLowerCase();
      
      if (sortDirection === "asc") {
        return strA.localeCompare(strB);
      } else {
        return strB.localeCompare(strA);
      }
    };
    
    return compareValues(a[sortField], b[sortField]);
  });

  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === "asc" ? "desc" : "asc");
  };

  // Handle sort field change
  const handleSortFieldChange = (value: string) => {
    setSortField(value as SortField);
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
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          
          {/* Contrôles de tri */}
          <div className="flex items-center gap-2">
            <Select value={sortField} onValueChange={handleSortFieldChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nom</SelectItem>
                <SelectItem value="location">Emplacement</SelectItem>
                <SelectItem value="country">Pays</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="icon"
              onClick={toggleSortDirection}
              className="h-10 w-10"
            >
              {sortDirection === "asc" ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        
        <Button 
          className="flex items-center gap-1 w-full md:w-auto"
          onClick={() => navigate("/sites/add")}
        >
          <Plus className="h-4 w-4" />
          <span>Ajouter un Site</span>
        </Button>
      </div>
      
      {/* Afficher un texte indiquant comment les sites sont triés */}
      <div className="text-sm text-muted-foreground">
        Triés par {sortField === "name" ? "nom" : sortField === "location" ? "emplacement" : "pays"} ({sortDirection === "asc" ? "croissant" : "décroissant"})
      </div>
      
      <SitesList sites={sortedSites} refetchSites={refetch} />
    </div>
  );
};

export default Sites;