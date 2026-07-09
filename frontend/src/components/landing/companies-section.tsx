"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Building2 } from "lucide-react";
import { COMPANIES } from "@/lib/mock-data";

const COMPANY_COLORS = [
  "bg-blue-500", "bg-red-500", "bg-orange-500", "bg-blue-600",
  "bg-gray-800", "bg-red-600", "bg-gray-700", "bg-emerald-600",
];

export function CompaniesSection() {
  return (
    <section id="companies" className="py-24 relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/2 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            <Building2 className="h-3.5 w-3.5" />
            200+ Companies
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Trusted by{" "}
            <span className="brand-gradient-text">world-class companies</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Generate contracts for employment, freelancing, NDAs, and more with
            official templates from top companies.
          </p>
        </motion.div>

        {/* Company grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {COMPANIES.map((company, i) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 90, damping: 15, delay: i * 0.05 }}
              className="group glass-card rounded-2xl p-5 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] cursor-pointer"
            >
              <div className="flex items-start gap-3">
                {/* Logo placeholder */}
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${COMPANY_COLORS[i % COMPANY_COLORS.length]} text-white font-bold text-lg shadow-md`}
                >
                  {company.logo}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-sm truncate font-heading">{company.name}</p>
                    {company.verified && (
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate font-sans">{company.industry}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground font-sans">
                <span className="flex items-center gap-1">
                  <span className="font-semibold text-foreground">{company.templateCount}</span> templates
                </span>
                <span className="flex items-center gap-1">
                  <span className="font-semibold text-foreground">{company.contractsProcessed.toLocaleString()}</span> contracts
                </span>
              </div>

              <div className="mt-3 h-1 rounded-full bg-border overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${Math.min((company.contractsProcessed / 1300) * 100, 100)}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.4 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm text-muted-foreground">
            Don&apos;t see your company?{" "}
            <a href="#contact" className="text-primary font-medium hover:underline">
              Request company onboarding →
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
