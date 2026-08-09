"use client";

import { EVENTO } from "@/lib/event";
import { useCountdown } from "@/lib/useCountdown";
import { BalloonArch } from "../illustrations/BalloonArch";
import { Bear } from "../illustrations/Bear";
import { Clothesline } from "../illustrations/Clothesline";
import { Clouds } from "../illustrations/Clouds";
import { HeartDivider } from "../ui/HeartDivider";
import { ScreenFooter } from "../ui/ScreenFooter";
import { ScreenProps } from "./types";

function CountdownBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-dourado-claro bg-creme font-display text-2xl font-semibold text-dourado">
        {String(value).padStart(2, "0")}
      </div>
      <span className="font-sans text-[11px] uppercase tracking-wide text-marrom-claro">
        {label}
      </span>
    </div>
  );
}

export function CoverScreen({ onNext, onBack }: ScreenProps) {
  const countdown = useCountdown(EVENTO.data);

  return (
    <div className="flex flex-col items-center gap-6 px-6 pb-4 pt-6 text-center">
      <div className="relative h-16 w-full">
        <Clouds className="relative h-16" />
      </div>
      <BalloonArch className="h-20 w-full" />

      <div className="space-y-0">
        <p className="font-script text-4xl text-dourado">Chá de Fraldas</p>
        <p className="font-script text-2xl text-marrom-claro">do</p>
        <p className="font-script text-5xl text-verde-escuro">{EVENTO.bebe}</p>
      </div>

      <HeartDivider />

      <p className="font-display text-sm italic text-marrom-cacau">“{EVENTO.frase}”</p>

      <Clothesline className="h-20 w-full max-w-xs" />

      <div className="w-full rounded-3xl border border-linha bg-branco/70 p-4">
        {countdown.chegou ? (
          <p className="font-display text-lg font-semibold text-verde-escuro">
            O grande dia chegou! 💛
          </p>
        ) : (
          <>
            <p className="mb-3 font-sans text-xs uppercase tracking-widest text-marrom-claro">
              Falta pouco
            </p>
            <div className="flex justify-center gap-3">
              <CountdownBlock value={countdown.dias} label="dias" />
              <CountdownBlock value={countdown.horas} label="horas" />
              <CountdownBlock value={countdown.minutos} label="min" />
              <CountdownBlock value={countdown.segundos} label="seg" />
            </div>
          </>
        )}
      </div>

      <Bear className="h-24 w-24" />

      <p className="font-sans text-xs text-marrom-claro">
        👉 arraste para o lado ou toque no botão
      </p>

      <ScreenFooter onBack={onBack} onNext={onNext} nextLabel="Ver detalhes →" />
    </div>
  );
}
