"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  CheckCircle2,
  FileSignature,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const CONTRACT_PREVIEW = [
  { label: "EMPLOYMENT AGREEMENT", type: "header" },
  { label: "Microsoft Corporation ↔ Alex Johnson", type: "parties" },
  { label: "Position: Senior Software Engineer", type: "clause" },
  { label: "Salary: $185,000/year", type: "clause" },
  { label: "Start Date: August 1, 2024", type: "clause" },
  { label: "✓ Confidentiality Clause", type: "check" },
  { label: "✓ IP Assignment", type: "check" },
  { label: "✓ Non-Compete (12 months)", type: "check" },
  { label: "🔒 Awaiting Company Review", type: "status" },
];

const STATS = [
  { value: "50K+", label: "Contracts Generated" },
  { value: "200+", label: "Companies Onboard" },
  { value: "99.2%", label: "Accuracy Rate" },
  { value: "< 2min", label: "Generation Time" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden hero-gradient">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.58_0.25_264/3%)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.58_0.25_264/3%)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                <Sparkles className="h-3.5 w-3.5" />
                AI-Powered Contract Platform
                <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">NEW</span>
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-balance mb-6"
            >
              Generate{" "}
              <span className="brand-gradient-text">Professional</span>
              <br />
              Contracts with{" "}
              <span className="brand-gradient-text">AI</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl"
            >
              Select a company, choose your contract type, and let AI generate a
              professional, legally-sound contract in minutes. Submit for official
              company approval — all in one platform.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-3 mb-12"
            >
              <Link href="/sign-up">
                <Button size="lg" className="gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow" id="hero-cta-primary">
                  <Sparkles className="h-4 w-4" />
                  Create Your First Contract
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#features">
                <Button variant="outline" size="lg" id="hero-cta-secondary">
                  See How It Works
                </Button>
              </a>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground"
            >
              <span className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-primary" />
                Enterprise-grade security
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-primary" />
                Generate in &lt;2 minutes
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                200+ companies onboard
              </span>
            </motion.div>
          </div>

          {/* Right: Floating contract preview */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative flex justify-center lg:justify-end"
          >
            {/* Main card */}
            <div className="relative w-full max-w-md animate-float">
              <div className="glass-card rounded-2xl p-6 shadow-2xl shadow-primary/10">
                {/* Card header */}
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border/50">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <FileSignature className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">AI Generated Contract</p>
                    <p className="text-sm font-bold">Draft Complete ✓</p>
                  </div>
                  <div className="ml-auto">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Live
                    </span>
                  </div>
                </div>

                {/* Contract preview */}
                <div className="space-y-2">
                  {CONTRACT_PREVIEW.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.07 }}
                    >
                      {item.type === "header" && (
                        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">{item.label}</p>
                      )}
                      {item.type === "parties" && (
                        <p className="text-sm font-semibold">{item.label}</p>
                      )}
                      {item.type === "clause" && (
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                      )}
                      {item.type === "check" && (
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">{item.label}</p>
                      )}
                      {item.type === "status" && (
                        <div className="mt-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 px-3 py-2">
                          <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">{item.label}</p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* AI score */}
                <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">AI Risk Score</span>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < 4 ? "text-amber-400 fill-amber-400" : "text-muted-foreground"}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Low Risk (12/100)</span>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
                className="absolute -bottom-4 -left-4 glass-card rounded-xl px-4 py-3 shadow-lg"
              >
                <p className="text-xs font-medium text-muted-foreground">Generated by</p>
                <p className="text-sm font-bold brand-gradient-text">ContractAI ✨</p>
              </motion.div>

              {/* Floating notification */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute -top-4 -right-4 glass-card rounded-xl px-4 py-2.5 shadow-lg"
              >
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">✓ Microsoft Approved</p>
                <p className="text-[10px] text-muted-foreground">Just now</p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8 pt-10 border-t border-border/50"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold brand-gradient-text mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
