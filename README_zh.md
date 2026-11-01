# Selene 中文使用文档

Selene 是 Hugo 主题。主题包含模板、CSS、JavaScript、
字体、图标与文章原型；个人文章、头像、文章配图、站点配置和构建产物不属于主题。
`exampleSite/` 提供可独立运行的中文示例，不包含原博客的评论凭据。

## 环境要求

- Hugo **0.158.0 或更新版本**（示例配置使用 `locale`）。
- 普通版 Hugo 即可；无需 Extended、Dart Sass、Node.js 或 npm 安装。
- 浏览器需启用 JavaScript 才能使用目录交互、主题切换、代码复制和评论等功能。

## 选择使用方式

`exampleSite/` 是用于演示和验证主题的示例站点，包含配置、示例文章、项目页和关于页；
主题功能由仓库根目录的 `layouts/`、`assets/`、`static/` 和 `archetypes/` 提供。
可以根据需要选择以下方式：

| 方式 | 文件组织 | 适合场景 | 更新方式 |
| --- | --- | --- | --- |
| 可复用主题 | 自己的站点保存配置和内容，Selene 放在 `themes/selene/` | 已有 Hugo 站点，或希望独立更新主题 | 更新主题子模块 |
| 完整博客模板 | 配置、`content/` 与主题模板、资源都放在仓库根目录 | 希望下载后直接写作和运行 | 使用 Git 合并上游更新并处理冲突，或手动同步文件 |

作为可复用主题发布时，保留 `exampleSite/` 方便预览和维护，示例内容不会自动成为用户站点的文章。
作为自己的博客模板使用时，可以将示例配置和内容复制到根目录；完成后不再需要引用外部主题。
下面分别说明操作步骤。

## 安装到现有站点

在 Hugo 站点根目录执行：

```sh
git submodule add https://github.com/zhuzaiye/selene.git themes/selene
```

也可直接将主题复制到 `themes/selene/`，目录中应直接包含 `theme.toml`、`layouts/` 等文件。
在站点的 `hugo.toml` 或 `config.toml` 顶层启用主题：

```toml
baseURL = "https://example.org/"
locale = "zh-CN"
theme = "selene"

[pagination]
  pagerSize = 10

[markup.highlight]
  noClasses = false

[params]
  author = "你的名字"
  description = "记录思考，分享作品。"
  theme = "toggle"
  toc = true

  [[params.menu]]
    name = "文章"
    url = "/posts/"
  [[params.menu]]
    name = "项目"
    url = "/projects/"
  [[params.menu]]
    name = "关于"
    url = "/about/"
```

顶层 `theme` 选择 Hugo 主题；`params.theme` 控制深浅模式，两者用途不同。
已有站点根目录中的 `layouts/`、同路径 `assets/`、`static/` 文件会覆盖主题资源。
若从原 Tracelog 切换到主题，先备份，再移走重复模板和资源，以便后续更新主题能生效；
保留个人 `content/`、`static/imgs/` 与站点配置。

## 预览示例与构建

在主题仓库根目录执行（目录名应为 `selene`）：

```sh
hugo server --source exampleSite --themesDir ../.. --theme selene -D
```

也可以把 `exampleSite/` 中的配置和内容复制到自己的 Hugo 站点，再安装主题。
在自己的站点根目录执行：

```sh
hugo server -D
hugo --baseURL https://example.org/
```

默认预览地址为 `http://localhost:1313/`，构建产物输出到站点的 `public/`。
正式构建默认不包含草稿；发布前将文章 `draft` 改为 `false`。
主题随附字体 CSS 使用 `/fonts/` 绝对路径，建议部署在域名根路径；
部署到 `/blog/` 等子路径时，需要在站点覆盖 `assets/css/fonts.css`，调整字体 URL。

## 将仓库作为完整博客模板使用

以下操作适用于刚下载的仓库副本。若根目录已有自己的配置或 `content/`，先备份，
再手动合并配置和内容，避免覆盖同名文件。

1. 下载仓库并进入目录。也可下载 ZIP、解压后在终端进入解压目录：

   ```sh
   git clone https://github.com/zhuzaiye/selene.git
   cd selene
   ```

2. 备份根目录的主题默认配置，再用示例配置替换它，并复制示例内容：

   ```sh
   cp hugo.toml hugo.toml.bak
   cp exampleSite/hugo.toml hugo.toml
   cp -R exampleSite/content ./
   ```

   当前示例站点只包含配置和 `content/`。如果以后添加了 `exampleSite/static/` 等站点资源，
   也需将其中的文件合并到根目录对应目录，保留根目录原有的主题资源。

3. 编辑根目录的 `hugo.toml`：删除顶层的 `theme = "selene"`，因为 Hugo 会直接使用
   根目录中的模板和资源。保留 `[params]` 下的 `theme = "toggle"`，它控制深浅模式。
   将 `baseURL`、`title`、`locale`、作者、描述、菜单和社交链接改为自己的设置。
   英文站点可使用 `locale = "en-US"`；示例内容本身仍为中文，需要自行修改。

4. 在根目录直接预览和构建，不再使用 `--source exampleSite`、`--themesDir` 或 `--theme`：

   ```sh
   hugo server -D
   ```

   预览地址为 `http://localhost:1313/`。确认效果后停止预览服务，再构建：

   ```sh
   hugo
   ```

   构建结果位于根目录的 `public/`。发布前设置正确的 `baseURL`，并将需要发布的文章设为 `draft: false`。

5. 此后在根目录的 `content/posts/` 写文章，在 `content/projects/` 管理项目，
   编辑 `content/about.md`，并将个人图片放到根目录的 `static/imgs/`。
   `exampleSite/` 不再参与默认构建，可保留作参考，也可在确认迁移完成后删除。
   根目录的 `layouts/`、`assets/`、`static/` 和 `archetypes/` 仍是站点所需的主题文件，应保留。

这种方式仍然可以更新，但不能通过主题子模块单独升级。使用 Git 时，先将自己的博客保存到个人仓库，
将 Selene 原仓库设为上游，更新前提交或备份个人修改，再合并需要的上游变更并处理冲突；
尤其检查根目录的 `hugo.toml`，避免恢复主题引用或丢失个人配置。若使用 ZIP 下载，则需手动比较并同步更新。
更新后重新预览并构建，确认个人文章、图片和配置保持正确。希望长期独立升级主题时，优先使用前面的子模块方式。

## 站点设置

以下配置均放在 `[params]` 下：

| 字段 | 用途 |
| --- | --- |
| `author` | 默认作者；文章的 `author` 优先，最后回退到站点标题 |
| `description` | 站点描述，页面未设置描述时用于 meta |
| `theme` | `light` 固定浅色、`dark` 固定深色、`auto` 跟随系统、`toggle` 手动切换；默认 `toggle` |
| `toc` | 显示文章目录，默认 `true`；文章需包含 Markdown 标题 |
| `avatar` | 文末作者头像，路径相对于 `static/`，如 `/imgs/avatar.png` |
| `home_avatar` | 导航圆形头像；依次回退到 `avatar`、`logo`、内置人物图标 |
| `logo` | 未配置头像时使用的导航图片 |
| `favicon` | 相对于 `assets/` 的图片路径，如 `imgs/favicon.png` |
| `stylesheets` | 额外 CSS 资源数组，相对于 `assets/`，如 `["css/custom.css"]` |
| `mathjax` | 是否从 CDN 加载 MathJax，默认关闭 |
| `mathjax_dollar_inline_enable` | 是否允许 `$...$` 行内公式，需同时开启 `mathjax` |
| `use_cdn` | 是否额外加载 CDN 字体，默认关闭 |

菜单使用 `[[params.menu]]`，按配置中的顺序显示。社交链接示例：

```toml
[[params.social]]
  name = "GitHub"
  url = "https://github.com/yourname"
  icon = "github"
[[params.social]]
  name = "邮箱"
  url = "mailto:you@example.org"
  icon = "email"
[[params.social]]
  name = "RSS"
  url = "/index.xml"
  icon = "rss"
```

`icon` 对应 `static/icons/social/` 下不含 `.svg` 的文件名。
RSS 使用 Hugo 默认的 `/index.xml` 输出。

## 写文章

在站点根目录执行，主题原型会生成草稿：

```sh
hugo new content posts/hello.md
```

文章位于 `content/posts/`，front matter 示例：

```yaml
---
title: "第一篇文章"
date: 2026-01-01T10:00:00+08:00
draft: false
description: "文章摘要"
author: "作者名字"
tags: ["Hugo", "笔记"]
comment: true
cover_image: "/imgs/hello.svg"
---
```

图片放入站点 `static/imgs/`，正文通过 `/imgs/文件名` 引用。
首页展示 `posts` 分区文章；`/posts/` 使用横向卡片，未设置封面时仅显示文字。
标签按填写顺序显示并链接到归档，相同标签保持相同颜色。

文章使用 760px 阅读栏，桌面端目录位于侧边，窄屏目录可展开。
代码块支持复制，超过 24 行可展开或收起；设置 `markup.highlight.noClasses = false`
可使用主题自带的语法高亮配色。宽表格支持横向滚动。
手机端互动栏固定在底部，桌面端位于文末。
点赞仅保存在当前浏览器的 `localStorage` 中，不是全站统计；
分享使用系统分享接口或复制链接；评论按钮定位到已配置的 Gitalk 编辑区。

## 项目页与关于页

项目文件放在 `content/projects/`，使用以下字段：

```yaml
---
title: "示例项目"
draft: false
weight: 1
description: "项目简介"
local_image: "/imgs/project.png"
link_to: "https://github.com/yourname/project"
source: "GitHub"
comment: false
---
```

项目按 `weight` 排序。`remote_image` 可替代 `local_image` 使用远程图片；
未配置图片时显示标题首字。`source` 未填写时使用外链域名。
未设置 `link_to` 时链接到项目自身的详情页。

关于页位于 `content/about.md`，设置 `type: about`、`comment: false`。
普通 Markdown 即可；需要示例中的自定义介绍布局时，可参考 `exampleSite/content/about.md`。
原始 HTML 布局需要在站点配置启用：

```toml
[markup.goldmark.renderer]
  unsafe = true
```

## 短代码与公式

提示块支持标题和点击展开，示例：

```text
{{< note header="提示" clickable=true center=false >}}
这里可以写 **Markdown** 内容。
{{< /note >}}
```

`clickable`、`center` 默认关闭。当前 `hidden=true` 会输出空内容容器，
需要保留正文时请省略该参数。

流程图使用内置 Mermaid 资源：

```text
{{< mermaid >}}
graph LR
  A[开始] --> B[完成]
{{< /mermaid >}}
```

数学公式需设置 `params.mathjax = true`；块级公式可使用 `$$...$$`，
行内 `$...$` 还需启用 `mathjax_dollar_inline_enable`。

## Gitalk 评论（可选）

默认不启用。需要时，在站点配置中填写自己的 GitHub 仓库与 OAuth 应用配置：

```toml
[params.gitalk]
  owner = "your-github-username"
  repo = "your-comments-repo"
  clientId = "your-oauth-client-id"
  clientSecret = "your-oauth-client-secret"
```

仓库需开启 Issues，OAuth 回调地址需与站点匹配。Gitalk 采用浏览器端 OAuth，
这里的配置会输出到公开网页，不应当将此字段视为服务端保密存储。
删除整个配置块即可关闭评论；单页可设置 `comment: false`。

主题固定加载 Gitalk 1.8.0 的 JS 和 CSS，依赖 GitHub API 及 CDN 网络连接。
未初始化的文章由仓库作者登录后点击初始化按钮创建 Issue。
文章日期用于关联讨论，迁移时应保留已有日期，避免关联到新的讨论。

评论支持话题分组、回复、Markdown 预览、分页和会话草稿。
每次加载 50 条留言，超过 3 条回复的话题可展开。
回复正文末尾的 `tracelog-thread:v1` 隐藏标记保存父留言和根话题 ID，
请在 GitHub 编辑评论时保留；旧评论没有标记时作为独立话题显示。

## 可选功能的边界

MathJax、Gitalk 和 CDN 字体需要外部网络；普通页面、主题资源与字体随站点部署。
当前保留了 Elasticlunr 搜索脚本和加载配置，但没有附带索引生成模板及搜索入口，
不能仅通过 `build_search_index = true` 获得完整搜索功能，默认应保持关闭。
统计脚本保留在 `assets/js/imamu.js`、`count.js`；按需接入前应自行验证配置与服务可用性。

## 目录与维护

```text
selene/
├── archetypes/default.md      # 新文章原型
├── assets/css/
│   ├── fonts.css              # 字体声明
│   ├── main.css               # 基础样式与页面布局
│   ├── parts/                 # 文章、目录、评论、卡片等模块
│   └── theme/                 # 深浅配色变量
├── assets/js/                 # 代码块、目录、互动与评论逻辑
├── exampleSite/               # 中文示例站点
├── hugo.toml                  # 可被站点覆盖的主题默认值
├── layouts/                   # Hugo 模板、partials、shortcodes
├── static/fonts/              # 本地字体
├── static/icons/              # 主题图标与社交图标
└── theme.toml                 # 主题元信息
```

`layouts/partials/styles.html` 显式管理公共 CSS 的加载顺序，合并、压缩并生成内容指纹。
新增模块样式时需加入其中的 `$paths` 列表。使用普通 CSS，不使用 Sass 语法。
额外样式在公共样式之后加载，推荐通过站点 `assets/css/custom.css` 与 `params.stylesheets`
完成个性化覆盖，减少升级主题时的冲突。

文章样式位于 `parts/post.css`，目录位于 `parts/toc.css` 与 `js/toc.js`，
评论位于 `parts/comments.css` 与 `js/comments.js`，代码交互位于 `js/codeblock.js`。
原项目已有压缩版 `main.min.js`，模板直接加载它；修改 `main.js` 时需要同步压缩版本。
独立加载的 `codeblock.js`、`comments.js`、`toc.js` 等由 Hugo 构建时压缩并生成指纹。

更新子模块后预览并构建验证，再提交主站点记录的子模块版本：

```sh
git submodule update --init --recursive
git -C themes/selene pull --ff-only
hugo
```

主题保留原有第三方资源及文件内声明，社交图标许可见
[`static/icons/social/LICENSE`](static/icons/social/LICENSE)。
Selene 采用 [MIT 许可证](LICENSE)；字体等第三方资源仍遵循各自的许可证。
