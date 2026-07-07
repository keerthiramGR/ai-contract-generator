"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Building2,
  Shield,
  Zap,
  FileSearch,
  Bell,
  BarChart3,
  CheckCircle2,
  MessageSquare,
  Lock,
} from "lucide-react";

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI Contract Generation",
    description:
      "Smart dropdowns guide you through selection. AI fills in the rest, generating a professionally-formatted contract in under 2 minutes.",
    color: "from-violet-500 to-purple-600",
    badge: "Core Feature",
  },
  {
    icon: Building2,
    title: "Company Approval Workflow",
    description:
      "Contracts are submitted directly to the selected company's admin dashboard. Admins can approve, reject, or request changes.",
    color: "from-blue-500 to-cyan-600",
    badge: "Workflow",
  },
  {
    icon: FileSearch,
    title: "AI Contract Review",
    description:
      "Upload any existing contract. Our AI summarizes it, highlights risks, scores clauses, and suggests improvements instantly.",
    color: "from-emerald-500 to-teal-600",
    badge: "Analysis",
  },
  {
    icon: MessageSquare,
    title: "Legal AI Chatbot",
    description:
      "Ask anything about your contracts. \"Explain clause 5\", \"Can I terminate early?\", \"Who owns the IP?\" — plain language answers.",
    color: "from-orange-500 to-amber-600",
    badge: "AI Chat",
  },
  {
    icon: Shield,
    title: "Official Templates Library",
    description:
      "Browse verified official templates from Microsoft, Google, Amazon, and 200+ companies. Each template is maintained by company admins.",
    color: "from-rose-500 to-pink-600",
    badge: "Templates",
  },
  {
    icon: Lock,
    title: "Digital Signatures & Seals",
    description:
      "Company admins can apply official digital signatures and company seals directly within the platform for fully authenticated contracts.",
    color: "from-indigo-500 to-blue-600",
    badge: "Signing",
  },
  {
    icon: Bell,
    title: "Real-time Notifications",
    description:
      "Get instant notifications when contracts are approved, rejected, signed, or when changes are requested. Never miss an update.",
    color: "from-yellow-500 to-orange-600",
    badge: "Notifications",
  },
  {
    icon: BarChart3,
    title: "Company Analytics",
    description:
      "Admins get full analytics dashboards: approval rates, processing times, most-used templates, monthly trends, and more.",
    color: "from-teal-500 to-green-600",
    badge: "Analytics",
  },
  {
    icon: Zap,
    title: "Enterprise Security",
    description:
      "Role-based access control, encrypted storage, audit logs, version history, and activity tracking ensure your contracts stay secure.",
    color: "from-slate-500 to-zinc-600",
    badge: "Security",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Everything you need
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Powerful features for{" "}
            <span className="brand-gradient-text">every workflow</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From AI-powered generation to company approval workflows — ContractAI
            handles every step of the contract lifecycle.
          </p>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="group relative glass-card rounded-2xl p-6 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Gradient background on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/3 to-transparent" />

                <div className="relative">
                  {/* Icon */}
                  <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} mb-4 shadow-lg`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>

                  {/* Badge */}
                  <span className="ml-2 inline-flex items-center rounded-full border border-border/50 bg-muted/50 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {feature.badge}
                  </span>

                  <h3 className="mt-3 text-base font-semibold">{feature.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
