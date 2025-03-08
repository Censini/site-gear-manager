
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Equipment } from "@/types/types";

export const useGetEquipment = () => {
  return useQuery({
    queryKey: ["equipment"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("equipment")
        .select("*");
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data as Equipment[];
    },
  });
};
