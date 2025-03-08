
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Site } from "@/types/types";
import { toast } from "sonner";

export const useGetSite = (id: string | undefined) => {
  return useQuery({
    queryKey: ["site", id],
    queryFn: async () => {
      if (!id) throw new Error("No site ID provided");
      
      console.log("Fetching site with ID:", id);
      
      try {
        const { data, error } = await supabase
          .from("sites")
          .select("*")
          .eq("id", id)
          .maybeSingle();
        
        if (error) {
          console.error("Error fetching site:", error);
          throw error;
        }
        
        if (!data) {
          console.error("No site found with ID:", id);
          throw new Error("Site not found");
        }
        
        console.log("Site data retrieved:", data);
        
        return {
          id: data.id,
          name: data.name,
          location: data.location,
          country: data.country,
          address: data.address || "",
          contactName: data.contact_name || "",
          contactEmail: data.contact_email || "",
          contactPhone: data.contact_phone || ""
        } as Site;
      } catch (error) {
        console.error("Error in site query:", error);
        toast.error("Failed to load site details");
        throw error;
      }
    }
  });
};
