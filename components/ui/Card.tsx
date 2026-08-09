import { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  tint?: "creme" | "salvia";
};

export function Card({ children, tint = "creme", className = "", ...props }: CardProps) {
  const bg = tint === "salvia" ? "bg-verde-salvia/10" : "bg-branco";
  return (
    <div
      className={`rounded-3xl border border-linha ${bg} p-5 shadow-sm shadow-marrom-cacau/5 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
