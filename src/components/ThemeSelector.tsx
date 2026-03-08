import type { Theme } from "../lib/themes/types";

interface ThemeSelectorProps {
  value: string;
  label: string;
  categoryLabel: string;
  categoryValue: "all" | Theme["category"];
  categoryOptions: Array<{ value: "all" | Theme["category"]; label: string }>;
  themes: Theme[];
  onChange: (value: string) => void;
  onCategoryChange: (value: "all" | Theme["category"]) => void;
}

export function ThemeSelector({
  value,
  label,
  categoryLabel,
  categoryValue,
  categoryOptions,
  themes,
  onChange,
  onCategoryChange,
}: ThemeSelectorProps) {
  return (
    <div className="theme-selector-group">
      <label className="theme-select-wrap">
        {categoryLabel}
        <select className="theme-select" value={categoryValue} onChange={(event) => onCategoryChange(event.target.value as "all" | Theme["category"])}>
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label className="theme-select-wrap">
        {label}
        <select className="theme-select" value={value} onChange={(event) => onChange(event.target.value)}>
          {themes.map((theme) => (
            <option key={theme.id} value={theme.id}>
              {theme.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
