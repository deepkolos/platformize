# platformize-three-demo-wechat 微信小程序

<div>
  <img src="https://raw.githubusercontent.com/deepkolos/platformize/main/examples/three-wechat/demo.gif" width="250" alt="" style="display:inline-block;"/>
</div>

<div>
  <img src="https://raw.githubusercontent.com/deepkolos/platformize-three-demo-wechat/master/qrcode.jpg" width="200" alt="" style="display:inline-block;"/>
</div>

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

#### 内存测试结果

用例 1：重复加载一个有纹理的 glb

> 安卓表现正常，长时间不崩
> IPad 长时间也不崩（15 分钟），但是加载 GLB 时长十分长，5000ms+ 模型 models/gltf/Soldier.glb

IPAD 来回进出页面崩

## 讨论

可通过群里 DeepKolos 联系我

<img width="250" src="https://raw.githubusercontent.com/deepkolos/platformize/main/docs/qq-group.jpg" />

# 赞助

如果项目对您有帮助或者有适配需求，欢迎打赏

<img src="https://upload-images.jianshu.io/upload_images/252050-d3d6bfdb1bb06ddd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" alt="赞赏码" width="300">

感谢各位支持~~
