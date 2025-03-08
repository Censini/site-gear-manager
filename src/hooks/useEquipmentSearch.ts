
import { useState, useMemo } from "react";
import { Equipment, EquipmentType, Status } from "@/types/types";

// Helper functions for filtering
const matchesSearchTerm = (item: Equipment, searchTerm: string): boolean => {
  const term = searchTerm.toLowerCase();
  return (
    item.name.toLowerCase().includes(term) ||
    (item.ipAddress && item.ipAddress.toLowerCase().includes(term)) ||
    item.manufacturer.toLowerCase().includes(term) ||
    item.model.toLowerCase().includes(term)
  );
};

const matchesStatusFilter = (item: Equipment, statusFilter: Status | "all"): boolean => {
  return statusFilter === "all" || item.status === statusFilter;
};

const matchesTypeFilter = (item: Equipment, typeFilter: EquipmentType | "all"): boolean => {
  return typeFilter === "all" || item.type === typeFilter;
};

export const useEquipmentSearch = (equipmentList: Equipment[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [typeFilter, setTypeFilter] = useState<EquipmentType | "all">("all");
  
  const filteredEquipment = useMemo(() => {
    if (!equipmentList || !Array.isArray(equipmentList)) return [];
    
    return equipmentList.filter((item) => 
      matchesSearchTerm(item, searchTerm) && 
      matchesStatusFilter(item, statusFilter) && 
      matchesTypeFilter(item, typeFilter)
    );
  }, [equipmentList, searchTerm, statusFilter, typeFilter]);
  
  return { 
    searchTerm, 
    setSearchTerm, 
    statusFilter, 
    setStatusFilter, 
    typeFilter, 
    setTypeFilter, 
    filteredEquipment 
  };
};
