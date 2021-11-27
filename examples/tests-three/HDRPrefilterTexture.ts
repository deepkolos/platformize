import { Mesh, MeshBasicMaterial, PlaneGeometry } from 'three';
import { Demo } from './Demo';
import { toEnvMap } from 'platformize-three/dist/base/toEnvMap';

export class DemoHDRPrefilterTexture extends Demo {
  async init(): Promise<void> {
    const { scene, camera } = this.deps;
    const texture = await this.deps.textureLoader.loadAsync(
      // 'https://s3.ax1x.com/2021/02/01/yeci9I.png',
      'https://cdn.static.oppenlab.com/weblf/test/hdr-prefilter.png',
    );
    toEnvMap(texture);
    const geometry = new PlaneGeometry(3, 3);
    const material = new MeshBasicMaterial({ map: texture });
    const mesh = new Mesh(geometry, material);

    this.add(mesh);
    scene.background = texture;
    camera.position.z = 1;

    this.addControl();
  }
  update(): void {
    this.orbitControl?.update();
  }
  dispose(): void {
    this.reset();
  }
}
