
import { Server, Building, Network, AlertTriangle, Globe, Wifi } from "lucide-react";
import { useEffect, useState } from "react";
import StatsCard from "@/components/cards/StatsCard";
import StatusChart from "@/components/dashboard/StatusChart";
import TypeChart from "@/components/dashboard/TypeChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatusBadge from "@/components/ui/StatusBadge";
import { supabase } from "@/integrations/supabase/client";
import { Status, Equipment, Site, DashboardStats, EquipmentStatus } from "@/types/types";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const [equipment, setEquipment] = useState<any[]>([]);
  const [sites, setSites] = useState<any[]>([]);
  const [connections, setConnections] = useState<any[]>([]);
  const [providers, setProviders] = useState<{name: string, count: number}[]>([]);
  const [siteContacts, setSiteContacts] = useState<{name: string, phone: string, site: string}[]>([]);
  const [showAllContacts, setShowAllContacts] = useState(false);
  const [showOnlyIssueContacts, setShowOnlyIssueContacts] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState<DashboardStats>({
    totalSites: 0,
    totalEquipment: 0,
    activeEquipment: 0,
    totalConnections: 0,
    sitesWithIssues: 0,
    equipmentByStatus: {
      active: 0,
      maintenance: 0,
      failure: 0,
      unknown: 0,
      inactive: 0,
      decommissioned: 0
    },
    equipmentByType: {
      router: 0,
      switch: 0,
      hub: 0,
      wifi: 0,
      server: 0,
      printer: 0,
      other: 0
    }
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch equipment
        const { data: equipmentData, error: equipmentError } = await supabase
          .from('equipment')
          .select('*');
        
        if (equipmentError) throw equipmentError;
        
        // Fetch sites
        const { data: sitesData, error: sitesError } = await supabase
          .from('sites')
          .select('*');
        
        if (sitesError) throw sitesError;
        
        // Fetch connections
        const { data: connectionsData, error: connectionsError } = await supabase
          .from('network_connections')
          .select('*');
          
        if (connectionsError) throw connectionsError;
        
        setEquipment(equipmentData || []);
        setSites(sitesData || []);
        setConnections(connectionsData || []);
        
        // Extract contacts information from sites
        const contactsList = sitesData
          ?.filter(site => site.contact_name && site.contact_phone)
          .map(site => ({
            name: site.contact_name || '',
            phone: site.contact_phone || '',
            site: site.name
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
          
        setSiteContacts(contactsList || []);
        
        // Calculate providers statistics
        const providerCounts = connectionsData?.reduce((acc: Record<string, number>, conn: any) => {
          const provider = conn.provider || 'Inconnu';
          acc[provider] = (acc[provider] || 0) + 1;
          return acc;
        }, {});
        
        const providersArray = Object.entries(providerCounts || {})
          .map(([name, count]) => ({ name, count: count as number }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
          
        setProviders(providersArray);
        
        // Calculate statistics
        const totalEquipment = equipmentData?.length || 0;
        const totalSites = sitesData?.length || 0;
        const totalConnections = connectionsData?.length || 0;
        
        const equipmentByStatus: Record<EquipmentStatus, number> = {
          active: 0,
          maintenance: 0,
          failure: 0,
          unknown: 0,
          inactive: 0,
          decommissioned: 0
        };
        
        const equipmentByType: Record<string, number> = {
          router: 0,
          switch: 0,
          hub: 0,
          wifi: 0,
          server: 0,
          printer: 0,
          other: 0
        };
        
        let activeEquipment = 0;
        
        equipmentData?.forEach((item: any) => {
          // Count by status
          if (item.status in equipmentByStatus) {
            equipmentByStatus[item.status as EquipmentStatus]++;
            
            if (item.status === 'active') {
              activeEquipment++;
            }
          } else {
            equipmentByStatus.unknown++;
          }
          
          // Count by type
          if (item.type in equipmentByType) {
            equipmentByType[item.type]++;
          } else {
            equipmentByType.other++;
          }
        });
        
        // Calculate sites with issues
        const sitesWithIssuesCount = new Set(
          equipmentData
            ?.filter((item: any) => item.status === 'maintenance' || item.status === 'failure')
            .map((item: any) => item.site_id)
            .filter(Boolean)
        ).size;
        
        setStats({
          totalEquipment,
          activeEquipment,
          totalSites,
          totalConnections,
          equipmentByStatus,
          equipmentByType,
          sitesWithIssues: sitesWithIssuesCount
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Get equipment with issues (maintenance or failure)
  const equipmentWithIssues = equipment
    .filter((item) => item.status === "maintenance" || item.status === "failure")
    .slice(0, 5);

  const sitesWithConnectionIssuesIds = new Set(
    connections
      .filter((connection) => connection.status === "failure" || connection.status === "degraded" || connection.status === "maintenance")
      .map((connection) => connection.site_id)
      .filter(Boolean)
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Filtrez les contacts en fonction du filtre actif
  const filteredContacts = siteContacts
  .filter(contact => {
    // Filtrer par sites avec problèmes si nécessaire
    if (!showAllContacts) {
      const siteId = sites.find(site => site.name === contact.site)?.id;
      if (!siteId || !sitesWithConnectionIssuesIds.has(siteId)) {
        return false;
      }
    }
    
    // Filtrer par terme de recherche
    if (searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase();
      return (
        contact.name.toLowerCase().includes(searchLower) ||
        contact.phone.toLowerCase().includes(searchLower) ||
        contact.site.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  if (loading) {
    return <DashboardSkeleton />;
  }
  
  return (
    <div className="space-y-6">
      <h1 className="dashboard-title">Tableau de bord</h1>
      
      <div className="dashboard-stats">
        <StatsCard
          title="Total Équipements"
          value={stats.totalEquipment}
          icon={<Server className="h-6 w-6 text-primary" />}
        />
        <StatsCard
          title="Total Sites"
          value={stats.totalSites}
          icon={<Building className="h-6 w-6 text-primary" />}
        />
        <StatsCard
          title="Équipements Actifs"
          value={stats.activeEquipment}
          icon={<Network className="h-6 w-6 text-primary" />}
        />
        <StatsCard
          title="Sites avec Problèmes"
          value={stats.sitesWithIssues}
          icon={<AlertTriangle className="h-6 w-6 text-primary" />}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2 lg:col-span-1">
          <div className="dashboard-charts">
            <StatusChart stats={stats} />
            <TypeChart stats={stats} />
          </div>
        </div>
        
        <div className="space-y-6">
          <Card className="dashboard-table">
            <CardHeader>
              <CardTitle>Équipements avec Problèmes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Adresse IP</TableHead>
                    <TableHead>Site</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {equipmentWithIssues.length > 0 ? (
                    equipmentWithIssues.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.ip_address}</TableCell>
                        <TableCell>
                          {sites.find((site) => site.id === item.site_id)?.name || "Non assigné"}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={item.status} />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        Aucun équipement avec problèmes trouvé.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card className="dashboard-table">
        <CardHeader>
          <CardTitle>Fournisseurs de Liens Internet</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fournisseur</TableHead>
                <TableHead>Nombre de connexions</TableHead>
                <TableHead>Pourcentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {providers.length > 0 ? (
                providers.map((provider, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{provider.name}</TableCell>
                    <TableCell>{provider.count}</TableCell>
                    <TableCell>
                      {Math.round((provider.count / connections.length) * 100)}%
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    Aucun fournisseur de liens internet trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card className="dashboard-table">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle>Contacts</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={handleSearch}
                className="px-3 py-1 pr-8 border rounded-md text-sm w-full"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="allSitesFilter" 
                checked={showAllContacts}
                onChange={() => setShowAllContacts(!showAllContacts)}
                className="w-4 h-4"
              />
              <label htmlFor="issueFilter" className="text-sm whitespace-nowrap">
                Afficher tous les sites
              </label>
            </div>
          </div>
        </div>
      </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Site</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.length > 0 ? (
                (showAllContacts ? filteredContacts : filteredContacts.slice(0, 5)).map((contact, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{contact.name}</TableCell>
                    <TableCell>{contact.phone}</TableCell>
                    <TableCell>{contact.site}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    {showOnlyIssueContacts 
                      ? "Aucun contact pour les sites avec problèmes." 
                      : "Aucun contact trouvé."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {filteredContacts.length > 5 && (
            <div className="text-center mt-2">
              <button 
                className="px-3 py-1 text-sm border rounded-md hover:bg-gray-100"
                onClick={() => setShowAllContacts(!showAllContacts)}
              >
                {showAllContacts 
                  ? "Afficher moins" 
                  : `Voir tous les contacts (${filteredContacts.length})`
                }
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Loading skeleton for the dashboard
const DashboardSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="h-10 w-40" />
    
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {Array(4).fill(0).map((_, i) => (
        <Skeleton key={i} className="h-32" />
      ))}
    </div>

    <div className="grid gap-6 md:grid-cols-2">
      <Skeleton className="h-80" />
      <Skeleton className="h-80" />
    </div>

    <div className="grid gap-6 md:grid-cols-2">
      <Skeleton className="h-96" />
      <Skeleton className="h-96" />
    </div>
  </div>
);

export default Dashboard;
