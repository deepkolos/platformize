import { baseUrl, Demo } from './Demo';
import { BVHLoader } from 'three/examples/jsm/loaders/BVHLoader';
import {
  AnimationMixer,
  Color,
  GridHelper,
  Group,
  SkeletonHelper,
} from 'three';

export class DemoBVHLoader extends Demo {
  mixer: AnimationMixer;
  async init(): Promise<void> {
    const { scene, camera } = this.deps;
    const loader = new BVHLoader();

    camera.position.set(0, 200, 300);

    const result = await loader.loadAsync(
      baseUrl + '/models/bvh/pirouette.bvh',
    );
    const skeletonHelper = new SkeletonHelper(result.skeleton.bones[0]);
    // @ts-ignore
    skeletonHelper.skeleton = result.skeleton; // allow animation mixer to bind to SkeletonHelper directly

    const boneContainer = new Group();
    boneContainer.add(result.skeleton.bones[0]);

    this.add(skeletonHelper);
    this.add(boneContainer);
    scene.background = new Color(0xeeeeee);

    this.add(new GridHelper(400, 10));

    // play animation
    this.mixer = new AnimationMixer(skeletonHelper);
    this.mixer.clipAction(result.clip).setEffectiveWeight(1.0).play();

    this.addControl();
    this.orbitControl.minDistance = 300;
    this.orbitControl.maxDistance = 700;
  }
  update(): void {
    this.mixer?.update(this.deps.clock.getDelta());
    this.orbitControl?.update();
  }
  dispose(): void {
    this.reset();
    this.mixer.stopAllAction();
    this.mixer = null;
  }
}
