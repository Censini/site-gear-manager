
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ConnectionFormValues } from "@/components/connection/ConnectionForm";
import { NetworkConnection } from "@/types/types";

export const useUpdateConnection = (connectionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ConnectionFormValues) => {
      console.log("Updating connection with data:", data);

      // Convert empty site ID to null for the database
      const siteId = data.siteId || null;

      const { error } = await supabase
        .from("network_connections")
        .update({
          site_id: siteId,
          type: data.type,
          provider: data.provider,
          contract_ref: data.contractRef,
          bandwidth: data.bandwidth,
          sla: data.sla,
          status: data.status
        })
        .eq("id", connectionId);

      if (error) {
        console.error("Error updating connection:", error);
        throw error;
      }

      return { id: connectionId } as NetworkConnection;
    },
    onSuccess: () => {
      toast.success("Connection updated successfully");
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["connection", connectionId] });
      queryClient.invalidateQueries({ queryKey: ["connections"] });
      queryClient.invalidateQueries({ queryKey: ["site-connections"] });
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast.error("Failed to update connection");
    }
  });
};
