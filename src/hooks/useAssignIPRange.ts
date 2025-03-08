
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAssignIPRange = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ipRangeId, siteId }: { ipRangeId: string; siteId: string }) => {
      const { data, error } = await supabase
        .from("ip_ranges")
        .update({ site_id: siteId })
        .eq("id", ipRangeId)
        .select()
        .single();

      if (error) {
        console.error("Error assigning IP range:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Plage IP assignée avec succès");
      queryClient.invalidateQueries({ queryKey: ["ip-ranges"] });
      queryClient.invalidateQueries({ queryKey: ["site-ip-ranges"] });
    },
    onError: (error) => {
      console.error("Error in assign IP range mutation:", error);
      toast.error("Impossible d'assigner la plage IP");
    },
  });
};
