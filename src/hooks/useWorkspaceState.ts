import { useEffect, useMemo, useState } from "react";
import type { CodeStylePreset, HeadingDecorationStyle, HeadingStylePreset, Locale, PreviewDevice, WorkspaceState } from "../types";
import { renderMarkdown } from "../lib/markdown";
import { loadWorkspace } from "../lib/storage";
import { defaultContentByLocale } from "../defaultContent";

const initialState: WorkspaceState = {
  markdownInput: defaultContentByLocale.zh,
  renderedHtml: "",
  activeThemeId: "classic-paper",
  codeStyle: "auto",
  headingStyles: {
    h1: "classic",
    h2: "bar",
    h3: "minimal",
  },
  headingDecoration: {
    enabled: true,
    style: "auto",
  },
  themeMode: "light",
  previewDevice: "pc",
  scrollSyncEnabled: true,
  insightsOpen: true,
  locale: "zh",
  customTheme: {
    enabled: false,
    primaryColor: "#1d79b7",
    styleMode: "simple",
  },
};

function normalizeState(persisted: WorkspaceState | null): WorkspaceState {
  if (!persisted) {
    return initialState;
  }

  return {
    ...initialState,
    ...persisted,
    locale: persisted.locale ?? "zh",
    codeStyle: persisted.codeStyle ?? "auto",
    headingStyles: {
      ...initialState.headingStyles,
      ...(persisted.headingStyles ?? {}),
    },
    headingDecoration: {
      ...initialState.headingDecoration,
      ...(persisted.headingDecoration ?? {}),
    },
  };
}

export function useWorkspaceState() {
  const persisted = useMemo(() => loadWorkspace(), []);
  const [state, setState] = useState<WorkspaceState>(normalizeState(persisted));

  useEffect(() => {
    const renderedHtml = renderMarkdown(
      state.markdownInput,
      state.activeThemeId,
      state.codeStyle,
      state.headingStyles,
      state.headingDecoration,
      state.customTheme,
    );
    setState((prev) => (prev.renderedHtml === renderedHtml ? prev : { ...prev, renderedHtml }));
  }, [state.markdownInput, state.activeThemeId, state.codeStyle, state.headingStyles, state.headingDecoration, state.customTheme]);

  function setMarkdownInput(markdownInput: string) {
    setState((prev) => ({ ...prev, markdownInput }));
  }

  function setTheme(themeId: string) {
    setState((prev) => ({ ...prev, activeThemeId: themeId }));
  }

  function setCodeStyle(codeStyle: CodeStylePreset) {
    setState((prev) => ({ ...prev, codeStyle }));
  }

  function setHeadingStyle(level: "h1" | "h2" | "h3", preset: HeadingStylePreset) {
    setState((prev) => ({
      ...prev,
      headingStyles: {
        ...prev.headingStyles,
        [level]: preset,
      },
    }));
  }

  function setHeadingDecorationEnabled(enabled: boolean) {
    setState((prev) => ({
      ...prev,
      headingDecoration: {
        ...prev.headingDecoration,
        enabled,
      },
    }));
  }

  function setHeadingDecorationStyle(style: HeadingDecorationStyle) {
    setState((prev) => ({
      ...prev,
      headingDecoration: {
        ...prev.headingDecoration,
        style,
      },
    }));
  }

  function setPreviewDevice(previewDevice: PreviewDevice) {
    setState((prev) => ({ ...prev, previewDevice }));
  }

  function setLocale(locale: Locale) {
    setState((prev) => ({ ...prev, locale }));
  }

  function toggleInsightsOpen() {
    setState((prev) => ({ ...prev, insightsOpen: !prev.insightsOpen }));
  }

  function toggleThemeMode() {
    setState((prev) => ({ ...prev, themeMode: prev.themeMode === "light" ? "dark" : "light" }));
  }

  return {
    state,
    setState,
    setMarkdownInput,
    setTheme,
    setCodeStyle,
    setHeadingStyle,
    setHeadingDecorationEnabled,
    setHeadingDecorationStyle,
    setPreviewDevice,
    setLocale,
    toggleInsightsOpen,
    toggleThemeMode,
  };
}
