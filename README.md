# Markdown Publish Tool

[English](README.md) | [简体中文](README.zh-CN.md)

A polished Markdown publishing tool for styled article writing, WeChat-friendly copy, and quick multi-format export.

## Why This Project

Writing tools usually stop at plain preview. This project focuses on the last mile of publishing:

- better-looking article layouts
- richer heading templates
- WeChat-compatible copy workflow
- quick export for reuse and archiving

## Features

- Real-time Markdown editing and preview
- Theme switching for different article moods
- Multiple code block styles
- Rich heading templates with visual presets
- Visual heading template picker with grouped styles
- WeChat-friendly rich-text copy flow
- Export to HTML, DOC, and DOCX-lite
- Local autosave, document metrics, and device preview

## Demo Workflow

1. Write Markdown in the editor
2. Choose a theme and heading template
3. Preview the article in mobile, tablet, or desktop width
4. Copy to WeChat or export to HTML / DOC / DOCX-lite

## Tech Stack

- React 18
- TypeScript
- Vite
- markdown-it
- Turndown
- highlight.js

## Getting Started

Install dependencies:

```bash
npm install
```

Start local development:

```bash
npm run dev
```

Expose to local network:

```bash
npm run dev:host
```

Windows quick start script:

```bash
快速启动.bat
```

This script is useful for local double-click startup on Windows machines.

Build for production:

```bash
npm run build
```

Run tests:

```bash
npm test
```

## Project Structure

```text
src/
  app/          App shell and composition
  components/   UI components
  hooks/        Reusable React hooks
  lib/          Markdown, export, compatibility, and theme logic
  styles/       Global styles
  types/        Shared TypeScript types
docs/           Product and implementation notes
```

## Roadmap

- Improve WeChat copy compatibility fallback behavior
- Upgrade DOCX export to a true DOCX generator
- Add visual template preview thumbnails based on real output
- Add tests for rendering and export behavior
- Publish a hosted demo

## Contributing

Contributions are welcome. Please read `CONTRIBUTING.md` before opening a pull request.

## Community

- `CODE_OF_CONDUCT.md`
- `CONTRIBUTING.md`
- GitHub issue templates
- Pull request template

## License

MIT. See `LICENSE`.
