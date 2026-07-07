"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search, Clock, CheckCircle2, XCircle, FileText, ArrowRight, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CONTRACTS } from "@/lib/mock-data";
import { ContractStatus } from "@/lib/types";

const STATUS_CONFIG: Record<ContractStatus, { label: string; variant: "default" | "success" | "warning" | "destructive" | "info" | "secondary" | "outline" }> = {
  draft: { label: "Draft", variant: "secondary" },
  pending: { label: "Pending Review", variant: "warning" },
  approved: { label: "Approved", variant: "success" },
  rejected: { label: "Rejected", variant: "destructive" },
  changes_requested: { label: "Changes Needed", variant: "info" },
};

const FILTERS = ["All", "Pending", "Approved", "Rejected", "Changes Needed"];

export default function AdminContractsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = CONTRACTS.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.userName.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "All" ||
      (filter === "Pending" && c.status === "pending") ||
      (filter === "Approved" && c.status === "approved") ||
      (filter === "Rejected" && c.status === "rejected") ||
      (filter === "Changes Needed" && c.status === "changes_requested");
    return matchSearch && matchFilter;
  });

  const pendingCount = CONTRACTS.filter((c) => c.status === "pending").length;

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          Contract Reviews
          {pendingCount > 0 && (
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-white">
              {pendingCount}
            </span>
          )}
        </h1>
        <p className="text-muted-foreground mt-1">Review, approve, or reject contract submissions from users.</p>
      </motion.div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search contracts or users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-input bg-background pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
            id="admin-contracts-search"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
              id={`admin-filter-${f.toLowerCase().replace(/\s/g, "-")}`}
            >
              {f}
              {f === "Pending" && pendingCount > 0 && (
                <span className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] text-white font-bold">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Contracts */}
      <div className="space-y-3">
        {filtered.map((contract, i) => {
          const status = STATUS_CONFIG[contract.status];
          const isPending = contract.status === "pending";
          return (
            <motion.div
              key={contract.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`glass-card rounded-xl overflow-hidden ${isPending ? "border-l-2 border-amber-500" : ""}`}
            >
              <Link
                href={`/admin/contracts/${contract.id}`}
                className="flex items-center gap-4 px-5 py-4 hover:bg-accent/50 transition-colors group"
                id={`admin-contract-row-${contract.id}`}
              >
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                  isPending ? "bg-amber-100 dark:bg-amber-900/30" : "bg-muted"
                }`}>
                  {isPending ? <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" /> : <FileText className="h-5 w-5 text-muted-foreground" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold truncate">{contract.title}</p>
                    <Badge variant={status.variant}>{status.label}</Badge>
                    {isPending && <Badge variant="warning" className="animate-pulse">Needs Review</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Submitted by <span className="font-medium">{contract.userName}</span> ({contract.userEmail}) · {new Date(contract.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                    contract.riskScore < 30 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                    contract.riskScore < 60 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}>
                    Risk {contract.riskScore}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-muted-foreground">No contracts found.</p>
        </div>
      )}
    </div>
  );
}
