"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FRALDAS_SUGERIDAS,
  MIMOS_SUGERIDOS,
  OUTROS_PRESENTES,
  PACOTES_ATALHO,
  PACOTES_ICONES_MAX,
  PACOTES_MAX,
  PACOTES_MIN,
  PIX,
  TAMANHOS_FRALDA_SUGERIDOS,
  mensagemPacotes,
} from "@/lib/event";
import { Card } from "../ui/Card";
import { Chip } from "../ui/Chip";
import { Stepper } from "../ui/Stepper";
import { ScreenFooter } from "../ui/ScreenFooter";
import { DiaperIcon } from "../illustrations/DiaperIcon";
import { GiftsScreenProps } from "./types";

const OUTROS_QTD_MAX = 5;

function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function GiftsScreen({ onBack, onPresentear }: GiftsScreenProps) {
  const [qtdFraldas, setQtdFraldas] = useState(0);
  const [itens, setItens] = useState<Record<string, number>>({});

  const totalFraldas = qtdFraldas * PIX.valorPacoteFralda;
  const totalOutros = OUTROS_PRESENTES.reduce(
    (soma, item) => soma + (itens[item.id] ?? 0) * item.valor,
    0
  );
  const total = totalFraldas + totalOutros;

  function setQtdItem(id: string, qtd: number) {
    setItens((atual) => ({ ...atual, [id]: Math.max(0, Math.min(OUTROS_QTD_MAX, qtd)) }));
  }

  return (
    <div className="flex flex-col gap-4 px-6 pb-4 pt-6">
      <h2 className="text-center font-script text-3xl text-dourado">Presentes</h2>
      <p className="text-center font-sans text-sm text-marrom-cacau">
        Vá adicionando o que quiser — o valor total é somado automaticamente.
      </p>

      <Card>
        <p className="mb-1 font-display text-base font-semibold text-marrom-cacau">
          🍼 Fraldas (o principal)
        </p>
        <p className="mb-1 font-sans text-sm text-marrom-cacau">{FRALDAS_SUGERIDAS.join(" · ")}</p>
        <p className="mb-4 font-sans text-xs text-marrom-claro">
          Tamanhos {TAMANHOS_FRALDA_SUGERIDOS.join(" e ")} · pacote a {formatBRL(PIX.valorPacoteFralda)}
        </p>

        <div className="space-y-4">
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              aria-label="Diminuir pacotes"
              disabled={qtdFraldas <= PACOTES_MIN}
              onClick={() => setQtdFraldas((q) => Math.max(PACOTES_MIN, q - 1))}
              className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-linha text-xl font-bold text-verde-escuro disabled:opacity-30"
            >
              −
            </button>
            <span className="w-16 text-center font-display text-3xl font-semibold text-marrom-cacau tabular-nums">
              {qtdFraldas}
            </span>
            <button
              type="button"
              aria-label="Aumentar pacotes"
              disabled={qtdFraldas >= PACOTES_MAX}
              onClick={() => setQtdFraldas((q) => Math.min(PACOTES_MAX, q + 1))}
              className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-linha text-xl font-bold text-verde-escuro disabled:opacity-30"
            >
              +
            </button>
          </div>

          <input
            type="range"
            min={PACOTES_MIN}
            max={PACOTES_MAX}
            value={qtdFraldas}
            onChange={(e) => setQtdFraldas(Number(e.target.value))}
            className="w-full accent-[#6B7F5E]"
            aria-label="Quantidade de pacotes de fralda"
          />

          <div className="flex flex-wrap justify-center gap-2">
            {PACOTES_ATALHO.map((n) => (
              <Chip key={n} selected={qtdFraldas === n} onClick={() => setQtdFraldas(n)}>
                {n}
              </Chip>
            ))}
          </div>

          {qtdFraldas > 0 && (
            <>
              {qtdFraldas <= PACOTES_ICONES_MAX && (
                <div
                  className="flex min-h-14 flex-wrap items-end justify-center gap-1"
                  aria-hidden="true"
                >
                  <AnimatePresence initial={false}>
                    {Array.from({ length: qtdFraldas }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      >
                        <DiaperIcon className="h-8 w-8" />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              <p className="text-center font-sans text-sm font-medium text-marrom-cacau">
                {mensagemPacotes(qtdFraldas)}
              </p>
              <p className="text-center font-display text-lg font-semibold text-dourado">
                {formatBRL(totalFraldas)}
              </p>
            </>
          )}
        </div>
      </Card>

      <Card>
        <p className="mb-3 font-display text-base font-semibold text-marrom-cacau">
          🎁 Outros presentes
        </p>
        <div className="space-y-3">
          {OUTROS_PRESENTES.map((item) => {
            const qtd = itens[item.id] ?? 0;
            return (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-linha bg-creme px-4 py-3"
              >
                <div>
                  <p className="font-sans text-sm font-semibold text-marrom-cacau">{item.nome}</p>
                  <p className="font-sans text-xs text-marrom-claro">{formatBRL(item.valor)}</p>
                </div>
                <Stepper
                  value={qtd}
                  min={0}
                  max={OUTROS_QTD_MAX}
                  onChange={(novaQtd) => setQtdItem(item.id, novaQtd)}
                />
              </div>
            );
          })}
        </div>
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

      <p className="text-center font-sans text-xs text-marrom-claro">
        Quem vier ao chá pode trazer a fralda e/ou um mimo no dia :)
      </p>

      <Card tint="salvia">
        <p className="mb-1 text-center font-sans text-xs uppercase tracking-wide text-marrom-claro">
          Total selecionado
        </p>
        <motion.p
          key={total}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center font-display text-4xl font-bold text-dourado"
        >
          {formatBRL(total)}
        </motion.p>
      </Card>

      <ScreenFooter
        onBack={onBack}
        onNext={() => onPresentear(total)}
        nextLabel={total > 0 ? `Contribuir com ${formatBRL(total)} via Pix →` : "Ir para o Pix →"}
      />
    </div>
  );
}
