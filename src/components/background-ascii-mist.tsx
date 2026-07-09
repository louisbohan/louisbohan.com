"use client";

import { useEffect, useRef } from "react";

interface Props {
  className?: string;
}

// Grayscale pairs — each pair pulses between its two characters
// lightest → darkest
const PAIRS: [string, string][] = [
  [".", ":"],
  ["-", "="],
  ["+", "="],
  ["+", "#"],
  ["#", "@"],
];

export default function BackgroundAsciiMist({ className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const CELL = 14;

    // Raw + smoothed cursor. Start off-screen so nothing shows until move.
    const target = { x: -9999, y: -9999 };
    const cursor = { x: -9999, y: -9999 };
    let hasMoved = false;

    type Cell = { x: number; y: number; phase: number; speed: number; pairIdx: number };
    let grid: Cell[] = [];

    const buildGrid = (w: number, h: number) => {
      grid = [];
      const cols = Math.ceil(w / CELL) + 1;
      const rows = Math.ceil(h / CELL) + 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const nx = c / cols;
          const ny = r / rows;
          // Smooth pseudo-noise field → gentle grayscale gradient across page
          const n =
            0.5 +
            0.28 * Math.sin(nx * 5.1 + ny * 2.4) +
            0.22 * Math.sin(nx * 2.3 - ny * 4.7 + 1.7);
          const pairIdx = Math.max(
            0,
            Math.min(PAIRS.length - 1, Math.floor(n * PAIRS.length))
          );
          grid.push({
            x: c * CELL + CELL / 2,
            y: r * CELL + CELL / 2,
            phase: Math.random() * Math.PI * 2,
            speed: 0.5 + Math.random() * 0.5, // each cell pulses at its own pace
            pairIdx,
          });
        }
      }
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // no cumulative scaling
      buildGrid(w, h);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!hasMoved) {
        cursor.x = target.x;
        cursor.y = target.y;
        hasMoved = true;
      }
    };
    window.addEventListener("mousemove", onMouse);

    let animId: number;

    const animate = (timestamp: number) => {
      const t = timestamp * 0.001;
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Clean clear — no trail
      ctx.clearRect(0, 0, w, h);

      // Smooth cursor follow (removes jitter)
      cursor.x += (target.x - cursor.x) * 0.14;
      cursor.y += (target.y - cursor.y) * 0.14;

      // Oval beam: 280px wide × 200px tall, breathing slowly
      const breathe = 1 + 0.08 * Math.sin(t * 0.5);
      const rx = 140 * breathe;
      const ry = 100 * breathe;

      ctx.font = `${CELL}px "JetBrains Mono", ui-monospace, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Only iterate cells in the beam's bounding box
      const minX = cursor.x - rx - CELL;
      const maxX = cursor.x + rx + CELL;
      const minY = cursor.y - ry - CELL;
      const maxY = cursor.y + ry + CELL;

      for (let i = 0; i < grid.length; i++) {
        const cell = grid[i];
        if (cell.x < minX || cell.x > maxX || cell.y < minY || cell.y > maxY) continue;

        const dx = (cell.x - cursor.x) / rx;
        const dy = (cell.y - cursor.y) / ry;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist >= 1) continue;

        // Soft falloff: smoothstep from edge (0) to center (1)
        const depth = 1 - dist;
        const illumination = depth * depth * (3 - 2 * depth);
        if (illumination < 0.01) continue;

        // Character pulse: slow sine per cell, phase-offset for organic ripple.
        // Crossfade between pair members rather than hard swap.
        const pulse = Math.sin(t * 0.7 * cell.speed + cell.phase); // -1..1
        const [charA, charB] = PAIRS[cell.pairIdx];
        const char = pulse < 0 ? charA : charB;
        // Ease opacity near the swap point so the flip reads as a gentle pulse
        const pulseEase = 0.75 + 0.25 * Math.abs(pulse);

        const opacity = illumination * 0.09 * pulseEase;

        ctx.fillStyle = `rgba(240, 236, 228, ${opacity})`;
        ctx.fillText(char, cell.x, cell.y);
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      aria-hidden="true"
    />
  );
}
