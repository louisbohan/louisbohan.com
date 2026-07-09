"use client";

import { useRef } from "react";
import {
  ArrowUpRight,
  Mail,
  ChevronDown,
  Hammer,
  Briefcase,
  Code2,
  DollarSign,
  Terminal,
  Palette,
} from "lucide-react";
import { motion, useInView } from "motion/react";
import AsciiParticleField from "@/components/ascii-particle-field";

// ── Utility ──

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

// ── Nav ──

function Nav() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-background/70 border-b border-border/30">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <span
          className="text-sm font-semibold tracking-wide text-foreground/80 cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          louisbohan.com
        </span>
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
    <section className="min-h-[85vh] relative flex items-center justify-center px-6 pt-14 overflow-hidden">
      <div className="max-w-3xl mx-auto text-center">
        <FadeInUp>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-medium mb-8">
            <Palette className="w-3 h-3" />
            Redesign in progress — v2 preview
          </div>
        </FadeInUp>

        <FadeInUp delay={0.1}>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
            I build{" "}
            <span className="text-amber-500">software that sells</span>.
          </h1>
        </FadeInUp>

        <FadeInUp delay={0.2}>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            ERP partnerships, full-stack apps, and AI-powered tools — from concept to deployment to revenue.
            <br className="hidden md:block" />
            Currently leading channel growth at <span className="text-foreground/80 font-medium">Odoo</span>.
          </p>
        </FadeInUp>

        <FadeInUp delay={0.3}>
          <div className="mt-8 flex items-center justify-center gap-4">
            <a
              href="https://github.com/louisbohan"
              target="_blank"
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-amber-500/10 transition-all"
            >
              <GitHubIcon />
            </a>
            <a
              href="https://www.linkedin.com/in/louis-bohan-9b31746"
              target="_blank"
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-amber-500/10 transition-all"
            >
              <LinkedInIcon />
            </a>
            <a
              href="mailto:lou@louisbohan.com"
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-amber-500/10 transition-all"
            >
              <Mail className="w-4 h-4" />
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

// ── Quick Summary Strip ──

const summaryItems = [
  { icon: Briefcase, label: "Channel Partnerships", detail: "Scaled programs 5x" },
  { icon: Code2, label: "Full-Stack Apps", detail: "TypeScript + Next.js" },
  { icon: DollarSign, label: "Revenue-Driven", detail: "Built products that sell" },
  { icon: Terminal, label: "AI Tooling", detail: "LLM pipelines + agents" },
];

function SummaryStrip() {
  return (
    <section className="py-12 md:py-16 px-6">
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryItems.map((item, i) => (
          <FadeInUp key={item.label} delay={i * 0.08}>
            <div className="card-base p-5 text-center flex flex-col items-center gap-2">
              <item.icon className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-semibold text-foreground/80">{item.label}</span>
              <span className="text-xs text-muted-foreground">{item.detail}</span>
            </div>
          </FadeInUp>
        ))}
      </div>
    </section>
  );
}

// ── What I Do ──

const roles = [
  {
    title: "Channel & Partnership Lead",
    company: "Odoo",
    description:
      "Scale partner programs, build GTM motion, design enablement frameworks. Grew North American channel 5x to 500+ accounts.",
    tags: ["Channel Sales", "Partner Enablement", "CRM Pipelines", "GTM Strategy"],
  },
  {
    title: "Full-Stack Builder",
    company: "Side projects & clients",
    description:
      "From idea to deployed app in days. Next.js, TypeScript, Tailwind, SQLite at the edge. Ship fast, iterate hard.",
    tags: ["Next.js", "TypeScript", "TailwindCSS", "Motion", "D1/KV"],
  },
  {
    title: "AI Tooling & Automation",
    company: "Vibe coder",
    description:
      "LLM routing proxies, brand scanning agents, SMS chatbots, automated reporting. Real tools that solve real problems.",
    tags: ["Claude/OpenAI APIs", "Prompt Engineering", "Automation Pipelines", "OpenClaw"],
  },
  {
    title: "Commercial Proof",
      company: "Revenue-driven development",
    description:
      "Built products that people pay for. Side projects with MRR. Know the difference between a feature and a product.",
    tags: ["Product-Market Fit", "Pricing", "Customer Dev", "Monetization"],
  },
];

function WorkSection() {
  return (
    <section id="work" className="py-16 md:py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <FadeInUp>
          <SectionHeading>What I Do</SectionHeading>
          <p className="mt-3 text-muted-foreground max-w-xl text-sm">
            I sit at the intersection of enterprise software sales and rapid AI-driven development.
            Most people can do one. I do both.
          </p>
        </FadeInUp>

        <div className="mt-10 grid md:grid-cols-2 gap-4">
          {roles.map((role, i) => (
            <FadeInUp key={role.title} delay={i * 0.1}>
              <div className="card-base p-6 h-full">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-foreground/90">{role.title}</h3>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full shrink-0 ml-2">
                    {role.company}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{role.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {role.tags.map((t) => (
                    <span key={t} className="text-xs text-amber-500/80 bg-amber-500/8 px-2 py-0.5 rounded-full border border-amber-500/15">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </FadeInUp>
          ))}
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
    link: "https://github.com/louisbohan/brand-availability-agent",
  },
  {
    title: "Prompt Router",
    description:
      "Intent-aware LLM routing proxy — auto-selects Claude, DeepSeek, or GPT per request. BYOK, AES-256, OpenAI-compatible.",
    tags: ["TypeScript", "LLM Routing", "AES-256", "MIT License"],
    link: "https://github.com/louisbohan/prompt-router",
  },
  {
    title: "Kitchen Remodel Estimator",
    description:
      "Interactive cost estimator for Bay Area contractors. Material selection, trade breakdowns, print-ready bid reports.",
    tags: ["Next.js", "TypeScript", "TailwindCSS", "Motion"],
    link: "https://github.com/louisbohan/kitchen-remodel-estimator",
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
    <section id="projects" className="py-16 md:py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <FadeInUp>
          <SectionHeading>Shipped</SectionHeading>
          <p className="mt-3 text-muted-foreground max-w-xl text-sm">
            Things I've built and deployed — from open-source tools to enterprise systems.
          </p>
        </FadeInUp>

        <div className="mt-10 grid md:grid-cols-2 gap-4">
          {projects.map((p, i) => (
            <FadeInUp key={p.title} delay={i * 0.1}>
              <div className="card-base p-6 h-full group">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-foreground/90">{p.title}</h3>
                  {p.link && (
                    <a
                      href={p.link}
                      target="_blank"
                      className="text-muted-foreground hover:text-foreground transition-colors shrink-0 ml-2"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  )}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <span key={t} className="text-xs text-amber-500/80 bg-amber-500/8 px-2 py-0.5 rounded-full border border-amber-500/15">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
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
    <section id="contact" className="py-16 md:py-24 px-6">
      <div className="max-w-xl mx-auto text-center">
        <FadeInUp>
          <SectionHeading>Get In Touch</SectionHeading>
          <p className="mt-3 text-muted-foreground text-sm">
            Whether you want to partner, commission a build, or just connect — I read everything.
          </p>
        </FadeInUp>

        <FadeInUp delay={0.15}>
          <div className="mt-10 card-base p-8">
            <div className="space-y-4">
              <a
                href="mailto:lou@louisbohan.com"
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-amber-500/5 transition-colors group"
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
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-amber-500/5 transition-colors group"
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
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-amber-500/5 transition-colors group"
              >
                <span className="flex items-center gap-3 text-sm">
                  <LinkedInIcon className="w-4 h-4 text-amber-500" />
                  <span>linkedin.com/in/louis-bohan-9b31746</span>
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
        <span>© {new Date().getFullYear()} Louis Bohan</span>
        <span>Built with Next.js on Vercel</span>
      </div>
    </footer>
  );
}

// ── Page ──

export default function Home() {
  return (
    <main className="relative">
      <AsciiParticleField density="sparse" />
      <Nav />
      <Hero />
      <SummaryStrip />
      <WorkSection />
      <ProjectsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
