"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  LayoutTemplate,
  Users,
  Bell,
  Building2,
  ChevronLeft,
  Shield,
  BarChart3,
  LogOut,
} from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

const ADMIN_NAV = [
  { label: "Analytics", href: "/admin", icon: BarChart3 },
  { label: "Contract Reviews", href: "/admin/contracts", icon: FileText },
  { label: "Templates", href: "/admin/templates", icon: LayoutTemplate },
  { label: "User Management", href: "/admin/users", icon: Users },
  { label: "Company Profile", href: "/admin/profile", icon: Building2 },
  { label: "Notifications", href: "/admin/notifications", icon: Bell },
];

interface AdminSidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

export function AdminSidebar({ collapsed, setCollapsed }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative hidden lg:flex flex-col h-screen sticky top-0 border-r border-border/50 bg-slate-950 dark:bg-slate-950 overflow-hidden shrink-0"
    >
      {/* Logo */}
      <div className={cn("flex items-center h-16 px-4 border-b border-slate-800", collapsed && "justify-center")}>
        <Link href="/admin" className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary shadow-sm">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden"
              >
                <span className="text-base font-bold text-white whitespace-nowrap">
                  Admin <span className="text-primary">Portal</span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="ml-auto flex h-7 w-7 items-center justify-center rounded-md hover:bg-slate-800 transition-colors text-slate-400"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Company label */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-slate-800">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Company Admin</p>
          <p className="text-sm font-semibold text-slate-200 mt-0.5">Microsoft Corporation</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {ADMIN_NAV.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                "text-slate-400 hover:text-slate-100 hover:bg-slate-800",
                isActive && "bg-primary/20 text-primary hover:bg-primary/25 hover:text-primary",
                collapsed && "justify-center px-2"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="truncate overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Back to user portal */}
      {!collapsed && (
        <div className="px-3 pb-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all"
          >
            <LogOut className="h-3.5 w-3.5" />
            Back to User Portal
          </Link>
        </div>
      )}

      {/* Footer */}
      <div className={cn("p-3 border-t border-slate-800", collapsed && "flex justify-center")}>
        {collapsed ? (
          <UserButton afterSignOutUrl="/" />
        ) : (
          <div className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-slate-800 transition-colors">
            <UserButton afterSignOutUrl="/" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-200 truncate">{user?.fullName || "Admin"}</p>
              <p className="text-xs text-slate-500 truncate">Company Admin</p>
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
