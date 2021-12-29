# platformize-three-demo-byte 字节小程序

[platformize](https://github.com/deepkolos/platformize)

<div>
  <img src="https://raw.githubusercontent.com/deepkolos/three-platformize-demo-byte/master/demo.gif" width="250" alt="" style="display:inline-block;"/>
</div>

# 运行

```sh
# 安装依赖
> rush install

# dev
> rush build:watch

# 小程序开发工具打开miniprogram目录即可, 开调试模式

# prod
> rush build
```

## 进度

0. 渲染一个 plane √
1. TextureLoader √
2. GLTFLoader √
3. RGBELoader √
4. SVGLoader √
5. OBJLoader √
6. EXRLoader √
7. HDRPrefilterTexture √
8. MTLLoader √
9. LWOLoader √
10. FBXLoader √
11. BVHLoader √
12. COlladaLoader √ (DOMParser querySelector 未适配)
13. TTFLoader √
14. STLLoader √
15. PDBLoader √
16. TGALoader √

## 问题

0. renderer.setPixelRatio(window.devicePixelRatio) 图像不居中(官方回复基础库 2.9 修复)
1. OrbitControls 双指操作无效, 初步定位是 changedTouches 不对, 所标识的 identifier 也不对 已绕过

## 讨论

可通过群里 DeepKolos 联系我

<img width="250" src="../../docs/qq-group.jpg" />

# 赞助

如果项目对您有帮助或者有适配需求，欢迎打赏

<img src="https://upload-images.jianshu.io/upload_images/252050-d3d6bfdb1bb06ddd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" alt="赞赏码" width="300">

感谢各位支持~~
