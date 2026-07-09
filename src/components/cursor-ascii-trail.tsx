"use client";

import { useEffect, useRef } from "react";

interface Props {
  className?: string;
  /** When set, ASCII chars are placed at sampled pixel positions instead of concentric rings */
  srcImage?: string;
}

// ASCII chars ordered by visual weight (lightest → heaviest)
const DENSITY_CHARS = [".", "·", ":", "-", "=", "+", "*", "#", "%", "@"];

export default function CursorAsciiTrail({
  className = "",
  srcImage,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -2000, y: -2000 });
  const frameRef = useRef(0);
  const timeRef = useRef(0);
  const imagePixelsRef = useRef<{ x: number; y: number; char: string; size: number; opacity: number }[] | null>(null);

  // Load image and precompute pixel particles
  useEffect(() => {
    if (!srcImage) {
      imagePixelsRef.current = null;
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.naturalWidth || img.width;
      c.height = img.naturalHeight || img.height;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, c.width, c.height);
      const data = imgData.data;
      const imgW = imgData.width;
      const imgH = imgData.height;

      const chars = DENSITY_CHARS;
      const pixels: { x: number; y: number; char: string; size: number; opacity: number }[] = [];

      // Sample every Nth pixel for performance — the image is 183x184
      const step = 3;
      const totalSamples = Math.floor(imgW / step) * Math.floor(imgH / step);
      const maxParticles = Math.min(totalSamples, 3000);

      for (let py = 0; py < imgH; py += step) {
        for (let px = 0; px < imgW; px += step) {
          const idx = (py * imgW + px) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const a = data[idx + 3];

          if (a < 10) continue;

          // Invert brightness: dark pixels = drawing lines = show ASCII
          const brightness = (r + g + b) / (255 * 3);
          const darkness = 1 - brightness;

          // Only show pixels that are part of the drawing (dark lines)
          if (darkness < 0.3) continue;

          const charIdx = Math.floor(darkness * chars.length);
          const char = chars[Math.min(charIdx, chars.length - 1)];

          pixels.push({
            x: px / imgW, // normalized 0-1
            y: py / imgH,
            char,
            size: 7 + darkness * 3,
            opacity: 0.01 + darkness * 0.10,
          });

          if (pixels.length >= maxParticles) break;
        }
        if (pixels.length >= maxParticles) break;
      }

      imagePixelsRef.current = pixels;
    };
    img.src = srcImage;
  }, [srcImage]);

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

      // Fade trail
      ctx!.fillStyle = "rgba(15, 25, 35, 0.15)";
      ctx!.fillRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const hasMouse = mx > -1500;
      const t = timeRef.current;

      if (!hasMouse) {
        frameRef.current = animId;
        animId = requestAnimationFrame(animate);
        return;
      }

      const pixels = imagePixelsRef.current;

      if (pixels && pixels.length > 0) {
        // Image-shaped mode: render pre-sampled pixels centered on cursor
        const imgW = 200; // reference canvas size
        const imgH = 200;
        const displayW = Math.min(w * 0.5, 600);
        const displayH = displayW * (imgH / imgW);
        const offsetX = mx - displayW / 2;
        const offsetY = my - displayH / 2;

        for (let i = 0; i < pixels.length; i++) {
          const px = offsetX + pixels[i].x * displayW;
          const py = offsetY + pixels[i].y * displayH;

          // Distance from cursor for glow
          const dist = Math.sqrt((px - mx) ** 2 + (py - my) ** 2);
          const glow = Math.max(0, 1 - dist / 300) * 0.15;
          const breathe = 0.5 + 0.5 * Math.sin(t * 0.8 + i * 0.01);
          const opacity = Math.min(pixels[i].opacity * breathe + glow, 0.4);

          if (opacity < 0.01) continue;

          ctx!.font = `${pixels[i].size}px "JetBrains Mono", monospace`;
          ctx!.textAlign = "center";
          ctx!.textBaseline = "middle";
          ctx!.fillStyle = `rgba(240, 236, 228, ${opacity})`;
          ctx!.fillText(pixels[i].char, px, py);
        }
      } else {
        // Original cursor trail mode: concentric rings
        const chars = DENSITY_CHARS;
        const ringRadii = [8, 22, 38, 56, 78, 105, 135, 170, 210, 260];

        for (let ringIdx = 0; ringIdx < ringRadii.length; ringIdx++) {
          const radius = ringRadii[ringIdx];
          const char = chars[chars.length - 1 - ringIdx];
          const count = Math.max(3, Math.floor(radius * 0.22));

          const ringPhase = ringIdx * 0.4;
          const pulse = 1 + 0.1 * Math.sin(t * 1.2 + ringPhase);
          const dimFactor = 1 - ringIdx / ringRadii.length;
          const opacity = 0.01 + dimFactor * 0.08;

          const r = radius * pulse;

          for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2 + t * 0.02 * (ringIdx + 1);
            const jitter = (Math.random() - 0.5) * 3;
            const x = mx + Math.cos(angle) * r + jitter;
            const y = my + Math.sin(angle) * r + jitter;

            if (x < -5 || x > w + 5 || y < -5 || y > h + 5) continue;

            const size = 7 + Math.floor(Math.random() * 3);

            ctx!.font = `${size}px "JetBrains Mono", monospace`;
            ctx!.textAlign = "center";
            ctx!.textBaseline = "middle";
            ctx!.fillStyle = `rgba(240, 236, 228, ${opacity})`;
            ctx!.fillText(char, x, y);
          }
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
  }, [!!srcImage]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full pointer-events-none z-0 ${className}`}
      aria-hidden="true"
    />
  );
}
