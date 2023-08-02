# platformize-galacean

[`galacean/engine`](https://github.com/galacean/engine) 专门适配

> 更加全面的适配可参考官方的适配库 [galacean/miniprogram-adapter](https://github.com/galacean/miniprogram-adapter/) 也欢迎 PR 集成到本仓库

## 使用

```text
pnpm i -S platformize-galacean @galacean/engine
```

`rollup.config.js`注入特定配置

```javascript
import { mergeRollupOptions } from 'platformize-galacean/dist-plugin';

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

自行组装版本见[这里](../platformize/README.md#原始方式)

```js
import { PlatformManager, WechatPlatform } from 'platformize-galacean';

const width = canvasClientWidth;
const height = canvasClientHeight;
const wechatPlatform = new WechatPlatform(canvas, width, height);
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

## Note
微信基础库api差异：
  1. 在小游戏中使用createOffscreenCanvas会返回空对象，需要使用createOffScreenCanvas

微信小程序和小游戏差异:
  1. 创建视频, 小程序使用wx.createVideoContext, 小游戏使用wx.createVideo
