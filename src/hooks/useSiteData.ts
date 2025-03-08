
import { useState } from "react";
import { useGetSite } from "./useGetSite";
import { useGetSiteEquipment } from "./useGetSiteEquipment";
import { useGetSiteConnections } from "./useGetSiteConnections";
import { useGetSiteIPRanges } from "./useGetSiteIPRanges";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const useSiteData = (id: string | undefined) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
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
      
      // Force remove this site from the cache
      queryClient.setQueryData(["site", id], null);
      
      // Invalidate and refetch queries to refresh data across the app
      await queryClient.invalidateQueries({ queryKey: ["sites"] });
      
      // Remove from the cache
      const sitesData = queryClient.getQueryData(["sites"]);
      if (Array.isArray(sitesData)) {
        queryClient.setQueryData(
          ["sites"], 
          sitesData.filter(site => site.id !== id)
        );
      }
      
      toast.success("Site deleted successfully");
      navigate("/sites"); // Force navigation back to sites
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
