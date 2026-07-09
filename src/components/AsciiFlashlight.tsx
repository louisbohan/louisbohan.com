/**
 * AsciiFlashlight.tsx
 * ---------------------------------------------------------------------------
 * Pure ASCII background with flashlight beam from a fixed origin pointing
 * toward cursor. No source image — just a density field that's revealed
 * by the beam. Beam pulses = characters alternate between density levels.
 *
 * Spec:
 *  - Full page ASCII grid, static glyph assignment per cell
 *  - No image — cells get density glyphs based on page position (gradient field)
 *  - Beam is a CONE from origin point toward cursor
 *  - Beam enters/exits pulse = characters alternate density (the "breathing")
 *  - Outside beam: full dark (matches page bg)
 *  - Beam falloff: plateau ~72% then smoothstep shell
 *  - Breathing period ~5s, amplitude ±10%
 *  - Cursor lerp follow at 0.14
 *
 * Stack: TypeScript + React + raw Canvas 2D.
 *
 * Usage:
 *   <AsciiFlashlight originSelector="#github-icon" />
 * ---------------------------------------------------------------------------
 */

import React, { useEffect, useRef } from "react";

// ─── Tunables ───────────────────────────────────────────────────────────────

const CONFIG = {
  cellW: 7,
  cellH: 9,
  fontSize: 12,
  fontFamily: `"SF Mono", "Menlo", "Consolas", monospace`,

  // Beam cone geometry — very narrow, ~20-25 chars max spread at full page height.
  // At 7px/char, 25 chars wide over ~1000px reach => half-angle ~0.087 rad (5°)
  beamAngleSpread: 0.09,      // radians (~5.2°) — narrow, like a tight flashlight
  beamLength: 0,               // 0 = unlimited, shoots full page bottom to top
  plateau: 0.72,              // fraction from origin where brightness is full before falloff

  // Breathing — this IS the pulsation, 5s period, ±10%
  breathPeriod: 5.0,
  breathAmp: 0.10,

  // Cursor follow
  followLerp: 0.14,

  // Ink
  inkColor: "#ececec",
  bgColor: "#0f1923",         // matches page charcoals ${overscroll-behavior: none}

  // Character ramp — 16 density levels from empty to dense
  ramp: " .,:;i1tucsx%dwmM@",
};

// ─── Types ───────────────────────────────────────────────────────────────────

interface Props {
  /** CSS selector for the flashlight origin element (e.g. "#github-icon") */
  originSelector: string;
  config?: Partial<typeof CONFIG>;
  className?: string;
  style?: React.CSSProperties;
}

interface Cell {
  ch: string;  // "" means unlit / empty
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function AsciiFlashlight({ originSelector, config, style, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;
    const cv = canvas;
    const ctx = ctx2d;

    const cfg = { ...CONFIG, ...config };
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    // ── State ────────────────────────────────────────────────────────────
    let raf = 0;
    let cols = 0, rows = 0;
    let grid: Cell[] = [];
    let cssW = 0, cssH = 0, dpr = 1;
    let disposed = false;
    let lastT = performance.now();

    // Origin position — derived from the DOM element
    const origin = { x: 0, y: 0 };

    // Cursor target / smoothed position
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { x: target.x, y: target.y };

    const rampMax = cfg.ramp.length - 1;

    // ── Build grid — no image, just density based on cell position ──────
    // Creates a soft organic gradient across the page so different areas
    // have different base densities.
    function buildGrid() {
      cols = Math.ceil(cssW / cfg.cellW);
      rows = Math.ceil(cssH / cfg.cellH);
      grid = new Array<Cell>(cols * rows);

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const nx = x / cols;
          const ny = y / rows;
          // Gentle organic density field — two-octave sine blend
          let d =
            0.35 +
            0.15 * Math.sin(nx * 4.7 + ny * 2.1) +
            0.10 * Math.sin(nx * 1.3 - ny * 5.1 + 1.7);
          d += 0.08 * Math.sin(nx * 8.3 + ny * 7.9 + 2.4);
          d = Math.max(0, Math.min(1, d));

          const rampIdx = Math.round(d * rampMax);
          const ch = cfg.ramp[rampIdx];
          grid[y * cols + x] = { ch: ch === " " ? "" : ch };
        }
      }
    }

    // ── Parse origin DOM element position ───────────────────────────────
    function updateOrigin() {
      const el = document.querySelector(originSelector);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // Center of the element
      origin.x = rect.left + rect.width / 2;
      origin.y = rect.top + rect.height / 2;
    }

    // ── Resize ──────────────────────────────────────────────────────────
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cssW = window.innerWidth;
      cssH = window.innerHeight;
      cv.width = Math.round(cssW * dpr);
      cv.height = Math.round(cssH * dpr);
      cv.style.width = `${cssW}px`;
      cv.style.height = `${cssH}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      updateOrigin();
      buildGrid();
    }

    // ── Render loop ─────────────────────────────────────────────────────
    function frame(now: number) {
      if (disposed) return;
      const dt = Math.min((now - lastT) / 1000, 0.05);
      lastT = now;

      // Smooth cursor follow
      const k = 1 - Math.pow(1 - cfg.followLerp, dt * 60);
      pos.x += (target.x - pos.x) * k;
      pos.y += (target.y - pos.y) * k;

      // Re-check origin element position (in case it moved)
      updateOrigin();

      // Direction vector from origin to cursor
      const dx = pos.x - origin.x;
      const dy = pos.y - origin.y;
      const dist = Math.hypot(dx, dy);
      // Normalized direction from origin to cursor
      const dirX = dist > 0 ? dx / dist : 1;
      const dirY = dist > 0 ? dy / dist : 0;

      // Breathing — THE pulsation. ±10% radius scale on ~5s period
      const breath = reducedMotion
        ? 1
        : 1 + cfg.breathAmp * Math.sin((now / 1000) * ((Math.PI * 2) / cfg.breathPeriod));

      // Unlimited beam — reaches from origin to opposite edge of viewport
      const viewDiag = Math.hypot(cssW, cssH);
      const beamLength = viewDiag * 1.5;
      const cosThresh = Math.cos(cfg.beamAngleSpread);

      // Full clear — page bg
      ctx.fillStyle = cfg.bgColor;
      ctx.fillRect(0, 0, cssW, cssH);

      ctx.font = `${cfg.fontSize}px ${cfg.fontFamily}`;
      ctx.textBaseline = "top";
      ctx.fillStyle = cfg.inkColor;

      const halfW = cfg.cellW / 2;
      const halfH = cfg.cellH / 2;

      // Bounding box: narrow cone, just iterate the full viewport.
      // Dot product + perpNorm will reject outside-cone cells fast.
      const spreadDeg = cfg.beamAngleSpread;
      let coneLeft = 0;
      let coneRight = cssW;
      let coneTop = 0;
      let coneBottom = cssH;

      const x0 = Math.max(0, Math.floor((coneLeft) / cfg.cellW));
      const x1 = Math.min(cols - 1, Math.ceil(coneRight / cfg.cellW));
      const y0 = Math.max(0, Math.floor((coneTop) / cfg.cellH));
      const y1 = Math.min(rows - 1, Math.ceil(coneBottom / cfg.cellH));

      for (let gy = y0; gy <= y1; gy++) {
        for (let gx = x0; gx <= x1; gx++) {
          const cell = grid[gy * cols + gx];
          if (!cell || !cell.ch) continue;

          const cx = gx * cfg.cellW + halfW;
          const cy = gy * cfg.cellH + halfH;

          // Vector from origin to this cell
          const cdx = cx - origin.x;
          const cdy = cy - origin.y;
          const la = Math.hypot(cdx, cdy);

          // Beyond beam max length?
          if (la > beamLength) continue;

          // Angle from centerline — dot product with dir
          let dot = 0;
          if (la > 0) {
            dot = (cdx * dirX + cdy * dirY) / la;
            // Behind the flashlight (opposite direction from cursor)?
            if (dot < cosThresh) continue; // outside cone angle (or behind)
          }

          // Since dot < cosThresh catches the behind case (cosThresh > 0 for narrow cones),
          // anything reaching here is in the same hemisphere as cursor direction.

          // Distance along the beam (0 = origin, 1 = full length)
          const t = Math.min(la / beamLength, 1);
          if (t >= 1) continue;

          // Plateau + smoothstep shell falloff along beam axis
          let a = 1;
          if (t > cfg.plateau) {
            const s = (t - cfg.plateau) / (1 - cfg.plateau);
            a = 1 - s * s * (3 - 2 * s);
          }

          // Perpendicular distance from centerline — additional falloff for cone edges
          if (la > 0) {
            // Normalized perpendicular distance: 0 = centerline, 1 = cone edge
            const perpNorm = Math.sqrt(1 - dot * dot) / Math.sin(spreadDeg);
            if (perpNorm > 1) continue;

            // Same plateau+smoothstep for perpendicular direction
            let perpA = 1;
            if (perpNorm > cfg.plateau) {
              const ps = (perpNorm - cfg.plateau) / (1 - cfg.plateau);
              perpA = 1 - ps * ps * (3 - 2 * ps);
            }
            a *= perpA;
          }

          if (a < 0.02) continue;

          // The breathing effect alternates visible cells' density levels.
          // As the beam pulses, a secondary wave sweeps through the lit cells
          // shifting which glyph appears — this creates the sense of the beam
          // "breathing" the characters between densities.
          const densityShift = Math.sin(
            (now / 1000) * ((Math.PI * 2) / cfg.breathPeriod) + t * 3.0 + (gx + gy) * 0.3
          );
          // Shift ramp index by 0-2 steps based on breathing phase
          const shift = Math.round(densityShift * 1.5);
          const baseIdx = Math.max(0, Math.min(rampMax, cfg.ramp.indexOf(cell.ch)));

          // Alternate between base and base+shift (wrapping for dramatic pulse)
          const altIdx = Math.max(0, Math.min(rampMax, baseIdx + shift));
          const ch = altIdx !== baseIdx ? cfg.ramp[altIdx] : cell.ch;

          ctx.globalAlpha = a * 0.12;
          ctx.fillText(ch, gx * cfg.cellW, gy * cfg.cellH);
        }
      }
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(frame);
    }

    // ── Input ───────────────────────────────────────────────────────────
    const onMove = (e: PointerEvent) => { target.x = e.clientX; target.y = e.clientY; };
    const onTouch = (e: TouchEvent) => {
      if (e.touches[0]) {
        target.x = e.touches[0].clientX;
        target.y = e.touches[0].clientY;
      }
    };

    // ── Boot ────────────────────────────────────────────────────────────
    resize();
    lastT = performance.now();
    raf = requestAnimationFrame(frame);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("resize", resize);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("resize", resize);
    };
  }, [originSelector, config]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "fixed",
        inset: 0,
        display: "block",
        background: "#0f1923",
        cursor: "none",
        ...style,
      }}
    />
  );
}
