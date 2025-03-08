
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { IPRange } from "@/types/types";
import { toast } from "sonner";

export const useGetIPRanges = () => {
  return useQuery({
    queryKey: ["ipRanges"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("ip_ranges")
          .select("*, sites:site_id(id, name)")
          .order('range');
        
        if (error) {
          console.error("Error fetching IP ranges:", error);
          throw error;
        }
        
        return data.map(item => ({
          id: item.id,
          siteId: item.site_id || "",
          range: item.range,
          description: item.description || "",
          isReserved: item.is_reserved || false,
          dhcpScope: item.dhcp_scope || false,
          siteName: item.sites?.name || ""
        } as IPRange));
      } catch (error) {
        console.error("Error in IP ranges query:", error);
        toast.error("Failed to load IP range data");
        return [];
      }
    }
  });
};
