import { Demo } from './Demo';
import {
  AmbientLight,
  CylinderBufferGeometry,
  DirectionalLight,
  Fog,
  Group,
  Mesh,
  MeshPhongMaterial,
  PlaneBufferGeometry,
  SpotLight,
  TorusKnotBufferGeometry,
  VSMShadowMap,
} from 'three';

export class DemoVSMShadow extends Demo {
  torusKnot: Mesh<TorusKnotBufferGeometry, MeshPhongMaterial>;
  dirLight: DirectionalLight;
  dirGroup: Group;
  async init(): Promise<void> {
    console.log('小程序VSMShadowMap需要three r131之前版本')
    const { camera, renderer, scene } = this.deps;
    camera.position.set(0, 10, 30);
    scene.fog = new Fog(0xcccccc, 50, 100);

    // Lights

    const spotLight = new SpotLight(0x888888);
    spotLight.name = 'Spot Light';
    spotLight.angle = Math.PI / 5;
    spotLight.penumbra = 0.3;
    spotLight.position.set(8, 10, 5);
    spotLight.castShadow = true;
    spotLight.shadow.camera.near = 8;
    spotLight.shadow.camera.far = 200;
    spotLight.shadow.mapSize.width = 256;
    spotLight.shadow.mapSize.height = 256;
    spotLight.shadow.bias = -0.002;
    spotLight.shadow.radius = 4;

    const dirLight = new DirectionalLight(0xffffff, 1);
    dirLight.name = 'Dir. Light';
    dirLight.position.set(3, 12, 17);
    dirLight.castShadow = true;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 500;
    dirLight.shadow.camera.right = 17;
    dirLight.shadow.camera.left = -17;
    dirLight.shadow.camera.top = 17;
    dirLight.shadow.camera.bottom = -17;
    dirLight.shadow.mapSize.width = 512;
    dirLight.shadow.mapSize.height = 512;
    dirLight.shadow.radius = 4;
    dirLight.shadow.bias = -0.0005;

    const dirGroup = new Group();
    dirGroup.add(dirLight);

    this.addControl();
    this.add(new AmbientLight(0x444444));
    this.add(dirGroup);
    this.add(spotLight);
    this.add(dirLight);
    this.dirLight = dirLight;
    this.dirGroup = dirGroup;

    // Geometry

    let material = new MeshPhongMaterial({
      color: 0x999999,
      shininess: 0,
      specular: 0x222222,
    });

    {
      const geometry = new TorusKnotBufferGeometry(25, 8, 75, 20);
      const torusKnot = new Mesh(geometry, material);
      torusKnot.scale.multiplyScalar(1 / 18);
      torusKnot.position.y = 3;
      torusKnot.castShadow = true;
      torusKnot.receiveShadow = true;
      this.add(torusKnot);
      this.torusKnot = torusKnot;
    }

    {
      const geometry = new CylinderBufferGeometry(0.75, 0.75, 7, 32);
      const pillar1 = new Mesh(geometry, material);
      pillar1.position.set(10, 3.5, 10);
      pillar1.castShadow = true;
      pillar1.receiveShadow = true;

      const pillar2 = pillar1.clone();
      pillar2.position.set(10, 3.5, -10);
      const pillar3 = pillar1.clone();
      pillar3.position.set(-10, 3.5, 10);
      const pillar4 = pillar1.clone();
      pillar4.position.set(-10, 3.5, -10);

      this.add(pillar1);
      this.add(pillar2);
      this.add(pillar3);
      this.add(pillar4);
    }

    {
      const geometry = new PlaneBufferGeometry(200, 200);
      material = new MeshPhongMaterial({
        color: 0x999999,
        shininess: 0,
        specular: 0x111111,
      });

      const ground = new Mesh(geometry, material);
      ground.rotation.x = -Math.PI / 2;
      ground.scale.multiplyScalar(3);
      ground.castShadow = true;
      ground.receiveShadow = true;
      this.add(ground);
    }

    // initMisc
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = VSMShadowMap;
    renderer.setClearColor(0xcccccc, 1);
    this.orbitControl.target.set(0, 2, 0);
  }

  update(): void {
    this.orbitControl?.update();

    const delta = this.deps.clock.getDelta();
    const time = this.deps.clock.getElapsedTime();

    this.torusKnot.rotation.x += 0.25 * delta;
    this.torusKnot.rotation.y += 2 * delta;
    this.torusKnot.rotation.z += 1 * delta;

    this.dirGroup.rotation.y += 0.7 * delta;
    this.dirLight.position.z = 17 + Math.sin(time * 0.001) * 5;
  }

  dispose(): void {
    this.reset();
    this.dirLight = null;
    this.dirGroup = null;
    this.torusKnot = null;
  }
}
