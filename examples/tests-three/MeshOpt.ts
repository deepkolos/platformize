import { Demo } from './Demo';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { AmbientLight, Color, PointLight } from 'three';
// import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module';
// import { MeshoptDecoder } from 'three/tools/meshopt_decoder.asm.module';
import { MeshoptDecoder } from 'platformize-three/dist/base/meshopt_decoder.wasm.module';

/**
 * 测试手机：小米8 (微信8.0禁用WebAssembly API，改为WXWebAssembly, 并且不支持SIMD，但是IOS支持WXWebAssembly)
 *
 * 加载时间ms
 *  wasm 58  61  62   (WebAssembly API)
 *  wasm 50  73  83   (WXWebAssembly API)
 *  asm  144 139 134
 * 
 * IPhone7
 *  wasm 22  22  22   (WXWebAssembly API)
 */

export class DemoMeshOpt extends Demo {
  async init(): Promise<void> {
    const { gltfLoader, camera, scene } = this.deps;
    MeshoptDecoder.setWasmPath('/decoder_base.wasm');
    gltfLoader.setMeshoptDecoder(MeshoptDecoder);
    const t = Date.now();
    const gltf = (await gltfLoader.loadAsync(
      // 'https://meshoptimizer.org/demo/pirate.glb',
      'https://cdn.static.oppenlab.com/weblf/test/pirate.glb',
    )) as GLTF;
    console.log(Date.now() - t);

    const pointLight = new PointLight(0xffffff, 0.8);
    pointLight.position.set(3, 3, 0);

    this.add(new AmbientLight(0xcccccc, 0.3));
    this.add(gltf.scene);
    this.add(camera);
    this.addCamera(pointLight);

    gltf.scene.position.y = -1;
    scene.position.z = 0;
    camera.position.y = 1.0;
    camera.position.z = 3.0;
    scene.background = new Color(0x300a24);

    this.addControl();
  }

  update(): void {
    this.orbitControl?.update();
  }

  dispose(): void {
    this.reset();
  }
}
