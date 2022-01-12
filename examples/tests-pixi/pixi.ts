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
import { install } from '@pixi/unsafe-eval';

// Renderer plugins
import { Renderer } from '@pixi/core';
import { BatchRenderer } from '@pixi/core';

// Application plugins
import { Application } from '@pixi/app';
import { TickerPlugin } from '@pixi/ticker';
import * as PIXI from '@pixi/core';

let inited = false;
function __init__() {
  if (!inited) {
    inited = true;
    Application.registerPlugin(TickerPlugin);
    install(PIXI);
    Renderer.registerPlugin('batch', BatchRenderer);
  }
}

export { __init__ };
