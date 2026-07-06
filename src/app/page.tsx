"use client";

import TerminalHero from "@/components/terminal-hero";
import AnimatedHeading from "@/components/animated-heading";
import AnimatedCounter from "@/components/animated-counter";
import ArchitectureDiagram from "@/components/architecture-diagram";
import ProjectCard from "@/components/project-card";
import ServiceCard from "@/components/service-card";
import ContactForm from "@/components/contact-form";
import { useInView } from "motion/react";
import { useRef } from "react";
import {
  Code2,
  GitBranch,
  Users,
  Workflow,
  LayoutDashboard,
  MessageSquare,
  ChevronDown,
} from "lucide-react";

const projects = [
  {
    title: "Brand Availability Agent",
    description:
      "Real-time brand checker scanning 50+ platforms. DNS/HTTP verification, AI strategist analysis, automated scoring and reporting.",
    tags: ["Next.js 14", "TypeScript", "TailwindCSS", "Motion", "Prisma", "Express"],
    details:
      "Scans domain availability across 50+ TLDs and platforms. Uses DNS resolution and HTTP verification for accuracy. AI-powered analysis suggests alternatives and scores opportunities. Generates automated reports with actionable recommendations.",
  },
  {
    title: "Medallia-Honeywell Thermostat Hub",
    description:
      "Natural language SMS thermostat control. Parse 'turn down the AC' into API commands with 45+ test patterns, per-property default settings.",
    tags: ["Node.js", "TypeScript", "Express", "Railway"],
    details:
      "Connects Medallia's hospitality platform to Honeywell thermostats via SMS. Natural language processing for voice-like commands. 45+ test patterns ensure robust command parsing. Per-property default settings for chain hotels.",
  },
  {
    title: "Kitchen Remodel Estimator",
    description:
      "Interactive cost estimator with real-time material selection, trade breakdowns, before/after visualization, and print-ready bid reports.",
    tags: ["Next.js", "TypeScript", "TailwindCSS", "Motion"],
    details:
      "Real-time cost calculation with material, labor, and overhead breakdowns. Interactive 3D-style before/after visualization. Print-ready PDF bid reports. Material library with real-time pricing updates.",
  },
  {
    title: "Odoo Partner Program Growth System",
    description:
      "Outreach systems, enablement frameworks, and KPIs that scaled Odoo's North American partner program 5x, bringing in 500+ accounts.",
    tags: ["Odoo", "Python", "CRM Automation", "Data Pipelines"],
    details:
      "Built outreach automation and partner scoring systems. Developed enablement frameworks and certification tracks. Designed KPI dashboards for partner performance tracking. Scaled from 100 to 500+ active partner accounts.",
  },
];

const services = [
  {
    icon: <Users className="w-5 h-5" />,
    title: "Odoo Channel & Partnership Strategy",
    description:
      "Recruit, enable, and scale partner programs. GTM strategy, outreach playbooks, co-selling, team building.",
  },
  {
    icon: <Code2 className="w-5 h-5" />,
    title: "Custom Web Apps & Automation",
    description:
      "Full-stack SaaS apps, CRM automation, AI-powered internal tools built fast with modern stack.",
  },
  {
    icon: <Workflow className="w-5 h-5" />,
    title: "Process Design & Systems Thinking",
    description:
      "Find bottlenecks, design automated workflows, connect silos. Strategy plus code.",
  },
  {
    icon: <LayoutDashboard className="w-5 h-5" />,
    title: "ERP + SaaS Growth Consulting",
    description:
      "Partner program design, channel sales, verticalized demos, enablement at scale.",
  },
];

export default function Home() {
  const projectsRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  return (
    <main className="relative">
      {/* ── Navigation ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#0f172a]/80 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="text-sm font-mono text-cyan-400 font-bold">
            louisbohan.com
          </span>
          <div className="flex items-center gap-6 text-xs font-mono text-slate-400">
            <button
              onClick={() => projectsRef.current?.scrollIntoView({ behavior: "smooth" })}
              className="hover:text-cyan-400 transition-colors"
            >
              Projects
            </button>
            <button
              onClick={() => servicesRef.current?.scrollIntoView({ behavior: "smooth" })}
              className="hover:text-cyan-400 transition-colors"
            >
              Services
            </button>
            <button
              onClick={() => contactRef.current?.scrollIntoView({ behavior: "smooth" })}
              className="hover:text-cyan-400 transition-colors"
            >
              Contact
            </button>
          </div>
        </div>
      </nav>

      {/* ── Terminal Hero ── */}
      <TerminalHero />

      {/* ── Architecture Diagram Section ── */}
      <section className="relative py-24 md:py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <AnimatedHeading
              text="Systems Architecture"
              as="h2"
              className="text-3xl md:text-4xl font-bold gradient-text mb-4"
            />
            <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto font-mono">
              Four pillars that drive every engagement — strategy, systems, code, and growth.
            </p>
          </div>
          <ArchitectureDiagram />
        </div>
      </section>

      {/* ── Stats Section ── */}
      <section className="relative py-16 px-4 border-y border-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <AnimatedCounter to={500} suffix="+" label="Partner Accounts" />
          <AnimatedCounter to={5} suffix="x" label="Program Growth" />
          <AnimatedCounter to={50} suffix="+" label="Platforms Scanned" />
          <AnimatedCounter to={45} suffix="+" label="Test Patterns" />
        </div>
      </section>

      {/* ── Projects Section ── */}
      <section
        ref={projectsRef}
        className="relative py-24 md:py-32 px-4"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-mono mb-4">
              <GitBranch className="w-3 h-3" />
              <span>feature/projects</span>
            </div>
            <AnimatedHeading
              text="Selected Work"
              as="h2"
              className="text-3xl md:text-4xl font-bold gradient-text"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project, i) => (
              <ProjectCard
                key={project.title}
                title={project.title}
                description={project.description}
                tags={project.tags}
                details={project.details}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Services Section ── */}
      <section
        ref={servicesRef}
        className="relative py-24 md:py-32 px-4 bg-gradient-to-b from-transparent via-indigo-500/[0.02] to-transparent"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-mono mb-4">
              <Code2 className="w-3 h-3" />
              <span>modules/services</span>
            </div>
            <AnimatedHeading
              text="What I Do"
              as="h2"
              className="text-3xl md:text-4xl font-bold gradient-text"
            />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {services.map((service, i) => (
              <ServiceCard
                key={service.title}
                title={service.title}
                description={service.description}
                icon={service.icon}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact Section ── */}
      <section
        ref={contactRef}
        className="relative py-24 md:py-32 px-4"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-mono mb-4">
              <MessageSquare className="w-3 h-3" />
              <span>contact/submit</span>
            </div>
            <AnimatedHeading
              text="Get In Touch"
              as="h2"
              className="text-3xl md:text-4xl font-bold gradient-text"
            />
            <p className="mt-4 text-slate-400 text-sm max-w-md mx-auto">
              Have a project in mind or just want to connect? Drop me a line below.
            </p>
          </div>

          <ContactForm />
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span className="text-cyan-400">$</span>
            <span>cat /etc/hostname</span>
            <span className="text-slate-600">→</span>
            <span className="text-cyan-300">louisbohan.com</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <span>© {new Date().getFullYear()} Louis Bohan</span>
            <span className="text-slate-700">·</span>
            <span className="text-slate-500">Built with Next.js + TypeScript + TailwindCSS</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
