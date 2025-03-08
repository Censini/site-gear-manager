
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
    <Card className={cn("stat-card overflow-hidden transition-all border-0", className)}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <div className="p-2 rounded-full bg-accent/40">{icon}</div>
        </div>
        
        <div className="space-y-1">
          <h3 className="text-3xl font-bold">{value}</h3>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        
        {trend && (
          <p
            className={cn(
              "text-xs font-medium flex items-center space-x-1",
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
