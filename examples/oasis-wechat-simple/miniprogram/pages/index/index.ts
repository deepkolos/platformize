import { PlatformManager, WechatPlatform } from 'platformize-oasis';
import { OrbitControl } from '@oasis-engine-toolkit/controls';
import { Camera, Engine, GLTFResource, WebGLEngine } from 'oasis-engine';

Page({
  disposing: false,
  platform: null as unknown as WechatPlatform,
  engine: null as unknown as Engine,

  onReady() {
    wx.createSelectorQuery()
      .select('#gl')
      .node()
      .exec(res => {
        const canvas = res[0].node;

        this.platform = new WechatPlatform(canvas);
        console.log(this.platform);
        PlatformManager.set(this.platform);

        const engine = new WebGLEngine(canvas);
        engine.canvas.resizeByClientSize();

        const rootEntity = engine.sceneManager.activeScene.createRootEntity();

        const cameraEntity = rootEntity.createChild('camera');
        cameraEntity.addComponent(Camera);
        cameraEntity.transform.setPosition(3, 3, 3);
        cameraEntity.addComponent(OrbitControl);

        engine.sceneManager.activeScene.ambientLight.diffuseSolidColor.set(1, 1, 1, 1);

        engine.resourceManager
          .load<GLTFResource>(
            'https://gw.alipayobjects.com/os/OasisHub/267000040/9994/%25E5%25BD%2592%25E6%25A1%25A3.gltf',
          )
          .then(gltf => {
            rootEntity.addChild(gltf.defaultSceneRoot);
          });

        engine.run();
        this.engine = engine;
      });
  },

  onUnload() {
    this.disposing = true;
    PlatformManager.dispose();
    this.engine?.destroy();
  },

  onTX(e: any) {
    this.platform.dispatchTouchEvent(e);
  },
});
