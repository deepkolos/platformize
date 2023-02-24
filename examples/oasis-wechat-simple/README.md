# platformize-oasis-demo-wechat-simple

最基本的 oasis demo, 显示一个 gltf 模型

> 0.6.3: 小程序包大小`552kb`, 运行时反馈式 treeshaking 后 `297kb`
> 0.8.3: 小程序包大小`597kb`, 运行时反馈式 treeshaking 后 `301kb`

[platformize](https://github.com/deepkolos/platformize)

# 运行

```sh
# 全局依赖(若未安装)
pnpm i -g @microsoft/rush concurrently @swc/cli @swc/core

# 安装/更新依赖
> rush update

# dev 进入到本目录后
> pnpm dev

# 小程序开发工具打开本目录即可, 开调试模式

# prod 进入到本目录后
> pnpm build
```

## 运行时反馈式 treeshaking

```sh
# 运行时反馈式treeshaking slot
> pnpm run dev-hotcode-slot / pnpm run build-hotcode-slot

# 模拟器内操作, 然后控制台执行 JSON.stringify(console.fireLog) 保存内容到 firelog.json

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
