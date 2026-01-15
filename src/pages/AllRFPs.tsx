import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Search } from 'lucide-react';
import type { RFP } from '../types';
import { getRFPs } from '../services/api';
import { Layout } from '../components/layout/Layout';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { EmptyState } from '../components/common/EmptyState';
import { RFPCard } from '../components/rfp/RFPCard';


const AllRFPs = () => {
  const navigate = useNavigate();
  const [rfps, setRfps] = useState<RFP[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'draft' | 'sent' | 'completed'>('all');

  useEffect(() => {
    const loadRFPs = async () => {
      try {
        const data = await getRFPs();
        setRfps(data);
      } finally {
        setLoading(false);
      }
    };
    loadRFPs();
  }, []);

  const filteredRFPs = rfps.filter((rfp) => {
    const matchesSearch = rfp.title.toLowerCase().includes(search.toLowerCase()) ||
      rfp.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || rfp.status === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" text="Loading RFPs..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader
        title="All RFPs"
        description={`${rfps.length} total RFPs`}
        action={
          <Button onClick={() => navigate('/create-rfp')} className="gap-2">
            <Plus className="w-4 h-4" />
            Create RFP
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search RFPs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* RFP Grid */}
      {filteredRFPs.length === 0 ? (
        <EmptyState
          icon={<FileText className="w-8 h-8" />}
          title={search || filter !== 'all' ? 'No matching RFPs' : 'No RFPs yet'}
          description={
            search || filter !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Create your first RFP to get started with procurement management.'
          }
          action={
            !search && filter === 'all'
              ? { label: 'Create RFP', onClick: () => navigate('/create-rfp') }
              : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {filteredRFPs.map((rfp) => (
            <RFPCard key={rfp.id} rfp={rfp} />
          ))}
        </div>
      )}
    </Layout>
  );
};

export default AllRFPs;
