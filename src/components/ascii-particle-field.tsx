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
  /** "sparse" = ambient mist dots | "dense" = Claude Constitution text mosaic */
  density?: "sparse" | "dense";
  attractors?: { x: number; y: number }[];
  className?: string;
}

const CHARS_SPARSE = ["·", "·", "·", "·", "*", "+"];
const SOFT_WHITE = "rgba(240, 236, 228, VAR)";

// Claude Constitution excerpt — enough for ~800 particles to render a readable mosaic
const CONSTITUTION_TEXT = [
  "Claude is trained by Anthropic. Our mission is to ensure the world safely makes",
  "the transition through transformative AI. We believe AI may be one of the most",
  "world-altering technologies in history. We want Claude to be exceptionally helpful",
  "while also being honest, thoughtful, and caring about the world. We favor good",
  "values and judgment over strict rules. Claude should be genuinely helpful to the",
  "people it works with and to society, while avoiding unsafe or deceptive actions.",
  "We want Claude to have good values in the same way a person can have good values",
  "while also being good at their job. The simplest summary: Claude should be safe,",
  "beneficial, and wise. This constitution shapes how Claude reasons and behaves.",
  "We encourage Claude to embrace human-like qualities — virtue, wisdom, care — and",
  "to apply sound judgment across every situation it encounters. Rules can anticipate",
  "situations but judgment can adapt to novel cases. We want both. We are committed",
  "to safety at the frontier. Anthropic believes powerful AI is coming and that it is",
  "better to have safety-focused labs leading the way. Claude is our best attempt at",
  "a model that is both safe and beneficial for everyone. — Anthropic, 2026",
];

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

  // Flatten constitution text into a character array for particle seeding
  const constitutionChars = useCallback(() => {
    return CONSTITUTION_TEXT.join(" ").split("");
  }, []);

  const initParticles = useCallback(
    (w: number, h: number) => {
      if (isDense) {
        // Dense mode: create a text mosaic by scattering char particles
        // in a readable block layout across the hero zone
        const chars = constitutionChars();
        const fontSize = 10;
        const lineHeight = 15;
        const marginX = 60;
        const marginY = 80;
        const maxWidth = w - marginX * 2;
        const cols = Math.floor(maxWidth / (fontSize * 0.62));
        const lines = Math.ceil(chars.length / cols);

        // Center the block vertically in the viewport
        const blockHeight = lines * lineHeight;
        const startY = (h - blockHeight) / 2;

        const p: AsciiParticle[] = [];
        chars.forEach((char, i) => {
          if (char === " ") return; // no particles for spaces — creates natural gaps
          const col = i % cols;
          const line = Math.floor(i / cols);
          p.push({
            x: marginX + col * fontSize * 0.62 + (Math.random() - 0.5) * 4,
            y: startY + line * lineHeight + (Math.random() - 0.5) * 3,
            vx: (Math.random() - 0.5) * 0.15,
            vy: (Math.random() - 0.5) * 0.15,
            char,
            size: fontSize + (Math.random() - 0.5) * 2,
            opacity: 0.03 + Math.random() * 0.045, // very dim — misty
          });
        });

        // Fill remaining with faint filler dots for atmosphere
        while (p.length < 600) {
          p.push({
            x: marginX + (Math.random() * maxWidth),
            y: (Math.random() * h * 0.7) + h * 0.15,
            vx: (Math.random() - 0.5) * 0.1,
            vy: (Math.random() - 0.5) * 0.1,
            char: "·",
            size: 6,
            opacity: 0.015,
          });
        }

        particlesRef.current = p;
      } else {
        // Sparse mode: ambient organic cloud
        const count = 80;
        const p: AsciiParticle[] = [];
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const radius = Math.random() * Math.min(w, h) * 0.35;
          p.push({
            x: w / 2 + Math.cos(angle) * radius,
            y: h / 2 + Math.sin(angle) * radius,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            char: CHARS_SPARSE[Math.floor(Math.random() * CHARS_SPARSE.length)],
            size: 9 + Math.random() * 4,
            opacity: 0.02 + Math.random() * 0.08,
          });
        }
        particlesRef.current = p;
      }
    },
    [isDense, constitutionChars]
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

      // Clear with trailing fade (creates the "mist" trail)
      ctx!.fillStyle = "rgba(15, 25, 35, " + (isDense ? "0.12" : "0.1") + ")";
      ctx!.fillRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const hasMouseInView = mx > -500;

      let attractX = w / 2;
      let attractY = h / 2;
      let pull = 0.0003;

      if (hasMouseInView) {
        attractX = mx;
        attractY = my;
        pull = 0.0008;
      } else if (attractorsRef.current.length > 0) {
        const a = attractorsRef.current[0];
        attractX = a.x;
        attractY = a.y;
        pull = 0.0005;
      }

      const particles = particlesRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        const dx = attractX - p.x;
        const dy = attractY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 10) {
          p.vx += (dx / dist) * pull * Math.min(dist, 300);
          p.vy += (dy / dist) * pull * Math.min(dist, 300);
        }

        p.vx *= 0.97;
        p.vy *= 0.97;

        p.vx += (Math.random() - 0.5) * 0.05;
        p.vy += (Math.random() - 0.5) * 0.05;

        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 1.2) {
          p.vx = (p.vx / speed) * 1.2;
          p.vy = (p.vy / speed) * 1.2;
        }

        p.x += p.vx;
        p.y += p.vy;

        const margin = 30;
        if (p.x < -margin) p.x = w + margin;
        if (p.x > w + margin) p.x = -margin;
        if (p.y < -margin) p.y = h + margin;
        if (p.y > h + margin) p.y = -margin;

        const baseOpacity = p.opacity;
        const proximity = hasMouseInView ? Math.max(0, 1 - dist / 500) : 0;
        const maxOp = isDense ? 0.14 : 0.15;
        const finalOpacity = Math.min(baseOpacity + proximity * 0.06, maxOp);

        ctx!.font = `${p.size}px "JetBrains Mono", monospace`;
        ctx!.textAlign = "center";
        ctx!.textBaseline = "middle";
        ctx!.fillStyle = SOFT_WHITE.replace("VAR", String(finalOpacity));
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
