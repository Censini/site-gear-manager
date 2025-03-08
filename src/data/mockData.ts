import { DashboardStats } from "@/types/types";

// Helper function to generate random data (example)
function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const mockDashboardStats: DashboardStats = {
  totalEquipment: 42,
  activeEquipment: 35,
  totalSites: 8,
  totalConnections: 15,
  sitesWithIssues: 2,
  equipmentByType: {
    server: 8,
    workstation: 15,
    printer: 5,
    switch: 4,
    router: 3,
    wifi: 3,
    hub: 1,
    other: 3
  },
  equipmentByStatus: {
    active: 35,
    inactive: 2,
    maintenance: 2,
    failure: 1,
    decommissioned: 0,
    unknown: 2
  },
  recentActivity: [
    {
      id: "act1",
      type: "equipment",
      name: "Serveur principal",
      date: "2024-01-15T09:23:45",
      action: "Ajouté"
    },
    {
      id: "act2",
      type: "site",
      name: "Agence Paris",
      date: "2024-01-14T14:34:12",
      action: "Modifié"
    },
    {
      id: "act3",
      type: "connection",
      name: "Fibre Siège",
      date: "2024-01-13T08:12:33",
      action: "Modifié"
    }
  ]
};
