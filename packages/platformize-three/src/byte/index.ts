import { BytePlatform as BytePlatformBase } from 'platformize';
import type { Polyfill } from '../Platform';

export class BytePlatform extends BytePlatformBase {
  declare polyfill: Polyfill;

  constructor(canvas: WechatMiniprogram.Canvas, width?: number, height?: number) {
    super(canvas, width, height);
    this.polyfill.$defaultWebGLExtensions = {};
  }
}
