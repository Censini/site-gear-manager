
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import EquipmentTable from "@/components/equipment/EquipmentTable";
import EquipmentFilters from "@/components/equipment/EquipmentFilters";
import { Loader2 } from "lucide-react";
import { Equipment } from "@/types/types";
import { useNavigate } from "react-router-dom";
import { useEquipmentSearch } from "@/hooks/useEquipmentSearch";

const EquipmentPage = () => {
  const navigate = useNavigate();

  const { data: equipmentList, error, isLoading: isQueryLoading } = useQuery({
    queryKey: ["equipment"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("equipment")
        .select("*");
      
      if (error) {
        console.error("Erreur lors de la récupération des équipements:", error);
        throw error;
      }
      
      console.log("Équipements récupérés:", data);
      
      // Transform snake_case database fields to camelCase for our frontend types
      return (data || []).map(item => ({
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
        netbios: item.netbios || "",
        configMarkdown: item.config_markdown || ""
      })) as Equipment[];
    }
  });

  const { 
    searchTerm, 
    setSearchTerm, 
    statusFilter, 
    setStatusFilter, 
    typeFilter, 
    setTypeFilter, 
    filteredEquipment 
  } = useEquipmentSearch(equipmentList || []);

  const handleAddEquipment = () => {
    navigate("/equipment/add");
  };

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
        <h1 className="text-3xl font-bold tracking-tight">Inventaire des équipements</h1>
        <div className="p-4 border border-red-300 bg-red-50 rounded-md text-red-800">
          Erreur lors du chargement des équipements : {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Inventaire des équipements</h1>
      
      <EquipmentFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        onAddEquipment={handleAddEquipment}
      />
      
      <EquipmentTable 
        equipmentList={filteredEquipment} 
        onAddEquipment={handleAddEquipment}
      />
    </div>
  );
};

export default EquipmentPage;
