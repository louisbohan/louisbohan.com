"use client";

import { useEffect, useRef, useCallback, useState } from "react";

interface AsciiParticle {
  finalX: number;
  finalY: number;
  currentX: number;
  currentY: number;
  char: string;
  size: number;
  opacity: number;
}

interface ParticleFieldProps {
  density?: "sparse" | "dense";
  /** URL to an image to render as ASCII mosaic (dense mode only) */
  srcImage?: string;
  attractors?: { x: number; y: number }[];
  className?: string;
}

const CHARS_SPARSE = ["·", "·", "·", "·", "*", "+"];
const CHARS_DENSE = ["@", "#", "%", "&", "*", "+", "-", "·", ".", ":", "~"];
const SOFT_WHITE = "rgba(240, 236, 228, VAR)";

// Local constitution scroll+quill artwork (place in public/)
const CONSTITUTION_IMAGE = "/constitution-art.png";

export default function AsciiParticleField({
  density = "sparse",
  srcImage,
  attractors = [],
  className = "",
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<AsciiParticle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const frameRef = useRef(0);
  const timeRef = useRef(0);
  const attractorsRef = useRef(attractors);
  attractorsRef.current = attractors;
  const [imageData, setImageData] = useState<ImageData | null>(null);

  const isDense = density === "dense";

  // Load source image and extract pixel data
  useEffect(() => {
    if (!isDense) return;

    const imgUrl = srcImage || CONSTITUTION_IMAGE;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.naturalWidth || img.width;
      c.height = img.naturalHeight || img.height;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      setImageData(ctx.getImageData(0, 0, c.width, c.height));
    };
    img.src = imgUrl;
  }, [isDense, srcImage]);

  // Build ASCII grid from image — deterministic positions for a recognizable mosaic
  const initDenseParticles = useCallback(
    (w: number, h: number, imgData: ImageData) => {
      const chars = CHARS_DENSE;
      const data = imgData.data;
      const imgW = imgData.width;
      const imgH = imgData.height;

      // Target: a grid of ASCII chars covering the viewport
      // Each grid cell samples the source image pixel at that position
      const fontSize = 8;
      const charW = fontSize * 0.6;
      const charH = fontSize * 1.2;
      const cols = Math.floor(w / charW);
      const rows = Math.floor(h / charH);

      const p: AsciiParticle[] = [];

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          // Map grid cell to source image coordinates
          const srcX = Math.floor((col / cols) * imgW);
          const srcY = Math.floor((row / rows) * imgH);
          const idx = (srcY * imgW + srcX) * 4;

          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const a = data[idx + 3];

          // Skip fully transparent
          if (a < 10) continue;

          // Brightness: high brightness = image has content
          // The image has dark lines on a beige bg — so DARK pixels are the drawing
          const brightness = (r + g + b) / (255 * 3);
          // Invert: the drawing lines are darker than the background
          // Beige bg ~200-240 → brightness ~0.78-0.94
          // Dark lines ~50-100 → brightness ~0.06-0.13
          // We want to show the DRAWING (dark pixels), not the bg
          const isDrawing = brightness < 0.5;

          if (!isDrawing) continue;

          // Determine char based on darkness level
          const darkLevel = 1 - brightness; // 0-1, higher = darker
          const charIdx = Math.floor(darkLevel * chars.length);
          const char = chars[Math.min(charIdx, chars.length - 1)];

          const cx = col * charW + charW / 2;
          const cy = row * charH + charH / 2;

          p.push({
            finalX: cx,
            finalY: cy,
            currentX: cx + (Math.random() - 0.5) * 40,
            currentY: cy + (Math.random() - 0.5) * 40,
            char,
            size: fontSize + (Math.random() - 0.5) * 2,
            opacity: 0.1 + darkLevel * 0.15,
          });
        }
      }

      particlesRef.current = p;
    },
    []
  );

  const initSparseParticles = useCallback((w: number, h: number) => {
    const count = 80;
    const p: AsciiParticle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * Math.min(w, h) * 0.35;
      p.push({
        finalX: w / 2 + Math.cos(angle) * radius,
        finalY: h / 2 + Math.sin(angle) * radius,
        currentX: w / 2 + Math.cos(angle) * radius,
        currentY: h / 2 + Math.sin(angle) * radius,
        char: CHARS_SPARSE[Math.floor(Math.random() * CHARS_SPARSE.length)],
        size: 9 + Math.random() * 4,
        opacity: 0.02 + Math.random() * 0.08,
      });
    }
    particlesRef.current = p;
  }, []);

  // Initialize particles when image data is ready
  useEffect(() => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    // Clear stale particles on resize
    if (rect.width > 0 && rect.height > 0) {
      if (isDense && imageData) {
        initDenseParticles(rect.width, rect.height, imageData);
      } else if (!isDense) {
        initSparseParticles(rect.width, rect.height);
      }
    }
  }, [imageData, isDense, initDenseParticles, initSparseParticles]);

  // Re-initialize on resize
  const prevSizeRef = useRef({ w: 0, h: 0 });

  useEffect(() => {
    if (!isDense) return;

    const checkResize = () => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      if (
        rect.width !== prevSizeRef.current.w ||
        rect.height !== prevSizeRef.current.h
      ) {
        prevSizeRef.current = { w: rect.width, h: rect.height };
        if (imageData) {
          initDenseParticles(rect.width, rect.height, imageData);
        }
      }
    };

    const interval = setInterval(checkResize, 1000);
    return () => clearInterval(interval);
  }, [isDense, imageData, initDenseParticles]);

  // Animation loop
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

    const onMouse = (e: MouseEvent) => {
      const rect = canvas!.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    const onLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    window.addEventListener("mousemove", onMouse);
    window.addEventListener("mouseleave", onLeave);

    let animId: number;

    const animate = (timestamp: number) => {
      timeRef.current = timestamp * 0.001;
      const rect = canvas!.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      // Clear fully each frame for crisp ASCII rendering
      ctx!.clearRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const hasMouseInView = mx > -500;

      // Pulsation: slow breathe cycle
      const breathe = 0.6 + 0.4 * Math.sin(timeRef.current * 0.8);

      // Mouse proximity radius for glow
      const particles = particlesRef.current;
      const t = timeRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Slow drift toward final position (like example: slow mimic)
        const dx = p.finalX - p.currentX;
        const dy = p.finalY - p.currentY;
        p.currentX += dx * 0.03;
        p.currentY += dy * 0.03;

        // Gentle ambient sway
        p.currentX += Math.sin(t * 0.5 + i * 0.1) * 0.15;
        p.currentY += Math.cos(t * 0.4 + i * 0.13) * 0.15;

        // Mouse tracking: particles near cursor glow brighter
        const mxDist = hasMouseInView
          ? Math.sqrt(
              (p.currentX - mx) ** 2 + (p.currentY - my) ** 2
            )
          : Infinity;
        const mouseGlow = hasMouseInView
          ? Math.max(0, 1 - mxDist / 400) * 0.5
          : 0;

        // Pulsating illumination
        // Each particle has a slightly different phase for organic feel
        const phase = i * 0.007;
        const pulse = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * 0.6 + phase));

        const finalOpacity = Math.min(
          p.opacity * pulse * breathe + mouseGlow,
          0.7
        );

        if (finalOpacity < 0.02) continue;

        ctx!.font = `${p.size}px "JetBrains Mono", monospace`;
        ctx!.textAlign = "center";
        ctx!.textBaseline = "middle";
        ctx!.fillStyle = SOFT_WHITE.replace("VAR", String(finalOpacity));
        ctx!.fillText(p.char, p.currentX, p.currentY);
      }

      frameRef.current = animId;
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [density, isDense]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full pointer-events-none z-0 ${className}`}
      aria-hidden="true"
    />
  );
}
