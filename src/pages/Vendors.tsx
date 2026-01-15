import { useState, useEffect } from 'react';
import { Users, Plus, Search, Loader2 } from 'lucide-react';

import { toast } from 'sonner';
import type { Vendor } from '../types';
import { createVendor, deleteVendor, getVendors, updateVendor } from '../services/api';
import { Layout } from '../components/layout/Layout';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { EmptyState } from '../components/common/EmptyState';
import { VendorCard } from '../components/vendor/VendorCard';
import { VendorForm } from '../components/vendor/VendorForm';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../components/ui/alert-dialog';

const Vendors = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [deletingVendor, setDeletingVendor] = useState<Vendor | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      const data = await getVendors();
      setVendors(data);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: Omit<Vendor, 'id' | 'createdAt'>) => {
    setSaving(true);
    try {
      if (editingVendor) {
        const updated = await updateVendor(editingVendor.id, data);
        if (updated) {
          setVendors((prev) =>
            prev.map((v) => (v.id === updated.id ? updated : v))
          );
          toast.success('Vendor updated successfully');
        }
      } else {
        const created = await createVendor(data);
        setVendors((prev) => [...prev, created]);
        toast.success('Vendor added successfully');
      }
      setFormOpen(false);
      setEditingVendor(null);
    } catch (error) {
      toast.error('Failed to save vendor');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingVendor) return;
    
    setDeleting(true);
    try {
      const success = await deleteVendor(deletingVendor.id);
      if (success) {
        setVendors((prev) => prev.filter((v) => v.id !== deletingVendor.id));
        toast.success('Vendor deleted successfully');
      }
    } catch (error) {
      toast.error('Failed to delete vendor');
    } finally {
      setDeleting(false);
      setDeletingVendor(null);
    }
  };

  const openEditForm = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingVendor(null);
  };

  const filteredVendors = vendors.filter((vendor) =>
    vendor.name.toLowerCase().includes(search.toLowerCase()) ||
    vendor.email.toLowerCase().includes(search.toLowerCase()) ||
    vendor.specialty?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" text="Loading vendors..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader
        title="Vendors"
        description={`${vendors.length} registered vendor${vendors.length !== 1 ? 's' : ''}`}
        action={
          <Button onClick={() => setFormOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Vendor
          </Button>
        }
      />

      {/* Search */}
      {vendors.length > 0 && (
        <div className="relative max-w-sm mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search vendors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      {/* Vendor Grid */}
      {filteredVendors.length === 0 ? (
        <EmptyState
          icon={<Users className="w-8 h-8" />}
          title={search ? 'No matching vendors' : 'No vendors yet'}
          description={
            search
              ? 'Try adjusting your search criteria.'
              : 'Add your first vendor to start sending RFPs.'
          }
          action={
            !search
              ? { label: 'Add Vendor', onClick: () => setFormOpen(true) }
              : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {filteredVendors.map((vendor) => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              onEdit={openEditForm}
              onDelete={setDeletingVendor}
            />
          ))}
        </div>
      )}

      {/* Vendor Form Modal */}
      <VendorForm
        open={formOpen}
        onClose={closeForm}
        onSubmit={handleSubmit}
        vendor={editingVendor}
        isLoading={saving}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingVendor} onOpenChange={() => setDeletingVendor(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Vendor</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deletingVendor?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default Vendors;