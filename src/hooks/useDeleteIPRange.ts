
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useDeleteIPRange = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log("Deleting IP range with ID:", id);
      
      const { error } = await supabase
        .from("ip_ranges")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting IP range:", error);
        throw error;
      }

      return true;
    },
    onSuccess: () => {
      toast.success("IP range deleted successfully");
      // Invalidate both IP ranges queries to ensure data is fresh
      queryClient.invalidateQueries({ queryKey: ["ipRanges"] });
      queryClient.invalidateQueries({ queryKey: ["ipRange"] });
    },
    onError: (error) => {
      console.error("Error in delete IP range mutation:", error);
      toast.error("Failed to delete IP range");
    }
  });
};
