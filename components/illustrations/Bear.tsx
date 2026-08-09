type BearProps = {
  className?: string;
};

export function Bear({ className = "" }: BearProps) {
  return (
    <svg
      viewBox="0 0 160 160"
      className={className}
      role="img"
      aria-label="Ursinho de pelúcia"
    >
      <circle cx="40" cy="45" r="16" fill="var(--marrom-claro)" />
      <circle cx="120" cy="45" r="16" fill="var(--marrom-claro)" />
      <circle cx="40" cy="45" r="8" fill="var(--bege)" />
      <circle cx="120" cy="45" r="8" fill="var(--bege)" />

      <circle cx="80" cy="80" r="52" fill="var(--marrom-claro)" />
      <ellipse cx="80" cy="96" rx="26" ry="20" fill="var(--bege)" />

      <circle cx="60" cy="70" r="5" fill="var(--marrom-cacau)" />
      <circle cx="100" cy="70" r="5" fill="var(--marrom-cacau)" />
      <ellipse cx="80" cy="90" rx="7" ry="5" fill="var(--marrom-cacau)" />
      <path
        d="M80 95 Q80 104 70 104 M80 95 Q80 104 90 104"
        stroke="var(--marrom-cacau)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />

      <circle cx="35" cy="110" r="14" fill="var(--marrom-claro)" />
      <circle cx="125" cy="110" r="14" fill="var(--marrom-claro)" />
      <circle cx="60" cy="140" r="15" fill="var(--marrom-claro)" />
      <circle cx="100" cy="140" r="15" fill="var(--marrom-claro)" />

      <path
        d="M55 60 Q80 45 105 60"
        stroke="var(--dourado)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="80" cy="58" r="6" fill="var(--dourado)" />
    </svg>
  );
}
