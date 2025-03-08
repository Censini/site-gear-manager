
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Equipment } from "@/types/types";
import { toast } from "sonner";

export const useGetSiteEquipment = (id: string | undefined) => {
  return useQuery({
    queryKey: ["equipment", "site", id],
    enabled: !!id,
    queryFn: async () => {
      console.log("Fetching equipment for site:", id);
      
      try {
        const { data, error } = await supabase
          .from("equipment")
          .select("*")
          .eq("site_id", id);
        
        if (error) {
          console.error("Error fetching equipment:", error);
          throw error;
        }
        
        console.log("Equipment data retrieved:", data);
        
        return data.map(item => ({
          id: item.id,
          name: item.name,
          siteId: item.site_id || "",
          type: item.type,
          model: item.model,
          manufacturer: item.manufacturer,
          ipAddress: item.ip_address || "",
          macAddress: item.mac_address || "",
          firmware: item.firmware || "",
          installDate: item.install_date || "",
          status: item.status,
          netbios: item.netbios || ""
        } as Equipment));
      } catch (error) {
        console.error("Error in equipment query:", error);
        toast.error("Failed to load equipment data");
        return [];
      }
    }
  });
};
