
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  className?: string;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatsCard = ({ title, value, icon, className, subtitle, trend }: StatsCardProps) => {
  return (
    <Card className={cn("dashboard-stats-card", className)}>
      <div className="flex flex-col items-center justify-center text-center w-full h-full">
        <div className="flex items-center justify-center mb-2">
          <div className="p-2 rounded-full bg-primary/10">{icon}</div>
        </div>
        
        <div className="dashboard-stat-value">{value}</div>
        
        <div className="dashboard-stat-label">{title}</div>
        
        {subtitle && <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>}
        
        {trend && (
          <p
            className={cn(
              "text-xs font-medium flex items-center space-x-1 mt-2",
              trend.isPositive ? "text-emerald-400" : "text-rose-400"
            )}
          >
            <span>{trend.isPositive ? "↑" : "↓"}</span>
            <span>{trend.value}% depuis le mois dernier</span>
          </p>
        )}
      </div>
    </Card>
  );
};

export default StatsCard;
