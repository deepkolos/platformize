/**
 * @title Lottie Benchmark
 * @category Benchmark
 */
import { OrbitControl } from '@oasis-engine-toolkit/controls';
import { Camera, Entity, WebGLEngine } from 'oasis-engine';
import { LottieAnimation } from '@oasis-engine/lottie';

export function LottiesBenchmark(canvas: any) {
  const engine = new WebGLEngine(canvas);

  engine.canvas.resizeByClientSize();

  const root = engine.sceneManager.activeScene.createRootEntity();

  const cameraEntity = root.createChild('camera');
  const camera = cameraEntity.addComponent(Camera);
  cameraEntity.transform.setPosition(0, 0, 30);
  cameraEntity.addComponent(OrbitControl);

  engine.resourceManager
    .load<Entity>({
      urls: [
        'https://gw.alipayobjects.com/os/bmw-prod/9ad65a42-9171-47ab-9218-54cf175f6201.json',
        'https://gw.alipayobjects.com/os/bmw-prod/58cde292-8675-4299-b400-d98029b48ac7.atlas',
      ],
      type: 'lottie',
    })
    .then(lottieEntity => {
      for (let i = -4; i < 5; i++) {
        for (let j = -5; j < 6; j++) {
          const clone = lottieEntity.clone();
          clone.transform.setPosition(i * 2, j * 2, 0);
          root.addChild(clone);
          const lottie = clone.getComponent(LottieAnimation);
          lottie.isLooping = true;
          lottie.speed = 0.2 + Math.random() * 2;
          lottie.play();
        }
      }
    });

  engine.run();
  return engine;
}
