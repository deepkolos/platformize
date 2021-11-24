import { Demo } from './Demo';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import {
  DirectionalLight,
  AmbientLight,
  PMREMGenerator,
  UnsignedByteType,
  Texture,
  SpotLight,
  Euler,
} from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

const baseUrl = 'https://techbrood.com/threejs';

export class DemoRGBELoader extends Demo {
  async init(): Promise<void> {
    const { renderer, gltfLoader, scene, camera } = this.deps;
    const gltf = (await gltfLoader.loadAsync(
      baseUrl +
        '/examples/models/gltf/MetalRoughSpheres/glTF/MetalRoughSpheres.gltf',
    )) as GLTF;

    gltf.scene.rotation.copy(new Euler(0, 0, 0));
    renderer.physicallyCorrectLights = true;

    // env map
    const rgbeLoader = new RGBELoader();
    const pmremGenerator = new PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const t0 = Date.now();
    const envTexture = (await rgbeLoader
      .setDataType(UnsignedByteType)
      .loadAsync(
        baseUrl + '/examples/textures/equirectangular/venice_sunset_2k.hdr',
      )) as Texture;
    const t = Date.now();
    const envMap = pmremGenerator.fromEquirectangular(envTexture).texture;
    console.log('time cost', Date.now() - t, t - t0);

    envTexture.dispose();
    pmremGenerator.dispose();
    scene.background = envMap;

    // prettier-ignore
    gltf.scene.traverse( function ( node ) {
      // @ts-ignore
      if ( node.material && ( node.material.isMeshStandardMaterial ||
      // @ts-ignore
         ( node.material.isShaderMaterial && node.material.envMap !== undefined ) ) ) {
        // @ts-ignore
        node.material.envMap = envMap;
        // @ts-ignore
        node.material.envMapIntensity = 1.5; // boombox seems too dark otherwise
      }
      // @ts-ignore
      if ( node.isMesh || node.isLight ) node.castShadow = true;
    } );

    // lights
    const directionalLight = new DirectionalLight(0xdddddd, 4);
    directionalLight.position.set(0, 0, 1).normalize();

    const spotLight = new SpotLight(0xffffff, 1);
    spotLight.position.set(5, 10, 5);
    spotLight.angle = 0.5;
    spotLight.penumbra = 0.75;
    spotLight.intensity = 100;
    spotLight.decay = 2;

    camera.position.set(2, 1, 15);

    this.add(gltf.scene);
    this.add(directionalLight);
    this.add(new AmbientLight(0x222222));
    this.add(spotLight);
    this.addControl();
  }

  update(): void {
    this.orbitControl?.update();
  }

  dispose(): void {
    this.reset();
  }
}
