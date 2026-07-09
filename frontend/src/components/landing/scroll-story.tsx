"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Lock, Users, Sparkles, AlertTriangle, ArrowUpRight, CheckSquare } from "lucide-react";

export function ScrollStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll through the whole container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth out scroll values
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 20 });

  // Transforms for visual elements
  const marqueeX1 = useTransform(smoothProgress, [0, 1], ["0%", "-40%"]);
  const marqueeX2 = useTransform(smoothProgress, [0, 1], ["-40%", "0%"]);
  
  // Card rotations and transforms based on scroll
  const cardScale = useTransform(smoothProgress, [0, 0.2, 0.5, 0.8, 1], [0.85, 1, 1.05, 1, 0.9]);
  const cardRotateX = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [15, 0, -10, -20]);
  const cardRotateY = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [-20, 0, 15, 30]);
  const cardY = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [50, 0, -30, -80]);

  // Dynamic visual features updates mapped to scroll intervals
  // Step 1: Guardrails (0.0 to 0.35)
  // Step 2: Digital Lock (0.35 to 0.7)
  // Step 3: Global Team (0.7 to 1.0)
  const stepOpacity1 = useTransform(smoothProgress, [0.05, 0.2, 0.35], [0, 1, 0]);
  const stepOpacity2 = useTransform(smoothProgress, [0.38, 0.5, 0.68], [0, 1, 0]);
  const stepOpacity3 = useTransform(smoothProgress, [0.72, 0.85, 0.98], [0, 1, 0]);

  return (
    <div ref={containerRef} className="relative min-h-[300vh] bg-background/20 py-24 select-none">
      
      {/* Sticky layout container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center items-center">
        
        {/* Animated Marquee Ticker 1 */}
        <div className="absolute top-10 left-0 right-0 py-2 border-y border-primary/5 bg-accent/2 overflow-hidden rotate-[1.5deg] scale-105 z-0 pointer-events-none opacity-40">
          <motion.div style={{ x: marqueeX1 }} className="flex gap-16 whitespace-nowrap text-3xl font-extrabold uppercase tracking-widest text-muted-foreground/30 font-heading">
            {Array(5).fill("LEGAL AUTOMATION • SHIELD SECURITY • COLLABORATIVE APPROVALS").map((text, i) => (
              <span key={i} className="flex items-center gap-4">
                {text} <Sparkles className="h-6 w-6 text-primary/30" />
              </span>
            ))}
          </motion.div>
        </div>

        {/* Animated Marquee Ticker 2 */}
        <div className="absolute bottom-10 left-0 right-0 py-2 border-y border-primary/5 bg-accent/2 overflow-hidden rotate-[-1.5deg] scale-105 z-0 pointer-events-none opacity-40">
          <motion.div style={{ x: marqueeX2 }} className="flex gap-16 whitespace-nowrap text-3xl font-extrabold uppercase tracking-widest text-muted-foreground/30 font-heading">
            {Array(5).fill("SECURE DIGITAL VAULT • RUST GRADIENTS • HUMAN LEGAL ENGINE").map((text, i) => (
              <span key={i} className="flex items-center gap-4">
                {text} <Sparkles className="h-6 w-6 text-primary/30" />
              </span>
            ))}
          </motion.div>
        </div>

        <div className="max-w-7xl w-full px-6 grid lg:grid-cols-2 gap-12 items-center z-10">
          
          {/* Left: Sticky Interactive Contract Visualizer */}
          <div className="relative flex justify-center items-center">
            
            {/* Holographic 3D Card */}
            <motion.div
              style={{
                scale: cardScale,
                rotateX: cardRotateX,
                rotateY: cardRotateY,
                y: cardY,
                transformStyle: "preserve-3d",
                perspective: 1000,
              }}
              className="w-full max-w-sm glass-card rounded-3xl p-6 border border-border/80 shadow-2xl relative overflow-hidden backdrop-blur-md"
            >
              <div className="absolute top-0 right-0 w-36 h-36 bg-primary/10 rounded-full blur-3xl" />
              
              {/* Dynamic Holographic Elements */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Accord Ledger System</span>
                  </div>
                  <span className="text-[10px] text-primary font-bold">ACC-0917-LIVE</span>
                </div>

                <p className="text-xl font-bold font-heading brand-gradient-text leading-tight">Smart Agreement Vault</p>

                {/* Overlaid Animated Steps */}
                <div className="relative min-h-[140px] mt-4">
                  
                  {/* Step 1: AI Guardrail info */}
                  <motion.div style={{ opacity: stepOpacity1 }} className="absolute inset-0 flex flex-col gap-2">
                    <div className="p-3 bg-rose-500/5 border border-rose-500/20 rounded-xl flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-rose-500">Risk Detected: Liability Cap</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Section 4 contains unlimited indemnification terms.</p>
                      </div>
                    </div>
                    <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-center gap-3">
                      <CheckSquare className="h-5 w-5 text-emerald-500 shrink-0" />
                      <p className="text-[10px] text-muted-foreground">Delaware Jurisdiction Clause confirmed.</p>
                    </div>
                  </motion.div>

                  {/* Step 2: Cursive Signature Drawing */}
                  <motion.div style={{ opacity: stepOpacity2 }} className="absolute inset-0 flex flex-col justify-center items-center gap-3 text-center">
                    <div className="relative h-16 w-48 border border-border/50 bg-background/50 rounded-xl flex items-center justify-center overflow-hidden">
                      <svg viewBox="0 0 100 30" className="h-10 w-36 text-primary">
                        <motion.path
                          d="M 10 22 C 20 8, 30 25, 45 10 C 60 4, 70 26, 85 14"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          fill="none"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 2.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                        />
                      </svg>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
                    </div>
                    <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Digital Signature Sealed</p>
                  </motion.div>

                  {/* Step 3: Collaborative network bubbles */}
                  <motion.div style={{ opacity: stepOpacity3 }} className="absolute inset-0 flex items-center justify-center gap-8">
                    <div className="flex -space-x-3">
                      {["US", "DE", "IN"].map((intl, i) => (
                        <div key={intl} className="h-10 w-10 rounded-full border-2 border-background bg-primary/20 flex items-center justify-center text-[10px] font-extrabold text-primary shadow-lg animate-pulse" style={{ animationDelay: `${i * 200}ms` }}>
                          {intl}
                        </div>
                      ))}
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-foreground">Cross-Border Secured</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Real-time collaborative approvals.</p>
                    </div>
                  </motion.div>

                </div>

              </div>

            </motion.div>
          </div>

          {/* Right: Scrolling Story Text Blocks */}
          <div className="space-y-36 pr-4">
            
            {/* Slide 1 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-20% 0px -20% 0px" }}
              transition={{ type: "spring", stiffness: 70, damping: 15 }}
              className="space-y-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-3xl font-bold font-heading">AI Guardrails & Audits</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                Watch the AI engine flag and label potential risk liabilities. It reads between standard clauses and automatically highlights jurisdiction gaps and unbalanced indemnification terms.
              </p>
            </motion.div>

            {/* Slide 2 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-20% 0px -20% 0px" }}
              transition={{ type: "spring", stiffness: 70, damping: 15 }}
              className="space-y-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="text-3xl font-bold font-heading">Self-Drawing Signatures</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                Simulate digital signature validation. The platform processes high-end cryptographic signatures and visualizes contract lock sequences to confirm enterprise-grade compliance.
              </p>
            </motion.div>

            {/* Slide 3 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-20% 0px -20% 0px" }}
              transition={{ type: "spring", stiffness: 70, damping: 15 }}
              className="space-y-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-3xl font-bold font-heading">Global Team Workflows</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                Connect external legal counsels and directors into one collaborative stream. Track and review signing actions in cross-border pipelines with real-time digital seal confirmation.
              </p>
            </motion.div>

          </div>

        </div>

      </div>

    </div>
  );
}
