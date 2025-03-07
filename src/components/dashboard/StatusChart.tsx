
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStats } from "@/types/types";

interface StatusChartProps {
  stats: DashboardStats;
}

const COLORS = ["#22c55e", "#f59e0b", "#ef4444", "#94a3b8"];
const STATUS_NAMES = {
  active: "Active",
  maintenance: "Maintenance",
  failure: "Failure",
  unknown: "Unknown"
};

const StatusChart = ({ stats }: StatusChartProps) => {
  const data = Object.entries(stats.equipmentByStatus).map(([key, value]) => ({
    name: STATUS_NAMES[key as keyof typeof STATUS_NAMES],
    value
  })).filter(item => item.value > 0);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Equipment Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value} equipments`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusChart;
