type LeavesProps = {
  className?: string;
};

export function Leaves({ className = "" }: LeavesProps) {
  return (
    <svg viewBox="0 0 100 40" className={className} role="img" aria-hidden="true">
      <g fill="var(--verde-salvia)" opacity={0.6}>
        <ellipse cx="15" cy="20" rx="10" ry="5" transform="rotate(-20 15 20)" />
        <ellipse cx="32" cy="14" rx="9" ry="4.5" transform="rotate(10 32 14)" />
        <ellipse cx="50" cy="22" rx="10" ry="5" transform="rotate(-10 50 22)" />
        <ellipse cx="68" cy="12" rx="8" ry="4" transform="rotate(20 68 12)" />
        <ellipse cx="85" cy="20" rx="9" ry="4.5" transform="rotate(-15 85 20)" />
      </g>
    </svg>
  );
}
