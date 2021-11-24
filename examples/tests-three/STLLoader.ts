import { baseUrl, Demo } from './Demo';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import {
  AmbientLight,
  Color,
  DirectionalLight,
  Fog,
  Mesh,
  MeshPhongMaterial,
  PlaneGeometry,
  Vector3,
} from 'three';

export class DemoSTLLoader extends Demo {
  async init(): Promise<void> {
    const { camera, renderer, scene } = this.deps;

    camera.position.set(3, 0.15, 3);
    renderer.setClearColor(0xffffff);
    scene.position.z = 0;
    scene.background = new Color(0x72645b);
    scene.fog = new Fog(0x72645b, 2, 15);
    renderer.shadowMap.enabled = true;

    const plane = new Mesh(new PlaneGeometry(40, 40), new MeshPhongMaterial({ color: 0x999999, specular: 0x101010 }));
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -0.5;
    plane.receiveShadow = true;

    this.add(plane);
    this.add(new AmbientLight(0x444444));
    this.addShadowedLight(1, 1, 1, 0xffffff, 1.35);
    this.addShadowedLight(0.5, 1, -1, 0xffaa00, 1);
    this.addControl();
    this.loadModels();
  }

  addShadowedLight(x, y, z, color, intensity) {
    const directionalLight = new DirectionalLight(color, intensity);
    directionalLight.position.set(x, y, z);
    this.add(directionalLight);

    directionalLight.castShadow = true;

    const d = 1;
    directionalLight.shadow.camera.left = -d;
    directionalLight.shadow.camera.right = d;
    directionalLight.shadow.camera.top = d;
    directionalLight.shadow.camera.bottom = -d;

    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 4;

    directionalLight.shadow.bias = -0.002;
  }

  loadModels() {
    const loader = new STLLoader();
    loader.load(baseUrl + '/models/stl/ascii/slotted_disk.stl', geometry => {
      const material = new MeshPhongMaterial({ color: 0xff5533, specular: 0x111111, shininess: 200 });
      const mesh = new Mesh(geometry, material);

      mesh.position.set(0, -0.25, 0.6);
      mesh.rotation.set(0, -Math.PI / 2, 0);
      mesh.scale.set(0.5, 0.5, 0.5);

      mesh.castShadow = true;
      mesh.receiveShadow = true;

      this.add(mesh);
    });

    // Binary files
    const material = new MeshPhongMaterial({ color: 0xaaaaaa, specular: 0x111111, shininess: 200 });

    loader.load(baseUrl + '/models/stl/binary/pr2_head_pan.stl', geometry => {
      const mesh = new Mesh(geometry, material);

      mesh.position.set(0, -0.37, -0.6);
      mesh.rotation.set(-Math.PI / 2, 0, 0);
      mesh.scale.set(2, 2, 2);

      mesh.castShadow = true;
      mesh.receiveShadow = true;

      this.add(mesh);
    });

    loader.load('./models/stl/binary/pr2_head_tilt.stl', geometry => {
      const mesh = new Mesh(geometry, material);

      mesh.position.set(0.136, -0.37, -0.6);
      mesh.rotation.set(-Math.PI / 2, 0.3, 0);
      mesh.scale.set(2, 2, 2);

      mesh.castShadow = true;
      mesh.receiveShadow = true;

      this.add(mesh);
    });

    // Colored binary STL
    loader.load(baseUrl + '/models/stl/binary/colored.stl', geometry => {
      let meshMaterial = material;
      // @ts-ignore
      if (geometry.hasColors) {
        // @ts-ignore
        meshMaterial = new MeshPhongMaterial({ opacity: geometry.alpha, vertexColors: true });
      }

      const mesh = new Mesh(geometry, meshMaterial);

      mesh.position.set(0.5, 0.2, 0);
      mesh.rotation.set(-Math.PI / 2, Math.PI / 2, 0);
      mesh.scale.set(0.3, 0.3, 0.3);

      mesh.castShadow = true;
      mesh.receiveShadow = true;

      this.add(mesh);
    });
  }
  update(): void {
    this.orbitControl?.update();
    this.deps.camera.lookAt(new Vector3(0, -0.25, 0));
  }
  dispose(): void {
    this.reset();
  }
}
