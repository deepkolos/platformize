# [WIP]platformize

一个支持把 js 库中浏览器 api 改用定制 polyfill 的`构建`插件, 并提供特定库的定制适配, 比如`threejs/oasis/playcanvas`

## 目录设计

```yml
examples
  # 测试用例基类
  - tests-three                    # three测试用例
  - tests-oasis                    # oasis测试用例
  - tests-playcanvas               # playcanvas测试用例

  - three-wechat                   # 微信小程序three测试用例
  - three-wechat-game              # 微信小游戏three测试用例
  - three-taobao                   # 淘宝小程序three测试用例
  - three-byte                     # 字节小程序three测试用例

  - oasis-wechat                   # 微信小程序oasis测试用例
  - oasis-wechat-game              # 微信小游戏oasis测试用例
  - oasis-taobao                   # 淘宝小程序oasis测试用例
  - oasis-byte                     # 字节小程序oasis测试用例

  - playcanvas-wechat              # 微信小程序playcanvas测试用例
  - playcanvas-wechat-game         # 微信小游戏playcanvas测试用例
  - playcanvas-taobao              # 淘宝小程序playcanvas测试用例
  - playcanvas-byte                # 字节小程序playcanvas测试用例

packages
  - platformize
  - - base                         # 平台无关的适配
  - - wechat                       # 微信小程序通用适配
  - - wechat-game                  # 微信小游戏通用适配
  - - taobao                       # 淘宝小程序通用适配
  - - byte                         # 字节小程序通用适配

  - platformize-three
  - - base                         # 平台无关three相关的适配
  - - wechat                       # 微信小程序three相关适配
  - - wechat-game                  # 微信小游戏three相关适配
  - - taobao                       # 淘宝小程序three相关适配
  - - byte                         # 字节小程序three相关适配

  - platformize-oasis
  - - base                         # 平台无关oasis相关的适配
  - - wechat                       # 微信小程序oasis相关适配
  - - wechat-game                  # 微信小游戏oasis相关适配
  - - taobao                       # 淘宝小程序oasis相关适配
  - - byte                         # 字节小程序oasis相关适配

  - platformize-playcanvas
  - - base                         # 平台无关playcanvas相关的适配
  - - wechat                       # 微信小程序playcanvas相关适配
  - - wechat-game                  # 微信小游戏playcanvas相关适配
  - - taobao                       # 淘宝小程序playcanvas相关适配
  - - byte                         # 字节小程序playcanvas相关适配
```

适配器的版本号与`threejs/oasis/playcanvas`主版本号一一对应, adapter 除外

## 使用 pnpm workspaces 管理 monorepo

https://www.raulmelo.dev/blog/replacing-lerna-and-yarn-with-pnpm-workspaces
https://zhuanlan.zhihu.com/p/422740629

## 构建思路

由于是应用层直接使用的构建插件，目测不能直接使用@rollup/plugin-inject，或者是需要类似 webpack loader，其中一个 loader 处理完，交给后续 loader 继续 resolve，继续收集依赖，需要看看 rollup 的 plugin 机制来

plugin需自带manualChunks配置, 用于缓解淘宝小程序几分钟的构建耗时

## TODO

0. 了解 rollup plugin 调用机制以及 inject 的实现
1. 统一使用TS作为源码, plugin测试方法与rollup/plugins一致
