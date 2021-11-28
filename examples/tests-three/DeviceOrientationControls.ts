import { Demo } from './Demo';
import { DeviceOrientationControls } from 'three/examples/jsm/controls/DeviceOrientationControls';
import { SphereBufferGeometry, MeshBasicMaterial, Mesh, BoxBufferGeometry } from 'three';

export class DemoDeviceOrientationControls extends Demo {
  control!: DeviceOrientationControls;

  async init(): Promise<void> {
    const { camera, textureLoader } = this.deps;
    this.control = new DeviceOrientationControls(camera);

    const geometry = new SphereBufferGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);
    const material = new MeshBasicMaterial({
      map: await textureLoader.loadAsync('https://s3.ax1x.com/2021/02/26/yx0quq.jpg'),
    });

    const helperGeometry = new BoxBufferGeometry(100, 100, 100, 4, 4, 4);
    const helperMaterial = new MeshBasicMaterial({
      color: 0xff00ff,
      wireframe: true,
    });

    this.add(new Mesh(geometry, material));
    this.add(new Mesh(helperGeometry, helperMaterial));
  }

  update(): void {
    this.control?.update();
  }

  dispose(): void {
    this.reset();
    this.control.disconnect();
    this.control.dispose();
    // @ts-ignore
    this.control = null;
  }
}
