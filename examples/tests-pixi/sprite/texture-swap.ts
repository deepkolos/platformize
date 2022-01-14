import * as PIXI from '../pixi';

export function SpriteSwap(canvas: any) {
  PIXI.__init__();
  const app = new PIXI.Application({
    view: canvas,
    width: canvas.width,
    height: canvas.height,
  });
  document.body.appendChild(app.view);

  let bol = false;

  // create a texture from an image path
  const texture = PIXI.Texture.from('https://pixijs.io/examples/examples/assets/flowerTop.png');

  // create a second texture
  const secondTexture = PIXI.Texture.from('https://pixijs.io/examples/examples/assets/eggHead.png');

  // create a new Sprite using the texture
  const dude = new PIXI.Sprite(texture);

  // center the sprites anchor point
  dude.anchor.set(0.5);

  // move the sprite to the center of the screen
  dude.x = app.screen.width / 2;
  dude.y = app.screen.height / 2;

  app.stage.addChild(dude);

  // make the sprite interactive
  dude.interactive = true;
  dude.buttonMode = true;

  dude.on('touchstart', () => {
    bol = !bol;
    if (bol) {
      dude.texture = secondTexture;
    } else {
      dude.texture = texture;
    }
  });

  app.ticker.add(() => {
    // just for fun, let's rotate mr rabbit a little
    dude.rotation += 0.1;
  });
  return app;
}
