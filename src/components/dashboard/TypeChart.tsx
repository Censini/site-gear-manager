
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStats } from "@/types/types";

interface TypeChartProps {
  stats: DashboardStats;
}

const TYPE_NAMES = {
  router: "Routers",
  switch: "Switches",
  hub: "Hubs",
  wifi: "WiFi APs",
  server: "Servers",
  printer: "Printers",
  other: "Other"
};

const COLORS = [
  "#4f46e5", "#7c3aed", "#2563eb", "#0891b2", "#0d9488", "#059669", "#65a30d"
];

const TypeChart = ({ stats }: TypeChartProps) => {
  const data = Object.entries(stats.equipmentByType).map(([key, value]) => ({
    name: TYPE_NAMES[key as keyof typeof TYPE_NAMES],
    value
  })).filter(item => item.value > 0);

  return (
    <Card className="h-full overflow-hidden dark:border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle>Equipment by Type</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{
                top: 5,
                right: 30,
                left: 70,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} strokeOpacity={0.2} />
              <XAxis 
                type="number" 
                axisLine={{ strokeOpacity: 0.2 }}
                tickLine={{ strokeOpacity: 0.2 }}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                axisLine={{ strokeOpacity: 0.2 }}
                tickLine={{ strokeOpacity: 0 }}
                tick={{ fontSize: 12 }}
              />
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
              <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TypeChart;
