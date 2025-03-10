import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import EquipmentTable from "@/components/equipment/EquipmentTable";
import EquipmentFilters from "@/components/equipment/EquipmentFilters";
import { Loader2 } from "lucide-react";
import { Equipment } from "@/types/types";
import { useNavigate } from "react-router-dom";
import { useEquipmentSearch } from "@/hooks/useEquipmentSearch";

// Define sorting types
type SortColumn = keyof Equipment;
type SortDirection = 'asc' | 'desc';

const EquipmentPage = () => {
  const navigate = useNavigate();

  // Add state for sorting
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const { data: equipmentList, error, isLoading: isQueryLoading } = useQuery({
    queryKey: ["equipment"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("equipment")
        .select("*, config_markdown");
      
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

  // Sorting function
  const sortedEquipment = () => {
    if (!sortColumn) return filteredEquipment;

    return [...filteredEquipment].sort((a, b) => {
      const valueA = a[sortColumn];
      const valueB = b[sortColumn];

      // Handle different types of sorting
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sortDirection === 'asc'
          ? valueA - valueB
          : valueB - valueA;
      }

      // Fallback for other types or when values are different types
      return 0;
    });
  };

  // Sorting handler
  const handleSort = (column: SortColumn) => {
    // If clicking the same column, toggle direction
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // If clicking a new column, default to ascending
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

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
        equipmentList={sortedEquipment()} 
        onAddEquipment={handleAddEquipment}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
      />
    </div>
  );
};

export default EquipmentPage;