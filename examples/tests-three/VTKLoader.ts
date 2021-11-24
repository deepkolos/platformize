import { baseUrl, Demo } from './Demo';
import { VTKLoader } from 'three/examples/jsm/loaders/VTKLoader';
import {
  AmbientLight,
  DirectionalLight,
  DoubleSide,
  Mesh,
  MeshLambertMaterial,
} from 'three';

export class DemoVTKLoader extends Demo {
  async init(): Promise<void> {
    //创建兰伯特材质
    const material = new MeshLambertMaterial({
      color: 0x123456,
      side: DoubleSide,
    });

    const vtkLoader = new VTKLoader();
    const geometry = await vtkLoader.loadAsync(
      baseUrl + 'models/vtk/bunny.vtk',
    );
    geometry.center();
    geometry.computeVertexNormals();
    const mesh = new Mesh(geometry, material);
    console.log(geometry);

    this.add(new DirectionalLight(0xffffff, 1));
    this.add(new AmbientLight(0xffffff, 1));
    this.add(mesh);
    this.deps.camera.position.z = 0.5;
    this.deps.scene.position.z = 0;

    this.addControl();
  }

  update(): void {
    this.orbitControl?.update();
  }

  dispose(): void {
    this.reset();
  }
}
