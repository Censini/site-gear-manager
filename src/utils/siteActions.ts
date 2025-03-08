
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const deleteSite = async (id: string | undefined) => {
  if (!id) return false;
  
  try {
    const { error } = await supabase
      .from("sites")
      .delete()
      .eq("id", id);
    
    if (error) {
      console.error("Error deleting site:", error);
      toast.error("Failed to delete site");
      return false;
    }
    
    toast.success("Site deleted successfully");
    return true;
  } catch (error) {
    console.error("Error in delete operation:", error);
    toast.error("An error occurred while deleting the site");
    return false;
  }
};
