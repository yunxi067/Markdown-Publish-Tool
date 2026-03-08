import type { Locale } from "../types";

export interface UiText {
  appTitle: string;
  subtitle: string;
  themeCategoryLabel: string;
  themeCategoryAll: string;
  themeCategoryLight: string;
  themeCategoryDark: string;
  themeCategoryEditorial: string;
  themeCategoryTech: string;
  themeCategoryNature: string;
  themeLabel: string;
  codeStyleLabel: string;
  headingStyleLabel: string;
  headingH1Label: string;
  headingH2Label: string;
  headingH3Label: string;
  headingFeaturedLabel: string;
  headingFeaturedDreamy: string;
  headingFeaturedEditorial: string;
  headingFeaturedMinimal: string;
  headingApplyAllLabel: string;
  headingAdvancedLabel: string;
  headingAdvancedHide: string;
  headingOptionClassic: string;
  headingOptionBar: string;
  headingOptionCard: string;
  headingOptionCapsule: string;
  headingOptionMinimal: string;
  headingOptionPastel: string;
  headingOptionShadow: string;
  headingOptionNumbered: string;
  headingOptionFrame: string;
  headingOptionBanner: string;
  headingOptionTwinkle: string;
  headingOptionMist: string;
  headingOptionChapter: string;
  headingOptionMono: string;
  headingOptionCoral: string;
  headingOptionUnderline: string;
  headingOptionCorner: string;
  headingOptionSeal: string;
  headingDecorationLabel: string;
  headingDecorationEnable: string;
  headingDecorationStyleLabel: string;
  headingDecorationAuto: string;
  headingDecorationGem: string;
  headingDecorationCross: string;
  headingDecorationTriangle: string;
  headingDecorationRing: string;
  headingDecorationSpark: string;
  headingDecorationRibbon: string;
  headingDecorationBloom: string;
  headingDecorationOrbit: string;
  codeStyleAuto: string;
  codeStyleMac: string;
  codeStyleNight: string;
  codeStylePaper: string;
  codeStyleMatrix: string;
  selectionColorLabel: string;
  applySelectionColor: string;
  editorTitle: string;
  previewTitle: string;
  insightsTitle: string;
  autosavedLabel: string;
  statusReady: string;
  statusCopied: string;
  statusCopyFailed: string;
  statusPasted: string;
  statusExportedHtml: string;
  statusExportedDoc: string;
  statusExportedDocx: string;
  statusImportedMd: string;
  statusImportFailedMd: string;
  statusImportEmptyMd: string;
  statusColorApplied: string;
  statusSelectTextFirst: string;
  importMd: string;
  copyWechat: string;
  exportHtml: string;
  exportDoc: string;
  exportDocx: string;
  insightsButton: string;
  lightLabel: string;
  darkLabel: string;
  langLabel: string;
  lines: string;
  chars: string;
  words: string;
  cjk: string;
  paragraphs: string;
  headings: string;
  images: string;
  codeBlocks: string;
  links: string;
  read: string;
  minute: string;
}

const zh: UiText = {
  appTitle: "Markdown 排版发布工具",
  subtitle: "智能粘贴、主题排版、一键发布",
  themeCategoryLabel: "主题分类",
  themeCategoryAll: "全部",
  themeCategoryLight: "浅色",
  themeCategoryDark: "深色",
  themeCategoryEditorial: "杂志",
  themeCategoryTech: "科技",
  themeCategoryNature: "自然",
  themeLabel: "主题",
  codeStyleLabel: "代码风格",
  headingStyleLabel: "标题组合",
  headingH1Label: "H1",
  headingH2Label: "H2",
  headingH3Label: "H3",
  headingFeaturedLabel: "精选模板",
  headingFeaturedDreamy: "梦幻系",
  headingFeaturedEditorial: "运营图系",
  headingFeaturedMinimal: "极简系",
  headingApplyAllLabel: "应用到全部标题",
  headingAdvancedLabel: "更多模板与分级设置",
  headingAdvancedHide: "收起",
  headingOptionClassic: "经典",
  headingOptionBar: "左条",
  headingOptionCard: "卡片",
  headingOptionCapsule: "胶囊",
  headingOptionMinimal: "极简",
  headingOptionPastel: "糖霜",
  headingOptionShadow: "叠影",
  headingOptionNumbered: "序号",
  headingOptionFrame: "线框",
  headingOptionBanner: "横幅",
  headingOptionTwinkle: "星糖",
  headingOptionMist: "雾影",
  headingOptionChapter: "章序",
  headingOptionMono: "极黑",
  headingOptionCoral: "橙芯",
  headingOptionUnderline: "荧笔",
  headingOptionCorner: "角标",
  headingOptionSeal: "印章",
  headingDecorationLabel: "标题装饰",
  headingDecorationEnable: "启用装饰",
  headingDecorationStyleLabel: "装饰风格",
  headingDecorationAuto: "自动",
  headingDecorationGem: "几何",
  headingDecorationCross: "十字",
  headingDecorationTriangle: "三角",
  headingDecorationRing: "圆环",
  headingDecorationSpark: "星芒",
  headingDecorationRibbon: "丝带",
  headingDecorationBloom: "花簇",
  headingDecorationOrbit: "轨道",
  codeStyleAuto: "自动(随主题)",
  codeStyleMac: "Mac 暗黑",
  codeStyleNight: "夜幕",
  codeStylePaper: "纸感",
  codeStyleMatrix: "矩阵",
  selectionColorLabel: "选区颜色",
  applySelectionColor: "应用到选中",
  editorTitle: "编辑区",
  previewTitle: "预览区",
  insightsTitle: "洞察",
  autosavedLabel: "自动保存",
  statusReady: "就绪",
  statusCopied: "已复制公众号格式",
  statusCopyFailed: "复制失败",
  statusPasted: "已完成粘贴转换",
  statusExportedHtml: "HTML 导出成功",
  statusExportedDoc: "DOC 导出成功",
  statusExportedDocx: "DOCX 导出成功",
  statusImportedMd: "MD 文档导入成功",
  statusImportFailedMd: "MD 文档导入失败",
  statusImportEmptyMd: "未选择文件",
  statusColorApplied: "已应用选区颜色",
  statusSelectTextFirst: "请先在预览区选中文本",
  importMd: "导入 MD",
  copyWechat: "复制到公众号",
  exportHtml: "导出 HTML",
  exportDoc: "导出 DOC",
  exportDocx: "导出 DOCX",
  insightsButton: "洞察",
  lightLabel: "浅色",
  darkLabel: "深色",
  langLabel: "语言",
  lines: "行数",
  chars: "字符",
  words: "英文词",
  cjk: "中文字符",
  paragraphs: "段落",
  headings: "标题",
  images: "图片",
  codeBlocks: "代码块",
  links: "链接",
  read: "阅读",
  minute: "分钟",
};

const en: UiText = {
  appTitle: "Markdown Publish Tool",
  subtitle: "Smart paste, themed preview, one-click publish.",
  themeCategoryLabel: "Theme Category",
  themeCategoryAll: "All",
  themeCategoryLight: "Light",
  themeCategoryDark: "Dark",
  themeCategoryEditorial: "Editorial",
  themeCategoryTech: "Tech",
  themeCategoryNature: "Nature",
  themeLabel: "Theme",
  codeStyleLabel: "Code Style",
  headingStyleLabel: "Heading Mix",
  headingH1Label: "H1",
  headingH2Label: "H2",
  headingH3Label: "H3",
  headingFeaturedLabel: "Featured",
  headingFeaturedDreamy: "Dreamy",
  headingFeaturedEditorial: "Editorial",
  headingFeaturedMinimal: "Minimal",
  headingApplyAllLabel: "Apply To All",
  headingAdvancedLabel: "More Templates & Levels",
  headingAdvancedHide: "Hide",
  headingOptionClassic: "Classic",
  headingOptionBar: "Bar",
  headingOptionCard: "Card",
  headingOptionCapsule: "Capsule",
  headingOptionMinimal: "Minimal",
  headingOptionPastel: "Pastel",
  headingOptionShadow: "Shadow",
  headingOptionNumbered: "Numbered",
  headingOptionFrame: "Frame",
  headingOptionBanner: "Banner",
  headingOptionTwinkle: "Twinkle",
  headingOptionMist: "Mist",
  headingOptionChapter: "Chapter",
  headingOptionMono: "Mono",
  headingOptionCoral: "Coral",
  headingOptionUnderline: "Underline",
  headingOptionCorner: "Corner",
  headingOptionSeal: "Seal",
  headingDecorationLabel: "Heading Decoration",
  headingDecorationEnable: "Enable",
  headingDecorationStyleLabel: "Style",
  headingDecorationAuto: "Auto",
  headingDecorationGem: "Gem",
  headingDecorationCross: "Cross",
  headingDecorationTriangle: "Triangle",
  headingDecorationRing: "Ring",
  headingDecorationSpark: "Spark",
  headingDecorationRibbon: "Ribbon",
  headingDecorationBloom: "Bloom",
  headingDecorationOrbit: "Orbit",
  codeStyleAuto: "Auto (Theme)",
  codeStyleMac: "Mac Dark",
  codeStyleNight: "Night",
  codeStylePaper: "Paper",
  codeStyleMatrix: "Matrix",
  selectionColorLabel: "Selection Color",
  applySelectionColor: "Apply To Selection",
  editorTitle: "Editor",
  previewTitle: "Preview",
  insightsTitle: "Insights",
  autosavedLabel: "Autosaved",
  statusReady: "Ready",
  statusCopied: "Copied for WeChat",
  statusCopyFailed: "Copy failed",
  statusPasted: "Pasted and converted",
  statusExportedHtml: "HTML exported",
  statusExportedDoc: "DOC exported",
  statusExportedDocx: "DOCX exported",
  statusImportedMd: "MD imported",
  statusImportFailedMd: "MD import failed",
  statusImportEmptyMd: "No file selected",
  statusColorApplied: "Selection color applied",
  statusSelectTextFirst: "Select text in preview first",
  importMd: "Import MD",
  copyWechat: "Copy WeChat",
  exportHtml: "Export HTML",
  exportDoc: "Export DOC",
  exportDocx: "Export DOCX",
  insightsButton: "Insights",
  lightLabel: "Light",
  darkLabel: "Dark",
  langLabel: "Language",
  lines: "Lines",
  chars: "Chars",
  words: "Words(EN)",
  cjk: "CJK",
  paragraphs: "Paragraphs",
  headings: "Headings",
  images: "Images",
  codeBlocks: "Code blocks",
  links: "Links",
  read: "Read",
  minute: "min",
};

export function getUiText(locale: Locale): UiText {
  return locale === "en" ? en : zh;
}
