/// <reference types="minigame-api-typings" />

import { WechatGamePlatform as WechatGamePlatformBase } from 'platformize';
import type { Polyfill } from '../Platform';

export class WechatGamePlatform extends WechatGamePlatformBase {
  polyfill!: Polyfill;

  constructor(canvas: WechatMinigame.Canvas, width?: number, height?: number) {
    super(canvas, width, height);
    this.polyfill.$defaultWebGLExtensions = { OES_vertex_array_object: null };
    this.polyfill.HTMLCanvasElement = canvas.constructor as unknown as HTMLCanvasElement;
    (canvas as any).focus = () => {};
  }
}
