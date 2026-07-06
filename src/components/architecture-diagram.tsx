"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

interface ArchNode {
  x: number;
  y: number;
  label: string;
  sublabel: string;
  color: string;
}

const nodes: ArchNode[] = [
  { x: 50, y: 20, label: "Strategy", sublabel: "Partnership Design", color: "#6366f1" },
  { x: 15, y: 55, label: "Systems", sublabel: "Process Engineering", color: "#06b6d4" },
  { x: 50, y: 85, label: "Code", sublabel: "Full-Stack Apps", color: "#a78bfa" },
  { x: 85, y: 55, label: "Growth", sublabel: "Channel Scale", color: "#22d3ee" },
];

const connections: [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 3],
  [1, 2],
  [2, 3],
  [1, 3],
];

export default function ArchitectureDiagram() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-150px" });

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[3/2] max-w-xl mx-auto"
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="arch-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.3" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connections */}
        {connections.map(([from, to], i) => {
          const n1 = nodes[from];
          const n2 = nodes[to];

          return (
            <motion.line
              key={`conn-${i}`}
              x1={`${n1.x}`}
              y1={`${n1.y}`}
              x2={`${n2.x}`}
              y2={`${n2.y}`}
              stroke="url(#arch-grad-1)"
              strokeWidth="0.8"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                isInView
                  ? { pathLength: 1, opacity: 0.5 }
                  : { pathLength: 0, opacity: 0 }
              }
              transition={{
                duration: 1.2,
                delay: 0.3 + i * 0.15,
                ease: "easeInOut",
              }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node, i) => (
          <motion.g
            key={`node-${i}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={
              isInView
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0 }
            }
            transition={{
              duration: 0.5,
              delay: 0.8 + i * 0.2,
              ease: "backOut",
            }}
            filter="url(#glow)"
          >
            {/* Node circle */}
            <circle
              cx={`${node.x}`}
              cy={`${node.y}`}
              r="7"
              fill={node.color}
              opacity="0.15"
            />
            <circle
              cx={`${node.x}`}
              cy={`${node.y}`}
              r="5"
              fill={node.color}
              opacity="0.4"
            />
            <circle
              cx={`${node.x}`}
              cy={`${node.y}`}
              r="2.5"
              fill={node.color}
              opacity="0.9"
            />

            {/* Node label */}
            <text
              x={`${node.x}`}
              y={`${node.y - 10}`}
              textAnchor="middle"
              fill="#f8fafc"
              fontSize="5"
              fontWeight="700"
              fontFamily="JetBrains Mono, monospace"
            >
              {node.label}
            </text>
            <text
              x={`${node.x}`}
              y={`${node.y + 11}`}
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="3.2"
              fontFamily="Inter, sans-serif"
            >
              {node.sublabel}
            </text>
          </motion.g>
        ))}

        {/* Center glow pulse */}
        <motion.circle
          cx="50"
          cy="50"
          r="30"
          fill="none"
          stroke="#06b6d4"
          strokeWidth="0.3"
          opacity="0.2"
          animate={
            isInView
              ? {
                  scale: [1, 1.15, 1],
                  opacity: [0.15, 0.25, 0.15],
                }
              : {}
          }
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </svg>
    </div>
  );
}
