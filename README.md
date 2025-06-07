# Hugo Apllo theme

## New Hugo site

```
hugo new site apllo-theme
```

```
apllo-hugo/
├── archetypes/
│   └── default.md    <-- 内容模板
├── assets/           <-- 资源管道传递的全局资源,例如sass等
├── content/          <-- 站点内容文件
├── i18n/             <-- 多语言配置
├── layouts/          <-- 框架结构
├── static/           <-- 静态文件
└── hugo.toml         <-- 站点配置
```

## add new blog

```sh
# 新建一个log
# 会创建draft的log,
hugo new posts/[datetime]-logname.md
# localhost启动hugo服务 
hugo serve -D
``` 

## build to github

```sh
# build to public
# 如果想把draft的log部署，将draft设置为false
# hugo --baseUrl="your github page url"
hugo --baseUrl="https://zhuzaiye.github.io/"

# 部署github page
cd public
git add . && git commit -m "" && git push origin master
```