export type QuizOpcao = { id: string; label: string };
export type QuizPergunta = { id: string; texto: string; opcoes: QuizOpcao[] };

export const QUIZ_PERGUNTAS: QuizPergunta[] = [
  {
    id: "parecido",
    texto: "Vai puxar mais o papai ou a mamãe?",
    opcoes: [
      { id: "papai", label: "Papai" },
      { id: "mamae", label: "Mamãe" },
      { id: "os-dois", label: "Um pouco dos dois" },
    ],
  },
  {
    id: "peso",
    texto: "Quantos quilos o Ravi vai nascer?",
    opcoes: [
      { id: "menos-25", label: "< 2,5kg" },
      { id: "25-3", label: "2,5–3kg" },
      { id: "3-35", label: "3–3,5kg" },
      { id: "35-4", label: "3,5–4kg" },
      { id: "mais-4", label: "> 4kg" },
    ],
  },
  {
    id: "data-nascimento",
    texto: "Vai nascer antes, no dia certo ou depois da data prevista?",
    opcoes: [
      { id: "antes", label: "Antes" },
      { id: "no-dia", label: "No dia certo" },
      { id: "depois", label: "Depois" },
    ],
  },
  {
    id: "fraldas-dia",
    texto: "Quantas fraldas por dia nas primeiras semanas?",
    opcoes: [
      { id: "4", label: "4" },
      { id: "6", label: "6" },
      { id: "8", label: "8" },
      { id: "10+", label: "10+" },
    ],
  },
  {
    id: "personalidade",
    texto: "Ravi vai ser:",
    opcoes: [
      { id: "dorminhoco", label: "Dorminhoco 😴" },
      { id: "agitado", label: "Agitado 🏃" },
      { id: "chorao", label: "Chorão 😭" },
      { id: "comilao", label: "Comilão 🍼" },
    ],
  },
  {
    id: "olhos",
    texto: "Cor dos olhos:",
    opcoes: [
      { id: "castanho", label: "Castanho" },
      { id: "verde", label: "Verde" },
      { id: "azul", label: "Azul" },
    ],
  },
];
