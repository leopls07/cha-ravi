// Filtro básico e pequeno — não pretende ser exaustivo, só evitar os casos mais óbvios.
const PALAVRAS_PROIBIDAS = [
  "porra",
  "merda",
  "caralho",
  "buceta",
  "puta",
  "viado",
  "arrombado",
  "cuzao",
  "cuzão",
];

export function contemPalavrao(texto: string): boolean {
  const normalizado = texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
  return PALAVRAS_PROIBIDAS.some((palavra) => normalizado.includes(palavra));
}
