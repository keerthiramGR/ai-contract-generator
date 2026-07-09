"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  CheckCircle2,
  FileSignature,
  Star,
  PenTool,
  Check,
  Trash2,
  RefreshCw,
  AlertTriangle,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const SANDBOX_PROMPTS = [
  {
    tag: "NDA",
    prompt: "Mutual NDA for software design cooperation",
    title: "MUTUAL NON-DISCLOSURE AGREEMENT",
    parties: "Apex Design Studio ↔ ByteCode Inc",
    clauses: [
      "1. Definition of Confidential Information: proprietary codebase & mockups.",
      "2. Standard obligations: protect with reasonable care for 3 years.",
      "3. Authorized disclosures: restricted only to key engineers under NDA.",
      "4. Exclusions: public info, independent development, or court orders.",
      "✓ Standard Mutual Protection Enabled",
      "✓ Delaware Governing Law Assumed"
    ],
    risk: 8,
    label: "Negligible Risk"
  },
  {
    tag: "Advisory",
    prompt: "Advisor Agreement for startup equity",
    title: "STARTUP ADVISORY AGREEMENT",
    parties: "Solara CleanTech ↔ Dr. Sarah Jenkins",
    clauses: [
      "1. Advisory Scope: 4 hours monthly review of hardware schematics.",
      "2. Compensation: 0.15% equity vesting monthly over 24 months.",
      "3. IP Ownership: all advisory output belongs entirely to Company.",
      "4. Termination: either party can cancel with 14 days written notice.",
      "✓ IP Assignment Assigned",
      "✗ Single-trigger Vesting Acceleration"
    ],
    risk: 32,
    label: "Moderate Risk"
  },
  {
    tag: "Freelance",
    prompt: "Freelance web development contract net 15",
    title: "INDEPENDENT CONTRACTOR AGREEMENT",
    parties: "CloudSaaS LLC ↔ Marcus Aurelius",
    clauses: [
      "1. Deliverables: Full-stack Next.js client portal and analytics dashboard.",
      "2. Compensation: Flat fee of $12,500 ($5k deposit + $7.5k upon delivery).",
      "3. Payment Term: Net 15 days from milestone invoices.",
      "4. IP Rights: transfer occurs only upon final invoice payment.",
      "✗ Unlimited revisions requested by Client",
      "✗ Broad indemnity for third-party delays"
    ],
    risk: 58,
    label: "Elevated Risk"
  }
];

const STATS = [
  { value: "50K+", label: "Contracts Generated" },
  { value: "200+", label: "Companies Onboard" },
  { value: "99.2%", label: "Accuracy Rate" },
  { value: "< 2min", label: "Generation Time" },
];

type TemplateKey = "employment" | "nda" | "freelance";

export function HeroSection() {
  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(100);
  const [visibleClausesCount, setVisibleClausesCount] = useState(6);
  const [typedPrompt, setTypedPrompt] = useState(SANDBOX_PROMPTS[0].prompt);
  
  // Signature Drawing State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);

  const activeData = SANDBOX_PROMPTS[activePromptIndex];

  // Trigger typing simulation
  const simulateGeneration = (index: number) => {
    setActivePromptIndex(index);
    setIsGenerating(true);
    setProgress(0);
    setVisibleClausesCount(0);
    setHasSigned(false);

    // Reset canvas if it exists
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    setTypedPrompt(SANDBOX_PROMPTS[index].prompt);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);
      
      if (currentProgress === 20) setVisibleClausesCount(1);
      if (currentProgress === 40) setVisibleClausesCount(2);
      if (currentProgress === 60) setVisibleClausesCount(3);
      if (currentProgress === 80) setVisibleClausesCount(4);
      if (currentProgress === 90) setVisibleClausesCount(5);
      if (currentProgress >= 100) {
        setProgress(100);
        setVisibleClausesCount(6);
        setIsGenerating(false);
        clearInterval(interval);
      }
    }, 40); // Fast typing simulation
  };

  const handleCustomPromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedPrompt.trim()) return;
    // Map custom prompt to a demo generation
    const nextIndex = (activePromptIndex + 1) % SANDBOX_PROMPTS.length;
    simulateGeneration(nextIndex);
  };

  // Drawing mouse handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Smooth drawing settings
    ctx.strokeStyle = "oklch(0.48 0.15 45)"; // Terracotta primary
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSigned(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  };

  // SVG circular dial offsets
  const strokeDashoffset = 188.4 - (188.4 * (isGenerating ? (progress / 100) * activeData.risk : activeData.risk)) / 100;

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden hero-gradient">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.48_0.15_45/3%)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.48_0.15_45/3%)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-primary/5 blur-3xl animate-pulse" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                <Sparkles className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: "3s" }} />
                AI-Powered Contract Platform
                <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">NEW</span>
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 85, damping: 14, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-balance mb-6 font-heading"
            >
              Generate{" "}
              <span className="brand-gradient-text">Professional</span>
              <br />
              Contracts with{" "}
              <span className="brand-gradient-text">AI</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.2 }}
              className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl font-sans"
            >
              Select a company, choose your contract type, and let AI generate a
              professional, legally-sound contract in minutes. Submit for official
              company approval — all in one platform.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 75, damping: 16, delay: 0.3 }}
              className="flex flex-wrap gap-3 mb-12"
            >
              <Link href="/sign-up">
                <Button size="lg" className="gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 hover:scale-[1.02]" id="hero-cta-primary">
                  <Sparkles className="h-4 w-4" />
                  Create Your First Contract
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#features">
                <Button variant="outline" size="lg" className="transition-all duration-300 hover:bg-accent/10 hover:border-primary/50" id="hero-cta-secondary">
                  See How It Works
                </Button>
              </a>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
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

          {/* Right: Floating AI Sandbox Canvas */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 60, damping: 16, delay: 0.2 }}
            className="relative flex justify-center lg:justify-end"
          >
            {/* Main Sandbox Card */}
            <div className="relative w-full max-w-md animate-float">
              <div className="glass-card rounded-3xl p-6 shadow-2xl shadow-primary/5 border border-border/60 flex flex-col gap-4">
                
                {/* Custom Sandbox Prompt Input Panel */}
                <form onSubmit={handleCustomPromptSubmit} className="relative flex items-center bg-muted/40 rounded-xl px-3.5 py-1 border border-border/40 gap-2 shrink-0">
                  <Bot className="h-4 w-4 text-primary shrink-0" />
                  <input
                    type="text"
                    value={typedPrompt}
                    onChange={(e) => setTypedPrompt(e.target.value)}
                    disabled={isGenerating}
                    placeholder="Describe a contract to generate..."
                    className="w-full bg-transparent text-xs outline-none text-foreground placeholder:text-muted-foreground font-sans py-1.5"
                  />
                  <button
                    type="submit"
                    disabled={isGenerating || !typedPrompt.trim()}
                    className="p-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 transition-opacity"
                  >
                    <Sparkles className="h-3 w-3" />
                  </button>
                </form>

                {/* Quick suggestions */}
                <div className="flex flex-wrap gap-1.5 shrink-0">
                  {SANDBOX_PROMPTS.map((item, i) => (
                    <button
                      key={item.tag}
                      type="button"
                      disabled={isGenerating}
                      onClick={() => simulateGeneration(i)}
                      className={`text-[10px] px-2.5 py-1 rounded-full border transition-all font-semibold ${
                        activePromptIndex === i
                          ? "bg-primary/10 border-primary text-primary"
                          : "border-border/60 hover:bg-accent/40 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {item.tag} Demo
                    </button>
                  ))}
                </div>

                {/* Simulated Holographic Typing Canvas */}
                <div className="flex-1 bg-muted/30 border border-border/30 rounded-2xl p-4 relative overflow-hidden flex flex-col gap-2 min-h-[220px]">
                  
                  {/* Generation loading screen overlays */}
                  <AnimatePresence>
                    {isGenerating && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-background/70 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center gap-3"
                      >
                        <RefreshCw className="h-6 w-6 text-primary animate-spin" />
                        <div className="text-center">
                          <p className="text-xs font-bold font-sans">Accord AI Writing...</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">Progress {progress}%</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex items-center justify-between border-b border-border/30 pb-2 shrink-0">
                    <span className="text-[10px] font-bold text-primary font-heading tracking-widest">{activeData.title}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>

                  <div className="flex-1 space-y-1.5 overflow-y-auto scrollbar-none max-h-[170px] select-none text-[11px] leading-relaxed font-sans">
                    <p className="font-semibold text-foreground border-l-2 border-primary/40 pl-1.5 mb-2">{activeData.parties}</p>
                    {activeData.clauses.slice(0, visibleClausesCount).map((clause, idx) => (
                      <motion.p
                        key={`${activePromptIndex}-${idx}`}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={
                          clause.startsWith("✓")
                            ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                            : clause.startsWith("✗")
                            ? "text-rose-500 font-semibold"
                            : "text-muted-foreground"
                        }
                      >
                        {clause}
                      </motion.p>
                    ))}
                  </div>
                </div>

                {/* Inline signature canvas section */}
                <div className="border-t border-border/40 pt-3 flex flex-col gap-2 shrink-0">
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span className="text-muted-foreground flex items-center gap-1 font-sans">
                      <PenTool className="h-3.5 w-3.5 text-primary" />
                      Sign below to approve:
                    </span>
                    {hasSigned && (
                      <button
                        type="button"
                        onClick={clearSignature}
                        className="text-primary hover:text-red-500 transition-colors flex items-center gap-0.5 text-[10px]"
                      >
                        <Trash2 className="h-3 w-3" /> Clear
                      </button>
                    )}
                  </div>
                  
                  <div className="h-20 border border-border/50 bg-background/50 rounded-xl relative overflow-hidden group/canvas">
                    <canvas
                      ref={canvasRef}
                      width={380}
                      height={80}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      className="absolute inset-0 cursor-crosshair w-full h-full"
                    />
                    {!hasSigned && (
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-[10px] text-muted-foreground/60 font-sans tracking-wide">
                        Draw signature with mouse or touch
                      </div>
                    )}
                    {hasSigned && (
                      <div className="absolute bottom-2 right-2 pointer-events-none bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
                        Signed & Locked ✓
                      </div>
                    )}
                  </div>
                </div>

                {/* Dynamic circular risk index gauge */}
                <div className="border-t border-border/40 pt-3 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    {/* SVG circular risk indicator */}
                    <div className="relative h-8 w-8 flex items-center justify-center">
                      <svg className="h-full w-full rotate-[-90deg]">
                        <circle cx="16" cy="16" r="12" stroke="var(--border)" strokeWidth="3" fill="none" />
                        <motion.circle
                          cx="16"
                          cy="16"
                          r="12"
                          stroke="var(--primary)"
                          strokeWidth="3"
                          fill="none"
                          strokeDasharray="188.4"
                          animate={{ strokeDashoffset }}
                          transition={{ type: "spring", stiffness: 60, damping: 15 }}
                        />
                      </svg>
                      <span className="absolute text-[8px] font-extrabold font-sans">
                        {isGenerating ? Math.round((progress / 100) * activeData.risk) : activeData.risk}%
                      </span>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-semibold font-sans">AI Risk Index</p>
                      <p className="text-xs font-bold font-sans">
                        {activeData.label}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < (activeData.risk < 15 ? 5 : activeData.risk < 40 ? 4 : 3)
                            ? "text-amber-400 fill-amber-400"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>

              </div>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 80, damping: 15, delay: 1.0 }}
                className="absolute -bottom-4 -left-4 glass-card rounded-xl px-4 py-3 shadow-lg border border-border/60"
              >
                <p className="text-xs font-medium text-muted-foreground">Platform Engine</p>
                <p className="text-sm font-bold brand-gradient-text">Accord Core ✨</p>
              </motion.div>

              {/* Floating notification */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 75, damping: 16, delay: 1.3 }}
                className="absolute -top-4 -right-4 glass-card rounded-xl px-4 py-2.5 shadow-lg border border-border/60"
              >
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">✓ Real-time Guardrails</p>
                <p className="text-[10px] text-muted-foreground">Active protection</p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 50, damping: 15, delay: 0.6 }}
          className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8 pt-10 border-t border-border/50"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold brand-gradient-text mb-1 font-heading">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
