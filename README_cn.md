# Selene

一个简洁、优雅的博客主题，由 [Hugo](https://gohugo.io/) 驱动。

## 主题特点

- 简约现代的设计风格
- 深色/浅色模式切换
- 优化的性能与加载速度
- 支持数学公式（MathJax）
- 支持代码高亮
- 支持Mermaid图表
- 响应式设计，适配各种设备

## 项目结构

```
selene/
├── archetypes/        # 内容模板
│   └── default.md     # 默认内容模板
├── assets/            # 资源文件
│   ├── js/            # JavaScript文件
│   └── sass/          # SCSS样式文件
├── content/           # 网站内容
├── layouts/           # 布局模板
├── static/            # 静态资源
│   ├── fonts/         # 字体文件
│   └── icons/         # 图标资源
└── config.toml        # 网站配置
```

## 使用方法

### 添加新文章

```sh
hugo new posts/my-new-post.md
hugo serve -D
```

### 构建网站

```sh
hugo --minify
```

### 部署到GitHub Pages

```sh
hugo --baseURL="https://yourusername.github.io/"
```

## 配置选项

在 `config.toml` 中可以配置以下选项：

- `theme`: 主题模式 (light, dark, auto, toggle)
- `toc`: 是否启用目录
- `mathjax`: 是否启用数学公式支持
- 菜单和社交链接配置

## 参考

本主题基于 [archie-zola](https://github.com/XXXMrG/archie-zola) 开发