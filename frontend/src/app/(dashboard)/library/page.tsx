"use client";

import { motion } from "framer-motion";
import { Search, Filter, FileText, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PURPOSE_LABELS } from "@/lib/mock-data";
import { ContractPurpose } from "@/lib/types";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const COMPANY_COLORS = ["bg-blue-500", "bg-red-500", "bg-orange-500", "bg-blue-600", "bg-gray-800", "bg-red-600", "bg-gray-700", "bg-emerald-600"];

export default function LibraryPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [selectedPurpose, setSelectedPurpose] = useState<ContractPurpose | "all">("all");

  useEffect(() => {
    async function fetchData() {
      // 1. Fetch templates
      const { data: templatesData, error: templatesError } = await supabase
        .from("contract_templates")
        .select("*, companies(company_name, company_logo, status, description)")
        .eq("is_active", true);

      if (!templatesError && templatesData) {
        setTemplates(templatesData.map((t: any) => ({
          id: t.id,
          companyId: t.company_id,
          companyName: t.companies?.company_name || "Unknown Company",
          title: t.template_name,
          purpose: (t.category_id ? "nda" : "custom") as ContractPurpose, // category map or fallback nda/custom
          department: "Legal",
          description: t.companies?.description || "Official contract template.",
          isActive: t.is_active,
          logo: t.companies?.company_logo || "?",
          verified: t.companies?.status === "approved",
          usageCount: 12,
          placeholders: ["Party Name", "Date", "Duration"],
        })));
      }

      // 2. Fetch companies
      const { data: companiesData, error: companiesError } = await supabase
        .from("companies")
        .select("*");

      if (!companiesError && companiesData) {
        setCompanies(companiesData.map((c: any) => ({
          id: c.id,
          name: c.company_name,
          logo: c.company_logo || "?",
          verified: c.status === "approved",
        })));
      }

      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const filtered = templates.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.companyName.toLowerCase().includes(search.toLowerCase());
    const matchCompany = selectedCompany === "all" || t.companyId === selectedCompany;
    const matchPurpose = selectedPurpose === "all" || t.purpose === selectedPurpose;
    return matchSearch && matchCompany && matchPurpose && t.isActive;
  });

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold">Template Library</h1>
        <p className="text-muted-foreground mt-1">Browse official contract templates from verified companies.</p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-input bg-background pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
            id="library-search"
          />
        </div>
        <select
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
          id="library-filter-company"
        >
          <option value="all">All Companies</option>
          {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select
          value={selectedPurpose}
          onChange={(e) => setSelectedPurpose(e.target.value as ContractPurpose | "all")}
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
          id="library-filter-purpose"
        >
          <option value="all">All Types</option>
          {Object.entries(PURPOSE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {/* Templates grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((template, i) => {
          const companyIndex = companies.findIndex((c) => c.id === template.companyId);
          const colorClass = companyIndex !== -1 ? COMPANY_COLORS[companyIndex % COMPANY_COLORS.length] : "bg-gray-800";
          return (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass-card rounded-2xl p-5 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-0.5 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-start gap-3 mb-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colorClass} text-white font-bold shadow-md`}>
                  {template.logo || "?"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-semibold text-muted-foreground truncate">{template.companyName}</p>
                    {template.verified && <CheckCircle2 className="h-3 w-3 shrink-0 text-primary" />}
                  </div>
                  <p className="text-sm font-semibold leading-tight mt-0.5">{template.title}</p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-4">{template.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="secondary" className="text-[10px] px-2">{template.department}</Badge>
                  <Badge variant="outline" className="text-[10px] px-2">{PURPOSE_LABELS[template.purpose]?.split(" ")[0] || "Custom"}</Badge>
                </div>
                <Link href="/contracts/create">
                  <Button size="sm" variant="outline" className="text-xs h-7" id={`library-use-${template.id}`}>
                    Use Template
                  </Button>
                </Link>
              </div>

              <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                <span>Used {template.usageCount} times</span>
                <span>{template.placeholders.length} placeholders</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-muted-foreground">No templates found for the selected filters.</p>
        </div>
      )}
    </div>
  );
}
