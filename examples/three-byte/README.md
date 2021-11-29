# three-platformize 头条小程序 DEMO

[three-platformize](https://github.com/deepkolos/three-platformize)


<div>
  <img src="https://raw.githubusercontent.com/deepkolos/three-platformize-demo-byte/master/demo.gif" width="250" alt="" style="display:inline-block;"/>
</div>

# 运行

请使用**最新版本**的头条开发工具打开miniprogram目录，切换到自己的测试appId即可运行，**打开调试模式，不校验域名**

如果需要修改代码，可按照已下步骤构建

```sh
// 安装依赖
> npm i

// 运行构建
> npm run dev

// 小程序打开即可 **miniprogram** 目录
```

## 进度

0. 渲染一个plane √
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

0. renderer.setPixelRatio($window.devicePixelRatio) 图像不居中(官方回复基础库2.9修复)
1. OrbitControls 双指操作无效