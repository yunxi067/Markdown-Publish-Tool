import { STORAGE_KEY } from "./constants";
import type { WorkspaceState } from "../types";

export function saveWorkspace(state: WorkspaceState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadWorkspace(): WorkspaceState | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as WorkspaceState;
  } catch {
    return null;
  }
}
