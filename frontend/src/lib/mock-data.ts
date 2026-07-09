import { Company, ContractTemplate, Contract, Notification, ChatMessage, AnalyticsData, User } from "./types";

// ─── Companies ───────────────────────────────────────────────────
export const COMPANIES: Company[] = [
  {
    id: "microsoft",
    name: "Microsoft",
    logo: "M",
    industry: "Technology",
    location: "Redmond, WA, USA",
    description: "Empowering every person and organization on the planet to achieve more.",
    verified: true,
    templateCount: 8,
    contractsProcessed: 1247,
    website: "https://microsoft.com",
    primaryColor: "#0078d4",
  },
  {
    id: "google",
    name: "Google",
    logo: "G",
    industry: "Technology",
    location: "Mountain View, CA, USA",
    description: "Organizing the world's information and making it universally accessible.",
    verified: true,
    templateCount: 6,
    contractsProcessed: 986,
    website: "https://google.com",
    primaryColor: "#4285f4",
  },
  {
    id: "amazon",
    name: "Amazon",
    logo: "A",
    industry: "E-Commerce / Cloud",
    location: "Seattle, WA, USA",
    description: "A global technology company focused on e-commerce, cloud computing, and AI.",
    verified: true,
    templateCount: 7,
    contractsProcessed: 823,
    website: "https://amazon.com",
    primaryColor: "#ff9900",
  },
  {
    id: "meta",
    name: "Meta",
    logo: "M",
    industry: "Social Media / Technology",
    location: "Menlo Park, CA, USA",
    description: "Building the future of human connection and the technology that makes it possible.",
    verified: true,
    templateCount: 5,
    contractsProcessed: 634,
    website: "https://meta.com",
    primaryColor: "#0082fb",
  },
  {
    id: "apple",
    name: "Apple",
    logo: "A",
    industry: "Technology / Consumer Electronics",
    location: "Cupertino, CA, USA",
    description: "Designing innovative products and services that enrich people's lives.",
    verified: true,
    templateCount: 6,
    contractsProcessed: 754,
    website: "https://apple.com",
    primaryColor: "#555555",
  },
  {
    id: "netflix",
    name: "Netflix",
    logo: "N",
    industry: "Entertainment / Streaming",
    location: "Los Gatos, CA, USA",
    description: "The world's leading streaming entertainment service.",
    verified: true,
    templateCount: 4,
    contractsProcessed: 421,
    website: "https://netflix.com",
    primaryColor: "#e50914",
  },
  {
    id: "tesla",
    name: "Tesla",
    logo: "T",
    industry: "Automotive / Energy",
    location: "Austin, TX, USA",
    description: "Accelerating the world's transition to sustainable energy.",
    verified: true,
    templateCount: 5,
    contractsProcessed: 312,
    website: "https://tesla.com",
    primaryColor: "#cc0000",
  },
  {
    id: "openai",
    name: "OpenAI",
    logo: "O",
    industry: "Artificial Intelligence",
    location: "San Francisco, CA, USA",
    description: "AI research and deployment company committed to ensuring beneficial AI.",
    verified: true,
    templateCount: 4,
    contractsProcessed: 287,
    website: "https://openai.com",
    primaryColor: "#10a37f",
  },
];

// ─── Templates ───────────────────────────────────────────────────
export const TEMPLATES: ContractTemplate[] = [
  {
    id: "t1",
    companyId: "microsoft",
    companyName: "Microsoft",
    title: "Software Engineer Employment Agreement",
    purpose: "employment",
    department: "IT",
    description: "Standard employment agreement for software engineering roles at Microsoft.",
    content: `MICROSOFT CORPORATION
SOFTWARE ENGINEER EMPLOYMENT AGREEMENT

This Employment Agreement ("Agreement") is entered into as of [START_DATE] between Microsoft Corporation ("Company") and [EMPLOYEE_NAME] ("Employee").

1. POSITION AND DUTIES
Employee is hired as [POSITION] in the [DEPARTMENT] department. Employee shall report to [REPORTING_MANAGER] and shall perform duties as assigned.

2. COMPENSATION
Base Salary: [SALARY] per year, paid bi-weekly.
Annual Bonus: Up to [BONUS_PERCENTAGE]% of base salary based on performance.
Stock Options: [STOCK_OPTIONS] RSUs vesting over 4 years.

3. BENEFITS
- Medical, Dental, and Vision insurance
- 401(k) with company match up to 50% of first 6%
- 15 days paid vacation, 10 sick days
- Employee Stock Purchase Plan (ESPP)

4. INTELLECTUAL PROPERTY
All work product created during employment is the sole property of Microsoft Corporation.

5. CONFIDENTIALITY
Employee agrees to maintain strict confidentiality of all proprietary information.

6. NON-COMPETE
Employee agrees not to engage in competing activities for [NON_COMPETE_PERIOD] following termination.

7. TERMINATION
Either party may terminate this agreement with [NOTICE_PERIOD] written notice.

8. GOVERNING LAW
This agreement is governed by the laws of the State of Washington.

Signed:
___________________          ___________________
[EMPLOYEE_NAME]              Authorized Representative
Date: ___________            Microsoft Corporation`,
    placeholders: ["START_DATE", "EMPLOYEE_NAME", "POSITION", "DEPARTMENT", "REPORTING_MANAGER", "SALARY", "BONUS_PERCENTAGE", "STOCK_OPTIONS", "NON_COMPETE_PERIOD", "NOTICE_PERIOD"],
    isActive: true,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-06-01T10:00:00Z",
    usageCount: 234,
  },
  {
    id: "t2",
    companyId: "microsoft",
    companyName: "Microsoft",
    title: "Internship Agreement",
    purpose: "internship",
    department: "IT",
    description: "Standard internship agreement for technical roles.",
    content: `MICROSOFT INTERNSHIP AGREEMENT\n\nThis Internship Agreement is between Microsoft Corporation and [INTERN_NAME]...\n\n[Full template content]`,
    placeholders: ["INTERN_NAME", "START_DATE", "END_DATE", "STIPEND", "DEPARTMENT"],
    isActive: true,
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-06-01T10:00:00Z",
    usageCount: 156,
  },
  {
    id: "t3",
    companyId: "google",
    companyName: "Google",
    title: "Software Engineer Employment Agreement",
    purpose: "employment",
    department: "IT",
    description: "Google's standard employment agreement for engineers.",
    content: `GOOGLE LLC EMPLOYMENT AGREEMENT\n\nThis Agreement is between Google LLC and [EMPLOYEE_NAME]...\n\n[Full template content]`,
    placeholders: ["EMPLOYEE_NAME", "POSITION", "SALARY", "START_DATE", "DEPARTMENT"],
    isActive: true,
    createdAt: "2024-02-10T10:00:00Z",
    updatedAt: "2024-06-15T10:00:00Z",
    usageCount: 187,
  },
  {
    id: "t4",
    companyId: "amazon",
    companyName: "Amazon",
    title: "Vendor Agreement",
    purpose: "vendor",
    department: "Operations",
    description: "Standard vendor agreement for Amazon suppliers.",
    content: `AMAZON VENDOR AGREEMENT\n\nThis Vendor Agreement is between Amazon.com, Inc. and [VENDOR_NAME]...\n\n[Full template content]`,
    placeholders: ["VENDOR_NAME", "START_DATE", "PAYMENT_TERMS", "PRODUCT_CATEGORY"],
    isActive: true,
    createdAt: "2024-03-05T10:00:00Z",
    updatedAt: "2024-06-20T10:00:00Z",
    usageCount: 89,
  },
  {
    id: "t5",
    companyId: "microsoft",
    companyName: "Microsoft",
    title: "Non-Disclosure Agreement",
    purpose: "nda",
    department: "Legal",
    description: "Mutual NDA for business discussions and partnerships.",
    content: `MICROSOFT MUTUAL NON-DISCLOSURE AGREEMENT\n\nThis NDA is between Microsoft Corporation and [PARTY_NAME]...\n\n[Full template content]`,
    placeholders: ["PARTY_NAME", "PURPOSE", "DURATION", "DATE"],
    isActive: true,
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-05-01T10:00:00Z",
    usageCount: 312,
  },
];

// ─── Contracts ────────────────────────────────────────────────────
export const CONTRACTS: Contract[] = [
  {
    id: "c1",
    title: "Software Engineer Employment – Microsoft",
    userId: "user1",
    userName: "Alex Johnson",
    userEmail: "alex@example.com",
    companyId: "microsoft",
    companyName: "Microsoft",
    templateId: "t1",
    purpose: "employment",
    department: "IT",
    status: "approved",
    content: "Full generated contract content...",
    riskScore: 12,
    aiSummary: "Standard employment agreement with competitive compensation. Low risk. All standard clauses present including IP assignment, confidentiality, and non-compete provisions.",
    adminComment: "Approved. Welcome to the team!",
    createdAt: "2024-06-01T10:00:00Z",
    updatedAt: "2024-06-05T14:00:00Z",
    approvedAt: "2024-06-05T14:00:00Z",
    expiresAt: "2025-06-01T00:00:00Z",
    duration: "1year",
    salary: "$150,000/year",
    location: { country: "USA", state: "Washington", city: "Redmond" },
    signatoryName: "Sarah Chen",
    signatoryTitle: "VP of Engineering",
    downloadCount: 3,
  },
  {
    id: "c2",
    title: "Freelance Frontend Developer – Google",
    userId: "user1",
    userName: "Alex Johnson",
    userEmail: "alex@example.com",
    companyId: "google",
    companyName: "Google",
    purpose: "freelancing",
    department: "IT",
    status: "pending",
    content: "Full generated contract content...",
    riskScore: 28,
    aiSummary: "Freelancing agreement for frontend development work. Medium risk due to vague IP ownership clause. Recommend clarification on deliverables.",
    createdAt: "2024-06-20T09:00:00Z",
    updatedAt: "2024-06-20T09:00:00Z",
    duration: "6months",
    salary: "$120/hour",
    location: { country: "USA", state: "California", city: "Mountain View" },
    downloadCount: 0,
  },
  {
    id: "c3",
    title: "Internship Agreement – Amazon",
    userId: "user1",
    userName: "Alex Johnson",
    userEmail: "alex@example.com",
    companyId: "amazon",
    companyName: "Amazon",
    purpose: "internship",
    department: "IT",
    status: "changes_requested",
    content: "Full generated contract content...",
    riskScore: 18,
    aiSummary: "Internship agreement for summer program. Minor issues with stipend details and remote work provisions.",
    adminComment: "Please clarify remote work policy and confirm start date.",
    createdAt: "2024-06-15T11:00:00Z",
    updatedAt: "2024-06-18T15:00:00Z",
    duration: "3months",
    salary: "$8,000/month",
    location: { country: "USA", state: "Washington", city: "Seattle" },
    downloadCount: 0,
  },
  {
    id: "c4",
    title: "NDA – Meta Platforms",
    userId: "user1",
    userName: "Alex Johnson",
    userEmail: "alex@example.com",
    companyId: "meta",
    companyName: "Meta",
    purpose: "nda",
    department: "Legal",
    status: "draft",
    content: "Full generated contract content...",
    riskScore: 8,
    aiSummary: "Standard mutual NDA with appropriate duration and scope limitations. Low risk.",
    createdAt: "2024-06-25T16:00:00Z",
    updatedAt: "2024-06-25T16:00:00Z",
    duration: "1year",
    location: { country: "USA", state: "California", city: "Menlo Park" },
    downloadCount: 0,
  },
  {
    id: "c5",
    title: "Consultancy Agreement – Tesla",
    userId: "user2",
    userName: "Maria Garcia",
    userEmail: "maria@example.com",
    companyId: "tesla",
    companyName: "Tesla",
    purpose: "consultancy",
    department: "IT",
    status: "rejected",
    content: "Full generated contract content...",
    riskScore: 67,
    aiSummary: "Consultancy agreement with high-risk clauses. Overly broad IP assignment and unreasonable non-compete clause identified.",
    adminComment: "IP clause is too broad. Please revise section 4 to limit scope to project deliverables only.",
    createdAt: "2024-06-10T08:00:00Z",
    updatedAt: "2024-06-12T10:00:00Z",
    duration: "6months",
    salary: "$200/hour",
    location: { country: "USA", state: "Texas", city: "Austin" },
    downloadCount: 0,
  },
];

// ─── Notifications ────────────────────────────────────────────────
export const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    userId: "user1",
    type: "contract_approved",
    title: "Contract Approved! 🎉",
    message: "Your Software Engineer Employment contract with Microsoft has been approved and signed.",
    isRead: false,
    createdAt: "2024-06-05T14:00:00Z",
    contractId: "c1",
    companyId: "microsoft",
  },
  {
    id: "n2",
    userId: "user1",
    type: "changes_requested",
    title: "Changes Requested",
    message: "Amazon has requested changes to your Internship Agreement. Please review the admin's comments.",
    isRead: false,
    createdAt: "2024-06-18T15:00:00Z",
    contractId: "c3",
    companyId: "amazon",
  },
  {
    id: "n3",
    userId: "user1",
    type: "contract_rejected",
    title: "Contract Rejected",
    message: "Your Consultancy Agreement with Tesla has been rejected. See comments for details.",
    isRead: true,
    createdAt: "2024-06-12T10:00:00Z",
    contractId: "c5",
    companyId: "tesla",
  },
];

// ─── Admin Notifications ──────────────────────────────────────────
export const ADMIN_NOTIFICATIONS: Notification[] = [
  {
    id: "an1",
    userId: "admin1",
    type: "new_request",
    title: "New Contract Request",
    message: "Alex Johnson has submitted a Freelance Frontend Developer contract for review.",
    isRead: false,
    createdAt: "2024-06-20T09:00:00Z",
    contractId: "c2",
  },
  {
    id: "an2",
    userId: "admin1",
    type: "expiring",
    title: "Contract Expiring Soon",
    message: "Software Engineer Employment contract for Alex Johnson expires in 30 days.",
    isRead: false,
    createdAt: "2024-05-01T10:00:00Z",
    contractId: "c1",
  },
];

// ─── AI Chat Starter Messages ─────────────────────────────────────
export const AI_STARTER_MESSAGES: ChatMessage[] = [
  {
    id: "ai-welcome",
    role: "assistant",
    content: "Hello! I'm Accord, your intelligent contract assistant. I can help you:\n\n• **Generate** professional contracts tailored to your needs\n• **Explain** complex legal clauses in plain language\n• **Review** contracts and identify potential risks\n• **Answer** questions about your agreements\n\nWhat can I help you with today?",
    timestamp: new Date().toISOString(),
  },
];

// ─── Analytics ────────────────────────────────────────────────────
export const ANALYTICS_DATA: AnalyticsData = {
  totalContracts: 247,
  approvedContracts: 183,
  rejectedContracts: 28,
  pendingContracts: 36,
  avgApprovalDays: 2.4,
  mostUsedTemplate: "Software Engineer Employment Agreement",
  monthlyData: [
    { month: "Jan", created: 18, approved: 15, rejected: 2 },
    { month: "Feb", created: 22, approved: 19, rejected: 1 },
    { month: "Mar", created: 25, approved: 20, rejected: 3 },
    { month: "Apr", created: 30, approved: 24, rejected: 4 },
    { month: "May", created: 38, approved: 31, rejected: 5 },
    { month: "Jun", created: 42, approved: 34, rejected: 6 },
  ],
};

// ─── Managed Users (admin view) ───────────────────────────────────
export const USERS: User[] = [
  {
    id: "user1",
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "user",
    avatarUrl: undefined,
    createdAt: "2024-01-10T10:00:00Z",
    contractCount: 4,
  },
  {
    id: "user2",
    name: "Maria Garcia",
    email: "maria@example.com",
    role: "user",
    avatarUrl: undefined,
    createdAt: "2024-02-15T10:00:00Z",
    contractCount: 1,
  },
  {
    id: "user3",
    name: "James Wilson",
    email: "james@example.com",
    role: "user",
    avatarUrl: undefined,
    createdAt: "2024-03-20T10:00:00Z",
    contractCount: 7,
  },
  {
    id: "user4",
    name: "Priya Sharma",
    email: "priya@example.com",
    role: "user",
    avatarUrl: undefined,
    createdAt: "2024-04-05T10:00:00Z",
    contractCount: 3,
  },
];

// ─── AI Contract Generation Responses ────────────────────────────
export const AI_FOLLOW_UP_QUESTIONS: Record<string, string[]> = {
  employment: [
    "What is the joining date?",
    "What are the specific technical skills required?",
    "Is remote work allowed? If so, how many days per week?",
    "What is the probation period?",
    "Are there any performance bonus conditions?",
  ],
  internship: [
    "What is the internship start and end date?",
    "Is this a paid or unpaid internship?",
    "What specific projects will the intern work on?",
    "Will academic credit be provided?",
    "Is housing assistance provided?",
  ],
  freelancing: [
    "What are the specific deliverables?",
    "What is the payment schedule? (Milestone / Monthly / On completion)",
    "What revision policy should be included?",
    "Should intellectual property transfer upon payment or project completion?",
    "Are there any confidentiality requirements for this project?",
  ],
  nda: [
    "What is the purpose of sharing confidential information?",
    "How long should the NDA remain in effect?",
    "Should this be a one-way or mutual NDA?",
    "What types of information should be excluded (public domain, prior knowledge)?",
    "What jurisdiction should govern disputes?",
  ],
  consultancy: [
    "What specific consulting services will be provided?",
    "What is the hourly rate or project fee?",
    "What are the expected deliverables and timelines?",
    "Are there expenses to be reimbursed?",
    "Should a non-solicitation clause be included?",
  ],
  vendor: [
    "What products or services will the vendor supply?",
    "What are the payment terms? (Net 30, Net 60, etc.)",
    "What are the quality standards and inspection rights?",
    "What are the warranty provisions?",
    "What are the termination conditions?",
  ],
  software: [
    "What programming language(s) and tech stack are required?",
    "Is this a fixed-price or time-and-materials engagement?",
    "Who will own the source code after delivery?",
    "What are the acceptance criteria for deliverables?",
    "Are there ongoing maintenance/support provisions?",
  ],
  rental: [
    "What is the monthly rent amount?",
    "What is the security deposit amount?",
    "Are utilities included in the rent?",
    "Are pets allowed?",
    "What are the renewal terms?",
  ],
  partnership: [
    "What are each partner's contributions (capital, skills, property)?",
    "How will profits and losses be shared?",
    "How will major decisions be made?",
    "What happens when a partner wants to leave?",
    "How will disputes between partners be resolved?",
  ],
  service: [
    "What specific services will be provided?",
    "What is the service commencement date?",
    "What are the performance standards and SLAs?",
    "What are the payment milestones?",
    "What are the termination and exit provisions?",
  ],
};

export const PURPOSE_LABELS: Record<string, string> = {
  employment: "Employment Agreement",
  internship: "Internship Agreement",
  freelancing: "Freelance Agreement",
  vendor: "Vendor Agreement",
  nda: "Non-Disclosure Agreement (NDA)",
  software: "Software Development Agreement",
  consultancy: "Consultancy Agreement",
  rental: "Rental Agreement",
  partnership: "Partnership Agreement",
  service: "Service Agreement",
};
