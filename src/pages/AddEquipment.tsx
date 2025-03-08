
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import EquipmentForm from "@/components/equipment/EquipmentForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Equipment } from "@/types/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AddEquipment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  
  // Get site ID from URL query parameter
  const queryParams = new URLSearchParams(location.search);
  const siteId = queryParams.get("siteId") || "";

  const addEquipment = useMutation({
    mutationFn: async (data: Omit<Equipment, "id">) => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data: result, error } = await supabase
        .from("equipment")
        .insert({
          name: data.name,
          type: data.type,
          model: data.model,
          manufacturer: data.manufacturer,
          ip_address: data.ipAddress || null,
          mac_address: data.macAddress || null,
          firmware: data.firmware || null,
          install_date: data.installDate || null,
          status: data.status,
          site_id: data.siteId || null,
          netbios: data.netbios || null,
          user_id: user?.id
        })
        .select()
        .single();

      if (error) {
        console.error("Error adding equipment:", error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      toast.success("Equipment added successfully");
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
    },
    onError: (error) => {
      console.error("Error in add equipment mutation:", error);
      toast.error("Failed to add equipment");
    },
  });

  const initialValues = {
    name: "",
    siteId: siteId,
    type: "router" as const,
    model: "",
    manufacturer: "",
    ipAddress: "",
    macAddress: "",
    firmware: "",
    installDate: "",
    status: "active" as const,
    netbios: ""
  };

  const handleSubmit = async (data: Omit<Equipment, "id">) => {
    await addEquipment.mutateAsync(data);
    // Navigate back to site detail if siteId is provided
    if (siteId) {
      navigate(`/sites/${siteId}`);
    } else {
      navigate("/equipment");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add Equipment</h1>
        <p className="text-muted-foreground">
          Add a new piece of equipment to your inventory
        </p>
      </div>

      <EquipmentForm 
        onSubmit={handleSubmit}
        initialValues={initialValues}
        isSubmitting={addEquipment.isPending}
        onCancel={() => siteId ? navigate(`/sites/${siteId}`) : navigate("/equipment")}
      />
    </div>
  );
};

export default AddEquipment;
