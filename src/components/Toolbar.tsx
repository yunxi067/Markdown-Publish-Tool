import type { PreviewDevice } from "../types";

interface ToolbarProps {
  onImportMd: () => void;
  onCopyWechat: () => void;
  onExportHtml: () => void;
  onExportDoc: () => void;
  onExportDocx: () => void;
  previewDevice: PreviewDevice;
  onDeviceChange: (device: PreviewDevice) => void;
  onToggleInsights: () => void;
  importMdLabel: string;
  copyWechatLabel: string;
  exportHtmlLabel: string;
  exportDocLabel: string;
  exportDocxLabel: string;
  insightsLabel: string;
}

export function Toolbar(props: ToolbarProps) {
  return (
    <div className="toolbar">
      <div className="toolbar-group">
        <button onClick={props.onImportMd}>{props.importMdLabel}</button>
        <button onClick={props.onCopyWechat}>{props.copyWechatLabel}</button>
        <button onClick={props.onExportHtml}>{props.exportHtmlLabel}</button>
        <button onClick={props.onExportDoc}>{props.exportDocLabel}</button>
        <button onClick={props.onExportDocx}>{props.exportDocxLabel}</button>
      </div>
      <div className="toolbar-group">
        <button className={props.previewDevice === "mobile" ? "active" : ""} onClick={() => props.onDeviceChange("mobile")}>M</button>
        <button className={props.previewDevice === "tablet" ? "active" : ""} onClick={() => props.onDeviceChange("tablet")}>T</button>
        <button className={props.previewDevice === "pc" ? "active" : ""} onClick={() => props.onDeviceChange("pc")}>D</button>
        <button onClick={props.onToggleInsights}>{props.insightsLabel}</button>
      </div>
    </div>
  );
}
