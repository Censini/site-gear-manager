
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NetworkConnection } from "@/types/types";

export const useGetNetworkConnections = () => {
  return useQuery({
    queryKey: ["network_connections"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("network_connections")
        .select("*");
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data as NetworkConnection[];
    },
  });
};
