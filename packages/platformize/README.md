# platformize

platformize 通用构建插件

## TODO

0. 构建缓存 TBD
1. API_LIST 解耦, 可由对应 Platform 方提供, ❎ 还是耦合吧, 一般和引擎相关, three 多了一个 $defaultWebGLExtensions 的全局变量
2. 提供两种使用方式, 一种集成常用 plugin 以及配置, 传递配置来 overwirte, 另一种只导出 platformize plugin, rollup 配置自行组装 ✅
