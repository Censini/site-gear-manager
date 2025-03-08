
import { Server, Building, Network, AlertTriangle } from "lucide-react";
import StatsCard from "@/components/cards/StatsCard";
import StatusChart from "@/components/dashboard/StatusChart";
import TypeChart from "@/components/dashboard/TypeChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatusBadge from "@/components/ui/StatusBadge";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useGetEquipment } from "@/hooks/useGetEquipment";
import { useGetSites } from "@/hooks/useGetSites";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { stats, isLoading: isLoadingStats } = useDashboardStats();
  const { data: equipment = [], isLoading: isLoadingEquipment } = useGetEquipment();
  const { data: sites = [] } = useGetSites();
  
  // Get equipment with issues (maintenance or failure)
  const equipmentWithIssues = equipment
    .filter((item) => item.status === "maintenance" || item.status === "failure")
    .slice(0, 5);
  
  // Find site name by site_id
  const getSiteName = (site_id: string | null) => {
    if (!site_id) return "Unknown";
    const site = sites.find(site => site.id === site_id);
    return site ? site.name : "Unknown";
  };

  if (isLoadingStats || isLoadingEquipment) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[250px] w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[250px] w-full" />
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!stats) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p>Error loading dashboard data.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Equipment"
          value={stats.totalEquipment}
          icon={<Server className="h-6 w-6 text-primary" />}
        />
        <StatsCard
          title="Total Sites"
          value={stats.totalSites}
          icon={<Building className="h-6 w-6 text-primary" />}
        />
        <StatsCard
          title="Active Equipment"
          value={stats.equipmentByStatus.active}
          icon={<Network className="h-6 w-6 text-primary" />}
        />
        <StatsCard
          title="Sites with Issues"
          value={stats.sitesWithIssues}
          icon={<AlertTriangle className="h-6 w-6 text-primary" />}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <StatusChart stats={stats} />
        <TypeChart stats={stats} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Equipment with Issues</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipmentWithIssues.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.ip_address || 'N/A'}</TableCell>
                  <TableCell>{getSiteName(item.site_id)}</TableCell>
                  <TableCell>
                    <StatusBadge status={item.status} />
                  </TableCell>
                </TableRow>
              ))}
              {equipmentWithIssues.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No equipment with issues found.
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

export default Dashboard;
