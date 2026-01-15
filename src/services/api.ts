import { getComparisonResult, mockProposals, mockRFPs, mockVendors } from "../data/mockData";
import type { ComparisonResult, Proposal, RFP, Vendor } from "../types";


// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// In-memory data stores (simulating backend)
let rfps = [...mockRFPs];
let vendors = [...mockVendors];
let proposals = [...mockProposals];

// RFP APIs
export const getRFPs = async (): Promise<RFP[]> => {
  await delay(300);
  return [...rfps].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getRFP = async (id: string): Promise<RFP | null> => {
  await delay(200);
  return rfps.find((r) => r.id === id) || null;
};

export const createRFP = async (naturalLanguageInput: string): Promise<RFP> => {
  await delay(1500); // Simulate AI processing time
  
  // Simulate AI parsing of natural language
  const newRFP: RFP = {
    id: `rfp${Date.now()}`,
    title: 'New Procurement Request',
    description: naturalLanguageInput,
    budget: 25000,
    deliveryDays: 30,
    items: [
      { name: 'Item 1', quantity: 10, specs: 'Standard specifications' },
    ],
    paymentTerms: 'Net 30 after delivery',
    warranty: '1 year manufacturer warranty',
    status: 'draft',
    createdAt: new Date().toISOString(),
    sentTo: [],
  };

  // Parse budget from input
  const budgetMatch = naturalLanguageInput.match(/\$?([\d,]+)/);
  if (budgetMatch) {
    newRFP.budget = parseInt(budgetMatch[1].replace(/,/g, ''));
  }

  // Parse delivery days
  const daysMatch = naturalLanguageInput.match(/(\d+)\s*days?/i);
  if (daysMatch) {
    newRFP.deliveryDays = parseInt(daysMatch[1]);
  }

  // Parse items (simplified)
  const items: { name: string; quantity: number; specs: string }[] = [];
  const laptopMatch = naturalLanguageInput.match(/(\d+)\s*laptops?/i);
  const monitorMatch = naturalLanguageInput.match(/(\d+)\s*monitors?/i);
  const ramMatch = naturalLanguageInput.match(/(\d+)\s*GB\s*RAM/i);
  
  if (laptopMatch) {
    items.push({
      name: 'Laptop',
      quantity: parseInt(laptopMatch[1]),
      specs: ramMatch ? `${ramMatch[1]}GB RAM, Intel i7, 512GB SSD` : 'Standard configuration',
    });
  }
  if (monitorMatch) {
    items.push({
      name: 'Monitor',
      quantity: parseInt(monitorMatch[1]),
      specs: '27" 4K Resolution',
    });
  }
  
  if (items.length > 0) {
    newRFP.items = items;
    newRFP.title = items.map((i) => `${i.quantity}x ${i.name}`).join(' + ') + ' Procurement';
  }

  rfps = [newRFP, ...rfps];
  return newRFP;
};

export const updateRFP = async (id: string, updates: Partial<RFP>): Promise<RFP | null> => {
  await delay(300);
  const index = rfps.findIndex((r) => r.id === id);
  if (index === -1) return null;
  
  rfps[index] = { ...rfps[index], ...updates };
  return rfps[index];
};

export const deleteRFP = async (id: string): Promise<boolean> => {
  await delay(300);
  const initialLength = rfps.length;
  rfps = rfps.filter((r) => r.id !== id);
  return rfps.length < initialLength;
};

export const sendRFP = async (id: string, vendorIds: string[]): Promise<RFP | null> => {
  await delay(800);
  const index = rfps.findIndex((r) => r.id === id);
  if (index === -1) return null;
  
  rfps[index] = {
    ...rfps[index],
    status: 'sent',
    sentTo: vendorIds,
    sentAt: new Date().toISOString(),
  };
  return rfps[index];
};

// Vendor APIs
export const getVendors = async (): Promise<Vendor[]> => {
  await delay(300);
  return [...vendors].sort((a, b) => a.name.localeCompare(b.name));
};

export const createVendor = async (vendor: Omit<Vendor, 'id' | 'createdAt'>): Promise<Vendor> => {
  await delay(300);
  const newVendor: Vendor = {
    ...vendor,
    id: `v${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  vendors = [...vendors, newVendor];
  return newVendor;
};

export const updateVendor = async (id: string, updates: Partial<Vendor>): Promise<Vendor | null> => {
  await delay(300);
  const index = vendors.findIndex((v) => v.id === id);
  if (index === -1) return null;
  
  vendors[index] = { ...vendors[index], ...updates };
  return vendors[index];
};

export const deleteVendor = async (id: string): Promise<boolean> => {
  await delay(300);
  const initialLength = vendors.length;
  vendors = vendors.filter((v) => v.id !== id);
  return vendors.length < initialLength;
};

// Proposal APIs
export const getProposals = async (rfpId: string): Promise<Proposal[]> => {
  await delay(300);
  return proposals.filter((p) => p.rfpId === rfpId);
};

export const getComparison = async (rfpId: string): Promise<ComparisonResult | null> => {
  await delay(500);
  return getComparisonResult(rfpId);
};
