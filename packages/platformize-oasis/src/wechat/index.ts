/// <reference types="wechat-miniprogram" />

import { WechatPlatform as WechatPlatformBase } from 'platformize';
import type { Polyfill } from '../Platform';
import $HTMLCanvasElement from '../base/HTMLCanvasElement';

export class WechatPlatform extends WechatPlatformBase {
  polyfill!: Polyfill;

  constructor(canvas: WechatMiniprogram.Canvas, width?: number, height?: number) {
    super(canvas, width, height);
    this.polyfill.$defaultWebGLExtensions = {};
    this.polyfill.HTMLCanvasElement = canvas.constructor as unknown as HTMLCanvasElement;
  }
}
