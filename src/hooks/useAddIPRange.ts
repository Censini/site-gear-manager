
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { IPRange } from "@/types/types";
import { toast } from "sonner";

export const useAddIPRange = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ipRangeData: Omit<IPRange, "id">) => {
      console.log("Adding IP range:", ipRangeData);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from("ip_ranges")
        .insert({
          range: ipRangeData.range,
          description: ipRangeData.description || null,
          is_reserved: ipRangeData.isReserved,
          dhcp_scope: ipRangeData.dhcpScope,
          site_id: ipRangeData.siteId,
          user_id: user?.id
        })
        .select()
        .single();

      if (error) {
        console.error("Error adding IP range:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      toast.success("IP range added successfully");
      queryClient.invalidateQueries({ queryKey: ["ipRanges"] });
    },
    onError: (error) => {
      console.error("Error in add IP range mutation:", error);
      toast.error("Failed to add IP range");
    },
  });
};
