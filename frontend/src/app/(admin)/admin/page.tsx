"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  FileText, Clock, CheckCircle2, XCircle, TrendingUp, Users, BarChart3, ArrowRight, Activity, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ContractStatus } from "@/lib/types";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const STATUS_VARIANT: Record<ContractStatus, "default" | "success" | "warning" | "destructive" | "info" | "secondary" | "outline"> = {
  draft: "secondary",
  pending: "warning",
  approved: "success",
  rejected: "destructive",
  changes_requested: "info",
};

const STATUS_LABELS: Record<ContractStatus, string> = {
  draft: "Draft",
  pending: "Pending Review",
  approved: "Approved",
  rejected: "Rejected",
  changes_requested: "Changes Needed",
};

export default function AdminDashboard() {
  const [contracts, setContracts] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>({
    totalContracts: 0,
    pendingContracts: 0,
    approvedContracts: 0,
    avgApprovalDays: 1.8,
    monthlyData: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      const { data: contractsData, error } = await supabase
        .from("contracts")
        .select("*, companies(company_name), profiles(full_name)");

      if (!error && contractsData) {
        setContracts(contractsData.map((c: any) => ({
          id: c.id,
          title: c.title,
          status: c.status.toLowerCase().replace(/\s+/g, "_") as ContractStatus,
          createdAt: c.created_at,
          companyName: c.companies?.company_name || c.purpose || "Contract",
          userName: c.profiles?.full_name || "User",
          riskScore: c.risk_score || 0,
        })));

        const pendingCount = contractsData.filter((c: any) => c.status === "Pending Review").length;
        const approvedCount = contractsData.filter((c: any) => c.status === "Approved").length;

        // Group by month for last 6 months
        const monthlyMap: Record<string, { month: string; created: number; approved: number; rejected: number }> = {};
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const currentMonth = new Date().getMonth();
        for (let i = 5; i >= 0; i--) {
          const mIdx = (currentMonth - i + 12) % 12;
          const mName = months[mIdx];
          monthlyMap[mName] = { month: mName, created: 0, approved: 0, rejected: 0 };
        }

        contractsData.forEach((c: any) => {
          const date = new Date(c.created_at);
          const mName = months[date.getMonth()];
          if (monthlyMap[mName]) {
            monthlyMap[mName].created += 1;
            if (c.status === "Approved") monthlyMap[mName].approved += 1;
            if (c.status === "Rejected") monthlyMap[mName].rejected += 1;
          }
        });

        setAnalytics({
          totalContracts: contractsData.length,
          pendingContracts: pendingCount,
          approvedContracts: approvedCount,
          avgApprovalDays: 1.8,
          monthlyData: Object.values(monthlyMap),
        });
      }
      setLoading(false);
    }
    loadAdminData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const pending = contracts.filter((c) => c.status === "pending" || c.status === "pending_review");

  const stats = [
    { label: "Total Contracts", value: analytics.totalContracts, icon: FileText, trend: "+12%", color: "from-violet-500 to-purple-600" },
    { label: "Pending Review", value: analytics.pendingContracts, icon: Clock, trend: `${pending.length} urgent`, color: "from-amber-500 to-orange-600" },
    { label: "Approved", value: analytics.approvedContracts, icon: CheckCircle2, trend: "+8%", color: "from-emerald-500 to-teal-600" },
    { label: "Avg. Approval Time", value: `${analytics.avgApprovalDays}d`, icon: Zap, trend: "↓ faster", color: "from-blue-500 to-cyan-600" },
  ];

  const maxMonthly = Math.max(...analytics.monthlyData.map((m: any) => m.created), 1);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Microsoft Corporation · Contract Management</p>
        </div>
        <Link href="/admin/contracts">
          {pending.length > 0 && (
            <Button className="gap-2 relative" id="admin-pending-btn">
              <Clock className="h-4 w-4" />
              Review Pending ({pending.length})
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
                {pending.length}
              </span>
            </Button>
          )}
        </Link>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="glass-card rounded-2xl p-5"
            >
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} mb-3 shadow-md`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">{stat.trend}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Monthly chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 glass-card rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Monthly Contract Activity</h2>
            <Badge variant="secondary">Last 6 months</Badge>
          </div>
          <div className="flex items-end gap-3 h-40">
            {analytics.monthlyData.map((month: any, i: number) => (
              <motion.div
                key={month.month}
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="flex-1 flex flex-col items-center gap-1"
              >
                {/* Bars */}
                <div className="flex items-end gap-0.5 w-full justify-center h-32">
                  {[
                    { value: month.created, color: "bg-primary" },
                    { value: month.approved, color: "bg-emerald-500" },
                    { value: month.rejected, color: "bg-red-500" },
                  ].map((bar, j) => (
                    <motion.div
                      key={j}
                      initial={{ height: 0 }}
                      animate={{ height: `${(bar.value / maxMonthly) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.4 + i * 0.05 + j * 0.02, ease: "easeOut" }}
                      className={`w-3 rounded-t-sm ${bar.color} opacity-80 hover:opacity-100 transition-opacity cursor-pointer`}
                      title={`${bar.value}`}
                    />
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground">{month.month}</p>
              </motion.div>
            ))}
          </div>
          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded bg-primary" /> Created</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded bg-emerald-500" /> Approved</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded bg-red-500" /> Rejected</span>
          </div>
        </motion.div>

        {/* Quick stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <div className="glass-card rounded-2xl p-5">
            <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" /> Approval Rate
            </h2>
            <div className="text-4xl font-black brand-gradient-text mb-2">
              {analytics.totalContracts > 0 ? Math.round((analytics.approvedContracts / analytics.totalContracts) * 100) : 0}%
            </div>
            <div className="h-2 rounded-full bg-border overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${analytics.totalContracts > 0 ? (analytics.approvedContracts / analytics.totalContracts) * 100 : 0}%` }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-500"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">{analytics.approvedContracts} approved of {analytics.totalContracts}</p>
          </div>

          <div className="glass-card rounded-2xl p-5">
            <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" /> Top Template
            </h2>
            <p className="text-sm font-medium">Standard NDA</p>
            <p className="text-xs text-muted-foreground mt-1">Used 12 times this year</p>
          </div>

          <div className="glass-card rounded-2xl p-5">
            <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" /> Active Users
            </h2>
            <p className="text-4xl font-black brand-gradient-text mb-1">{contracts.length}</p>
            <p className="text-xs text-muted-foreground">Users with active contracts</p>
          </div>
        </motion.div>
      </div>

      {/* Pending contracts preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Pending Reviews</h2>
          <Link href="/admin/contracts">
            <Button variant="ghost" size="sm" className="gap-1" id="admin-view-all-pending">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="divide-y divide-border/50">
            {pending.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
                All caught up! No pending contracts.
              </div>
            ) : (
              pending.map((contract, i) => (
                <Link
                  key={contract.id}
                  href={`/admin/contracts/${contract.id}`}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-accent/50 transition-colors group"
                  id={`admin-pending-contract-${contract.id}`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                    <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{contract.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      by {contract.userName} · {new Date(contract.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                      contract.riskScore < 30 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                      contract.riskScore < 60 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                      Risk {contract.riskScore}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
