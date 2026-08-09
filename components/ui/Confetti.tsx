"use client";

import { motion } from "framer-motion";

const PIECES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: (Math.random() - 0.5) * 260,
  delay: Math.random() * 0.3,
  rotate: Math.random() * 360,
  color: i % 2 === 0 ? "var(--dourado)" : "var(--dourado-claro)",
}));

export function Confetti() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 flex justify-center overflow-visible"
    >
      {PIECES.map((piece) => (
        <motion.span
          key={piece.id}
          className="absolute h-2 w-2 rounded-sm"
          style={{ backgroundColor: piece.color }}
          initial={{ x: piece.x, y: -10, opacity: 1, rotate: 0 }}
          animate={{ y: 160, opacity: 0, rotate: piece.rotate }}
          transition={{ duration: 1.4, delay: piece.delay, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}
