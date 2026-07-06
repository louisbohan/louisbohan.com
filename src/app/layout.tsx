import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Louis Bohan | Systems Architect — ERP Partnerships, Automation & Custom Tools",
  description:
    "I help businesses run better — through partnerships, automation, and custom tools. ERP channel strategy, full-stack apps, and systems thinking.",
  openGraph: {
    title: "Louis Bohan | Systems Architect",
    description:
      "I help businesses run better — through partnerships, automation, and custom tools.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0f172a] text-[#f8fafc]">
        {children}
      </body>
    </html>
  );
}
