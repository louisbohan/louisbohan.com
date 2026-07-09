"use client";

import { useEffect, useRef } from "react";

interface Props {
  className?: string;
}

// ASCII chars ordered by visual weight (heaviest → lightest)
const DENSITY_CHARS = ["@", "%", "#", "*", "+", "=", "-", "|", ":", "."];

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

    const CELL_SIZE = 11;
    const GRID_RADIUS = 16;

    const animate = (timestamp: number) => {
      timeRef.current = timestamp * 0.001;
      const rect = canvas!.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      // Clear fully — no trail
      ctx!.clearRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const hasMouse = mx > -1500;
      const t = timeRef.current;

      animId = requestAnimationFrame(animate);
      if (!hasMouse) return;

      // Slow rotation
      const angle = t * 0.15;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      const totalCells = GRID_RADIUS * 2 + 1;

      for (let row = 0; row < totalCells; row++) {
        for (let col = 0; col < totalCells; col++) {
          const lx = col - GRID_RADIUS;
          const ly = row - GRID_RADIUS;

          // Skip center cell (cursor position)
          if (lx === 0 && ly === 0) continue;

          // Distance from center → determines char density & opacity
          const dist = Math.sqrt(lx * lx + ly * ly);
          const maxDist = Math.sqrt(2) * GRID_RADIUS;
          const normDist = dist / maxDist;

          const charIdx = Math.floor(normDist * DENSITY_CHARS.length);
          const char = DENSITY_CHARS[Math.max(0, Math.min(charIdx, DENSITY_CHARS.length - 1))];
          const opacity = 0.01 + (1 - normDist) * 0.08;

          if (opacity < 0.01) continue;

          // Rotate grid around cursor
          const rx = lx * cosA - ly * sinA;
          const ry = lx * sinA + ly * cosA;
          const sx = mx + rx * CELL_SIZE;
          const sy = my + ry * CELL_SIZE;

          if (sx < -CELL_SIZE || sx > w + CELL_SIZE || sy < -CELL_SIZE || sy > h + CELL_SIZE) continue;

          ctx!.font = `${CELL_SIZE - 1}px "JetBrains Mono", monospace`;
          ctx!.textAlign = "center";
          ctx!.textBaseline = "middle";
          ctx!.fillStyle = `rgba(240, 236, 228, ${opacity})`;
          ctx!.fillText(char, sx, sy);
        }
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
