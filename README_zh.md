# Selene 中文使用文档

Selene 是 Hugo 博客主题，提供深浅模式、文章目录、代码复制与折叠、项目页、Mermaid、MathJax 和可选的 Gitalk 评论。

## 环境要求

- Hugo **0.158.0 或更新版本**，普通版即可，无需 Extended、Sass、Node.js 或 npm。
- 目录交互、主题切换、代码复制和评论需要浏览器启用 JavaScript。

## 配置文件与 exampleSite 的作用

| 文件或目录 | 用途 | 是否需要修改 |
| --- | --- | --- |
| `theme.toml` | 主题名称、作者、许可证等元信息；不用于配置站点 | 使用主题时不需要修改 |
| 根目录 `hugo.toml` | 主题默认设置，供使用主题的站点继承 | 个人配置应写在自己的站点中 |
| `exampleSite/hugo.toml` | 完整的站点配置示例，包含站点信息、菜单和可选功能 | 复制到自己的站点根目录后修改 |
| `exampleSite/content/` | 示例文章、项目和关于页 | 复制到自己的站点后替换为个人内容 |
| `layouts/`、`assets/`、`static/`、`archetypes/` | 主题模板、样式、脚本、字体、图标和文章原型 | 运行站点时需要保留 |

`exampleSite/` 依赖本仓库的主题文件，不能只下载这个目录就运行。
它用于演示和检查主题；安装为主题时，其中的文章不会自动出现在自己的站点。
**站点配置以 `exampleSite/hugo.toml` 为复制来源，不要将 `theme.toml` 当作站点配置。**

选择以下一种方式操作：需要独立更新主题，使用方式一；希望直接在本仓库中写博客，使用方式二。

## 方式一：作为可复用主题使用

站点配置和文章放在自己的站点目录，主题放在 `themes/selene/`。

### 新建博客

以下命令创建一个带示例内容的新站点：

```sh
hugo new site my-blog
cd my-blog
git init
git submodule add https://github.com/zhuzaiye/selene.git themes/selene
cp themes/selene/exampleSite/hugo.toml hugo.toml
cp -R themes/selene/exampleSite/content/. content/
```

在 `my-blog/hugo.toml` 中修改 `baseURL`、`title`、`locale`、`params.author`、`params.description`、菜单和社交链接。
保留顶层 `theme = "selene"`，它告诉 Hugo 从 `themes/selene/` 加载主题。
`[params]` 下的 `theme = "toggle"` 用于深浅模式，也应保留。

```sh
hugo server -D
```

打开 `http://localhost:1313/`。确认页面后按 `Ctrl+C` 停止服务，执行 `hugo` 构建；输出目录为 `my-blog/public/`。
此后修改 `my-blog/content/` 和 `my-blog/hugo.toml`，个人图片放在 `my-blog/static/imgs/`。
不要在 `themes/selene/exampleSite/` 中写自己的文章。

### 已有 Hugo 站点

在已有站点根目录执行上面的 `git submodule add` 命令；站点需先初始化 Git 仓库。
对照 `themes/selene/exampleSite/hugo.toml` 合并需要的配置，在顶层设置 `theme = "selene"`。
保留已有内容和个人配置，不执行新建博客步骤中的两条 `cp` 命令。
若不用 Git，也可将下载的主题解压到 `themes/selene/`，确保该目录直接包含 `layouts/` 和 `theme.toml`。

站点自己的 `layouts/`、同路径的 `assets/` 和 `static/` 文件会覆盖主题文件；切换主题时检查旧文件，避免遮盖 Selene 的实现。

### 更新主题

在自己的站点根目录执行：

```sh
git submodule update --init --recursive
git -C themes/selene pull --ff-only origin master
hugo
```

预览确认后，用 `git add themes/selene` 并提交，记录新主题版本。
通过 ZIP 安装的主题需手动替换主题文件；替换前备份自己的修改。

## 方式二：将本仓库直接作为博客使用

这种方式把个人内容和主题代码放在同一个仓库，不需要 `themes/selene/`。
下面的复制命令适用于刚下载的副本；已有个人配置或 `content/` 时先备份并手动合并。

```sh
git clone https://github.com/zhuzaiye/selene.git
cd selene
cp hugo.toml hugo.toml.bak
cp exampleSite/hugo.toml hugo.toml
cp -R exampleSite/content ./
```

也可下载 ZIP，解压后进入目录，从第一条 `cp` 命令开始操作。

编辑根目录 `hugo.toml`：

1. **删除顶层 `theme = "selene"` 这一行**。此时 Hugo 直接使用根目录的主题文件，保留它会导致 Hugo 继续查找 `themes/selene/`。
2. **保留 `[params]` 下的 `theme = "toggle"`**，它控制深浅模式。
3. 修改 `baseURL`、`title`、`locale`、作者、描述、菜单和社交链接。英文站点可设置 `locale = "en-US"`，示例文章仍需自行翻译或替换。

在仓库根目录运行：

```sh
hugo server -D
```

打开 `http://localhost:1313/`。按 `Ctrl+C` 停止服务后，执行 `hugo` 构建，输出目录为根目录的 `public/`。
不需要添加 `--source`、`--themesDir` 或 `--theme` 参数。

转换后的文件位置：

```text
selene/
├── hugo.toml        # 个人站点配置，已删除顶层 theme
├── content/         # 个人文章、项目和关于页
├── static/imgs/     # 个人图片
├── layouts/         # 保留：主题模板
├── assets/          # 保留：主题样式和脚本
├── static/          # 保留：主题字体和图标，以及个人图片
├── archetypes/      # 保留：文章原型
└── exampleSite/     # 默认构建不再使用，验证成功后可删除
```

之后直接修改根目录的 `content/` 和 `hugo.toml`。确认迁移成功后可删除 `hugo.toml.bak`。

这种方式仍可更新，但主题代码与个人文件在同一个仓库，更新时可能发生冲突。
将博客保存到自己的 Git 仓库后，可添加原仓库作为上游：

```sh
git remote add upstream https://github.com/zhuzaiye/selene.git
git fetch upstream
```

先提交或备份个人修改，再执行 `git merge upstream/master`；已有 `upstream` 时不必重复添加。
发生冲突时保留个人内容和配置，尤其确保根目录 `hugo.toml` 没有重新出现顶层 `theme = "selene"`。
合并后重新预览并构建。ZIP 用户需要手动对比和同步更新；希望单独更新主题时使用方式一。

## 只预览仓库内的示例

不转换目录、不复制配置时，在名为 `selene` 的仓库根目录运行：

```sh
hugo server --source exampleSite --themesDir ../.. --theme selene -D
```

此时读取 `exampleSite/hugo.toml` 和 `exampleSite/content/`，根目录只提供主题。
构建示例可执行 `hugo --source exampleSite --themesDir ../.. --theme selene`，输出在 `exampleSite/public/`。

发布前设置正确的 `baseURL`，并将需要发布的文章设为 `draft: false`；普通 `hugo` 构建默认不包含草稿。
字体 CSS 使用 `/fonts/` 绝对路径，适合部署在域名根路径；部署到 `/blog/` 等子路径时，需调整 `assets/css/fonts.css` 中的字体 URL。

## 源码仓库、public 与 GitHub 发布

当前项目保存的是 **Hugo 源码**：Markdown 内容、配置、模板、样式和脚本。
运行 `hugo` 后生成的 `public/` 保存的是 **可直接托管的网页**：HTML、CSS、JavaScript、字体和图片。
在 GitHub 保存源码用于备份、协作和更新主题；要让读者通过网址访问博客，还需要配置 GitHub Pages 等托管服务。
只把源码推送到 GitHub，不会自动得到可访问的 Hugo 网站。

推荐将源码与发布文件放在两个独立仓库中：

| 仓库示例 | 保存什么 | 用途 |
| --- | --- | --- |
| `blog-source` | 站点源码，不包含 `public/` | 写作、修改配置、保存历史、更新主题 |
| `YOUR_USERNAME.github.io` | `public/` 内的文件，`index.html` 位于仓库根目录 | 由 GitHub Pages 发布为 `https://YOUR_USERNAME.github.io/` |

本项目 `.gitignore` 已忽略根目录的 `/public/` 和示例的 `/exampleSite/public/`，因此源码仓库中执行 `git add .` 不会加入新生成的网页。
不要用 `git add -f public` 将它们强行加入源码仓库。这里使用与源码目录并列的发布目录，分别管理两套 Git 历史。

### 1. 在 GitHub 创建两个空仓库

将所有命令中的 `YOUR_USERNAME` 替换为自己的 GitHub 用户名。
在 GitHub 新建 `blog-source` 和公开仓库 `YOUR_USERNAME.github.io`，两者都不要勾选自动创建 README、许可证或 `.gitignore`。
第二个仓库名必须与用户名匹配，才能使用上表中的个人主页地址。
下面使用 HTTPS，推送前需通过 Git 凭据管理器或个人访问令牌完成 GitHub 身份验证。

### 2. 将源码推送到自己的仓库

先完成前面的方式一或方式二，并在**自己的站点根目录**执行。提交前用 `git status` 检查文件，移走不需要提交的配置备份。

如果使用方式二通过 `git clone` 下载了 Selene，当前 `origin` 指向主题作者，应先将它改名保留为上游：

```sh
git remote -v
git remote rename origin upstream
git remote add origin https://github.com/YOUR_USERNAME/blog-source.git
```

如果已经有 `upstream`，跳过改名，使用 `git remote set-url origin https://github.com/YOUR_USERNAME/blog-source.git` 修改自己的推送目标。
这与前文的上游更新配置是同一个 `upstream`，不要重复添加。

如果使用方式一新建站点，或通过 ZIP 下载，则改为执行下面这组命令；已有 Git 仓库时可跳过 `git init`，已有自己的 `origin` 时不重复添加：

```sh
git init
git remote add origin https://github.com/YOUR_USERNAME/blog-source.git
```

完成远程配置后，首次提交并推送：

```sh
git add .
git commit -m "Set up blog source"
git branch -M main
git push -u origin main
```

### 3. 创建独立发布目录并上传网页

先在站点 `hugo.toml` 中设置 `baseURL = "https://YOUR_USERNAME.github.io/"`。
以下命令仍从**自己的站点根目录**执行，发布目录与站点目录并列，要求该目录尚不存在。
需要系统提供 `rsync`（macOS 通常自带，Linux 可通过包管理器安装）：

```sh
mkdir ../YOUR_USERNAME.github.io
git -C ../YOUR_USERNAME.github.io init -b main
git -C ../YOUR_USERNAME.github.io remote add origin https://github.com/YOUR_USERNAME/YOUR_USERNAME.github.io.git
hugo --cleanDestinationDir
rsync -av --delete --exclude='.git' public/ ../YOUR_USERNAME.github.io/
touch ../YOUR_USERNAME.github.io/.nojekyll
git -C ../YOUR_USERNAME.github.io add .
git -C ../YOUR_USERNAME.github.io commit -m "Publish blog"
git -C ../YOUR_USERNAME.github.io push -u origin main
```

`hugo --cleanDestinationDir` 清理并重新生成 `public/`；不要把个人文件放在其中。
`rsync` 中 `public/` 末尾的 `/` 表示复制目录里的文件，而不是再套一层 `public`。
`--delete` 会删除发布目录中已不在构建结果里的文件，避免删掉文章后旧页面仍在线；`--exclude='.git'` 保留发布仓库历史。
只把这个目标目录用于构建产物。`.nojekyll` 用于让 GitHub Pages 直接发布 Hugo 生成的静态文件。

### 4. 启用 GitHub Pages

在 `YOUR_USERNAME.github.io` 仓库打开 **Settings → Pages**，将 **Source** 设置为 **Deploy from a branch**，
选择 **main** 和 **/(root)**，保存。等待部署完成后，访问 `https://YOUR_USERNAME.github.io/`。
发布仓库根目录应直接存在 `index.html`，不要选择源码仓库或其中的 `public/` 目录作为分支发布目录；
GitHub 分支发布只支持仓库根目录或 `/docs`。参见 [GitHub Pages 发布源说明](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。

### 5. 日常更新：先保存源码，再发布网页

修改内容、预览确认后，在自己的站点根目录执行：

```sh
git add .
git commit -m "Update blog content"
git push origin main
hugo --cleanDestinationDir
rsync -av --delete --exclude='.git' public/ ../YOUR_USERNAME.github.io/
touch ../YOUR_USERNAME.github.io/.nojekyll
git -C ../YOUR_USERNAME.github.io add .
git -C ../YOUR_USERNAME.github.io commit -m "Update published site"
git -C ../YOUR_USERNAME.github.io push origin main
```

某个仓库没有变化时，跳过该仓库的提交。源码推送与发布推送是两次独立操作，源码保存后仍需构建并推送网页才会更新线上站点。
换电脑时，先克隆自己的源码仓库（方式一使用 `git clone --recurse-submodules`），再将发布仓库克隆到相邻的 `YOUR_USERNAME.github.io/` 目录。
继续使用上面的日常更新命令，不要重复初始化仓库。

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
| `mathjax` | 是否从 CDN 加载 MathJax，主题默认开启 |
| `mathjax_dollar_inline_enable` | 是否允许 `$...$` 行内公式，主题默认开启；需同时开启 `mathjax` |
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

## content 内容结构

`content/` 中的三个主要部分分别对应文章、项目和关于页：

```text
content/
├── posts/
│   └── welcome.md    # 一篇博客文章
├── projects/
│   └── selene.md     # 一个项目
└── about.md          # 关于页，是文件而不是目录
```

| 路径 | 用途与页面 | 如何维护 |
| --- | --- | --- |
| `posts/*.md` | 博客文章；首页 `/` 和 `/posts/` 展示文章列表，`posts/welcome.md` 默认生成 `/posts/welcome/` | 每篇文章单独一个 Markdown 文件；标题、日期、标签和封面写在 front matter 中，正文写在其后 |
| `projects/*.md` | 项目展示；`/projects/` 展示项目卡片，`projects/selene.md` 默认生成 `/projects/selene/` | 每个项目单独一个 Markdown 文件；通过 `weight` 排序，`description` 提供卡片摘要，`link_to` 决定卡片跳转地址；不设置 `link_to` 时跳转到项目详情页 |
| `about.md` | 个人介绍页，默认地址为 `/about/` | 直接编辑这个文件，保留 front matter 中的 `type: about`；正文可写个人经历、本站介绍和联系方式 |

这些路径相对于当前运行的站点根目录。只预览示例时编辑 `exampleSite/content/`；
方式一编辑自己站点的 `content/`；方式二编辑仓库根目录的 `content/`。
上表地址适用于未自定义 URL、部署在域名根路径的站点。
文章和项目可以继续添加新的 `.md` 文件；关于页直接修改已有 `about.md` 即可。
图片放在站点的 `static/imgs/`，在内容中使用 `/imgs/文件名` 引用。
具体字段示例见下面的“写文章”和“项目页与关于页”。

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

主题保留原有第三方资源及文件内声明，社交图标许可见
[`static/icons/social/LICENSE`](static/icons/social/LICENSE)。
Selene 采用 [MIT 许可证](LICENSE)；字体等第三方资源仍遵循各自的许可证。
