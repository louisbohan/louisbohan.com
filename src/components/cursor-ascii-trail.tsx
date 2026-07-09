"use client";

import { useEffect, useRef } from "react";

interface Props {
  className?: string;
}

// ASCII chars ordered by visual weight (lightest → heaviest)
const DENSITY_CHARS = [".", "·", ":", "-", "=", "+", "*", "#", "%", "@"];

export default function CursorAsciiTrail({ className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -2000, y: -2000 });
  const frameRef = useRef(0);
  const timeRef = useRef(0);

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
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e: MouseEvent | TouchEvent) => {
      let cx: number, cy: number;
      if ("touches" in e && e.touches.length > 0) {
        const rect = canvas!.getBoundingClientRect();
        cx = e.touches[0].clientX - rect.left;
        cy = e.touches[0].clientY - rect.top;
      } else {
        const me = e as MouseEvent;
        const rect = canvas!.getBoundingClientRect();
        cx = me.clientX - rect.left;
        cy = me.clientY - rect.top;
      }
      mouseRef.current = { x: cx, y: cy };
    };
    const onLeave = () => {
      mouseRef.current = { x: -2000, y: -2000 };
    };

    window.addEventListener("mousemove", onMouse);
    window.addEventListener("touchmove", onMouse);
    window.addEventListener("mouseleave", onLeave);

    let animId: number;

    const animate = (timestamp: number) => {
      timeRef.current = timestamp * 0.001;
      const rect = canvas!.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      // Fade trail — slow decay creates the "comet tail" effect
      ctx!.fillStyle = "rgba(15, 25, 35, 0.15)";
      ctx!.fillRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const hasMouse = mx > -1500;

      if (!hasMouse) {
        frameRef.current = animId;
        animId = requestAnimationFrame(animate);
        return;
      }

      const t = timeRef.current;
      const chars = DENSITY_CHARS;

      // Draw concentric rings of ASCII characters centered on cursor
      // Each ring uses a different character weight based on distance
      const ringRadii = [8, 22, 38, 56, 78, 105, 135, 170, 210, 260];

      for (let ringIdx = 0; ringIdx < ringRadii.length; ringIdx++) {
        const radius = ringRadii[ringIdx];
        const char = chars[chars.length - 1 - ringIdx];
        // Number of chars per ring: more as radius grows, but sparse enough to look organic
        const count = Math.max(3, Math.floor(radius * 0.22));

        // Pulsate: each ring breathes slightly out of phase
        const ringPhase = ringIdx * 0.4;
        const pulse = 1 + 0.1 * Math.sin(t * 1.2 + ringPhase);

        // Dimness: farthest rings are much dimmer
        const dimFactor = 1 - ringIdx / ringRadii.length;
        const opacity = 0.01 + dimFactor * 0.08;

        const r = radius * pulse;

        for (let i = 0; i < count; i++) {
          const angle =
            (i / count) * Math.PI * 2 + t * 0.02 * (ringIdx + 1);
          const jitter = (Math.random() - 0.5) * 3;
          const x = mx + Math.cos(angle) * r + jitter;
          const y = my + Math.sin(angle) * r + jitter;

          // Skip if outside canvas
          if (x < -5 || x > w + 5 || y < -5 || y > h + 5) continue;

          const fontSizes = [7, 8, 9];
          const size = fontSizes[Math.floor(Math.random() * fontSizes.length)];

          ctx!.font = `${size}px "JetBrains Mono", monospace`;
          ctx!.textAlign = "center";
          ctx!.textBaseline = "middle";
          ctx!.fillStyle = `rgba(240, 236, 228, ${opacity})`;
          ctx!.fillText(char, x, y);
        }
      }

      frameRef.current = animId;
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onMouse);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full pointer-events-none z-0 ${className}`}
      aria-hidden="true"
    />
  );
}
