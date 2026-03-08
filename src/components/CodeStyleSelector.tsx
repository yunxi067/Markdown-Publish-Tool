import type { CodeStylePreset } from "../types";

interface CodeStyleSelectorProps {
  value: CodeStylePreset;
  label: string;
  optionAuto: string;
  optionMac: string;
  optionNight: string;
  optionPaper: string;
  optionMatrix: string;
  onChange: (value: CodeStylePreset) => void;
}

export function CodeStyleSelector({
  value,
  label,
  optionAuto,
  optionMac,
  optionNight,
  optionPaper,
  optionMatrix,
  onChange,
}: CodeStyleSelectorProps) {
  return (
    <label className="theme-select-wrap">
      {label}
      <select className="theme-select" value={value} onChange={(event) => onChange(event.target.value as CodeStylePreset)}>
        <option value="auto">{optionAuto}</option>
        <option value="mac">{optionMac}</option>
        <option value="night">{optionNight}</option>
        <option value="paper">{optionPaper}</option>
        <option value="matrix">{optionMatrix}</option>
      </select>
    </label>
  );
}
