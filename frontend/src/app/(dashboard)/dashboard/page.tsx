"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  PlusCircle,
  ArrowRight,
  FileSearch,
  TrendingUp,
  Sparkles,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CONTRACTS, NOTIFICATIONS } from "@/lib/mock-data";
import { ContractStatus } from "@/lib/types";
import { useUser } from "@clerk/nextjs";

const STATUS_CONFIG: Record<ContractStatus, { label: string; variant: "default" | "success" | "warning" | "destructive" | "info" | "secondary" | "outline" }> = {
  draft: { label: "Draft", variant: "secondary" },
  pending: { label: "Pending Review", variant: "warning" },
  approved: { label: "Approved", variant: "success" },
  rejected: { label: "Rejected", variant: "destructive" },
  changes_requested: { label: "Changes Needed", variant: "info" },
};

const QUICK_ACTIONS = [
  {
    label: "Create Contract",
    description: "Generate a new AI contract",
    href: "/contracts/create",
    icon: PlusCircle,
    color: "from-violet-500 to-purple-600",
  },
  {
    label: "Analyze Contract",
    description: "Upload and review existing",
    href: "/analysis",
    icon: FileSearch,
    color: "from-blue-500 to-cyan-600",
  },
  {
    label: "Browse Templates",
    description: "Company official templates",
    href: "/library",
    icon: FileText,
    color: "from-emerald-500 to-teal-600",
  },
  {
    label: "AI Assistant",
    description: "Ask legal questions",
    href: "/chat",
    icon: Sparkles,
    color: "from-orange-500 to-amber-600",
  },
];

export default function DashboardPage() {
  const { user } = useUser();
  const userContracts = CONTRACTS.slice(0, 4);
  const unreadNotifications = NOTIFICATIONS.filter((n) => !n.isRead);

  const stats = [
    { label: "Total Contracts", value: CONTRACTS.length, icon: FileText, color: "text-primary", bg: "bg-primary/10" },
    { label: "Pending Review", value: CONTRACTS.filter((c) => c.status === "pending").length, icon: Clock, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/30" },
    { label: "Approved", value: CONTRACTS.filter((c) => c.status === "approved").length, icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
    { label: "Rejected", value: CONTRACTS.filter((c) => c.status === "rejected").length, icon: XCircle, color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30" },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between mb-8"
      >
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back, {user?.firstName || "there"} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s an overview of your contract activity.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadNotifications.length > 0 && (
            <Link href="/notifications">
              <Button variant="outline" size="sm" className="gap-2 relative" id="dash-notifications">
                <Bell className="h-4 w-4" />
                Notifications
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {unreadNotifications.length}
                </span>
              </Button>
            </Link>
          )}
          <Link href="/contracts/create">
            <Button size="sm" className="gap-1.5" id="dash-create-contract">
              <PlusCircle className="h-4 w-4" />
              New Contract
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="glass-card rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.bg}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
              <p className="text-3xl font-bold">{stat.value}</p>
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">+2</span> this month
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Contracts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Contracts</h2>
            <Link href="/contracts">
              <Button variant="ghost" size="sm" className="gap-1 text-sm" id="dash-view-all-contracts">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="divide-y divide-border/50">
              {userContracts.map((contract, i) => {
                const status = STATUS_CONFIG[contract.status];
                return (
                  <motion.div
                    key={contract.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + i * 0.06 }}
                  >
                    <Link
                      href={`/contracts/${contract.id}`}
                      className="flex items-center gap-4 px-5 py-4 hover:bg-accent/50 transition-colors group"
                      id={`contract-row-${contract.id}`}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                          {contract.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {contract.companyName} · {new Date(contract.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={status.variant}>{status.label}</Badge>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.href} href={action.href} id={`quick-action-${action.label.toLowerCase().replace(/\s+/g, "-")}`}>
                    <div className="glass-card rounded-xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group h-full">
                      <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${action.color} mb-3 shadow-sm`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <p className="text-xs font-semibold leading-tight group-hover:text-primary transition-colors">
                        {action.label}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                        {action.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>

          {/* Recent Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Notifications</h2>
              <Link href="/notifications">
                <Button variant="ghost" size="sm" className="gap-1 text-xs" id="dash-view-all-notifications">
                  View all <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
            <div className="glass-card rounded-2xl divide-y divide-border/50 overflow-hidden">
              {NOTIFICATIONS.slice(0, 3).map((notif) => (
                <div
                  key={notif.id}
                  className={`px-4 py-3 ${!notif.isRead ? "bg-primary/3" : ""}`}
                >
                  <div className="flex items-start gap-2.5">
                    {!notif.isRead && (
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    )}
                    <div className={!notif.isRead ? "" : "pl-3.5"}>
                      <p className="text-xs font-semibold">{notif.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
                        {notif.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
