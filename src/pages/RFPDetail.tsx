import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
  Clock, 
  Package, 
  Send, 
  ArrowLeft,
  Calendar,
  Users,
  FileText,
  Loader2,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import type { Proposal, RFP, Vendor } from '../types';
import { getProposals, getRFP, getVendors, sendRFP } from '../services/api';
import { Layout } from '../components/layout/Layout';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Button } from '../components/ui/button';
import { StatusBadge } from '../components/common/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ProposalCard } from '../components/proposal/ProposalCard';
import { Checkbox } from '../components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../components/ui/alert-dialog';

const RFPDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [rfp, setRfp] = useState<RFP | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const [rfpData, vendorData, proposalData] = await Promise.all([
          getRFP(id),
          getVendors(),
          getProposals(id),
        ]);
        if (!rfpData) {
          navigate('/rfps');
          return;
        }
        setRfp(rfpData);
        setVendors(vendorData);
        setProposals(proposalData);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, navigate]);

  const toggleVendor = (vendorId: string) => {
    setSelectedVendors((prev) =>
      prev.includes(vendorId)
        ? prev.filter((v) => v !== vendorId)
        : [...prev, vendorId]
    );
  };

  const handleSendRFP = async () => {
    if (!rfp || selectedVendors.length === 0) return;
    
    setSending(true);
    try {
      const updated = await sendRFP(rfp.id, selectedVendors);
      if (updated) {
        setRfp(updated);
        toast.success(`RFP sent to ${selectedVendors.length} vendor(s)`);
      }
    } catch (error) {
      toast.error('Failed to send RFP');
    } finally {
      setSending(false);
      setShowConfirm(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" text="Loading RFP..." />
        </div>
      </Layout>
    );
  }

  if (!rfp) return null;

  const sentVendors = vendors.filter((v) => rfp.sentTo.includes(v.id));

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4 -ml-2 gap-2 text-muted-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-semibold text-foreground">{rfp.title}</h1>
              <StatusBadge status={rfp.status} />
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                Created {format(new Date(rfp.createdAt), 'MMM d, yyyy')}
              </span>
              {rfp.sentAt && (
                <span className="flex items-center gap-1.5">
                  <Send className="w-4 h-4" />
                  Sent {format(new Date(rfp.sentAt), 'MMM d, yyyy')}
                </span>
              )}
            </div>
          </div>
          
          {proposals.length >= 2 && (
            <Button onClick={() => navigate(`/rfps/${rfp.id}/compare`)} className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Compare Proposals
            </Button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Details */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">RFP Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">{rfp.description}</p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <DollarSign className="w-6 h-6 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Budget</p>
                    <p className="text-xl font-semibold text-foreground">
                      ${rfp.budget.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <Clock className="w-6 h-6 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Delivery</p>
                    <p className="text-xl font-semibold text-foreground">
                      {rfp.deliveryDays} days
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Items ({rfp.items.length})</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border">
                {rfp.items.map((item, index) => (
                  <div key={index} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.specs}</p>
                    </div>
                    <span className="text-sm bg-muted px-3 py-1 rounded-full">
                      Qty: {item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Proposals */}
          {rfp.status !== 'draft' && (
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">
                    Proposals ({proposals.length})
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {proposals.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                      <Loader2 className="w-6 h-6 text-muted-foreground animate-pulse-soft" />
                    </div>
                    <p className="text-muted-foreground">Waiting for vendor responses...</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {proposals.map((proposal) => (
                      <ProposalCard
                        key={proposal.id}
                        proposal={proposal}
                        isRecommended={proposals.length > 1 && 
                          proposal.aiScore === Math.max(...proposals.map((p) => p.aiScore))}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Terms */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Payment Terms</p>
                <p className="text-sm text-foreground">{rfp.paymentTerms}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Warranty</p>
                <p className="text-sm text-foreground">{rfp.warranty}</p>
              </div>
            </CardContent>
          </Card>

          {/* Send to Vendors */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">
                  {rfp.status === 'draft' ? 'Send to Vendors' : 'Sent To'}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {rfp.status === 'draft' ? (
                <>
                  {vendors.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground mb-3">No vendors available</p>
                      <Button variant="outline" size="sm" onClick={() => navigate('/vendors')}>
                        Add Vendors
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3 mb-4">
                        {vendors.map((vendor) => (
                          <label
                            key={vendor.id}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                          >
                            <Checkbox
                              checked={selectedVendors.includes(vendor.id)}
                              onCheckedChange={() => toggleVendor(vendor.id)}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {vendor.name}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {vendor.email}
                              </p>
                            </div>
                          </label>
                        ))}
                      </div>
                      <Button
                        className="w-full gap-2"
                        disabled={selectedVendors.length === 0}
                        onClick={() => setShowConfirm(true)}
                      >
                        <Send className="w-4 h-4" />
                        Send to {selectedVendors.length} Vendor{selectedVendors.length !== 1 ? 's' : ''}
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <div className="space-y-3">
                  {sentVendors.map((vendor) => (
                    <div key={vendor.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {vendor.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {vendor.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {vendor.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send RFP to Vendors</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to send this RFP to {selectedVendors.length} vendor{selectedVendors.length !== 1 ? 's' : ''}? 
              They will receive an email with the RFP details.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={sending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSendRFP} disabled={sending}>
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                'Send RFP'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default RFPDetail;
