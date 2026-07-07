"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  FileSearch,
  Library,
  MessageSquare,
  Bell,
  Settings,
  ChevronLeft,
  Menu,
  LogOut,
} from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Contracts", href: "/contracts", icon: FileText },
  { label: "Create Contract", href: "/contracts/create", icon: PlusCircle },
  { label: "Contract Analysis", href: "/analysis", icon: FileSearch },
  { label: "Template Library", href: "/library", icon: Library },
  { label: "AI Assistant", href: "/chat", icon: MessageSquare },
  { label: "Notifications", href: "/notifications", icon: Bell },
];

interface UserSidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

export function UserSidebar({ collapsed, setCollapsed }: UserSidebarProps) {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative hidden lg:flex flex-col h-screen sticky top-0 border-r border-border/50 bg-sidebar overflow-hidden shrink-0"
    >
      {/* Logo */}
      <div className={cn("flex items-center h-16 px-4 border-b border-border/50", collapsed && "justify-center")}>
        <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary shadow-sm">
            <FileText className="h-4 w-4 text-primary-foreground" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="text-base font-bold whitespace-nowrap overflow-hidden"
              >
                Contract<span className="brand-gradient-text">AI</span>
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="ml-auto flex h-7 w-7 items-center justify-center rounded-md hover:bg-accent transition-colors text-muted-foreground"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="flex h-9 w-full items-center justify-center rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-all mb-2"
            aria-label="Expand sidebar"
          >
            <Menu className="h-4 w-4" />
          </button>
        )}

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "sidebar-nav-item",
                isActive && "active",
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
              {/* Active dot */}
              {isActive && !collapsed && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer: user info */}
      <div className={cn("p-3 border-t border-border/50", collapsed && "flex justify-center")}>
        {collapsed ? (
          <UserButton afterSignOutUrl="/" />
        ) : (
          <div className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-accent transition-colors">
            <UserButton afterSignOutUrl="/" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{user?.fullName || "User"}</p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
