'use strict';

var three = require('../../chunks/three.js');
var GLTFLoader = require('../../chunks/GLTFLoader.js');
var testsThree = require('../../chunks/tests-three.js');

Page({
  disposing: false,
  platform: null ,
  frameId: -1,

  onReady() {
    console.log('ready');
    tt.createSelectorQuery()
      .select('#gl')
      .node()
      .exec(async res => {
        const canvas = res[0].node;
        console.log('init scene');

        this.platform = new GLTFLoader.dist.BytePlatform(canvas);
        GLTFLoader.dist.PlatformManager.set(this.platform);

        const renderer = new three.WebGL1Renderer({ canvas, antialias: true, alpha: true });
        const camera = new three.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
        const scene = new three.Scene();
        const gltfLoader = new GLTFLoader.GLTFLoader();
        const textureLoader = new three.TextureLoader();
        const controls = new testsThree.OrbitControls(camera, canvas);
        controls.enableDamping = true;
        console.log(canvas.width, canvas.height, three._default.polyfill.window.devicePixelRatio);

        {
          const geometry = new three.PlaneGeometry(1, 1);
          const material = new three.MeshBasicMaterial({ color: 0x123456 });
          const mesh = new three.Mesh(geometry, material);
          scene.add(mesh);
        }

        {
          const geometry = new three.PlaneGeometry(1, 1);
          const material = new three.MeshBasicMaterial({
            map: textureLoader.load(
              'https://cdn.static.oppenlab.com/weblf/test/open%20mouth.jpg',
              tex => {
                tex.encoding = three.LinearEncoding;
                console.log('texture loaded');
              },
              undefined,
              e => console.log('texture load error', e),
            ),
          });
          const mesh = new three.Mesh(geometry, material);
          mesh.position.y = 1;
          scene.add(mesh);
        }

        gltfLoader
          .loadAsync(
            'https://dtmall-tel.alicdn.com/edgeComputingConfig/upload_models/1591673169101/RobotExpressive.glb',
          )
          .then((gltf) => {
            // @ts-ignore
            gltf.parser = null;
            gltf.scene.position.y = -2;
            gltf.scene.scale.set(0.3, 0.3, 0.3);
            scene.add(gltf.scene);
          });

        scene.background = new three.Color(0x654321);

        camera.position.z = 5;
        renderer.outputEncoding = three.sRGBEncoding;
        scene.add(new three.AmbientLight(0xffffff, 1.0));
        scene.add(new three.DirectionalLight(0xffffff, 1.0));

        // 设置dpr后图像不居中
        // renderer.setPixelRatio($window.devicePixelRatio)
        renderer.setSize(canvas.width, canvas.height, false);

        const render = () => {
          if (!this.disposing) this.frameId = three._default.polyfill.requestAnimationFrame(render);
          controls.update();
          renderer.render(scene, camera);
        };
        render();
      });
  },

  onUnload() {
    this.disposing = true;
    three._default.polyfill.cancelAnimationFrame(this.frameId);
    GLTFLoader.dist.PlatformManager.dispose();
  },

  onTX(e) {
    this.platform.dispatchTouchEvent(e);
  },
});
