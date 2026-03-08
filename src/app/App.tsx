import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, ClipboardEvent } from "react";
import { Header } from "../components/Header";
import { Toolbar } from "../components/Toolbar";
import { ThemeSelector } from "../components/ThemeSelector";
import { CodeStyleSelector } from "../components/CodeStyleSelector";
import { HeadingStyleComposer } from "../components/HeadingStyleComposer";
import { EditorPanel } from "../components/EditorPanel";
import { PreviewPanel } from "../components/PreviewPanel";
import { InsightsPanel } from "../components/InsightsPanel";
import { WorkspaceMetaBar } from "../components/WorkspaceMetaBar";
import { useWorkspaceState } from "../hooks/useWorkspaceState";
import { useAutosave } from "../hooks/useAutosave";
import { useShortcuts } from "../hooks/useShortcuts";
import { useScrollSync } from "../hooks/useScrollSync";
import { clipboardDataToMarkdown } from "../lib/htmlToMarkdown";
import { makeWeChatCompatible } from "../lib/wechatCompat";
import { calculateDocumentMetrics } from "../lib/documentMetrics";
import { exportDoc, exportDocxLite, exportHtml } from "../lib/wordExport";
import { getUiText } from "../lib/i18n";
import { themes } from "../lib/themes";
import type { ThemeCategory } from "../lib/themes/types";
import type { HeadingDecorationStyle, HeadingStylePreset } from "../types";

export function App() {
  const {
    state,
    setState,
    setMarkdownInput,
    setTheme,
    setCodeStyle,
    setHeadingStyle,
    setHeadingDecorationEnabled,
    setHeadingDecorationStyle,
    setPreviewDevice,
    setLocale,
    toggleInsightsOpen,
    toggleThemeMode,
  } = useWorkspaceState();
  const text = getUiText(state.locale);
  const [status, setStatus] = useState(text.statusReady);
  const [themeCategory, setThemeCategory] = useState<"all" | ThemeCategory>("all");
  const [selectionColor, setSelectionColor] = useState("#ff7ab2");
  const [hasPreviewSelection, setHasPreviewSelection] = useState(false);
  const [activeHeadingLevel, setActiveHeadingLevel] = useState<"h1" | "h2" | "h3">("h1");
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastSavedAt = useAutosave(state);
  const stats = useMemo(() => calculateDocumentMetrics(state.markdownInput), [state.markdownInput]);
  const filteredThemes = useMemo(
    () => (themeCategory === "all" ? themes : themes.filter((theme) => theme.category === themeCategory)),
    [themeCategory],
  );
  const categoryOptions = useMemo(
    () => [
      { value: "all" as const, label: text.themeCategoryAll },
      { value: "light" as const, label: text.themeCategoryLight },
      { value: "dark" as const, label: text.themeCategoryDark },
      { value: "editorial" as const, label: text.themeCategoryEditorial },
      { value: "tech" as const, label: text.themeCategoryTech },
      { value: "nature" as const, label: text.themeCategoryNature },
    ],
    [text],
  );

  useScrollSync(state.scrollSyncEnabled, editorRef, previewRef);

  useEffect(() => {
    if (filteredThemes.length === 0) {
      return;
    }
    if (!filteredThemes.some((theme) => theme.id === state.activeThemeId)) {
      setTheme(filteredThemes[0].id);
    }
  }, [filteredThemes, setTheme, state.activeThemeId]);

  function updatePreviewSelectionState() {
    const preview = previewRef.current;
    const selection = window.getSelection();
    if (!preview || !selection || selection.rangeCount === 0 || selection.isCollapsed) {
      setHasPreviewSelection(false);
      return;
    }

    const range = selection.getRangeAt(0);
    const node = range.commonAncestorContainer.nodeType === Node.TEXT_NODE
      ? range.commonAncestorContainer.parentNode
      : range.commonAncestorContainer;

    setHasPreviewSelection(Boolean(node && preview.contains(node)));
  }

  function applyColorToSelection() {
    const preview = previewRef.current;
    const selection = window.getSelection();

    if (!preview || !selection || selection.rangeCount === 0 || selection.isCollapsed) {
      setStatus(text.statusSelectTextFirst);
      return;
    }

    const range = selection.getRangeAt(0);
    const node = range.commonAncestorContainer.nodeType === Node.TEXT_NODE
      ? range.commonAncestorContainer.parentNode
      : range.commonAncestorContainer;

    if (!node || !preview.contains(node)) {
      setStatus(text.statusSelectTextFirst);
      return;
    }

    const span = document.createElement("span");
    span.style.color = selectionColor;

    try {
      range.surroundContents(span);
    } catch {
      const fragment = range.extractContents();
      span.appendChild(fragment);
      range.insertNode(span);
    }

    selection.removeAllRanges();
    setHasPreviewSelection(false);
    setState((prev) => ({ ...prev, renderedHtml: preview.innerHTML }));
    setStatus(text.statusColorApplied);
  }

  async function handleCopyToWechat() {
    try {
      const safeHtml = await makeWeChatCompatible(state.renderedHtml);
      const plain = previewRef.current?.innerText ?? "";

      if (window.ClipboardItem) {
        const item = new ClipboardItem({
          "text/html": new Blob([safeHtml], { type: "text/html" }),
          "text/plain": new Blob([plain], { type: "text/plain" }),
        });
        await navigator.clipboard.write([item]);
      } else {
        await navigator.clipboard.writeText(plain);
      }

      setStatus(text.statusCopied);
    } catch {
      setStatus(text.statusCopyFailed);
    }
  }

  async function handlePaste(event: ClipboardEvent<HTMLTextAreaElement>) {
    event.preventDefault();

    const textarea = event.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const fallbackPlain = event.clipboardData.getData("text/plain");
    const markdown = await clipboardDataToMarkdown(event.clipboardData);
    const content = markdown ?? fallbackPlain;

    if (!content) {
      return;
    }

    const merged = `${state.markdownInput.slice(0, start)}${content}${state.markdownInput.slice(end)}`;
    setMarkdownInput(merged);

    requestAnimationFrame(() => {
      textarea.selectionStart = textarea.selectionEnd = start + content.length;
    });

    setStatus(text.statusPasted);
  }

  function handleExportHtml() {
    exportHtml(state.renderedHtml, "article");
    setStatus(text.statusExportedHtml);
  }

  function handleExportDoc() {
    exportDoc(state.renderedHtml, "article");
    setStatus(text.statusExportedDoc);
  }

  function handleExportDocx() {
    exportDocxLite(state.renderedHtml, "article");
    setStatus(text.statusExportedDocx);
  }

  function applyHeadingStyleToAll(preset: HeadingStylePreset) {
    setState((prev) => ({
      ...prev,
      headingStyles: {
        h1: preset,
        h2: preset,
        h3: preset,
      },
    }));
  }

  function openImportDialog() {
    fileInputRef.current?.click();
  }

  async function handleImportMd(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      setStatus(text.statusImportEmptyMd);
      return;
    }

    try {
      const content = await file.text();
      setMarkdownInput(content);
      setStatus(text.statusImportedMd);
    } catch {
      setStatus(text.statusImportFailedMd);
    } finally {
      event.target.value = "";
    }
  }

  useShortcuts({
    "mod+s": () => {
      void handleCopyToWechat();
    },
    "mod+shift+h": handleExportHtml,
    "mod+o": openImportDialog,
    "mod+1": () => setPreviewDevice("mobile"),
    "mod+2": () => setPreviewDevice("tablet"),
    "mod+3": () => setPreviewDevice("pc"),
  });

  return (
    <div className={`app-shell ${state.themeMode === "dark" ? "dark-mode" : ""}`}>
      <Header
        title={text.appTitle}
        subtitle={text.subtitle}
        darkMode={state.themeMode === "dark"}
        locale={state.locale}
        lightLabel={text.lightLabel}
        darkLabel={text.darkLabel}
        langLabel={text.langLabel}
        onToggleMode={toggleThemeMode}
        onLocaleChange={setLocale}
      />
      <div className="top-controls">
        <ThemeSelector
          value={state.activeThemeId}
          label={text.themeLabel}
          categoryLabel={text.themeCategoryLabel}
          categoryValue={themeCategory}
          categoryOptions={categoryOptions}
          themes={filteredThemes}
          onCategoryChange={setThemeCategory}
          onChange={setTheme}
        />
        <CodeStyleSelector
          value={state.codeStyle}
          label={text.codeStyleLabel}
          optionAuto={text.codeStyleAuto}
          optionMac={text.codeStyleMac}
          optionNight={text.codeStyleNight}
          optionPaper={text.codeStylePaper}
          optionMatrix={text.codeStyleMatrix}
          onChange={setCodeStyle}
        />
        <div className="selection-color-box">
          <label className="theme-select-wrap">
            {text.selectionColorLabel}
            <input type="color" value={selectionColor} onChange={(event) => setSelectionColor(event.target.value)} />
          </label>
          <button type="button" onClick={applyColorToSelection} disabled={!hasPreviewSelection}>
            {text.applySelectionColor}
          </button>
        </div>
        <div className="heading-decoration-box">
          <label className="theme-select-wrap">
            {text.headingDecorationLabel}
            <input
              type="checkbox"
              checked={state.headingDecoration.enabled}
              onChange={(event) => setHeadingDecorationEnabled(event.target.checked)}
            />
            <span>{text.headingDecorationEnable}</span>
          </label>
          <label className="theme-select-wrap">
            {text.headingDecorationStyleLabel}
            <select
              className="theme-select"
              value={state.headingDecoration.style}
              onChange={(event) => setHeadingDecorationStyle(event.target.value as HeadingDecorationStyle)}
              disabled={!state.headingDecoration.enabled}
            >
              <option value="auto">{text.headingDecorationAuto}</option>
              <option value="gem">{text.headingDecorationGem}</option>
              <option value="cross">{text.headingDecorationCross}</option>
              <option value="triangle">{text.headingDecorationTriangle}</option>
              <option value="ring">{text.headingDecorationRing}</option>
              <option value="spark">{text.headingDecorationSpark}</option>
              <option value="ribbon">{text.headingDecorationRibbon}</option>
              <option value="bloom">{text.headingDecorationBloom}</option>
              <option value="orbit">{text.headingDecorationOrbit}</option>
            </select>
          </label>
        </div>
      </div>
      <Toolbar
        onImportMd={openImportDialog}
        onCopyWechat={() => void handleCopyToWechat()}
        onExportHtml={handleExportHtml}
        onExportDoc={handleExportDoc}
        onExportDocx={handleExportDocx}
        previewDevice={state.previewDevice}
        onDeviceChange={setPreviewDevice}
        onToggleInsights={toggleInsightsOpen}
        importMdLabel={text.importMd}
        copyWechatLabel={text.copyWechat}
        exportHtmlLabel={text.exportHtml}
        exportDocLabel={text.exportDoc}
        exportDocxLabel={text.exportDocx}
        insightsLabel={text.insightsButton}
      />
      <WorkspaceMetaBar lastSavedAt={lastSavedAt} status={status} autosavedLabel={text.autosavedLabel} />
      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.markdown,.txt,text/markdown,text/plain"
        style={{ display: "none" }}
        onChange={handleImportMd}
      />

      <main className="workspace-grid">
        <EditorPanel
          value={state.markdownInput}
          title={text.editorTitle}
          onChange={setMarkdownInput}
          onPaste={handlePaste}
          editorRef={editorRef}
        />
        <PreviewPanel
          html={state.renderedHtml}
          title={text.previewTitle}
          device={state.previewDevice}
          previewRef={previewRef}
          onSelectionChange={updatePreviewSelectionState}
          onHeadingFocus={setActiveHeadingLevel}
        />
        <aside className="sidebar-stack">
          <section className="panel heading-template-panel">
            <h2>{text.headingStyleLabel}</h2>
            <HeadingStyleComposer
              label={text.headingStyleLabel}
              h1Label={text.headingH1Label}
              h2Label={text.headingH2Label}
              h3Label={text.headingH3Label}
              featuredLabel={text.headingFeaturedLabel}
              featuredDreamyLabel={text.headingFeaturedDreamy}
              featuredEditorialLabel={text.headingFeaturedEditorial}
              featuredMinimalLabel={text.headingFeaturedMinimal}
              applyAllLabel={text.headingApplyAllLabel}
              advancedLabel={text.headingAdvancedLabel}
              advancedHideLabel={text.headingAdvancedHide}
              optionClassic={text.headingOptionClassic}
              optionBar={text.headingOptionBar}
              optionCard={text.headingOptionCard}
              optionCapsule={text.headingOptionCapsule}
              optionMinimal={text.headingOptionMinimal}
              optionPastel={text.headingOptionPastel}
              optionShadow={text.headingOptionShadow}
              optionNumbered={text.headingOptionNumbered}
              optionFrame={text.headingOptionFrame}
              optionBanner={text.headingOptionBanner}
              optionTwinkle={text.headingOptionTwinkle}
              optionMist={text.headingOptionMist}
              optionChapter={text.headingOptionChapter}
              optionMono={text.headingOptionMono}
              optionCoral={text.headingOptionCoral}
              optionUnderline={text.headingOptionUnderline}
              optionCorner={text.headingOptionCorner}
              optionSeal={text.headingOptionSeal}
              value={state.headingStyles}
              activeLevel={activeHeadingLevel}
              onChange={setHeadingStyle}
              onApplyAll={applyHeadingStyleToAll}
            />
          </section>
          {state.insightsOpen ? (
            <InsightsPanel
              stats={stats}
              title={text.insightsTitle}
              linesLabel={text.lines}
              charsLabel={text.chars}
              wordsLabel={text.words}
              cjkLabel={text.cjk}
              paragraphsLabel={text.paragraphs}
              headingsLabel={text.headings}
              imagesLabel={text.images}
              codeBlocksLabel={text.codeBlocks}
              linksLabel={text.links}
              readLabel={text.read}
              minuteLabel={text.minute}
            />
          ) : null}
        </aside>
      </main>
    </div>
  );
}
