# Implementation Guide

## Implemented scope

- React 18 + TypeScript + Vite project scaffold.
- Markdown editor and real-time preview.
- 8 built-in themes and custom primary color placeholder in data model.
- Rich text paste conversion via Turndown and image paste to Base64 markdown.
- WeChat-compatible copy path with HTML + plain text clipboard payload.
- Import local `.md/.markdown/.txt` files.
- HTML / PDF / DOC / DOCX-lite export.
- Local autosave and document metrics panel.
- Shortcut support:
  - Ctrl/Cmd + S: Copy WeChat
  - Ctrl/Cmd + Shift + P: Export PDF
  - Ctrl/Cmd + Shift + H: Export HTML
  - Ctrl/Cmd + 1/2/3: switch preview device

## Run

```bash
npm install
npm run dev
```

## One-click quick start (Windows)

- Double click `quick-start.bat`.
- The script will:
  - check Node/npm
  - install dependencies
  - start Vite with LAN access
  - print both local and LAN URLs

## Build check

```bash
npm run build
```

## Notes

- DOCX export is currently a lightweight HTML-based implementation. Replace with full OpenXML packaging in next iteration.
- WeChat compatibility currently covers structural fallbacks (section root, flex downgrade, image grid table conversion, list flattening).
