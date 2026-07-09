"use client";

import { useEffect, useRef } from "react";

interface Props {
  className?: string;
}

// Grayscale pairs — each pair pulses between its two characters
// Lightest → . and :   (bright pixels)
//           → - and =   (mid-light)
//           → + and =   (mid)
//           → + and #   (mid-dark)
// Darkest  → # and @   (dark pixels)
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
  const imageDataRef = useRef<Float32Array | null>(null);
  const imgWidthRef = useRef(1);
  const imgHeightRef = useRef(1);

  // Load the scroll+quill image and convert to grayscale
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.naturalWidth || img.width;
      c.height = img.naturalHeight || img.height;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, c.width, c.height);
      imgWidthRef.current = c.width;
      imgHeightRef.current = c.height;

      // Convert to single-channel grayscale (0=black, 1=white)
      const gray = new Float32Array(c.width * c.height);
      for (let i = 0; i < gray.length; i++) {
        const idx = i * 4;
        gray[i] =
          (data.data[idx] * 0.299 +
            data.data[idx + 1] * 0.587 +
            data.data[idx + 2] * 0.114) /
          255;
      }
      imageDataRef.current = gray;
    };
    img.src = "/constitution-art.png";
  }, []);

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

    // Pre-compute grid
    const grid: { x: number; y: number; phase: number; pairIdx: number }[] = [];

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        grid.push({
          x: c * CELL + CELL / 2,
          y: r * CELL + CELL / 2,
          phase: Math.random() * Math.PI * 2,
          pairIdx: 0, // will be updated each frame
        });
      }
    }

    const animate = (timestamp: number) => {
      timeRef.current = timestamp * 0.001;
      const rect = canvas!.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      // Fade trail — slow decay
      ctx!.fillStyle = "rgba(15, 25, 35, 0.25)";
      ctx!.fillRect(0, 0, w, h);

      const t = timeRef.current;
      const grayData = imageDataRef.current;

      for (let i = 0; i < grid.length; i++) {
        const cell = grid[i];
        if (cell.x < -CELL || cell.x > w + CELL) continue;
        if (cell.y < -CELL || cell.y > h + CELL) continue;

        // Sample the image at this cell position
        let grayVal = 0.5; // default mid gray while image loads

        if (grayData) {
          const imgW = imgWidthRef.current;
          const imgH = imgHeightRef.current;
          const srcX = Math.floor((cell.x / w) * imgW);
          const srcY = Math.floor((cell.y / h) * imgH);
          const px = Math.max(0, Math.min(srcX, imgW - 1));
          const py = Math.max(0, Math.min(srcY, imgH - 1));
          const idx = py * imgW + px;
          // Invert: dark drawing lines → low grayVal → high pair index (dark char)
          grayVal = grayData[idx];
        }

        // Map grayscale to pair index (0=black → 4, 1=white → 0)
        const pairIdx = Math.min(
          Math.floor((1 - grayVal) * PAIRS.length),
          PAIRS.length - 1
        );
        cell.pairIdx = pairIdx;

        const [charA, charB] = PAIRS[pairIdx];

        // Pulse between A and B
        const pulse = Math.sin(t * 0.5 + cell.phase);
        const char = pulse < 0 ? charA : charB;

        // Opacity: very dim
        const opacity = 0.02 + (1 - pairIdx / PAIRS.length) * 0.03;

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
