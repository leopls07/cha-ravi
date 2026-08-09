"use client";

import {
  FRALDAS_SUGERIDAS,
  MIMOS_SUGERIDOS,
  OUTROS_PRESENTES,
  TAMANHOS_FRALDA_SUGERIDOS,
} from "@/lib/event";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { ScreenFooter } from "../ui/ScreenFooter";
import { GiftsScreenProps } from "./types";

function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function GiftsScreen({ onNext, onBack, onPresentear }: GiftsScreenProps) {
  return (
    <div className="flex flex-col gap-4 px-6 pb-4 pt-6">
      <h2 className="text-center font-script text-3xl text-dourado">Presentes</h2>

      <Card>
        <p className="mb-2 font-display text-base font-semibold text-marrom-cacau">
          🍼 Fraldas (o principal)
        </p>
        <p className="mb-1 font-sans text-sm text-marrom-cacau">
          {FRALDAS_SUGERIDAS.join(" · ")}
        </p>
        <p className="font-sans text-xs text-marrom-claro">
          Tamanhos {TAMANHOS_FRALDA_SUGERIDOS.join(" e ")}
        </p>
      </Card>

      <Card>
        <p className="mb-2 font-display text-base font-semibold text-marrom-cacau">🧸 Mimos</p>
        <div className="flex flex-wrap gap-2">
          {MIMOS_SUGERIDOS.map((mimo) => (
            <span
              key={mimo}
              className="rounded-full border border-linha bg-creme px-3 py-1 font-sans text-xs text-marrom-cacau"
            >
              {mimo}
            </span>
          ))}
        </div>
      </Card>

      <Card>
        <p className="mb-3 font-display text-base font-semibold text-marrom-cacau">
          🎁 Outros presentes
        </p>
        <div className="space-y-3">
          {OUTROS_PRESENTES.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-linha bg-creme px-4 py-3"
            >
              <div>
                <p className="font-sans text-sm font-semibold text-marrom-cacau">{item.nome}</p>
                <p className="font-sans text-xs text-marrom-claro">{formatBRL(item.valor)}</p>
              </div>
              <Button variant="secondary" onClick={() => onPresentear(item.valor)}>
                Presentear via Pix
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <p className="text-center font-sans text-xs text-marrom-claro">
        Quem vier ao chá pode trazer a fralda e/ou um mimo no dia :)
      </p>

      <ScreenFooter onBack={onBack} onNext={onNext} nextLabel="Contribuir via Pix →" />
    </div>
  );
}
