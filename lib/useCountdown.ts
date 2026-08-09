"use client";

import { useEffect, useState } from "react";

export type Countdown = {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
  chegou: boolean;
};

function calcCountdown(target: Date): Countdown {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) {
    return { dias: 0, horas: 0, minutos: 0, segundos: 0, chegou: true };
  }
  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutos = Math.floor((diff / (1000 * 60)) % 60);
  const segundos = Math.floor((diff / 1000) % 60);
  return { dias, horas, minutos, segundos, chegou: false };
}

export function useCountdown(targetIso: string): Countdown {
  const [countdown, setCountdown] = useState<Countdown>(() => calcCountdown(new Date(targetIso)));

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(calcCountdown(new Date(targetIso)));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetIso]);

  return countdown;
}
