/**
 * @title Blend Mode
 * @category Material
 */
import { OrbitControl } from '@oasis-engine-toolkit/controls';
import { Camera, GLTFResource, Vector3, WebGLEngine } from 'oasis-engine';

export function BlendMode(canvas: any) {
  // Create engine object
  const engine = new WebGLEngine(canvas);
  engine.canvas.resizeByClientSize();

  const scene = engine.sceneManager.activeScene;
  const rootEntity = scene.createRootEntity();

  // Create camera
  const cameraEntity = rootEntity.createChild('Camera');
  cameraEntity.transform.position = new Vector3(0, 3, 10);
  cameraEntity.addComponent(Camera);
  cameraEntity.addComponent(OrbitControl);

  scene.ambientLight.diffuseSolidColor.set(1, 1, 1, 1);

  engine.resourceManager
    .load<GLTFResource>(
      'https://gw.alipayobjects.com/os/bmw-prod/d099b30b-59a3-42e4-99eb-b158afa8e65d.glb',
    )
    .then(asset => {
      const { defaultSceneRoot, materials } = asset;
      rootEntity.addChild(defaultSceneRoot);
    });

  engine.run();
  return engine;
}
