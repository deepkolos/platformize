import { baseUrl, Demo } from './Demo';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { DDSLoader } from 'three/examples/jsm/loaders/DDSLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import {
  AmbientLight,
  Group,
  LinearEncoding,
  LoadingManager,
  PointLight,
} from 'three';

export class DemoMTLLoader extends Demo {
  async init(): Promise<void> {
    const { camera, renderer } = this.deps;
    const loadMgr = new LoadingManager();
    loadMgr.addHandler(/\.dds$/i, new DDSLoader());
    const mtlLoader = new MTLLoader(loadMgr);
    const objLoader = new OBJLoader(loadMgr);

    const materials = (await mtlLoader.loadAsync(
      baseUrl + '/models/obj/male02/male02.mtl',
    )) as MTLLoader.MaterialCreator;
    materials.preload();

    const object = (await objLoader
      .setMaterials(materials)
      .loadAsync(baseUrl + '/models/obj/male02/male02.obj')) as Group;
    object.position.y = -95;

    this.addControl();

    this.add(new AmbientLight(0xcccccc, 0.4));
    this.addCamera(new PointLight(0xffffff, 0.8));
    this.add(object);
    this.add(camera);
    object.position.y = -95;
    camera.position.z = 200;
    renderer.outputEncoding = LinearEncoding;
  }
  update(): void {
    this.orbitControl?.update();
  }
  dispose(): void {
    this.reset();
  }
}
