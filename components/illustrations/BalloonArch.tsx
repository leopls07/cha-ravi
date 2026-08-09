const BALLOES = [
  { cx: 40, cy: 60, r: 26, color: "var(--verde-salvia)" },
  { cx: 85, cy: 35, r: 22, color: "var(--bege)" },
  { cx: 130, cy: 55, r: 28, color: "var(--marrom-cacau)" },
  { cx: 175, cy: 30, r: 20, color: "var(--dourado-claro)" },
  { cx: 215, cy: 58, r: 25, color: "var(--verde-salvia)" },
  { cx: 260, cy: 32, r: 22, color: "var(--marrom-claro)" },
  { cx: 300, cy: 60, r: 26, color: "var(--bege)" },
];

type BalloonArchProps = {
  className?: string;
};

export function BalloonArch({ className = "" }: BalloonArchProps) {
  return (
    <svg
      viewBox="0 0 340 100"
      className={className}
      role="img"
      aria-label="Arco decorativo de balões"
    >
      {BALLOES.map((b, i) => (
        <g key={i}>
          <circle cx={b.cx} cy={b.cy} r={b.r} fill={b.color} />
          <ellipse
            cx={b.cx - b.r * 0.35}
            cy={b.cy - b.r * 0.35}
            rx={b.r * 0.22}
            ry={b.r * 0.14}
            fill="white"
            opacity={0.5}
          />
          {i % 2 === 0 && (
            <g fill="var(--dourado)" opacity={0.7}>
              <circle cx={b.cx + b.r + 6} cy={b.cy - 10} r={1.6} />
              <circle cx={b.cx + b.r + 12} cy={b.cy} r={1.2} />
              <circle cx={b.cx + b.r + 4} cy={b.cy + 10} r={1.4} />
            </g>
          )}
        </g>
      ))}
    </svg>
  );
}
