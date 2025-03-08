
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Equipment, NetworkConnection, IPRange } from "@/types/types";

export const useGetUnassignedEquipment = () => {
  return useQuery({
    queryKey: ["unassigned-equipment"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("equipment")
        .select("id, name")
        .is("site_id", null);

      if (error) {
        console.error("Error fetching unassigned equipment:", error);
        throw error;
      }

      return data || [];
    },
  });
};

export const useGetUnassignedConnections = () => {
  return useQuery({
    queryKey: ["unassigned-connections"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("network_connections")
        .select("id, provider, type")
        .is("site_id", null);

      if (error) {
        console.error("Error fetching unassigned connections:", error);
        throw error;
      }

      // Create a more user-friendly name for display
      return (data || []).map(conn => ({
        id: conn.id,
        name: `${conn.provider} (${conn.type})`
      }));
    },
  });
};

export const useGetUnassignedIPRanges = () => {
  return useQuery({
    queryKey: ["unassigned-ip-ranges"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ip_ranges")
        .select("id, range, description")
        .is("site_id", null);

      if (error) {
        console.error("Error fetching unassigned IP ranges:", error);
        throw error;
      }

      // Create a more user-friendly name for display
      return (data || []).map(range => ({
        id: range.id,
        name: range.description ? `${range.range} (${range.description})` : range.range
      }));
    },
  });
};
