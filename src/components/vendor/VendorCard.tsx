import { Mail, Phone, Briefcase, MoreVertical, Pencil, Trash2 } from 'lucide-react';

import type { Vendor } from '../../types';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';


interface VendorCardProps {
  vendor: Vendor;
  onEdit: (vendor: Vendor) => void;
  onDelete: (vendor: Vendor) => void;
}

export const VendorCard = ({ vendor, onEdit, onDelete }: VendorCardProps) => {
  return (
    <div className="bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <span className="text-lg font-semibold text-primary">
            {vendor.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(vendor)}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(vendor)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-1">
        {vendor.name}
      </h3>
      
      {vendor.specialty && (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
          <Briefcase className="w-4 h-4" />
          <span>{vendor.specialty}</span>
        </div>
      )}

      <div className="space-y-2">
        <a 
          href={`mailto:${vendor.email}`}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Mail className="w-4 h-4" />
          <span className="truncate">{vendor.email}</span>
        </a>
        {vendor.phone && (
          <a 
            href={`tel:${vendor.phone}`}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>{vendor.phone}</span>
          </a>
        )}
      </div>
    </div>
  );
};
