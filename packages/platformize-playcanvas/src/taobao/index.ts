import { TaobaoPlatform as TaobaoPlatformBase } from 'platformize';
import type { Polyfill } from '../Platform';

export class TaobaoPlatform extends TaobaoPlatformBase {
  polyfill!: Polyfill;

  constructor(canvas: any, width?: number, height?: number) {
    super(canvas, width, height);
    this.polyfill.$defaultWebGLExtensions = { EXT_blend_minmax: null };
    // @ts-ignore
    this.polyfill.document.createElement = type => {
      if (type === 'canvas') return canvas;
      if (type === 'img') return canvas.createImage();
    };
    // @ts-ignore
    this.polyfill.document.body = { appendChild() {} };
    // @ts-ignore
    this.polyfill.document.head = {};

    // @ts-ignore
    canvas.setAttribute = () => {};
  }
}
