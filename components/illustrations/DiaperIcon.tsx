type DiaperIconProps = {
  className?: string;
};

export function DiaperIcon({ className = "" }: DiaperIconProps) {
  return (
    <svg viewBox="0 0 40 32" className={className} role="img" aria-hidden="true">
      <path
        d="M4 6 h32 v6 c0 10 -8 16 -16 16 s-16 -6 -16 -16 z"
        fill="var(--branco)"
        stroke="var(--dourado)"
        strokeWidth="2"
      />
      <path d="M4 6 h32" stroke="var(--dourado)" strokeWidth="2" />
      <circle cx="14" cy="4" r="2.5" fill="var(--dourado-claro)" />
      <circle cx="26" cy="4" r="2.5" fill="var(--dourado-claro)" />
    </svg>
  );
}
