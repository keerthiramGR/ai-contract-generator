export type ContractStatus = "draft" | "pending" | "approved" | "rejected" | "changes_requested";
export type ContractPurpose =
  | "employment"
  | "internship"
  | "freelancing"
  | "vendor"
  | "nda"
  | "software"
  | "consultancy"
  | "rental"
  | "partnership"
  | "service"
  | "government";
export type Department = "IT" | "HR" | "Finance" | "Marketing" | "Operations" | "Legal" | "Sales";
export type ContractDuration = "3months" | "6months" | "1year" | "2years" | "custom";

export interface Company {
  id: string;
  name: string;
  logo: string;
  industry: string;
  location: string;
  description: string;
  verified: boolean;
  templateCount: number;
  contractsProcessed: number;
  website: string;
  primaryColor: string;
}

export interface ContractTemplate {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  purpose: ContractPurpose;
  department: Department;
  description: string;
  content: string;
  placeholders: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
}

export interface Contract {
  id: string;
  title: string;
  userId: string;
  userName: string;
  userEmail: string;
  companyId: string;
  companyName: string;
  templateId?: string;
  purpose: ContractPurpose;
  department: Department;
  status: ContractStatus;
  content: string;
  riskScore: number;
  aiSummary: string;
  adminComment?: string;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  expiresAt?: string;
  duration: ContractDuration;
  salary?: string;
  projectType?: string;
  location: {
    country: string;
    state?: string;
    city?: string;
  };
  signatoryName?: string;
  signatoryTitle?: string;
  downloadCount: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: "contract_approved" | "contract_rejected" | "changes_requested" | "new_request" | "signature_added" | "expiring";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  contractId?: string;
  companyId?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface AnalyticsData {
  totalContracts: number;
  approvedContracts: number;
  rejectedContracts: number;
  pendingContracts: number;
  avgApprovalDays: number;
  mostUsedTemplate: string;
  monthlyData: { month: string; created: number; approved: number; rejected: number }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  companyId?: string;
  avatarUrl?: string;
  createdAt: string;
  contractCount: number;
}
