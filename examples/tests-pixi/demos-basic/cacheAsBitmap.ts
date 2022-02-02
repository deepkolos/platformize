import * as PIXI from '../pixi';

export function CacheAsBitmap(canvas: any) {
  PIXI.__init__();
  const app = new PIXI.Application({
    view: canvas,
    width: canvas.width,
    height: canvas.height,
    antialias: true,
    resolution: window.devicePixelRatio,
  });
  //   document.body.appendChild(app.view);

  app.stop();

  // load resources
  app.loader
    .add('spritesheet', 'https://pixijs.io/examples/examples/assets/spritesheet/monsters.json')
    .load(onAssetsLoaded);

  // holder to store aliens
  const aliens = [];
  const alienFrames = ['eggHead.png', 'flowerTop.png', 'helmlok.png', 'skully.png'].map(
    i => `https://pixijs.io/examples/examples/assets/${i}`,
  );

  let count = 0;
  const cW = canvas.width;
  const cH = canvas.height;
  const cHalfW = canvas.width * 0.5;
  const cHalfH = canvas.height * 0.5;

  // create an empty container
  const alienContainer = new PIXI.Container();
  alienContainer.x = window.innerWidth * 0.5;
  alienContainer.y = window.innerHeight * 0.5;

  // make the stage interactive
  app.stage.interactive = true;
  app.stage.addChild(alienContainer);

  function onAssetsLoaded() {
    // add a bunch of aliens with textures from image paths
    for (let i = 0; i < 100; i++) {
      const frameName = alienFrames[i % 4];

      // create an alien using the frame name..
      const alien = PIXI.Sprite.from(frameName);
      alien.tint = Math.random() * 0xffffff;

      /*
       * fun fact for the day :)
       * another way of doing the above would be
       * var texture = PIXI.Texture.from(frameName);
       * var alien = new PIXI.Sprite(texture);
       */
      alien.x = Math.random() * cW - cHalfW;
      alien.y = Math.random() * cH - cHalfH;
      alien.anchor.x = 0.5;
      alien.anchor.y = 0.5;
      aliens.push(alien);
      alienContainer.addChild(alien);
    }
    app.start();
  }

  // Combines both mouse click + touch tap
  app.stage.on('touchstart', onClick);

  function onClick() {
    alienContainer.cacheAsBitmap = !alienContainer.cacheAsBitmap;

    // feel free to play with what's below
    var sprite = new PIXI.Sprite(app.renderer.generateTexture(alienContainer));
    app.stage.addChild(sprite);
    sprite.x = Math.random() * cHalfW;
    sprite.y = Math.random() * cHalfH;
    sprite.scale.set(1 / app.renderer.resolution);
  }

  app.ticker.add(() => {
    // let's rotate the aliens a little bit
    for (let i = 0; i < 100; i++) {
      const alien = aliens[i];
      alien.rotation += 0.1;
    }

    count += 0.01;

    alienContainer.scale.x = Math.sin(count);
    alienContainer.scale.y = Math.sin(count);
    alienContainer.rotation += 0.01;
  });
  return app;
}
