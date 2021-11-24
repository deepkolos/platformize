import { baseUrl, Demo } from './Demo';
import {
  FloatType,
  Mesh,
  MeshBasicMaterial,
  PlaneBufferGeometry,
  ReinhardToneMapping,
  ToneMapping,
} from 'three';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader';

export class DemoEXRLoader extends Demo {
  lastToneMapping: ToneMapping;
  lastToneMappingExposure: number;

  async init(): Promise<void> {
    const { renderer } = this.deps;
    const loader = new EXRLoader().setDataType(FloatType);
    const texture = await loader.loadAsync(baseUrl + '/textures/memorial.exr');

    const material = new MeshBasicMaterial({ map: texture });
    const geometry = new PlaneBufferGeometry(
      (4.5 * texture.image.width) / texture.image.height,
      4.5,
    );
    this.add(new Mesh(geometry, material));
    this.lastToneMapping = renderer.toneMapping;
    this.lastToneMappingExposure = renderer.toneMappingExposure;
    renderer.toneMapping = ReinhardToneMapping;
    renderer.toneMappingExposure = 2.0;
  }
  update(): void {}
  dispose(): void {
    this.deps.renderer.toneMapping = this.lastToneMapping;
    this.deps.renderer.toneMappingExposure = this.lastToneMappingExposure;
    this.reset();
  }
}
