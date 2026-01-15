import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Users, Send, TrendingUp, Plus } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/ui/button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import type { RFP, Vendor } from '../types';
import { getRFPs, getVendors } from '../services/api';
import { StatCard } from '../components/common/StatCard';
import { EmptyState } from '../components/common/EmptyState';
import { RFPCard } from '../components/rfp/RFPCard';

const Dashboard = () => {
  const navigate = useNavigate();
  const [rfps, setRfps] = useState<RFP[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [rfpData, vendorData] = await Promise.all([getRFPs(), getVendors()]);
        setRfps(rfpData);
        setVendors(vendorData);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const stats = {
    total: rfps.length,
    active: rfps.filter((r) => r.status === 'sent').length,
    completed: rfps.filter((r) => r.status === 'completed').length,
    vendors: vendors.length,
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" text="Loading dashboard..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader
        title="Dashboard"
        description="Overview of your procurement activities"
        action={
          <Button onClick={() => navigate('/create-rfp')} className="gap-2">
            <Plus className="w-4 h-4" />
            Create RFP
          </Button>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<FileText className="w-6 h-6" />}
          label="Total RFPs"
          value={stats.total}
        />
        <StatCard
          icon={<Send className="w-6 h-6" />}
          label="Active RFPs"
          value={stats.active}
          trend={{ value: '+2 this week', positive: true }}
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="Completed"
          value={stats.completed}
        />
        <StatCard
          icon={<Users className="w-6 h-6" />}
          label="Vendors"
          value={stats.vendors}
        />
      </div>

      {/* Recent RFPs */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Recent RFPs</h2>
        {rfps.length > 3 && (
          <Button variant="ghost" onClick={() => navigate('/rfps')} className="text-sm">
            View all
          </Button>
        )}
      </div>

      {rfps.length === 0 ? (
        <EmptyState
          icon={<FileText className="w-8 h-8" />}
          title="No RFPs yet"
          description="Create your first RFP to get started with procurement management."
          action={{
            label: 'Create RFP',
            onClick: () => navigate('/create-rfp'),
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {rfps.slice(0, 6).map((rfp) => (
            <RFPCard key={rfp.id} rfp={rfp} />
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
