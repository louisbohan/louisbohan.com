"use client";

import { useEffect, useRef } from "react";

interface Props {
  className?: string;
}

// Character pairs — each density level pulses between two chars:
// Lightest → . and :
//           → - and =
//           → + and =
//           → + and #
// Darkest  → # and @
const PAIRS: [string, string][] = [
  [".", ":"],
  ["-", "="],
  ["+", "="],
  ["+", "#"],
  ["#", "@"],
];

export default function CursorAsciiTrail({ className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -2000, y: -2000 });
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

    // Same concentric ring architecture — confirmed correct behavior
    // Each ring uses the pair's two characters, pulsing between them
    const ringRadii = [8, 22, 38, 56, 78, 105, 135, 170, 210, 260];

    const animate = (timestamp: number) => {
      timeRef.current = timestamp * 0.001;
      const rect = canvas!.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      // Fade trail for comet tail effect
      ctx!.fillStyle = "rgba(15, 25, 35, 0.15)";
      ctx!.fillRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const hasMouse = mx > -1500;

      if (!hasMouse) {
        animId = requestAnimationFrame(animate);
        return;
      }

      const t = timeRef.current;

      // Each ring: map ring index to a pair and pulse
      for (let ringIdx = 0; ringIdx < ringRadii.length; ringIdx++) {
        const radius = ringRadii[ringIdx];
        const count = Math.max(3, Math.floor(radius * 0.22));

        // Map ring to pair (0-9 rings → 0-4 pairs, gently grading)
        const pairIdx = Math.min(
          Math.floor((ringIdx / ringRadii.length) * PAIRS.length),
          PAIRS.length - 1
        );
        const [charA, charB] = PAIRS[pairIdx];

        // Pulse: the characters oscillate between A and B
        // Each ring has a different phase so nearby rings feel organic
        const pulse = Math.sin(t * 0.9 + ringIdx * 0.6);

        // Dimness: outer rings are dimmer
        const dimFactor = 1 - ringIdx / ringRadii.length;
        const opacity = 0.01 + dimFactor * 0.08;

        const r = radius;

        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2 + t * 0.02 * (ringIdx + 1);
          const jitter = (Math.random() - 0.5) * 3;
          const x = mx + Math.cos(angle) * r + jitter;
          const y = my + Math.sin(angle) * r + jitter;

          if (x < -5 || x > w + 5 || y < -5 || y > h + 5) continue;

          // Pick char A or B based on pulse value
          const char = pulse < 0 ? charA : charB;

          const size = 7 + Math.floor(Math.random() * 3);

          ctx!.font = `${size}px "JetBrains Mono", monospace`;
          ctx!.textAlign = "center";
          ctx!.textBaseline = "middle";
          ctx!.fillStyle = `rgba(240, 236, 228, ${opacity})`;
          ctx!.fillText(char, x, y);
        }
      }

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
