<div align="center">
  <h1>Selene</h1>
  <p>A simple Hugo blog theme.</p>
  <p>
    <a href="README.md">English</a> ·
    <a href="README_zh.md">简体中文</a> ·
    <a href="LICENSE">MIT License</a>
  </p>
</div>

Selene provides light and dark modes, a table of contents, code copying and folding,
project pages, Mermaid, MathJax, and optional Gitalk comments.

## Requirements

- Hugo **0.158.0 or later**, standard edition. No Extended edition, Sass, Node.js, or npm is required.
- Enable browser JavaScript for interactive tables of contents, theme switching, code copying, and comments.

## Configuration files and the purpose of exampleSite

| File or directory | Purpose | What to edit |
| --- | --- | --- |
| `theme.toml` | Theme metadata: name, author, and license; not site configuration | No changes needed to use the theme |
| Root `hugo.toml` | Default settings inherited by sites using the theme | Keep personal settings in your own site |
| `exampleSite/hugo.toml` | Complete sample site configuration with site details, menus, and optional features | Copy to your site's root, then customize |
| `exampleSite/content/` | Sample posts, project, and about page | Copy into your site, then replace with your content |
| `layouts/`, `assets/`, `static/`, `archetypes/` | Theme templates, styles, scripts, fonts, icons, and post archetypes | Keep these to run the site |

`exampleSite/` depends on this repository's theme files; downloading that directory
alone is insufficient. It demonstrates and tests the theme. Its sample posts are
not automatically included in sites that install Selene as a theme.
**Copy site configuration from `exampleSite/hugo.toml`, not `theme.toml`.**

Choose one workflow: use option one for independent theme updates, or option two
to write your blog directly in this repository.

## Option one: use Selene as a reusable theme

Keep site configuration and content in your own site, with Selene in `themes/selene/`.

### Create a new blog

These commands create a new site with sample content:

```sh
hugo new site my-blog
cd my-blog
git init
git submodule add https://github.com/zhuzaiye/selene.git themes/selene
cp themes/selene/exampleSite/hugo.toml hugo.toml
cp -R themes/selene/exampleSite/content/. content/
```

Edit `baseURL`, `title`, `locale`, `params.author`, `params.description`, menus, and
social links in `my-blog/hugo.toml`. Use `locale = "en-US"` for English; translate or
replace the Chinese sample content separately.
Keep the top-level `theme = "selene"` to load the theme from `themes/selene/`.
Also keep `theme = "toggle"` under `[params]`, which controls light and dark modes.

```sh
hugo server -D
```

Open `http://localhost:1313/`. Press `Ctrl+C` to stop the preview, then run `hugo`
to build into `my-blog/public/`. Edit `my-blog/content/` and `my-blog/hugo.toml`,
and put personal images in `my-blog/static/imgs/`. Do not write personal posts
in `themes/selene/exampleSite/`.

### Use an existing Hugo site

Run the `git submodule add` command above in your existing site's root; initialize
its Git repository first if needed. Merge the settings you need from
`themes/selene/exampleSite/hugo.toml`, setting the top-level `theme = "selene"`.
Keep existing content and personal configuration; skip both `cp` commands from
the new-blog instructions. Without Git, extract a downloaded theme into
`themes/selene/`, ensuring it directly contains `layouts/` and `theme.toml`.

Your site's own `layouts/` and files at matching paths in `assets/` and `static/`
override theme files. Check old files when switching themes so they do not mask
Selene's implementation.

### Update the theme

Run from your own site's root:

```sh
git submodule update --init --recursive
git -C themes/selene pull --ff-only origin master
hugo
```

Preview the result, then run `git add themes/selene` and commit to record the new
theme version. ZIP installations require manual replacement of theme files;
back up personal changes before replacing them.

## Option two: use this repository directly as a blog

This keeps personal content and theme code in one repository; no `themes/selene/`
is needed. The copy commands below assume a fresh download. Back up and merge
manually if you already have personal configuration or a root `content/` directory.

```sh
git clone https://github.com/zhuzaiye/selene.git
cd selene
cp hugo.toml hugo.toml.bak
cp exampleSite/hugo.toml hugo.toml
cp -R exampleSite/content ./
```

Alternatively, download and extract the ZIP, enter its directory, and start with
the first `cp` command.

Edit the root `hugo.toml`:

1. **Delete the top-level `theme = "selene"` line.** Hugo will use the root theme
   files directly; keeping the line makes Hugo look for `themes/selene/` instead.
2. **Keep `theme = "toggle"` under `[params]`** to control light and dark modes.
3. Customize `baseURL`, `title`, `locale`, author, description, menus, and social
   links. Use `locale = "en-US"` for English, and translate or replace the Chinese sample posts.

Run from the repository root:

```sh
hugo server -D
```

Open `http://localhost:1313/`. Press `Ctrl+C` to stop the preview, then run `hugo`
to build into the root `public/` directory. No `--source`, `--themesDir`, or
`--theme` flags are needed.

The resulting file layout is:

```text
selene/
├── hugo.toml        # Personal site configuration; top-level theme removed
├── content/         # Personal posts, projects, and about page
├── static/imgs/     # Personal images
├── layouts/         # Keep: theme templates
├── assets/          # Keep: theme styles and scripts
├── static/          # Keep: theme fonts and icons, plus personal images
├── archetypes/      # Keep: post archetypes
└── exampleSite/     # Unused by the default build; may be deleted after verification
```

Edit the root `content/` and `hugo.toml` from now on. You may delete
`hugo.toml.bak` after verifying the migration.

Updates remain possible, but theme code and personal files share a repository,
so updates may produce conflicts. After saving the blog in your own Git repository,
add the original repository as an upstream remote:

```sh
git remote add upstream https://github.com/zhuzaiye/selene.git
git fetch upstream
```

Commit or back up personal changes, then run `git merge upstream/master`. Skip
adding the remote if `upstream` already exists. Resolve conflicts while preserving
personal content and settings, especially ensuring the root `hugo.toml` does not
regain a top-level `theme = "selene"`. Preview and rebuild after merging.
ZIP users must compare and synchronize updates manually. Use option one if you
want to update the theme independently.

## Preview the bundled example only

To preview without converting directories or copying configuration, run from the
repository root, with the repository directory named `selene`:

```sh
hugo server --source exampleSite --themesDir ../.. --theme selene -D
```

This reads `exampleSite/hugo.toml` and `exampleSite/content/`; the root provides
the theme. Build with `hugo --source exampleSite --themesDir ../.. --theme selene`;
output goes to `exampleSite/public/`.

Before publishing, set the correct `baseURL` and `draft: false` on posts you want
to publish; ordinary `hugo` builds exclude drafts. Font CSS uses absolute `/fonts/`
paths, suitable for deployment at the domain root. For a subpath such as `/blog/`,
adjust font URLs in `assets/css/fonts.css`.

## Source repository, public, and publishing on GitHub

This project contains **Hugo source files**: Markdown content, configuration,
templates, styles, and scripts. Running `hugo` generates **deployable website
files** in `public/`: HTML, CSS, JavaScript, fonts, and images.
A source repository on GitHub provides backups, collaboration, and theme updates.
To serve the blog at a URL, configure hosting such as GitHub Pages; pushing Hugo
source alone does not automatically publish a working site.

Use two separate repositories:

| Example repository | Contents | Purpose |
| --- | --- | --- |
| `blog-source` | Site source, excluding `public/` | Writing, configuration, history, and theme updates |
| `YOUR_USERNAME.github.io` | Files inside `public/`, with `index.html` at the repository root | GitHub Pages hosting at `https://YOUR_USERNAME.github.io/` |

This project's `.gitignore` excludes `/public/` and `/exampleSite/public/`, so
`git add .` in the source repository does not add newly generated pages. Do not
force them into the source repository with `git add -f public`. The workflow below
keeps the publishing directory beside the source directory, with separate Git histories.

### 1. Create two empty repositories on GitHub

Replace every `YOUR_USERNAME` in the commands with your GitHub username.
Create `blog-source` and a public `YOUR_USERNAME.github.io` repository. Do not
initialize either with a README, license, or `.gitignore`. The second repository
name must match your username to use the personal site URL above.
The commands use HTTPS; authenticate Git pushes using a credential manager or
a personal access token first.

### 2. Push source to your own repository

Complete option one or two above, then work from **your site's root**. Review
`git status` and move unwanted configuration backups out before committing.

If you cloned Selene for option two, `origin` points to the theme author's
repository. Rename it to retain it as the upstream remote:

```sh
git remote -v
git remote rename origin upstream
git remote add origin https://github.com/YOUR_USERNAME/blog-source.git
```

If `upstream` already exists, skip renaming and run
`git remote set-url origin https://github.com/YOUR_USERNAME/blog-source.git` instead.
This is the same upstream used for theme updates above; do not add it twice.

For a new site created with option one or a ZIP download, use this alternative
instead. Skip `git init` if already initialized, and do not add `origin` again if
it already points to your own repository:

```sh
git init
git remote add origin https://github.com/YOUR_USERNAME/blog-source.git
```

After configuring the remote, commit and push for the first time:

```sh
git add .
git commit -m "Set up blog source"
git branch -M main
git push -u origin main
```

### 3. Create a separate publishing directory and upload the site

Set `baseURL = "https://YOUR_USERNAME.github.io/"` in your site's `hugo.toml` first.
Run these commands from **your site's root**. They create a sibling publishing
directory, which must not already exist. The commands require `rsync` (usually
included on macOS; install through your package manager on Linux):

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

`hugo --cleanDestinationDir` cleans and regenerates `public/`; do not keep personal
files there. The trailing `/` in `public/` copies its contents rather than nesting
a `public` directory. `--delete` removes publishing files absent from the build,
so deleted posts do not remain online. `--exclude='.git'` preserves repository
history. Use that destination only for generated output. `.nojekyll` lets GitHub
Pages serve Hugo's static files directly.

### 4. Enable GitHub Pages

In `YOUR_USERNAME.github.io`, open **Settings → Pages**, set **Source** to
**Deploy from a branch**, select **main** and **/(root)**, and save.
After deployment finishes, visit `https://YOUR_USERNAME.github.io/`.
The publishing repository must contain `index.html` directly at its root. Do not
select the source repository or its `public/` directory as a branch publishing
folder; GitHub supports only the repository root or `/docs` for that workflow.
See [GitHub's publishing source documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

### 5. Routine updates: save source, then publish pages

After editing and previewing, run from your site's root:

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

Skip a repository's commit if it has no changes. Source and publishing pushes
are independent: saving source still requires building and pushing the generated
pages to update the live site. On another computer, clone your own source
repository (use `git clone --recurse-submodules` for option one), then clone the
publishing repository into the sibling `YOUR_USERNAME.github.io/` directory.
Continue with the routine update commands; do not initialize the repositories again.

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
| `mathjax` | Whether to load MathJax from a CDN; enabled by the theme defaults |
| `mathjax_dollar_inline_enable` | Whether to allow `$...$` inline formulas; enabled by the theme defaults and requires `mathjax` |
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

## Content structure

The three main parts of `content/` hold posts, projects, and the about page:

```text
content/
├── posts/
│   └── welcome.md    # One blog post
├── projects/
│   └── selene.md     # One project
└── about.md          # The about page: a file, not a directory
```

| Path | Purpose and pages | How to maintain it |
| --- | --- | --- |
| `posts/*.md` | Blog posts; `/` and `/posts/` list posts, and `posts/welcome.md` generates `/posts/welcome/` by default | Use one Markdown file per post; put its title, date, tags, and cover in front matter, followed by the body |
| `projects/*.md` | Project showcase; `/projects/` displays project cards, and `projects/selene.md` generates `/projects/selene/` by default | Use one Markdown file per project; `weight` controls order, `description` supplies the card summary, and `link_to` controls the card destination; omit `link_to` to open the project's detail page |
| `about.md` | Personal introduction, at `/about/` by default | Edit this file directly, keeping `type: about` in front matter; use the body for your background, site introduction, and contact details |

These paths are relative to the root of the site you are running. For the bundled
preview, edit `exampleSite/content/`; for option one, edit your own site's
`content/`; for option two, edit `content/` in the repository root.
The URLs above assume no custom URL settings and deployment at the domain root.
Add more `.md` files for new posts and projects; edit the existing `about.md` for
the about page. Put images in your site's `static/imgs/` and reference them as
`/imgs/filename`. See “Write posts” and “Project and about pages” below for field examples.

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

## License

<p>Selene is released under the <a href="LICENSE">MIT License</a>.</p>
<p>Third-party resources retain their original license notices. See
<a href="static/icons/social/LICENSE">the social icon license</a> for social icons;
fonts and other bundled resources remain subject to their respective licenses.</p>
