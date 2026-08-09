import { PIX } from "./event";

// Gerador de payload Pix (BR Code / EMV) — RFC-like implementação do Banco Central.

function crc16(str: string): string {
  let crc = 0xffff;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let b = 0; b < 8; b++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

// Comprimento em bytes (UTF-8), não em caracteres — necessário caso algum
// acento escape da normalização e vire multi-byte.
function byteLength(value: string): number {
  return new TextEncoder().encode(value).length;
}

const tlv = (id: string, value: string) =>
  id + String(byteLength(value)).padStart(2, "0") + value;

// Remove acentos e força maiúsculas, conforme exigido pelos campos 59/60 do BR Code.
export function normalizarTexto(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase();
}

export function buildPixPayload(amount: number): string {
  const nome = normalizarTexto(PIX.nome).slice(0, 25);
  const cidade = normalizarTexto(PIX.cidade).slice(0, 15);

  const merchant = tlv("26", tlv("00", "br.gov.bcb.pix") + tlv("01", PIX.chave));
  const payload =
    "000201" +
    merchant +
    tlv("52", "0000") +
    tlv("53", "986") +
    tlv("54", amount.toFixed(2)) +
    tlv("58", "BR") +
    tlv("59", nome) +
    tlv("60", cidade) +
    tlv("62", tlv("05", "CHAFRALDARAVI")) +
    "6304";
  return payload + crc16(payload);
}
