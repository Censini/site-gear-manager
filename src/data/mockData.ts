
import { Equipment, NetworkConnection, Site, IPRange, DashboardStats } from "../types/types";

export const sites: Site[] = [
  {
    id: "1",
    name: "Paris HQ",
    location: "Paris",
    country: "France",
    address: "123 Avenue des Champs-Élysées, 75008 Paris",
    contactName: "Jean Dupont",
    contactEmail: "jean.dupont@example.com",
    contactPhone: "+33 1 23 45 67 89"
  },
  {
    id: "2",
    name: "Berlin Office",
    location: "Berlin",
    country: "Germany",
    address: "Unter den Linden 77, 10117 Berlin",
    contactName: "Hans Schmidt",
    contactEmail: "hans.schmidt@example.com",
    contactPhone: "+49 30 1234567"
  },
  {
    id: "3",
    name: "Madrid Branch",
    location: "Madrid",
    country: "Spain",
    address: "Calle Gran Vía 41, 28013 Madrid",
    contactName: "Carlos Rodríguez",
    contactEmail: "carlos.rodriguez@example.com",
    contactPhone: "+34 91 123 45 67"
  },
  {
    id: "4",
    name: "Rome Data Center",
    location: "Rome",
    country: "Italy",
    address: "Via del Corso 303, 00186 Roma",
    contactName: "Marco Rossi",
    contactEmail: "marco.rossi@example.com",
    contactPhone: "+39 06 1234567"
  },
  {
    id: "5",
    name: "London Office",
    location: "London",
    country: "United Kingdom",
    address: "10 Downing Street, London SW1A 2AA",
    contactName: "Elizabeth Smith",
    contactEmail: "elizabeth.smith@example.com",
    contactPhone: "+44 20 7123 4567"
  }
];

export const equipment: Equipment[] = [
  {
    id: "1",
    name: "rtr-paris-01",
    siteId: "1",
    type: "router",
    model: "Cisco ASR 9000",
    manufacturer: "Cisco Systems, Inc",
    ipAddress: "192.168.1.1",
    macAddress: "00:1A:2B:3C:4D:5E",
    firmware: "IOS XR 7.3.2",
    installDate: "2022-05-15",
    status: "active"
  },
  {
    id: "2",
    name: "sw-paris-01",
    siteId: "1",
    type: "switch",
    model: "Catalyst 9300",
    manufacturer: "Cisco Systems, Inc",
    ipAddress: "192.168.1.2",
    macAddress: "00:1A:2B:3C:4D:5F",
    firmware: "IOS-XE 17.3.3",
    installDate: "2022-05-16",
    status: "active"
  },
  {
    id: "3",
    name: "wifi-paris-01",
    siteId: "1",
    type: "wifi",
    model: "Aironet 3800",
    manufacturer: "Cisco Systems, Inc",
    ipAddress: "192.168.1.3",
    macAddress: "00:1A:2B:3C:4D:60",
    firmware: "AIR-AP3802I-E-K9 8.10.151.0",
    installDate: "2022-05-17",
    status: "maintenance"
  },
  {
    id: "4",
    name: "print-paris-01",
    siteId: "1",
    type: "printer",
    model: "LaserJet Enterprise M507",
    manufacturer: "HP",
    ipAddress: "192.168.1.4",
    macAddress: "00:1A:2B:3C:4D:61",
    firmware: "2.92.05",
    installDate: "2022-06-01",
    status: "active"
  },
  {
    id: "5",
    name: "rtr-berlin-01",
    siteId: "2",
    type: "router",
    model: "Juniper MX480",
    manufacturer: "Juniper Networks",
    ipAddress: "192.168.2.1",
    macAddress: "00:1A:2B:3C:4E:5E",
    firmware: "Junos 20.4R2",
    installDate: "2022-06-15",
    status: "active"
  },
  {
    id: "6",
    name: "sw-berlin-01",
    siteId: "2",
    type: "switch",
    model: "EX4300",
    manufacturer: "Juniper Networks",
    ipAddress: "192.168.2.2",
    macAddress: "00:1A:2B:3C:4E:5F",
    firmware: "Junos 21.2R2",
    installDate: "2022-06-16",
    status: "failure"
  },
  {
    id: "7",
    name: "rtr-madrid-01",
    siteId: "3",
    type: "router",
    model: "FortiGate 100F",
    manufacturer: "Fortinet",
    ipAddress: "192.168.3.1",
    macAddress: "00:1A:2B:3C:4F:5E",
    firmware: "FortiOS 7.0.5",
    installDate: "2022-07-01",
    status: "active"
  },
  {
    id: "8",
    name: "sw-madrid-01",
    siteId: "3",
    type: "switch",
    model: "FortiSwitch 124F",
    manufacturer: "Fortinet",
    ipAddress: "192.168.3.2",
    macAddress: "00:1A:2B:3C:4F:5F",
    firmware: "6.4.6",
    installDate: "2022-07-02",
    status: "active"
  },
  {
    id: "9",
    name: "rtr-rome-01",
    siteId: "4",
    type: "router",
    model: "ISR 4451",
    manufacturer: "Cisco Systems, Inc",
    ipAddress: "192.168.4.1",
    macAddress: "00:1A:2B:3C:5D:5E",
    firmware: "IOS-XE 17.6.1",
    installDate: "2022-07-15",
    status: "active"
  },
  {
    id: "10",
    name: "sw-rome-01",
    siteId: "4",
    type: "switch",
    model: "Catalyst 9200",
    manufacturer: "Cisco Systems, Inc",
    ipAddress: "192.168.4.2",
    macAddress: "00:1A:2B:3C:5D:5F",
    firmware: "IOS-XE 17.5.1",
    installDate: "2022-07-16",
    status: "maintenance"
  },
  {
    id: "11",
    name: "rtr-london-01",
    siteId: "5",
    type: "router",
    model: "ASR 1001-X",
    manufacturer: "Cisco Systems, Inc",
    ipAddress: "192.168.5.1",
    macAddress: "00:1A:2B:3C:6D:5E",
    firmware: "IOS-XE 17.3.3",
    installDate: "2022-08-01",
    status: "active"
  },
  {
    id: "12",
    name: "sw-london-01",
    siteId: "5",
    type: "switch",
    model: "Catalyst 9300",
    manufacturer: "Cisco Systems, Inc",
    ipAddress: "192.168.5.2",
    macAddress: "00:1A:2B:3C:6D:5F",
    firmware: "IOS-XE 17.3.3",
    installDate: "2022-08-02",
    status: "active"
  },
  {
    id: "13",
    name: "srv-paris-01",
    siteId: "1",
    type: "server",
    model: "PowerEdge R740",
    manufacturer: "Dell",
    ipAddress: "192.168.1.10",
    macAddress: "00:1A:2B:3C:7D:5E",
    firmware: "BIOS 2.12.2",
    installDate: "2022-05-20",
    status: "active",
    netbios: "SRVPARIS01"
  },
  {
    id: "14",
    name: "ssamfr34",
    siteId: "1",
    type: "switch",
    model: "CBS350-16FP-2G",
    manufacturer: "Cisco Systems, Inc",
    ipAddress: "192.168.1.36",
    macAddress: "ECC018FFFEB",
    firmware: "2.5.5.47",
    installDate: "2021-12-10",
    status: "active",
    netbios: "WORKGROUP"
  },
  {
    id: "15",
    name: "ssamhar10",
    siteId: "2",
    type: "switch",
    model: "CBS-350-8G",
    manufacturer: "Cisco Systems, Inc",
    ipAddress: "192.168.128.10",
    macAddress: "6c29d20302be",
    firmware: "2.5.5.47",
    installDate: "2022-01-15",
    status: "active",
    netbios: "WORKGROUP"
  }
];

export const networkConnections: NetworkConnection[] = [
  {
    id: "1",
    siteId: "1",
    type: "fiber",
    provider: "Orange Business",
    contractRef: "OBF-123456",
    bandwidth: "1 Gbps",
    sla: "99.9%, 4h response",
    status: "active"
  },
  {
    id: "2",
    siteId: "2",
    type: "fiber",
    provider: "Deutsche Telekom",
    contractRef: "DT-789012",
    bandwidth: "500 Mbps",
    sla: "99.5%, 8h response",
    status: "active"
  },
  {
    id: "3",
    siteId: "3",
    type: "fiber",
    provider: "Telefónica",
    contractRef: "TEL-345678",
    bandwidth: "200 Mbps",
    sla: "99.5%, 8h response",
    status: "active"
  },
  {
    id: "4",
    siteId: "4",
    type: "fiber",
    provider: "Telecom Italia",
    contractRef: "TI-901234",
    bandwidth: "500 Mbps",
    sla: "99.5%, 4h response",
    status: "maintenance"
  },
  {
    id: "5",
    siteId: "5",
    type: "fiber",
    provider: "BT Business",
    contractRef: "BT-567890",
    bandwidth: "1 Gbps",
    sla: "99.9%, 4h response",
    status: "active"
  },
  {
    id: "6",
    siteId: "1",
    type: "adsl",
    provider: "SFR Business",
    contractRef: "SFR-112233",
    bandwidth: "100 Mbps",
    sla: "99%, 24h response",
    status: "active"
  }
];

export const ipRanges: IPRange[] = [
  {
    id: "1",
    siteId: "1",
    range: "192.168.1.0/24",
    description: "Paris office network",
    isReserved: false,
    dhcpScope: true
  },
  {
    id: "2",
    siteId: "1",
    range: "192.168.10.0/24",
    description: "Paris server network",
    isReserved: true,
    dhcpScope: false
  },
  {
    id: "3",
    siteId: "2",
    range: "192.168.2.0/24",
    description: "Berlin office network",
    isReserved: false,
    dhcpScope: true
  },
  {
    id: "4",
    siteId: "3",
    range: "192.168.3.0/24",
    description: "Madrid office network",
    isReserved: false,
    dhcpScope: true
  },
  {
    id: "5",
    siteId: "4",
    range: "192.168.4.0/24",
    description: "Rome office network",
    isReserved: false,
    dhcpScope: true
  },
  {
    id: "6",
    siteId: "5",
    range: "192.168.5.0/24",
    description: "London office network",
    isReserved: false,
    dhcpScope: true
  }
];

export const dashboardStats: DashboardStats = {
  totalSites: sites.length,
  totalEquipment: equipment.length,
  equipmentByStatus: {
    active: equipment.filter(e => e.status === "active").length,
    maintenance: equipment.filter(e => e.status === "maintenance").length,
    failure: equipment.filter(e => e.status === "failure").length,
    unknown: equipment.filter(e => e.status === "unknown").length
  },
  equipmentByType: {
    router: equipment.filter(e => e.type === "router").length,
    switch: equipment.filter(e => e.type === "switch").length,
    hub: equipment.filter(e => e.type === "hub").length,
    wifi: equipment.filter(e => e.type === "wifi").length,
    server: equipment.filter(e => e.type === "server").length,
    printer: equipment.filter(e => e.type === "printer").length,
    other: equipment.filter(e => e.type === "other").length
  },
  sitesWithIssues: sites.filter(s => 
    equipment.some(e => e.siteId === s.id && (e.status === "failure" || e.status === "maintenance"))
  ).length
};

export const getSiteById = (id: string): Site | undefined => {
  return sites.find(site => site.id === id);
};

export const getEquipmentById = (id: string): Equipment | undefined => {
  return equipment.find(item => item.id === id);
};

export const getEquipmentBySiteId = (siteId: string): Equipment[] => {
  return equipment.filter(item => item.siteId === siteId);
};

export const getNetworkConnectionsBySiteId = (siteId: string): NetworkConnection[] => {
  return networkConnections.filter(connection => connection.siteId === siteId);
};

export const getIPRangesBySiteId = (siteId: string): IPRange[] => {
  return ipRanges.filter(range => range.siteId === siteId);
};
