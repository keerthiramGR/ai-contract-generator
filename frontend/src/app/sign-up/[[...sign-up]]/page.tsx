import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center hero-gradient px-4">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.58_0.25_264/3%)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.58_0.25_264/3%)_1px,transparent_1px)] bg-[size:60px_60px]" />
      <div className="relative z-10">
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2 text-lg font-bold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-primary-foreground text-sm font-bold">C</span>
            </div>
            Contract<span className="brand-gradient-text">AI</span>
          </a>
          <p className="text-sm text-muted-foreground mt-2">Create your free account</p>
        </div>
        <SignUp
          fallbackRedirectUrl="/dashboard"
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "glass-card shadow-xl shadow-primary/10",
            },
          }}
        />
      </div>
    </div>
  );
}
