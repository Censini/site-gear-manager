
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAssignEquipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ equipmentId, siteId }: { equipmentId: string; siteId: string }) => {
      const { data, error } = await supabase
        .from("equipment")
        .update({ site_id: siteId })
        .eq("id", equipmentId)
        .select()
        .single();

      if (error) {
        console.error("Error assigning equipment:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Équipement assigné avec succès");
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
      queryClient.invalidateQueries({ queryKey: ["site-equipment"] });
    },
    onError: (error) => {
      console.error("Error in assign equipment mutation:", error);
      toast.error("Impossible d'assigner l'équipement");
    },
  });
};
