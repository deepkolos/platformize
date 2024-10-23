import { TaobaoPlatform as TaobaoPlatformBase } from 'platformize';
import type { Polyfill } from '../Platform';

export class TaobaoPlatform extends TaobaoPlatformBase {
  declare polyfill: Polyfill;

  constructor(canvas: any, width?: number, height?: number) {
    super(canvas, width, height);
    this.polyfill.$defaultWebGLExtensions = { EXT_blend_minmax: null };
    this.polyfill.HTMLCanvasElement = canvas.constructor as unknown as HTMLCanvasElement;
  }
}
