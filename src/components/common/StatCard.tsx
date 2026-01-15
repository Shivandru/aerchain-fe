import type { ReactNode } from "react";
import { cn } from "../../lib/utils";


interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  trend?: {
    value: string;
    positive: boolean;
  };
  className?: string;
}

export const StatCard = ({ icon, label, value, trend, className }: StatCardProps) => {
  return (
    <div className={cn(
      'bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow duration-300',
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <div className="text-primary">{icon}</div>
        </div>
        {trend && (
          <span className={cn(
            'text-xs font-medium px-2 py-1 rounded-full',
            trend.positive ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
          )}>
            {trend.value}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-3xl font-semibold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground mt-1">{label}</p>
      </div>
    </div>
  );
};
