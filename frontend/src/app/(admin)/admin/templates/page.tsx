"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Edit3, Trash2, ToggleLeft, ToggleRight, Search,
  FileText, CheckCircle2, X, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TEMPLATES } from "@/lib/mock-data";
import { ContractTemplate } from "@/lib/types";
import { PURPOSE_LABELS } from "@/lib/mock-data";

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState<ContractTemplate[]>(TEMPLATES);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const toggle = (id: string) => {
    setTemplates((prev) => prev.map((t) => t.id === id ? { ...t, isActive: !t.isActive } : t));
  };

  const filtered = templates.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase()) || t.companyName.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => { setIsSaving(false); setEditingId(null); setShowCreate(false); }, 1500);
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Template Management</h1>
          <p className="text-muted-foreground mt-1">{templates.filter((t) => t.isActive).length} active templates</p>
        </div>
        <Button className="gap-2" onClick={() => setShowCreate(true)} id="admin-create-template">
          <Plus className="h-4 w-4" />
          New Template
        </Button>
      </motion.div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search templates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-input bg-background pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
          id="admin-templates-search"
        />
      </div>

      {/* Create / Edit modal */}
      <AnimatePresence>
        {(showCreate || editingId) && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="glass-card rounded-2xl p-6 mb-6 border border-primary/20"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{editingId ? "Edit Template" : "Create New Template"}</h2>
              <button onClick={() => { setEditingId(null); setShowCreate(false); }} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1.5">Template Title</label>
                <input
                  type="text"
                  defaultValue={editingId ? templates.find((t) => t.id === editingId)?.title : ""}
                  placeholder="e.g. Software Engineer Employment Agreement"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
                  id="template-title-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Contract Type</label>
                <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50" id="template-purpose-select">
                  {Object.entries(PURPOSE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Department</label>
                <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50" id="template-dept-select">
                  {["IT", "HR", "Finance", "Marketing", "Operations", "Legal", "Sales"].map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1.5">Template Content</label>
                <textarea
                  rows={6}
                  placeholder="Enter template content with [PLACEHOLDERS]..."
                  defaultValue={editingId ? templates.find((t) => t.id === editingId)?.content.slice(0, 200) + "..." : ""}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 font-mono resize-none"
                  id="template-content-input"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => { setEditingId(null); setShowCreate(false); }} id="template-cancel">Cancel</Button>
              <Button onClick={handleSave} disabled={isSaving} id="template-save">
                {isSaving ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Saving...</> : <><CheckCircle2 className="h-4 w-4 mr-1" /> Save Template</>}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Templates list */}
      <div className="space-y-3">
        {filtered.map((template, i) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`glass-card rounded-xl overflow-hidden ${!template.isActive ? "opacity-60" : ""}`}
          >
            <div className="flex items-center gap-4 px-5 py-4">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${template.isActive ? "bg-primary/10" : "bg-muted"}`}>
                <FileText className={`h-5 w-5 ${template.isActive ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold truncate">{template.title}</p>
                  <Badge variant={template.isActive ? "success" : "secondary"}>
                    {template.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">{PURPOSE_LABELS[template.purpose]?.split(" ")[0]}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {template.department} · Used {template.usageCount} times · {template.placeholders.length} placeholders
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggle(template.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                  title={template.isActive ? "Deactivate" : "Activate"}
                  id={`template-toggle-${template.id}`}
                >
                  {template.isActive ? <ToggleRight className="h-4 w-4 text-emerald-500" /> : <ToggleLeft className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => setEditingId(template.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                  title="Edit"
                  id={`template-edit-${template.id}`}
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                  title="Delete"
                  id={`template-delete-${template.id}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
