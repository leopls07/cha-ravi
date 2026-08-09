export type ScreenId =
  | "envelope"
  | "capa"
  | "detalhes"
  | "rsvp"
  | "presentes"
  | "pix"
  | "mural"
  | "quiz";

export const SCREEN_ORDER: ScreenId[] = [
  "envelope",
  "capa",
  "detalhes",
  "rsvp",
  "presentes",
  "pix",
  "mural",
  "quiz",
];

export const SCREEN_HASH: Record<ScreenId, string> = {
  envelope: "envelope",
  capa: "capa",
  detalhes: "detalhes",
  rsvp: "confirmar",
  presentes: "presentes",
  pix: "pix",
  mural: "recados",
  quiz: "quiz",
};

export const HASH_TO_SCREEN: Record<string, ScreenId> = Object.fromEntries(
  SCREEN_ORDER.map((id) => [SCREEN_HASH[id], id])
);

export function screenIdFromHash(hash: string): ScreenId | null {
  const clean = hash.replace(/^#/, "");
  return HASH_TO_SCREEN[clean] ?? null;
}
