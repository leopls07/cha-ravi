import type { Metadata, Viewport } from "next";
import { Fraunces, Parisienne, Quicksand } from "next/font/google";
import { EVENTO } from "@/lib/event";
import "./globals.css";

const parisienne = Parisienne({
  variable: "--font-parisienne",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${EVENTO.titulo} 💛`,
  description: `${EVENTO.dataCurta} às ${EVENTO.horaLabel} — ${EVENTO.local}. Confirme sua presença!`,
  manifest: "/manifest.json",
  openGraph: {
    title: `${EVENTO.titulo} 💛`,
    description: `${EVENTO.dataCurta} às ${EVENTO.horaLabel} — ${EVENTO.local}. Confirme sua presença!`,
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${EVENTO.titulo} 💛`,
    description: `${EVENTO.dataCurta} às ${EVENTO.horaLabel} — ${EVENTO.local}. Confirme sua presença!`,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#faf5ec",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${parisienne.variable} ${fraunces.variable} ${quicksand.variable} h-full antialiased`}
    >
      <body className="flex h-dvh w-full items-center justify-center bg-creme sm:p-6">
        <div className="relative flex h-dvh w-full max-w-[420px] flex-col overflow-hidden bg-creme sm:h-[min(880px,92dvh)] sm:rounded-[2.5rem] sm:border sm:border-linha sm:shadow-2xl">
          {children}
        </div>
      </body>
    </html>
  );
}
