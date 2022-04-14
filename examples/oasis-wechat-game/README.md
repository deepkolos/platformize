# platformize-oasis-demo-wechat-game

[platformize](https://github.com/deepkolos/platformize) 适配`oasis-engine`微信小游戏 Demo, 包大小`545kb`, 运行时反馈式 treeshaking 后大小为`290kb`

<div>
  <img src="https://raw.githubusercontent.com/deepkolos/platformize/main/examples/oasis-wechat-game/demo.gif" width="200"alt="" />
</div>

```sh
# 安装依赖
> rush update

# dev
> rush build:watch

# 小程序开发工具打开minigame目录即可

# prod
> rush build
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

可通过群里 DeepKolos 联系我

<img width="250" src="https://raw.githubusercontent.com/deepkolos/platformize/main/docs/qq-group.jpg" />

# 赞助

如果项目对您有帮助或者有适配需求，欢迎打赏

<img src="https://upload-images.jianshu.io/upload_images/252050-d3d6bfdb1bb06ddd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" alt="赞赏码" width="300">

感谢各位支持~~
