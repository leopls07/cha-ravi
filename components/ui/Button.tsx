"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { motion } from "framer-motion";

type Variant = "primary" | "secondary" | "ghost";

type ButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onAnimationStart" | "onAnimationEnd" | "onDrag" | "onDragEnd" | "onDragStart"
> & {
  variant?: Variant;
  children: ReactNode;
  fullWidth?: boolean;
};

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-verde-salvia to-verde-escuro text-white shadow-md shadow-verde-escuro/20",
  secondary: "bg-transparent border-2 border-dourado text-marrom-cacau",
  ghost: "bg-transparent text-marrom-cacau underline underline-offset-4",
};

export function Button({
  variant = "primary",
  children,
  fullWidth,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-3 font-sans text-base font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
        VARIANT_CLASSES[variant]
      } ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
