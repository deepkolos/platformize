# platformize

一个支持把 js 库中浏览器 api 改用定制 polyfill 的`构建`插件, 并提供特定库的定制适配, 如:

- `three@0.133.0`
- `oasis-engine@0.8.3` | `oasis-engine@0.6.3`
- `galacean@1.0.0-beta.14`
- `playcanvas@1.50.0`
- `pixi@6.2.1`

> 欢迎各位提 PR, 分享小程序的适配经验, 把这些经验集中起来, 让小程序的 3D 开发更便利, 当然适配到 ReactNative, 快应用, Lynx 等其他 Hybrid 也是同理, 编写 Web API 对应的 polyfill+library 的一些 patch 即可

## 适配情况

> 真机[✅/❌] 模拟器[✅/❌]

|            | ThreeJS | Oasis | Playcanvas | PixiJS | Galacean |
| ---------- | ------- | ----- | ---------- | ------ | -------- |
| 微信小程序 | ✅ ✅   | ✅ ✅ | ✅ ✅      | ✅ ✅  | ✅ ✅    |
| 微信小游戏 | ✅ ✅   | ✅ ✅ | ✅ ✅      | ✅ ✅  | ✅ ✅    |
| 淘宝小程序 | ✅ ❌   | ✅ ❌ | ✅ ❌      |        |          |
| 抖音小程序 | ✅ ✅   | ✅ ✅ | ✅ ✅      | ✅ ✅  |          |

- [platformize 通用适配](./packages/platformize/README.md)
- [platformize-three 专门适配](./packages/platformize-three/README.md)
- [platformize-galacean 专门适配](./packages/platformize-galacean/README.md)
- [platformize-oasis 专门适配](./packages/platformize-oasis/README.md)
- [platformize-playcanvas 专门适配](./packages/platformize-playcanvas/README.md)
- [platformize-pixi 专门适配](./packages/platformize-pixi/README.md)

## 特点

0. 使用方式与 web 完全一致, 更方便跨端代码复用
1. 支持运行时反馈式 treeshaking, [oasis-wechat-game](./examples/oasis-wechat-game/README.md)小程序包大小从`545kb` > `290kb`

<details>

<summary style="font-size: 24px;display: flex;align-items: center;">各小程序限制情况</summary>

- 小程序均不支持动态加载 JS, 所以`Scrpit`或`Wasm`Module 均不支持网络加载

#### 微信小程序限制

- 纹理图片分辨率不能大于 `2048`, 下载 ArrayBuffer 大小不能大于 `10MB`
- WebGL 扩展 `OES_vertex_array_object` 有问题, 需手动禁用
- 基础库版本`2.24.1`以上有`texSubImage2D`api 报错问题, 会导致 oasis 加载图片为黑色(已 patch 修复) [#10](https://github.com/deepkolos/platformize/issues/10)

#### 淘宝小程序限制

- 网络资源有严格的限制, 白名单需工单要内部的申请地址, 最长 3 个月, 过期失效, 建议走云存储
- WebGL 扩展 `EXT_blend_minmax` 返回 undefined, 需手动禁用

#### 字节小程序限制

- ~~WebGL 不开放给个人开发者~~
</details>

## 截图

<div>
  <img src="https://raw.githubusercontent.com/deepkolos/platformize/main/examples/three-wechat/demo.gif" width="250" alt="" style="display:inline-block;"/>
  <img src="https://raw.githubusercontent.com/deepkolos/platformize/main/examples/oasis-wechat/demo.gif" width="250" alt="" style="display:inline-block;"/>
  <img src="https://raw.githubusercontent.com/deepkolos/platformize/main/examples/playcanvas-wechat/demo.gif" width="250" alt="" style="display:inline-block;"/>
  <img src="https://raw.githubusercontent.com/deepkolos/platformize/main/examples/pixi-wechat/demo.gif" width="250" alt="" style="display:inline-block;"/>
</div>

<h3 align="center">Special Sponsors</h3>

<table>
  <tbody>
    <tr>
      <td align="center" valign="middle">
        <a href="https://www.yuntucad.com" target="_blank" align="center">
          <img height="40px" alt="云图三维-在线三维CAD设计软件" src="https://upload-images.jianshu.io/upload_images/252050-3b45b9102c4b7a1f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240"><br>
          云图三维-在线三维CAD设计软件
        </a>
      </td>
      <td align="center" valign="middle">
        <a href="https://www.oppentech.com/" target="_blank" align="center">
          <img height="40px" alt="奥本未来-AR/VR领域先行者" src="https://s3.cn-northwest-1.amazonaws.com.cn/oppenhome/logo_black.png"><br>
          奥本未来-AR/VR领域先行者
        </a>
      </td>
    </tr><tr></tr>
  </tbody>
</table>

## 构建特性

1. 定制版 plugin-inject 实现全局 API 的替换或者局部 所引入 module 的 overwrite
2. plugin 需自带 manualChunks 配置, 用于缓解淘宝小程序几分钟的构建耗时
3. 提供两种使用方式, 一种是便捷版, 少配置, 一种是骨头版, 允许用户自行组装
4. 可 overwrite polyfill platformzie 进行扩展

## 运行例子/开发贡献

> 使用 [rush](https://rushjs.io/) 管理 monorepo

```sh
pnpm i -g @microsoft/rush concurrently @swc/cli @swc/core typescript
rush update

# dev all
rush build:watch

# dev three wechat example
rush build:watch --to-except platformize-three-wechat
cd examples/three-wechat
pnpm dev

# dev oasis example
rush build:watch --to-except platformize-oasis-wechat
cd examples/oasis-wechat
pnpm dev

# dev playcanvas wechat example
rush build:watch --to-except platformize-playcanvas-wechat
cd examples/playcanvas-wechat
pnpm dev

# dev pixi wechat example
rush build:watch --to-except platformize-pixi-wechat
cd examples/pixi-wechat
pnpm dev

# dev pixi byte example
rush build:watch --to-except platformize-pixi-wechat
cd examples/pixi-byte
pnpm dev

# prod
rush build
rush rebuild
```

## 目录设计

```yml
examples
  # 测试用例基类
  - tests-three                # three测试用例
  - tests-oasis                # oasis测试用例
  - tests-playcanvas           # playcanvas测试用例
  - tests-pixi                 # pixi测试用例

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

  - pixi-wechat-simple         # 微信小程序pixi基础用例
  - pixi-wechat                # 微信小程序pixi测试用例
  - pixi-wechat-game           # 微信小游戏pixi测试用例
  - pixi-taobao                # 淘宝小程序pixi测试用例
  - pixi-byte                  # 字节小程序pixi测试用例

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

  - platformize-pixi
  - - plugin                   # rollup插件
  - - src
  - - - base                   # 平台无关pixi相关的适配
  - - - wechat                 # 微信小程序pixi相关适配
  - - - wechat-game            # 微信小游戏pixi相关适配
  - - - taobao                 # 淘宝小程序pixi相关适配
  - - - byte                   # 字节小程序pixi相关适配
```

适配器的版本号与`threejs/oasis/playcanvas/pixi`主版本号一一对应, adapter 除外

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
11. 运行时反馈式 tree shaking (类似 tfjs custom module 的方式[tfjs-treeshaking-test](https://github.com/deepkolos/tfjs-treeshaking-test)) prototype ✅
12. ~~新增 prebuild 包, 允许无需额外构建使用方式即 three-platformize 的方式~~(一想到还需要 prebuild 生态就算了比如单独 prebuild three 还不够, 还得 exampls jsm, 其他渲染引擎也类似)

## 适配经验

0. new Blob(parts, options) 的 options 非可选, 需要填写 mimeType

## 讨论

可通过`飞书`群里 DeepKolos 联系我, ~~QQ群广告太多了~~

<img width="250" src="https://raw.githubusercontent.com/deepkolos/platformize/main/docs/lark-group.jpeg" />

# 赞助

如果项目对您有帮助或者有适配需求，欢迎打赏

<img src="https://upload-images.jianshu.io/upload_images/252050-d3d6bfdb1bb06ddd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" alt="赞赏码" width="300">

感谢各位支持~~

| 时间       | 大佬                                       |
| ---------- | ------------------------------------------ |
| 2023/02/20 | 程序员-徐工                                |
| 2023/01/10 | 随映                                       |
| 2022/08/19 | 背影                                       |
| 2022/06/09 | 没有壳的蜗牛                               |
| 2022/06/08 | 扫地禅僧-马乐                              |
| 2022/05/30 | 许先生                                     |
| 2022/03/21 | 江尘                                       |
| 2022/03/21 | 林秋 maksim                                |
| 2021/12/20 | 神神                                       |
| 2021/11/10 | 神神                                       |
| 2021/09/27 | 阿不                                       |
| 2021/08/10 | 奥本未来                                   |
| 2021/07/28 | Noth1ng                                    |
| 2021/07/09 | 匿名                                       |
| 2021/07/07 | [云图 CAD-刘鑫](https://www.yuntucad.com/) |
| 2021/06/23 | Fong                                       |
| 2021/06/23 | 刘子弃                                     |
| 2021/06/23 | Joson                                      |
| 2021/06/03 | 仿生伏尔泰                                 |
| 2021/04/28 | Noth1ng                                    |
