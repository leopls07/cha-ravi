"use client";

import { RefObject, useEffect, useState } from "react";

const BOTTOM_THRESHOLD = 24;
const OVERFLOW_THRESHOLD = 8;

// Mostra a dica só quando há conteúdo real abaixo da dobra e some perto do
// fim — a medição roda em callbacks (ResizeObserver/scroll), nunca direto no
// corpo do efeito. `contentEl` é estado reativo (via ref callback) porque o
// nó observado é remontado a cada troca de tela.
export function useScrollHint(
  scrollRef: RefObject<HTMLElement | null>,
  contentEl: HTMLElement | null
): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl || !contentEl) return;

    function update() {
      if (!scrollEl) return;
      const hasOverflow = scrollEl.scrollHeight > scrollEl.clientHeight + OVERFLOW_THRESHOLD;
      const nearBottom =
        scrollEl.scrollTop + scrollEl.clientHeight >= scrollEl.scrollHeight - BOTTOM_THRESHOLD;
      setVisible(hasOverflow && !nearBottom);
    }

    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(contentEl);
    scrollEl.addEventListener("scroll", update, { passive: true });

    return () => {
      resizeObserver.disconnect();
      scrollEl.removeEventListener("scroll", update);
    };
  }, [scrollRef, contentEl]);

  return visible;
}
