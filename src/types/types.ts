
export type Status = "active" | "maintenance" | "failure" | "unknown";

export interface Site {
  id: string;
  name: string;
  location: string;
  country: string;
  address: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

export interface NetworkConnection {
  id: string;
  siteId: string;
  type: "fiber" | "adsl" | "sdsl" | "satellite" | "other";
  provider: string;
  contractRef: string;
  bandwidth: string;
  sla: string;
  status: Status;
  siteName?: string;
}

export interface Equipment {
  id: string;
  name: string;
  siteId: string;
  type: EquipmentType;
  model: string;
  manufacturer: string;
  ipAddress: string;
  macAddress: string;
  firmware: string;
  installDate: string; // YYYY-MM-DD
  status: Status;
  netbios?: string;
}

export type EquipmentType = 
  | "router" 
  | "switch" 
  | "hub" 
  | "wifi" 
  | "server" 
  | "printer" 
  | "other";

export interface IPRange {
  id: string;
  siteId: string;
  range: string;
  description: string;
  isReserved: boolean;
  dhcpScope: boolean;
  siteName?: string;
}

export interface DashboardStats {
  totalSites: number;
  totalEquipment: number;
  equipmentByStatus: Record<Status, number>;
  equipmentByType: Record<EquipmentType, number>;
  sitesWithIssues: number;
}
