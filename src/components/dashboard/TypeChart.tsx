
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
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

const TypeChart = ({ stats }: TypeChartProps) => {
  const data = Object.entries(stats.equipmentByType).map(([key, value]) => ({
    name: TYPE_NAMES[key as keyof typeof TYPE_NAMES],
    value
  })).filter(item => item.value > 0);

  return (
    <Card className="h-full">
      <CardHeader>
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
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" />
              <Tooltip 
                formatter={(value) => [`${value} equipments`, ""]}
              />
              <Bar dataKey="value" fill="#4f46e5" barSize={20} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TypeChart;
