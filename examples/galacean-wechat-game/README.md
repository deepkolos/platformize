# platformize-galacean-demo-wechat-game

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
