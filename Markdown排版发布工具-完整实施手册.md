# Markdown 排版发布工具（微信公众号/知识库/博客）完整实施手册

## 0. 文档说明

- 文档目标：给出从 0 到 1 实现一款「智能粘贴 + 主题排版 + 一键发布」工具的完整工程方案。
- 适用对象：前端开发者（React/TypeScript），也适合小团队协作开发。
- 交付导向：每一章都尽量对应可执行动作、目录结构、关键代码与验收标准。

---

## 1. 产品定位与目标拆解

### 1.1 产品定位

这是一个面向内容创作者的 Web 工具，解决「写作后发布」链路中的格式损耗问题：

1. 从飞书、Notion、Word、网页复制内容时，自动清洗为规范 Markdown。
2. Markdown 在预览区套用主题，得到可发布视觉效果。
3. 点击「复制到公众号」后，尽量保持样式稳定（尤其图片、列表、标题、引用、代码块）。
4. 同时支持文档留档：PDF / HTML / DOCX / DOC。

### 1.2 目标用户

1. 公众号运营、技术博主、知识付费创作者。
2. 内部文档编写者（需要输出 Word/PDF）。
3. 产品/运营同学（不想手写 Markdown 语法）。

### 1.3 成功指标（建议）

1. 粘贴转化成功率：>= 95%（主流来源：飞书/Notion/Word/网页）。
2. 复制到公众号后样式可接受率：>= 90%。
3. 关键动作耗时：普通文档（<3000 字）主题切换与预览更新 < 300ms。
4. 导出成功率：PDF/HTML/DOCX >= 99%。

---

## 2. 功能规划（MVP -> V1 -> V2）

### 2.1 MVP（2~3 周）

1. Markdown 编辑区 + 实时预览区。
2. 8~12 套主题。
3. 富文本粘贴自动转 Markdown（基本规则）。
4. HTML/PDF 导出。
5. 本地自动保存。

### 2.2 V1（4~6 周）

1. 微信兼容增强（flex->table、字体继承、图片 base64）。
2. 一键复制公众号。
3. Word 复制 + DOCX/DOC 导出。
4. 多设备预览（手机/平板/桌面）。
5. 文档统计与目录导航。

### 2.3 V2（迭代）

1. 模板市场（内容模板 + 封面组件）。
2. 云端存储（账号体系 + 历史版本）。
3. 多人协作与审阅。
4. AI 辅助（标题优化、摘要、排版建议）。

---

## 3. 技术选型与理由

### 3.1 前端基础

1. `React 18`：组件化与生态成熟。
2. `TypeScript`：保证可维护性和重构安全。
3. `Vite`：本地开发快，构建链路清晰。

### 3.2 内容处理

1. `markdown-it`：Markdown 渲染灵活。
2. `highlight.js`：代码高亮，语言支持丰富。
3. `turndown + turndown-plugin-gfm`：HTML -> Markdown 的成熟方案。

### 3.3 导出能力

1. `html2pdf.js`：快速实现 PDF 导出。
2. 原生 `Blob + URL.createObjectURL`：HTML/DOC 下载。
3. 自定义 `docx` 打包（可先简版，后迭代）。

### 3.4 UI / 动效

1. `Tailwind CSS`：快速实现复杂界面。
2. `framer-motion`：局部交互动效。

---

## 4. 系统架构设计

### 4.1 架构总览

1. 输入层：编辑器输入、粘贴拦截、快捷键。
2. 转换层：Markdown 预处理 -> 渲染 HTML -> 主题注入。
3. 兼容层：微信特殊规则转换。
4. 输出层：复制、导出、下载。
5. 持久层：LocalStorage 自动保存与版本迁移。

### 4.2 核心流程

1. 用户输入或粘贴。
2. 状态更新 `markdownInput`。
3. `preprocessMarkdown()` 修正异常格式。
4. `markdown-it.render()` 生成 HTML。
5. `applyTheme()` 注入主题样式。
6. 预览渲染。
7. 触发复制/导出时：`wechatCompat` / `wordExport` / `pdf`。

### 4.3 关键设计原则

1. 预览链路和导出链路解耦。
2. 所有转换函数尽量纯函数化，便于测试。
3. 按功能分层，不让 `App.tsx` 成为巨石文件。

---

## 5. 目录结构（建议）

```txt
src/
  app/
    App.tsx
  components/
    Header.tsx
    Toolbar.tsx
    ThemeSelector.tsx
    EditorPanel.tsx
    PreviewPanel.tsx
    InsightsPanel.tsx
    WorkspaceMetaBar.tsx
  hooks/
    useWorkspaceState.ts
    useAutosave.ts
    useScrollSync.ts
    useShortcuts.ts
  lib/
    markdown.ts
    htmlToMarkdown.ts
    wechatCompat.ts
    wordExport.ts
    documentMetrics.ts
    storage.ts
    constants.ts
    themes/
      types.ts
      index.ts
      classic.ts
      modern.ts
      extra.ts
      customize.ts
  types/
  styles/
    index.css
  defaultContent.ts

docs/
  implementation-guide.md
```

---

## 6. 数据模型设计

### 6.1 核心状态

```ts
interface WorkspaceState {
  markdownInput: string;
  renderedHtml: string;
  activeThemeId: string;
  themeMode: 'light' | 'dark';
  previewDevice: 'mobile' | 'tablet' | 'pc';
  scrollSyncEnabled: boolean;
  insightsOpen: boolean;
  customTheme: {
    enabled: boolean;
    primaryColor: string;
    styleMode: 'simple' | 'focus' | 'refined' | 'vivid';
  };
}
```

### 6.2 主题模型

```ts
interface Theme {
  id: string;
  name: string;
  description: string;
  styles: Record<string, string>; // selector -> inline css
}
```

### 6.3 文档统计

```ts
interface DocumentStats {
  lineCount: number;
  characterCount: number;
  englishWordCount: number;
  cjkCharacterCount: number;
  paragraphCount: number;
  headingCount: number;
  imageCount: number;
  codeBlockCount: number;
  linkCount: number;
  readMinutes: number;
}
```

---

## 7. 核心模块详细设计

## 7.1 Markdown 渲染模块（`lib/markdown.ts`）

### 目标

1. 负责 Markdown -> HTML。
2. 处理代码高亮。
3. 注入主题内联样式。
4. 对异常 Markdown 文本做预清洗。

### 关键函数

1. `preprocessMarkdown(content)`：修复粗体、分隔线等异常。
2. `md.render(...)`：渲染 HTML。
3. `applyTheme(html, themeId, customTheme?)`：对 DOM 节点注入样式。

### 实现要点

1. 使用 `DOMParser` 解析后处理节点，避免纯字符串替换。
2. 对 `pre code`、`img`、`ul/ol`、`blockquote`、`table` 单独处理。
3. 图片网格尽量在渲染侧标准化，减少兼容侧压力。

---

## 7.2 智能粘贴模块（`lib/htmlToMarkdown.ts`）

### 目标

1. 粘贴富文本时转 Markdown。
2. 粘贴截图时自动插入 Markdown 图片。
3. 识别 IDE 复制内容，避免错误转换。

### 关键策略

1. 优先读 `clipboardData.files/items`，检测图片。
2. 若有 HTML，使用 turndown 转换。
3. 针对异常来源（例如 file://）做拦截。
4. 保留 Markdown 原生粘贴（不重复转换）。

### 边界场景

1. 多图一次粘贴。
2. 大段代码块（避免被误转普通段落）。
3. 无权限读取剪贴板图片。

---

## 7.3 微信兼容模块（`lib/wechatCompat.ts`）

### 目标

输出可被微信公众号编辑器稳定接受的 HTML。

### 核心规则

1. 根容器改为 `section`。
2. 将图片 `flex` 网格转换为 `table`。
3. 扁平化复杂 `li` 内部结构。
4. 字体样式下发到文本节点，减少继承丢失。
5. 外链图片转 base64，避免第三方防盗链。

### 典型兼容问题

1. 微信对 `display:flex` 支持不稳定。
2. `ul/ol` 层级在粘贴后易错乱。
3. 部分节点颜色/字号会被编辑器重置。

---

## 7.4 导出模块（`lib/wordExport.ts` + pdf）

### HTML 导出

1. 直接将渲染结果写入 Blob。
2. 使用安全文件名和时间戳。

### PDF 导出

1. 选择预览 DOM 节点克隆。
2. 设置白/黑底一致性。
3. `scale` 建议 2（清晰度与性能平衡）。

### Word 导出

1. DOC：HTML 包装为 Word 可识别文档。
2. DOCX：最小 OpenXML 包 + `altChunk`。
3. 兼容建议：优先提供 `.docx`。

---

## 7.5 统计与洞察模块（`lib/documentMetrics.ts`）

### 计算项

1. 字符数、行数、段落数。
2. 标题数、图片数、链接数、代码块数。
3. 阅读时长估算（英文词 + 中文字）。

### 价值

1. 给创作者即时反馈。
2. 给发布前审校提供结构建议。

---

## 8. UI 交互设计建议

### 8.1 布局

1. 顶部：品牌 + 全局开关（亮暗模式）。
2. 中部工具栏：主题选择、设备切换、复制导出。
3. 主区：编辑器 + 预览区 + 侧边洞察。
4. 移动端：编辑/预览双 Tab。

### 8.2 可用性细节

1. 复制成功状态反馈（2 秒自动消失）。
2. 导出过程 loading。
3. 关键按钮提供快捷键提示。
4. 失败时提供可理解错误文案。

### 8.3 快捷键建议

1. `Ctrl/Cmd + S`：复制到公众号。
2. `Ctrl/Cmd + Shift + P`：导出 PDF。
3. `Ctrl/Cmd + Shift + H`：导出 HTML。
4. `Ctrl/Cmd + 1/2/3`：切换设备预览。

---

## 9. 状态管理与拆分建议

### 9.1 推荐拆分

1. `useWorkspaceState`：核心状态。
2. `useAutosave`：防抖保存、最后保存时间。
3. `useScrollSync`：编辑区与预览区联动。
4. `useShortcuts`：统一快捷键。

### 9.2 为什么拆分

1. 避免 `App.tsx` 巨石化。
2. 每个 hook 可单测。
3. 后续加功能时减少回归风险。

---

## 10. 本地存储与版本迁移

### 10.1 存储键设计

1. 给 key 带版本号，例如 `tool_markdown_v3`。
2. 把模板版本单独存储，例如 `template_version_v1`。

### 10.2 迁移策略

1. 启动时读取模板版本。
2. 旧默认模板才自动升级，用户自定义内容不覆盖。
3. 迁移后写入新版本标记。

---

## 11. 性能与稳定性优化

### 11.1 性能

1. Markdown 渲染防抖（100~200ms）。
2. 统计计算用 `useMemo`。
3. 导出库按需加载（dynamic import）。
4. 高亮仅注册常用语言。

### 11.2 稳定性

1. 对外部链接图像转换设置超时与失败降级。
2. 剪贴板 API 不可用时降级到纯文本复制。
3. 异常捕获统一上报（console + 可选埋点）。

---

## 12. 安全、合规与版权

1. 默认不上传用户文档内容。
2. 清晰声明第三方依赖许可证。
3. 素材与图标可再分发范围要在文档中声明。
4. 若后续加云存储，需补隐私政策与数据删除机制。

---

## 13. 开发计划（建议 6 周）

### 第 1 周：骨架搭建

1. 初始化工程与代码规范。
2. 双栏编辑预览。
3. Markdown 渲染链路跑通。

验收：可输入 Markdown 并实时预览。

### 第 2 周：主题系统

1. 主题数据结构与注入器。
2. 主题切换 UI。
3. 基础暗色模式。

验收：至少 8 套主题稳定切换。

### 第 3 周：智能粘贴

1. Turndown 转换。
2. 图片粘贴插入。
3. IDE/特殊来源识别。

验收：飞书/Notion/Word 粘贴可用。

### 第 4 周：复制与微信兼容

1. 复制 HTML 到剪贴板。
2. 图片网格和列表兼容转换。
3. 外链图转 base64。

验收：公众号后台粘贴后排版可接受。

### 第 5 周：导出能力

1. HTML/PDF 导出。
2. DOC/DOCX 导出。
3. 文件名与下载流程完善。

验收：四种导出格式均可下载并打开。

### 第 6 周：打磨与发布

1. 快捷键、自动保存、状态提示。
2. 单测 + E2E 核心用例。
3. README 与上线文档。

验收：Lint/TS/构建通过，核心流程无阻断。

---

## 14. 测试策略（务必执行）

### 14.1 单元测试（Vitest/Jest）

1. `preprocessMarkdown`：异常语法修复。
2. `extractHeadings`：标题层级和行号。
3. `createExportFilename`：字符清洗与长度截断。
4. `wechatCompat`：关键规则转换。

### 14.2 E2E（Playwright）

1. 粘贴富文本 -> 编辑器结果正确。
2. 主题切换 -> 预览更新。
3. 复制按钮 -> 剪贴板包含 html/plain。
4. 导出按钮 -> 触发下载。

### 14.3 手工回归清单

1. 亮色/暗色切换。
2. 手机/平板/桌面预览。
3. 大文档（1w 字）输入流畅性。
4. 网络慢或断网时导出与复制行为。

---

## 15. 常见问题与排障手册

### 15.1 中文乱码

1. 统一 UTF-8 编码。
2. 检查编辑器默认编码和 Git 提交编码。
3. 避免不同平台反复转码。

### 15.2 构建失败（权限）

1. 避免把 `tsBuildInfoFile` 放到受限目录。
2. 可改到项目本地 `.cache/ts/`。

### 15.3 复制失败

1. 检查浏览器是否支持 `ClipboardItem`。
2. 检查权限与 HTTPS/localhost 场景。
3. 降级为 `writeText()`。

### 15.4 PDF 模糊

1. 提高 `scale`。
2. 控制导出容器宽度。
3. 避免导出时缩放过大。

---

## 16. 代码质量标准（团队协作建议）

1. `TypeScript strict` 必开。
2. 所有新模块必须有类型定义。
3. 禁止在 UI 组件中堆积复杂业务逻辑。
4. 每个 PR 至少覆盖一项测试或手工验证截图。
5. 所有导出/复制逻辑必须有错误处理与用户提示。

---

## 17. 最小可用代码骨架（示例）

```ts
// pseudo-flow
const markdown = preprocessMarkdown(markdownInput);
const rawHtml = md.render(markdown);
const themedHtml = applyTheme(rawHtml, activeTheme, customTheme);
setRenderedHtml(themedHtml);

async function onCopyToWechat() {
  const safeHtml = await makeWeChatCompatible(themedHtml, activeTheme);
  await writeClipboard(safeHtml, extractPlainText(safeHtml));
}

async function onExportPdf() {
  const html2pdf = await import('html2pdf.js');
  await html2pdf.default().set(options).from(domNode).save();
}
```

---

## 18. 上线前检查清单（Go-Live Checklist）

1. `npm run lint` 通过。
2. `npx tsc --noEmit` 通过。
3. `npm run build` 通过。
4. 核心浏览器兼容性检查（Chrome/Edge/Safari）。
5. 公众号后台真实粘贴验证。
6. 第三方许可证与素材声明文件齐全。

---

## 19. 后续升级路线（建议优先级）

1. 高优先：App 状态拆分、错误监控、编码质量。
2. 中优先：模板系统、文章版本管理、草稿箱。
3. 低优先：协作编辑、AI 增强、插件市场。

---

## 20. 总结

该工具的核心竞争力不在「Markdown 编辑器」本身，而在于：

1. 多来源粘贴的稳定清洗能力。
2. 微信场景的可用性兼容能力。
3. 一键发布/导出的效率闭环。

只要按本手册分阶段推进，你可以在 4~6 周内做出一款可上线、可持续演进的产品版本。
