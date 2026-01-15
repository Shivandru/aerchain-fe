import { DollarSign, Clock, Shield, Calendar } from 'lucide-react';
// import { Proposal } from '@/types';
// import { ScoreGauge } from './ScoreGauge';
import { formatDistanceToNow } from 'date-fns';
import type { Proposal } from '../../types';
import { ScoreGauge } from './ScoreGauge';

interface ProposalCardProps {
  proposal: Proposal;
  isRecommended?: boolean;
}

export const ProposalCard = ({ proposal, isRecommended }: ProposalCardProps) => {
  return (
    <div className={`bg-card rounded-xl p-6 shadow-card relative ${isRecommended ? 'ring-2 ring-primary' : ''}`}>
      {isRecommended && (
        <div className="absolute -top-3 left-6 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
          AI Recommended
        </div>
      )}
      
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{proposal.vendorName}</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
            <Calendar className="w-4 h-4" />
            Received {formatDistanceToNow(new Date(proposal.receivedAt), { addSuffix: true })}
          </p>
        </div>
        <ScoreGauge score={proposal.aiScore} label="AI Score" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <DollarSign className="w-5 h-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Total Price</p>
            <p className="text-lg font-semibold text-foreground">${proposal.totalPrice.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <Clock className="w-5 h-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Delivery</p>
            <p className="text-lg font-semibold text-foreground">{proposal.deliveryDays} days</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <Shield className="w-4 h-4 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-xs text-muted-foreground">Warranty</p>
            <p className="text-sm text-foreground">{proposal.warranty}</p>
          </div>
        </div>
        {proposal.notes && (
          <div className="pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground mb-1">Notes</p>
            <p className="text-sm text-foreground">{proposal.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};
