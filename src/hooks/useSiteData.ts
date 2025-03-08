
import { useState } from "react";
import { useGetSite } from "./useGetSite";
import { useGetSiteEquipment } from "./useGetSiteEquipment";
import { useGetSiteConnections } from "./useGetSiteConnections";
import { useGetSiteIPRanges } from "./useGetSiteIPRanges";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useSiteData = (id: string | undefined) => {
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Fetch site data
  const { 
    data: site, 
    isLoading: isLoadingSite, 
    error: siteError,
    refetch: refetchSite
  } = useGetSite(id);
  
  // Fetch site equipment
  const { 
    data: equipment = [], 
    isLoading: isLoadingEquipment,
    refetch: refetchEquipment
  } = useGetSiteEquipment(id);
  
  // Fetch site connections
  const { 
    data: connections = [], 
    isLoading: isLoadingConnections,
    refetch: refetchConnections
  } = useGetSiteConnections(id);
  
  // Fetch site IP ranges
  const { 
    data: ipRanges = [], 
    isLoading: isLoadingIPRanges,
    refetch: refetchIPRanges
  } = useGetSiteIPRanges(id);
  
  // Delete site function
  const deleteSite = async () => {
    if (!id) return false;
    
    setIsDeleting(true);
    try {
      // Delete site
      const { error } = await supabase
        .from("sites")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      
      toast.success("Site deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting site:", error);
      toast.error("Failed to delete site");
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  // Function to refetch all data
  const refetch = async () => {
    console.log("Refetching all site data");
    await Promise.all([
      refetchSite(),
      refetchEquipment(),
      refetchConnections(),
      refetchIPRanges()
    ]);
    console.log("Refetch complete");
  };
  
  const isLoading = isLoadingSite || isLoadingEquipment || isLoadingConnections || isLoadingIPRanges || isDeleting;
  const error = siteError;
  
  return { 
    site, 
    equipment, 
    connections, 
    ipRanges, 
    isLoading, 
    error, 
    deleteSite,
    refetch
  };
};
