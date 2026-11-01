<div align="center">
  <h1>Selene</h1>
  <p>A standalone Hugo blog theme.</p>
  <p>
    <a href="README.md">English</a> ·
    <a href="README_zh.md">简体中文</a> ·
    <a href="LICENSE">MIT License</a>
  </p>
</div>

Selene includes templates, CSS, JavaScript, fonts, icons, and content archetypes.
Personal posts, avatars, post images, site configuration, and build output are not
part of the theme. `exampleSite/` provides a standalone Chinese example site
without the original blog's comment credentials.

## Requirements

- Hugo **0.158.0 or later** (the example configuration uses `locale`).
- The standard edition of Hugo is sufficient; Hugo Extended, Dart Sass, Node.js,
  and npm installation are not required.
- JavaScript must be enabled in the browser for interactive tables of contents,
  theme switching, code copying, comments, and similar features.

## Choose how to use Selene

`exampleSite/` is a demonstration site for previewing and testing the theme. It
contains configuration, sample posts, a project page, and an about page. Theme
functionality comes from `layouts/`, `assets/`, `static/`, and `archetypes/` in the
repository root. Choose the setup that fits your needs:

| Setup | File organization | Best suited for | Updates |
| --- | --- | --- | --- |
| Reusable theme | Your site owns its configuration and content; Selene lives in `themes/selene/` | Existing Hugo sites, or independent theme updates | Update the theme submodule |
| Complete blog template | Configuration and `content/` live alongside theme templates and resources in the repository root | Starting a blog directly from a downloaded copy | Merge upstream changes with Git and resolve conflicts, or synchronize files manually |

When distributing a reusable theme, keeping `exampleSite/` makes previewing and
maintenance easier. Its sample content is not automatically included in a user's
site. To use the repository as your own blog template, copy its sample configuration
and content into the root; the resulting site no longer needs an external theme
reference. Both workflows are described below.

## Install in an existing site

Run the following in the root directory of your Hugo site:

```sh
git submodule add https://github.com/zhuzaiye/selene.git themes/selene
```

You can also copy the theme directly into `themes/selene/`. That directory should
directly contain `theme.toml`, `layouts/`, and the other theme files.
Enable the theme at the top level of your site's `hugo.toml` or `config.toml`:

```toml
baseURL = "https://example.org/"
locale = "en-US"
theme = "selene"

[pagination]
  pagerSize = 10

[markup.highlight]
  noClasses = false

[params]
  author = "Your Name"
  description = "Recording thoughts and sharing projects."
  theme = "toggle"
  toc = true

  [[params.menu]]
    name = "Articles"
    url = "/posts/"
  [[params.menu]]
    name = "Projects"
    url = "/projects/"
  [[params.menu]]
    name = "About"
    url = "/about/"
```

The top-level `theme` selects the Hugo theme; `params.theme` controls light and
dark modes. They serve different purposes. Files in your site's root `layouts/`,
or at matching paths in `assets/` and `static/`, override theme resources.
If you are migrating from the original Tracelog site, make a backup first, then
move duplicate templates and resources out of the way so future theme updates
can take effect. Keep your personal `content/`, `static/imgs/`, and site configuration.

## Preview the example and build

Run the following in the theme repository root (the directory should be named `selene`):

```sh
hugo server --source exampleSite --themesDir ../.. --theme selene -D
```

You can also copy the configuration and content from `exampleSite/` into your own
Hugo site, then install the theme. Run the following in your site's root directory:

```sh
hugo server -D
hugo --baseURL https://example.org/
```

The default preview URL is `http://localhost:1313/`, and build output is written
to the site's `public/` directory. Production builds exclude drafts by default;
set each post's `draft` to `false` before publishing.
The bundled font CSS uses absolute `/fonts/` paths, so deployment at the domain
root is recommended. For deployment under a subpath such as `/blog/`, override
`assets/css/fonts.css` in your site and adjust the font URLs.

## Use the repository as a complete blog template

These steps assume a freshly downloaded copy. If the root already contains your
own configuration or `content/`, back them up first and merge configuration and
content manually to avoid overwriting files with the same names.

1. Download the repository and enter its directory. Alternatively, download and
   extract the ZIP, then open the extracted directory in your terminal:

   ```sh
   git clone https://github.com/zhuzaiye/selene.git
   cd selene
   ```

2. Back up the theme defaults in the root, replace them with the example site
   configuration, and copy the example content:

   ```sh
   cp hugo.toml hugo.toml.bak
   cp exampleSite/hugo.toml hugo.toml
   cp -R exampleSite/content ./
   ```

   The current example site contains only configuration and `content/`. If site
   resources such as `exampleSite/static/` are added later, merge their files into
   the corresponding root directories too, preserving existing theme resources.

3. Edit the root `hugo.toml`: remove the top-level `theme = "selene"`, since Hugo
   will use the templates and resources in the root directly. Keep
   `theme = "toggle"` under `[params]`; it controls light and dark modes.
   Customize `baseURL`, `title`, `locale`, author, description, menus, and social
   links. For an English site, use `locale = "en-US"`; the sample content is still
   in Chinese and must be edited separately.

4. Preview and build directly from the root, without `--source exampleSite`,
   `--themesDir`, or `--theme`:

   ```sh
   hugo server -D
   ```

   Preview at `http://localhost:1313/`. After checking the site, stop the preview
   server and build:

   ```sh
   hugo
   ```

   Output goes to the root `public/` directory. Set the correct `baseURL` and
   `draft: false` for posts you want to publish before deployment.

5. Write posts in the root `content/posts/`, manage projects in `content/projects/`,
   edit `content/about.md`, and put personal images in the root `static/imgs/`.
   `exampleSite/` no longer participates in the default build; keep it as a
   reference or delete it after verifying the migration. Keep the root `layouts/`,
   `assets/`, `static/`, and `archetypes/`, as they still provide the site's theme files.

Updates remain possible, but the theme cannot be upgraded independently through a
submodule in this setup. With Git, save your blog in a personal repository, configure
the original Selene repository as an upstream remote, and commit or back up personal
changes before merging the upstream changes you need and resolving conflicts.
Check the root `hugo.toml` especially, so updates do not restore the theme reference
or discard your site settings. With a ZIP download, compare and synchronize updates
manually. Preview and build after updating, checking that personal posts, images,
and configuration remain correct. Prefer the submodule setup above if independent
theme upgrades are a priority.

## Site settings

Place the following settings under `[params]`:

| Field | Purpose |
| --- | --- |
| `author` | Default author; a post's `author` takes precedence, with the site title as the final fallback |
| `description` | Site description, used in metadata when a page has no description |
| `theme` | `light` for fixed light mode, `dark` for fixed dark mode, `auto` to follow the system, or `toggle` for manual switching; defaults to `toggle` |
| `toc` | Show the table of contents; defaults to `true`; posts must contain Markdown headings |
| `avatar` | Author avatar at the end of posts, with a path relative to `static/`, such as `/imgs/avatar.png` |
| `home_avatar` | Circular navigation avatar; falls back to `avatar`, then `logo`, then the built-in person icon |
| `logo` | Navigation image used when no avatar is configured |
| `favicon` | Image path relative to `assets/`, such as `imgs/favicon.png` |
| `stylesheets` | Array of additional CSS resources relative to `assets/`, such as `["css/custom.css"]` |
| `mathjax` | Whether to load MathJax from a CDN; disabled by default |
| `mathjax_dollar_inline_enable` | Whether to allow `$...$` inline formulas; also requires `mathjax` to be enabled |
| `use_cdn` | Whether to load additional fonts from a CDN; disabled by default |

Use `[[params.menu]]` for menu items, which appear in configuration order.
Example social links:

```toml
[[params.social]]
  name = "GitHub"
  url = "https://github.com/yourname"
  icon = "github"
[[params.social]]
  name = "Email"
  url = "mailto:you@example.org"
  icon = "email"
[[params.social]]
  name = "RSS"
  url = "/index.xml"
  icon = "rss"
```

The `icon` value matches a filename in `static/icons/social/` without its `.svg`
extension. RSS uses Hugo's default `/index.xml` output.

## Write posts

Run the following in your site's root directory. The theme's archetype creates a draft:

```sh
hugo new content posts/hello.md
```

Posts live in `content/posts/`. Example front matter:

```yaml
---
title: "My First Post"
date: 2026-01-01T10:00:00+08:00
draft: false
description: "Post summary"
author: "Author Name"
tags: ["Hugo", "Notes"]
comment: true
cover_image: "/imgs/hello.svg"
---
```

Place images in your site's `static/imgs/` directory and reference them in the
body as `/imgs/filename`. The home page displays posts from the `posts` section.
The `/posts/` page uses horizontal cards, showing only text when no cover image
is set. Tags appear in the order specified and link to their archives; the same
tag always uses the same color.

Posts use a 760px reading column. The table of contents appears alongside the
article on desktop and can be expanded on narrow screens. Code blocks support
copying; blocks longer than 24 lines can be expanded or collapsed.
Set `markup.highlight.noClasses = false` to use the theme's syntax highlighting
colors. Wide tables support horizontal scrolling.
The interaction bar is fixed to the bottom on mobile and appears at the end of
the post on desktop. Likes are stored only in the current browser's `localStorage`
and are not site-wide counts. Sharing uses the system share interface or copies
the link. The comment button jumps to the configured Gitalk editor.

## Project and about pages

Place project files in `content/projects/` with the following fields:

```yaml
---
title: "Example Project"
draft: false
weight: 1
description: "Project introduction"
local_image: "/imgs/project.png"
link_to: "https://github.com/yourname/project"
source: "GitHub"
comment: false
---
```

Projects are sorted by `weight`. Use `remote_image` instead of `local_image` for
a remote image. When no image is configured, the first character of the title
is displayed. If `source` is omitted, the external link's domain is used.
If `link_to` is not set, the card links to the project's own detail page.

The about page lives at `content/about.md`; set `type: about` and `comment: false`.
Plain Markdown is sufficient. For the custom introduction layout shown in the
example, see `exampleSite/content/about.md`. Raw HTML layouts require the following
site configuration:

```toml
[markup.goldmark.renderer]
  unsafe = true
```

## Shortcodes and formulas

Note blocks support titles and click-to-expand behavior. Example:

```text
{{< note header="Note" clickable=true center=false >}}
You can write **Markdown** content here.
{{< /note >}}
```

Both `clickable` and `center` are disabled by default. Currently, `hidden=true`
produces an empty content container; omit this parameter to preserve the body.

Flowcharts use the bundled Mermaid resources:

```text
{{< mermaid >}}
graph LR
  A[Start] --> B[Done]
{{< /mermaid >}}
```

Mathematical formulas require `params.mathjax = true`. Use `$$...$$` for display
formulas. Inline `$...$` formulas also require `mathjax_dollar_inline_enable`.

## Gitalk comments (optional)

Comments are disabled by default. To enable them, add your own GitHub repository
and OAuth application settings to your site configuration:

```toml
[params.gitalk]
  owner = "your-github-username"
  repo = "your-comments-repo"
  clientId = "your-oauth-client-id"
  clientSecret = "your-oauth-client-secret"
```

The repository must have Issues enabled, and the OAuth callback URL must match
your site. Gitalk uses browser-side OAuth, so these settings are included in
public pages; do not treat this field as server-side secret storage.
Remove the entire configuration block to disable comments, or set `comment: false`
on an individual page.

The theme loads Gitalk 1.8.0 JavaScript and CSS and depends on access to the GitHub
API and CDN. For posts without an initialized discussion, the repository author
can log in and click the initialization button to create an Issue.
Post dates are used to associate discussions. Preserve existing dates during
migration to avoid linking posts to new discussions.

Comments support topic grouping, replies, Markdown previews, pagination, and
session drafts. Each load retrieves 50 comments; topics with more than three
replies can be expanded. The hidden `tracelog-thread:v1` marker at the end of a
reply stores its parent comment and root topic IDs. Preserve it when editing
comments on GitHub. Older comments without this marker appear as separate topics.

## Limitations of optional features

MathJax, Gitalk, and CDN fonts require external network access. Regular pages,
theme resources, and local fonts are deployed with the site.
The Elasticlunr search scripts and loading configuration are retained, but no
index-generation template or search interface is included. Setting
`build_search_index = true` alone does not provide complete search functionality;
leave it disabled by default.
Analytics scripts remain in `assets/js/imamu.js` and `count.js`. Verify their
configuration and service availability before integrating them as needed.

## Directory structure and maintenance

```text
selene/
├── archetypes/default.md      # New post archetype
├── assets/css/
│   ├── fonts.css              # Font declarations
│   ├── main.css               # Base styles and page layout
│   ├── parts/                 # Posts, TOC, comments, cards, and other modules
│   └── theme/                 # Light and dark color variables
├── assets/js/                 # Code blocks, TOC, interactions, and comments
├── exampleSite/               # Chinese example site
├── hugo.toml                  # Theme defaults that sites can override
├── layouts/                   # Hugo templates, partials, and shortcodes
├── static/fonts/              # Local fonts
├── static/icons/              # Theme and social icons
└── theme.toml                 # Theme metadata
```

`layouts/partials/styles.html` explicitly manages the loading order of shared CSS,
then bundles, minifies, and fingerprints it. Add new module styles to its `$paths`
list. Use plain CSS, not Sass syntax.
Additional styles load after shared styles. Use your site's `assets/css/custom.css`
and `params.stylesheets` for customization to reduce conflicts during theme upgrades.

Post styles live in `parts/post.css`; the table of contents uses `parts/toc.css`
and `js/toc.js`; comments use `parts/comments.css` and `js/comments.js`; code
interactions live in `js/codeblock.js`.
The original project includes a minified `main.min.js`, which templates load
directly. Update the minified version whenever you change `main.js`.
Separately loaded files such as `codeblock.js`, `comments.js`, and `toc.js` are
minified and fingerprinted by Hugo during the build.

After updating the submodule, preview and build the site before committing the
submodule version recorded by the parent site:

```sh
git submodule update --init --recursive
git -C themes/selene pull --ff-only
hugo
```

## License

<p>Selene is released under the <a href="LICENSE">MIT License</a>.</p>
<p>Third-party resources retain their original license notices. See
<a href="static/icons/social/LICENSE">the social icon license</a> for social icons;
fonts and other bundled resources remain subject to their respective licenses.</p>
