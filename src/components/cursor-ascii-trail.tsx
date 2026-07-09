"use client";

import { useEffect, useRef } from "react";

interface Props {
  className?: string;
}

// Grayscale pairs: each pair represents a density level
// Characters pulse between their pair based on a slow wave
//
// Light (sparse) → . ↔ :
// Mid-light       → - ↔ =
// Mid             → + ↔ =
// Mid-dark        → + ↔ #
// Dark (dense)    → # ↔ @
const PAIRS: [string, string][] = [
  [".", ":"],
  ["-", "="],
  ["+", "="],
  ["+", "#"],
  ["#", "@"],
];

export default function CursorAsciiTrail({ className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -10000, y: -10000 });
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
      mouseRef.current = { x: -10000, y: -10000 };
    };

    window.addEventListener("mousemove", onMouse);
    window.addEventListener("touchmove", onMouse);
    window.addEventListener("mouseleave", onLeave);

    let animId: number;

    const CELL = 13;
    const COLS = 80;
    const ROWS = 50;
    const RAY = 380;

    // Pre-compute grid positions
    const grid: { x: number; y: number; phase: number }[] = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        grid.push({
          x: c * CELL + CELL / 2,
          y: r * CELL + CELL / 2,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    const animate = (timestamp: number) => {
      timeRef.current = timestamp * 0.001;
      const rect = canvas!.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx!.clearRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const hasMouse = mx > -5000;
      const t = timeRef.current;

      animId = requestAnimationFrame(animate);
      if (!hasMouse) return;

      for (let i = 0; i < grid.length; i++) {
        const cell = grid[i];
        if (cell.x < -CELL || cell.x > w + CELL) continue;
        if (cell.y < -CELL || cell.y > h + CELL) continue;

        // Distance from cursor
        const dx = cell.x - mx;
        const dy = cell.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Illumination: Gaussian falloff from cursor
        let illumination = 0;
        if (dist < RAY) {
          const norm = dist / RAY;
          illumination = Math.max(0, 1 - norm * norm);
          illumination *= illumination;
        }

        if (illumination < 0.001) continue;

        // Map illumination (0-1) to pair index (0-4)
        // Dim areas → pair 0 (.:)
        // Bright areas → pair 4 (#@)
        const pairIdx = Math.min(
          Math.floor(illumination * PAIRS.length),
          PAIRS.length - 1
        );
        const [charA, charB] = PAIRS[pairIdx];

        // Pulse: each cell oscillates between its pair A ↔ B
        // Phase creates a wave across the grid
        const pulse = 0.5 + 0.5 * Math.sin(t * 0.7 + cell.phase);
        const char = pulse < 0.5 ? charA : charB;

        const opacity = 0.005 + illumination * 0.08;

        ctx!.font = `${CELL - 1}px "JetBrains Mono", monospace`;
        ctx!.textAlign = "center";
        ctx!.textBaseline = "middle";
        ctx!.fillStyle = `rgba(240, 236, 228, ${opacity})`;
        ctx!.fillText(char, cell.x, cell.y);
      }
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
