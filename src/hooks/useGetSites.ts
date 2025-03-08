
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Site } from "@/types/types";

export const useGetSites = () => {
  return useQuery({
    queryKey: ["sites"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sites")
        .select("*");
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data as Site[];
    },
  });
};
