"use client";

import { motion } from "motion/react";
import { useRef } from "react";
import { useInView } from "motion/react";

interface AnimatedHeadingProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4";
}

export default function AnimatedHeading({
  text,
  className = "",
  as: Tag = "h2",
}: AnimatedHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const words = text.split(" ");

  return (
    <Tag ref={ref} className={className}>
      {words.map((word, wordIdx) => (
        <span key={wordIdx} className="inline-block mr-[0.3em] last:mr-0">
          {word.split("").map((char, charIdx) => (
            <motion.span
              key={charIdx}
              className="inline-block"
              initial={{ opacity: 0, y: 20, rotateX: -90 }}
              animate={
                isInView
                  ? { opacity: 1, y: 0, rotateX: 0 }
                  : { opacity: 0, y: 20, rotateX: -90 }
              }
              transition={{
                duration: 0.4,
                delay: wordIdx * 0.12 + charIdx * 0.03,
                ease: [0.2, 0.65, 0.3, 0.9],
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
