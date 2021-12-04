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
  - - plugin                       # rollup插件
  - - base                         # 平台无关的适配
  - - wechat                       # 微信小程序通用适配
  - - wechat-game                  # 微信小游戏通用适配
  - - taobao                       # 淘宝小程序通用适配
  - - byte                         # 字节小程序通用适配

  - platformize-three
  - - plugin                       # rollup插件
  - - base                         # 平台无关three相关的适配
  - - wechat                       # 微信小程序three相关适配
  - - wechat-game                  # 微信小游戏three相关适配
  - - taobao                       # 淘宝小程序three相关适配
  - - byte                         # 字节小程序three相关适配

  - platformize-oasis
  - - plugin                       # rollup插件
  - - base                         # 平台无关oasis相关的适配
  - - wechat                       # 微信小程序oasis相关适配
  - - wechat-game                  # 微信小游戏oasis相关适配
  - - taobao                       # 淘宝小程序oasis相关适配
  - - byte                         # 字节小程序oasis相关适配

  - platformize-playcanvas
  - - plugin                       # rollup插件
  - - base                         # 平台无关playcanvas相关的适配
  - - wechat                       # 微信小程序playcanvas相关适配
  - - wechat-game                  # 微信小游戏playcanvas相关适配
  - - taobao                       # 淘宝小程序playcanvas相关适配
  - - byte                         # 字节小程序playcanvas相关适配
```

适配器的版本号与`threejs/oasis/playcanvas`主版本号一一对应, adapter 除外

### 使用 pnpm workspaces 管理 monorepo

https://www.raulmelo.dev/blog/replacing-lerna-and-yarn-with-pnpm-workspaces
https://zhuanlan.zhihu.com/p/422740629

## 构建特性

1. 定制版 plugin-inject 实现全局 API 的替换或者局部 所引入 module 的 overwrite
2. plugin 需自带 manualChunks 配置, 用于缓解淘宝小程序几分钟的构建耗时
3. 提供两种使用方式, 一种是便捷版, 少配置, 一种是骨头版, 允许用户自行组装
4. 可 overwrite polyfill platformzie 进行扩展

## TODO

0. 了解 rollup plugin 调用机制(TODO) 以及 inject 的实现 ✅
1. 统一使用 TS 作为源码, plugin 测试方法与 rollup/plugins 一致 (仅 platformize) ✅
2. 增加方便 rollup 配置 (mergeRollupOptions) 和自行组装 (platformize) 两种方式 ✅
3. 初步实现 platform 等 overwrite 机制 可能 不是最好的办法 ✅
4. fix window support ✅
5. playcanvas 初始版本适配 ✅
6. oasis 初始版本适配 (跑通 cube, glb, FlappyBrid) (模拟器 ✅, 真机 ❎ 只有 BufferMeshInstance 显示出东西)
7. 小程序一般不支持动态加载 js, 所以 playcanvas 的 Script 的动态加载将不会被支持, 需构建方式引入 (可见 tween 例子) ✅
8. 构建迁移到 rush
