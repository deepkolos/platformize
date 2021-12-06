import * as pc from 'playcanvas';
import { bloomScript } from './scripts/posteffect-bloom';
import { getUrl, labelAssets, loadAssets } from './utils/loader';

export async function animationBlend1D(canvas: any) {
  console.warn(
    '该测试用例在微信小程序会报错,因为glb模型有纹理分辨率大于2048,微信小程序不支持加载分辨率高于2048的图片',
  );
  const app = new pc.Application(canvas, {
    mouse: new pc.Mouse(document.body),
    touch: new pc.TouchDevice(document.body),
    elementInput: new pc.ElementInput(canvas),
  });
  app.graphicsDevice.maxPixelRatio = window.devicePixelRatio;
  app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
  app.setCanvasResolution(pc.RESOLUTION_AUTO);
  bloomScript();

  const assetsArray = await loadAssets(app, [
    {
      url: getUrl('static/assets/models/bitmoji.glb'),
      type: 'container',
    },
    {
      url: getUrl('static/assets/animations/bitmoji/idle.glb'),
      type: 'container',
    },
    {
      url: getUrl('static/assets/animations/bitmoji/win-dance.glb'),
      type: 'container',
    },
  ]);
  const assets = labelAssets(assetsArray, ['model', 'idleAnim', 'danceAnim']);

  // setup skydome
  app.scene.exposure = 3;
  // app.scene.skyboxMip = 2;
  // app.scene.setSkybox(assets['helipad.dds'].resources);

  // Create an Entity with a camera component
  const cameraEntity = new pc.Entity();
  cameraEntity.addComponent('camera', {
    clearColor: new pc.Color(0.1, 0.1, 0.1),
  });
  cameraEntity.translate(0, 0.75, 3);

  // add bloom postprocessing (this is ignored by the picker)
  cameraEntity.addComponent('script');
  cameraEntity.script!.create('bloom', {
    attributes: {
      bloomIntensity: 2,
      bloomThreshold: 0.5,
      blurAmount: 4,
    },
  });
  app.root.addChild(cameraEntity);

  // Create an entity with a light component
  const lightEntity = new pc.Entity();
  lightEntity.addComponent('light', {
    castShadows: true,
    intensity: 1.5,
    normalOffsetBias: 0.02,
    shadowType: pc.SHADOW_PCF5,
    shadowDistance: 6,
    shadowResolution: 2048,
    shadowBias: 0.02,
  });
  app.root.addChild(lightEntity);
  lightEntity.setLocalEulerAngles(45, 30, 0);

  // create an entity from the loaded model using the render component
  const modelEntity = assets.model.resource.instantiateRenderEntity({
    castShadows: true,
  });

  // add an anim component to the entity
  modelEntity.addComponent('anim', {
    activate: true,
  });

  // create an anim state graph
  const animStateGraphData = {
    layers: [
      {
        name: 'characterState',
        states: [
          {
            name: 'START',
          },
          {
            name: 'Movement',
            speed: 1.0,
            loop: true,
            blendTree: {
              type: '1D',
              parameter: 'blend',
              children: [
                {
                  name: 'Idle',
                  point: 0.0,
                },
                {
                  name: 'Dance',
                  point: 1.0,
                  speed: 0.85,
                },
              ],
            },
          },
        ],
        transitions: [
          {
            from: 'START',
            to: 'Movement',
          },
        ],
      },
    ],
    parameters: {
      blend: {
        name: 'blend',
        type: 'FLOAT',
        value: 0,
      },
    },
  };

  // load the state graph into the anim component
  modelEntity.anim.loadStateGraph(animStateGraphData);

  // load the state graph asset resource into the anim component
  const characterStateLayer = modelEntity.anim.baseLayer;
  characterStateLayer.assignAnimation(
    'Movement.Idle',
    assets.idleAnim.resource.animations[0].resource,
  );
  characterStateLayer.assignAnimation(
    'Movement.Dance',
    assets.danceAnim.resource.animations[0].resource,
  );

  app.root.addChild(modelEntity);

  app.start();

  modelEntity.anim.setFloat('blend', 1);

  return app;
}
