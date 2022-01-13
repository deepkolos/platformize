// generate from https://pixijs.io/customize/

export * from '@pixi/constants';
export * from '@pixi/math';
export * from '@pixi/runner';
export * from '@pixi/settings';
export * from '@pixi/ticker';
import * as utils from '@pixi/utils';
export { utils };
export * from '@pixi/display';
export * from '@pixi/core';
export * from '@pixi/sprite';
export * from '@pixi/app';
export * from '@pixi/particle-container';
export * from '@pixi/sprite-tiling';
export * from '@pixi/sprite-animated';
export * from '@pixi/math-extras';
export * from '@pixi/mesh';
export * from '@pixi/mesh-extras';
export * from '@pixi/interaction';

// Renderer plugins
import { Renderer } from '@pixi/core';
import { BatchRenderer } from '@pixi/core';
import { TilingSpriteRenderer } from '@pixi/sprite-tiling';
import { ParticleRenderer } from '@pixi/particle-container';
import { InteractionManager } from '@pixi/interaction';

// Application plugins
import { Application } from '@pixi/app';
import { TickerPlugin } from '@pixi/ticker';
import { AppLoaderPlugin } from '@pixi/loaders';
import * as PIXI from '@pixi/core';
import { install } from '@pixi/unsafe-eval';

let inited = false;
function __init__() {
  if (!inited) {
    inited = true;
    Application.registerPlugin(TickerPlugin);
    Application.registerPlugin(AppLoaderPlugin);
    install(PIXI);
    Renderer.registerPlugin('batch', BatchRenderer);
    Renderer.registerPlugin('tilingSprite', TilingSpriteRenderer);
    Renderer.registerPlugin('particle', ParticleRenderer);
    Renderer.registerPlugin('interaction', InteractionManager);
  }
}

export { __init__ };
