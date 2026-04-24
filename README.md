# Selene — A Clean Hugo Theme

Selene is a minimal, elegant Hugo theme designed for personal blogs. It features a WeChat-inspired post layout, light/dark theme toggle, rich shortcodes, and built-in search. [中文说明](./README_zh.md)

[Live Demo](https://zhuzaiye.github.io/)

![theme preview](https://img.shields.io/badge/Hugo-%3E%3D0.110.0-blue) ![license](https://img.shields.io/badge/license-MIT-green)

## Features

- **Light/Dark toggle** — `light`, `dark`, `auto`, and `toggle` modes; respects `prefers-color-scheme`
- **WeChat-style posts** — cover images, author bar, like/share/comment buttons
- **Table of Contents** — sticky sidebar on posts
- **MathJax** — LaTeX math rendering with inline `$...$` support
- **Mermaid diagrams** — theme-aware diagram rendering
- **Built-in search** — elasticlunr.js full-text search
- **Gitalk comments** — GitHub issue-powered comments
- **40+ social icons** — SVG icons for GitHub, Twitter, RSS, email, and more
- **Custom fonts** — JetBrains Mono (code), Space Grotesk & Zed (body/heading)
- **Responsive** — mobile-friendly layout
- **Analytics** — Umami and GoatCounter support
- **Note shortcode** — collapsible note/callout boxes
- **Pagination** — numeric page navigation
- **RSS/Atom** — auto-generated feed
- **Syntax highlighting** — Dracula color scheme via Hugo's Chroma

## Theme Structure

```
selene/
├── theme.toml          # Theme metadata + example config
├── README.md           # Full documentation
├── archetypes/
│   └── default.md
├── assets/
│   ├── js/             # 13 JS files (theme toggle, search, mermaid, toc, etc.)
│   └── sass/
│       ├── main.scss / fonts.scss
│       ├── parts/      # 10 SCSS partials
│       └── theme/      # light.scss + dark.scss
├── layouts/
│   ├── _default/       # baseof, single, taxonomy
│   ├── partials/       # header, nav, cards, comments, macros, etc.
│   ├── shortcodes/     # mermaid, note
│   ├── posts/ + projects/
│   └── index, 404, robots.txt, sitemap.xml
└── static/
    ├── fonts/          # JetBrainsMono, SpaceGrotesk, Zed
    └── icons/          # 40+ social icons + sun/moon/search SVG
```

### What's Included vs Excluded

| Included (theme)                  | Excluded (site-specific)                          |
| --------------------------------- | ------------------------------------------------- |
| `layouts/` — all templates        | `content/` — blog posts, pages                    |
| `assets/` — JS, SCSS              | `static/imgs/` — post cover images, screenshots   |
| `archetypes/` — default archetype | `config.toml` — personal site config with secrets |
| `static/fonts/` — bundled fonts   | `public/` — build output                          |
| `static/icons/` — theme icons     | `resources/` — Hugo cache                         |

The example config in `theme.toml` provides a ready-to-copy starting point — replace placeholders with your own values.

## Quick Start

### Option 1: Git Submodule

```sh
hugo new site my-blog
cd my-blog
git init
git submodule add https://github.com/zhuzaiye/selene.git themes/selene
echo "theme = 'selene'" >> hugo.toml
```

### Option 2: Hugo Modules

```sh
hugo new site my-blog
cd my-blog
hugo mod init my-blog
# add to hugo.toml:
#   theme = "github.com/zhuzaiye/selene"
```

### Option 3: Direct Copy

```sh
cp -r /path/to/selene my-blog/themes/selene
echo "theme = 'selene'" >> my-blog/hugo.toml
```

## Build

Use the following command to build the site with a specific base URL:

```sh
hugo -b <baseUrl>
```

## Configuration

Copy the example config below into your site's `hugo.toml` (or `config.toml`) and customize it.

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
    unsafe = true  # allows raw HTML in markdown

[params]
  description = "My personal blog"
  avatar = "/imgs/avatar.png"    # displayed in post footer bar
  theme = "toggle"               # light | dark | auto | toggle
  toc = true                     # enable table of contents
  mathjax = true                 # enable MathJax
  mathjax_dollar_inline_enable = true
  build_search_index = false     # set true for elasticlunr search
  use_cdn = false                # use CDN for fonts instead of local

  # Navigation menu
  [[params.menu]]
    name = "/posts"
    url = "/posts"
    weight = 1
  [[params.menu]]
    name = "/about"
    url = "/about"
    weight = 2

  # Social links — use any icon from static/icons/social/
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

  # Gitalk comments (remove section to disable)
  [params.gitalk]
    owner = "your-github-username"
    repo = "your-repo"
    clientId = "your-client-id"
    clientSecret = "your-client-secret"

  # Analytics (remove sections you don't need)
  [params.analytics]
    [params.analytics.umami]
      website_id = "your-website-id"
      host_url = "https://api-gateway.umami.dev/"
    [params.analytics.goatcounter]
      user = "your-goatcounter-user"
      host = "goatcounter.com"
```

### Theme Modes

| Value    | Behavior                                                  |
| -------- | --------------------------------------------------------- |
| `light`  | Always light                                              |
| `dark`   | Always dark                                               |
| `auto`   | Follows system `prefers-color-scheme`                     |
| `toggle` | Manual toggle button + remembers choice in `localStorage` |

## Content

### Creating Posts

```sh
hugo new posts/2024-01-01-hello-world.md
hugo serve -D   # -D includes draft posts
```

### Frontmatter

```yaml
---
title: "Hello World"
date: 2024-01-01
draft: true
description: "A short description for previews and SEO"
comment: true              # enable Gitalk comments on this page
cover_image: "/imgs/cover.svg"  # WeChat-style cover image
tags: ["tag1", "tag2"]
---
```

### Shortcodes

**Note** — collapsible callout box:

```go
{{</* note header="Info" clickable=true hidden=false center=false */>}}
This is the note content.
{{</* /note */>}}
```

Parameters: `header` (title), `clickable` (toggle open/close), `hidden` (initially collapsed), `center` (center the header).

**Mermaid** — diagrams:

```go
{{</* mermaid */>}}
graph TD;
  A-->B;
  A-->C;
  B-->D;
  C-->D;
{{</* /mermaid */>}}
```

## Search

To enable search, add to your `hugo.toml`:

```toml
[params]
  build_search_index = true
  search_index_format = "elasticlunr_json"  # or "elasticlunr_javascript"
```

The search index is built at compile time. The included `searchElasticlunr.js` handles the frontend.

## Comments

This theme uses [Gitalk](https://github.com/gitalk/gitalk) — comments are stored as GitHub issues on a repo you control. Configure the `[params.gitalk]` section in your site config. Set `comment: false` in a page's frontmatter to disable comments on that specific page.

## Analytics

Two analytics providers are supported:

- **Umami** — privacy-focused, self-hostable analytics
- **GoatCounter** — lightweight, open-source analytics

Configure one or both in `[params.analytics]`. Remove unused sections.

## Fonts

The theme bundles three font families:

| Font             | Usage                    | Weight               |
| ---------------- | ------------------------ | -------------------- |
| JetBrains Mono   | Code blocks, inline code | Regular, Bold        |
| Space Grotesk    | Headings (fallback)      | Regular, Bold        |
| Zed Text/Display | Body text, Headings      | Regular, Bold, Heavy |

Set `use_cdn = true` to load JetBrains Mono and Space Grotesk from CDN instead of local static files.

## Updating the Theme

If installed as a git submodule:

```sh
cd themes/selene
git pull origin master
```

## License

MIT © [hzzhu92](https://github.com/zhuzaiye)

The social icons in `static/icons/social/` are from [Simple Icons](https://simpleicons.org/) and are also MIT-licensed.
