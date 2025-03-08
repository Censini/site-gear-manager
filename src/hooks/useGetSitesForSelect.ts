
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useGetSitesForSelect = () => {
  return useQuery({
    queryKey: ["sites"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sites")
        .select("id, name")
        .order("name");
      
      if (error) {
        console.error("Error fetching sites:", error);
        toast.error("Failed to load sites");
        return [];
      }
      
      return data;
    }
  });
};
