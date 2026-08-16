"use client";

import { useState } from "react";
import { EVENTO, TAMANHOS_FRALDA, TamanhoFralda, WHATSAPP_RSVP } from "@/lib/event";
import { whatsappUrl } from "@/lib/whatsapp";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Chip } from "../ui/Chip";
import { Stepper } from "../ui/Stepper";
import { Confetti } from "../ui/Confetti";
import { ScreenFooter } from "../ui/ScreenFooter";
import { ScreenProps } from "./types";

type RsvpData = {
  nome: string;
  comparecer: boolean;
  acompanhantes: number;
  tamanho?: TamanhoFralda;
  recado?: string;
  enviadoEm: string;
};

function montarMensagem(data: RsvpData): string {
  if (!data.comparecer) {
    return `Olá! ${data.nome} não poderá comparecer ao ${EVENTO.titulo}, mas está mandando todo o carinho 💛`;
  }
  const linhas = [
    `Olá! ${data.nome} confirmou presença no ${EVENTO.titulo} 💙`,
    `📅 ${EVENTO.dataCurta} às ${EVENTO.horaLabel} — ${EVENTO.local}`,
    `👥 Acompanhantes: ${data.acompanhantes}`,
  ];
  if (data.tamanho) linhas.push(`🍼 Vai levar fralda tamanho: ${data.tamanho}`);
  if (data.recado) linhas.push(`💬 ${data.recado}`);
  return linhas.join("\n");
}

export function RsvpScreen({ onNext, onBack, goTo }: ScreenProps) {
  const [stored, setStored] = useLocalStorage<RsvpData | null>("cha-ravi:rsvp", null);
  const [editing, setEditing] = useState(false);

  const [nome, setNome] = useState("");
  const [comparecer, setComparecer] = useState<boolean | null>(null);
  const [acompanhantes, setAcompanhantes] = useState(0);
  const [tamanho, setTamanho] = useState<TamanhoFralda | undefined>(undefined);
  const [recado, setRecado] = useState("");
  const [enviado, setEnviado] = useState(false);

  if (stored && !editing && !enviado) {
    return (
      <div className="flex flex-col gap-4 px-6 pb-4 pt-6 text-center">
        <h2 className="font-script text-3xl text-dourado">Presença confirmada</h2>
        <Card>
          <p className="font-display text-lg text-marrom-cacau">
            {stored.comparecer
              ? `Ahh, que alegria, ${stored.nome}! Já estou ansioso para esse encontro! 💙👶`
              : `Poxa, vou sentir sua falta, ${stored.nome}... Mas tudo bem! Quando eu chegar, a mamãe manda fotos! 🥺💙`}
          </p>
        </Card>
        <Button
          variant="secondary"
          onClick={() => {
            setNome(stored.nome);
            setComparecer(stored.comparecer);
            setAcompanhantes(stored.acompanhantes);
            setTamanho(stored.tamanho);
            setRecado(stored.recado ?? "");
            setEditing(true);
            setEnviado(false);
          }}
        >
          Alterar resposta
        </Button>
        <ScreenFooter onBack={onBack} onNext={onNext} nextLabel="Ver sugestões de presente →" />
      </div>
    );
  }

  function handleEscolha(vaiComparecer: boolean) {
    setComparecer(vaiComparecer);
  }

  function handleConfirmar() {
    if (!nome.trim() || comparecer === null) return;
    const data: RsvpData = {
      nome: nome.trim(),
      comparecer,
      acompanhantes,
      tamanho,
      recado: recado.trim() || undefined,
      enviadoEm: new Date().toISOString(),
    };
    setStored(data);
    setEditing(false);
    setEnviado(true);
  }

  const podeConfirmar = nome.trim().length > 0 && comparecer !== null;

  if (stored && enviado) {
    const mensagem = montarMensagem(stored);
    return (
      <div className="relative flex flex-col gap-4 px-6 pb-4 pt-6 text-center">
        {stored.comparecer && <Confetti />}
        <h2 className="font-script text-3xl text-dourado">
          {stored.comparecer ? "Presença confirmada!" : "Obrigado por avisar"}
        </h2>
        <Card>
          <p className="font-display text-lg font-semibold text-marrom-cacau">
            {stored.comparecer
              ? `Ahh, que alegria, ${stored.nome}! Já estou ansioso para esse encontro! 💙👶`
              : `Poxa, vou sentir sua falta, ${stored.nome}... Mas tudo bem! Quando eu chegar, a mamãe manda fotos! 🥺💙`}
          </p>
        </Card>

        <Button
          variant="primary"
          onClick={() =>
            window.open(
              whatsappUrl(WHATSAPP_RSVP, mensagem),
              "_blank",
              "noopener,noreferrer"
            )
          }
        >
          Avisar no WhatsApp
        </Button>

        <p className="rounded-2xl bg-dourado-claro/20 p-3 font-sans text-xs text-marrom-cacau">
          ⚠️ Sua confirmação só chega até nós quando você toca no botão e envia a mensagem no
          WhatsApp.
        </p>

        {!stored.comparecer && (
          <Card tint="salvia">
            <p className="mb-3 font-sans text-sm text-marrom-cacau">
              Se quiser, ainda dá pra mandar um carinho de longe
            </p>
            <Button variant="secondary" onClick={() => goTo("pix")}>
              Ver Pix 💛
            </Button>
          </Card>
        )}

        <ScreenFooter onBack={onBack} onNext={onNext} nextLabel="Ver sugestões de presente →" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-6 pb-4 pt-6">
      <h2 className="text-center font-script text-3xl text-dourado">Confirmar presença</h2>
      <p className="text-center font-sans text-sm text-marrom-cacau">
        Meus pais ficariam muito felizes em saber se você vem comemorar comigo! Confirma pra mim?
      </p>

      <Card className="space-y-4">
        <div>
          <label htmlFor="rsvp-nome" className="mb-1 block font-sans text-sm font-semibold text-marrom-cacau">
            Seu nome
          </label>
          <input
            id="rsvp-nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Como podemos te chamar?"
            className="min-h-11 w-full rounded-xl border border-linha bg-creme px-4 py-2 font-sans text-marrom-cacau outline-none focus:border-dourado"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleEscolha(true)}
            className={`min-h-11 rounded-full px-4 py-3 font-sans text-sm font-semibold transition-colors ${
              comparecer === true
                ? "bg-gradient-to-r from-verde-salvia to-verde-escuro text-white"
                : "border-2 border-linha text-marrom-cacau"
            }`}
          >
            Vou comparecer 💚
          </button>
          <button
            type="button"
            onClick={() => handleEscolha(false)}
            className={`min-h-11 rounded-full px-4 py-3 font-sans text-sm font-semibold transition-colors ${
              comparecer === false
                ? "border-2 border-dourado bg-dourado-claro/30 text-marrom-cacau"
                : "border-2 border-linha text-marrom-cacau"
            }`}
          >
            Não poderei ir
          </button>
        </div>

        {comparecer === true && (
          <div className="space-y-4 border-t border-linha pt-4">
            <Stepper
              label="Acompanhantes"
              value={acompanhantes}
              min={0}
              max={6}
              onChange={setAcompanhantes}
            />

            <div>
              <p className="mb-2 font-sans text-sm font-semibold text-marrom-cacau">
                Vai levar fralda? Escolha o tamanho
              </p>
              <div className="flex flex-wrap gap-2">
                {TAMANHOS_FRALDA.map((t) => (
                  <Chip key={t} selected={tamanho === t} onClick={() => setTamanho(t)}>
                    {t}
                  </Chip>
                ))}
              </div>
              <p className="mt-2 font-sans text-xs text-marrom-claro">
                💡 o Ravi usa G por mais tempo que M — se puder escolher, o G ajuda ainda mais!
              </p>
            </div>

            <div>
              <label htmlFor="rsvp-recado" className="mb-1 block font-sans text-sm font-semibold text-marrom-cacau">
                Recado rápido (opcional)
              </label>
              <textarea
                id="rsvp-recado"
                value={recado}
                onChange={(e) => setRecado(e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-linha bg-creme px-4 py-2 font-sans text-marrom-cacau outline-none focus:border-dourado"
              />
            </div>
          </div>
        )}
      </Card>

      <Button variant="primary" fullWidth disabled={!podeConfirmar} onClick={handleConfirmar}>
        Confirmar
      </Button>

      <ScreenFooter onBack={onBack} />
    </div>
  );
}
