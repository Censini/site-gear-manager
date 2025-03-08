
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NetworkConnection } from "@/types/types";
import { toast } from "sonner";

export const useGetConnection = (id: string) => {
  return useQuery({
    queryKey: ["connection", id],
    queryFn: async () => {
      console.log("Fetching connection with ID:", id);
      
      try {
        const { data, error } = await supabase
          .from("network_connections")
          .select("*, sites(name)")
          .eq("id", id)
          .single();
        
        if (error) {
          console.error("Error fetching connection:", error);
          throw error;
        }
        
        console.log("Connection data retrieved:", data);
        
        return {
          id: data.id,
          siteId: data.site_id || "",
          type: data.type,
          provider: data.provider,
          contractRef: data.contract_ref || "",
          bandwidth: data.bandwidth || "",
          sla: data.sla || "",
          status: data.status,
          siteName: data.sites?.name || ""
        } as NetworkConnection & { siteName: string };
      } catch (error) {
        console.error("Error in connection query:", error);
        toast.error("Failed to load connection data");
        throw error;
      }
    },
    enabled: !!id, // Only run the query if an ID is provided
  });
};
