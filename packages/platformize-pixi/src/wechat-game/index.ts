/// <reference types="minigame-api-typings" />

import { WechatGamePlatform as WechatGamePlatformBase } from 'platformize';
import type { Polyfill } from '../Platform';

WechatGamePlatformBase.DEVTOOLS_USE_NATIVE_EVENT = true;
export class WechatGamePlatform extends WechatGamePlatformBase {
  declare polyfill: Polyfill;

  constructor(canvas: WechatMinigame.Canvas, width?: number, height?: number) {
    super(canvas, width, height);
    this.polyfill.$defaultWebGLExtensions = { OES_vertex_array_object: null };

    // @ts-ignore
    this.polyfill.navigator = { userAgent: '' };
    // @ts-ignore
    this.polyfill.window.location = { origin: '' };
    // @ts-ignore
    this.polyfill.document.body = { appendChild() {} };
    this.polyfill.HTMLCanvasElement = canvas.constructor as unknown as HTMLCanvasElement;
    const img = this.polyfill.document.createElement('img');
    this.polyfill.HTMLImageElement = img.constructor as unknown as HTMLImageElement;
  }

  init(pixi: any, canvas2d: any) {
    pixi.TextMetrics._canvas = canvas2d;
    pixi.TextMetrics._context = canvas2d.getContext('2d');
    // @ts-ignore
    this.polyfill.window.$canvas2D = canvas2d;
  }
}
