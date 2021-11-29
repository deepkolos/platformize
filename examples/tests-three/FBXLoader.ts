import {
  AnimationMixer,
  Color,
  DirectionalLight,
  Fog,
  GridHelper,
  HemisphereLight,
  Mesh,
  MeshPhongMaterial,
  PlaneBufferGeometry,
} from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { baseUrl, Demo } from './Demo';

export class DemoFBXLoader extends Demo {
  mixer?: AnimationMixer | null;
  async init(): Promise<void> {
    const { camera, scene } = this.deps;
    camera.position.set(100, 200, 300);
    scene.background = new Color(0xa0a0a0);
    scene.fog = new Fog(0xa0a0a0, 200, 1000);

    const hemiLight = new HemisphereLight(0xffffff, 0x444444);
    hemiLight.position.set(0, 200, 0);
    this.add(hemiLight);

    const dirLight = new DirectionalLight(0xffffff);
    dirLight.position.set(0, 200, 100);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 180;
    dirLight.shadow.camera.bottom = -100;
    dirLight.shadow.camera.left = -120;
    dirLight.shadow.camera.right = 120;
    this.add(dirLight);

    // ground
    const mesh = new Mesh(
      new PlaneBufferGeometry(2000, 2000),
      new MeshPhongMaterial({ color: 0x999999, depthWrite: false }),
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    this.add(mesh);

    const grid = new GridHelper(2000, 20, 0x000000, 0x000000);
    // @ts-ignore
    grid.material.opacity = 0.2;
    // @ts-ignore
    grid.material.transparent = true;
    this.add(grid);

    const loader = new FBXLoader();
    const object = await loader.loadAsync(
      baseUrl + '/models/fbx/Samba Dancing.fbx',
    );
    const mixer = new AnimationMixer(object);

    const action = mixer.clipAction(object.animations[0]);
    action.play();

    object.traverse(function (child) {
      // @ts-ignore
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    this.add(object);

    this.addControl();
    this.orbitControl.target.set(0, 100, 0);
    this.orbitControl.update();

    this.mixer = mixer;
  }
  update(): void {
    this.mixer?.update(this.deps.clock.getDelta());
    this.orbitControl?.update();
  }
  dispose(): void {
    this.reset();
    this.mixer?.stopAllAction();
    this.mixer = null;
  }
}
