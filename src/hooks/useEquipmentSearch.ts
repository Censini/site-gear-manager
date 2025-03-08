
import { useState, useMemo } from "react";
import { Equipment, EquipmentType, Status } from "@/types/types";

export const useEquipmentSearch = (equipmentList: Equipment[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [typeFilter, setTypeFilter] = useState<EquipmentType | "all">("all");
  
  const filteredEquipment = useMemo(() => {
    if (!equipmentList || !Array.isArray(equipmentList)) return [];
    
    return equipmentList.filter((item) => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.ipAddress && item.ipAddress.toLowerCase().includes(searchTerm.toLowerCase())) ||
        item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.model.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      const matchesType = typeFilter === "all" || item.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
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
