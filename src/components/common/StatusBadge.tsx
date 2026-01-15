import { cn } from "../../lib/utils";
import type { RFP } from "../../types";


interface StatusBadgeProps {
  status: RFP['status'];
  className?: string;
}

const statusConfig = {
  draft: {
    label: 'Draft',
    className: 'bg-muted text-muted-foreground',
  },
  sent: {
    label: 'Sent',
    className: 'bg-accent/10 text-accent',
  },
  completed: {
    label: 'Completed',
    className: 'bg-success/10 text-success',
  },
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
};
