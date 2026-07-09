"use client";

import { useEffect, useRef, useCallback, useState } from "react";

interface AsciiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
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

// Anthropic Constitution page hero SVG
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
      c.width = 200;
      c.height = 200;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, 200, 200);
      setImageData(ctx.getImageData(0, 0, 200, 200));
    };
    img.src = imgUrl;
  }, [isDense, srcImage]);

  const initDenseParticles = useCallback(
    (w: number, h: number, imgData: ImageData) => {
      const chars = CHARS_DENSE;
      const p: AsciiParticle[] = [];
      const data = imgData.data;
      const imgW = imgData.width;
      const imgH = imgData.height;

      // Sample pixels at random positions weighted by brightness
      // Particles near bright pixels are more likely to be placed
      const samples = 600;
      let attempts = 0;
      const maxAttempts = samples * 10;
      const fontSize = 9;

      for (let i = 0; i < samples && attempts < maxAttempts; attempts++) {
        const px = Math.floor(Math.random() * imgW);
        const py = Math.floor(Math.random() * imgH);
        const idx = (py * imgW + px) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const a = data[idx + 3];

        // Brightness: 0 = black, 1 = white
        const brightness = (r + g + b) / (255 * 3);

        // Only place particles where image has non-transparent, visible content
        // Use brightness-weighted random sampling
        if (a < 10) continue;
        const randThreshold = 1 - brightness * 0.9;
        if (Math.random() < randThreshold) continue;

        // Map image pixel to canvas position
        const scaleX = w / imgW;
        const scaleY = h / imgH;
        const cx = px * scaleX + (Math.random() - 0.5) * 6;
        const cy = py * scaleY + (Math.random() - 0.5) * 5;

        p.push({
          x: cx,
          y: cy,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.12,
          char: chars[Math.floor(Math.random() * chars.length)],
          size: fontSize + (brightness > 0.5 ? 1 : -1) + (Math.random() - 0.5) * 2,
          opacity: 0.02 + brightness * 0.05 + Math.random() * 0.02,
        });
        i++;
      }

      // Fill remaining with faint atmosphere dots
      while (p.length < 600) {
        p.push({
          x: Math.random() * w,
          y: (Math.random() * h * 0.6) + h * 0.2,
          vx: (Math.random() - 0.5) * 0.08,
          vy: (Math.random() - 0.5) * 0.08,
          char: "·",
          size: 5,
          opacity: 0.01,
        });
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
        x: w / 2 + Math.cos(angle) * radius,
        y: h / 2 + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        char: CHARS_SPARSE[Math.floor(Math.random() * CHARS_SPARSE.length)],
        size: 9 + Math.random() * 4,
        opacity: 0.02 + Math.random() * 0.08,
      });
    }
    particlesRef.current = p;
  }, []);

  // Init particles when image data is ready
  useEffect(() => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    if (rect.width === 0) return;

    if (isDense && imageData) {
      initDenseParticles(rect.width, rect.height, imageData);
    } else if (!isDense) {
      initSparseParticles(rect.width, rect.height);
    }
  }, [imageData, isDense, initDenseParticles, initSparseParticles]);

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

    const animate = () => {
      const rect = canvas!.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      // Fade trail — slower in dense mode for more persistence
      ctx!.fillStyle = "rgba(15, 25, 35, " + (isDense ? "0.08" : "0.1") + ")";
      ctx!.fillRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const hasMouseInView = mx > -500;

      let attractX = w / 2;
      let attractY = h / 2;
      let pull = 0.0003;

      if (hasMouseInView) {
        attractX = mx;
        attractY = my;
        pull = 0.0008;
      } else if (attractorsRef.current.length > 0) {
        const a = attractorsRef.current[0];
        attractX = a.x;
        attractY = a.y;
        pull = 0.0005;
      }

      const particles = particlesRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        const dx = attractX - p.x;
        const dy = attractY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 10) {
          p.vx += (dx / dist) * pull * Math.min(dist, 300);
          p.vy += (dy / dist) * pull * Math.min(dist, 300);
        }

        p.vx *= 0.97;
        p.vy *= 0.97;

        p.vx += (Math.random() - 0.5) * 0.05;
        p.vy += (Math.random() - 0.5) * 0.05;

        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 1.2) {
          p.vx = (p.vx / speed) * 1.2;
          p.vy = (p.vy / speed) * 1.2;
        }

        p.x += p.vx;
        p.y += p.vy;

        const margin = 30;
        if (p.x < -margin) p.x = w + margin;
        if (p.x > w + margin) p.x = -margin;
        if (p.y < -margin) p.y = h + margin;
        if (p.y > h + margin) p.y = -margin;

        const baseOpacity = p.opacity;
        const proximity = hasMouseInView ? Math.max(0, 1 - dist / 500) : 0;
        const maxOp = isDense ? 0.12 : 0.15;
        const finalOpacity = Math.min(baseOpacity + proximity * 0.06, maxOp);

        ctx!.font = `${p.size}px "JetBrains Mono", monospace`;
        ctx!.textAlign = "center";
        ctx!.textBaseline = "middle";
        ctx!.fillStyle = SOFT_WHITE.replace("VAR", String(finalOpacity));
        ctx!.fillText(p.char, p.x, p.y);
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
