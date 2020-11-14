# 开发者文档

- 代码注释和文档、Git log 使用中文。
- Git log 使用 cz-conventional-changelog 风格。

## 技术框架

- koa.js
- apollo graphql server
- typegraphql
- typeorm

## Apollo TypeGraph Playground

使用 Cookies 时，需要设置 `"request.credentials": "include"`。

## VS Code 插件

在 ledger-moment 的开发过程中使用了以下 VS Code 插件：

| 插件 ID | 功能 | 配置文件 |
| --- | --- | --- |
| dbaeumer.vscode-eslint | ESLint 插件 | eslintrc.yml |
| streetSideSoftware.code-spell-checker | 拼写检查 | cspell.json |

推荐的 VS Code 设置如下：

``` json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```
