type DotsProps = {
  total: number;
  activeIndex: number;
  onSelect?: (index: number) => void;
};

export function Dots({ total, activeIndex, onSelect }: DotsProps) {
  return (
    <div className="flex items-center justify-center gap-1.5" role="tablist" aria-label="Progresso do convite">
      {Array.from({ length: total }).map((_, i) => {
        const active = i === activeIndex;
        return (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={active}
            aria-label={`Ir para a tela ${i + 1}`}
            onClick={() => onSelect?.(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              active ? "w-6 bg-dourado" : "w-2 bg-linha"
            }`}
          />
        );
      })}
    </div>
  );
}
