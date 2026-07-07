"use client";

import { motion } from "framer-motion";
import {
  UserPlus,
  FileText,
  ListChecks,
  Bot,
  Eye,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: UserPlus,
    title: "Register & Login",
    description: "Create your account in seconds. Choose your role — employee, freelancer, vendor, or consultant.",
    color: "from-violet-500 to-purple-600",
  },
  {
    number: "02",
    icon: ListChecks,
    title: "Select Company & Details",
    description: "Choose the company, purpose (employment, NDA, freelance…), department, location, and duration from smart dropdowns.",
    color: "from-blue-500 to-cyan-600",
  },
  {
    number: "03",
    icon: Bot,
    title: "AI Asks Remaining Questions",
    description: "The AI chatbot intelligently asks only the remaining questions specific to your contract type.",
    color: "from-emerald-500 to-teal-600",
  },
  {
    number: "04",
    icon: FileText,
    title: "AI Generates Contract",
    description: "A fully formatted, professional contract is generated using the company's official template and branding.",
    color: "from-orange-500 to-amber-600",
  },
  {
    number: "05",
    icon: Eye,
    title: "Company Admin Reviews",
    description: "The contract enters 'Pending Review' state. The company's admin receives a notification to review and act.",
    color: "from-rose-500 to-pink-600",
  },
  {
    number: "06",
    icon: CheckCircle,
    title: "Approved & Download",
    description: "After approval, you're notified instantly. Download the signed, company-approved contract as a PDF.",
    color: "from-indigo-500 to-blue-600",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/2 to-transparent" />

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
            Simple Workflow
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            From idea to{" "}
            <span className="brand-gradient-text">approved contract</span>
            {" "}in 6 steps
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our streamlined workflow makes contract creation effortless — with AI
            handling the heavy lifting and companies managing the approval.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="absolute top-16 left-[calc(16.67%-2px)] right-[calc(16.67%-2px)] h-0.5 bg-gradient-to-r from-transparent via-border to-transparent hidden lg:block" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative"
                >
                  {/* Arrow connector */}
                  {i < STEPS.length - 1 && i % 3 !== 2 && (
                    <div className="absolute top-14 -right-4 z-10 hidden lg:block">
                      <ArrowRight className="h-4 w-4 text-muted-foreground/40" />
                    </div>
                  )}

                  <div className="glass-card rounded-2xl p-6 h-full hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
                    {/* Step number */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${step.color} shadow-lg`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-2xl font-black text-muted-foreground/20">{step.number}</span>
                    </div>

                    <h3 className="text-base font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
