
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { IPRangeFormValues } from "@/schemas/ipRangeSchema";

export interface UpdateIPRangeParams extends IPRangeFormValues {
  id: string;
}

export const useUpdateIPRange = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateIPRangeParams) => {
      console.log("Updating IP range with data:", data);
      
      const { data: result, error } = await supabase
        .from("ip_ranges")
        .update({
          range: data.range,
          description: data.description || null,
          is_reserved: data.isReserved,
          dhcp_scope: data.dhcpScope,
          site_id: data.siteId || null,
          updated_at: new Date().toISOString()
        })
        .eq("id", data.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating IP range:", error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      toast.success("IP range updated successfully");
      // Invalidate both IP ranges queries to ensure data is fresh
      queryClient.invalidateQueries({ queryKey: ["ipRanges"] });
      queryClient.invalidateQueries({ queryKey: ["ipRange"] });
    },
    onError: (error) => {
      console.error("Error in update IP range mutation:", error);
      toast.error("Failed to update IP range");
    }
  });
};
