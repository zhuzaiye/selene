# Selene

A simple and minimalistic blog theme powered by [Hugo](https://gohugo.io/).


## Screenshorts


## Theme project frame

```
selene/
├── archetypes/
│   └── default.md    <-- Default Content Template
├── assets/           <-- Globally piped resources, such as Sass, etc.
├── content/          <-- Site content files
├── i18n/             <-- Multilingual configuration
├── layouts/          <-- Framework structure
├── static/           <-- Static files
└── hugo.toml         <-- Site configuration
```


## Usages


### Add new blog

```sh
hugo new posts/[datetime]-logname.md
hugo serve -MD
``` 

### build to github

```sh
hugo build -D https://zhuzaiye.github.io/

```

## References

This theme is based on [archie-zola](https://github.com/XXXMrG/archie-zola)
