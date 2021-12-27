/// <reference types="minigame-api-typings" />

import { WechatGamePlatform as WechatGamePlatformBase } from 'platformize';
import type { Polyfill } from '../Platform';
import { createImage } from 'platformize';

export class WechatGamePlatform extends WechatGamePlatformBase {
  polyfill!: Polyfill;

  constructor(canvas: WechatMinigame.Canvas, width?: number, height?: number) {
    super(canvas, width, height);
    this.polyfill.$defaultWebGLExtensions = {};
    // @ts-ignore
    this.polyfill.document.createElement = type => {
      if (type === 'canvas') return canvas;
      // @ts-ignore
      if (type === 'img') return createImage(wxGame);
    };
    // @ts-ignore
    this.polyfill.document.body = canvas;
    // @ts-ignore
    this.polyfill.document.head = {};

    // @ts-ignore
    canvas.appendChild = () => {};
    // @ts-ignore
    canvas.setAttribute = () => {};
  }
}
