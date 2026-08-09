"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { getGuestId } from "@/lib/useLocalStorage";
import { QUIZ_PERGUNTAS } from "@/lib/quiz";
import { CONTATOS, EVENTO } from "@/lib/event";
import { whatsappUrl } from "@/lib/whatsapp";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { ScreenFooter } from "../ui/ScreenFooter";
import { ScreenProps } from "./types";

type EstadoPergunta = {
  escolha: string | null;
  contagens: Record<string, number>;
};

function initialGuestId(): string | null {
  return typeof window === "undefined" ? null : getGuestId();
}

export function QuizScreen({ onNext, onBack }: ScreenProps) {
  const [passo, setPasso] = useState(0); // 0..N-1 perguntas, N = resumo
  const [estados, setEstados] = useState<Record<string, EstadoPergunta>>({});
  const [guestId] = useState<string | null>(initialGuestId);

  const pergunta = passo < QUIZ_PERGUNTAS.length ? QUIZ_PERGUNTAS[passo] : null;

  useEffect(() => {
    if (!pergunta || !supabase || !guestId) return;
    let ativo = true;

    supabase
      .from("votos")
      .select("opcao_id, guest_id")
      .eq("pergunta_id", pergunta.id)
      .then(({ data }) => {
        if (!ativo || !data) return;
        const contagens: Record<string, number> = {};
        let escolha: string | null = null;
        for (const voto of data) {
          contagens[voto.opcao_id] = (contagens[voto.opcao_id] ?? 0) + 1;
          if (voto.guest_id === guestId) escolha = voto.opcao_id;
        }
        setEstados((atual) => ({ ...atual, [pergunta.id]: { escolha, contagens } }));
      });

    return () => {
      ativo = false;
    };
  }, [pergunta, guestId]);

  async function votar(opcaoId: string) {
    if (!pergunta || !supabase || !guestId) return;
    const estadoAtual = estados[pergunta.id];
    if (estadoAtual?.escolha) return; // já votou, evita duplicidade

    setEstados((atual) => ({
      ...atual,
      [pergunta.id]: {
        escolha: opcaoId,
        contagens: {
          ...atual[pergunta.id]?.contagens,
          [opcaoId]: (atual[pergunta.id]?.contagens[opcaoId] ?? 0) + 1,
        },
      },
    }));

    await supabase
      .from("votos")
      .insert({ guest_id: guestId, pergunta_id: pergunta.id, opcao_id: opcaoId });
  }

  const resumo = passo >= QUIZ_PERGUNTAS.length;

  const mensagemPalpites = QUIZ_PERGUNTAS.map((p) => {
    const escolhaId = estados[p.id]?.escolha;
    const opcao = p.opcoes.find((o) => o.id === escolhaId);
    return `${p.texto} → ${opcao ? opcao.label : "não respondi"}`;
  }).join("\n");

  if (resumo) {
    return (
      <div className="flex flex-col gap-4 px-6 pb-4 pt-6 text-center">
        <h2 className="font-script text-3xl text-dourado">Seus palpites 💛</h2>
        <Card className="whitespace-pre-line text-left font-sans text-sm text-marrom-cacau">
          {mensagemPalpites}
        </Card>
        <Button
          variant="primary"
          onClick={() =>
            window.open(
              whatsappUrl(
                CONTATOS[0].whatsapp,
                `Meus palpites para o ${EVENTO.titulo} 💛\n\n${mensagemPalpites}`
              ),
              "_blank",
              "noopener,noreferrer"
            )
          }
        >
          Compartilhar meus palpites no WhatsApp
        </Button>
        <ScreenFooter onBack={() => setPasso(QUIZ_PERGUNTAS.length - 1)} onNext={onNext} nextLabel="Voltar ao início →" />
      </div>
    );
  }

  if (!pergunta) return null;
  const estado = estados[pergunta.id];
  const totalVotos = estado ? Object.values(estado.contagens).reduce((a, b) => a + b, 0) : 0;

  return (
    <div className="flex flex-col gap-4 px-6 pb-4 pt-6">
      <p className="text-center font-sans text-xs uppercase tracking-widest text-marrom-claro">
        Pergunta {passo + 1} de {QUIZ_PERGUNTAS.length}
      </p>
      <h2 className="text-center font-script text-2xl text-dourado">{pergunta.texto}</h2>

      {!supabase && (
        <p className="text-center font-sans text-sm text-marrom-claro">
          Quiz indisponível no momento.
        </p>
      )}

      <div className="space-y-3">
        {pergunta.opcoes.map((opcao) => {
          const votos = estado?.contagens[opcao.id] ?? 0;
          const pct = totalVotos > 0 ? Math.round((votos / totalVotos) * 100) : 0;
          const escolhida = estado?.escolha === opcao.id;
          const mostrarResultado = Boolean(estado?.escolha);

          return (
            <button
              key={opcao.id}
              type="button"
              disabled={!supabase || mostrarResultado}
              onClick={() => votar(opcao.id)}
              className={`relative min-h-11 w-full overflow-hidden rounded-2xl border-2 px-4 py-3 text-left font-sans text-sm font-semibold transition-colors ${
                escolhida
                  ? "border-verde-escuro text-verde-escuro"
                  : "border-linha text-marrom-cacau"
              }`}
            >
              {mostrarResultado && (
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="absolute inset-y-0 left-0 bg-verde-salvia/25"
                />
              )}
              <span className="relative flex items-center justify-between">
                <span>{opcao.label}</span>
                {mostrarResultado && <span>{pct}%</span>}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => (passo === 0 ? onBack() : setPasso((p) => p - 1))}
          className="min-h-11 px-2 font-sans text-sm text-marrom-claro underline underline-offset-4"
        >
          ‹ Voltar
        </button>
        <Button variant="primary" onClick={() => setPasso((p) => p + 1)}>
          {passo === QUIZ_PERGUNTAS.length - 1 ? "Ver resumo" : "Próxima →"}
        </Button>
      </div>
    </div>
  );
}
