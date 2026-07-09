"use client";

import { useEffect, useRef } from "react";

interface Props {
  className?: string;
}

// Grayscale ramp: lightest → darkest
// .  :  -  =  +  #  @
// Bright areas → "."  (sparse)
// Dark areas → "@"  (dense)
const GRAYSCALE = [".", ":", "-", "=", "+", "#", "@"];

export default function CursorAsciiTrail({ className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -10000, y: -10000 });
  const timeRef = useRef(0);
  const imageDataRef = useRef<ImageData | null>(null);

  // Load the scroll+quill image and pre-compute grayscale values
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

      // Convert to single-channel grayscale values (0-1, 0=black, 1=white)
      const gray = new Float32Array(data.width * data.height);
      for (let i = 0; i < gray.length; i++) {
        const idx = i * 4;
        // Luminosity-weighted grayscale
        gray[i] =
          (data.data[idx] * 0.299 +
            data.data[idx + 1] * 0.587 +
            data.data[idx + 2] * 0.114) /
          255;
      }

      imageDataRef.current = {
        data: gray,
        width: data.width,
        height: data.height,
      } as unknown as ImageData;
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

    const grid: { x: number; y: number }[] = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        grid.push({ x: c * CELL + CELL / 2, y: r * CELL + CELL / 2 });
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

      const rayRadius = 400;
      const pulseRadius = rayRadius * (0.75 + 0.25 * Math.sin(t * 0.5));
      const imgData = imageDataRef.current;

      for (let i = 0; i < grid.length; i++) {
        const cell = grid[i];
        if (cell.x < -CELL || cell.x > w + CELL) continue;
        if (cell.y < -CELL || cell.y > h + CELL) continue;

        const dx = cell.x - mx;
        const dy = cell.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let illumination = 0;
        if (dist < pulseRadius) {
          const norm = dist / pulseRadius;
          illumination = Math.max(0, 1 - norm * norm);
          illumination = illumination * illumination;
        }

        if (illumination < 0.001) continue;

        // Sample the underlying image at this cell position
        let grayVal = 0.5; // default mid-gray

        if (imgData) {
          // Map canvas position to image coordinates
          const imgX = (cell.x / w) * imgData.width;
          const imgY = (cell.y / h) * imgData.height;
          const px = Math.floor(Math.min(imgX, imgData.width - 1));
          const py = Math.floor(Math.min(imgY, imgData.height - 1));
          const idx = py * imgData.width + px;

          // Invert: dark image lines → dark gray → "@"
          // Light image background → light gray → "."
          // The scroll image has dark lines on lighter bg
          // So we use the grayscale directly: dark pixels = high char index
          grayVal = 1 - imgData.data[idx]; // invert so dark=1, light=0
        } else {
          // Fallback: soft gradient while image loads
          const cx = cell.x / w;
          const cy = cell.y / h;
          grayVal =
            0.1 + 0.6 * Math.sin(cx * 2.3 + cy * 1.7) * Math.cos(cx * 1.1 - cy * 0.8);
        }

        // Combine image gray with illumination
        // Illuminated areas show the image, dark areas are invisible
        const revealed = grayVal * illumination;

        const charIdx = Math.min(
          Math.floor(revealed * GRAYSCALE.length),
          GRAYSCALE.length - 1
        );
        const char = GRAYSCALE[Math.max(0, charIdx)];

        // Brighter illumination → higher opacity but still dim
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
