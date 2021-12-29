# platformize-oasis

[`oasis-engine@0.6.3`](https://github.com/oasis-engine/engine) 专门适配

> 更加全面的适配可参考官方的适配库 [oasis-engine/miniprogram-adapter](https://github.com/oasis-engine/miniprogram-adapter) 也欢迎 PR 集成到本仓库

## 使用

```text
pnpm i -S platformize-oasis@0.6.3 oasis-engine@0.6.3
```

`rollup.config.js`注入特定配置

```javascript
import { mergeRollupOptions } from 'platformize-oasis/dist-plugin';

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
import { PlatformManager, WechatPlatform } from 'platformize-oasis';

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

### 详细例子

- [oasis-wechat](../../examples/oasis-wechat/README.md)
- [oasis-wechat-simple](../../examples/oasis-wechat-simple/README.md)
- [oasis-wechat-game](../../examples/oasis-wechat-game/README.md)
- [oasis-taobao](../../examples/oasis-taobao/README.md)

## 讨论

可通过群里 DeepKolos 联系我

<img width="250" src="../../docs/qq-group.jpg" />

# 赞助

如果项目对您有帮助或者有适配需求，欢迎打赏

<img src="https://upload-images.jianshu.io/upload_images/252050-d3d6bfdb1bb06ddd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" alt="赞赏码" width="300">

感谢各位支持~~
