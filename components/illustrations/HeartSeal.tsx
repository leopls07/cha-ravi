type HeartSealProps = {
  className?: string;
};

export function HeartSeal({ className = "" }: HeartSealProps) {
  return (
    <svg viewBox="0 0 60 60" className={className} role="img" aria-hidden="true">
      <circle cx="30" cy="30" r="28" fill="var(--dourado)" />
      <path
        d="M30 42 C14 30 16 16 27 16 c3.4 0 5.6 2.2 3 5.4 C27.4 18.2 33 16 33 22 C41 18 44 30 30 42 Z"
        fill="var(--creme)"
      />
    </svg>
  );
}
