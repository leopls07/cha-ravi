"use client";

import { motion } from "framer-motion";

type ClotheslineProps = {
  className?: string;
};

const ITENS = [
  { x: 30, delay: 0, color: "var(--verde-salvia)" },
  { x: 90, delay: 0.3, color: "var(--bege)" },
  { x: 150, delay: 0.6, color: "var(--marrom-claro)" },
  { x: 210, delay: 0.15, color: "var(--dourado-claro)" },
];

export function Clothesline({ className = "" }: ClotheslineProps) {
  return (
    <svg viewBox="0 0 260 110" className={className} role="img" aria-label="Varal de roupinhas">
      <line x1="0" y1="10" x2="260" y2="10" stroke="var(--marrom-claro)" strokeWidth="2" />
      {ITENS.map((item, i) => (
        <motion.g
          key={i}
          style={{ transformOrigin: `${item.x + 12}px 10px` }}
          animate={{ rotate: [-2, 2, -2] }}
          transition={{
            duration: 3.5,
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <line x1={item.x + 4} y1="10" x2={item.x + 4} y2="16" stroke="var(--marrom-cacau)" strokeWidth="2" />
          <line x1={item.x + 20} y1="10" x2={item.x + 20} y2="16" stroke="var(--marrom-cacau)" strokeWidth="2" />
          {i === 0 && (
            <path
              d="M4 16 h32 v10 a16 16 0 0 1 -32 0 z M10 16 l-6 -8 M34 16 l6 -8"
              fill={item.color}
              stroke="var(--linha)"
            />
          )}
          {i === 1 && <rect x="0" y="16" width="40" height="34" rx="8" fill={item.color} stroke="var(--linha)" />}
          {i === 2 && (
            <path
              d="M4 16 h32 v6 l-8 4 v18 h-16 v-18 l-8 -4 z"
              fill={item.color}
              stroke="var(--linha)"
            />
          )}
          {i === 3 && (
            <>
              <path d="M4 16 h14 v16 a7 7 0 0 1 -14 0 z" fill={item.color} stroke="var(--linha)" />
              <path d="M22 16 h14 v16 a7 7 0 0 1 -14 0 z" fill={item.color} stroke="var(--linha)" />
            </>
          )}
        </motion.g>
      ))}
    </svg>
  );
}
