'use strict';

var three = require('../../chunks/three.js');
var DeviceOrientationControls = require('../../chunks/DeviceOrientationControls.js');

function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// index.ts
// import { screenshot } from 'three/tools/screenshot'

console.log('THREE Version', three.REVISION);

const DEMO_MAP = {
  // BasisLoader: DemoBasisLoader,
  MemoryTest: DeviceOrientationControls.DemoMemoryTest,
  VSMShadow: DeviceOrientationControls.DemoVSMShadow,
  VTKLoader: DeviceOrientationControls.DemoVTKLoader,
  MeshOpt: DeviceOrientationControls.DemoMeshOpt,
  TGALoader: DeviceOrientationControls.DemoTGALoader,
  PDBLoader: DeviceOrientationControls.DemoPDBLoader,
  STLLoader: DeviceOrientationControls.DemoSTLLoader,
  // TTFLoader: DemoTTFLoader,
  BVHLoader: DeviceOrientationControls.DemoBVHLoader,
  FBXLoader: DeviceOrientationControls.DemoFBXLoader,
  LWOLoader: DeviceOrientationControls.DemoLWOLoader,
  MTLLoader: DeviceOrientationControls.DemoMTLLoader,
  EXRLoader: DeviceOrientationControls.DemoEXRLoader,
  OBJLoader: DeviceOrientationControls.DemoOBJLoader,
  SVGLoader: DeviceOrientationControls.DemoSVGLoader,
  RGBELoader: DeviceOrientationControls.DemoRGBELoader,
  GLTFLoader: DeviceOrientationControls.DemoGLTFLoader,
  ColladaLoader: DeviceOrientationControls.DemoColladaLoader,
  MeshQuantization: DeviceOrientationControls.DemoMeshQuantization,
  ThreeSpritePlayer: DeviceOrientationControls.DemoThreeSpritePlayer,
  HDRPrefilterTexture: DeviceOrientationControls.DemoHDRPrefilterTexture,
  DeviceOrientationControls: DeviceOrientationControls.DemoDeviceOrientationControls,
};

const getNode = id =>
  new Promise(r => wx.createSelectorQuery().select(id).fields({ node: true, size: true }).exec(r));

// @ts-ignore
Page({
  disposing: false,
  switchingItem: false,
  deps: {} ,
  currDemo: null ,
  platform: null ,
  helperCanvas: null ,

  data: {
    showMenu: true,
    showCanvas: false,
    currItem: -1,
    menuList: [
      'GLTFLoader',
      'ThreeSpritePlayer',
      'DeviceOrientationControls',
      'RGBELoader',
      'SVGLoader',
      'OBJLoader',
      'MeshOpt',
      'EXRLoader',
      'HDRPrefilterTexture',
      'MTLLoader',
      'LWOLoader',
      'FBXLoader',
      'BVHLoader',
      'ColladaLoader',
      'MeshQuantization',
      'TTFLoader',
      'STLLoader',
      'PDBLoader',
      'TGALoader',
      'VTKLoader',
      'VSMShadow',
      'MemoryTest',
      // 'BasisLoader(TODO)',
      // 'Raycaster(TODO)',
      // 'Geometry(TODO)',
    ],
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
    const platform = new DeviceOrientationControls.wechat.WechatPlatform(canvas);
    this.platform = platform;
    platform.enableDeviceOrientation('game');
    three._default.set(platform);

    console.log(three._default.polyfill.window.innerWidth, three._default.polyfill.window.innerHeight);
    console.log(canvas.width, canvas.height);

    const renderer = new three.WebGL1Renderer({ canvas, antialias: true, alpha: false });
    const camera = new three.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
    const scene = new three.Scene();
    const clock = new three.Clock();
    const gltfLoader = new DeviceOrientationControls.GLTFLoader();
    const textureLoader = new three.TextureLoader();

    this.deps = { renderer, camera, scene, clock, gltfLoader, textureLoader };
    this.helperCanvas = helperCanvas;

    scene.position.z = -3;
    scene.background = new three.Color(0xffffff);
    renderer.outputEncoding = three.sRGBEncoding;
    renderer.setPixelRatio(2);
    // renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(canvas.width, canvas.height);

    const render = () => {
      if (this.disposing) return;
      three._default.polyfill.requestAnimationFrame(render);
      _optionalChain([(this.currDemo ), 'optionalAccess', _ => _.update, 'call', _2 => _2()]);
      renderer.render(scene, camera);
    };

    render();
    console.log('canvas inited');
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
    if (this.switchingItem || !DEMO_MAP[item]) return;

    _optionalChain([(this.currDemo ), 'optionalAccess', _3 => _3.dispose, 'call', _4 => _4()]);
    this.switchingItem = true;
    this.currDemo = null ;

    const demo = new DEMO_MAP[item](this.deps) ;
    await demo.init();
    this.currDemo = demo;
    this.setData({ currItem: i });
    this.onMenuClick();
    this.switchingItem = false;
    wx.hideLoading();
  },

  onTX(e) {
    this.platform.dispatchTouchEvent(e);
  },

  screenshot() {
    return;
    // const { renderer, scene, camera } = this.deps
    // const [data, w, h] = screenshot(renderer, scene, camera, WebGLRenderTarget);
    // const ctx = this.helperCanvas.getContext('2d')
    // const imgData = this.helperCanvas.createImageData(data, w, h);
    // this.helperCanvas.height = imgData.height;
    // this.helperCanvas.width = imgData.width;
    // ctx.putImageData(imgData, 0, 0);
    // const imgDataFromCanvas = ctx.getImageData(0, 0, w, h)
    // const hasPixel = imgDataFromCanvas.data.some(i => i !== 0)
    // console.log('hasPixel', hasPixel)
    // wx.canvasToTempFilePath({
    //   // @ts-ignore
    //   canvas: this.helperCanvas,
    //   success(res) {
    //     wx.previewImage({
    //       urls: [res.tempFilePath],
    //     })
    //   }
    // })
  },

  async screenrecord() {
    console.log('screenrecord clicked');
    const fps = 20;
    const canvas = this.deps.renderer.domElement;
    const recorder = wx.createMediaRecorder(canvas, {
      fps,
      videoBitsPerSecond: 600,
      duration: 5,
    });

    await new Promise(resolve => {
      recorder.on('start', resolve);
      recorder.start();
    });
    console.log('start');

    let frames = fps * 5;
    while (frames--) {
      await new Promise(resolve => recorder.requestFrame(resolve));
      await new Promise(resolve => setTimeout(resolve, 1000 / fps));
      console.log(frames);
      // render()
    }

    const { tempFilePath } = await new Promise(resolve => {
      recorder.on('stop', resolve);
      recorder.stop();
    });
    console.log(tempFilePath);

    recorder.destroy();

    wx.previewMedia({
      sources: [
        {
          url: tempFilePath,
          type: 'video',
        },
      ],
    });
  },

  onUnload() {
    this.disposing = true;
    _optionalChain([(this.currDemo ), 'optionalAccess', _5 => _5.dispose, 'call', _6 => _6()]);
    three._default.dispose();
  },

  onShareAppMessage() {},
});
