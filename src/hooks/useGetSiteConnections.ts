
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NetworkConnection } from "@/types/types";
import { toast } from "sonner";

export const useGetSiteConnections = (id: string | undefined) => {
  return useQuery({
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
};
