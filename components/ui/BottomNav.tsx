import { ScreenId } from "@/lib/screens";

type NavItem = {
  id: ScreenId;
  label: string;
  icon: string;
};

const NAV_ITEMS: NavItem[] = [
  { id: "capa", label: "Convite", icon: "💌" },
  { id: "presentes", label: "Presentes", icon: "🎁" },
  { id: "mural", label: "Recados", icon: "📝" },
  { id: "quiz", label: "Quiz", icon: "❓" },
];

type BottomNavProps = {
  current: ScreenId;
  onSelect: (id: ScreenId) => void;
};

export function BottomNav({ current, onSelect }: BottomNavProps) {
  return (
    <nav
      aria-label="Navegação rápida do convite"
      className="grid grid-cols-4 gap-1 border-t border-linha bg-branco/95 px-2 pt-2 backdrop-blur"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
    >
      {NAV_ITEMS.map((item) => {
        const active = item.id === current;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-xl py-1 font-sans text-[11px] font-semibold transition-colors ${
              active ? "text-verde-escuro" : "text-marrom-claro"
            }`}
          >
            <span className="text-lg leading-none" aria-hidden="true">
              {item.icon}
            </span>
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
