# platformize-three 微信小程序 DEMO

[platformize-three](https://github.com/deepkolos/platformize)

需要最基本的 demo 可参考[three-wechat-simple](../three-wechat-simple/README.md)

<div>
  <img src="https://raw.githubusercontent.com/deepkolos/platformize-three-demo-wechat/master/demo.gif" width="250" alt="" style="display:inline-block;"/>
</div>

<div>
  <img src="https://raw.githubusercontent.com/deepkolos/platformize-three-demo-wechat/master/qrcode.jpg" width="200" alt="" style="display:inline-block;"/>
</div>

# 运行

请使用**最新版本**的微信开发工具打开，切换到自己的测试 appId 即可运行，**打开调试模式**

如果需要修改代码，可按照已下步骤构建

```sh
// 安装依赖
> pnpm i

// 运行构建
> pnpm run dev

// 小程序打开即可
```

#### 内存测试结果

用例 1：重复加载一个有纹理的 glb

> 安卓表现正常，长时间不崩
> IPad 长时间也不崩（15 分钟），但是加载 GLB 时长十分长，5000ms+ 模型 models/gltf/Soldier.glb

IPAD 来回进出页面崩
