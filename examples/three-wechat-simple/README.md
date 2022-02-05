# platformize-three-demo-wechat-simple 微信小程序

最基本的 threejs demo, 显示一个 gltf 模型，小程序包大小`606kb`, `运行时反馈式treeshaking`后只有`321kb`

# 运行

```sh
# 安装依赖
> rush install

# dev
> rush build:watch

# 小程序开发工具打开本目录即可, 开调试模式

# prod
> rush build
```

## 运行时反馈式treeshaking

```sh
# 运行时反馈式treeshaking slot
> pnpm run dev-hotcode-slot / pnpm run build-hotcode-slot

# 模拟器内操作, 然后控制台执行JSON.stringify(console.fireLog) 保存内容到 firelog.json

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
