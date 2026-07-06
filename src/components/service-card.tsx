"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  index?: number;
}

export default function ServiceCard({
  title,
  description,
  icon,
  index = 0,
}: ServiceCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={
        isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
      }
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.2, 0.65, 0.3, 0.9],
      }}
      whileHover={{ y: -3 }}
      className="group relative"
    >
      <div
        className="glass rounded-xl p-6 h-full flex flex-col transition-all duration-300
          group-hover:border-indigo-500/30 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.06)]"
      >
        {/* Icon */}
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 
          flex items-center justify-center text-cyan-400 mb-4
          group-hover:from-cyan-500/30 group-hover:to-indigo-500/30 transition-colors">
          {icon}
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-50 group-hover:text-cyan-300 transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="mt-2 text-sm text-slate-400 leading-relaxed flex-1">
          {description}
        </p>

        {/* Arrow */}
        <div className="mt-4 flex items-center text-xs font-mono text-slate-500 
          group-hover:text-cyan-400 transition-colors">
          <span className="mr-1">learn more</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
}
