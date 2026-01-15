import { Link } from 'react-router-dom';
import { Calendar, DollarSign, Clock, ChevronRight } from 'lucide-react';
// import { RFP } from '@/types';
// import { StatusBadge } from '@/components/common/StatusBadge';
import { formatDistanceToNow } from 'date-fns';
import type { RFP } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

interface RFPCardProps {
  rfp: RFP;
}

export const RFPCard = ({ rfp }: RFPCardProps) => {
  return (
    <Link
      to={`/rfps/${rfp.id}`}
      className="block bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-4">
        <StatusBadge status={rfp.status} />
        <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
        {rfp.title}
      </h3>
      
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
        {rfp.description}
      </p>

      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <DollarSign className="w-4 h-4" />
          <span>${rfp.budget.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{rfp.deliveryDays} days</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{formatDistanceToNow(new Date(rfp.createdAt), { addSuffix: true })}</span>
        </div>
      </div>

      {rfp.sentTo.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Sent to {rfp.sentTo.length} vendor{rfp.sentTo.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </Link>
  );
};
