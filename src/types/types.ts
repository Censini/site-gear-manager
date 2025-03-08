// Equipment Types
export type EquipmentType = 'server' | 'workstation' | 'printer' | 'switch' | 'router' | 'wifi' | 'other';
export type EquipmentStatus = 'active' | 'inactive' | 'maintenance' | 'decommissioned';

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

export type NetworkConnectionType = 'internet' | 'mpls' | 'vpn' | 'other';
export type NetworkConnectionStatus = 'active' | 'inactive' | 'planned' | 'decommissioned';

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
