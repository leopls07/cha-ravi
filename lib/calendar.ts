import { EVENTO } from "./event";

const DURACAO_HORAS = 4;

function toIcsUtc(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function getInicioFim(): { inicio: Date; fim: Date } {
  const inicio = new Date(EVENTO.data);
  const fim = new Date(inicio.getTime() + DURACAO_HORAS * 60 * 60 * 1000);
  return { inicio, fim };
}

export function googleCalendarUrl(): string {
  const { inicio, fim } = getInicioFim();
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: EVENTO.titulo,
    dates: `${toIcsUtc(inicio)}/${toIcsUtc(fim)}`,
    location: `${EVENTO.local}, ${EVENTO.endereco}`,
    details: `Venha celebrar a chegada do ${EVENTO.bebe}! 💛`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function buildIcsContent(): string {
  const { inicio, fim } = getInicioFim();
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Cha de Fraldas do Ravi//PT-BR",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:cha-fraldas-ravi-${inicio.getTime()}@convite`,
    `DTSTAMP:${toIcsUtc(new Date())}`,
    `DTSTART:${toIcsUtc(inicio)}`,
    `DTEND:${toIcsUtc(fim)}`,
    `SUMMARY:${EVENTO.titulo}`,
    `DESCRIPTION:Venha celebrar a chegada do ${EVENTO.bebe}! 💛`,
    `LOCATION:${EVENTO.local}, ${EVENTO.endereco}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}

export function downloadIcs(): void {
  const blob = new Blob([buildIcsContent()], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "cha-de-fraldas-do-ravi.ics";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function googleMapsSearchUrl(): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(EVENTO.mapsQuery)}`;
}

export function googleMapsDirUrl(): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(EVENTO.mapsQuery)}`;
}
