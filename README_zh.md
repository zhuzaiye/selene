# Selene — 简洁优雅的 Hugo 主题

Selene 是一个为个人博客设计的极简 Hugo 主题，灵感来源于微信公众号排版风格，支持亮/暗主题切换、丰富的 shortcodes、内置搜索。

[效果预览](https://zhuzaiye.github.io)

![theme preview](https://img.shields.io/badge/Hugo-%3E%3D0.110.0-blue) ![license](https://img.shields.io/badge/license-MIT-green)

## 功能特性

- **亮/暗主题切换** — 支持 `light`、`dark`、`auto`、`toggle` 四种模式，遵循系统 `prefers-color-scheme`
- **微信公众号风格** — 封面图、作者栏、点赞/分享/评论按钮
- **目录导航** — 文章页面粘性侧边栏目录
- **MathJax** — LaTeX 数学公式渲染，支持行内 `$...$`
- **Mermaid 图表** — 随主题自动适配明暗的图表渲染
- **内置搜索** — 基于 elasticlunr.js 的全文搜索
- **Gitalk 评论** — 基于 GitHub Issues 的评论系统
- **40+ 社交图标** — GitHub、Twitter、RSS、邮箱等 SVG 图标
- **自定义字体** — JetBrains Mono（代码）、Space Grotesk & Zed（正文/标题）
- **响应式设计** — 适配移动端
- **访问统计** — 支持 Umami 和 GoatCounter
- **Note shortcode** — 可折叠的提示框
- **分页导航** — 数字页码
- **RSS/Atom** — 自动生成订阅源
- **语法高亮** — 使用 Hugo Chroma 的 Dracula 配色方案

## 主题结构

```
selene/
├── theme.toml          # 主题元信息 + 示例配置
├── README.md           # 完整文档
├── archetypes/
│   └── default.md
├── assets/
│   ├── js/             # 13 个 JS 文件 (主题切换、搜索、mermaid、toc 等)
│   └── sass/
│       ├── main.scss / fonts.scss
│       ├── parts/      # 10 个 SCSS 部分文件
│       └── theme/      # light.scss + dark.scss
├── layouts/
│   ├── _default/       # baseof, single, taxonomy
│   ├── partials/       # header, nav, cards, comments, macros 等
│   ├── shortcodes/     # mermaid, note
│   ├── posts/ + projects/
│   └── index, 404, robots.txt, sitemap.xml
└── static/
    ├── fonts/          # JetBrainsMono, SpaceGrotesk, Zed
    └── icons/          # 40+ 社交图标 + sun/moon/search SVG
```

### 抽取取舍

| 包含（主题通用资源）       | 排除（站点特定内容）            |
| -------------------------- | ------------------------------- |
| `layouts/` — 所有模板      | `content/` — 博客文章和页面     |
| `assets/` — JS、SCSS       | `static/imgs/` — 文章配图、截图 |
| `archetypes/` — 默认模板   | `config.toml` — 个人配置含密钥  |
| `static/fonts/` — 字体文件 | `public/` — 构建输出            |
| `static/icons/` — 主题图标 | `resources/` — Hugo 缓存        |

`theme.toml` 中提供了完整的示例配置，替换占位符即可使用。

## 快速开始

### 方式一：Git Submodule

```sh
hugo new site my-blog
cd my-blog
git init
git submodule add https://github.com/zhuzaiye/selene.git themes/selene
echo "theme = 'selene'" >> hugo.toml
```

### 方式二：Hugo Modules

```sh
hugo new site my-blog
cd my-blog
hugo mod init my-blog
# 在 hugo.toml 中添加：
#   theme = "github.com/zhuzaiye/selene"
```

### 方式三：直接拷贝

```sh
cp -r /path/to/selene my-blog/themes/selene
echo "theme = 'selene'" >> my-blog/hugo.toml
```

## 构建

如果需要在构建时指定站点的 base URL，可以使用下面的命令：

```sh
hugo -b <baseUrl>
```

## 配置

将以下示例配置复制到你站点的 `hugo.toml`（或 `config.toml`）中，按需修改。

```toml
baseURL = "https://example.com/"
title = "My Blog"
languageCode = "en-us"
paginate = 10
theme = "selene"

[markup]
  [markup.highlight]
    style = "dracula"
    noClasses = false
  [markup.goldmark.renderer]
    unsafe = true  # 允许 Markdown 中使用原始 HTML

[params]
  description = "My personal blog"
  avatar = "/imgs/avatar.png"    # 文章底部作者栏头像
  theme = "toggle"               # light | dark | auto | toggle
  toc = true                     # 启用文章目录
  mathjax = true                 # 启用数学公式
  mathjax_dollar_inline_enable = true
  build_search_index = false     # 设为 true 启用 elasticlunr 搜索
  use_cdn = false                # 设为 true 使用 CDN 加载字体

  # 导航菜单
  [[params.menu]]
    name = "/posts"
    url = "/posts"
    weight = 1
  [[params.menu]]
    name = "/about"
    url = "/about"
    weight = 2

  # 社交链接 — 图标名称对应 static/icons/social/ 下的文件名
  [[params.social]]
    name = "github"
    url = "https://github.com/yourname"
    icon = "github"
  [[params.social]]
    name = "email"
    url = "mailto:you@example.com"
    icon = "email"
  [[params.social]]
    name = "rss"
    url = "/index.xml"
    icon = "rss"

  # Gitalk 评论（不需要可删除此节）
  [params.gitalk]
    owner = "your-github-username"
    repo = "your-repo"
    clientId = "your-client-id"
    clientSecret = "your-client-secret"

  # 访问统计（不需要可删除对应节）
  [params.analytics]
    [params.analytics.umami]
      website_id = "your-website-id"
      host_url = "https://api-gateway.umami.dev/"
    [params.analytics.goatcounter]
      user = "your-goatcounter-user"
      host = "goatcounter.com"
```

### 主题模式

| 值       | 行为                                   |
| -------- | -------------------------------------- |
| `light`  | 始终亮色                               |
| `dark`   | 始终暗色                               |
| `auto`   | 跟随系统 `prefers-color-scheme`        |
| `toggle` | 手动切换按钮 + `localStorage` 记住选择 |

## 内容写作

### 创建文章

```sh
hugo new posts/2024-01-01-hello-world.md
hugo serve -D   # -D 包含草稿文章
```

### 前置元数据（Frontmatter）

```yaml
---
title: "Hello World"
date: 2024-01-01
draft: true
description: "文章简述，用于列表预览和 SEO"
comment: true               # 在该页面启用 Gitalk 评论
cover_image: "/imgs/cover.svg"  # 公众号风格的封面图
tags: ["tag1", "tag2"]
---
```

### Shortcodes

**Note** — 可折叠提示框：

```go
{{</* note header="提示" clickable=true hidden=false center=false */>}}
这是提示框中的内容。
{{</* /note */>}}
```

参数：`header`（标题）、`clickable`（可点击展开/收起）、`hidden`（初始折叠）、`center`（标题居中）。

**Mermaid** — 图表：

```go
{{</* mermaid */>}}
graph TD;
  A-->B;
  A-->C;
  B-->D;
  C-->D;
{{</* /mermaid */>}}
```

## 搜索

启用搜索，在 `hugo.toml` 中添加：

```toml
[params]
  build_search_index = true
  search_index_format = "elasticlunr_json"  # 或 "elasticlunr_javascript"
```

搜索索引在构建时生成，前端由 `searchElasticlunr.js` 处理。

## 评论系统

本主题使用 [Gitalk](https://github.com/gitalk/gitalk) — 评论以 GitHub Issues 的形式存储在你指定的仓库中。在站点配置中设置 `[params.gitalk]` 即可。如果某篇文章不需要评论，在其 frontmatter 中设置 `comment: false`。

## 访问统计

支持两种统计服务：

- **Umami** — 注重隐私、可自托管的统计
- **GoatCounter** — 轻量级开源统计

在 `[params.analytics]` 中配置一个或两个，不需要的节可删除。

## 字体

主题内置了三款字体：

| 字体             | 用途             | 字重                 |
| ---------------- | ---------------- | -------------------- |
| JetBrains Mono   | 代码块、行内代码 | Regular, Bold        |
| Space Grotesk    | 标题（回退字体） | Regular, Bold        |
| Zed Text/Display | 正文、标题       | Regular, Bold, Heavy |

设置 `use_cdn = true` 可以通过 CDN 加载 JetBrains Mono 和 Space Grotesk，节省本地静态资源。

## 更新主题

如果是通过 git submodule 安装：

```sh
cd themes/selene
git pull origin master
```

## 许可证

MIT © [hzzhu92](https://github.com/zhuzaiye)

`static/icons/social/` 中的社交图标来自 [Simple Icons](https://simpleicons.org/)，同样使用 MIT 许可证。
