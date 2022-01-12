/// <reference types="wechat-miniprogram" />

import { WechatPlatform as WechatPlatformBase } from 'platformize';
import type { Polyfill } from '../Platform';

export class WechatPlatform extends WechatPlatformBase {
  polyfill!: Polyfill;

  constructor(canvas: WechatMiniprogram.Canvas, width?: number, height?: number) {
    super(canvas, width, height);
    this.polyfill.$defaultWebGLExtensions = { OES_vertex_array_object: null };

    // @ts-ignore
    this.polyfill.navigator = { userAgent: '' };
    // @ts-ignore
    this.polyfill.document.body = { appendChild() {} };
    this.polyfill.HTMLCanvasElement = canvas.constructor as unknown as HTMLCanvasElement;
  }
}
