---
title: "欢迎使用 Selene"
date: 2026-01-01T10:00:00+08:00
draft: false
author: "示例作者"
description: "文章、代码、目录与短代码的使用示例。"
tags: ["Hugo", "主题"]
comment: false
---

Selene 是从实际博客中抽取的 Hugo 主题。这里展示基础排版与交互。

## 代码块

```python
def hello(name):
    return f"Hello, {name}!"
```

代码块支持复制，超过 24 行后可折叠。

## 表格和引用

| 内容 | 支持 |
| --- | --- |
| 文章标签 | 标签归档与固定颜色 |
| 深浅模式 | 手动切换与系统偏好 |

> 用文字记录思考，用作品分享经验。

## 提示块

{{< note header="提示" clickable=true >}}
在 `content/posts/` 中创建 Markdown 文章即可开始写作。
{{< /note >}}

## 流程图

{{< mermaid >}}
graph LR
    A[撰写 Markdown] --> B[Hugo 构建]
    B --> C[静态站点]
{{< /mermaid >}}
