import { Application } from '@pixi/app';
import { PlatformManager, WechatPlatform } from 'platformize-pixi';
import * as DEMO from 'tests-pixi';

const PIXI = DEMO.PIXI;

const getNode = id =>
  new Promise(r => wx.createSelectorQuery().select(id).fields({ node: true, size: true }).exec(r));

Page({
  platform: null as unknown as WechatPlatform,
  canvas: null as unknown as WechatMiniprogram.Canvas,
  currDemo: null as unknown as Application,
  canvasW: 0,
  canvasH: 0,
  switchingItem: false,

  data: {
    showMenu: true,
    showCanvas: false,
    currItem: -1,
    menuList: Object.keys(DEMO).filter(i => i !== 'PIXI'),
  },

  onReady() {
    this.onCanvasReady();
  },

  onCanvasReady() {
    console.log('onCanvasReady');
    Promise.all([getNode('#gl'), getNode('#canvas')]).then(([glRes, canvasRes]) => {
      // @ts-ignore
      this.initCanvas(glRes[0].node, canvasRes[0].node);
    });
  },

  initCanvas(canvas, helperCanvas) {
    const platform = new WechatPlatform(canvas);
    platform.init(PIXI, helperCanvas);
    this.platform = platform;
    // platform.enableDeviceOrientation('game');
    PlatformManager.set(platform);

    console.log(window.innerWidth, window.innerHeight);
    console.log(canvas.width, canvas.height);
    this.canvasW = canvas.width;
    this.canvasH = canvas.height;
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
    wx.showLoading({ mask: false, title: '加载中' });
    if (this.switchingItem || !DEMO[item]) return;

    this.currDemo?.destroy();
    this.switchingItem = true;
    this.currDemo = null as unknown as Application;
    this.canvas.width = this.canvasW;
    this.canvas.height = this.canvasH;
    const demo = (await DEMO[item](this.canvas)) as Application;
    if (!demo) console.error('no app instance returned');
    this.currDemo = demo;
    this.setData({ currItem: i });
    this.onMenuClick();
    this.switchingItem = false;
    wx.hideLoading();
  },

  onTX(e) {
    this.platform.dispatchTouchEvent(e);
  },

  onUnload() {
    this.currDemo?.destroy();
    PlatformManager.dispose();
  },
});
