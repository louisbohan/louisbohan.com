"use client";

import { useEffect, useRef } from "react";

interface Props {
  className?: string;
}

// Grayscale pairs — each pair pulses between its two characters
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

export default function BackgroundAsciiMist({ className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

    let animId: number;

    const CELL = 14;
    const COLS = 64;
    const ROWS = 40;

    // Pre-compute grid with random phases
    const grid: { x: number; y: number; phase: number; pairIdx: number }[] = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        // Normalized position in viewport
        const nx = c / COLS;
        const ny = r / ROWS;

        // Determine pair index from position — creates a soft gradient
        // across the page so different areas have different character densities
        const gradient = 0.2 + 0.6 * (0.5 * Math.sin(nx * 3.1 + ny * 2.7) + 0.5);
        const pairIdx = Math.min(
          Math.floor(gradient * PAIRS.length),
          PAIRS.length - 1
        );

        grid.push({
          x: c * CELL + CELL / 2,
          y: r * CELL + CELL / 2,
          phase: Math.random() * Math.PI * 2,
          pairIdx,
        });
      }
    }

    const animate = (timestamp: number) => {
      timeRef.current = timestamp * 0.001;
      const rect = canvas!.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      // Fade trail — slow decay so characters leave a faint ghost
      ctx!.fillStyle = "rgba(15, 25, 35, 0.3)";
      ctx!.fillRect(0, 0, w, h);

      const t = timeRef.current;

      for (let i = 0; i < grid.length; i++) {
        const cell = grid[i];
        if (cell.x < -CELL || cell.x > w + CELL) continue;
        if (cell.y < -CELL || cell.y > h + CELL) continue;

        const [charA, charB] = PAIRS[cell.pairIdx];

        // Pulse between A and B — slow wave, each cell has its own phase
        const pulse = Math.sin(t * 0.5 + cell.phase);
        const char = pulse < 0 ? charA : charB;

        // Very dim — barely visible, just enough to feel the texture
        const opacity = 0.02 + (1 - cell.pairIdx / PAIRS.length) * 0.04;

        ctx!.font = `${CELL}px "JetBrains Mono", monospace`;
        ctx!.textAlign = "center";
        ctx!.textBaseline = "middle";
        ctx!.fillStyle = `rgba(240, 236, 228, ${opacity})`;
        ctx!.fillText(char, cell.x, cell.y);
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
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
