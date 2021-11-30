import {
  AmbientLight,
  DirectionalLight,
  PerspectiveCamera,
  Scene,
  sRGBEncoding,
  WebGL1Renderer,
} from 'three';
import { WechatPlatform, PlatformManager } from 'platformize-three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

Page({
  disposing: false,
  platform: null as unknown as WechatPlatform,
  frameId: -1,

  onReady() {
    wx.createSelectorQuery()
      .select('#gl')
      .node()
      .exec(res => {
        const canvas = res[0].node;

        this.platform = new WechatPlatform(canvas);
        console.log(this.platform);
        PlatformManager.set(this.platform);

        const renderer = new WebGL1Renderer({ canvas, antialias: true, alpha: true });
        const camera = new PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
        const scene = new Scene();
        const gltfLoader = new GLTFLoader();
        const controls = new OrbitControls(camera, canvas);
        controls.enableDamping = true;

        gltfLoader
          .loadAsync(
            'https://dtmall-tel.alicdn.com/edgeComputingConfig/upload_models/1591673169101/RobotExpressive.glb',
          )
          .then((gltf: GLTF) => {
            // @ts-ignore
            gltf.parser = null;
            gltf.scene.position.y = -2;
            scene.add(gltf.scene);
          });

        camera.position.z = 10;
        renderer.outputEncoding = sRGBEncoding;
        scene.add(new AmbientLight(0xffffff, 1.0));
        scene.add(new DirectionalLight(0xffffff, 1.0));
        renderer.setSize(canvas.width, canvas.height);
        renderer.setPixelRatio(window.devicePixelRatio);

        const render = () => {
          if (!this.disposing) this.frameId = requestAnimationFrame(render);
          controls.update();
          renderer.render(scene, camera);
        };
        render();
      });
  },

  onUnload() {
    this.disposing = true;
    cancelAnimationFrame(this.frameId);
    PlatformManager.dispose();
  },

  onTX(e: any) {
    this.platform.dispatchTouchEvent(e);
  },
});
