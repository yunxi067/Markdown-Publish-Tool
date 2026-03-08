import type { RefObject } from "react";
import { DEVICE_WIDTH } from "../lib/constants";
import type { PreviewDevice } from "../types";

interface PreviewPanelProps {
  html: string;
  device: PreviewDevice;
  title: string;
  previewRef: RefObject<HTMLDivElement>;
  onSelectionChange: () => void;
  onHeadingFocus: (level: "h1" | "h2" | "h3") => void;
}

export function PreviewPanel({ html, device, title, previewRef, onSelectionChange, onHeadingFocus }: PreviewPanelProps) {
  return (
    <section className="panel preview-panel">
      <h2>{title}</h2>
      <div
        ref={previewRef}
        className="preview-content"
        style={{ maxWidth: `${DEVICE_WIDTH[device]}px` }}
        onMouseUp={onSelectionChange}
        onKeyUp={onSelectionChange}
        onClick={(event) => {
          const target = event.target as HTMLElement | null;
          const heading = target?.closest("h1, h2, h3");
          if (!heading) {
            return;
          }
          onHeadingFocus(heading.tagName.toLowerCase() as "h1" | "h2" | "h3");
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </section>
  );
}
