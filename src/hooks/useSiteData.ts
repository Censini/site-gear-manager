
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
  const deleteSite = async (): Promise<void> => {
    if (!id) {
      toast.error("Cannot delete: Site ID is missing");
      return;
    }
    
    console.log("Attempting to delete site with ID:", id);
    setIsDeleting(true);
    
    try {
      // First check if there are related records that need to be deleted
      const hasEquipment = equipment.length > 0;
      const hasConnections = connections.length > 0;
      const hasIPRanges = ipRanges.length > 0;
      
      if (hasEquipment || hasConnections || hasIPRanges) {
        console.log("Site has related records:", {
          equipment: equipment.length,
          connections: connections.length,
          ipRanges: ipRanges.length
        });
        
        // Delete all related records first
        if (hasEquipment) {
          const { error: equipmentError } = await supabase
            .from("equipment")
            .delete()
            .eq("site_id", id);
            
          if (equipmentError) {
            console.error("Error deleting equipment:", equipmentError);
            throw new Error(`Failed to delete equipment: ${equipmentError.message}`);
          }
        }
        
        if (hasConnections) {
          const { error: connectionsError } = await supabase
            .from("network_connections")
            .delete()
            .eq("site_id", id);
            
          if (connectionsError) {
            console.error("Error deleting connections:", connectionsError);
            throw new Error(`Failed to delete connections: ${connectionsError.message}`);
          }
        }
        
        if (hasIPRanges) {
          const { error: ipRangesError } = await supabase
            .from("ip_ranges")
            .delete()
            .eq("site_id", id);
            
          if (ipRangesError) {
            console.error("Error deleting IP ranges:", ipRangesError);
            throw new Error(`Failed to delete IP ranges: ${ipRangesError.message}`);
          }
        }
      }
      
      // After all related records are deleted, delete the site
      console.log("Deleting site with ID:", id);
      const { error } = await supabase
        .from("sites")
        .delete()
        .eq("id", id);
      
      if (error) {
        console.error("Error deleting site:", error);
        throw error;
      }
      
      console.log("Site deleted successfully");
      
      // Force remove this site from the cache
      queryClient.removeQueries({ queryKey: ["site", id] });
      
      // Update the sites list cache
      queryClient.setQueryData(
        ["sites"],
        (oldData: any) => {
          if (Array.isArray(oldData)) {
            return oldData.filter(site => site.id !== id);
          }
          return oldData;
        }
      );
      
      // Invalidate and refetch queries to refresh data across the app
      await queryClient.invalidateQueries({ queryKey: ["sites"] });
      
      toast.success("Site deleted successfully");
      
      // Navigate back to sites list
      navigate("/sites", { replace: true });
    } catch (error) {
      console.error("Error in deleteSite function:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete site");
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
