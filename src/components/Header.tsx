import type { Locale } from "../types";

interface HeaderProps {
  title: string;
  subtitle: string;
  darkMode: boolean;
  locale: Locale;
  lightLabel: string;
  darkLabel: string;
  langLabel: string;
  onToggleMode: () => void;
  onLocaleChange: (locale: Locale) => void;
}

export function Header({
  title,
  subtitle,
  darkMode,
  locale,
  lightLabel,
  darkLabel,
  langLabel,
  onToggleMode,
  onLocaleChange,
}: HeaderProps) {
  return (
    <header className="header">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="header-actions">
        <label className="theme-select-wrap">
          {langLabel}
          <select className="theme-select" value={locale} onChange={(event) => onLocaleChange(event.target.value as Locale)}>
            <option value="zh">中文</option>
            <option value="en">English</option>
          </select>
        </label>
        <button className="ghost-btn" onClick={onToggleMode}>
          {darkMode ? lightLabel : darkLabel}
        </button>
      </div>
    </header>
  );
}
