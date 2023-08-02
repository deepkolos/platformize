import { WechatGamePlatform, PlatformManager } from "platformize-galacean";
// import { Demo as Demo1 } from "./demo";
// import { Demo as Demo2 } from "./demo2";
// import { Demo as Demo3 } from "./demo3";
// import { Demo as Demo4 } from "./demo4";
// import { Demo as Demo5 } from "./demo5";
// import { Demo as Demo6 } from "./demo6";
// import { Demo as Demo7 } from "./demo7";
// import { Demo as Demo8 } from "./demo-video";
import { Demo as PublishDemo } from "./publish-demo";

function Main() {
  const canvas = wx.createCanvas();
  PlatformManager.set(new WechatGamePlatform(canvas));

  // Demo1(canvas);
  // Demo2(canvas);
  // Demo3(canvas);
  // Demo4(canvas);
  // Demo5(canvas);
  // Demo6(canvas);
  // Demo7(canvas);
  // Demo8(canvas);
  PublishDemo(canvas);
}

Main();
