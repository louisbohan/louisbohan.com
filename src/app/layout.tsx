import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Louis Bohan | Software That Sells — ERP Partnerships & AI Tooling",
  description:
    "I build software that sells. ERP channel strategy, full-stack applications, and AI-powered tools — from concept to deployment to revenue.",
  keywords: [
    "Louis Bohan", "ERP partnerships", "Odoo", "sales engineering",
    "full-stack developer", "AI tooling", "vibe coder", "San Francisco",
    "partner program", "SaaS growth",
  ],
  openGraph: {
    title: "Louis Bohan | Software That Sells",
    description:
      "ERP partnerships, full-stack apps, and AI tooling — from concept to revenue.",
    url: "https://louisbohan.com",
    siteName: "Louis Bohan",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Louis Bohan | Software That Sells",
    description:
      "ERP partnerships, full-stack apps, and AI tooling — from concept to revenue.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
