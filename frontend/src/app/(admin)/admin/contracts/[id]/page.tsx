"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft, CheckCircle2, XCircle, MessageSquare, Edit3,
  Sparkles, FileText, User, Calendar, AlertTriangle, FileSignature, Loader2, Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CONTRACTS } from "@/lib/mock-data";
import { ContractStatus } from "@/lib/types";

type Action = "approve" | "reject" | "changes" | null;

const STATUS_LABEL: Record<ContractStatus, string> = {
  draft: "Draft",
  pending: "Pending Review",
  approved: "Approved",
  rejected: "Rejected",
  changes_requested: "Changes Requested",
};

export default function AdminContractReviewPage() {
  const { id } = useParams();
  const router = useRouter();
  const contract = CONTRACTS.find((c) => c.id === id);

  const [action, setAction] = useState<Action>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<"approved" | "rejected" | "changes" | null>(null);

  if (!contract) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Contract not found.</p>
        <Link href="/admin/contracts"><Button variant="outline" className="mt-4">Back</Button></Link>
      </div>
    );
  }

  const handleSubmit = () => {
    if (!action) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setResult(action === "approve" ? "approved" : action === "reject" ? "rejected" : "changes");
    }, 1800);
  };

  if (submitted) {
    const isApproved = result === "approved";
    const isRejected = result === "rejected";
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-2xl p-12 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className={`flex h-20 w-20 items-center justify-center rounded-full mx-auto mb-6 ${
              isApproved ? "bg-emerald-100 dark:bg-emerald-900/30" :
              isRejected ? "bg-red-100 dark:bg-red-900/30" : "bg-blue-100 dark:bg-blue-900/30"
            }`}
          >
            {isApproved ? <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" /> :
             isRejected ? <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" /> :
             <MessageSquare className="h-10 w-10 text-blue-600 dark:text-blue-400" />}
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">
            {isApproved ? "Contract Approved! ✅" : isRejected ? "Contract Rejected" : "Changes Requested 📝"}
          </h2>
          <p className="text-muted-foreground mb-8">
            {isApproved ? "The user has been notified. The contract is now officially approved and can be downloaded." :
             isRejected ? "The user has been notified about the rejection with your comments." :
             "The user has been asked to revise the contract based on your feedback."}
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => router.push("/admin/contracts")} id="admin-review-back">
              Back to Reviews
            </Button>
            <Button onClick={() => router.push("/admin")} id="admin-review-dashboard">
              Go to Dashboard
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-8">
        <Link href="/admin/contracts">
          <Button variant="outline" size="sm" className="gap-1" id="admin-review-back-btn">
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold truncate">{contract.title}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            by {contract.userName} · {new Date(contract.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Badge variant={contract.status === "pending" ? "warning" : contract.status === "approved" ? "success" : "destructive"}>
          {STATUS_LABEL[contract.status]}
        </Badge>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main review panel */}
        <div className="lg:col-span-2 space-y-5">
          {/* AI Summary */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold">AI Summary & Risk Assessment</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{contract.aiSummary}</p>
            <div>
              <div className="flex justify-between mb-1.5 text-xs">
                <span>Risk Score</span>
                <span className={`font-bold ${
                  contract.riskScore < 30 ? "text-emerald-600 dark:text-emerald-400" :
                  contract.riskScore < 60 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"
                }`}>
                  {contract.riskScore}/100 — {contract.riskScore < 30 ? "✅ Low Risk" : contract.riskScore < 60 ? "⚠️ Medium Risk" : "❌ High Risk"}
                </span>
              </div>
              <Progress
                value={contract.riskScore}
                indicatorClassName={
                  contract.riskScore < 30 ? "bg-emerald-500" :
                  contract.riskScore < 60 ? "bg-amber-500" : "bg-red-500"
                }
              />
            </div>
          </motion.div>

          {/* Contract preview */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold">Contract Preview</h2>
            </div>
            <div className="h-72 overflow-y-auto rounded-xl border border-border/50 bg-muted/30 p-4">
              <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed">
                {`${contract.title.toUpperCase()}\n\nThis contract is between ${contract.companyName} and ${contract.userName}.\n\nPurpose: ${contract.purpose}\nDepartment: ${contract.department}\nDuration: ${contract.duration}\n${contract.salary ? `Compensation: ${contract.salary}\n` : ""}Location: ${[contract.location.city, contract.location.state, contract.location.country].filter(Boolean).join(", ")}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n1. SCOPE OF WORK\nThe party agrees to perform all duties...\n\n2. COMPENSATION\n${contract.salary || "As agreed between parties"}\n\n3. CONFIDENTIALITY\nAll information shared between parties...\n\n4. INTELLECTUAL PROPERTY\nAll work product shall belong to ${contract.companyName}...\n\n5. TERMINATION\nEither party may terminate with 30 days notice...\n\n[AI Risk Score: ${contract.riskScore}/100]\n[Generated via ContractAI]\n`}
              </pre>
            </div>
          </motion.div>

          {/* Admin Action Panel */}
          {contract.status === "pending" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl p-6"
            >
              <h2 className="text-sm font-semibold mb-4">Take Action</h2>

              {/* Action buttons */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { key: "approve", label: "Approve", icon: CheckCircle2, color: "border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40" },
                  { key: "reject", label: "Reject", icon: XCircle, color: "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/40" },
                  { key: "changes", label: "Request Changes", icon: Edit3, color: "border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40" },
                ].map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = action === opt.key;
                  return (
                    <button
                      key={opt.key}
                      onClick={() => setAction(opt.key as Action)}
                      className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-sm font-medium transition-all ${opt.color} ${
                        isSelected ? "ring-2 ring-offset-2 ring-primary scale-105" : ""
                      }`}
                      id={`admin-action-${opt.key}`}
                    >
                      <Icon className="h-5 w-5" />
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              {/* Comment */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1.5" htmlFor="admin-comment">
                  {action === "approve" ? "Optional note to user" : "Comment for user *"}
                </label>
                <textarea
                  id="admin-comment"
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={
                    action === "approve" ? "Add a congratulatory note..." :
                    action === "reject" ? "Explain why this contract is rejected..." :
                    "Describe what changes are needed..."
                  }
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 resize-none"
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!action || isSubmitting || (action !== "approve" && !comment.trim())}
                className="w-full gap-2"
                size="lg"
                id="admin-submit-action"
              >
                {isSubmitting ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</>
                ) : action === "approve" ? (
                  <><CheckCircle2 className="h-4 w-4" /> Approve Contract</>
                ) : action === "reject" ? (
                  <><XCircle className="h-4 w-4" /> Reject Contract</>
                ) : (
                  <><MessageSquare className="h-4 w-4" /> Send Change Request</>
                )}
              </Button>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {/* Submitter info */}
          <div className="glass-card rounded-2xl p-5">
            <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <User className="h-4 w-4 text-primary" /> Submitted By
            </h2>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                {contract.userName[0]}
              </div>
              <div>
                <p className="text-sm font-medium">{contract.userName}</p>
                <p className="text-xs text-muted-foreground">{contract.userEmail}</p>
              </div>
            </div>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Purpose</span>
                <span className="font-medium text-foreground capitalize">{contract.purpose}</span>
              </div>
              <div className="flex justify-between">
                <span>Department</span>
                <span className="font-medium text-foreground">{contract.department}</span>
              </div>
              <div className="flex justify-between">
                <span>Duration</span>
                <span className="font-medium text-foreground">{contract.duration}</span>
              </div>
              {contract.salary && (
                <div className="flex justify-between">
                  <span>Salary</span>
                  <span className="font-medium text-foreground">{contract.salary}</span>
                </div>
              )}
            </div>
          </div>

          {/* Digital signature panel */}
          <div className="glass-card rounded-2xl p-5">
            <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <FileSignature className="h-4 w-4 text-primary" /> Digital Signature
            </h2>
            <p className="text-xs text-muted-foreground mb-3">
              Apply your company signature to approve this contract officially.
            </p>
            <div className="rounded-xl border-2 border-dashed border-border/50 p-4 text-center">
              <Shield className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Click to apply company seal</p>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-3 gap-1.5" id="admin-apply-seal">
              <FileSignature className="h-3.5 w-3.5" />
              Apply Company Seal
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
