export function tempoRelativo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMin = Math.round(diffMs / 60000);

  if (diffMin < 1) return "agora mesmo";
  if (diffMin < 60) return `há ${diffMin} min`;

  const diffHoras = Math.round(diffMin / 60);
  if (diffHoras < 24) return `há ${diffHoras} hora${diffHoras > 1 ? "s" : ""}`;

  const diffDias = Math.round(diffHoras / 24);
  return `há ${diffDias} dia${diffDias > 1 ? "s" : ""}`;
}

// Rotação estável (-3° a 3°) derivada do id, para o estilo "bilhetinho".
export function rotacaoEstavel(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  return (Math.abs(hash) % 601) / 100 - 3;
}
