import type { ClipboardEvent, RefObject } from "react";

interface EditorPanelProps {
  value: string;
  title: string;
  onChange: (value: string) => void;
  onPaste: (event: ClipboardEvent<HTMLTextAreaElement>) => void;
  editorRef: RefObject<HTMLTextAreaElement>;
}

export function EditorPanel({ value, title, onChange, onPaste, editorRef }: EditorPanelProps) {
  return (
    <section className="panel editor-panel">
      <h2>{title}</h2>
      <textarea
        ref={editorRef}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onPaste={onPaste}
        spellCheck={false}
      />
    </section>
  );
}
