"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, CheckCheck, Trash2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NOTIFICATIONS } from "@/lib/mock-data";
import { Notification } from "@/lib/types";

const TYPE_CONFIG = {
  contract_approved: { label: "Approved", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/30", icon: "✅" },
  contract_rejected: { label: "Rejected", color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30", icon: "❌" },
  changes_requested: { label: "Changes", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/30", icon: "📝" },
  new_request: { label: "New Request", color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-100 dark:bg-violet-900/30", icon: "📋" },
  signature_added: { label: "Signed", color: "text-primary", bg: "bg-primary/10", icon: "✍️" },
  expiring: { label: "Expiring", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/30", icon: "⏰" },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS);

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  const markRead = (id: string) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
  const deleteNotif = (id: string) => setNotifications((prev) => prev.filter((n) => n.id !== id));

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Notifications
            {unreadCount > 0 && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-muted-foreground mt-1">{notifications.length} total notifications</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" className="gap-1.5" onClick={markAllRead} id="notif-mark-all-read">
            <CheckCheck className="h-4 w-4" /> Mark all read
          </Button>
        )}
      </motion.div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
            <p className="text-muted-foreground">No notifications yet.</p>
          </div>
        ) : (
          notifications.map((notif, i) => {
            const cfg = TYPE_CONFIG[notif.type];
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`glass-card rounded-xl overflow-hidden ${!notif.isRead ? "border-l-2 border-primary" : ""}`}
              >
                <div className="flex items-start gap-4 p-5">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${cfg.bg}`}>
                    {cfg.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-sm font-semibold">{notif.title}</p>
                      <Badge variant="secondary" className="text-[10px]">{cfg.label}</Badge>
                      {!notif.isRead && (
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{notif.message}</p>
                    <p className="text-xs text-muted-foreground mt-1.5">
                      {new Date(notif.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {!notif.isRead && (
                      <button
                        onClick={() => markRead(notif.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                        title="Mark as read"
                        id={`notif-read-${notif.id}`}
                      >
                        <CheckCheck className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotif(notif.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                      title="Delete"
                      id={`notif-delete-${notif.id}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
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
