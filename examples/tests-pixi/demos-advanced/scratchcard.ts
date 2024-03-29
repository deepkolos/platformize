import * as PIXI from '../pixi';

export function ScratchCard(canvas: any) {
  PIXI.__init__();
  // for this example you have to use mouse or touchscreen

  const app = new PIXI.Application({
    view: canvas,
    width: canvas.width,
    height: canvas.height,
    antialias: true,
    resolution: window.devicePixelRatio,
  });
  document.body.appendChild(app.view);
  const { stage } = app;

  // prepare circle texture, that will be our brush
  const brush = new PIXI.Graphics();
  brush.beginFill(0xffffff);
  brush.drawCircle(0, 0, 50);
  //   brush.drawRect(0,0, 50,50);
  brush.endFill();
  brush.position.x = -50;

  app.loader.add('t1', 'https://pixijs.io/examples/examples/assets/bg_grass.jpg');
  app.loader.add('t2', 'https://pixijs.io/examples/examples/assets/bg_rotate.jpg');
  app.loader.load(setup);

  // @ts-ignore
  function setup(loader, resources) {
    const background = new PIXI.Sprite(resources.t1.texture);
    stage.addChild(background);
    background.width = app.screen.width;
    background.height = app.screen.height;

    const imageToReveal = new PIXI.Sprite(resources.t2.texture);
    stage.addChild(imageToReveal);
    imageToReveal.width = app.screen.width;
    imageToReveal.height = app.screen.height;

    const renderTexture = PIXI.RenderTexture.create(app.screen.width, app.screen.height);

    const renderTextureSprite = new PIXI.Sprite(renderTexture);
    stage.addChild(renderTextureSprite);
    imageToReveal.mask = renderTextureSprite;

    app.stage.interactive = true;
    app.stage.on('pointerdown', pointerDown);
    app.stage.on('pointerup', pointerUp);
    app.stage.on('pointermove', pointerMove);
    // 抖音小程序的RT需要默认是白色... 需要手动clear成黑色
    app.renderer.render(brush, { renderTexture, clear: true });

    let dragging = false;

    function pointerMove(event) {
      if (dragging) {
        brush.position.copyFrom(event.data.global);
        app.renderer.render(brush, { renderTexture, clear: false });
      }
    }

    function pointerDown(event) {
      dragging = true;
      pointerMove(event);
    }

    function pointerUp(event) {
      dragging = false;
    }
  }
  return app;
}
