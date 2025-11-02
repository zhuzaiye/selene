# Selene

A clean and elegant blog theme powered by [Hugo](https://gohugo.io/).

## Features

- Minimalist, modern design style
- Toggle between dark and light modes
- Optimized performance and loading speed
- Support for mathematical formulas (MathJax)
- Code highlighting
- Mermaid diagram support
- Responsive design for all devices

## Project Structure

```
selene/
├── archetypes/        # Content archetypes
│   └── default.md     # Default content template
├── assets/            # Asset files
│   ├── js/            # JavaScript files
│   └── sass/          # SCSS style files
├── content/           # Website content
├── layouts/           # Layout templates
├── static/            # Static resources
│   ├── fonts/         # Font files
│   └── icons/         # Icon resources
└── config.toml        # Site configuration
```

## Usage

### Add a New Post

```sh
hugo new posts/my-new-post.md
hugo serve -D
```

### Build the Website

```sh
hugo --minify
```

### Deploy to GitHub Pages

```sh
hugo --baseURL="https://yourusername.github.io/"
```

## Configuration Options

You can configure the following options in `config.toml`:

- `theme`: Theme mode (light, dark, auto, toggle)
- `toc`: Enable or disable table of contents
- `mathjax`: Enable or disable MathJax support
- Menu and social link configurations

## Reference

This theme is developed based on [archie-zola](https://github.com/XXXMrG/archie-zola).