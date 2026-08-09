"use client";

import { useCallback, useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getServerSnapshot() {
  return null;
}

// Usa useSyncExternalStore para ler o localStorage com segurança em relação à
// hidratação: o servidor (e a primeira renderização no cliente) veem `null`,
// e o React troca para o valor real assim que possível, sem setState em efeito.
export function useLocalStorage<T>(key: string, initialValue: T) {
  const getSnapshot = useCallback(() => window.localStorage.getItem(key), [key]);
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const value: T = raw !== null ? (JSON.parse(raw) as T) : initialValue;

  const setValue = useCallback(
    (next: T) => {
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
        window.dispatchEvent(new StorageEvent("storage", { key }));
      } catch {
        // ignora storage indisponível (ex.: modo privado)
      }
    },
    [key]
  );

  return [value, setValue] as const;
}

export function getGuestId(): string {
  const KEY = "cha-ravi:guest-id";
  try {
    const existing = window.localStorage.getItem(KEY);
    if (existing) return existing;
    const id = crypto.randomUUID();
    window.localStorage.setItem(KEY, id);
    return id;
  } catch {
    return "anon";
  }
}
