import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Trophy, 
  DollarSign, 
  Clock, 
  FileCheck, 
  Star,
  Sparkles
} from 'lucide-react';
import type { ComparisonResult, RFP } from '../types';
import { getComparison, getRFP } from '../services/api';
import { Layout } from '../components/layout/Layout';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ScoreGauge } from '../components/proposal/ScoreGauge';
import { cn } from '../lib/utils';

const Comparison = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [rfp, setRfp] = useState<RFP | null>(null);
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const [rfpData, comparisonData] = await Promise.all([
          getRFP(id),
          getComparison(id),
        ]);
        if (!rfpData || !comparisonData) {
          navigate(`/rfps/${id}`);
          return;
        }
        setRfp(rfpData);
        setComparison(comparisonData);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" text="Analyzing proposals..." />
        </div>
      </Layout>
    );
  }

  if (!rfp || !comparison) return null;

  const { recommendation, proposals } = comparison;

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate(`/rfps/${id}`)}
          className="mb-4 -ml-2 gap-2 text-muted-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to RFP
        </Button>
        
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          Proposal Comparison
        </h1>
        <p className="text-muted-foreground">{rfp.title}</p>
      </div>

      {/* AI Recommendation */}
      <Card className="shadow-card mb-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-lg">AI Recommendation</CardTitle>
              <p className="text-sm text-muted-foreground">Based on comprehensive analysis</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-6 h-6 text-warning" />
                <div>
                  <p className="text-sm text-muted-foreground">Recommended Vendor</p>
                  <p className="text-xl font-semibold text-foreground">{recommendation.vendorName}</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {recommendation.reasoning}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-card rounded-xl shadow-sm">
                <ScoreGauge score={recommendation.scores.price} size="sm" />
                <p className="text-xs text-muted-foreground mt-2">Price Score</p>
              </div>
              <div className="text-center p-4 bg-card rounded-xl shadow-sm">
                <ScoreGauge score={recommendation.scores.delivery} size="sm" />
                <p className="text-xs text-muted-foreground mt-2">Delivery Score</p>
              </div>
              <div className="text-center p-4 bg-card rounded-xl shadow-sm">
                <ScoreGauge score={recommendation.scores.terms} size="sm" />
                <p className="text-xs text-muted-foreground mt-2">Terms Score</p>
              </div>
              <div className="text-center p-4 bg-card rounded-xl shadow-sm">
                <ScoreGauge score={recommendation.scores.overall} size="sm" />
                <p className="text-xs text-muted-foreground mt-2">Overall</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Table */}
      <Card className="shadow-card overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg">Side-by-Side Comparison</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-medium text-muted-foreground bg-muted/30">
                    Criteria
                  </th>
                  {proposals.map((proposal) => (
                    <th
                      key={proposal.id}
                      className={cn(
                        'text-left p-4 font-medium',
                        proposal.vendorId === recommendation.vendorId
                          ? 'bg-primary/5'
                          : 'bg-muted/30'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {proposal.vendorName}
                        {proposal.vendorId === recommendation.vendorId && (
                          <Star className="w-4 h-4 text-warning fill-warning" />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* AI Score */}
                <tr className="border-b border-border">
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Sparkles className="w-4 h-4" />
                      AI Score
                    </div>
                  </td>
                  {proposals.map((proposal) => (
                    <td
                      key={proposal.id}
                      className={cn(
                        'p-4',
                        proposal.vendorId === recommendation.vendorId && 'bg-primary/5'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <ScoreGauge score={proposal.aiScore} size="sm" />
                        <span className="font-semibold">{proposal.aiScore}/100</span>
                      </div>
                    </td>
                  ))}
                </tr>
                
                {/* Total Price */}
                <tr className="border-b border-border">
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="w-4 h-4" />
                      Total Price
                    </div>
                  </td>
                  {proposals.map((proposal) => {
                    const isLowest = proposal.totalPrice === Math.min(...proposals.map((p) => p.totalPrice));
                    return (
                      <td
                        key={proposal.id}
                        className={cn(
                          'p-4',
                          proposal.vendorId === recommendation.vendorId && 'bg-primary/5'
                        )}
                      >
                        <span className={cn('font-semibold', isLowest && 'text-success')}>
                          ${proposal.totalPrice.toLocaleString()}
                        </span>
                        {isLowest && (
                          <span className="ml-2 text-xs bg-success/10 text-success px-2 py-0.5 rounded-full">
                            Lowest
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
                
                {/* Delivery Days */}
                <tr className="border-b border-border">
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      Delivery
                    </div>
                  </td>
                  {proposals.map((proposal) => {
                    const isFastest = proposal.deliveryDays === Math.min(...proposals.map((p) => p.deliveryDays));
                    return (
                      <td
                        key={proposal.id}
                        className={cn(
                          'p-4',
                          proposal.vendorId === recommendation.vendorId && 'bg-primary/5'
                        )}
                      >
                        <span className={cn('font-semibold', isFastest && 'text-success')}>
                          {proposal.deliveryDays} days
                        </span>
                        {isFastest && (
                          <span className="ml-2 text-xs bg-success/10 text-success px-2 py-0.5 rounded-full">
                            Fastest
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
                
                {/* Warranty */}
                <tr className="border-b border-border">
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <FileCheck className="w-4 h-4" />
                      Warranty
                    </div>
                  </td>
                  {proposals.map((proposal) => (
                    <td
                      key={proposal.id}
                      className={cn(
                        'p-4',
                        proposal.vendorId === recommendation.vendorId && 'bg-primary/5'
                      )}
                    >
                      {proposal.warranty}
                    </td>
                  ))}
                </tr>

                {/* Payment Terms */}
                <tr className="border-b border-border">
                  <td className="p-4 text-muted-foreground">Payment Terms</td>
                  {proposals.map((proposal) => (
                    <td
                      key={proposal.id}
                      className={cn(
                        'p-4',
                        proposal.vendorId === recommendation.vendorId && 'bg-primary/5'
                      )}
                    >
                      {proposal.terms}
                    </td>
                  ))}
                </tr>

                {/* Notes */}
                <tr>
                  <td className="p-4 text-muted-foreground align-top">Notes</td>
                  {proposals.map((proposal) => (
                    <td
                      key={proposal.id}
                      className={cn(
                        'p-4 align-top',
                        proposal.vendorId === recommendation.vendorId && 'bg-primary/5'
                      )}
                    >
                      <p className="text-sm text-muted-foreground">{proposal.notes}</p>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="shadow-card mt-6">
        <CardContent className="pt-6">
          <p className="text-muted-foreground leading-relaxed">{comparison.summary}</p>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Comparison;
