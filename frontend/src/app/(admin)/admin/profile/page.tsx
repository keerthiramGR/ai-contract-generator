"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Globe, Mail, Phone, MapPin, Upload, Save, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPANIES } from "@/lib/mock-data";

export default function AdminProfilePage() {
  const company = COMPANIES[0]; // Microsoft
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => { setIsSaving(false); setSaved(true); setTimeout(() => setSaved(false), 3000); }, 1500);
  };

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold">Company Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your company information and branding.</p>
      </motion.div>

      <div className="space-y-6">
        {/* Logo / Branding */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Company Branding</h2>
          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-500 text-white text-3xl font-bold shadow-lg">
              M
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Company Logo</p>
              <p className="text-xs text-muted-foreground mb-3">Upload your company logo (PNG, SVG — max 2MB)</p>
              <Button variant="outline" size="sm" className="gap-2" id="admin-upload-logo">
                <Upload className="h-4 w-4" />
                Upload Logo
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Company Info */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" /> Company Information
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { id: "profile-company-name", label: "Company Name", defaultValue: company.name, icon: Building2 },
              { id: "profile-industry", label: "Industry", defaultValue: company.industry, icon: Building2 },
              { id: "profile-website", label: "Website", defaultValue: company.website, icon: Globe },
              { id: "profile-email", label: "Business Email", defaultValue: "admin@microsoft.com", icon: Mail },
              { id: "profile-phone", label: "Phone Number", defaultValue: "+1 (425) 882-8080", icon: Phone },
              { id: "profile-location", label: "Headquarters", defaultValue: company.location, icon: MapPin },
            ].map((field) => {
              const Icon = field.icon;
              return (
                <div key={field.id}>
                  <label className="block text-sm font-medium mb-1.5" htmlFor={field.id}>{field.label}</label>
                  <div className="relative">
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      id={field.id}
                      type="text"
                      defaultValue={field.defaultValue}
                      className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
                    />
                  </div>
                </div>
              );
            })}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1.5" htmlFor="profile-description">Company Description</label>
              <textarea
                id="profile-description"
                rows={3}
                defaultValue={company.description}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 resize-none"
              />
            </div>
          </div>
        </motion.div>

        {/* Save */}
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full gap-2"
          size="lg"
          id="admin-save-profile"
        >
          {isSaving ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
          ) : saved ? (
            <><CheckCircle2 className="h-4 w-4" /> Saved!</>
          ) : (
            <><Save className="h-4 w-4" /> Save Changes</>
          )}
        </Button>
      </div>
    </div>
  );
}
