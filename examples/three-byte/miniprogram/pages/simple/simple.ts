import {
  AmbientLight,
  Color,
  DirectionalLight,
  LinearEncoding,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneBufferGeometry,
  Scene,
  sRGBEncoding,
  TextureLoader,
  WebGL1Renderer,
} from 'three';
import { BytePlatform, PlatformManager } from 'platformize-three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

Page({
  disposing: false,
  platform: null as unknown as BytePlatform,
  frameId: -1,

  onReady() {
    console.log('ready');
    tt.createSelectorQuery()
      .select('#gl')
      .node()
      .exec(async res => {
        const canvas = res[0].node;
        console.log('init scene');

        this.platform = new BytePlatform(canvas);
        PlatformManager.set(this.platform);

        const renderer = new WebGL1Renderer({ canvas, antialias: true, alpha: true });
        const camera = new PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
        const scene = new Scene();
        const gltfLoader = new GLTFLoader();
        const textureLoader = new TextureLoader();
        const controls = new OrbitControls(camera, canvas);
        controls.enableDamping = true;
        console.log(canvas.width, canvas.height, window.devicePixelRatio);

        {
          const geometry = new PlaneBufferGeometry(1, 1);
          const material = new MeshBasicMaterial({ color: 0x123456 });
          const mesh = new Mesh(geometry, material);
          scene.add(mesh);
        }

        {
          const geometry = new PlaneBufferGeometry(1, 1);
          const material = new MeshBasicMaterial({
            map: textureLoader.load(
              'https://cdn.static.oppenlab.com/weblf/test/open%20mouth.jpg',
              tex => {
                tex.encoding = LinearEncoding;
                console.log('texture loaded');
              },
              undefined,
              e => console.log('texture load error', e),
            ),
          });
          const mesh = new Mesh(geometry, material);
          mesh.position.y = 1;
          scene.add(mesh);
        }

        gltfLoader
          .loadAsync(
            'https://dtmall-tel.alicdn.com/edgeComputingConfig/upload_models/1591673169101/RobotExpressive.glb',
          )
          .then((gltf: GLTF) => {
            // @ts-ignore
            gltf.parser = null;
            gltf.scene.position.y = -2;
            gltf.scene.scale.set(0.3, 0.3, 0.3);
            scene.add(gltf.scene);
          });

        scene.background = new Color(0x654321);

        camera.position.z = 5;
        renderer.outputEncoding = sRGBEncoding;
        scene.add(new AmbientLight(0xffffff, 1.0));
        scene.add(new DirectionalLight(0xffffff, 1.0));

        // 设置dpr后图像不居中
        // renderer.setPixelRatio($window.devicePixelRatio)
        renderer.setSize(canvas.width, canvas.height, false);

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
