"use client";

import { useEffect, useRef } from "react";

interface Props {
  className?: string;
}

// ASCII chars: heaviest (center) → lightest (edges)
const DENSITY_CHARS = ["@", "%", "&", "#", "*", "+", "=", "-", "|", ":", "."];

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

    // Fixed grid: cells that cover the full viewport
    const CELL_SIZE = 13;
    const COLS = 100;
    const ROWS = 60;

    // Pre-compute grid cell positions (fixed in page space)
    const grid: { x: number; y: number }[][] = [];

    for (let row = 0; row < ROWS; row++) {
      const rowCells: { x: number; y: number }[] = [];
      for (let col = 0; col < COLS; col++) {
        rowCells.push({
          x: col * CELL_SIZE + CELL_SIZE / 2,
          y: row * CELL_SIZE + CELL_SIZE / 2,
        });
      }
      grid.push(rowCells);
    }

    const animate = (timestamp: number) => {
      timeRef.current = timestamp * 0.001;
      const rect = canvas!.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      // Clear fully
      ctx!.clearRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const hasMouse = mx > -1500;

      animId = requestAnimationFrame(animate);
      if (!hasMouse) return;

      // Compute visible grid range (only render cells in viewport)
      const startCol = Math.max(0, Math.floor(-CELL_SIZE / CELL_SIZE));
      const endCol = Math.min(COLS, Math.ceil((w + CELL_SIZE) / CELL_SIZE));
      const startRow = Math.max(0, Math.floor(-CELL_SIZE / CELL_SIZE));
      const endRow = Math.min(ROWS, Math.ceil((h + CELL_SIZE) / CELL_SIZE));

      const maxDist = Math.sqrt(2) * 16 * CELL_SIZE; // ~cells visible from cursor

      for (let row = startRow; row < endRow; row++) {
        for (let col = startCol; col < endCol; col++) {
          const cell = grid[row][col];
          const sx = cell.x;
          const sy = cell.y;

          // Skip offscreen cells
          if (sx < -CELL_SIZE || sx > w + CELL_SIZE) continue;
          if (sy < -CELL_SIZE || sy > h + CELL_SIZE) continue;

          // Distance from cursor
          const dx = sx - mx;
          const dy = sy - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const normDist = Math.min(dist / maxDist, 1);

          // Character: heavy at center, light at edges
          const charIdx = Math.min(
            Math.floor(normDist * DENSITY_CHARS.length),
            DENSITY_CHARS.length - 1
          );
          const char = DENSITY_CHARS[charIdx];

          // Opacity: bright center, dim edges
          const opacity = 0.01 + (1 - normDist) * 0.08;

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
