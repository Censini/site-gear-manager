
// Equipment Types
export type EquipmentType = 'server' | 'workstation' | 'printer' | 'switch' | 'router' | 'wifi' | 'hub' | 'other';
export type EquipmentStatus = 'active' | 'inactive' | 'maintenance' | 'failure' | 'decommissioned' | 'unknown';

export interface Equipment {
  id: string;
  name: string;
  siteId: string;
  type: EquipmentType;
  model: string;
  manufacturer: string;
  ipAddress?: string;
  macAddress?: string;
  firmware?: string;
  installDate?: string;
  status: EquipmentStatus;
  netbios?: string;
  configMarkdown?: string;
}

export type Site = {
  id: string;
  name: string;
  location: string;
  country: string;
  address: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
};

export type NetworkConnectionType = 'internet' | 'mpls' | 'vpn' | 'fiber' | 'adsl' | 'sdsl' | 'satellite' | 'other';
export type NetworkConnectionStatus = 'active' | 'inactive' | 'planned' | 'maintenance' | 'failure' | 'unknown' | 'decommissioned';

export interface NetworkConnection {
  id: string;
  siteId: string;
  type: NetworkConnectionType;
  provider: string;
  contractRef?: string;
  bandwidth?: string;
  sla?: string;
  status: NetworkConnectionStatus;
}

export interface IPRange {
  id: string;
  siteId: string;
  range: string;
  description?: string;
  isReserved: boolean;
  dhcpScope: boolean;
}

// Alias Status for the old usage of the type
export type Status = EquipmentStatus;

// Interface for dashboard statistics
export interface DashboardStats {
  totalEquipment: number;
  activeEquipment: number;
  totalSites: number;
  totalConnections: number;
  sitesWithIssues: number;
  equipmentByType: Record<string, number>;
  equipmentByStatus: Record<EquipmentStatus, number>;
  recentActivity?: Array<{
    id: string;
    type: string;
    name: string;
    date: string;
    action: string;
  }>;
}
