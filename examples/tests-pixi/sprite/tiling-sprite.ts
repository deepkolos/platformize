import * as PIXI from '../pixi';

export function SpriteTiling(canvas: any) {
  PIXI.__init__();
  const app = new PIXI.Application({
    view: canvas,
    width: canvas.width,
    height: canvas.height,
    antialias: true,
    resolution: window.devicePixelRatio,
  });
  document.body.appendChild(app.view);

  // create a texture from an image path
  const texture = PIXI.Texture.from('https://pixijs.io/examples/examples/assets/p2.jpeg');

  /* create a tiling sprite ...
   * requires a texture, a width and a height
   * in WebGL the image size should preferably be a power of two
   */
  const tilingSprite = new PIXI.TilingSprite(texture, app.screen.width, app.screen.height);
  app.stage.addChild(tilingSprite);

  let count = 0;

  app.ticker.add(() => {
    count += 0.005;

    tilingSprite.tileScale.x = 2 + Math.sin(count);
    tilingSprite.tileScale.y = 2 + Math.cos(count);

    tilingSprite.tilePosition.x += 1;
    tilingSprite.tilePosition.y += 1;
  });

  return app;
}
