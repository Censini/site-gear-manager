
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAssignConnection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ connectionId, siteId }: { connectionId: string; siteId: string }) => {
      const { data, error } = await supabase
        .from("network_connections")
        .update({ site_id: siteId })
        .eq("id", connectionId)
        .select()
        .single();

      if (error) {
        console.error("Error assigning connection:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Connexion assignée avec succès");
      queryClient.invalidateQueries({ queryKey: ["connections"] });
      queryClient.invalidateQueries({ queryKey: ["site-connections"] });
    },
    onError: (error) => {
      console.error("Error in assign connection mutation:", error);
      toast.error("Impossible d'assigner la connexion");
    },
  });
};
