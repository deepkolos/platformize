import {
  Clock,
  PerspectiveCamera,
  Scene,
  sRGBEncoding,
  TextureLoader,
  WebGL1Renderer,
  Color,
} from 'three';
import { TaobaoPlatform, PlatformManager } from 'platformize-three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {
  Demo,
  DemoGLTFLoader,
  DemoThreeSpritePlayer,
  DemoDeviceOrientationControls,
  DemoRGBELoader,
  DemoSVGLoader,
  DemoOBJLoader,
  DemoMeshOpt,
  DemoEXRLoader,
  DemoHDRPrefilterTexture,
  DemoMTLLoader,
  DemoLWOLoader,
  DemoFBXLoader,
  DemoBVHLoader,
  DemoColladaLoader,
  DemoMeshQuantization,
  DemoTTFLoader,
  DemoSTLLoader,
  DemoPDBLoader,
  DemoDeps,
} from 'tests-three';

const DEMO_MAP = {
  // BasisLoader: DemoBasisLoader,
  MeshOpt: DemoMeshOpt,
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
  DeviceOrientationControls: DemoDeviceOrientationControls,
};

Page({
  data: {
    showMenu: true,
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
    ],
  },

  disposing: false,
  switchingItem: false,
  currDemo: null as unknown as Demo,
  platform: null as unknown as TaobaoPlatform,
  deps: null as unknown as DemoDeps,

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
    if (this.switchingItem) return;
    this.switchingItem = true;

    const { i, item } = e.currentTarget.dataset;

    try {
      my.showLoading();
      const demo = new DEMO_MAP[item](this.deps) as Demo;
      await demo.init();

      (this.currDemo as Demo)?.dispose();
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
      this.platform = new TaobaoPlatform(canvas);
      PlatformManager.set(this.platform);

      console.log(window.innerWidth, window.innerHeight);
      console.log(canvas.width, canvas.height);

      const canW = Math.round(canvasRect.width * 1.01); // 确保填满屏幕
      const canH = Math.round(canvasRect.height * 1.01);
      const renderer = new WebGL1Renderer({ canvas, antialias: false, alpha: true });
      const camera = new PerspectiveCamera(75, canW / canH, 0.1, 1000);
      const scene = new Scene();
      const clock = new Clock();
      const gltfLoader = new GLTFLoader();
      const textureLoader = new TextureLoader();

      this.deps = { renderer, camera, scene, clock, gltfLoader, textureLoader };

      scene.position.z = -3;
      renderer.outputEncoding = sRGBEncoding;
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(canW, canH);

      scene.background = new Color(0xffffff);
      // const geo = new PlaneBufferGeometry()
      // const mat = new MeshBasicMaterial({ color: 0x123456 })
      // scene.add(new Mesh(geo, mat))

      const render = () => {
        if (this.disposing) return;
        canvas.requestAnimationFrame(render);
        (this.currDemo as Demo)?.update();
        renderer.render(scene, camera);
      };

      render();
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
    this.currDemo?.dispose();
    PlatformManager.dispose();
  },
});
