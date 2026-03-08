export type ThemeCategory = "light" | "dark" | "editorial" | "tech" | "nature";

export interface Theme {
  id: string;
  name: string;
  description: string;
  category: ThemeCategory;
  cssVars: Record<string, string>;
  backgroundImage?: string;
  backgroundSize?: string;
}
