"use client";

import { motion } from "framer-motion";

type CloudsProps = {
  className?: string;
};

export function Clouds({ className = "" }: CloudsProps) {
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
      <motion.svg
        viewBox="0 0 120 40"
        className="absolute left-2 w-24 opacity-70"
        animate={{ x: [0, 12, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      >
        <g fill="var(--areia)">
          <ellipse cx="30" cy="24" rx="24" ry="14" />
          <ellipse cx="60" cy="18" rx="20" ry="16" />
          <ellipse cx="90" cy="24" rx="22" ry="13" />
        </g>
      </motion.svg>
      <motion.svg
        viewBox="0 0 120 40"
        className="absolute right-2 top-6 w-16 opacity-60"
        animate={{ x: [0, -10, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      >
        <g fill="var(--bege)">
          <ellipse cx="30" cy="24" rx="24" ry="14" />
          <ellipse cx="60" cy="18" rx="20" ry="16" />
          <ellipse cx="90" cy="24" rx="22" ry="13" />
        </g>
      </motion.svg>
    </div>
  );
}
