import { ScreenId } from "@/lib/screens";

export type ScreenProps = {
  onNext: () => void;
  onBack: () => void;
  goTo: (id: ScreenId) => void;
  isFirst: boolean;
  isLast: boolean;
};

export type GiftsScreenProps = ScreenProps & {
  onPresentear: (valor: number) => void;
};

export type PixScreenProps = ScreenProps & {
  valorInicial: number | null;
};
