"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import QRCode from "qrcode";
import {
  CONTATOS,
  EVENTO,
  PACOTES_ATALHO,
  PACOTES_MAX,
  PACOTES_MIN,
  PIX,
  mensagemPacotes,
} from "@/lib/event";
import { buildPixPayload } from "@/lib/pix";
import { copyToClipboard } from "@/lib/clipboard";
import { whatsappUrl } from "@/lib/whatsapp";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Chip } from "../ui/Chip";
import { ScreenFooter } from "../ui/ScreenFooter";
import { DiaperCake } from "../illustrations/DiaperCake";
import { DiaperIcon } from "../illustrations/DiaperIcon";
import { PixScreenProps } from "./types";

function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function PixScreen({ onNext, onBack, valorInicial }: PixScreenProps) {
  const [modo, setModo] = useState<"pacotes" | "livre">(valorInicial ? "livre" : "pacotes");
  const [qtdPacotes, setQtdPacotes] = useState(1);
  const [valorLivreCentavos, setValorLivreCentavos] = useState(
    valorInicial ? Math.round(valorInicial * 100) : 0
  );
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [chaveCopiada, setChaveCopiada] = useState(false);
  const [nomeDoador, setNomeDoador] = useState("");

  const total =
    modo === "pacotes" ? qtdPacotes * PIX.valorPacoteFralda : valorLivreCentavos / 100;

  const payload = total > 0 ? buildPixPayload(total) : null;

  useEffect(() => {
    if (!payload) return;
    let ativo = true;
    QRCode.toDataURL(payload, {
      width: 240,
      margin: 2,
      color: { dark: "#6B7F5E", light: "#FFFFFF" },
    }).then((url) => {
      if (ativo) setQrDataUrl(url);
    });
    return () => {
      ativo = false;
    };
  }, [payload]);

  async function handleCopiarChave() {
    const ok = await copyToClipboard(PIX.chaveExibicao);
    if (ok) {
      setChaveCopiada(true);
      setTimeout(() => setChaveCopiada(false), 2500);
    }
  }

  async function handleCopiarPayload() {
    if (!payload) return;
    const ok = await copyToClipboard(payload);
    if (ok) {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    }
  }

  async function handleCompartilhar() {
    if (!payload) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: EVENTO.titulo,
          text: `Pix para o ${EVENTO.titulo}: ${payload}`,
        });
      } catch {
        // usuário cancelou o compartilhamento
      }
    } else {
      handleCopiarPayload();
    }
  }

  function handleValorLivreChange(raw: string) {
    const digits = raw.replace(/\D/g, "");
    setValorLivreCentavos(Number(digits || "0"));
  }

  const mensagemWhatsapp = `Oi! Acabei de fazer um Pix de ${formatBRL(total)} para o ${EVENTO.titulo}. Sou ${nomeDoador || "eu"}. 💛`;

  return (
    <div className="flex flex-col gap-4 px-6 pb-4 pt-6">
      <h2 className="text-center font-script text-3xl text-dourado">Pix</h2>
      <p className="text-center font-sans text-sm text-marrom-cacau">
        Se você mora longe ou preferir, pode contribuir com o valor das fraldas por Pix. Sem
        nenhuma obrigação — sua presença já é o maior presente.
      </p>

      <Card>
        <p className="mb-2 font-sans text-xs uppercase tracking-wide text-marrom-claro">
          Chave Pix
        </p>
        <p className="font-display text-lg text-marrom-cacau">{PIX.chaveExibicao}</p>
        <p className="mb-3 font-sans text-xs text-marrom-claro">{PIX.nome}</p>
        <Button variant="secondary" onClick={handleCopiarChave}>
          {chaveCopiada ? "Chave copiada! ✓" : "Copiar chave"}
        </Button>
      </Card>

      <Card>
        <div className="mb-3 flex justify-center gap-2">
          <button
            type="button"
            onClick={() => setModo("pacotes")}
            className={`min-h-11 rounded-full px-4 py-2 font-sans text-sm font-semibold ${
              modo === "pacotes" ? "bg-verde-escuro text-white" : "border border-linha text-marrom-cacau"
            }`}
          >
            Pacotes de fralda
          </button>
          <button
            type="button"
            onClick={() => setModo("livre")}
            className={`min-h-11 rounded-full px-4 py-2 font-sans text-sm font-semibold ${
              modo === "livre" ? "bg-verde-escuro text-white" : "border border-linha text-marrom-cacau"
            }`}
          >
            Outro valor
          </button>
        </div>

        {modo === "pacotes" ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                aria-label="Diminuir pacotes"
                disabled={qtdPacotes <= PACOTES_MIN}
                onClick={() => setQtdPacotes((q) => Math.max(PACOTES_MIN, q - 1))}
                className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-linha text-xl font-bold text-verde-escuro disabled:opacity-30"
              >
                −
              </button>
              <span className="w-16 text-center font-display text-3xl font-semibold text-marrom-cacau tabular-nums">
                {qtdPacotes}
              </span>
              <button
                type="button"
                aria-label="Aumentar pacotes"
                disabled={qtdPacotes >= PACOTES_MAX}
                onClick={() => setQtdPacotes((q) => Math.min(PACOTES_MAX, q + 1))}
                className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-linha text-xl font-bold text-verde-escuro disabled:opacity-30"
              >
                +
              </button>
            </div>

            <input
              type="range"
              min={PACOTES_MIN}
              max={PACOTES_MAX}
              value={qtdPacotes}
              onChange={(e) => setQtdPacotes(Number(e.target.value))}
              className="w-full accent-[#6B7F5E]"
              aria-label="Quantidade de pacotes de fralda"
            />

            <div className="flex flex-wrap justify-center gap-2">
              {PACOTES_ATALHO.map((n) => (
                <Chip key={n} selected={qtdPacotes === n} onClick={() => setQtdPacotes(n)}>
                  {n}
                </Chip>
              ))}
            </div>

            <div className="flex min-h-14 flex-wrap items-end justify-center gap-1" aria-hidden="true">
              <AnimatePresence initial={false}>
                {Array.from({ length: qtdPacotes }).map((_, i) => (
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

            <p className="text-center font-sans text-sm font-medium text-marrom-cacau">
              {mensagemPacotes(qtdPacotes)}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <label htmlFor="pix-valor-livre" className="block text-center font-sans text-sm text-marrom-cacau">
              Escolha o valor
            </label>
            <input
              id="pix-valor-livre"
              inputMode="numeric"
              value={formatBRL(valorLivreCentavos / 100)}
              onChange={(e) => handleValorLivreChange(e.target.value)}
              className="w-full rounded-xl border border-linha bg-creme px-4 py-3 text-center font-display text-2xl text-marrom-cacau outline-none focus:border-dourado"
            />
          </div>
        )}

        <motion.p
          key={total}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center font-display text-4xl font-bold text-dourado"
        >
          {formatBRL(total)}
        </motion.p>
      </Card>

      {payload && (
        <Card>
          <div className="flex flex-col items-center gap-3">
            <DiaperCake className="h-16 w-16" />
            {qrDataUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrDataUrl}
                alt="QR Code Pix para contribuição do Chá de Fraldas do Ravi"
                className="h-56 w-56 rounded-2xl border border-linha bg-white p-2"
              />
            )}
            <p className="font-sans text-xs uppercase tracking-wide text-marrom-claro">
              Pix copia e cola
            </p>
            <p className="w-full break-all rounded-xl bg-creme p-2 text-center font-mono text-[10px] text-marrom-cacau">
              {payload}
            </p>
            <div className="flex w-full flex-col gap-2">
              <Button variant="primary" fullWidth onClick={handleCopiarPayload}>
                {copiado ? "Código copiado! Cole no app do seu banco ✓" : "Copiar código Pix"}
              </Button>
              <Button variant="secondary" fullWidth onClick={handleCompartilhar}>
                Compartilhar
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Card tint="salvia">
        <label htmlFor="pix-nome-doador" className="mb-1 block font-sans text-sm font-semibold text-marrom-cacau">
          Seu nome (para avisarmos que recebemos)
        </label>
        <input
          id="pix-nome-doador"
          value={nomeDoador}
          onChange={(e) => setNomeDoador(e.target.value)}
          placeholder="Seu nome"
          className="mb-3 min-h-11 w-full rounded-xl border border-linha bg-branco px-4 py-2 font-sans text-marrom-cacau outline-none focus:border-dourado"
        />
        <Button
          variant="primary"
          fullWidth
          onClick={() =>
            window.open(
              whatsappUrl(CONTATOS[0].whatsapp, mensagemWhatsapp),
              "_blank",
              "noopener,noreferrer"
            )
          }
        >
          Já fiz o Pix 💛
        </Button>
      </Card>

      <ScreenFooter onBack={onBack} onNext={onNext} nextLabel="Deixar um recado →" />
    </div>
  );
}
