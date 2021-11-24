import { baseUrl, Demo } from './Demo';
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader';
import {
  AmbientLight,
  BoxGeometry,
  DirectionalLight,
  LinearEncoding,
  Mesh,
  MeshPhongMaterial,
} from 'three';

export class DemoTGALoader extends Demo {
  async init(): Promise<void> {
    const { camera, renderer } = this.deps;
    const loader = new TGALoader();

    const [crateGery, crateColor] = await Promise.all([
      loader.loadAsync(baseUrl + '/textures/crate_grey8.tga'),
      loader.loadAsync(baseUrl + '/textures/crate_color8.tga'),
    ]);

    camera.position.set(0, 50, 250);

    const geometry = new BoxGeometry(50, 50, 50);
    const material1 = new MeshPhongMaterial({ color: 0xffffff, map: crateGery });
    const mesh1 = new Mesh(geometry, material1);
    mesh1.position.x = -50;

    const material2 = new MeshPhongMaterial({ color: 0xffffff, map: crateColor });
    const mesh2 = new Mesh(geometry, material2);
    mesh2.position.x = 50;

    const dirLight = new DirectionalLight(0xffffff, 1);
    dirLight.position.set(1, 1, 1);

    this.add(mesh1);
    this.add(mesh2);
    this.add(dirLight);
    this.add(new AmbientLight(0xffffff, 0.4));
    this.addControl();

    renderer.outputEncoding = LinearEncoding;
  }
  update(): void {
    this.orbitControl?.update();
  }
  dispose(): void {
    this.reset();
  }
}
