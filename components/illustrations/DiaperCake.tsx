type DiaperCakeProps = {
  className?: string;
};

export function DiaperCake({ className = "" }: DiaperCakeProps) {
  return (
    <svg viewBox="0 0 140 140" className={className} role="img" aria-label="Bolo de fraldas">
      <ellipse cx="70" cy="120" rx="55" ry="14" fill="var(--bege)" stroke="var(--linha)" />
      <ellipse cx="70" cy="112" rx="55" ry="14" fill="var(--areia)" stroke="var(--linha)" />
      <ellipse cx="70" cy="85" rx="42" ry="12" fill="var(--bege)" stroke="var(--linha)" />
      <ellipse cx="70" cy="78" rx="42" ry="12" fill="var(--areia)" stroke="var(--linha)" />
      <ellipse cx="70" cy="58" rx="28" ry="10" fill="var(--bege)" stroke="var(--linha)" />
      <ellipse cx="70" cy="52" rx="28" ry="10" fill="var(--areia)" stroke="var(--linha)" />
      <path
        d="M55 40 q15 -18 30 0"
        stroke="var(--dourado)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="70" cy="34" r="5" fill="var(--dourado)" />
      <g stroke="var(--dourado)" strokeWidth="2.5" fill="none" strokeLinecap="round">
        <path d="M20 95 q6 -10 12 0" />
        <path d="M108 95 q6 -10 12 0" />
        <path d="M30 65 q6 -10 12 0" />
        <path d="M98 65 q6 -10 12 0" />
      </g>
    </svg>
  );
}
