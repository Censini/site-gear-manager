
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { IPRange } from "@/types/types";
import { toast } from "sonner";

export interface AddIPRangeParams {
  range: string;
  description?: string;
  isReserved: boolean;
  dhcpScope: boolean;
  siteId: string;
}

export const useAddIPRange = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddIPRangeParams) => {
      console.log("Adding IP range with data:", data);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data: result, error } = await supabase
        .from("ip_ranges")
        .insert({
          range: data.range,
          description: data.description || null,
          is_reserved: data.isReserved,
          dhcp_scope: data.dhcpScope,
          site_id: data.siteId || null,
          user_id: user?.id
        })
        .select()
        .single();

      if (error) {
        console.error("Error adding IP range:", error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      toast.success("IP range added successfully");
      // Invalidate both IP ranges queries to ensure data is fresh
      queryClient.invalidateQueries({ queryKey: ["ipRanges"] });
    },
    onError: (error) => {
      console.error("Error in add IP range mutation:", error);
      toast.error("Failed to add IP range");
    }
  });
};
