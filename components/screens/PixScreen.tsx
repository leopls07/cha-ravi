"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import QRCode from "qrcode";
import { CONTATOS, EVENTO, PIX } from "@/lib/event";
import { buildPixPayload } from "@/lib/pix";
import { copyToClipboard } from "@/lib/clipboard";
import { whatsappUrl } from "@/lib/whatsapp";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { ScreenFooter } from "../ui/ScreenFooter";
import { DiaperCake } from "../illustrations/DiaperCake";
import { PixScreenProps } from "./types";

function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function PixScreen({ onNext, onBack, valorInicial }: PixScreenProps) {
  const [valorCentavos, setValorCentavos] = useState(
    Math.round((valorInicial ?? PIX.valorPacoteFralda) * 100)
  );
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [chaveCopiada, setChaveCopiada] = useState(false);
  const [nomeDoador, setNomeDoador] = useState("");

  const total = valorCentavos / 100;
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

  function handleValorChange(raw: string) {
    const digits = raw.replace(/\D/g, "");
    setValorCentavos(Number(digits || "0"));
  }

  const mensagemWhatsapp = `Oi! Acabei de fazer um Pix de ${formatBRL(total)} para o ${EVENTO.titulo}. Sou ${nomeDoador || "eu"}. 💛`;

  return (
    <div className="flex flex-col gap-4 px-6 pb-4 pt-6">
      <h2 className="text-center font-script text-3xl text-dourado">Pix</h2>
      <p className="text-center font-sans text-sm text-marrom-cacau">
        Se você não puder estar presente nesse dia, mas quiser me mandar um carinho mesmo de
        longe, essa é uma forma bem fácil: 💙
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
        <label
          htmlFor="pix-valor"
          className="mb-2 block text-center font-sans text-sm text-marrom-cacau"
        >
          Valor da contribuição
        </label>
        <input
          id="pix-valor"
          inputMode="numeric"
          value={formatBRL(valorCentavos / 100)}
          onChange={(e) => handleValorChange(e.target.value)}
          className="w-full rounded-xl border border-linha bg-creme px-4 py-3 text-center font-display text-2xl text-marrom-cacau outline-none focus:border-dourado"
        />

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
        <label
          htmlFor="pix-nome-doador"
          className="mb-1 block font-sans text-sm font-semibold text-marrom-cacau"
        >
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
