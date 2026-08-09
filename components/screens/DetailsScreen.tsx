"use client";

import { CONTATOS, EVENTO } from "@/lib/event";
import {
  buildIcsContent,
  downloadIcs,
  googleCalendarUrl,
  googleMapsDirUrl,
  googleMapsSearchUrl,
} from "@/lib/calendar";
import { whatsappUrl } from "@/lib/whatsapp";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { ScreenFooter } from "../ui/ScreenFooter";
import { ScreenProps } from "./types";

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-xl text-dourado" aria-hidden="true">
        {icon}
      </span>
      <div>
        <p className="font-sans text-xs uppercase tracking-wide text-marrom-claro">{label}</p>
        <p className="font-display text-base text-marrom-cacau">{value}</p>
      </div>
    </div>
  );
}

export function DetailsScreen({ onNext, onBack }: ScreenProps) {
  function handleIcs() {
    // buildIcsContent existe para permitir testar o conteúdo do .ics isoladamente
    void buildIcsContent();
    downloadIcs();
  }

  return (
    <div className="flex flex-col gap-4 px-6 pb-4 pt-6">
      <h2 className="text-center font-script text-3xl text-dourado">Detalhes</h2>

      <Card className="space-y-4">
        <InfoRow icon="📅" label="Data" value={EVENTO.dataLabel} />
        <InfoRow icon="🕐" label="Hora" value={EVENTO.horaLabel} />
        <InfoRow icon="📍" label="Local" value={`${EVENTO.local} — ${EVENTO.endereco}`} />
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="secondary"
          onClick={() => window.open(googleMapsSearchUrl(), "_blank", "noopener,noreferrer")}
        >
          Abrir no Maps
        </Button>
        <Button
          variant="secondary"
          onClick={() => window.open(googleMapsDirUrl(), "_blank", "noopener,noreferrer")}
        >
          Como chegar
        </Button>
        <Button
          variant="secondary"
          onClick={() => window.open(googleCalendarUrl(), "_blank", "noopener,noreferrer")}
        >
          Google Agenda
        </Button>
        <Button variant="secondary" onClick={handleIcs}>
          Baixar .ics
        </Button>
      </div>

      <Card>
        <p className="mb-3 font-display text-base font-semibold text-marrom-cacau">
          Fale com a gente
        </p>
        <div className="space-y-3">
          {CONTATOS.map((contato) => (
            <div key={contato.nome} className="flex items-center justify-between gap-3">
              <div>
                <p className="font-sans text-sm font-semibold text-marrom-cacau">
                  {contato.nome}
                </p>
                <p className="font-sans text-xs text-marrom-claro">{contato.papel}</p>
              </div>
              <a
                href={whatsappUrl(contato.whatsapp, `Olá! Tenho uma dúvida sobre o ${EVENTO.titulo}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 min-w-11 items-center justify-center rounded-full bg-verde-salvia/20 px-3 font-sans text-sm font-semibold text-verde-escuro"
                aria-label={`Falar com ${contato.nome} no WhatsApp`}
              >
                WhatsApp
              </a>
            </div>
          ))}
        </div>
      </Card>

      <ScreenFooter onBack={onBack} onNext={onNext} nextLabel="Confirmar presença →" />
    </div>
  );
}
