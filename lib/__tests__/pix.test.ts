import { describe, expect, it } from "vitest";
import { buildPixPayload, normalizarTexto } from "../pix";

describe("normalizarTexto", () => {
  it("remove acentos e converte para maiúsculas", () => {
    expect(normalizarTexto("Emilly Bento Szervinsks")).toBe("EMILLY BENTO SZERVINSKS");
    expect(normalizarTexto("brasília")).toBe("BRASILIA");
  });
});

describe("buildPixPayload", () => {
  it("gera um payload que começa com o formato EMV esperado", () => {
    const payload = buildPixPayload(75);
    expect(payload.startsWith("000201")).toBe(true);
    expect(payload).toContain("br.gov.bcb.pix");
  });

  it("codifica o valor R$ 75,00 corretamente no campo 54", () => {
    const payload = buildPixPayload(75);
    expect(payload).toContain("540575.00");
  });

  it("termina com um CRC16 de 4 dígitos hexadecimais válido", () => {
    const payload = buildPixPayload(150.5);
    const crc = payload.slice(-4);
    expect(crc).toMatch(/^[0-9A-F]{4}$/);
    expect(payload.slice(-8, -4)).toBe("6304");
  });

  it("mantém o comprimento declarado em cada campo TLV", () => {
    const payload = buildPixPayload(37.5);
    let i = 0;
    while (i < payload.length - 4) {
      const id = payload.slice(i, i + 2);
      const len = Number(payload.slice(i + 2, i + 4));
      const value = payload.slice(i + 4, i + 4 + len);
      expect(new TextEncoder().encode(value)).toHaveLength(len);
      i += 4 + len;
      if (id === "63") break;
    }
  });

  it("produz payloads diferentes para valores diferentes", () => {
    expect(buildPixPayload(10)).not.toBe(buildPixPayload(20));
  });
});
