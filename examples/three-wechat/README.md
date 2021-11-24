# three-platformize 微信小程序DEMO

[three-platformize](https://github.com/deepkolos/three-platformize)

需要最基本的demo可参考[three-platformize-demo-wechat-simple](https://github.com/deepkolos/three-platformize-demo-wechat-simple)

<div>
  <img src="https://raw.githubusercontent.com/deepkolos/three-platformize-demo-wechat/master/demo.gif" width="250" alt="" style="display:inline-block;"/>
</div>

<div>
  <img src="https://raw.githubusercontent.com/deepkolos/three-platformize-demo-wechat/master/qrcode.jpg" width="200" alt="" style="display:inline-block;"/>
</div>


# 运行

请使用**最新版本**的微信开发工具打开，切换到自己的测试appId即可运行，**打开调试模式**

如果需要修改代码，可按照已下步骤构建

```sh
// 安装依赖
> npm i

// 运行构建
> npm run dev

// 小程序打开即可
```

#### 内存测试结果

用例1：重复加载一个有纹理的glb

> 安卓表现正常，长时间不崩
> IPad 长时间也不崩（15分钟），但是加载GLB时长十分长，5000ms+ 模型 models/gltf/Soldier.glb

IPAD来回进出页面崩