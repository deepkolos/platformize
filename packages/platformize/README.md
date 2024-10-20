# platformize

platformize 通用构建插件和基础 API 适配, 可单独使用

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

#### 原始方式

需要高度定制`rollup.config.js`也可以选择自行组装

```javascript
import { platformize, DEFAULT_API_LIST } from 'platformize/dist-plugin';
import sucrase from '@rollup/plugin-sucrase';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';

// threejs+tensorflow需要禁止global的polyfill
DEFAULT_API_LIST.splice(DEFAULT_API_LIST.indexOf('global'), 1);

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
      ...platformize(DEFAULT_API_LIST), // 注意需要解构
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
...等等
// 使用完毕后销毁资源
wechatPlatform.dispose();
```

<details>
<summary>业务代码中按照Web方式使用以下API, 但非完全等价, 只实现了常用的部分</summary>

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

可通过`飞书`群里 DeepKolos 联系我, ~~QQ群广告太多了~~

<img width="250" src="https://raw.githubusercontent.com/deepkolos/platformize/main/docs/lark-group.jpeg" />
# 赞助

如果项目对您有帮助或者有适配需求，欢迎打赏

<img src="https://upload-images.jianshu.io/upload_images/252050-d3d6bfdb1bb06ddd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" alt="赞赏码" width="300">

感谢各位支持~~
