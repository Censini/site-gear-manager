
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NetworkConnection } from "@/types/types";
import { toast } from "sonner";

export const useGetConnections = () => {
  return useQuery({
    queryKey: ["connections"],
    queryFn: async () => {
      console.log("Fetching all connections");
      
      try {
        const { data, error } = await supabase
          .from("network_connections")
          .select("*, sites(name)");
        
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
          status: item.status,
          siteName: item.sites?.name || ""
        } as NetworkConnection & { siteName: string }));
      } catch (error) {
        console.error("Error in connections query:", error);
        toast.error("Failed to load connection data");
        return [];
      }
    }
  });
};
