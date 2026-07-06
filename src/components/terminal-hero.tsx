"use client";

import { motion } from "motion/react";
import { useEffect, useState, useCallback } from "react";

const NAME = "Louis Bohan";
const TAGLINE = "I help businesses run better — through partnerships, automation, and custom tools";
const PROMPT = "visitor@louisbohan.com:~$";
const FULL_TEXT = ` ${PROMPT} whoami\n > ${NAME}\n ${PROMPT} ./purpose.sh\n > ${TAGLINE}`;

export default function TerminalHero() {
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < FULL_TEXT.length) {
        setDisplayedText(FULL_TEXT.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, []);

  // Cursor blink
  useEffect(() => {
    const blink = setInterval(() => {
      setShowCursor((c) => !c);
    }, 530);
    return () => clearInterval(blink);
  }, []);

  const promptLines = FULL_TEXT.split("\n");

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden px-4">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="scan-line absolute inset-0 opacity-30" />
      </div>

      <div className="relative z-10 w-full max-w-3xl">
        {/* Terminal window */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] }}
          className="glass rounded-xl overflow-hidden border border-white/10"
        >
          {/* Terminal title bar */}
          <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.03] border-b border-white/5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="ml-3 text-xs text-slate-500 font-mono">
              louisbohan.com — zsh
            </span>
          </div>

          {/* Terminal content */}
          <div className="p-6 md:p-10 font-mono text-sm md:text-base leading-relaxed">
            {promptLines.map((line, lineIdx) => {
              const lineStart = FULL_TEXT.split("\n").slice(0, lineIdx).join("\n").length + (lineIdx > 0 ? 1 : 0);
              const lineEnd = lineStart + line.length;
              const charsRevealed = Math.max(
                0,
                Math.min(line.length, displayedText.length - lineStart)
              );
              const isFullyTyped = displayedText.length >= lineEnd;

              if (lineIdx === 0) {
                // First line: just the prompt + whoami, then newline with > NAME
                return (
                  <div key={lineIdx} className="flex items-start">
                    <span className="text-cyan-400 shrink-0">$</span>
                    <span className="ml-2 text-slate-300">
                      whoami
                    </span>
                  </div>
                );
              }

              if (lineIdx === 1) {
                return (
                  <div key={lineIdx} className="flex items-start mt-1">
                    <span className="text-green-400 shrink-0">&gt;</span>
                    <motion.span
                      className="ml-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-indigo-300 to-purple-300"
                      initial={{ opacity: 0 }}
                      animate={isFullyTyped ? { opacity: 1 } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      {NAME}
                    </motion.span>
                  </div>
                );
              }

              if (lineIdx === 2) {
                return (
                  <div key={lineIdx} className="flex items-start mt-4">
                    <span className="text-cyan-400 shrink-0">$</span>
                    <span className="ml-2 text-slate-300">
                      ./purpose.sh
                    </span>
                  </div>
                );
              }

              if (lineIdx === 3) {
                const revealCount = Math.max(
                  0,
                  displayedText.length - FULL_TEXT.lastIndexOf("\n") - 1
                );
                return (
                  <div key={lineIdx} className="flex items-start mt-1">
                    <span className="text-green-400 shrink-0">&gt;</span>
                    <span className="ml-2 text-slate-300 whitespace-pre-wrap">
                      {TAGLINE.slice(0, revealCount)}
                      {revealCount < TAGLINE.length && (
                        <span
                          className={`inline-block w-[2px] h-[1em] bg-cyan-400 ml-0.5 ${
                            showCursor ? "opacity-100" : "opacity-0"
                          }`}
                        />
                      )}
                    </span>
                  </div>
                );
              }

              return null;
            })}

            {/* Final cursor line */}
            {displayedText.length >= FULL_TEXT.length && (
              <div className="flex items-start mt-4 border-t border-white/5 pt-4">
                <span className="text-cyan-400 shrink-0">$</span>
                <span className="ml-2 text-slate-500 italic text-xs">
                  <span className={`inline-block w-[2px] h-[1em] bg-cyan-400 ml-0.5 align-middle ${
                    showCursor ? "opacity-100" : "opacity-0"
                  }`} />
                  {" "}Ready. Scroll to explore →
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
