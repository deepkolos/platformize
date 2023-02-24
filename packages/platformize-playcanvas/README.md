# platformize-playcanvas

## 使用

```text
pnpm i -S platformize-playcanvas@1.50.2 playcanvas@1.50.0
```

`rollup.config.js`注入特定配置

```javascript
import { mergeRollupOptions } from 'platformize-playcanvas/dist-plugin';

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
import { PlatformManager, WechatPlatform } from 'platformize-playcanvas';

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

- [playcanvas-wechat](https://raw.githubusercontent.com/deepkolos/platformize/main/examples/playcanvas-wechat/README.md)
- [playcanvas-wechat-simple](https://raw.githubusercontent.com/deepkolos/platformize/main/examples/playcanvas-wechat-simple/README.md)
- [playcanvas-wechat-game](https://raw.githubusercontent.com/deepkolos/platformize/main/examples/playcanvas-wechat-game/README.md)
- [playcanvas-taobao](https://raw.githubusercontent.com/deepkolos/platformize/main/examples/playcanvas-taobao/README.md)
- [playcanvas-byte](https://raw.githubusercontent.com/deepkolos/platformize/main/examples/playcanvas-byte/README.md)

## 注意事项

- 小程序不支持网络动态加载`Script`, 需构建时引入, 例子可见[tests-playcanvas/tween](https://raw.githubusercontent.com/deepkolos/platformize/main/examples/tests-playcanvas/tween.ts)

## 转换 playcanvas 编辑器导出项目到小程序

工作目录为仓库根目录

```sh
node ./packages/platformize-playcanvas/cli.js -src=./resources/playcanvas-editor-exported/ -dst=./examples/tests-playcanvas/saved-project-auto/ -url=http://127.0.0.1:8080/
```

需在`resources/playcanvas-editor-exported`启动http服务

并修改文件内ip地址为自己ip的[__settings__.js](../../examples/tests-playcanvas/saved-project/__settings__.js)

## 讨论

可通过群里 DeepKolos 联系我

<img width="250" src="https://raw.githubusercontent.com/deepkolos/platformize/main/docs/qq-group.jpg" />

# 赞助

如果项目对您有帮助或者有适配需求，欢迎打赏

<img src="https://upload-images.jianshu.io/upload_images/252050-d3d6bfdb1bb06ddd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" alt="赞赏码" width="300">

感谢各位支持~~

| 时间       | 大佬 |
| ---------- | ---- |
| 2021/12/20 | 神神 |
