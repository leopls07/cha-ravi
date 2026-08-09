"use client";

import { ReactNode } from "react";

type ChipProps = {
  children: ReactNode;
  selected?: boolean;
  onClick?: () => void;
};

export function Chip({ children, selected = false, onClick }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`min-h-11 rounded-full border-2 px-4 py-2 font-sans text-sm font-semibold transition-colors ${
        selected
          ? "border-verde-escuro bg-verde-escuro text-white"
          : "border-linha bg-branco text-marrom-cacau hover:border-dourado"
      }`}
    >
      {children}
    </button>
  );
}
