"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { EVENTO } from "@/lib/event";
import { HeartSeal } from "../illustrations/HeartSeal";
import { ScreenProps } from "./types";

export function EnvelopeScreen({ onNext }: ScreenProps) {
  const [opening, setOpening] = useState(false);

  function handleOpen() {
    if (opening) return;
    setOpening(true);
    setTimeout(onNext, 900);
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="font-sans text-sm uppercase tracking-widest text-marrom-claro">
        Você recebeu um convite especial
      </p>

      <button
        type="button"
        onClick={handleOpen}
        aria-label="Abrir convite"
        className="relative h-48 w-64"
        style={{ perspective: "800px" }}
      >
        <div className="absolute inset-0 rounded-2xl border border-linha bg-areia shadow-lg shadow-marrom-cacau/10" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 rounded-b-2xl bg-bege" />
        <motion.div
          className="absolute inset-x-0 top-0 h-1/2 origin-top rounded-t-2xl bg-dourado-claro"
          style={{
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            transformStyle: "preserve-3d",
          }}
          animate={{ rotateX: opening ? -180 : 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={opening ? { y: -70, opacity: 0 } : { y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: opening ? 0.25 : 0, ease: "easeOut" }}
        >
          <HeartSeal className="h-12 w-12 drop-shadow" />
        </motion.div>
      </button>

      <div className="space-y-1">
        <p className="font-display text-lg font-semibold text-marrom-cacau">
          {EVENTO.titulo}
        </p>
        <p className="font-sans text-sm text-marrom-claro">Toque no envelope para abrir</p>
      </div>

      <button
        type="button"
        onClick={handleOpen}
        className="min-h-11 rounded-full bg-gradient-to-r from-verde-salvia to-verde-escuro px-6 py-3 font-sans text-sm font-semibold text-white shadow-md"
      >
        Abrir convite →
      </button>
    </div>
  );
}
