
import { Server, Building, Network, AlertTriangle } from "lucide-react";
import { dashboardStats, equipment, sites } from "@/data/mockData";
import StatsCard from "@/components/cards/StatsCard";
import StatusChart from "@/components/dashboard/StatusChart";
import TypeChart from "@/components/dashboard/TypeChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatusBadge from "@/components/ui/StatusBadge";

const Dashboard = () => {
  // Get equipment with issues (maintenance or failure)
  const equipmentWithIssues = equipment
    .filter((item) => item.status === "maintenance" || item.status === "failure")
    .slice(0, 5);
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Equipment"
          value={dashboardStats.totalEquipment}
          icon={<Server className="h-6 w-6 text-primary" />}
        />
        <StatsCard
          title="Total Sites"
          value={dashboardStats.totalSites}
          icon={<Building className="h-6 w-6 text-primary" />}
        />
        <StatsCard
          title="Active Equipment"
          value={dashboardStats.equipmentByStatus.active}
          icon={<Network className="h-6 w-6 text-primary" />}
        />
        <StatsCard
          title="Sites with Issues"
          value={dashboardStats.sitesWithIssues}
          icon={<AlertTriangle className="h-6 w-6 text-primary" />}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <StatusChart stats={dashboardStats} />
        <TypeChart stats={dashboardStats} />
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
                  <TableCell>{item.ipAddress}</TableCell>
                  <TableCell>
                    {sites.find((site) => site.id === item.siteId)?.name}
                  </TableCell>
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
