import { baseUrl, Demo } from './Demo';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader';
import { AmbientLight, DirectionalLight } from 'three';

export class DemoColladaLoader extends Demo {
  async init(): Promise<void> {
    const { camera } = this.deps;

    camera.position.set(8, 10, 8);
    camera.lookAt(0, 3, 0);

    const loader = new ColladaLoader();
    const collada = await loader.loadAsync(
      baseUrl + '/models/collada/elf/elf.dae',
    );
    this.add(collada.scene);
    const ambientLight = new AmbientLight(0xcccccc, 0.4);
    this.add(ambientLight);

    const directionalLight = new DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 0).normalize();
    this.add(directionalLight);

    this.addControl();
  }
  update(): void {
    this.orbitControl?.update();
  }
  dispose(): void {
    this.reset();
  }
}
