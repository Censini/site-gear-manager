
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStats } from "@/types/types";

interface StatusChartProps {
  stats: DashboardStats;
}

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#94a3b8"];
const STATUS_NAMES = {
  active: "Active",
  maintenance: "Maintenance",
  failure: "Failure",
  unknown: "Unknown"
};

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Only show label for segments with enough percentage
  if (percent < 0.05) return null;

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {`${name} ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const StatusChart = ({ stats }: StatusChartProps) => {
  const data = Object.entries(stats.equipmentByStatus).map(([key, value]) => ({
    name: STATUS_NAMES[key as keyof typeof STATUS_NAMES],
    value
  })).filter(item => item.value > 0);

  return (
    <Card className="h-full overflow-hidden dark:border-gray-800">
      <CardHeader className="pb-2">
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
                labelLine={false}
                label={<CustomLabel />}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value} equipments`, ""]}
                contentStyle={{
                  backgroundColor: 'rgba(23, 23, 23, 0.8)',
                  borderRadius: '8px',
                  border: 'none',
                  padding: '8px 12px',
                  color: 'white',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                align="center"
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span className="text-xs">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusChart;
