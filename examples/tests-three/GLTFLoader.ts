import { baseUrl, Demo } from './Demo';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { AnimationMixer, AnimationAction, LoopOnce, DirectionalLight, AmbientLight } from 'three';

export class DemoGLTFLoader extends Demo {
  mixer?: AnimationMixer | null;

  async init(): Promise<void> {
    const gltf = (await this.deps.gltfLoader.loadAsync(
      // baseUrl + '/models/gltf/RobotExpressive/RobotExpressive.glb',
      'https://dtmall-tel.alicdn.com/edgeComputingConfig/upload_models/1591673169101/RobotExpressive.glb',
    )) as GLTF;
    gltf.scene.position.z = 2.5;
    gltf.scene.position.y = -2;

    this.add(new DirectionalLight(0xffffff, 1));
    this.add(new AmbientLight(0xffffff, 1));
    this.add(gltf.scene);
    this.deps.camera.position.z = 10;

    // init animtion
    const states = ['Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing'];
    const emotes = ['Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp'];
    this.mixer = new AnimationMixer(gltf.scene);
    const actions: { [k: string]: AnimationAction } = {};
    for (let i = 0; i < gltf.animations.length; i++) {
      const clip = gltf.animations[i];
      const action = this.mixer.clipAction(clip);
      actions[clip.name] = action;
      if (emotes.indexOf(clip.name) >= 0 || states.indexOf(clip.name) >= 4) {
        action.clampWhenFinished = true;
        action.loop = LoopOnce;
      }
    }

    const activeAction = actions['Walking'];
    activeAction.play();

    this.addControl();
  }

  update(): void {
    this.mixer?.update(this.deps.clock.getDelta());
    this.orbitControl?.update();
  }

  dispose(): void {
    this.mixer?.stopAllAction();
    this.mixer = null;
    this.reset();
  }
}
