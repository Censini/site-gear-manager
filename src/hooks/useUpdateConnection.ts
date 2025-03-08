
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NetworkConnection } from "@/types/types";
import { toast } from "sonner";

export const useUpdateConnection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      connectionData,
    }: {
      id: string;
      connectionData: Omit<NetworkConnection, "id" | "siteName">;
    }) => {
      console.log("Updating connection:", id, connectionData);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from("network_connections")
        .update({
          site_id: connectionData.siteId,
          type: connectionData.type,
          provider: connectionData.provider,
          contract_ref: connectionData.contractRef,
          bandwidth: connectionData.bandwidth,
          sla: connectionData.sla,
          status: connectionData.status,
          user_id: user?.id // Keep the user ID to comply with RLS
        })
        .eq("id", id)
        .select("*")
        .single();

      if (error) {
        console.error("Error updating connection:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Connection updated successfully");
      queryClient.invalidateQueries({ queryKey: ["connections"] });
    },
    onError: (error) => {
      console.error("Error in update connection mutation:", error);
      toast.error("Failed to update connection");
    },
  });
};
