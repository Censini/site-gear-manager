
import { Server, Building, Network, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import StatsCard from "@/components/cards/StatsCard";
import StatusChart from "@/components/dashboard/StatusChart";
import TypeChart from "@/components/dashboard/TypeChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatusBadge from "@/components/ui/StatusBadge";
import { supabase } from "@/integrations/supabase/client";
import { Status, Equipment, Site, DashboardStats } from "@/types/types";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const [equipment, setEquipment] = useState<any[]>([]);
  const [sites, setSites] = useState<any[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalSites: 0,
    totalEquipment: 0,
    equipmentByStatus: {
      active: 0,
      maintenance: 0,
      failure: 0,
      unknown: 0
    },
    equipmentByType: {
      router: 0,
      switch: 0,
      hub: 0,
      wifi: 0,
      server: 0,
      printer: 0,
      other: 0
    },
    sitesWithIssues: 0
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
        console.log("Fetched equipment:", equipmentData);
        
        // Fetch sites
        const { data: sitesData, error: sitesError } = await supabase
          .from('sites')
          .select('*');
        
        if (sitesError) throw sitesError;
        
        setEquipment(equipmentData || []);
        setSites(sitesData || []);
        
        // Calculate statistics
        const totalEquipment = equipmentData?.length || 0;
        const totalSites = sitesData?.length || 0;
        
        const equipmentByStatus: Record<Status, number> = {
          active: 0,
          maintenance: 0,
          failure: 0,
          unknown: 0
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
        
        equipmentData?.forEach((item: any) => {
          // Count by status
          if (item.status in equipmentByStatus) {
            equipmentByStatus[item.status as Status]++;
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
          totalSites,
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
  
  if (loading) {
    return <DashboardSkeleton />;
  }
  
  return (
    <div className="space-y-6">
      <h1 className="dashboard-title">Tableau de bord</h1>
      
      <div className="dashboard-stats">
        <StatsCard
          title="Total Équipement"
          value={stats.totalEquipment}
          icon={<Server className="h-6 w-6 text-primary" />}
        />
        <StatsCard
          title="Total Sites"
          value={stats.totalSites}
          icon={<Building className="h-6 w-6 text-primary" />}
        />
        <StatsCard
          title="Équipement Actif"
          value={stats.equipmentByStatus.active}
          icon={<Network className="h-6 w-6 text-primary" />}
        />
        <StatsCard
          title="Sites avec Problèmes"
          value={stats.sitesWithIssues}
          icon={<AlertTriangle className="h-6 w-6 text-primary" />}
        />
      </div>

      <div className="dashboard-charts">
        <StatusChart stats={stats} />
        <TypeChart stats={stats} />
      </div>

      <Card className="dashboard-table">
        <CardHeader>
          <CardTitle>Équipement avec Problèmes</CardTitle>
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

    <Skeleton className="h-96" />
  </div>
);

export default Dashboard;
