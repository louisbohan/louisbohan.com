import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Download, Mail, Phone, MapPin } from "lucide-react";

function LinkedInMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export const metadata: Metadata = {
  title: "Resume | Louis Bohan — Partner Management & Ecosystem Buildout",
  description:
    "Louis Bohan — partner management leader. Built and scaled Odoo's partner ecosystem from 100 to 500+ active partners, 160% avg YoY partner-sourced revenue growth, 12-person team. San Francisco.",
  keywords: [
    "Louis Bohan", "resume", "partner management", "partner ecosystem",
    "channel partners", "Odoo", "San Francisco", "SaaS partnerships",
    "partner program buildout", "co-sell", "GTM strategy",
  ],
  openGraph: {
    title: "Louis Bohan — Resume",
    description:
      "Partner management leader: built Odoo's partner ecosystem from 100 to 500+ partners, 160% avg YoY partner-sourced revenue growth.",
    url: "https://louisbohan.com/resume",
    siteName: "Louis Bohan",
    type: "profile",
  },
  robots: { index: true, follow: true },
};

const CONTACT = {
  location: "San Francisco, CA",
  phone: "(650) 713-6162",
  email: "lou@louisbohan.com",
  linkedin: "linkedin.com/in/louis-bohan-9b31746",
  linkedinUrl: "https://www.linkedin.com/in/louis-bohan-9b31746",
};

const FOCUS = [
  "Partner Program Buildout & Lifecycle Management",
  "Partner-Sourced Pipeline & Revenue",
  "Joint GTM & Co-Sell Strategy",
];

const SUMMARY = [
  `Partner management leader with 4+ years building and scaling a partner ecosystem at Odoo — a $5B+ enterprise SaaS platform where I owned the full partner lifecycle from strategy and recruitment through enablement, joint selling, performance management, and long-term growth. I identified, recruited, onboarded, and managed strategic technology, services, referral, and channel partners. I created scalable partner programs (qualification criteria, onboarding, enablement, engagement models, and performance standards), developed joint GTM strategies (co-selling, co-marketing, referrals, events), and partnered cross-functionally with Sales, Marketing, Product, and Customer Success. I grew the ecosystem from 100 to 500+ active partners, drove 160% avg YoY partner-sourced revenue growth, and led a 12-person team.`,
  `Aurasell is building the world's first AI-native CRM platform — $30M Seed from Menlo Ventures, Unusual Ventures, and N47 — and is hiring a Director of Partner Management to build out the partner ecosystem from scratch. That is the function I built at Odoo. I also ship production LLM agent systems on Anthropic's Claude, so the AI-native GTM platform Aurasell is building is native ground.`,
];

const EXPERIENCE = [
  {
    title: "Partnership Development, NA (Team Lead)",
    company: "Odoo",
    location: "San Francisco, CA",
    period: "2023–2026",
    bullets: [
      "Owned the full partner lifecycle — strategy, recruitment, onboarding, enablement, joint selling, performance management, and growth — across 500+ technology, services, referral, and channel partners for a $5B+ enterprise SaaS platform. Built executive-level relationships and mutually beneficial business plans. Drove 160% avg YoY partner-sourced revenue growth.",
      "Created scalable partner programs from scratch — qualification criteria, onboarding, enablement, engagement models, incentives, and performance standards. Equipped partners with messaging, product knowledge, training, and tools. Delivered webinars reaching 3,000+ cumulative registrants.",
      "Developed joint GTM strategies (co-selling, co-marketing, referrals, events) and partnered cross-functionally with Sales, Marketing, Product, and Customer Success to support partner-sourced and partner-influenced revenue. Built and maintained a healthy partner pipeline tracking opportunities, referrals, and revenue contribution.",
      "Led a 12-person team and established partner success metrics with regular reporting on pipeline, bookings, activation, and ROI. Gathered partner feedback to inform product priorities and positioning. Represented the platform at partner meetings, events, and executive briefings.",
    ],
  },
  {
    title: "Partner Recruitment Specialist",
    company: "Odoo",
    location: "San Francisco, CA",
    period: "2022–2023",
    bullets: [
      "Closed 60+ partnerships through full-cycle business development — sourcing through close. Built executive-level relationships with partner principals and decision-makers. Generated measurable pipeline and revenue through partnerships. Exceeded partner-sourced revenue targets by 300% in first year.",
      "Exceeded growth targets at >600% of assigned quota. Awarded Best MRR Partnership Recruitment and New Partner Attainment at a team-record 3x growth rate.",
    ],
  },
  {
    title: "Education & Client Management",
    company: "Various Institutions",
    location: "Taiwan",
    period: "2011–2021",
    bullets: [
      "Managed institutional partnerships and delivered programs for 500+ clients across education and enterprise organizations. Developed external relationships that produced measurable outcomes. Maintained operational rigor across concurrent programs.",
    ],
  },
];

const SKILLS = [
  "Partner program buildout (0-to-1) & lifecycle management",
  "Partner-sourced pipeline & revenue generation",
  "Joint GTM strategy (co-sell, co-marketing, referrals)",
  "Partner enablement & performance management",
  "Cross-functional collaboration (Sales, Marketing, Product, CS)",
  "Production LLM agent systems (AI fluency)",
  "CRM & GTM platform expertise",
  "Team leadership (12-person team)",
];

const AWARDS = [
  "Best MRR Partnership Recruitment (>600% of target)",
  "New Partner Attainment (team-record 3x growth)",
];

const EDUCATION = [
  {
    degree: "MBA",
    school: "South Taiwan University of Science and Technology",
    location: "Taiwan",
    period: "2012–2015",
  },
  {
    degree: "BA, Journalism",
    school: "San Francisco State University",
    location: "San Francisco",
    period: "2007–2010",
  },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold tracking-[0.18em] uppercase text-amber-500/80 mb-5">
      {children}
    </h2>
  );
}

export default function ResumePage() {
  return (
    <main className="relative min-h-full">
      {/* ── Nav ── */}
      <nav className="no-print fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-background/70 border-b border-border/30">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-semibold tracking-wide">louisbohan.com</span>
          </Link>
          <a
            href="/louis-bohan-resume.pdf"
            download
            className="inline-flex items-center gap-2 text-sm font-medium text-amber-500 hover:text-amber-400 transition-colors"
          >
            <Download className="w-4 h-4" />
            PDF
          </a>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-24 pb-20">
        {/* ── Header ── */}
        <header className="pb-8 border-b border-border/40">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-none">
            Louis Bohan
          </h1>

          <ul className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <li className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-500/60" />
              {CONTACT.location}
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-500/60" />
              <a href={`tel:${CONTACT.phone.replace(/[^0-9+]/g, "")}`} className="hover:text-foreground transition-colors">
                {CONTACT.phone}
              </a>
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-amber-500/60" />
              <a href={`mailto:${CONTACT.email}`} className="hover:text-foreground transition-colors">
                {CONTACT.email}
              </a>
            </li>
            <li className="inline-flex items-center gap-1.5">
              <LinkedInMark className="w-3.5 h-3.5 text-amber-500/60" />
              <a
                href={CONTACT.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                {CONTACT.linkedin}
              </a>
            </li>
          </ul>

          <p className="mt-5 text-sm text-amber-500/80 leading-relaxed">
            {FOCUS.join("  •  ")}
          </p>

          <div className="no-print mt-7 flex flex-wrap items-center gap-3">
            <a
              href="/louis-bohan-resume.pdf"
              download
              className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-semibold text-[#0f1923] hover:bg-amber-500 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </a>
            <a
              href={`mailto:${CONTACT.email}?subject=Let%27s%20talk`}
              className="inline-flex items-center gap-2 rounded-lg border border-border/60 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-amber-500/40 transition-colors"
            >
              <Mail className="w-4 h-4" />
              Email me
            </a>
          </div>
        </header>

        {/* ── Summary ── */}
        <section className="pt-10">
          <SectionLabel>Professional Summary</SectionLabel>
          <div className="space-y-4 text-[15px] leading-relaxed text-foreground/80">
            {SUMMARY.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
        </section>

        {/* ── Experience ── */}
        <section className="pt-12">
          <SectionLabel>Experience</SectionLabel>
          <div className="space-y-9">
            {EXPERIENCE.map((job) => (
              <article key={job.title + job.period}>
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                  <h3 className="text-base font-semibold text-foreground/95">
                    {job.title}
                    <span className="text-muted-foreground font-normal">  |  {job.company} — {job.location}</span>
                  </h3>
                  <span className="font-mono text-xs text-amber-500/70 whitespace-nowrap">
                    {job.period}
                  </span>
                </div>
                <ul className="mt-3 space-y-2.5">
                  {job.bullets.map((b) => (
                    <li key={b.slice(0, 40)} className="relative pl-4 text-[14.5px] leading-relaxed text-foreground/75 before:content-[''] before:absolute before:left-0 before:top-[0.6em] before:w-1.5 before:h-1.5 before:rounded-full before:bg-amber-500/40">
                      {b}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* ── Skills ── */}
        <section className="pt-12">
          <SectionLabel>Skills</SectionLabel>
          <ul className="flex flex-wrap gap-2">
            {SKILLS.map((s) => (
              <li
                key={s}
                className="text-xs text-foreground/80 bg-muted/60 border border-border/50 rounded-full px-3 py-1.5"
              >
                {s}
              </li>
            ))}
          </ul>
        </section>

        {/* ── Awards + Education ── */}
        <div className="pt-12 grid md:grid-cols-2 gap-10">
          <section>
            <SectionLabel>Awards</SectionLabel>
            <ul className="space-y-2.5">
              {AWARDS.map((a) => (
                <li key={a} className="text-[14.5px] leading-relaxed text-foreground/75">
                  {a}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <SectionLabel>Education</SectionLabel>
            <ul className="space-y-4">
              {EDUCATION.map((e) => (
                <li key={e.degree}>
                  <div className="text-[14.5px] font-medium text-foreground/90">{e.degree}</div>
                  <div className="text-sm text-muted-foreground">
                    {e.school}, {e.location}
                  </div>
                  <div className="font-mono text-xs text-amber-500/60 mt-0.5">{e.period}</div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* ── Footer ── */}
        <footer className="mt-16 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} Louis Bohan</span>
          <Link href="/" className="no-print hover:text-foreground transition-colors">
            louisbohan.com
          </Link>
        </footer>
      </div>
    </main>
  );
}
