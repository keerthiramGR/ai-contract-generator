import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ContractAI – AI-Powered Contract Generation & Approval Platform",
    template: "%s | ContractAI",
  },
  description:
    "Generate professional contracts with AI, submit to companies for approval, and manage your entire contract lifecycle on one enterprise platform.",
  keywords: [
    "AI contract generator",
    "contract management",
    "digital contracts",
    "legal documents",
    "e-signature",
    "company approval workflow",
  ],
  authors: [{ name: "ContractAI" }],
  openGraph: {
    title: "ContractAI – AI-Powered Contract Generation",
    description:
      "Generate, review, and approve professional contracts with AI assistance.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
        <body className="min-h-full flex flex-col antialiased">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange={false}
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
