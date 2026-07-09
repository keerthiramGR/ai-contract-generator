"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Bot,
  Send,
  FileText,
  CheckCircle2,
  Loader2,
  Download,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AI_FOLLOW_UP_QUESTIONS, PURPOSE_LABELS } from "@/lib/mock-data";
import { ContractPurpose, Department, ContractDuration, ChatMessage } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";

type Step = 1 | 2 | 3 | 4;

interface FormData {
  companyId: string;
  purpose: ContractPurpose | "";
  department: Department | "";
  country: string;
  state: string;
  city: string;
  duration: ContractDuration | "";
  salary: string;
  projectType: string;
  additionalNotes: string;
  rentAmount?: string;
  houseType?: string;
  landlordName?: string;
  tenantName?: string;
}

const PURPOSES: { value: ContractPurpose; label: string }[] = [
  { value: "employment", label: "Employment Agreement" },
  { value: "internship", label: "Internship Agreement" },
  { value: "freelancing", label: "Freelancing Agreement" },
  { value: "vendor", label: "Vendor Agreement" },
  { value: "nda", label: "Non-Disclosure Agreement (NDA)" },
  { value: "software", label: "Software Development Agreement" },
  { value: "consultancy", label: "Consultancy Agreement" },
  { value: "rental", label: "Rental Agreement" },
  { value: "partnership", label: "Partnership Agreement" },
  { value: "service", label: "Service Agreement" },
];

const DEPARTMENTS: Department[] = ["IT", "HR", "Finance", "Marketing", "Operations", "Legal", "Sales"];
const DURATIONS: { value: ContractDuration; label: string }[] = [
  { value: "3months", label: "3 Months" },
  { value: "6months", label: "6 Months" },
  { value: "1year", label: "1 Year" },
  { value: "2years", label: "2 Years" },
  { value: "custom", label: "Custom Duration" },
];

function generateContract(form: FormData, answers: string[], companyName: string = "Company"): ReactNode {
  const purposeLabel = form.purpose ? PURPOSE_LABELS[form.purpose] : "Agreement";
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  if (form.purpose === 'rental') {
    return (
      <div className="bg-[#fdfcf0] text-black p-8 max-w-3xl mx-auto shadow-sm min-h-[800px] relative font-serif">
        {/* Stamp Paper Header Mock */}
        <div className="border-b-4 border-double border-gray-400 pb-4 mb-8 flex flex-col items-center justify-center text-center">
          <div className="w-full flex justify-between items-start mb-4 px-4">
             <div className="w-28 h-32 border-[3px] border-green-600 bg-green-50 flex flex-col items-center justify-center text-green-700 font-bold text-center p-2">
                <span className="text-sm">पचास रुपये</span>
                <span className="text-2xl my-2">Rs. 50</span>
                <span className="text-[10px] leading-tight">INDIA NON JUDICIAL</span>
             </div>
             <div className="flex flex-col items-center mt-2">
                <div className="h-16 w-16 opacity-80 mb-2">
                   {/* Mock Lion Capital Emblem */}
                   <svg viewBox="0 0 100 100" fill="currentColor" className="text-pink-600">
                     <path d="M50 10 C30 10 20 30 20 50 C20 70 30 90 50 90 C70 90 80 70 80 50 C80 30 70 10 50 10 Z M50 20 C60 20 70 35 70 50 C70 65 60 80 50 80 C40 80 30 65 30 50 C30 35 40 20 50 20 Z" />
                     <circle cx="50" cy="50" r="10" />
                   </svg>
                </div>
                <h2 className="text-xl font-bold tracking-widest uppercase text-pink-600">भारत INDIA</h2>
             </div>
             <div className="w-28 h-32 border-[3px] border-red-600 bg-red-50 flex flex-col items-center justify-center text-red-700 font-bold text-center p-2">
                <span className="text-sm">FIFTY RUPEES</span>
                <span className="text-2xl my-2">Rs. 50</span>
                <span className="text-[10px] leading-tight">INDIA NON JUDICIAL</span>
             </div>
          </div>
          <h3 className="text-lg font-bold uppercase text-gray-700 mt-2">தமிழ்நாடு  Tamilnadu</h3>
        </div>

        <h3 className="text-center font-bold text-xl mb-8">Rental Agreement</h3>
        
        <p className="text-justify leading-loose mb-4">
          THIS LEASE DEED is made and executed at <strong>{form.city || 'Chennai'}</strong> on this <strong>{today}</strong> 
          by and between <strong>{form.landlordName || '[Landlord Name]'}</strong> (hereinafter jointly and severally 
          called the "Landlady/Landlord", which expression shall include their heirs, legal representatives, successors and assigns).
        </p>

        <p className="text-center font-bold my-4">AND</p>

        <p className="text-justify leading-loose mb-8">
          <strong>{form.tenantName || '[Tenant Name]'}</strong> having permanent address at <strong>{form.state || '[State]'}, {form.country || 'India'}</strong> 
          and having ID card issued by Government Of India, (hereinafter called the "Tenant", which expression shall include their legal representatives, successors and assigns).
        </p>

        <div className="space-y-4 mb-12">
          <p><strong>1. Details of Premises:</strong> A <strong>{form.houseType || 'residential'}</strong> property located in <strong>{form.city || '[City]'}</strong>.</p>
          <p><strong>2. Rent Amount:</strong> The monthly rent shall be <strong>{form.rentAmount || '[Amount]'}</strong>.</p>
          <p><strong>3. Duration:</strong> This agreement is valid for a period of <strong>{DURATIONS.find((d) => d.value === form.duration)?.label || "As agreed"}</strong>.</p>
          {form.additionalNotes && <p><strong>4. Additional Terms:</strong> {form.additionalNotes}</p>}
        </div>

        <div className="mt-16 grid grid-cols-2 gap-12">
           <div>
              <p className="font-bold mb-4">Tenant Signature:</p>
              <div className="border border-dashed border-gray-400 p-4 bg-gray-50/50 flex flex-col items-center justify-center h-32 hover:bg-gray-100 transition-colors">
                 <label className="cursor-pointer flex flex-col items-center w-full h-full justify-center">
                    <Download className="h-6 w-6 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Upload Signature Image</span>
                    <input type="file" className="hidden" accept="image/*" />
                 </label>
              </div>
           </div>
           <div>
              <p className="font-bold mb-4">Government Sign / Stamp:</p>
              <div className="border border-solid border-gray-300 p-4 h-32 flex items-center justify-center">
                 <span className="text-gray-300 uppercase tracking-widest text-sm">Official Stamp Space</span>
              </div>
           </div>
        </div>
      </div>
    );
  }

  const contractText = `${companyName.toUpperCase()} ${purposeLabel.toUpperCase()}

This ${purposeLabel} ("Agreement") is entered into as of ${today} between ${companyName} ("Company") and [EMPLOYEE/PARTY NAME] ("Party").

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. SCOPE & PURPOSE
This Agreement governs the ${purposeLabel.toLowerCase()} relationship between the Company and the Party for the ${form.department || "designated"} department.

Contract Duration: ${DURATIONS.find((d) => d.value === form.duration)?.label || "As agreed"}
Location: ${[form.city, form.state, form.country].filter(Boolean).join(", ") || "As agreed"}
${form.salary ? `Compensation: ${form.salary}` : ""}
${form.projectType ? `Project Type: ${form.projectType}` : ""}

2. RESPONSIBILITIES
The Party agrees to fulfill all duties and responsibilities as outlined by the Company for the ${form.department || "assigned"} department, including but not limited to:
- Completing all assigned tasks within agreed timelines
- Maintaining professional standards and conduct
- Adhering to Company policies and procedures
- Communicating proactively regarding progress and issues

3. COMPENSATION & PAYMENT
${form.salary ? `Base Compensation: ${form.salary}` : "Compensation shall be as mutually agreed upon."}
Payment terms are subject to the standard Company payroll schedule.
All applicable taxes and deductions shall be handled in accordance with local law.

4. INTELLECTUAL PROPERTY
All work product, inventions, developments, and intellectual property created by the Party during the term of this Agreement shall be the sole and exclusive property of ${companyName}.

The Party agrees to execute any documents necessary to perfect the Company's ownership rights.

5. CONFIDENTIALITY
The Party agrees to maintain strict confidentiality of all proprietary information, trade secrets, and business data during and after the term of this Agreement.

Confidential information includes, but is not limited to:
- Business strategies and plans
- Technical specifications and source code
- Customer and employee data
- Financial information

6. NON-COMPETE & NON-SOLICITATION
During the term of this Agreement and for a period of 12 months thereafter, the Party agrees not to:
- Engage in activities directly competing with the Company's business
- Solicit the Company's clients or customers
- Solicit or hire the Company's employees

7. TERMINATION
Either party may terminate this Agreement with 30 days written notice.
The Company may terminate immediately for cause, including:
- Material breach of this Agreement
- Gross misconduct or negligence
- Violation of confidentiality obligations

8. GOVERNING LAW & DISPUTE RESOLUTION
This Agreement shall be governed by the laws of ${form.country || "the applicable jurisdiction"}.
Any disputes shall be resolved through binding arbitration.

9. ADDITIONAL PROVISIONS
${form.additionalNotes || "No additional provisions at this time."}
${answers.length > 0 ? "\nAdditional agreed terms:\n" + answers.map((a, i) => `${i + 1}. ${a}`).join("\n") : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SIGNATURES

By signing below, both parties agree to the terms and conditions set forth in this Agreement.

COMPANY:                          PARTY:

___________________________       ___________________________
Authorized Representative         Signature

___________________________       ___________________________
Print Name                        Print Name

___________________________       ___________________________
Title                             Date

Date: _____________________

[COMPANY SEAL]                    [Official Company Stamp]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This document was AI-generated via Accord and is pending official company review and approval.
Document ID: ACC-${Math.random().toString(36).substring(2, 10).toUpperCase()}
Generated: ${new Date().toISOString()}`;
  return <pre className="contract-document text-xs text-foreground whitespace-pre-wrap font-mono leading-relaxed">{contractText}</pre>;
}

const AI_INTRO_DELAY = 800;

export default function CreateContractPage() {
  const { user } = useUser();
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [companies, setCompanies] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [form, setForm] = useState<FormData>({
    companyId: "", purpose: "", department: "", country: "",
    state: "", city: "", duration: "", salary: "", projectType: "", additionalNotes: "",
  });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [generatedContract, setGeneratedContract] = useState<ReactNode>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rawContractText, setRawContractText] = useState("");
  const [aiSummary, setAiSummary] = useState("");
  const [riskScore, setRiskScore] = useState(25);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const questions = form.purpose ? (AI_FOLLOW_UP_QUESTIONS[form.purpose] || []) : [];

  useEffect(() => {
    async function loadData() {
      // 1. Fetch companies
      const { data: cos } = await supabase.from("companies").select("*");
      if (cos) {
        setCompanies(cos.map(c => ({ id: c.id, name: c.company_name, verified: c.status === 'approved' })));
      }
      
      // 2. Fetch templates
      const { data: temps } = await supabase.from("contract_templates").select("*");
      if (temps) {
        setTemplates(temps.map(t => ({ id: t.id, companyId: t.company_id, purpose: t.purpose || 'custom' })));
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Initialize chat when entering step 2
  useEffect(() => {
    if (step === 2 && messages.length === 0) {
      const company = companies.find((c) => c.id === form.companyId);
      const template = templates.find((t) => t.companyId === form.companyId && t.purpose === form.purpose);

      setTimeout(() => {
        setMessages([
          {
            id: "init-1",
            role: "assistant",
            content: `Great! I'm ready to help generate your **${PURPOSE_LABELS[form.purpose as ContractPurpose] || "contract"}** for **${company?.name || "the selected company"}**.\n\n${template ? `✅ I found an official **${company?.name}** template for this contract type.\n\n` : ""}I'll ask a few targeted questions to complete your contract. Let's begin:`,
            timestamp: new Date().toISOString(),
          },
        ]);
      }, AI_INTRO_DELAY);

      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          if (questions.length > 0) {
            setMessages((prev) => [
              ...prev,
              {
                id: "q-0",
                role: "assistant",
                content: questions[0],
                timestamp: new Date().toISOString(),
              },
            ]);
          }
        }, 1200);
      }, AI_INTRO_DELAY + 500);
    }
  }, [step, companies, templates]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setAnswers((prev) => [...prev, input.trim()]);
    setInput("");

    const nextIndex = questionIndex + 1;
    setQuestionIndex(nextIndex);

    if (nextIndex < questions.length) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: `q-${nextIndex}`,
            role: "assistant",
            content: questions[nextIndex],
            timestamp: new Date().toISOString(),
          },
        ]);
      }, 1000 + Math.random() * 500);
    } else {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: "done",
            role: "assistant",
            content: "✅ **Perfect! I have all the information I need.**\n\nClick **\"Generate Contract\"** below to create your professional contract.",
            timestamp: new Date().toISOString(),
          },
        ]);
      }, 1000);
    }
  };

  const handleGenerateContract = async () => {
    setIsGenerating(true);
    const company = companies.find((c) => c.id === form.companyId);
    
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          companyName: company?.name || "Company",
          answers,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate contract via AI API");
      }

      const data = await response.json();
      setRawContractText(data.generated_content);
      setAiSummary(data.ai_summary);
      setRiskScore(data.risk_score);

      // Render the contract
      if (form.purpose === 'rental') {
        const contractNode = generateContract(form, answers, company?.name || "Company");
        setGeneratedContract(contractNode);
      } else {
        setGeneratedContract(
          <pre className="contract-document text-xs text-foreground whitespace-pre-wrap font-mono leading-relaxed p-4 bg-muted/20 rounded-lg max-h-[60vh] overflow-y-auto border border-border/50">
            {data.generated_content}
          </pre>
        );
      }

      setStep(3);
    } catch (err) {
      console.error(err);
      // Fallback in case of error (e.g. no Gemini key configured yet)
      const fallbackText = `CONTRACT AGREEMENT - FALLBACK MODE\n\nFailed to reach Gemini API. Please configure GEMINI_API_KEY in .env.local.\n\nDate: ${new Date().toLocaleDateString()}\nCompany: ${company?.name || "Company"}\nPurpose: ${PURPOSE_LABELS[form.purpose as ContractPurpose] || "Contract"}\nDepartment: ${form.department || "Legal"}`;
      setRawContractText(fallbackText);
      setAiSummary("Local fallback generated due to API error. Please check environment variables.");
      setRiskScore(15);
      setGeneratedContract(
        <pre className="contract-document text-xs text-foreground whitespace-pre-wrap font-mono leading-relaxed p-4 bg-muted/20 rounded-lg max-h-[60vh] overflow-y-auto border border-border/50">
          {fallbackText}
        </pre>
      );
      setStep(3);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmitForReview = async () => {
    if (!user) return;
    setIsGenerating(true);

    const company = companies.find((c) => c.id === form.companyId);
    const contractTitle = form.purpose === 'rental' 
      ? `Rental Agreement - ${form.tenantName || 'Tenant'}`
      : `${PURPOSE_LABELS[form.purpose as ContractPurpose] || 'Contract'} - ${form.department || 'Legal'}`;

    const newContract = {
      user_id: user.id,
      company_id: form.companyId || null,
      title: contractTitle,
      purpose: form.purpose || 'custom',
      generated_content: rawContractText || "No content generated.",
      ai_summary: aiSummary || `This is an AI-generated ${form.purpose} agreement.`,
      risk_score: riskScore || 20,
      status: 'Pending Review',
    };

    const { error } = await supabase
      .from("contracts")
      .insert(newContract);

    setIsGenerating(false);
    if (!error) {
      setStep(4);
    } else {
      console.error("Error creating contract in Supabase:", error);
    }
  };

  const isStep1Valid = form.purpose === 'rental' 
    ? (form.companyId && form.duration && form.houseType && form.rentAmount && form.landlordName && form.tenantName)
    : (form.companyId && form.purpose && form.department && form.duration);

  const STEP_LABELS = ["Contract Details", "AI Q&A", "Review Contract", "Submitted"];

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Create Contract</h1>
        <p className="text-muted-foreground mt-1">Generate a professional AI-powered contract in minutes.</p>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-2 mb-8">
        {STEP_LABELS.map((label, i) => {
          const stepNum = (i + 1) as Step;
          const isActive = step === stepNum;
          const isDone = step > stepNum;
          return (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all ${
                isActive ? "bg-primary text-primary-foreground" :
                isDone ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
              }`}>
                {isDone ? <CheckCircle2 className="h-4 w-4" /> : stepNum}
              </div>
              <span className={`text-sm hidden sm:block ${isActive ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                {label}
              </span>
              {i < STEP_LABELS.length - 1 && (
                <div className={`flex-1 h-0.5 rounded-full ${isDone ? "bg-emerald-500" : "bg-border"}`} />
              )}
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {/* ── Step 1: Smart Dropdowns ── */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-card rounded-2xl p-6 lg:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Contract Details</h2>
                <p className="text-sm text-muted-foreground">Fill in the basic information to get started.</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {/* Company */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1.5" htmlFor="select-company">Company</label>
                <Select
                  id="select-company"
                  value={form.companyId}
                  onChange={(e) => setForm({ ...form, companyId: e.target.value })}
                  className="h-10"
                >
                  <option value="">▼ Select Company</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} {c.verified ? "✓" : ""}</option>
                  ))}
                </Select>
              </div>

              {/* Purpose */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1.5" htmlFor="select-purpose">Contract Purpose</label>
                <Select
                  id="select-purpose"
                  value={form.purpose}
                  onChange={(e) => setForm({ ...form, purpose: e.target.value as ContractPurpose })}
                  className="h-10"
                >
                  <option value="">▼ Select Purpose</option>
                  {PURPOSES.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </Select>
              </div>

              {/* Department - hide for rental */}
              {form.purpose !== 'rental' && (
                <div>
                  <label className="block text-sm font-medium mb-1.5" htmlFor="select-department">Department</label>
                  <Select
                    id="select-department"
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value as Department })}
                    className="h-10"
                  >
                    <option value="">▼ Select Department</option>
                    {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </Select>
                </div>
              )}

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium mb-1.5" htmlFor="select-duration">Contract Duration</label>
                <Select
                  id="select-duration"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value as ContractDuration })}
                  className="h-10"
                >
                  <option value="">▼ Select Duration</option>
                  {DURATIONS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                </Select>
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium mb-1.5" htmlFor="input-country">Country</label>
                <input
                  id="input-country"
                  type="text"
                  placeholder="e.g. United States"
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring placeholder:text-muted-foreground"
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium mb-1.5" htmlFor="input-state">State / Region</label>
                <input
                  id="input-state"
                  type="text"
                  placeholder="e.g. California"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring placeholder:text-muted-foreground"
                />
              </div>

              {/* Conditional Non-Rental Fields */}
              {form.purpose !== 'rental' && (
                <>
                  {/* Salary */}
                  <div>
                    <label className="block text-sm font-medium mb-1.5" htmlFor="input-salary">Salary / Budget</label>
                    <input
                      id="input-salary"
                      type="text"
                      placeholder="e.g. $120,000/year"
                      value={form.salary}
                      onChange={(e) => setForm({ ...form, salary: e.target.value })}
                      className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring placeholder:text-muted-foreground"
                    />
                  </div>

                  {/* Project Type */}
                  <div>
                    <label className="block text-sm font-medium mb-1.5" htmlFor="input-project-type">Project Type</label>
                    <input
                      id="input-project-type"
                      type="text"
                      placeholder="e.g. Full-time, Part-time"
                      value={form.projectType}
                      onChange={(e) => setForm({ ...form, projectType: e.target.value })}
                      className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring placeholder:text-muted-foreground"
                    />
                  </div>
                </>
              )}

              {/* Conditional Rental Fields */}
              {form.purpose === 'rental' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" htmlFor="input-landlord">Landlord Name</label>
                    <input
                      id="input-landlord"
                      type="text"
                      placeholder="e.g. John Doe"
                      value={form.landlordName || ''}
                      onChange={(e) => setForm({ ...form, landlordName: e.target.value })}
                      className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring placeholder:text-muted-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" htmlFor="input-tenant">Tenant Name</label>
                    <input
                      id="input-tenant"
                      type="text"
                      placeholder="e.g. Jane Smith"
                      value={form.tenantName || ''}
                      onChange={(e) => setForm({ ...form, tenantName: e.target.value })}
                      className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring placeholder:text-muted-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" htmlFor="input-house-type">House Type</label>
                    <Select
                      id="input-house-type"
                      value={form.houseType || ''}
                      onChange={(e) => setForm({ ...form, houseType: e.target.value })}
                      className="h-10"
                    >
                      <option value="">▼ Select Type</option>
                      <option value="1 BHK">1 BHK</option>
                      <option value="2 BHK">2 BHK</option>
                      <option value="3 BHK">3 BHK</option>
                      <option value="4+ BHK">4+ BHK</option>
                      <option value="Villa/Independent House">Villa / Independent House</option>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" htmlFor="input-rent">Rent Amount (Monthly)</label>
                    <input
                      id="input-rent"
                      type="text"
                      placeholder="e.g. ₹15,000"
                      value={form.rentAmount || ''}
                      onChange={(e) => setForm({ ...form, rentAmount: e.target.value })}
                      className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring placeholder:text-muted-foreground"
                    />
                  </div>
                </>
              )}

              {/* Notes */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1.5" htmlFor="input-notes">Additional Notes (Optional)</label>
                <textarea
                  id="input-notes"
                  rows={3}
                  placeholder="Any special requirements or notes..."
                  value={form.additionalNotes}
                  onChange={(e) => setForm({ ...form, additionalNotes: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring placeholder:text-muted-foreground resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                onClick={() => setStep(2)}
                disabled={!isStep1Valid}
                className="gap-2"
                id="create-next-step-1"
              >
                Continue to AI Q&A
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* ── Step 2: AI Chat ── */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-card rounded-2xl overflow-hidden flex flex-col"
            style={{ height: "70vh" }}
          >
            {/* Chat header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-border/50">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Accord Assistant</p>
                <p className="text-xs text-muted-foreground">Gathering contract details</p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Badge variant="success">
                  Question {Math.min(questionIndex + 1, questions.length)} / {questions.length}
                </Badge>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 mr-2 mt-0.5">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"
                    }`}
                  >
                    {msg.content.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
                      part.startsWith("**") && part.endsWith("**") ? (
                        <strong key={i}>{part.slice(2, -2)}</strong>
                      ) : (
                        <span key={i}>{part}</span>
                      )
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 mr-2 mt-0.5">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="chat-bubble-ai rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input area */}
            <div className="px-4 py-4 border-t border-border/50">
              {questionIndex >= questions.length && answers.length >= questions.length ? (
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)} className="gap-1" id="create-back-step-2">
                    <ChevronLeft className="h-4 w-4" /> Back
                  </Button>
                  <Button
                    onClick={handleGenerateContract}
                    disabled={isGenerating}
                    className="flex-1 gap-2"
                    id="create-generate-contract"
                  >
                    {isGenerating ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Generating Contract...</>
                    ) : (
                      <><Sparkles className="h-4 w-4" /> Generate Contract</>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type your answer..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                    className="flex-1 rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring"
                    id="chat-input"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isTyping}
                    size="icon"
                    className="h-10 w-10 rounded-xl shrink-0"
                    id="chat-send"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── Step 3: Preview Contract ── */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {/* Risk score bar */}
            <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">AI Risk Assessment</p>
                <p className="text-xs text-muted-foreground">Contract generated successfully. Low risk detected.</p>
              </div>
              <Badge variant="success">Risk Score: 14/100</Badge>
            </div>

            {/* Contract document */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Generated Contract Preview</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setStep(2)} id="create-back-step-3">
                    <ChevronLeft className="h-4 w-4 mr-1" /> Back
                  </Button>
                  <Button variant="outline" size="sm" id="create-download-preview">
                    <Download className="h-4 w-4 mr-1" /> Download Draft
                  </Button>
                </div>
              </div>

              <div className={`h-96 overflow-y-auto rounded-xl border border-border/50 p-6 ${form.purpose === 'rental' ? 'bg-gray-100' : 'bg-background'}`}>
                {generatedContract}
              </div>

              <div className="mt-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40">
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-400 mb-1">
                  📋 Ready for Company Review
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-400/80">
                  This contract will be submitted to the company&apos;s admin dashboard for review and approval.
                  You&apos;ll receive a notification once the company takes action.
                </p>
              </div>

              <Button
                onClick={handleSubmitForReview}
                disabled={isGenerating}
                className="w-full mt-4 gap-2"
                size="lg"
                id="create-submit-review"
              >
                {isGenerating ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</>
                ) : (
                  <>Submit for Company Review <ChevronRight className="h-4 w-4" /></>
                )}
              </Button>
            </div>
          </motion.div>
        )}

        {/* ── Step 4: Submitted ── */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-12 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 mx-auto mb-6"
            >
              <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">Contract Submitted! 🎉</h2>
            <p className="text-muted-foreground mb-2">
              Your contract has been submitted to{" "}
              <strong>{companies.find((c) => c.id === form.companyId)?.name}</strong> for review.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              You&apos;ll receive a notification once the company admin reviews your contract.
              Average review time is <strong>2.4 days</strong>.
            </p>

            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="flex h-2 w-2 rounded-full bg-amber-400" />
                Pending Company Review
              </div>
            </div>

            <div className="flex justify-center gap-3 mt-8">
              <Button variant="outline" onClick={() => router.push("/contracts")} id="create-view-contracts">
                View My Contracts
              </Button>
              <Button onClick={() => { setStep(1); setMessages([]); setAnswers([]); setQuestionIndex(0); setForm({ companyId: "", purpose: "", department: "", country: "", state: "", city: "", duration: "", salary: "", projectType: "", additionalNotes: "" }); }} id="create-new-contract">
                <PlusCircle className="h-4 w-4 mr-1" /> Create Another
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
