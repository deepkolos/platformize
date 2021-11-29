// index.ts
import {
  Clock,
  PerspectiveCamera,
  Scene,
  sRGBEncoding,
  TextureLoader,
  WebGL1Renderer,
  REVISION,
  Color,
} from 'three';
import { BytePlatform, PlatformManager } from 'platformize-three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {
  DemoDeps,
  Demo,
  DemoGLTFLoader,
  DemoThreeSpritePlayer,
  DemoDeviceOrientationControls,
  DemoRGBELoader,
  DemoSVGLoader,
  DemoOBJLoader,
  DemoEXRLoader,
  DemoHDRPrefilterTexture,
  DemoMTLLoader,
  DemoLWOLoader,
  DemoFBXLoader,
  DemoBVHLoader,
  DemoColladaLoader,
  DemoTTFLoader,
  DemoSTLLoader,
  DemoPDBLoader,
  DemoTGALoader,
} from 'tests-three';

console.log('THREE Version', REVISION);

const DEMO_MAP = {
  // BasisLoader: DemoBasisLoader,
  // MemoryTest: DemoMemoryTest,

  // MeshOpt: DemoMeshOpt,
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
  // MeshQuantization: DemoMeshQuantization,
  ThreeSpritePlayer: DemoThreeSpritePlayer,
  HDRPrefilterTexture: DemoHDRPrefilterTexture,
  DeviceOrientationControls: DemoDeviceOrientationControls,
};

const getNode = id => new Promise(r => tt.createSelectorQuery().select(id).node().exec(r));

// @ts-ignore
Page({
  disposing: false,
  switchingItem: false,
  deps: {} as DemoDeps,
  currDemo: null as unknown as Demo,
  platform: null as unknown as BytePlatform,
  helperCanvas: null as unknown as any,

  data: {
    showMenu: true,
    showCanvas: false,
    currItem: -1,
    menuList: [
      'GLTFLoader',
      'ThreeSpritePlayer',
      // 'DeviceOrientationControls',
      'RGBELoader',
      'SVGLoader',
      'OBJLoader',
      // 'MeshOpt',
      'EXRLoader',
      'HDRPrefilterTexture',
      'MTLLoader',
      'LWOLoader',
      'FBXLoader',
      'BVHLoader',
      'ColladaLoader',
      // 'MeshQuantization',
      'TTFLoader',
      'STLLoader',
      'PDBLoader',
      'TGALoader',
      // 'MemoryTest',
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
    const platform = new BytePlatform(canvas);
    this.platform = platform;
    // platform.enableDeviceOrientation('game');
    PlatformManager.set(platform);

    console.log(window.innerWidth, window.innerHeight);
    console.log(canvas.width, canvas.height);

    const renderer = new WebGL1Renderer({
      canvas,
      antialias: true,
      alpha: false,
    });
    const camera = new PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
    const scene = new Scene();
    const clock = new Clock();
    const gltfLoader = new GLTFLoader();
    const textureLoader = new TextureLoader();

    this.deps = { renderer, camera, scene, clock, gltfLoader, textureLoader };
    this.helperCanvas = helperCanvas;

    scene.position.z = -3;
    scene.background = new Color(0xffffff);
    renderer.outputEncoding = sRGBEncoding;
    // renderer.setPixelRatio(2);
    // renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(canvas.width, canvas.height);

    const render = () => {
      if (this.disposing) return;
      requestAnimationFrame(render);
      (this.currDemo as Demo)?.update();
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
    tt.showLoading({ mask: false, title: '加载中' });
    if (this.switchingItem || !DEMO_MAP[item]) return;

    (this.currDemo as Demo)?.dispose();
    this.switchingItem = true;
    this.currDemo = null as unknown as Demo;

    const demo = new DEMO_MAP[item](this.deps) as Demo;
    await demo.init();
    this.currDemo = demo;
    this.setData({ currItem: i });
    this.onMenuClick();
    this.switchingItem = false;
    tt.hideLoading();
  },

  onTX(e) {
    console.log(e);
    this.platform.dispatchTouchEvent(e);
  },

  onUnload() {
    this.disposing = true;
    (this.currDemo as Demo)?.dispose();
    PlatformManager.dispose();
  },
});
