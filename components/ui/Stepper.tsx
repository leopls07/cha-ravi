"use client";

type StepperProps = {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  label?: string;
};

export function Stepper({ value, min = 0, max = 99, onChange, label }: StepperProps) {
  return (
    <div className="flex items-center gap-4">
      {label && <span className="font-sans text-sm text-marrom-cacau">{label}</span>}
      <div className="flex items-center gap-3 rounded-full border border-linha bg-branco px-2 py-1">
        <button
          type="button"
          aria-label="Diminuir"
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="flex h-11 w-11 items-center justify-center rounded-full text-xl font-bold text-verde-escuro disabled:opacity-30"
        >
          −
        </button>
        <span className="w-8 text-center font-display text-lg font-semibold tabular-nums text-marrom-cacau">
          {value}
        </span>
        <button
          type="button"
          aria-label="Aumentar"
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="flex h-11 w-11 items-center justify-center rounded-full text-xl font-bold text-verde-escuro disabled:opacity-30"
        >
          +
        </button>
      </div>
    </div>
  );
}
