"use client";

import { motion } from "framer-motion";
import { Search, Users, FileText, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { USERS, CONTRACTS } from "@/lib/mock-data";
import { useState } from "react";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const filtered = USERS.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-muted-foreground mt-1">{USERS.length} users with contracts submitted to your company.</p>
      </motion.div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-input bg-background pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
          id="admin-users-search"
        />
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="grid grid-cols-5 px-5 py-3 border-b border-border/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <div className="col-span-2">User</div>
          <div>Contracts</div>
          <div>Last Active</div>
          <div>Actions</div>
        </div>
        <div className="divide-y divide-border/50">
          {filtered.map((user, i) => {
            const userContracts = CONTRACTS.filter((c) => c.userId === user.id);
            const approved = userContracts.filter((c) => c.status === "approved").length;
            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="grid grid-cols-5 items-center px-5 py-4 hover:bg-accent/50 transition-colors"
              >
                <div className="col-span-2 flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                    {user.name[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold">{user.contractCount}</p>
                  <p className="text-xs text-muted-foreground">{approved} approved</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <button className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-accent transition-colors text-muted-foreground" id={`admin-user-menu-${user.id}`}>
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
