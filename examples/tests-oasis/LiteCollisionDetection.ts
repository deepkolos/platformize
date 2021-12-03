/**
 * @title Lite Collision Detection
 * @category Physics
 */
import {
  WebGLEngine,
  SphereColliderShape,
  BoxColliderShape,
  Vector3,
  MeshRenderer,
  BlinnPhongMaterial,
  PointLight,
  PrimitiveMesh,
  Camera,
  StaticCollider,
  Script,
  DynamicCollider,
} from 'oasis-engine';
import { OrbitControl } from '@oasis-engine/controls';

import { LitePhysics } from '@oasis-engine/physics-lite';

export function LiteCollisionDetection(canvas: any) {
  const engine = new WebGLEngine(canvas, LitePhysics);
  engine.canvas.resizeByClientSize();
  const scene = engine.sceneManager.activeScene;
  const rootEntity = scene.createRootEntity('root');

  scene.ambientLight.diffuseSolidColor.setValue(1, 1, 1, 1);
  scene.ambientLight.diffuseIntensity = 1.2;

  // init camera
  const cameraEntity = rootEntity.createChild('camera');
  cameraEntity.addComponent(Camera);
  cameraEntity.transform.setPosition(10, 10, 10);
  cameraEntity.addComponent(OrbitControl);

  // init point light
  const light = rootEntity.createChild('light');
  light.transform.setPosition(0, 3, 0);
  const pointLight = light.addComponent(PointLight);
  pointLight.intensity = 0.3;

  // create box test entity
  const cubeSize = 2.0;
  const boxEntity = rootEntity.createChild('BoxEntity');

  const boxMtl = new BlinnPhongMaterial(engine);
  const boxRenderer = boxEntity.addComponent(MeshRenderer);
  boxMtl.baseColor.setValue(0.6, 0.3, 0.3, 1.0);
  boxRenderer.mesh = PrimitiveMesh.createCuboid(engine, cubeSize, cubeSize, cubeSize);
  boxRenderer.setMaterial(boxMtl);

  const boxCollider = boxEntity.addComponent(StaticCollider);
  const boxColliderShape = new BoxColliderShape();
  boxColliderShape.setSize(cubeSize, cubeSize, cubeSize);
  boxCollider.addShape(boxColliderShape);

  // create sphere test entity
  const radius = 1.25;
  const sphereEntity = rootEntity.createChild('SphereEntity');
  sphereEntity.transform.setPosition(-5, 0, 0);

  const sphereMtl = new BlinnPhongMaterial(engine);
  const sphereRenderer = sphereEntity.addComponent(MeshRenderer);
  sphereMtl.baseColor.setValue(Math.random(), Math.random(), Math.random(), 1.0);
  sphereRenderer.mesh = PrimitiveMesh.createSphere(engine, radius);
  sphereRenderer.setMaterial(sphereMtl);

  const sphereCollider = sphereEntity.addComponent(DynamicCollider);
  const sphereColliderShape = new SphereColliderShape();
  sphereColliderShape.radius = radius;
  sphereCollider.addShape(sphereColliderShape);

  class MoveScript extends Script {
    pos: Vector3 = new Vector3(-5, 0, 0);
    vel: number = 0.005;
    velSign: number = -1;

    onUpdate(deltaTime: number) {
      super.onUpdate(deltaTime);
      if (this.pos.x >= 5) {
        this.velSign = -1;
      }
      if (this.pos.x <= -5) {
        this.velSign = 1;
      }
      this.pos.x += deltaTime * this.vel * this.velSign;

      this.entity.transform.position = this.pos;
    }
  }

  // Collision Detection
  class CollisionScript extends Script {
    onTriggerExit() {
      (<BlinnPhongMaterial>sphereRenderer.getMaterial()).baseColor.setValue(
        Math.random(),
        Math.random(),
        Math.random(),
        1.0,
      );
    }

    onTriggerStay() {
      console.log('lalala');
    }

    onTriggerEnter() {
      (<BlinnPhongMaterial>sphereRenderer.getMaterial()).baseColor.setValue(
        Math.random(),
        Math.random(),
        Math.random(),
        1.0,
      );
    }
  }

  sphereEntity.addComponent(CollisionScript);
  sphereEntity.addComponent(MoveScript);

  // Run engine
  engine.run();
  return engine;
}
