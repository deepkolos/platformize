/// <reference types="wechat-miniprogram" />

import { WechatPlatform as WechatPlatformBase } from 'platformize';
import type { Polyfill } from '../Platform';

export class WechatPlatform extends WechatPlatformBase {
  polyfill!: Polyfill;

  constructor(canvas: WechatMiniprogram.Canvas, width?: number, height?: number) {
    super(canvas, width, height);
    this.polyfill.$defaultWebGLExtensions = {};
    // @ts-ignore
    this.polyfill.document.createElement = type => {
      if (type === 'canvas') return canvas;
      if (type === 'img') return canvas.createImage();
    };
    // @ts-ignore
    this.polyfill.document.body = { appendChild() {} };
    // @ts-ignore
    this.polyfill.document.head = {};
    this.polyfill.global = this.polyfill.window;

    // @ts-ignore
    canvas.setAttribute = () => {};
  }
}
