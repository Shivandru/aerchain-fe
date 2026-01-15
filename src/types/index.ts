export interface RFPItem {
  name: string;
  quantity: number;
  specs: string;
}

export interface RFP {
  id: string;
  title: string;
  description: string;
  budget: number;
  deliveryDays: number;
  items: RFPItem[];
  paymentTerms: string;
  warranty: string;
  status: "draft" | "sent" | "completed";
  createdAt: string;
  sentTo: string[];
  sentAt?: string;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  createdAt: string;
}

export interface ProposalLineItem {
  item: string;
  price: number;
}

export interface Proposal {
  id: string;
  rfpId: string;
  vendorId: string;
  vendorName: string;
  totalPrice: number;
  deliveryDays: number;
  terms: string;
  warranty: string;
  lineItems: ProposalLineItem[];
  notes: string;
  receivedAt: string;
  aiScore: number;
}

export interface ComparisonScores {
  price: number;
  delivery: number;
  terms: number;
  overall: number;
}

export interface ComparisonRecommendation {
  vendorId: string;
  vendorName: string;
  reasoning: string;
  scores: ComparisonScores;
}

export interface ComparisonResult {
  rfpId: string;
  proposals: Proposal[];
  recommendation: ComparisonRecommendation;
  summary: string;
}
