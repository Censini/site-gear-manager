
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Site, Equipment, NetworkConnection, IPRange } from "@/types/types";
import { toast } from "sonner";

export const useSiteData = (id: string | undefined) => {
  // Fetch site data from Supabase
  const { 
    data: site, 
    isLoading: isLoadingSite, 
    error: siteError 
  } = useQuery({
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
        } as Site;
      } catch (error) {
        console.error("Error in site query:", error);
        toast.error("Failed to load site details");
        throw error;
      }
    }
  });
  
  // Fetch equipment data for this site
  const { 
    data: equipment = [], 
    isLoading: isLoadingEquipment 
  } = useQuery({
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
  const { 
    data: connections = [], 
    isLoading: isLoadingConnections 
  } = useQuery({
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
  const { 
    data: ipRanges = [], 
    isLoading: isLoadingIPRanges 
  } = useQuery({
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

  // Delete site function
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
      return true;
    } catch (error) {
      console.error("Error in delete operation:", error);
      toast.error("An error occurred while deleting the site");
      return false;
    }
  };

  return {
    site,
    equipment,
    connections,
    ipRanges,
    isLoading: isLoadingSite || isLoadingEquipment || isLoadingConnections || isLoadingIPRanges,
    error: siteError,
    deleteSite
  };
};
