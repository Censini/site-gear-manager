
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { IPRange } from "@/types/types";
import { toast } from "sonner";

export const useGetIPRange = (id: string | undefined) => {
  return useQuery({
    queryKey: ["ipRange", id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) return null;
      
      try {
        const { data, error } = await supabase
          .from("ip_ranges")
          .select("*")
          .eq("id", id)
          .single();
        
        if (error) {
          console.error("Error fetching IP range:", error);
          throw error;
        }
        
        return {
          id: data.id,
          siteId: data.site_id || "",
          range: data.range,
          description: data.description || "",
          isReserved: data.is_reserved || false,
          dhcpScope: data.dhcp_scope || false
        } as IPRange;
      } catch (error) {
        console.error("Error in IP range query:", error);
        toast.error("Failed to load IP range data");
        return null;
      }
    }
  });
};
