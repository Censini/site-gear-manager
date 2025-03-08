
import { useGetEquipment } from "./useGetEquipment";
import { useGetSites } from "./useGetSites";
import { DashboardStats } from "@/types/types";

export const useDashboardStats = () => {
  const { data: equipment = [], isLoading: isLoadingEquipment } = useGetEquipment();
  const { data: sites = [], isLoading: isLoadingSites } = useGetSites();
  
  const isLoading = isLoadingEquipment || isLoadingSites;
  
  // Calculate the dashboard stats based on the fetched data
  const calculateStats = (): DashboardStats => {
    const equipmentByStatus = {
      active: equipment.filter(e => e.status === "active").length,
      maintenance: equipment.filter(e => e.status === "maintenance").length,
      failure: equipment.filter(e => e.status === "failure").length,
      unknown: equipment.filter(e => e.status === "unknown").length
    };
    
    const equipmentByType = {
      router: equipment.filter(e => e.type === "router").length,
      switch: equipment.filter(e => e.type === "switch").length,
      hub: equipment.filter(e => e.type === "hub").length,
      wifi: equipment.filter(e => e.type === "wifi").length,
      server: equipment.filter(e => e.type === "server").length,
      printer: equipment.filter(e => e.type === "printer").length,
      other: equipment.filter(e => !["router", "switch", "hub", "wifi", "server", "printer"].includes(e.type)).length
    };
    
    const sitesWithIssues = sites.filter(s => 
      equipment.some(e => 
        e.site_id === s.id && 
        (e.status === "failure" || e.status === "maintenance")
      )
    ).length;
    
    return {
      totalSites: sites.length,
      totalEquipment: equipment.length,
      equipmentByStatus,
      equipmentByType,
      sitesWithIssues
    };
  };
  
  const stats = isLoading ? null : calculateStats();
  
  return {
    stats,
    isLoading
  };
};
