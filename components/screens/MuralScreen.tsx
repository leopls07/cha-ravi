"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase, type Recado } from "@/lib/supabase";
import { contemPalavrao } from "@/lib/profanityFilter";
import { rotacaoEstavel, tempoRelativo } from "@/lib/relativeTime";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { ScreenFooter } from "../ui/ScreenFooter";
import { ScreenProps } from "./types";

const MENSAGEM_MAX = 280;
const RATE_LIMIT_MS = 30_000;
const RATE_LIMIT_KEY = "cha-ravi:ultimo-recado";
const PAGE_SIZE = 20;

export function MuralScreen({ onNext, onBack }: ScreenProps) {
  const [recados, setRecados] = useState<Recado[]>([]);
  const [carregando, setCarregando] = useState(() => Boolean(supabase));
  const [temMais, setTemMais] = useState(true);
  const [nome, setNome] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const client = supabase;
    if (!client) return;

    let ativo = true;
    client
      .from("recados")
      .select("*")
      .order("created_at", { ascending: false })
      .range(0, PAGE_SIZE - 1)
      .then(({ data }) => {
        if (!ativo) return;
        setRecados(data ?? []);
        setTemMais((data?.length ?? 0) === PAGE_SIZE);
        setCarregando(false);
      });

    const canal = client
      .channel("recados-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "recados" },
        (payload) => {
          const novo = payload.new as Recado;
          setRecados((atuais) =>
            atuais.some((r) => r.id === novo.id) ? atuais : [novo, ...atuais]
          );
        }
      )
      .subscribe();

    return () => {
      ativo = false;
      client.removeChannel(canal);
    };
  }, []);

  async function carregarMais() {
    if (!supabase) return;
    const { data } = await supabase
      .from("recados")
      .select("*")
      .order("created_at", { ascending: false })
      .range(recados.length, recados.length + PAGE_SIZE - 1);
    setRecados((atuais) => [...atuais, ...(data ?? [])]);
    setTemMais((data?.length ?? 0) === PAGE_SIZE);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro(null);

    if (honeypot) return; // bot detectado, falha silenciosamente

    const nomeLimpo = nome.trim();
    const mensagemLimpa = mensagem.trim();
    if (!nomeLimpo || !mensagemLimpa) {
      setErro("Preencha seu nome e uma mensagem.");
      return;
    }
    if (contemPalavrao(nomeLimpo) || contemPalavrao(mensagemLimpa)) {
      setErro("Vamos manter o clima fofo por aqui 💛 revise sua mensagem.");
      return;
    }

    const ultimo = Number(window.localStorage.getItem(RATE_LIMIT_KEY) ?? 0);
    if (Date.now() - ultimo < RATE_LIMIT_MS) {
      setErro("Você já deixou um recado agora há pouco. Aguarde um instante :)");
      return;
    }

    if (!supabase) {
      setErro("Mural indisponível no momento.");
      return;
    }

    setEnviando(true);
    const otimista: Recado = {
      id: `local-${Date.now()}`,
      nome: nomeLimpo,
      mensagem: mensagemLimpa,
      created_at: new Date().toISOString(),
    };
    setRecados((atuais) => [otimista, ...atuais]);

    const { error } = await supabase
      .from("recados")
      .insert({ nome: nomeLimpo, mensagem: mensagemLimpa });

    setEnviando(false);

    if (error) {
      setRecados((atuais) => atuais.filter((r) => r.id !== otimista.id));
      setErro("Não foi possível enviar seu recado agora. Tente novamente.");
      return;
    }

    window.localStorage.setItem(RATE_LIMIT_KEY, String(Date.now()));
    setNome("");
    setMensagem("");
  }

  return (
    <div className="flex flex-col gap-4 px-6 pb-4 pt-6">
      <h2 className="text-center font-script text-3xl text-dourado">Mural de recados</h2>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Seu nome"
            className="min-h-11 w-full rounded-xl border border-linha bg-creme px-4 py-2 font-sans text-marrom-cacau outline-none focus:border-dourado"
          />
          <div>
            <textarea
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value.slice(0, MENSAGEM_MAX))}
              placeholder="Deixe um recado carinhoso para a família"
              rows={3}
              className="w-full rounded-xl border border-linha bg-creme px-4 py-2 font-sans text-marrom-cacau outline-none focus:border-dourado"
            />
            <p className="text-right font-sans text-xs text-marrom-claro">
              {mensagem.length}/{MENSAGEM_MAX}
            </p>
          </div>
          <input
            type="text"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />
          {erro && <p className="font-sans text-xs text-red-600">{erro}</p>}
          <Button type="submit" variant="primary" fullWidth disabled={enviando}>
            Deixar recado
          </Button>
        </form>
      </Card>

      <div className="space-y-3">
        {carregando && (
          <p className="text-center font-sans text-sm text-marrom-claro">Carregando recados…</p>
        )}
        {!carregando && !supabase && (
          <p className="text-center font-sans text-sm text-marrom-claro">
            Mural indisponível no momento.
          </p>
        )}
        {!carregando && supabase && recados.length === 0 && (
          <p className="text-center font-sans text-sm text-marrom-claro">
            Seja a primeira pessoa a deixar um recado 💛
          </p>
        )}
        {recados.map((recado, i) => (
          <div
            key={recado.id}
            style={{ transform: `rotate(${rotacaoEstavel(recado.id)}deg)` }}
            className={`rounded-2xl border p-4 shadow-sm ${
              i % 2 === 0
                ? "border-dourado-claro bg-creme"
                : "border-verde-salvia/40 bg-verde-salvia/10"
            }`}
          >
            <p className="font-sans text-sm text-marrom-cacau">{recado.mensagem}</p>
            <p className="mt-2 font-sans text-xs font-semibold text-marrom-claro">
              {recado.nome} · {tempoRelativo(recado.created_at)}
            </p>
          </div>
        ))}
        {!carregando && temMais && recados.length > 0 && (
          <Button variant="secondary" fullWidth onClick={carregarMais}>
            Ver mais
          </Button>
        )}
      </div>

      <ScreenFooter onBack={onBack} onNext={onNext} nextLabel="Responder quiz →" />
    </div>
  );
}
