import { useEffect } from "react";

type ShortcutHandler = () => void;

export function useShortcuts(shortcuts: Record<string, ShortcutHandler>) {
  useEffect(() => {
    function handler(event: KeyboardEvent) {
      const key = `${event.ctrlKey || event.metaKey ? "mod+" : ""}${event.shiftKey ? "shift+" : ""}${event.key.toLowerCase()}`;
      const fn = shortcuts[key];
      if (fn) {
        event.preventDefault();
        fn();
      }
    }

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [shortcuts]);
}
