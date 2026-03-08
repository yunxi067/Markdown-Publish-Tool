import { useEffect } from "react";
import type { RefObject } from "react";

export function useScrollSync(enabled: boolean, editorRef: RefObject<HTMLTextAreaElement>, previewRef: RefObject<HTMLDivElement>) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const editor = editorRef.current;
    const preview = previewRef.current;

    if (!editor || !preview) {
      return;
    }

    const onEditorScroll = () => {
      const editorRange = editor.scrollHeight - editor.clientHeight;
      if (editorRange <= 0) {
        return;
      }
      const ratio = editor.scrollTop / editorRange;
      const previewRange = preview.scrollHeight - preview.clientHeight;
      preview.scrollTop = previewRange * ratio;
    };

    editor.addEventListener("scroll", onEditorScroll);
    return () => editor.removeEventListener("scroll", onEditorScroll);
  }, [enabled, editorRef, previewRef]);
}
