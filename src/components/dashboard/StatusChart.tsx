import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStats } from "@/types/types";

interface StatusChartProps {
  stats: DashboardStats;
}

const COLORS = ["#00D2C6", "#7557FF", "#FF7066", "#94a3b8"];
const STATUS_NAMES = {
  active: "Active",
  maintenance: "Maintenance", 
  failure: "Échec",
  unknown: "Inconnu"
};

const StatusChart = ({ stats }: StatusChartProps) => {
  const data = Object.entries(stats.equipmentByStatus).map(([key, value]) => ({
    name: STATUS_NAMES[key as keyof typeof STATUS_NAMES],
    value: Number(value) || 0
  })).filter(item => item.value > 0);

  // Calculate percentage for display
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const percentage = Math.round((data.find(item => item.name === "Active")?.value || 0) / total * 100);

  return (
    <Card className="modern-chart h-full overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">État de l'équipement</CardTitle>
          <div className="circular-progress w-12 h-12">
            <svg className="w-12 h-12">
              <circle
                className="text-accent/20"
                strokeWidth="5"
                stroke="currentColor"
                fill="transparent"
                r="20"
                cx="24"
                cy="24"
              />
              <circle
                className="text-primary"
                strokeWidth="5"
                strokeDasharray={`${2 * Math.PI * 20 * percentage / 100} ${2 * Math.PI * 20}`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="20"
                cx="24"
                cy="24"
              />
            </svg>
            <span className="progress-text text-sm">{percentage}%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={65}
                fill="#8884d8"
                paddingAngle={4}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
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
              <Legend 
                verticalAlign="bottom" 
                align="center"
                iconType="circle"
                iconSize={6}
                formatter={(value) => (
                  <span className="text-xs">{value}</span>
                )}
                wrapperStyle={{ paddingTop: 20 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusChart;
