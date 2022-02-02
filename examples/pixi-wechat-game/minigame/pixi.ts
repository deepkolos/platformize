// generate from https://pixijs.io/customize/

// import '@pixi/polyfill';
export * from '@pixi/constants';
export * from '@pixi/math';
import '@pixi/math-extras';
export * from '@pixi/runner';
export * from '@pixi/settings';
export * from '@pixi/ticker';
import * as utils from '@pixi/utils';
export { utils };
export * from '@pixi/display';
export * from '@pixi/core';
export * from '@pixi/events';
import * as PIXI from '@pixi/core';
import { install } from '@pixi/unsafe-eval';
import '@pixi/mixin-get-child-by-name';
import '@pixi/mixin-get-global-position';
export * from '@pixi/extract';
export * from '@pixi/loaders';
// export * from '@pixi/compressed-textures';
// export * from '@pixi/basis';
export * from '@pixi/mesh';
export * from '@pixi/particle-container';
export * from '@pixi/sprite';
// export * from '@pixi/accessibility';
export * from '@pixi/app';
export * from '@pixi/graphics';
import '@pixi/graphics-extras';
export * from '@pixi/mesh-extras';
import '@pixi/mixin-cache-as-bitmap';
export * from '@pixi/sprite-animated';
export * from '@pixi/sprite-tiling';
export * from '@pixi/spritesheet';
export * from '@pixi/text-bitmap';
export * from '@pixi/text';
// @ts-ignore
export * from '@pixi/interaction';
export * from '@pixi/prepare';

// Renderer plugins
import { Renderer } from '@pixi/core';
// import { AccessibilityManager } from '@pixi/accessibility';
import { BatchRenderer } from '@pixi/core';
import { Extract } from '@pixi/extract';
import { InteractionManager } from '@pixi/interaction';
import { ParticleRenderer } from '@pixi/particle-container';
import { Prepare } from '@pixi/prepare';
import { TilingSpriteRenderer } from '@pixi/sprite-tiling';

// Application plugins
import { Application } from '@pixi/app';
import { AppLoaderPlugin } from '@pixi/loaders';
import { TickerPlugin } from '@pixi/ticker';

// Loader plugins
import { Loader } from '@pixi/loaders';
// import { BasisLoader } from '@pixi/basis';
// import { CompressedTextureLoader, DDSLoader, KTXLoader } from '@pixi/compressed-textures';
import { SpritesheetLoader } from '@pixi/spritesheet';
import { BitmapFontLoader } from '@pixi/text-bitmap';

// Filters
import { AlphaFilter } from '@pixi/filter-alpha';
import { BlurFilter, BlurFilterPass } from '@pixi/filter-blur';
import { ColorMatrixFilter } from '@pixi/filter-color-matrix';
import { DisplacementFilter } from '@pixi/filter-displacement';
import { FXAAFilter } from '@pixi/filter-fxaa';
import { NoiseFilter } from '@pixi/filter-noise';
export const filters = {
  AlphaFilter,
  BlurFilter,
  BlurFilterPass,
  ColorMatrixFilter,
  DisplacementFilter,
  FXAAFilter,
  NoiseFilter,
};

let inited = false;
function __init__() {
  if (!inited) {
    inited = true;
    install(PIXI);

    Loader.registerPlugin(BitmapFontLoader);
    Loader.registerPlugin(SpritesheetLoader);
    // Loader.registerPlugin(CompressedTextureLoader);
    // Loader.registerPlugin(DDSLoader);
    // Loader.registerPlugin(KTXLoader);
    // Loader.registerPlugin(BasisLoader);
    Application.registerPlugin(TickerPlugin);
    Application.registerPlugin(AppLoaderPlugin);
    Renderer.registerPlugin('tilingSprite', TilingSpriteRenderer);
    Renderer.registerPlugin('interaction', InteractionManager);
    Renderer.registerPlugin('extract', Extract);
    Renderer.registerPlugin('batch', BatchRenderer);
    // Renderer.registerPlugin('accessibility', AccessibilityManager);

    Renderer.registerPlugin('particle', ParticleRenderer);
    Renderer.registerPlugin('prepare', Prepare);
  }
}

export { __init__ };
