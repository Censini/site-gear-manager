
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStats } from "@/types/types";

interface TypeChartProps {
  stats: DashboardStats;
}

const TYPE_NAMES = {
  router: "Routeurs",
  switch: "Switchs",
  hub: "Hubs",
  wifi: "Wifi APs",
  server: "Serveurs",
  printer: "Imprimantes",
  other: "Autres"
};

const COLORS = [
  "#00D2C6", "#7557FF", "#FF7066", "#4895EF", "#4CC9F0", "#4361EE", "#3F37C9"
];

const TypeChart = ({ stats }: TypeChartProps) => {
  const data = Object.entries(stats.equipmentByType).map(([key, value]) => ({
    name: TYPE_NAMES[key as keyof typeof TYPE_NAMES],
    value
  })).filter(item => item.value > 0);

  return (
    <Card className="modern-chart h-full overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Types d'équipement</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{
                top: 5,
                right: 20,
                left: 50,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} strokeOpacity={0.15} />
              <XAxis 
                type="number" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                tickMargin={8}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                tickMargin={8}
                width={100}
              />
              <Tooltip 
                formatter={(value) => [`${value} appareils`, ""]}
                contentStyle={{
                  backgroundColor: 'rgba(35, 38, 45, 0.9)',
                  borderRadius: '8px',
                  border: 'none',
                  padding: '8px 12px',
                  color: 'white',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)'
                }}
              />
              <Bar dataKey="value" barSize={12} radius={[0, 6, 6, 0]}>
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
