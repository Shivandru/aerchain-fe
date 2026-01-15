import type { ComparisonResult, Proposal, RFP, Vendor } from "../types";


export const mockVendors: Vendor[] = [
  {
    id: 'v1',
    name: 'TechSupply Pro',
    email: 'sales@techsupplypro.com',
    phone: '+1 (555) 123-4567',
    specialty: 'Computer Hardware',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'v2',
    name: 'Office Solutions Inc',
    email: 'procurement@officesolutions.com',
    phone: '+1 (555) 234-5678',
    specialty: 'Office Equipment',
    createdAt: '2024-01-20T14:30:00Z',
  },
  {
    id: 'v3',
    name: 'Digital Systems Corp',
    email: 'bids@digitalsystems.com',
    phone: '+1 (555) 345-6789',
    specialty: 'IT Infrastructure',
    createdAt: '2024-02-01T09:15:00Z',
  },
];

export const mockRFPs: RFP[] = [
  {
    id: 'rfp1',
    title: 'Laptop and Monitor Procurement',
    description: 'Procurement of laptops and monitors for the engineering team expansion.',
    budget: 30000,
    deliveryDays: 30,
    items: [
      { name: 'Laptop 16GB RAM', quantity: 20, specs: 'Intel i7, 512GB SSD, 16GB RAM' },
      { name: 'Monitor 27"', quantity: 10, specs: '4K Resolution, USB-C connectivity' },
    ],
    paymentTerms: 'Net 30 after delivery',
    warranty: '3 years manufacturer warranty',
    status: 'sent',
    createdAt: '2024-02-10T08:00:00Z',
    sentTo: ['v1', 'v2'],
    sentAt: '2024-02-11T10:00:00Z',
  },
  {
    id: 'rfp2',
    title: 'Office Furniture Setup',
    description: 'New office furniture for the downtown location.',
    budget: 15000,
    deliveryDays: 45,
    items: [
      { name: 'Standing Desk', quantity: 15, specs: 'Electric adjustable, 60" width' },
      { name: 'Ergonomic Chair', quantity: 15, specs: 'Lumbar support, mesh back' },
    ],
    paymentTerms: '50% upfront, 50% on delivery',
    warranty: '5 years on all items',
    status: 'draft',
    createdAt: '2024-02-15T11:30:00Z',
    sentTo: [],
  },
  {
    id: 'rfp3',
    title: 'Network Infrastructure Upgrade',
    description: 'Complete network overhaul for improved performance.',
    budget: 50000,
    deliveryDays: 60,
    items: [
      { name: 'Enterprise Switch', quantity: 5, specs: '48-port, PoE+, managed' },
      { name: 'Access Points', quantity: 20, specs: 'WiFi 6E, indoor/outdoor' },
      { name: 'Firewall', quantity: 2, specs: 'Next-gen, 10Gbps throughput' },
    ],
    paymentTerms: 'Net 45 after installation',
    warranty: '5 years with 24/7 support',
    status: 'completed',
    createdAt: '2024-01-05T09:00:00Z',
    sentTo: ['v1', 'v3'],
    sentAt: '2024-01-06T14:00:00Z',
  },
];

export const mockProposals: Proposal[] = [
  {
    id: 'p1',
    rfpId: 'rfp1',
    vendorId: 'v1',
    vendorName: 'TechSupply Pro',
    totalPrice: 28500,
    deliveryDays: 25,
    terms: 'Net 30 after delivery',
    warranty: '3 years manufacturer warranty + 1 year extended',
    lineItems: [
      { item: 'Laptop 16GB RAM', price: 1200 },
      { item: 'Monitor 27"', price: 450 },
    ],
    notes: 'We can offer bulk discount for orders over 15 units.',
    receivedAt: '2024-02-13T16:00:00Z',
    aiScore: 87,
  },
  {
    id: 'p2',
    rfpId: 'rfp1',
    vendorId: 'v2',
    vendorName: 'Office Solutions Inc',
    totalPrice: 29200,
    deliveryDays: 28,
    terms: 'Net 30 after delivery',
    warranty: '3 years manufacturer warranty',
    lineItems: [
      { item: 'Laptop 16GB RAM', price: 1250 },
      { item: 'Monitor 27"', price: 420 },
    ],
    notes: 'Free installation and setup included.',
    receivedAt: '2024-02-14T10:30:00Z',
    aiScore: 82,
  },
  {
    id: 'p3',
    rfpId: 'rfp3',
    vendorId: 'v1',
    vendorName: 'TechSupply Pro',
    totalPrice: 47800,
    deliveryDays: 55,
    terms: 'Net 45 after installation',
    warranty: '5 years with 24/7 support',
    lineItems: [
      { item: 'Enterprise Switch', price: 3200 },
      { item: 'Access Points', price: 850 },
      { item: 'Firewall', price: 8500 },
    ],
    notes: 'Includes professional installation by certified engineers.',
    receivedAt: '2024-01-10T14:00:00Z',
    aiScore: 92,
  },
  {
    id: 'p4',
    rfpId: 'rfp3',
    vendorId: 'v3',
    vendorName: 'Digital Systems Corp',
    totalPrice: 49500,
    deliveryDays: 50,
    terms: 'Net 45 after installation',
    warranty: '7 years with priority support',
    lineItems: [
      { item: 'Enterprise Switch', price: 3500 },
      { item: 'Access Points', price: 900 },
      { item: 'Firewall', price: 9000 },
    ],
    notes: 'Extended warranty and dedicated account manager included.',
    receivedAt: '2024-01-11T09:15:00Z',
    aiScore: 88,
  },
];

export const getComparisonResult = (rfpId: string): ComparisonResult | null => {
  const proposals = mockProposals.filter((p) => p.rfpId === rfpId);
  if (proposals.length < 2) return null;

  const bestProposal = proposals.reduce((best, current) =>
    current.aiScore > best.aiScore ? current : best
  );

  return {
    rfpId,
    proposals,
    recommendation: {
      vendorId: bestProposal.vendorId,
      vendorName: bestProposal.vendorName,
      reasoning: `${bestProposal.vendorName} offers the best overall value with a competitive price of $${bestProposal.totalPrice.toLocaleString()} and delivery in ${bestProposal.deliveryDays} days. Their ${bestProposal.warranty} provides excellent coverage, and ${bestProposal.notes.toLowerCase()}`,
      scores: {
        price: rfpId === 'rfp1' ? 90 : 88,
        delivery: rfpId === 'rfp1' ? 85 : 92,
        terms: rfpId === 'rfp1' ? 88 : 90,
        overall: bestProposal.aiScore,
      },
    },
    summary: `Based on our analysis of ${proposals.length} vendor proposals, we recommend ${bestProposal.vendorName} as the optimal choice. They provide the best balance of pricing, delivery timeline, and warranty terms while meeting all technical specifications.`,
  };
};
