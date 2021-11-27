import {
  WebGL1Renderer,
  Clock,
  Scene,
  TextureLoader,
  PerspectiveCamera,
  Object3D,
  sRGBEncoding,
  Texture,
  Color,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { disposeHierarchy } from 'platformize-three/dist/base/dispose-three'

export const baseUrl = 'https://techbrood.com/threejs/examples/';
// export const baseUrl = 'https://threejs.org/examples';

export interface DemoDeps {
  clock: Clock;
  scene: Scene;
  gltfLoader: GLTFLoader;
  renderer: WebGL1Renderer;
  camera: PerspectiveCamera;
  textureLoader: TextureLoader;
}

export abstract class Demo {
  deps: DemoDeps;
  private _objects = [];
  orbitControl: OrbitControls;
  private _cameraObjects = [];

  constructor(deps: DemoDeps) {
    this.deps = deps;
  }

  add(obj: Object3D) {
    this._objects.push(obj);
    this.deps.scene.add(obj);
  }

  addCamera(obj: Object3D) {
    this._cameraObjects.push(obj);
    this.deps.camera.add(obj);
  }

  addControl() {
    const { camera, renderer } = this.deps;
    this.orbitControl = new OrbitControls(camera, renderer.domElement);
    this.orbitControl.enableDamping = true;
    this.orbitControl.dampingFactor = 0.05;
  }

  reset(all = true) {
    const { camera, scene, renderer } = this.deps;
    camera.position.set(0, 0, 0);
    camera.quaternion.set(0, 0, 0, 1);
    (scene.background as Texture)?.dispose?.();
    scene.background = new Color(0xffffff);
    scene.fog = null;
    scene.position.z = -3;
    renderer.shadowMap.enabled = false;
    renderer.physicallyCorrectLights = false;
    renderer.outputEncoding = sRGBEncoding;

    disposeHierarchy(this.deps.scene);
    this._objects.forEach(object => object.material?.dispose?.());
    this._cameraObjects.forEach(object => object.material?.dispose?.());
    scene.remove(...this._objects);
    camera.remove(...this._cameraObjects);
    this._objects.length = 0;
    this._cameraObjects.length = 0;

    this.orbitControl?.dispose();

    if (all) {
      this.orbitControl = null;
      this.deps = null;
    }
  }

  abstract init(): Promise<void>;
  abstract update(): void;
  abstract dispose(): void;
}
