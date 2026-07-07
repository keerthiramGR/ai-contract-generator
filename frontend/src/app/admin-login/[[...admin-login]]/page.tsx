import { SignIn } from "@clerk/nextjs";
import { ShieldCheck } from "lucide-react";

export default function AdminSignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      {/* Dark background grid for admin */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <ShieldCheck className="h-6 w-6 text-indigo-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Portal Secure Login</h1>
          <p className="text-sm text-slate-400 mt-2">Authorized personnel only</p>
        </div>
        
        <SignIn
          fallbackRedirectUrl="/admin"
          appearance={{
            elements: {
              rootBox: "mx-auto w-full",
              card: "bg-slate-900 border border-slate-800 shadow-2xl",
              headerTitle: "text-white",
              headerSubtitle: "text-slate-400",
              formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700 text-white",
              socialButtonsBlockButton: "border-slate-700 hover:bg-slate-800 text-white",
              socialButtonsBlockButtonText: "text-slate-300",
              formFieldLabel: "text-slate-300",
              formFieldInput: "bg-slate-950 border-slate-700 text-white",
              footerActionText: "text-slate-400",
              footerActionLink: "text-indigo-400 hover:text-indigo-300",
              dividerLine: "bg-slate-800",
              dividerText: "text-slate-500",
              identityPreviewText: "text-white",
              identityPreviewEditButton: "text-indigo-400",
            },
          }}
        />
      </div>
    </div>
  );
}
