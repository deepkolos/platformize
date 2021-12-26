import { PlatformManager, WechatPlatform } from 'platformize-playcanvas';
import * as pc from 'playcanvas';
import { glb } from './glb';

Page({
  disposing: false,
  platform: null as unknown as WechatPlatform,
  app: null as unknown as pc.Application,

  onReady() {
    wx.createSelectorQuery()
      .select('#gl')
      .node()
      .exec(res => {
        const canvas = res[0].node;

        this.platform = new WechatPlatform(canvas);
        console.log(this.platform);
        PlatformManager.set(this.platform);

        this.app = glb(canvas);;
      });
  },

  onUnload() {
    this.disposing = true;
    PlatformManager.dispose();
    this.app?.destroy();
  },

  onTX(e: any) {
    this.platform.dispatchTouchEvent(e);
  },
});
