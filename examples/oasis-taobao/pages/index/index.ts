import { PlatformManager, TaobaoPlatform } from 'platformize-oasis';
import * as DEMO from 'tests-oasis';
import type { Engine } from 'oasis-engine';

Page({
  data: {
    showMenu: true,
    currItem: -1,
    menuList: Object.keys(DEMO),
  },

  disposing: false,
  platform: null as unknown as TaobaoPlatform,
  canvas: null as unknown as WechatMiniprogram.Canvas,
  currDemo: null as unknown as Engine,
  switchingItem: false,

  onCanvasReady() {
    Promise.all([
      new Promise<DOMRect>(resolve =>
        my.createSelectorQuery().select('.canvas').boundingClientRect().exec(resolve),
      ),
      new Promise((resolve, reject) => {
        my.createCanvas({
          id: 'gl',
          success: resolve,
          fail: reject,
        });
      }),
    ])
      .then(([res, canvas]) => this.initCanvas(canvas, res[0]))
      .catch(() => my.alert({ content: '初始canvas失败' }));
  },

  onMenuClick() {
    this.setData({ showMenu: !this.data.showMenu });
  },

  async onMenuItemClick(e) {
    const { i, item } = e.currentTarget.dataset;

    if (this.switchingItem || !DEMO[item]) return;
    this.switchingItem = true;


    try {
      my.showLoading();
      this.currDemo?.destroy();
      const demo = (await DEMO[item](this.canvas)) as pc.Application;
      if (!demo) console.error('no app instance returned');

      this.currDemo = demo;
      this.setData({ currItem: i, showMenu: false });
      this.switchingItem = false;
    } catch (error) {
      console.error(error);
      // @ts-ignore
      my.alert({ content: error + ':' + JSON.stringify(error) });
    } finally {
      my.hideLoading();
    }
  },

  initCanvas(canvas, canvasRect) {
    try {
      const platform = new TaobaoPlatform(canvas, canvasRect.width, canvasRect.height);
      this.platform = platform;
      PlatformManager.set(platform);

      console.log(window.innerWidth, window.innerHeight);
      console.log(canvas.width, canvas.height);

      this.canvas = canvas;
    } catch (error) {
      console.error(error);
      // @ts-ignore
      my.alert({ content: error + ':' + JSON.stringify(error) });
    }
  },

  onTX(e) {
    this.platform.dispatchTouchEvent(e);
  },

  onUnload() {
    this.disposing = true;
    this.currDemo?.destroy();
    PlatformManager.dispose();
  },
});
