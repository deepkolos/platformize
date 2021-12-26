# platformize [WIP]

一个支持把 js 库中浏览器 api 改用定制 polyfill 的`构建`插件, 并提供特定库的定制适配, 比如`threejs@0.133.0 / oasis@0.6.3 / playcanvas@1.50.0`

> 欢迎各位提 PR, 分享小程序的适配经验, 把这些经验集中起来, 让小程序的 3D 开发更便利, 当然适配到 ReactNative, 快应用, Lynx 等其他 Hybrid 也是同理

## 适配情况

|                  | ThreeJS | Oasis | Playcanvas |
| ---------------- | ------- | ----- | ---------- |
| 微信小程序真机   | ✅      | ✅    | ✅         |
| 微信小程序模拟器 | ✅      | ✅    | ✅         |
| 微信小游戏真机   | ✅      | ✅    | ✅         |
| 微信小游戏模拟器 | ✅      | ✅    | ✅         |
| 淘宝小程序真机   | ✅      | ✅    | ✅         |
| 淘宝小程序模拟器 | ❌      | ❌    | ❌         |
| 字节小程序真机   | ✅      |       |            |
| 字节小程序模拟器 | ❌      |       |            |

- [各小程序限制的情况](./packages/platformize/README.md)
- [ThreeJS 的具体情况](./packages/platformize-three/README.md)
- [Oasis 的具体情况](./packages/platformize-oasis/README.md)
- [Playcanvas 的具体情况](./packages/platformize-playcanvas/README.md)

## 截图

## 目录设计

```yml
examples
  # 测试用例基类
  - tests-three                # three测试用例
  - tests-oasis                # oasis测试用例
  - tests-playcanvas           # playcanvas测试用例

  - three-wechat-simple        # 微信小程序three基础用例
  - three-wechat               # 微信小程序three测试用例
  - three-wechat-game          # 微信小游戏three测试用例
  - three-taobao               # 淘宝小程序three测试用例
  - three-byte                 # 字节小程序three测试用例

  - oasis-wechat-simple        # 微信小程序oasis基础用例
  - oasis-wechat               # 微信小程序oasis测试用例
  - oasis-wechat-game          # 微信小游戏oasis测试用例
  - oasis-taobao               # 淘宝小程序oasis测试用例
  - oasis-byte                 # 字节小程序oasis测试用例

  - playcanvas-wechat-simple   # 微信小程序playcanvas基础用例
  - playcanvas-wechat          # 微信小程序playcanvas测试用例
  - playcanvas-wechat-game     # 微信小游戏playcanvas测试用例
  - playcanvas-taobao          # 淘宝小程序playcanvas测试用例
  - playcanvas-byte            # 字节小程序playcanvas测试用例

packages
  - platformize
  - - plugin                   # rollup插件
  - - src
  - - - base                   # 平台无关的适配
  - - - wechat                 # 微信小程序通用适配
  - - - wechat-game            # 微信小游戏通用适配
  - - - taobao                 # 淘宝小程序通用适配
  - - - byte                   # 字节小程序通用适配

  - platformize-three
  - - plugin                   # rollup插件
  - - src
  - - - base                   # 平台无关three相关的适配
  - - - wechat                 # 微信小程序three相关适配
  - - - wechat-game            # 微信小游戏three相关适配
  - - - taobao                 # 淘宝小程序three相关适配
  - - - byte                   # 字节小程序three相关适配

  - platformize-oasis
  - - plugin                   # rollup插件
  - - src
  - - - base                   # 平台无关oasis相关的适配
  - - - wechat                 # 微信小程序oasis相关适配
  - - - wechat-game            # 微信小游戏oasis相关适配
  - - - taobao                 # 淘宝小程序oasis相关适配
  - - - byte                   # 字节小程序oasis相关适配

  - platformize-playcanvas
  - - plugin                   # rollup插件
  - - cli                      # 转换编辑器导出项目到小程序cli
  - - src
  - - - base                   # 平台无关playcanvas相关的适配
  - - - wechat                 # 微信小程序playcanvas相关适配
  - - - wechat-game            # 微信小游戏playcanvas相关适配
  - - - taobao                 # 淘宝小程序playcanvas相关适配
  - - - byte                   # 字节小程序playcanvas相关适配
```

适配器的版本号与`threejs/oasis/playcanvas`主版本号一一对应, adapter 除外

## 构建特性

1. 定制版 plugin-inject 实现全局 API 的替换或者局部 所引入 module 的 overwrite
2. plugin 需自带 manualChunks 配置, 用于缓解淘宝小程序几分钟的构建耗时
3. 提供两种使用方式, 一种是便捷版, 少配置, 一种是骨头版, 允许用户自行组装
4. 可 overwrite polyfill platformzie 进行扩展

## 运行例子/开发贡献

> 使用 rush 管理 monorepo

https://www.raulmelo.dev/blog/replacing-lerna-and-yarn-with-pnpm-workspaces \
https://zhuanlan.zhihu.com/p/422740629 \
https://rushjs.io/

```sh
pnpm i -g @microsoft/rush concurrently
rush install

# dev
rush build:watch

rush build:watch --to-except platformize-playcanvas-wechat
pnpm dev --filter platformize-playcanvas-wechat

# prod
rush build
```

## TODO

0. 了解 rollup plugin 调用机制(TODO) 以及 inject 的实现 ✅
1. 统一使用 TS 作为源码, plugin 测试方法与 rollup/plugins 一致 (仅 platformize) ✅
2. 增加方便 rollup 配置 (mergeRollupOptions) 和自行组装 (platformize) 两种方式 ✅
3. 初步实现 platform 等 overwrite 机制 可能 不是最好的办法 ✅
4. fix window support ✅
5. playcanvas 初始版本适配 ✅
6. oasis 初始版本适配 (跑通 cube, glb, FlappyBrid) (模拟器 ✅, 真机 ✅)
7. 小程序一般不支持动态加载 js, 所以 playcanvas 的 Script 的动态加载将不会被支持, 需构建方式引入 (可见 tween/obj 例子) ✅
8. 构建迁移到 rush + swc (esbuild 不支持像 tsc 那样 transpile 目录) ✅
9. TextDecoder 支持更多格式 (TBD)
10. 支持 playcanvas 导出项目转换到小程序 ✅

## 适配经验

0. new Blob(parts, options) 的 options 非可选, 需要填写 mimeType

## 讨论

可通过群里 DeepKolos 联系我

<img width="250" src="https://raw.githubusercontent.com/deepkolos/platformize-three/master/docs/qq-group.jpg" />

# 赞助

如果项目对您有帮助或者有适配需求，欢迎打赏

<img src="https://upload-images.jianshu.io/upload_images/252050-d3d6bfdb1bb06ddd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" alt="赞赏码" width="300">

感谢各位支持~~
