# platformize

platformize 通用构建插件和基础 API 适配, 可单独使用

<details>
<summary><h3>各小程序限制情况(点击展开)</h3></summary>

- 小程序均不支持动态加载 JS, 所以`Scrpit`或`Wasm`Module 均不支持网络加载

#### 微信小程序限制

- 纹理图片分辨率不能大于 `2048`, 下载 ArrayBuffer 大小不能大于 `10MB`
- WebGL 扩展 `OES_vertex_array_object` 有问题, 需手动禁用

#### 淘宝小程序限制

- 网络资源有严格的限制, 白名单需工单要内部的申请地址, 最长 3 个月, 过期失效, 建议走云存储
- WebGL 扩展 `EXT_blend_minmax` 返回 undefined, 需手动禁用

#### 字节小程序限制

- WebGL 不开放给个人开发者
</details>

## 使用

```text
pnpm i -S platformize
```

`rollup.config.js`注入特定配置

```javascript
import { mergeRollupOptions } from 'platformize/dist-plugin';

export default mergeRollupOptions(
  {
    input: ['./miniprogram/pages/index/index.ts'],
    output: {
      format: 'cjs',
      dir: 'miniprogram/',
      entryFileNames: 'pages/[name]/[name].js',
    },
  },
  { minify: process.env.BUILD === 'production' },
);
```

需要高度定制`rollup.config.js`也可以选择自行组装

```javascript
import { platformize } from 'platformize/dist-plugin';

export default {
  {
    input: ['./miniprogram/pages/index/index.ts'],
    output: {
      format: 'cjs',
      dir: 'miniprogram/',
      entryFileNames: 'pages/[name]/[name].js',
      chunkFileNames: 'chunks/[name].js',
    },
    plugins: [
      builtins(),
      resolve({ extensions: ['.ts', '.js'] }),
      sucrase({ transforms: ['typescript'] }),
      commonjs(),
      ...platformize(), // 注意需要解构
      terser({ output: { comments: false } }),
    ]
  },
}
```

业务代码根据小程序平台引入对应的`Platform`

```javascript
import {
  PlatformManager,
  WechatPlatform,
  TaobaoPlatform,
  WechatGamePlatform,
  BytePlatform,
} from 'platformize';

const width = canvasClientWidth;
const height = canvasClientHeight;
const wechatPlatform = new WechatPlatform(canvas, width, height);
const wechatGamePlatform = new WechatGamePlatform(canvas, width, height);
const taobaoPlatform = new TaobaoPlatform(canvas, width, height);
const bytePlatform = new BytePlatform(canvas, width, height);
PlatformManager.set(wechatPlatform);

window.innerWidth
window.innerHeight
window.devicePixelRatio
requestAnimationFrame();
cancelAnimationFrame();
const xhr = new XMLHttpRequest();
...['等等']
```

<details>
<summary>业务代码中按照Web方式使用以下API, 但非完全等价</summary>

- URL
- Blob
- window
- document
- DOMParser
- TextDecoder
- XMLHttpRequest
- OffscreenCanvas
- HTMLCanvasElement
- HTMLImageElement
- Image

- atob
- global
- navigator
- performance
- createImageBitmap
- cancelAnimationFrame
- requestAnimationFrame
</details>

## TODO

0. 构建缓存 ❎ manualChunks 后小程序开发工具更新速度还行吧
1. API_LIST 解耦, 可由对应 Platform 方提供, ❎ 还是耦合吧, 一般和引擎相关, three 多了一个 $defaultWebGLExtensions 的全局变量
2. 提供两种使用方式, 一种集成常用 plugin 以及配置, 传递配置来 overwirte, 另一种只导出 platformize plugin, rollup 配置自行组装 ✅

## 讨论

可通过群里 DeepKolos 联系我

<img width="250" src="https://raw.githubusercontent.com/deepkolos/three-platformize/master/docs/qq-group.jpg" />

# 赞助

如果项目对您有帮助或者有适配需求，欢迎打赏

<img src="https://upload-images.jianshu.io/upload_images/252050-d3d6bfdb1bb06ddd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" alt="赞赏码" width="300">

感谢各位支持~~
