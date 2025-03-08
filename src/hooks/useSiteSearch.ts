
import { useState, useMemo } from "react";
import { Site } from "@/types/types";

export const useSiteSearch = (sites: Site[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredSites = useMemo(() => {
    if (!sites || !Array.isArray(sites)) return [];
    
    return sites.filter((site) =>
      site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.country.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sites, searchTerm]);
  
  return { searchTerm, setSearchTerm, filteredSites };
};
