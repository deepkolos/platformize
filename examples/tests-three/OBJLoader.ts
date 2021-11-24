import { baseUrl, Demo } from './Demo';
import { AmbientLight, LinearEncoding, PointLight } from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

export class DemoOBJLoader extends Demo {
  async init(): Promise<void> {
    const { textureLoader, camera, renderer } = this.deps;
    const uvMap = await textureLoader.loadAsync(
      baseUrl + '/textures/UV_Grid_Sm.jpg',
    );
    const objLoader = new OBJLoader();
    const object = await objLoader.loadAsync(
      baseUrl + '/models/obj/male02/male02.obj',
    );

    this.add(new AmbientLight(0xcccccc, 0.4));
    this.addCamera(new PointLight(0xffffff, 0.8));
    this.add(object);
    this.add(camera);

    object.traverse(function (child) {
      // @ts-ignore
      if (child.isMesh) child.material.map = uvMap;
    });

    object.position.y = -95;
    camera.position.z = 200;
    renderer.outputEncoding = LinearEncoding;
    this.addControl();
  }

  update(): void {
    this.orbitControl?.update();
  }

  dispose(): void {
    this.reset();
  }
}
