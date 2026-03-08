import { useEffect, useState } from "react";
import type { HeadingStylePreset } from "../types";

interface HeadingStyleComposerProps {
  label: string;
  h1Label: string;
  h2Label: string;
  h3Label: string;
  featuredLabel: string;
  featuredDreamyLabel: string;
  featuredEditorialLabel: string;
  featuredMinimalLabel: string;
  applyAllLabel: string;
  advancedLabel: string;
  advancedHideLabel: string;
  optionClassic: string;
  optionBar: string;
  optionCard: string;
  optionCapsule: string;
  optionMinimal: string;
  optionPastel: string;
  optionShadow: string;
  optionNumbered: string;
  optionFrame: string;
  optionBanner: string;
  optionTwinkle: string;
  optionMist: string;
  optionChapter: string;
  optionMono: string;
  optionCoral: string;
  optionUnderline: string;
  optionCorner: string;
  optionSeal: string;
  value: { h1: HeadingStylePreset; h2: HeadingStylePreset; h3: HeadingStylePreset };
  activeLevel?: "h1" | "h2" | "h3";
  onChange: (level: "h1" | "h2" | "h3", preset: HeadingStylePreset) => void;
  onApplyAll: (preset: HeadingStylePreset) => void;
}

export function HeadingStyleComposer(props: HeadingStyleComposerProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [activeLevel, setActiveLevel] = useState<"h1" | "h2" | "h3">("h1");
  const options = [
    { value: "classic", label: props.optionClassic },
    { value: "bar", label: props.optionBar },
    { value: "card", label: props.optionCard },
    { value: "capsule", label: props.optionCapsule },
    { value: "minimal", label: props.optionMinimal },
    { value: "pastel", label: props.optionPastel },
    { value: "shadow", label: props.optionShadow },
    { value: "numbered", label: props.optionNumbered },
    { value: "frame", label: props.optionFrame },
    { value: "banner", label: props.optionBanner },
    { value: "twinkle", label: props.optionTwinkle },
    { value: "mist", label: props.optionMist },
    { value: "chapter", label: props.optionChapter },
    { value: "mono", label: props.optionMono },
    { value: "coral", label: props.optionCoral },
    { value: "underline", label: props.optionUnderline },
    { value: "corner", label: props.optionCorner },
    { value: "seal", label: props.optionSeal },
  ] as const;
  const featuredGroups = [
    {
      label: props.featuredDreamyLabel,
      items: [
        { value: "twinkle", label: props.optionTwinkle, previewClass: "twinkle" },
        { value: "mist", label: props.optionMist, previewClass: "mist" },
      ],
    },
    {
      label: props.featuredEditorialLabel,
      items: [
        { value: "chapter", label: props.optionChapter, previewClass: "chapter" },
        { value: "coral", label: props.optionCoral, previewClass: "coral" },
        { value: "underline", label: props.optionUnderline, previewClass: "underline" },
        { value: "seal", label: props.optionSeal, previewClass: "seal" },
      ],
    },
    {
      label: props.featuredMinimalLabel,
      items: [
        { value: "mono", label: props.optionMono, previewClass: "mono" },
        { value: "corner", label: props.optionCorner, previewClass: "corner" },
      ],
    },
  ] as const;
  const levelTabs = [
    { value: "h1" as const, label: props.h1Label, current: props.value.h1 },
    { value: "h2" as const, label: props.h2Label, current: props.value.h2 },
    { value: "h3" as const, label: props.h3Label, current: props.value.h3 },
  ];

  useEffect(() => {
    if (props.activeLevel) {
      setActiveLevel(props.activeLevel);
    }
  }, [props.activeLevel]);

  function renderQuickPick(level: "h1" | "h2" | "h3", current: HeadingStylePreset, levelLabel: string) {
    return (
      <div className="heading-featured-row">
        <span className="heading-featured-level">{levelLabel}</span>
        {featuredGroups.map((group) => (
          <div key={`${level}-${group.label}`} className="heading-featured-group">
            <div className="heading-featured-group-head">
              <span className="heading-featured-group-title">{group.label}</span>
            </div>
            <div className="heading-featured-grid">
              {group.items.map((option) => (
                <button
                  key={`${level}-${option.value}`}
                  type="button"
                  className={`heading-chip heading-chip-${option.previewClass}${current === option.value ? " active" : ""}`}
                  onClick={() => props.onChange(level, option.value)}
                >
                  <span className="heading-chip-preview" />
                  <span className="heading-chip-label">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="heading-composer">
      <span className="heading-composer-title">{props.label}</span>
      <div className="heading-featured-box">
        <div className="heading-featured-header">
          <span className="heading-composer-title">{props.featuredLabel}</span>
          <div className="heading-level-tabs">
            {levelTabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                className={`heading-level-tab${activeLevel === tab.value ? " active" : ""}`}
                onClick={() => setActiveLevel(tab.value)}
              >
                <span className="heading-level-tab-name">{tab.label}</span>
                <span className="heading-level-tab-style">{options.find((option) => option.value === tab.current)?.label}</span>
              </button>
            ))}
          </div>
          <div className="heading-featured-actions">
            {["twinkle", "mist", "chapter", "mono", "coral", "underline", "corner", "seal"].map((preset) => (
              <button
                key={`apply-${preset}`}
                type="button"
                className="heading-apply-all"
                onClick={() => props.onApplyAll(preset as HeadingStylePreset)}
              >
                {`${options.find((option) => option.value === preset)?.label} · ${props.applyAllLabel}`}
              </button>
            ))}
          </div>
        </div>
        {activeLevel === "h1" ? renderQuickPick("h1", props.value.h1, props.h1Label) : null}
        {activeLevel === "h2" ? renderQuickPick("h2", props.value.h2, props.h2Label) : null}
        {activeLevel === "h3" ? renderQuickPick("h3", props.value.h3, props.h3Label) : null}
      </div>
      <div className="heading-advanced-box">
        <button type="button" className="heading-advanced-toggle" onClick={() => setAdvancedOpen((value) => !value)}>
          {advancedOpen ? props.advancedHideLabel : props.advancedLabel}
        </button>
        {advancedOpen ? (
          <div className="heading-advanced-grid">
            <label className="theme-select-wrap">
              {props.h1Label}
              <select className="theme-select" value={props.value.h1} onChange={(event) => props.onChange("h1", event.target.value as HeadingStylePreset)}>
                {options.map((option) => (
                  <option key={`h1-${option.value}`} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="theme-select-wrap">
              {props.h2Label}
              <select className="theme-select" value={props.value.h2} onChange={(event) => props.onChange("h2", event.target.value as HeadingStylePreset)}>
                {options.map((option) => (
                  <option key={`h2-${option.value}`} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="theme-select-wrap">
              {props.h3Label}
              <select className="theme-select" value={props.value.h3} onChange={(event) => props.onChange("h3", event.target.value as HeadingStylePreset)}>
                {options.map((option) => (
                  <option key={`h3-${option.value}`} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : null}
      </div>
    </div>
  );
}
