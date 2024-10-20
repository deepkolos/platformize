# platformize-pixi

`pixijs@6.2.1` 专门适配

## 使用

```text
pnpm i -S platformize-pixi@6.2.4

# 根据实际使用模块安装 https://pixijs.io/customize/
# 模块引入可参考 [tests-pixi/pixi.ts](../../examples/tests-pixi/pixi.ts)
pnpm i -S @pixi/constants@6.2.1 \
          @pixi/core@6.2.1 \
          @pixi/math@6.2.1 \
          @pixi/runner@6.2.1 \
          @pixi/settings@6.2.1 \
          @pixi/ticker@6.2.1 \
          @pixi/utils@6.2.1 \
          @pixi/app@6.2.1 \
          @pixi/display@6.2.1 \
          @pixi/sprite@6.2.1 \
          @pixi/unsafe-eval@6.2.1
```

`rollup.config.js`注入特定配置

```javascript
import { mergeRollupOptions } from 'platformize-pixi/dist-plugin';

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
import { PlatformManager, WechatPlatform } from 'platformize-pixi';

const width = canvasClientWidth;
const height = canvasClientHeight;
const wechatPlatform = new WechatPlatform(canvas, width, height);
PlatformManager.set(wechatPlatform);
wechatPlatform.init(PIXI, canvas2D); // 需要额外的注入canvas2d的引用来支持text-bitmap

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

### 详细例子

- [pixi-wechat](https://raw.githubusercontent.com/deepkolos/platformize/main/examples/pixi-wechat/README.md)
- [pixi-wechat-simple](https://raw.githubusercontent.com/deepkolos/platformize/main/examples/pixi-wechat-simple/README.md)
- [pixi-wechat-game](https://raw.githubusercontent.com/deepkolos/platformize/main/examples/pixi-wechat-game/README.md)
- [pixi-taobao](https://raw.githubusercontent.com/deepkolos/platformize/main/examples/pixi-taobao/README.md)
- [pixi-byte](https://raw.githubusercontent.com/deepkolos/platformize/main/examples/pixi-byte/README.md)

## 已知问题

## 讨论

可通过`飞书`群里 DeepKolos 联系我, ~~QQ群广告太多了~~

<img width="250" src="https://raw.githubusercontent.com/deepkolos/platformize/main/docs/lark-group.jpeg" />
# 赞助

如果项目对您有帮助或者有适配需求，欢迎打赏

<img src="https://upload-images.jianshu.io/upload_images/252050-d3d6bfdb1bb06ddd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" alt="赞赏码" width="300">

感谢各位支持~~
