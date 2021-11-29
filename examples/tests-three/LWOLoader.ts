import { baseUrl, Demo } from './Demo';
import {
  LWOLoader,
  LWO,
} from 'three/examples/jsm/loaders/LWOLoader';
import {
  AmbientLight,
  Color,
  DirectionalLight,
  GridHelper,
  Object3D,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class DemoLWOLoader extends Demo {
  objects!: Object3D[];
  controls!: OrbitControls;

  async init(): Promise<void> {
    const { scene, renderer, camera } = this.deps;
    camera.position.set(-0.7, 14.6, 43.2);
    scene.background = new Color(0xa0a0a0);

    const ambientLight = new AmbientLight(0xaaaaaa, 1.75);
    this.add(ambientLight);

    const light1 = new DirectionalLight(0xffffff, 1);
    light1.position.set(0, 200, 100);
    light1.castShadow = true;
    light1.shadow.camera.top = 180;
    light1.shadow.camera.bottom = -100;
    light1.shadow.camera.left = -120;
    light1.shadow.camera.right = 120;
    this.add(light1);

    const light2 = new DirectionalLight(0xffffff, 0.7);
    light2.position.set(-100, 200, -100);
    this.add(light2);

    const light3 = new DirectionalLight(0xffffff, 0.4);
    light3.position.set(100, -200, 100);
    this.add(light3);

    const light4 = new DirectionalLight(0xffffff, 1);
    light4.position.set(-100, -100, 100);
    this.add(light4);

    const grid = new GridHelper(200, 20, 0x000000, 0x000000);
    // @ts-ignore
    grid.material.opacity = 0.3;
    // @ts-ignore
    grid.material.transparent = true;
    this.add(grid);

    const loader = new LWOLoader();
    const object = (await loader.loadAsync(
      baseUrl + '/models/lwo/Objects/LWO3/Demo.lwo',
    )) as LWO;

    const phong = object.meshes[0];
    phong.position.set(-2, 12, 0);

    const standard = object.meshes[1];
    standard.position.set(2, 12, 0);

    const rocket = object.meshes[2];
    rocket.position.set(0, 10.5, -1);

    this.add(phong);
    this.add(rocket);
    this.add(standard);

    renderer.shadowMap.enabled = true;
    renderer.physicallyCorrectLights = true;
    renderer.gammaFactor = 1.18;

    this.addControl();
    this.orbitControl.target.set(1.33, 10, -6.7);
  }
  update(): void {
    this.orbitControl?.update();
  }
  dispose(): void {
    this.reset();
  }
}
