"use client";

import { useEffect, useRef, useCallback } from "react";

interface AsciiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  char: string;
  size: number;
  opacity: number;
}

interface ParticleFieldProps {
  density?: "sparse" | "dense";
  attractors?: { x: number; y: number }[];
  className?: string;
}

const CHARS_SPARSE = ["·", "·", "·", "·", "*", "+"];
const CHARS_DENSE = ["@", "#", "%", "&", "*", "+", "-", "·", ".", ":", "~"];
const SOFT_WHITE = "rgba(240, 236, 228, VAR)";

export default function AsciiParticleField({
  density = "sparse",
  attractors = [],
  className = "",
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<AsciiParticle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const frameRef = useRef(0);
  const attractorsRef = useRef(attractors);
  attractorsRef.current = attractors;

  const isDense = density === "dense";
  const particleCount = isDense ? 400 : 80;
  const chars = isDense ? CHARS_DENSE : CHARS_SPARSE;

  const initParticles = useCallback(
    (w: number, h: number) => {
      const p: AsciiParticle[] = [];
      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * Math.min(w, h) * 0.35;
        p.push({
          x: w / 2 + Math.cos(angle) * radius,
          y: h / 2 + Math.sin(angle) * radius,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          char: chars[Math.floor(Math.random() * chars.length)],
          size: isDense ? 8 + Math.random() * 6 : 9 + Math.random() * 4,
          opacity: isDense
            ? 0.04 + Math.random() * 0.12
            : 0.02 + Math.random() * 0.08,
        });
      }
      particlesRef.current = p;
    },
    [particleCount, chars, isDense]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      if (particlesRef.current.length === 0) {
        initParticles(rect.width, rect.height);
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e: MouseEvent) => {
      const rect = canvas!.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    const onLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    window.addEventListener("mousemove", onMouse);
    window.addEventListener("mouseleave", onLeave);

    let animId: number;

    const animate = () => {
      const rect = canvas!.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      // Clear with subtle trailing (fade)
      ctx!.fillStyle = "rgba(15, 25, 35, " + (isDense ? "0.15" : "0.1") + ")";
      ctx!.fillRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const hasMouseInView = mx > -500;

      // Compute attractor: strongest pull from mouse first, then static attractors
      let attractX = w / 2;
      let attractY = h / 2;
      let pull = 0.0003; // base drift back to center

      if (hasMouseInView) {
        attractX = mx;
        attractY = my;
        pull = 0.0008; // stronger toward cursor
      } else if (attractorsRef.current.length > 0) {
        // Use first attractor
        const a = attractorsRef.current[0];
        attractX = a.x;
        attractY = a.y;
        pull = 0.0005;
      }

      const particles = particlesRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Drift toward attractor (mouse/center)
        const dx = attractX - p.x;
        const dy = attractY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 10) {
          p.vx += (dx / dist) * pull * Math.min(dist, 300);
          p.vy += (dy / dist) * pull * Math.min(dist, 300);
        }

        // Damping
        p.vx *= 0.97;
        p.vy *= 0.97;

        // Brownian jitter
        p.vx += (Math.random() - 0.5) * 0.05;
        p.vy += (Math.random() - 0.5) * 0.05;

        // Clamp velocity
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 1.2) {
          p.vx = (p.vx / speed) * 1.2;
          p.vy = (p.vy / speed) * 1.2;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Soft boundary bounce
        const margin = 30;
        if (p.x < -margin) p.x = w + margin;
        if (p.x > w + margin) p.x = -margin;
        if (p.y < -margin) p.y = h + margin;
        if (p.y > h + margin) p.y = -margin;

        // Draw
        const baseOpacity = p.opacity;
        const proximity = hasMouseInView
          ? Math.max(0, 1 - dist / 500)
          : 0;
        const finalOpacity = Math.min(
          baseOpacity + proximity * 0.08,
          0.15
        );

        ctx!.font = `${p.size}px "JetBrains Mono", monospace`;
        ctx!.textAlign = "center";
        ctx!.textBaseline = "middle";
        ctx!.fillStyle = SOFT_WHITE.replace(
          "VAR",
          String(finalOpacity)
        );
        ctx!.fillText(p.char, p.x, p.y);
      }

      frameRef.current = animId;
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [density, initParticles, isDense]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full pointer-events-none z-0 ${className}`}
      aria-hidden="true"
    />
  );
}
