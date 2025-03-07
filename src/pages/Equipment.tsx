
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import EquipmentTable from "@/components/equipment/EquipmentTable";
import { Loader2 } from "lucide-react";

const Equipment = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { data: equipmentList, error, isLoading: isQueryLoading } = useQuery({
    queryKey: ["equipment"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("equipment")
        .select("*");
      
      if (error) throw error;
      return data || [];
    }
  });

  if (isQueryLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Equipment Inventory</h1>
        <div className="p-4 border border-red-300 bg-red-50 rounded-md text-red-800">
          Error loading equipment: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Equipment Inventory</h1>
      <EquipmentTable equipmentList={equipmentList || []} />
    </div>
  );
};

export default Equipment;
