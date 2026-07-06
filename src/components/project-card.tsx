"use client";

import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  details?: string;
  index?: number;
}

export default function ProjectCard({
  title,
  description,
  tags,
  details,
  index = 0,
}: ProjectCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={
        isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
      }
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.2, 0.65, 0.3, 0.9],
      }}
      whileHover={{ y: -4 }}
      className="group relative"
    >
      <div
        className="glass rounded-xl p-6 md:p-8 transition-all duration-300 
          group-hover:border-cyan-500/40 group-hover:shadow-[0_0_25px_rgba(6,182,212,0.08)]
          cursor-pointer"
        onClick={() => details && setExpanded(!expanded)}
      >
        {/* Glow border on hover */}
        <div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 
            transition-opacity duration-500 pointer-events-none"
          style={{
            background:
              "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(6,182,212,0.06), transparent 40%)",
          }}
        />

        {/* Title row */}
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg md:text-xl font-bold text-slate-50 group-hover:text-cyan-300 transition-colors">
            {title}
          </h3>
          {details && (
            <span className="text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0 mt-1">
              {expanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="mt-3 text-sm md:text-base text-slate-400 leading-relaxed">
          {description}
        </p>

        {/* Details (expandable) */}
        {details && (
          <motion.div
            initial={false}
            animate={{
              height: expanded ? "auto" : 0,
              opacity: expanded ? 1 : 0,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="mt-4 text-sm text-slate-500 leading-relaxed border-t border-white/5 pt-4">
              {details}
            </p>
          </motion.div>
        )}

        {/* Tech stack badges */}
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono 
                bg-cyan-500/10 text-cyan-400 border border-cyan-500/20
                group-hover:bg-cyan-500/15 group-hover:border-cyan-500/30 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
