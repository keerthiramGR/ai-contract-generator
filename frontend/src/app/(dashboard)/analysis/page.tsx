"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, FileText, Sparkles, AlertTriangle, CheckCircle2,
  Info, TrendingUp, Loader2, X, Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const MOCK_ANALYSIS = {
  summary: "This is a Software Development Agreement between Acme Corp and a freelance developer for the development of a mobile application. The contract covers a 6-month engagement with milestone-based payments. The agreement includes IP assignment clauses and standard confidentiality provisions.",
  riskScore: 42,
  riskLevel: "Medium",
  clauses: [
    { type: "warning", title: "Broad IP Assignment", description: "Section 7 assigns ALL intellectual property to the client, including pre-existing work. Consider carving out pre-existing IP." },
    { type: "warning", title: "Vague Deliverable Specs", description: "Section 3 lacks specific acceptance criteria for deliverables. This could lead to disputes." },
    { type: "success", title: "Clear Payment Terms", description: "Section 5 clearly outlines milestone-based payment with 30-day payment terms." },
    { type: "success", title: "Dispute Resolution", description: "Section 12 includes binding arbitration clause with clear jurisdiction." },
    { type: "info", title: "Non-Compete Duration", description: "The 18-month non-compete period in Section 9 may be unenforceable in some jurisdictions." },
    { type: "error", title: "Missing Termination Notice", description: "No termination notice period is specified. Best practice is 30-day written notice." },
  ],
  suggestions: [
    "Add pre-existing IP exclusion in Section 7",
    "Define specific acceptance criteria for each milestone in Section 3",
    "Specify a 30-day termination notice period",
    "Review non-compete duration for local enforceability",
    "Add force majeure clause for project delays",
  ],
  missingClauses: ["Force Majeure", "Limitation of Liability", "Warranty provisions"],
};

export default function AnalysisPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<typeof MOCK_ANALYSIS | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    setAnalysis(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleAnalyze = () => {
    if (!file) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysis(MOCK_ANALYSIS);
    }, 3000);
  };

  const CLAUSE_CONFIG = {
    warning: { icon: AlertTriangle, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/40" },
    success: { icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/40" },
    info: { icon: Info, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/40" },
    error: { icon: AlertTriangle, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/40" },
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold">Contract Analysis</h1>
        <p className="text-muted-foreground mt-1">Upload any contract — AI will review, summarize, and score it.</p>
      </motion.div>

      {/* Upload area */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`glass-card rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 ${
            isDragging ? "border-primary bg-primary/5 scale-[1.01]" : "hover:border-primary/50 hover:bg-accent/30"
          } ${file ? "border-primary/30" : ""}`}
          id="analysis-upload-zone"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            id="analysis-file-input"
          />

          {file ? (
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mx-auto mb-3">
                <FileText className="h-7 w-7 text-primary" />
              </div>
              <p className="font-semibold">{file.name}</p>
              <p className="text-sm text-muted-foreground mt-1">{(file.size / 1024).toFixed(1)} KB</p>
              <button
                onClick={(e) => { e.stopPropagation(); setFile(null); setAnalysis(null); }}
                className="mt-2 text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 mx-auto"
                id="analysis-remove-file"
              >
                <X className="h-3 w-3" /> Remove file
              </button>
            </div>
          ) : (
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted mx-auto mb-3">
                <Upload className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="font-semibold mb-1">Drop your contract here or click to upload</p>
              <p className="text-sm text-muted-foreground">Supports PDF, DOC, DOCX, TXT — up to 10MB</p>
            </div>
          )}
        </div>

        {file && !analysis && (
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full mt-4 gap-2"
            size="lg"
            id="analysis-analyze-btn"
          >
            {isAnalyzing ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing Contract...</>
            ) : (
              <><Sparkles className="h-4 w-4" /> Analyze with AI</>
            )}
          </Button>
        )}

        {isAnalyzing && (
          <div className="mt-4 glass-card rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <p className="text-sm font-medium">AI is analyzing your contract...</p>
            </div>
            <div className="space-y-2">
              {["Reading document structure", "Identifying clauses", "Running risk assessment", "Generating summary"].map((step, i) => (
                <div key={step} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                  {step}
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Analysis Results */}
      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            {/* Summary card */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg font-semibold mb-1">Analysis Summary</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{analysis.summary}</p>
                </div>
                <div className="shrink-0 text-center">
                  <div className={`text-3xl font-black ${
                    analysis.riskScore < 30 ? "text-emerald-600 dark:text-emerald-400" :
                    analysis.riskScore < 60 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"
                  }`}>
                    {analysis.riskScore}
                  </div>
                  <p className="text-xs text-muted-foreground">Risk Score</p>
                  <Badge variant={analysis.riskScore < 30 ? "success" : analysis.riskScore < 60 ? "warning" : "destructive"} className="mt-1">
                    {analysis.riskLevel}
                  </Badge>
                </div>
              </div>
              <Progress
                value={analysis.riskScore}
                indicatorClassName={
                  analysis.riskScore < 30 ? "bg-emerald-500" :
                  analysis.riskScore < 60 ? "bg-amber-500" : "bg-red-500"
                }
              />
            </div>

            {/* Clause analysis */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">Clause Analysis</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {analysis.clauses.map((clause, i) => {
                  const cfg = CLAUSE_CONFIG[clause.type as keyof typeof CLAUSE_CONFIG];
                  const Icon = cfg.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className={`rounded-xl border p-4 ${cfg.bg}`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <Icon className={`h-4 w-4 ${cfg.color}`} />
                        <p className={`text-xs font-semibold ${cfg.color}`}>{clause.title}</p>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{clause.description}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Suggestions & Missing Clauses */}
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="glass-card rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <h2 className="text-sm font-semibold">Suggestions</h2>
                </div>
                <ul className="space-y-2">
                  {analysis.suggestions.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="glass-card rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-4 w-4 text-red-500" />
                  <h2 className="text-sm font-semibold">Missing Clauses</h2>
                </div>
                <ul className="space-y-2">
                  {analysis.missingClauses.map((c, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <X className="h-3.5 w-3.5 text-red-500" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
