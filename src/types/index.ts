export type ThemeMode = "light" | "dark";
export type PreviewDevice = "mobile" | "tablet" | "pc";
export type StyleMode = "simple" | "focus" | "refined" | "vivid";
export type Locale = "zh" | "en";
export type CodeStylePreset = "auto" | "night" | "paper" | "matrix" | "mac";
export type HeadingStylePreset = "classic" | "bar" | "card" | "capsule" | "minimal" | "pastel" | "shadow" | "numbered" | "frame" | "banner" | "twinkle" | "mist" | "chapter" | "mono" | "coral" | "underline" | "corner" | "seal";
export type HeadingDecorationStyle = "auto" | "gem" | "cross" | "triangle" | "ring" | "spark" | "ribbon" | "bloom" | "orbit";

export interface HeadingStyleConfig {
  h1: HeadingStylePreset;
  h2: HeadingStylePreset;
  h3: HeadingStylePreset;
}

export interface HeadingDecorationConfig {
  enabled: boolean;
  style: HeadingDecorationStyle;
}

export interface CustomThemeConfig {
  enabled: boolean;
  primaryColor: string;
  styleMode: StyleMode;
}

export interface WorkspaceState {
  markdownInput: string;
  renderedHtml: string;
  activeThemeId: string;
  codeStyle: CodeStylePreset;
  headingStyles: HeadingStyleConfig;
  headingDecoration: HeadingDecorationConfig;
  themeMode: ThemeMode;
  previewDevice: PreviewDevice;
  scrollSyncEnabled: boolean;
  insightsOpen: boolean;
  locale: Locale;
  customTheme: CustomThemeConfig;
}

export interface DocumentStats {
  lineCount: number;
  characterCount: number;
  englishWordCount: number;
  cjkCharacterCount: number;
  paragraphCount: number;
  headingCount: number;
  imageCount: number;
  codeBlockCount: number;
  linkCount: number;
  readMinutes: number;
}
