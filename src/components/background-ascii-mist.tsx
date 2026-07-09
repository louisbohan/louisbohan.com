"use client";

import { useEffect, useRef } from "react";

interface Props {
  className?: string;
}

// Grayscale pairs — each pair pulses between its two characters
// Lightest → . and :   (sparse)
//           → - and =   (mid-light)
//           → + and =   (mid)
//           → + and #   (mid-dark)
// Darkest  → # and @   (dense)
const PAIRS: [string, string][] = [
  [".", ":"],
  ["-", "="],
  ["+", "="],
  ["+", "#"],
  ["#", "@"],
];

export default function BackgroundAsciiMist({ className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
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

    // Track mouse
    const onMouse = (e: MouseEvent) => {
      const rect = canvas!.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    window.addEventListener("mousemove", onMouse);

    let animId: number;

    const CELL = 14;
    const COLS = 64;
    const ROWS = 40;

    // Pre-compute grid
    const grid: { x: number; y: number; phase: number; pairIdx: number }[] = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const nx = c / COLS;
        const ny = r / ROWS;
        const gradient = 0.1 + 0.8 * (0.5 * Math.sin(nx * 3.7 + ny * 2.3) + 0.5);
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

      // Full clear — no trail
      ctx!.clearRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const t = timeRef.current;

      // Oval flashlight beam parameters
      // Horizontal radius larger than vertical (oval shape)
      const beamRadiusX = 280;
      const beamRadiusY = 200;
      // Pulsation: beam slowly breathes
      const beamPulse = 0.9 + 0.1 * Math.sin(t * 0.4);

      for (let i = 0; i < grid.length; i++) {
        const cell = grid[i];
        if (cell.x < -CELL || cell.x > w + CELL) continue;
        if (cell.y < -CELL || cell.y > h + CELL) continue;

        // Distance from cursor, normalized by oval radii
        const dx = (cell.x - mx) / (beamRadiusX * beamPulse);
        const dy = (cell.y - my) / (beamRadiusY * beamPulse);
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Inside the oval beam?
        if (dist > 1.0) continue;

        // How far inside: 1 = edge, 0 = center
        const beamDepth = 1 - dist;
        // Soft falloff at edges
        const illumination = beamDepth * beamDepth * (3 - 2 * beamDepth);

        // Only show if illuminated past threshold
        if (illumination < 0.005) continue;

        const [charA, charB] = PAIRS[cell.pairIdx];

        // Pulse between A and B — this IS the pulsating illumination
        // The slow wave makes chars alternate
        const pulse = Math.sin(t * 0.6 + cell.phase);
        const char = pulse < 0 ? charA : charB;

        // Opacity: bright at center of beam, dim at edges, plus pulse
        const opacity = 0.01 + illumination * 0.07;

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
      window.removeEventListener("mousemove", onMouse);
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
