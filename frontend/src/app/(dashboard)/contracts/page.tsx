"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  FileText,
  PlusCircle,
  Search,
  Filter,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CONTRACTS } from "@/lib/mock-data";
import { ContractStatus } from "@/lib/types";
import { useState } from "react";

const STATUS_CONFIG: Record<ContractStatus, { label: string; variant: "default" | "success" | "warning" | "destructive" | "info" | "secondary" | "outline"; icon: React.ElementType }> = {
  draft: { label: "Draft", variant: "secondary", icon: FileText },
  pending: { label: "Pending Review", variant: "warning", icon: Clock },
  approved: { label: "Approved", variant: "success", icon: CheckCircle2 },
  rejected: { label: "Rejected", variant: "destructive", icon: XCircle },
  changes_requested: { label: "Changes Needed", variant: "info", icon: AlertCircle },
};

const FILTER_OPTIONS = ["All", "Draft", "Pending", "Approved", "Rejected", "Changes Needed"];

export default function ContractsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = CONTRACTS.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.companyName.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "All" ||
      (filter === "Pending" && c.status === "pending") ||
      (filter === "Approved" && c.status === "approved") ||
      (filter === "Rejected" && c.status === "rejected") ||
      (filter === "Draft" && c.status === "draft") ||
      (filter === "Changes Needed" && c.status === "changes_requested");
    return matchSearch && matchFilter;
  });

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-2xl font-bold">My Contracts</h1>
          <p className="text-muted-foreground mt-1">{CONTRACTS.length} contracts total</p>
        </div>
        <Link href="/contracts/create">
          <Button className="gap-2" id="contracts-create-new">
            <PlusCircle className="h-4 w-4" />
            New Contract
          </Button>
        </Link>
      </motion.div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3 mb-6"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search contracts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-input bg-background pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
            id="contracts-search"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
          {FILTER_OPTIONS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
              id={`contracts-filter-${f.toLowerCase().replace(/\s/g, "-")}`}
            >
              {f}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Contracts List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">No contracts found.</p>
            <Link href="/contracts/create" className="mt-4 inline-block">
              <Button size="sm" className="gap-1.5" id="contracts-create-first">
                <PlusCircle className="h-4 w-4" /> Create your first contract
              </Button>
            </Link>
          </div>
        ) : (
          filtered.map((contract, i) => {
            const status = STATUS_CONFIG[contract.status];
            const Icon = status.icon;
            return (
              <motion.div
                key={contract.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="glass-card rounded-xl overflow-hidden group"
              >
                <div className="flex items-center gap-4 p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm truncate">{contract.title}</p>
                      <Badge variant={status.variant} className="shrink-0">
                        <Icon className="h-3 w-3 mr-1" />
                        {status.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>{contract.companyName}</span>
                      <span>·</span>
                      <span>{contract.department}</span>
                      <span>·</span>
                      <span>{new Date(contract.createdAt).toLocaleDateString()}</span>
                      {contract.salary && (
                        <>
                          <span>·</span>
                          <span>{contract.salary}</span>
                        </>
                      )}
                    </div>
                    {contract.adminComment && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 truncate">
                        💬 Admin: {contract.adminComment}
                      </p>
                    )}
                  </div>

                  {/* Risk Score */}
                  <div className="hidden sm:flex items-center gap-1 shrink-0">
                    <div
                      className={`text-xs font-bold px-2 py-1 rounded-md ${
                        contract.riskScore < 30
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : contract.riskScore < 60
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      Risk: {contract.riskScore}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {contract.status === "approved" && (
                      <Button variant="outline" size="sm" className="gap-1" id={`contract-download-${contract.id}`}>
                        <Download className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Download</span>
                      </Button>
                    )}
                    <Link href={`/contracts/${contract.id}`}>
                      <Button variant="ghost" size="sm" className="gap-1" id={`contract-view-${contract.id}`}>
                        <Eye className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">View</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
