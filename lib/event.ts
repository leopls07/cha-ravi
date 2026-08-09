// Todos os dados do evento centralizados aqui.
// Editar este arquivo é suficiente para atualizar textos, valores e contatos do site.

export const EVENTO = {
  bebe: "Ravi",
  titulo: "Chá de Fraldas do Ravi",
  // TODO: confirmar data e horário definitivos com a família
  data: "2026-09-05T12:00:00-03:00", // Sábado, 05 de setembro de 2026
  dataLabel: "Sábado, 05 de setembro de 2026",
  dataCurta: "05/09/2026",
  horaLabel: "12h",
  local: "CRESSPOM",
  endereco:
    "Setor de Clubes Recreativos e Esportivos Norte, Trecho 3, Conjunto 11/14 — Brasília/DF",
  mapsQuery: "CRESSPOM Setor de Clubes Norte Trecho 3 Conjunto 11/14 Brasilia DF",
  frase: "Nosso pequeno grande amor",
};

// TEMP: números trocados por 11961707443 só para testes — reverter para os
// números reais (5561999790968 / 5561983046539) antes de publicar.
export const CONTATOS = [
  {
    nome: "Emilly Bento Szervinsks",
    papel: "Mamãe do Ravi",
    whatsapp: "5511961707443",
  },
  {
    nome: "Organização",
    papel: "Dúvidas sobre o chá",
    whatsapp: "5511961707443",
  },
  // TODO: confirmar/ajustar nomes e números antes de publicar
];

// Número que recebe as confirmações de presença (RSVP) via WhatsApp
// TEMP: número de teste — reverter para 5561983046539 antes de publicar.
export const WHATSAPP_RSVP = "5511961707443";

// TEMP: chave Pix de teste — reverter para "+5561999790968" / "EMILLY BENTO SZERVINSKS" antes de publicar.
export const PIX = {
  chave: "+5511961707443", // chave = celular
  chaveExibicao: "+55 11 96170-7443",
  nome: "EMILLY BENTO SZERVINSKS", // máx 25 chars, sem acento, MAIÚSCULO
  cidade: "BRASILIA", // TODO: confirmar cidade cadastrada na conta Pix — máx 15 chars, sem acento, MAIÚSCULO
  valorPacoteFralda: 75.0,
};

export type TamanhoFralda = "P" | "M" | "G" | "GG" | "Ainda não sei";

export const TAMANHOS_FRALDA: TamanhoFralda[] = ["P", "M", "G", "GG", "Ainda não sei"];

export type OutroPresente = {
  id: string;
  nome: string;
  valor: number;
};

// TODO: confirmar valores reais antes de publicar
export const OUTROS_PRESENTES: OutroPresente[] = [
  { id: "kit-banho", nome: "Kit banho completo", valor: 120.0 },
  { id: "kit-higiene", nome: "Kit higiene (pomada, lenços, sabonete)", valor: 90.0 },
  { id: "body", nome: "Body / macacão", valor: 80.0 },
  { id: "manta", nome: "Manta / cueiro", valor: 70.0 },
  { id: "brinquedo", nome: "Brinquedo (mordedor, chocalho)", valor: 50.0 },
  { id: "fralda-pano", nome: "Fralda de pano (pacote)", valor: 60.0 },
];

export const FRALDAS_SUGERIDAS = [
  "Pampers Premium Care",
  "Pampers Confort Sec",
  "Huggies Supreme Care",
];

export const TAMANHOS_FRALDA_SUGERIDOS = ["M", "G"];

export const MIMOS_SUGERIDOS = [
  "Fraldas de pano",
  "Toalha de banho",
  "Roupinhas",
  "Cueiro",
  "Lenço umedecido",
  "Pomada de assadura",
  "Sabonete líquido",
  "Shampoo",
  "Colônia",
  "Mordedor",
  "Chocalho",
];

export const PACOTES_ATALHO = [1, 2, 3, 5, 10];
export const PACOTES_MIN = 1;
export const PACOTES_MAX = 20;

export function mensagemPacotes(qtd: number): string {
  if (qtd <= 1) return "Um pacote já salva um dia inteiro! 🍼";
  if (qtd <= 3) return "O bumbum do Ravi agradece 💛";
  if (qtd <= 6) return "Uau, isso é quase uma semana de tranquilidade!";
  if (qtd <= 10) return "Você é oficialmente padrinho(a) das madrugadas 🌙";
  return "Calma, você vai zerar o estoque da farmácia! 🧸";
}
