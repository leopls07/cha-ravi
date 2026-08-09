import { ImageResponse } from "next/og";
import { EVENTO } from "@/lib/event";

export const runtime = "nodejs";
export const alt = `${EVENTO.titulo}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#FAF5EC",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 24,
            position: "absolute",
            top: 70,
          }}
        >
          {["#A3B18A", "#E4CDA7", "#6E4B32", "#D9C089", "#A3B18A"].map((color, i) => (
            <div
              key={i}
              style={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                background: color,
              }}
            />
          ))}
        </div>

        <div style={{ display: "flex", fontSize: 34, color: "#B8963F", marginTop: 40 }}>
          Chá de Fraldas
        </div>
        <div style={{ display: "flex", fontSize: 96, color: "#6B7F5E", fontWeight: 700 }}>
          {EVENTO.bebe}
        </div>
        <div style={{ display: "flex", fontSize: 32, color: "#6E4B32", marginTop: 16 }}>
          {EVENTO.dataLabel} · {EVENTO.horaLabel} · {EVENTO.local}
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#A9835E", marginTop: 24 }}>
          ♥ Confirme sua presença ♥
        </div>
      </div>
    ),
    { ...size }
  );
}
