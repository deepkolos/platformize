import { PlatformManager, WechatPlatform } from 'platformize-playcanvas';
import * as DEMO from 'tests-playcanvas';
import * as pc from 'playcanvas';

const getNode = id => new Promise(r => tt.createSelectorQuery().select(id).node().exec(r));

Page({
  platform: null as unknown as WechatPlatform,
  canvas: null as unknown as WechatMiniprogram.Canvas,
  currDemo: null as unknown as pc.Application,
  switchingItem: false,

  data: {
    showMenu: true,
    showCanvas: false,
    currItem: -1,
    menuList: Object.keys(DEMO),
  },

  onReady() {
    this.onCanvasReady();
  },

  onCanvasReady() {
    console.log('onCanvasReady');
    Promise.all([getNode('#gl'), getNode('#canvas')]).then(([glRes, canvasRes]) => {
      console.log(glRes, canvasRes);
      // @ts-ignore
      this.initCanvas(glRes[0].node, canvasRes[0].node);
    });
  },

  initCanvas(canvas, helperCanvas) {
    const platform = new WechatPlatform(canvas);
    this.platform = platform;
    // platform.enableDeviceOrientation('game');
    PlatformManager.set(platform);

    console.log(window.innerWidth, window.innerHeight);
    console.log(canvas.width, canvas.height);

    this.canvas = canvas;
  },

  onMenuClick() {
    const showMenu = !this.data.showMenu;
    if (showMenu) {
      this.setData({ showMenu, showCanvas: false });
    } else {
      this.setData({ showMenu });
      setTimeout(() => {
        this.setData({ showCanvas: true });
      }, 330);
    }
  },

  async onMenuItemClick(e) {
    const { i, item } = e.currentTarget.dataset;
    tt.showLoading({ mask: false, title: '加载中' });
    try {
      if (this.switchingItem || !DEMO[item]) return tt.hideLoading();

      this.currDemo?.destroy();
      this.switchingItem = true;
      this.currDemo = null;

      const demo = await DEMO[item](this.canvas);
      if (!demo) console.error('no engine instance returned');
      this.currDemo = demo;
      this.setData({ currItem: i });
      this.onMenuClick();
      this.switchingItem = false;
      tt.hideLoading();
    } catch (error) {
      console.error(error);
      tt.hideLoading();
    }
  },

  onTX(e) {
    this.platform.dispatchTouchEvent(e);
  },

  onUnload() {
    this.currDemo?.destroy();
    PlatformManager.dispose();
  },
});
