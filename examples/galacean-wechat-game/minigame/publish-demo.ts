/**
 * @title Scene Fog
 * @category Scene
 */

import { FreeControl } from "@galacean/engine-toolkit-controls";
import {
  AmbientLight,
  AssetType,
  Camera,
  Color,
  DirectLight,
  FogMode,
  GLTFResource,
  ShadowType,
  TextRenderer,
  Vector3,
  WebGLEngine,
  Script,
  Font,
  TextHorizontalAlignment
} from "@galacean/engine";

async function initScene(engine: WebGLEngine) {
  const scene = engine.sceneManager.activeScene;

  // Set background color to cornflowerblue
  const cornflowerblue = new Color(130 / 255, 163 / 255, 255 / 255);
  scene.background.solidColor = cornflowerblue;

  // Set fog
  scene.fogMode = FogMode.ExponentialSquared;
  scene.fogDensity = 0.015;
  scene.fogEnd = 200;
  scene.fogColor = cornflowerblue;

  const rootEntity = scene.createRootEntity();

  // Create light entity and component
  const lightEntity = rootEntity.createChild("light");
  lightEntity.transform.setPosition(0, 0.7, 0.5);
  lightEntity.transform.lookAt(new Vector3(0, 0, 0));

  // Enable light cast shadow
  const directLight = lightEntity.addComponent(DirectLight);
  directLight.shadowType = ShadowType.SoftLow;

  // Add ambient light
  const ambientLight = await engine.resourceManager.load<AmbientLight>({
    url: "https://gw.alipayobjects.com/os/bmw-prod/09904c03-0d23-4834-aa73-64e11e2287b0.bin",
    type: AssetType.Env,
  });
  scene.ambientLight = ambientLight;

  // Add model
  const glTFResource = await engine.resourceManager.load<GLTFResource>(
    "https://gw.alipayobjects.com/os/OasisHub/19748279-7b9b-4c17-abdf-2c84f93c54c8/oasis-file/1670226408346/low_poly_scene_forest_waterfall.gltf"
  );
  rootEntity.addChild(glTFResource.defaultSceneRoot);
}

function initBulletScreen(engine: WebGLEngine) {
  class TextBarrageAnimation extends Script {
    // prettier-ignore
    static words = [ "GALACEAN", "galacean", "HELLO", "hello", "WORLD", "world", "TEXT", "text", "PEACE", "peace", "LOVE", "love", "abcdefg", "hijklmn", "opqrst", "uvwxyz", "ABCDEFG", "HIJKLMN", "OPQRST", "UVWXYZ", "~!@#$", "%^&*", "()_+" ];
    static colors = [
      new Color(1, 1, 1, 1),
      new Color(1, 0, 0, 1),
      new Color(0, 1, 0.89, 1),
    ];
  
    public camera: Camera;
    public priorityOffset: number = 0;
  
    private _speed: number = 0;
    private _range: number = 0;
    private _isPlaying: boolean = false;
    private _textRenderer: TextRenderer;

    private screenPoint: Vector3;
  
    play() {
      this._isPlaying = true;
    }
  
    onStart(): void {
      this._textRenderer = this.entity.getComponent(TextRenderer);
      const { bounds } = this._textRenderer;
      this._range = -bounds.max.x + bounds.min.x;
      this.screenPoint = new Vector3(0, 0, -this.camera.entity.transform.position.z);
      this._reset(true);
    }
  
    onUpdate(dt: number): void {
      if (this._isPlaying) {
        this.screenPoint.x += this._speed * dt;
        if (this.screenPoint.x < this._range) {
          this._reset(false);
        }
        camera.screenToWorldPoint(this.screenPoint, this.entity.transform.position);
        this.entity.transform.rotation = this.camera.entity.transform.rotation;
      }
    }
  
    private _reset(isFirst: boolean) {
      const textRenderer = this._textRenderer;
      const { words, colors } = TextBarrageAnimation;
  
      // Reset priority for renderer
      textRenderer.priority += this.priorityOffset;
  
      // Reset the text to render
      const wordLastIndex = words.length - 1;
      textRenderer.text = `${words[getRandomNum(0, wordLastIndex)]} ${
        words[getRandomNum(0, wordLastIndex)]
      } ${getRandomNum(0, 99)}`;
  
      // Reset color
      textRenderer.color = colors[getRandomNum(0, colors.length - 1)];
  
      // Reset position
      if (isFirst) {
        this.screenPoint.x = getRandomNum(-0.5*engine.canvas.width, 0.5*engine.canvas.width);
      } else {
        const { bounds } = textRenderer;
        this.screenPoint.x =
          engine.canvas.width +
          bounds.max.x -
          bounds.min.x;
      }
      this.screenPoint.y = getRandomNum(0, engine.canvas.height);
      camera.screenToWorldPoint(this.screenPoint, this.entity.transform.position);
  
      // Reset speed
      this._speed = getRandomNum(-500, -200);
    }
  }
  
  function getRandomNum(min: number, max: number): number {
    const range = max - min;
    const rand = Math.random();
    return min + Math.round(rand * range);
  }
  const scene = engine.sceneManager.activeScene;
  const rootEntity = scene.getRootEntity();
  
  // Create camera
  const camera = rootEntity.findByName("camera").getComponent(Camera);

  // Create text barrage
  const textCount = 50;
  for (let i = 0; i < textCount; ++i) {
    const textEntity = rootEntity.createChild();

    // Init text renderer
    const textRenderer = textEntity.addComponent(TextRenderer);
    textRenderer.font = Font.createFromOS(engine, "Arial");
    textRenderer.fontSize = 36;
    textRenderer.priority = i;
    textRenderer.horizontalAlignment = TextHorizontalAlignment.Right;

    // Init and reset text barrage animation
    const barrage = textEntity.addComponent(TextBarrageAnimation);
    barrage.camera = camera;
    barrage.priorityOffset = textCount;
    barrage.play();
  }
}

export function Demo(canvas: any) {
  WebGLEngine.create({ canvas: canvas }).then(async engine => {
      engine.canvas.resizeByClientSize();

      const scene = engine.sceneManager.activeScene;
      const rootEntity = scene.createRootEntity();

      // Create camera entity and components
      const cameraEntity = rootEntity.createChild("camera");
      cameraEntity.transform.setPosition(-6, 2, -22);
      cameraEntity.transform.rotate(new Vector3(0, -110, 0));
      cameraEntity.addComponent(Camera);
      cameraEntity.addComponent(FreeControl).floorMock = false;
    
      initScene(engine);
      initBulletScreen(engine);

      engine.run();
    }
  );
}
