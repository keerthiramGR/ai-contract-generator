"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ADMIN_NOTIFICATIONS } from "@/lib/mock-data";
import { Notification } from "@/lib/types";

const TYPE_CONFIG = {
  contract_approved: { icon: "✅", label: "Approved" },
  contract_rejected: { icon: "❌", label: "Rejected" },
  changes_requested: { icon: "📝", label: "Changes" },
  new_request: { icon: "📋", label: "New Request" },
  signature_added: { icon: "✍️", label: "Signed" },
  expiring: { icon: "⏰", label: "Expiring" },
};

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(ADMIN_NOTIFICATIONS);
  const unread = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Admin Notifications
            {unread > 0 && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{unread}</span>
            )}
          </h1>
          <p className="text-muted-foreground mt-1">Stay updated on contract requests and platform activity.</p>
        </div>
        {unread > 0 && (
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setNotifications((p) => p.map((n) => ({ ...n, isRead: true })))} id="admin-notif-mark-all">
            <CheckCheck className="h-4 w-4" /> Mark all read
          </Button>
        )}
      </motion.div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
            <p className="text-muted-foreground">No notifications.</p>
          </div>
        ) : (
          notifications.map((n, i) => {
            const cfg = TYPE_CONFIG[n.type];
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`glass-card rounded-xl p-5 ${!n.isRead ? "border-l-2 border-primary" : ""}`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-lg">{cfg.icon}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-sm font-semibold">{n.title}</p>
                      <Badge variant="secondary" className="text-[10px]">{cfg.label}</Badge>
                      {!n.isRead && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(n.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                  <button
                    onClick={() => setNotifications((p) => p.filter((x) => x.id !== n.id))}
                    className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    id={`admin-notif-delete-${n.id}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
