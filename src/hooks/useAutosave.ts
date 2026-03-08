import { useEffect, useState } from "react";
import type { WorkspaceState } from "../types";
import { saveWorkspace } from "../lib/storage";

export function useAutosave(state: WorkspaceState): string {
  const [lastSavedAt, setLastSavedAt] = useState<string>("-");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      saveWorkspace(state);
      setLastSavedAt(new Date().toLocaleTimeString());
    }, 300);

    return () => window.clearTimeout(timer);
  }, [state]);

  return lastSavedAt;
}
