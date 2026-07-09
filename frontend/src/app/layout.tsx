import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Accord – Humanistic Contract Generation & Approval Platform",
    template: "%s | Accord",
  },
  description:
    "Generate, review, and sign professional contracts with humanistic design, company approval workflows, and e-signatures on Accord.",
  keywords: [
    "AI contract generator",
    "contract management",
    "digital contracts",
    "legal documents",
    "e-signature",
    "company approval workflow",
    "Accord",
  ],
  authors: [{ name: "Accord" }],
  openGraph: {
    title: "Accord – Premium Contract Generation",
    description:
      "Generate, review, and sign professional agreements with custom branding.",
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
      <html lang="en" className={`${jakarta.variable} ${playfair.variable} h-full`} suppressHydrationWarning>
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
