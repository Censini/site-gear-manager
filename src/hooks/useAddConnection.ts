
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NetworkConnection } from "@/types/types";
import { toast } from "sonner";

export const useAddConnection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (connectionData: Omit<NetworkConnection, "id" | "siteName">) => {
      console.log("Adding new connection:", connectionData);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      // Create connection data object, handling empty site_id case
      const connectionToInsert = {
        site_id: connectionData.siteId || null, // Set to null if empty string
        type: connectionData.type,
        provider: connectionData.provider,
        contract_ref: connectionData.contractRef,
        bandwidth: connectionData.bandwidth,
        sla: connectionData.sla,
        status: connectionData.status,
        user_id: user?.id // Add the user ID to comply with RLS
      };

      const { data, error } = await supabase
        .from("network_connections")
        .insert(connectionToInsert)
        .select("*")
        .single();

      if (error) {
        console.error("Error adding connection:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Connection added successfully");
      queryClient.invalidateQueries({ queryKey: ["connections"] });
    },
    onError: (error) => {
      console.error("Error in add connection mutation:", error);
      toast.error("Failed to add connection");
    },
  });
};
