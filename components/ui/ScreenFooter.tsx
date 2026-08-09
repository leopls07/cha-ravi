import { ReactNode } from "react";
import { Button } from "./Button";

type ScreenFooterProps = {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: ReactNode;
  nextDisabled?: boolean;
  hideNext?: boolean;
};

export function ScreenFooter({
  onBack,
  onNext,
  nextLabel = "Continuar",
  nextDisabled,
  hideNext,
}: ScreenFooterProps) {
  return (
    <div className="mt-6 flex flex-col items-center gap-3">
      {!hideNext && onNext && (
        <Button variant="primary" fullWidth onClick={onNext} disabled={nextDisabled}>
          {nextLabel}
        </Button>
      )}
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="min-h-11 px-2 font-sans text-sm text-marrom-claro underline underline-offset-4"
        >
          ‹ Voltar
        </button>
      )}
    </div>
  );
}
