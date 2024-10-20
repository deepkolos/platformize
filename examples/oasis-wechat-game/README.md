# platformize-oasis-demo-wechat-game

[platformize](https://github.com/deepkolos/platformize) 适配`oasis-engine`微信小游戏 Demo, 包大小`545kb`, 运行时反馈式 treeshaking 后大小为`290kb`

<div>
  <img src="https://raw.githubusercontent.com/deepkolos/platformize/main/examples/oasis-wechat-game/demo.gif" width="200"alt="" />
</div>

```ts
const engine = new WebGLEngine(canvas, { webGLMode: 2 }); // 需要强制标记使用WebGL1
```
  


```sh
# 全局依赖(若未安装)
pnpm i -g @microsoft/rush concurrently @swc/cli @swc/core

# 安装/更新依赖
> rush update

# dev 进入到本目录后
> pnpm dev

# 小程序开发工具打开minigame目录即可

# prod 进入到本目录后
> pnpm build
```

## 运行时反馈式 treeshaking

```sh
# 运行时反馈式treeshaking slot
> pnpm run dev-hotcode-slot / pnpm run build-hotcode-slot

# 模拟器内操作, 然后控制台执行JSON.stringify(定时每3s打印出来的对象) 保存内容到 firelog.json

# 然后, 执行remove
> pnpm run dev-hotcode-remove / pnpm run build-hotcode-remove
```

## 讨论

可通过`飞书`群里 DeepKolos 联系我, ~~QQ群广告太多了~~

<img width="250" src="https://raw.githubusercontent.com/deepkolos/platformize/main/docs/lark-group.jpeg" />
# 赞助

如果项目对您有帮助或者有适配需求，欢迎打赏

<img src="https://upload-images.jianshu.io/upload_images/252050-d3d6bfdb1bb06ddd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" alt="赞赏码" width="300">

感谢各位支持~~
