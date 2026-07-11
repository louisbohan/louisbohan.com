"use client";

import { useRef } from "react";
import {
  ArrowUpRight,
  Mail,
  ChevronDown,
  Code2,
  Building2,
  Bot,
  TrendingUp,
} from "lucide-react";
import { motion, useInView } from "motion/react";
import AsciiFlashlight from "@/components/AsciiFlashlight";

// ── Icons ──

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-4 h-4"} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-4 h-4"} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

// ── Shared Components ──

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground/90">
      {children}
    </h2>
  );
}

function FadeInUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.2, 0.65, 0.3, 0.9] }}
    >
      {children}
    </motion.div>
  );
}

function Tag({ children }: { children: string }) {
  return (
    <span className="inline-block text-xs text-amber-500/80 bg-amber-500/8 px-2.5 py-1 rounded-full border border-amber-500/15">
      {children}
    </span>
  );
}

// ── Nav ──

function Nav() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-background/70 border-b border-border/30">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <button
          className="text-sm font-semibold tracking-wide text-foreground/80 hover:text-foreground transition-colors"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          louisbohan.com
        </button>
        <div className="flex items-center gap-5 text-sm text-muted-foreground">
          <button onClick={() => scrollTo("work")} className="hover:text-foreground transition-colors">
            Work
          </button>
          <button onClick={() => scrollTo("projects")} className="hover:text-foreground transition-colors">
            Projects
          </button>
          <button onClick={() => scrollTo("contact")} className="hover:text-foreground transition-colors">
            Contact
          </button>
        </div>
      </div>
    </nav>
  );
}

// ── Hero ──

function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-6 pt-14 overflow-hidden">
      {/* Subtle gradient orbs for depth */}
      <div aria-hidden className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-amber-500/[0.03] blur-3xl" />
      <div aria-hidden className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-amber-500/[0.04] blur-3xl" />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <FadeInUp delay={0.1}>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            Louis Bohan
          </h1>
        </FadeInUp>

        <FadeInUp delay={0.15}>
          <p className="mt-5 text-sm md:text-base text-amber-500/80 max-w-xl mx-auto leading-relaxed">
            Acting Head – Partnership Development @ Odoo | ERP & SaaS Channel Strategy | Partner-Led Growth | MBA | Enablement & Alliances
          </p>
        </FadeInUp>

        <FadeInUp delay={0.2}>
          <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            ERP partnerships, full-stack apps, and AI-powered tools — from concept to deployment to revenue. Currently leading channel growth at Odoo.
          </p>
        </FadeInUp>

        <FadeInUp delay={0.3}>
          <div className="mt-8 flex items-center justify-center gap-5">
            <a
              id="github-icon"
              href="https://github.com/louisbohan"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-amber-500/10 hover:border-amber-500/30 border border-border/50 transition-all"
              aria-label="GitHub Profile"
              title="GitHub"
            >
              <GitHubIcon className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/louis-bohan-9b31746"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-amber-500/10 hover:border-amber-500/30 border border-border/50 transition-all"
              aria-label="LinkedIn Profile"
              title="LinkedIn"
            >
              <LinkedInIcon className="w-5 h-5" />
            </a>
            <a
              href="mailto:lou@louisbohan.com"
              className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-amber-500/10 hover:border-amber-500/30 border border-border/50 transition-all"
              aria-label="Send Email"
              title="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </FadeInUp>

        <FadeInUp delay={0.4}>
          <button
            onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}
            className="mt-12 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>Scroll to explore</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </button>
        </FadeInUp>
      </div>
    </section>
  );
}

// ── Work / What I Do ──

const roles = [
  {
    title: "Channel & Partnership Development",
    company: "Odoo",
    description:
      "Acting Head — Partnership Development for North America. Scale partner programs, build GTM motion, design enablement frameworks. Grew partner ecosystem 5x to 500+ accounts. Closed 60+ new partner accounts personally, exceeding MRR targets by 300%+.",
    tags: ["Channel Sales", "Partner Enablement", "CRM Pipelines", "GTM Strategy"],
    icon: <Building2 className="w-5 h-5" />,
  },
  {
    title: "Full-Stack Engineering",
    company: "Side Projects & Clients",
    description:
      "Rapid prototyping to deployed app in days. Next.js, TypeScript, Tailwind, SQLite at the edge. Ship fast, iterate hard.",
    tags: ["Next.js", "TypeScript", "TailwindCSS", "Motion", "D1/KV"],
    icon: <Code2 className="w-5 h-5" />,
  },
  {
    title: "AI Tooling & Automation",
    company: "Vibe Coder",
    description:
      "LLM routing proxies, brand scanning agents, SMS chatbots, automated reporting. Real tools that solve real problems.",
    tags: ["Claude/OpenAI APIs", "Prompt Engineering", "Automation Pipelines", "OpenClaw"],
    icon: <Bot className="w-5 h-5" />,
  },
  {
    title: "Revenue-Focused Building",
    company: "Product Validation",
    description:
      "Built products that people pay for. Know the difference between a feature and a product. Side projects with real MRR.",
    tags: ["Product-Market Fit", "Pricing", "Customer Dev", "Monetization"],
    icon: <TrendingUp className="w-5 h-5" />,
  },
];

function WorkSection() {
  return (
    <section id="work" className="py-20 md:py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <FadeInUp>
          <SectionHeading>What I Do</SectionHeading>
          <p className="mt-3 text-muted-foreground max-w-2xl text-sm leading-relaxed">
            I specialize in building and scaling partner ecosystems for ERP and SaaS companies, with a focus on channel recruitment, enablement, and go-to-market execution. At Odoo, I&apos;ve helped scale our North American partner program by 5x over four years, leading a team that has closed 500+ new implementation and channel partner accounts.
          </p>
        </FadeInUp>

        <div className="mt-10 grid md:grid-cols-6 gap-4">
          {/* Full-width: Channel card */}
          <FadeInUp delay={0.1}>
            <div className="card-base p-6 h-full md:col-span-6 group relative overflow-hidden">
              <div aria-hidden className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-amber-500/[0.03] blur-2xl group-hover:bg-amber-500/[0.06] transition-all" />
              <div className="flex items-start justify-between mb-3 relative z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                    {roles[0].icon}
                  </div>
                  <h3 className="font-semibold text-foreground/90">{roles[0].title}</h3>
                </div>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full shrink-0 ml-2">
                  {roles[0].company}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{roles[0].description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {roles[0].tags.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
            </div>
          </FadeInUp>

          {/* Side-by-side: Full-Stack + AI Tooling */}
          <FadeInUp delay={0.2}>
            <div className="card-base p-6 h-full md:col-span-3 group relative overflow-hidden">
              <div aria-hidden className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-amber-500/[0.02] blur-2xl group-hover:bg-amber-500/[0.05] transition-all" />
              <div className="flex items-center gap-2.5 mb-3 relative z-10">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                  {roles[1].icon}
                </div>
                <h3 className="font-semibold text-foreground/90">{roles[1].title}</h3>
              </div>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full mb-3 inline-block">
                {roles[1].company}
              </span>
              <p className="text-sm text-muted-foreground leading-relaxed">{roles[1].description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {roles[1].tags.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
            </div>
          </FadeInUp>

          <FadeInUp delay={0.25}>
            <div className="card-base p-6 h-full md:col-span-3 group relative overflow-hidden">
              <div aria-hidden className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-amber-500/[0.02] blur-2xl group-hover:bg-amber-500/[0.05] transition-all" />
              <div className="flex items-center gap-2.5 mb-3 relative z-10">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                  {roles[2].icon}
                </div>
                <h3 className="font-semibold text-foreground/90">{roles[2].title}</h3>
              </div>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full mb-3 inline-block">
                {roles[2].company}
              </span>
              <p className="text-sm text-muted-foreground leading-relaxed">{roles[2].description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {roles[2].tags.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
            </div>
          </FadeInUp>

          {/* Full-width: Commercial Proof / Revenue */}
          <FadeInUp delay={0.3}>
            <div className="card-base p-6 h-full md:col-span-6 group relative overflow-hidden">
              <div aria-hidden className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-amber-500/[0.03] blur-2xl group-hover:bg-amber-500/[0.06] transition-all" />
              <div className="flex items-start justify-between mb-3 relative z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                    {roles[3].icon}
                  </div>
                  <h3 className="font-semibold text-foreground/90">{roles[3].title}</h3>
                </div>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full shrink-0 ml-2">
                  {roles[3].company}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{roles[3].description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {roles[3].tags.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
            </div>
          </FadeInUp>
        </div>
      </div>
    </section>
  );
}

// ── Projects ──

const projects = [
  {
    title: "Brand Availability Agent",
    description:
      "Scans 50+ platforms to check brand name availability. DNS verification, AI strategist analysis, automated scoring.",
    tags: ["Next.js", "TypeScript", "Prisma", "Claude API", "TailwindCSS"],
    link: "https://brand-availability-demo.vercel.app",
  },
  {
    title: "Prompt Router",
    description:
      "Intent-aware LLM routing proxy — auto-selects Claude, DeepSeek, or GPT per request. BYOK, AES-256, OpenAI-compatible.",
    tags: ["TypeScript", "LLM Routing", "AES-256", "MIT License"],
    link: "https://prompt-router-demo.vercel.app",
  },
  {
    title: "Kitchen Remodel Estimator",
    description:
      "Interactive cost estimator for Bay Area contractors. Material selection, trade breakdowns, print-ready bid reports.",
    tags: ["Next.js", "TypeScript", "TailwindCSS", "Motion"],
    link: "https://kitchen-remodel-estimator.vercel.app",
  },
  {
    title: "Odoo Partner Program Growth",
    description:
      "Outreach automation, enablement frameworks, KPI dashboards. Scaled from 100 to 500+ active partner accounts.",
    tags: ["Odoo", "Python", "CRM Automation", "Data Pipelines"],
    link: null,
  },
];

function ProjectsSection() {
  return (
    <section id="projects" className="py-20 md:py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <FadeInUp>
          <SectionHeading>Shipped</SectionHeading>
          <p className="mt-3 text-muted-foreground max-w-xl text-sm">
            Things I&apos;ve built and deployed — from open-source tools to enterprise systems.
          </p>
        </FadeInUp>

        <div className="mt-10 grid md:grid-cols-2 gap-4">
          {projects.map((p, i) => (
            <FadeInUp key={p.title} delay={i * 0.1}>
              {p.link ? (
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block card-base p-6 h-full group relative overflow-hidden"
                >
                  <div aria-hidden className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-amber-500/[0.02] blur-2xl group-hover:bg-amber-500/[0.06] transition-all" />
                  <div className="flex items-start justify-between mb-2 relative z-10">
                    <h3 className="font-semibold text-foreground/90 group-hover:text-amber-500 transition-colors">
                      {p.title}
                    </h3>
                    <ExternalLinkIcon />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </div>
                </a>
              ) : (
                <div className="card-base p-6 h-full group relative overflow-hidden">
                  <div aria-hidden className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-amber-500/[0.02] blur-2xl group-hover:bg-amber-500/[0.06] transition-all" />
                  <div className="flex items-start justify-between mb-2 relative z-10">
                    <h3 className="font-semibold text-foreground/90">{p.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </div>
                </div>
              )}
            </FadeInUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Contact ──

function ContactSection() {
  return (
    <section id="contact" className="py-20 md:py-28 px-6">
      <div className="max-w-xl mx-auto text-center">
        <FadeInUp>
          <SectionHeading>Get In Touch</SectionHeading>
          <p className="mt-3 text-muted-foreground text-sm">
            Whether you want to partner, commission a build, or just connect — I read everything.
          </p>
        </FadeInUp>

        <FadeInUp delay={0.15}>
          <div className="mt-10 card-base p-8">
            <div className="space-y-3">
              <a
                href="mailto:lou@louisbohan.com"
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-amber-500/5 border border-border/30 hover:border-amber-500/20 transition-all group"
              >
                <span className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-amber-500" />
                  <span>lou@louisbohan.com</span>
                </span>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </a>
              <a
                href="https://github.com/louisbohan"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-amber-500/5 border border-border/30 hover:border-amber-500/20 transition-all group"
              >
                <span className="flex items-center gap-3 text-sm">
                  <GitHubIcon className="w-4 h-4 text-amber-500" />
                  <span>github.com/louisbohan</span>
                </span>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </a>
              <a
                href="https://www.linkedin.com/in/louis-bohan-9b31746"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-amber-500/5 border border-border/30 hover:border-amber-500/20 transition-all group"
              >
                <span className="flex items-center gap-3 text-sm">
                  <LinkedInIcon className="w-4 h-4 text-amber-500" />
                  <span>linkedin.com/in/louis-bohan</span>
                </span>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </a>
            </div>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}

// ── Footer ──

function Footer() {
  return (
    <footer className="border-t border-border/30 py-8 px-6 mt-12">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>&copy; {new Date().getFullYear()} Louis Bohan</span>
        <span>Built with Next.js on Vercel</span>
      </div>
    </footer>
  );
}

// ── Page ──

export default function Home() {
  return (
    <main className="relative">
      <AsciiFlashlight originSelector="#github-icon" />
      <Nav />
      <Hero />
      <WorkSection />
      <ProjectsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
