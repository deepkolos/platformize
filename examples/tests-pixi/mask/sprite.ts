import * as PIXI from '../pixi';

export function MaskSprite(canvas: any) {
  PIXI.__init__();
  const app = new PIXI.Application({
    view: canvas,
    width: canvas.width,
    height: canvas.height,
    antialias: true,
    resolution: window.devicePixelRatio,
  });
  document.body.appendChild(app.view);

  app.stage.interactive = true;

  const bg = PIXI.Sprite.from('https://pixijs.io/examples/examples/assets/bg_plane.jpg');

  app.stage.addChild(bg);

  const cells = PIXI.Sprite.from('https://pixijs.io/examples/examples/assets/cells.png');

  cells.scale.set(1.5);

  const mask = PIXI.Sprite.from('https://pixijs.io/examples/examples/assets/flowerTop.png');
  mask.anchor.set(0.5);
  mask.x = 310;
  mask.y = 190;

  cells.mask = mask;

  app.stage.addChild(mask, cells);

  const target = new PIXI.Point();

  reset();

  function reset() {
    target.x = Math.floor(Math.random() * 550);
    target.y = Math.floor(Math.random() * 300);
  }

  app.ticker.add(() => {
    mask.x += (target.x - mask.x) * 0.1;
    mask.y += (target.y - mask.y) * 0.1;

    if (Math.abs(mask.x - target.x) < 1) {
      reset();
    }
  });
  return app;
}
