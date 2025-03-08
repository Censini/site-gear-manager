
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { IPRange } from "@/types/types";
import { toast } from "sonner";

export const useGetSiteIPRanges = (id: string | undefined) => {
  return useQuery({
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
};
