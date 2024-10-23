/// <reference types="wechat-miniprogram" />

import { WechatPlatform as WechatPlatformBase } from 'platformize';
import type { Polyfill } from '../Platform';

export class WechatPlatform extends WechatPlatformBase {
  declare polyfill: Polyfill;

  constructor(canvas: WechatMiniprogram.Canvas, width?: number, height?: number) {
    super(canvas, width, height);
    this.polyfill.$defaultWebGLExtensions = {};
  }
}
