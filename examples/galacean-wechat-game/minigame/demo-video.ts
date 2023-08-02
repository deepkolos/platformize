import {
  WebGLEngine,
  Camera,
  Vector3,
  Entity
} from "@galacean/engine";
import { VideoPlayer } from "./scripts/videoplayer";

export async function Demo(canvas: any) {
  const engine = await WebGLEngine.create({ canvas: canvas });
  engine.canvas.resizeByClientSize();

  const rootEntity = engine.sceneManager.activeScene.createRootEntity("Root");
  const cameraEntity = rootEntity.createChild("Camera");
  cameraEntity.addComponent(Camera);
  cameraEntity.transform.setPosition(0, 0, 10);
  cameraEntity.transform.lookAt(new Vector3(0, 0, 0));

  function addVideo(parent: Entity, videoPkg: Object, pos: Vector3): Entity {
    const videoEntity = parent.createChild("");
    const videoScript = videoEntity.addComponent(VideoPlayer);
    videoScript.videoPkg = videoPkg;
    videoScript.pos = { x: pos.x, y: pos.y, z: pos.z };
    const { transform } = videoEntity;
    transform.position = pos;
    return videoEntity;
  }
  
  addVideo(
    rootEntity,
    {
      width: 480,
      height: 640,
      url: "https://gw.alipayobjects.com/v/portal_qb9pdx/afts/video/A*PLB9SJvLDEUAAAAAAAAAAAAAAQAAAQ"
    },
    new Vector3(100, 20, 0)
  );

  engine.run();
}
