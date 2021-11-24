// index.ts
import { $requestAnimationFrame as requestAnimationFrame, $window as window, Clock, PerspectiveCamera, PLATFORM, Scene, sRGBEncoding, TextureLoader, WebGL1Renderer, WebGLRenderTarget } from 'three'
import { WechatPlatform } from 'three/src/WechatPlatform'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DemoDeps, Demo, DemoGLTFLoader, DemoThreeSpritePlayer, DemoDeviceOrientationControls, DemoRGBELoader, DemoSVGLoader, DemoOBJLoader, DemoMeshOpt, DemoEXRLoader, DemoHDRPrefilterTexture, DemoMTLLoader, DemoLWOLoader, DemoFBXLoader, DemoBVHLoader, DemoColladaLoader, DemoMeshQuantization, DemoTTFLoader, DemoSTLLoader, DemoPDBLoader, DemoTGALoader, DemoMemoryTest } from 'three-demo/src/index'
import { screenshot } from 'three/tools/screenshot'

const DEMO_MAP = {
  // BasisLoader: DemoBasisLoader,
  MemoryTest: DemoMemoryTest,

  MeshOpt: DemoMeshOpt,
  TGALoader: DemoTGALoader,
  PDBLoader: DemoPDBLoader,
  STLLoader: DemoSTLLoader,
  TTFLoader: DemoTTFLoader,
  BVHLoader: DemoBVHLoader,
  FBXLoader: DemoFBXLoader,
  LWOLoader: DemoLWOLoader,
  MTLLoader: DemoMTLLoader,
  EXRLoader: DemoEXRLoader,
  OBJLoader: DemoOBJLoader,
  SVGLoader: DemoSVGLoader,
  RGBELoader: DemoRGBELoader,
  GLTFLoader: DemoGLTFLoader,
  ColladaLoader: DemoColladaLoader,
  MeshQuantization: DemoMeshQuantization,
  ThreeSpritePlayer: DemoThreeSpritePlayer,
  HDRPrefilterTexture: DemoHDRPrefilterTexture,
  DeviceOrientationControls: DemoDeviceOrientationControls
}

const getNode = (id) => new Promise(r => wx.createSelectorQuery().select(id).fields({ node: true, size: true }).exec(r))

// @ts-ignore
Page({
  disposing: false,
  switchingItem: false,
  deps: {} as DemoDeps,
  currDemo: null as unknown as Demo,
  platform: null as unknown as WechatPlatform,
  helperCanvas: null as unknown as any,

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
      'MemoryTest',
      // 'BasisLoader(TODO)',
      // 'Raycaster(TODO)',
      // 'Geometry(TODO)',
    ]
  },

  onReady() {
    this.onCanvasReady()
  },

  onCanvasReady() {
    console.log('onCanvasReady')
    Promise.all([
      getNode('#gl'),
      getNode('#canvas'),
    ]).then(([glRes, canvasRes]) => {
      // @ts-ignore
      this.initCanvas(glRes[0].node, canvasRes[0].node)
    })
  },

  initCanvas(canvas, helperCanvas) {
    const platform = new WechatPlatform(canvas);
    this.platform = platform;
    platform.enableDeviceOrientation('game');
    PLATFORM.set(platform);

    console.log(window.innerWidth, window.innerHeight)
    console.log(canvas.width, canvas.height)

    const renderer = new WebGL1Renderer({ canvas, antialias: true, alpha: true });
    const camera = new PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
    const scene = new Scene();
    const clock = new Clock();
    const gltfLoader = new GLTFLoader();
    const textureLoader = new TextureLoader();

    this.deps = { renderer, camera, scene, clock, gltfLoader, textureLoader }
    this.helperCanvas = helperCanvas;

    scene.position.z = -3;
    renderer.outputEncoding = sRGBEncoding;
    renderer.setSize(canvas.width, canvas.height);
    renderer.setPixelRatio(window.devicePixelRatio);

    const render = () => {
      if (this.disposing) return
      requestAnimationFrame(render);
      (this.currDemo as Demo)?.update()
      renderer.render(scene, camera);
    }

    render()
    console.log('canvas inited')
  },

  onMenuClick() {
    const showMenu = !this.data.showMenu
    if (showMenu) {
      this.setData({ showMenu, showCanvas: false })
    } else {
      this.setData({ showMenu })
      setTimeout(() => {
        this.setData({ showCanvas: true })
      }, 330)
    }
  },

  async onMenuItemClick(e) {
    const { i, item } = e.currentTarget.dataset;
    wx.showLoading({ mask: false, title: '加载中' })
    if (this.switchingItem || !DEMO_MAP[item]) return

    (this.currDemo as Demo)?.dispose();
    this.switchingItem = true;
    this.currDemo = null as unknown as Demo;

    const demo = new (DEMO_MAP[item])(this.deps) as Demo;
    await demo.init();
    this.currDemo = demo;
    this.setData({ currItem: i })
    this.onMenuClick()
    this.switchingItem = false
    wx.hideLoading()
  },

  onTX(e) {
    this.platform.dispatchTouchEvent(e);
    this.platform.dispatchTouchEvent(e);
  },

  screenshot() {
    const { renderer, scene, camera } = this.deps
    const [data, w, h] = screenshot(renderer, scene, camera, WebGLRenderTarget);
    const ctx = this.helperCanvas.getContext('2d')
    const imgData = this.helperCanvas.createImageData(data, w, h);
    this.helperCanvas.height = imgData.height;
    this.helperCanvas.width = imgData.width;
    ctx.putImageData(imgData, 0, 0);
    const imgDataFromCanvas = ctx.getImageData(0, 0, w, h)
    const hasPixel = imgDataFromCanvas.data.some(i => i !== 0)
    console.log('hasPixel', hasPixel)
    wx.canvasToTempFilePath({
      // @ts-ignore
      canvas: this.helperCanvas,
      success(res) {
        wx.previewImage({
          urls: [res.tempFilePath],
        })
      }
    })
  },

  onUnload() {
    this.disposing = true;
    (this.currDemo as Demo)?.dispose()
    PLATFORM.dispose()
  }
})
