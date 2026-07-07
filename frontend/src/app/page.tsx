import { Navbar } from "@/components/layout/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { CompaniesSection } from "@/components/landing/companies-section";
import { HowItWorksSection } from "@/components/landing/about-section";
import { ContactSection } from "@/components/landing/contact-section";
import Link from "next/link";
import { FileText, Share2, GitBranch, Globe } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <CompaniesSection />
        <HowItWorksSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <FileText className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold">
                  Contract<span className="brand-gradient-text">AI</span>
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                AI-powered contract generation and company approval platform. From draft
                to signed in minutes.
              </p>
              <div className="flex items-center gap-3 mt-4">
                {[Share2, GitBranch, Globe].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/50 text-muted-foreground hover:text-foreground hover:border-border transition-all"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Product */}
            <div>
              <p className="text-sm font-semibold mb-3">Product</p>
              <ul className="space-y-2">
                {["Features", "Companies", "Pricing", "Security", "API"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <p className="text-sm font-semibold mb-3">Company</p>
              <ul className="space-y-2">
                {["About", "Blog", "Careers", "Press", "Contact"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} ContractAI. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/sign-in" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                User Login
              </Link>
              <Link href="/admin" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Admin Portal
              </Link>
              <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
