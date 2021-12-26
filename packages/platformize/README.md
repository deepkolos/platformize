# platformize

platformize 通用构建插件和基础 API 适配

## 使用

## 限制情况

#### 微信小程序限制

- 纹理图片分辨率不能大于 2048, 下载 ArrayBuffer 不能大于 10MB
- WebGL 扩展 OES_vertex_array_object 有问题

#### 淘宝小程序限制

- 网络资源有严格的限制, 白名单需工单要内部的申请地址, 最长 3 个月, 过期失效, 建议走云存储
- WebGL 扩展 EXT_blend_minmax 返回 undefined

#### 字节小程序限制

- WebGL 不开放给个人开发者

## TODO

0. 构建缓存 TBD
1. API_LIST 解耦, 可由对应 Platform 方提供, ❎ 还是耦合吧, 一般和引擎相关, three 多了一个 $defaultWebGLExtensions 的全局变量
2. 提供两种使用方式, 一种集成常用 plugin 以及配置, 传递配置来 overwirte, 另一种只导出 platformize plugin, rollup 配置自行组装 ✅

## 讨论

可通过群里 DeepKolos 联系我

<img width="250" src="https://raw.githubusercontent.com/deepkolos/platformize-three/master/docs/qq-group.jpg" />

# 赞助

如果项目对您有帮助或者有适配需求，欢迎打赏

<img src="https://upload-images.jianshu.io/upload_images/252050-d3d6bfdb1bb06ddd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" alt="赞赏码" width="300">

感谢各位支持~~
