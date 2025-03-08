
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import EquipmentForm from "@/components/equipment/EquipmentForm";
import { Equipment } from "@/types/types";

const EditEquipment = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: equipment, isLoading, error } = useQuery({
    queryKey: ["equipment", id],
    queryFn: async () => {
      if (!id) throw new Error("ID d'équipement non fourni");
      
      const { data, error } = await supabase
        .from("equipment")
        .select("*, config_markdown")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        name: data.name,
        siteId: data.site_id || "",
        type: data.type,
        model: data.model,
        manufacturer: data.manufacturer,
        ipAddress: data.ip_address || "",
        macAddress: data.mac_address || "",
        firmware: data.firmware || "",
        installDate: data.install_date || "",
        status: data.status,
        netbios: data.netbios || "",
        configMarkdown: data.config_markdown || ""
      } as Equipment;
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !equipment) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-bold">Équipement non trouvé</h2>
        <p className="text-muted-foreground mb-4">L'équipement que vous recherchez n'existe pas.</p>
        <Button onClick={() => navigate("/equipment")}>Retour à la liste des équipements</Button>
      </div>
    );
  }

  const initialData = {
    name: equipment.name,
    type: equipment.type,
    model: equipment.model,
    manufacturer: equipment.manufacturer,
    ipAddress: equipment.ipAddress,
    macAddress: equipment.macAddress,
    firmware: equipment.firmware,
    status: equipment.status,
    netbios: equipment.netbios || "",
    siteId: equipment.siteId,
    configMarkdown: equipment.configMarkdown || ""
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Modifier l'équipement</h1>
      </div>

      <EquipmentForm 
        initialData={initialData} 
        mode="edit" 
        equipmentId={id}
      />
    </div>
  );
};

export default EditEquipment;
