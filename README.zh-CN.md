# Markdown Publish Tool

[English](README.md) | [简体中文](README.zh-CN.md)

一个面向文章排版发布场景的 Markdown 工具，重点解决主题排版、公众号复制和多格式导出这几个最后一公里问题。

## 为什么做这个项目

很多 Markdown 工具只做到基础预览，这个项目更关注真正发布前的整理流程：

- 更好看的文章排版
- 更丰富的标题模板
- 更适合公众号的复制链路
- 更方便的导出与归档

## 功能特性

- Markdown 实时编辑与预览
- 多种文章主题切换
- 多种代码块样式
- 丰富的标题模板与视觉样式
- 分组展示的标题模板选择器
- 适配公众号的富文本复制流程
- 导出 HTML、DOC、DOCX-lite
- 本地自动保存、文档统计、设备预览

## 使用流程

1. 在编辑区输入 Markdown
2. 选择主题和标题模板
3. 在手机、平板、桌面宽度下预览文章
4. 复制到公众号或导出为 HTML / DOC / DOCX-lite

## 技术栈

- React 18
- TypeScript
- Vite
- markdown-it
- Turndown
- highlight.js

## 快速开始

安装依赖：

```bash
npm install
```

启动本地开发：

```bash
npm run dev
```

局域网访问：

```bash
npm run dev:host
```

Windows 快速启动脚本：

```bash
快速启动.bat
```

如果你在 Windows 本地使用，这个脚本适合双击直接启动项目。

生产构建：

```bash
npm run build
```

运行测试：

```bash
npm test
```

## 项目结构

```text
src/
  app/          应用壳层与页面编排
  components/   UI 组件
  hooks/        复用型 React Hooks
  lib/          Markdown、导出、兼容、主题等核心逻辑
  styles/       全局样式
  types/        共享 TypeScript 类型
docs/           产品与实现文档
```

## 路线图

- 继续增强公众号复制兼容兜底
- 将 DOCX 导出升级为真正的 docx 生成方案
- 为模板选择器补更真实的缩略预览
- 增加渲染与导出相关测试
- 提供在线演示地址

## 贡献

欢迎提交 Issue 和 Pull Request。开始之前请先阅读 `CONTRIBUTING.md`。

## 社区文件

- `CODE_OF_CONDUCT.md`
- `CONTRIBUTING.md`
- GitHub Issue 模板
- Pull Request 模板

## 许可证

MIT，详见 `LICENSE`。
