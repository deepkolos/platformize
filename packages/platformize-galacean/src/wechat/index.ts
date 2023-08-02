/// <reference types="@types/wechat-miniprogram" />
/// <reference types="@types/offscreencanvas" />

import { WechatPlatform as WechatPlatformBase } from 'platformize';
import $Blob from '../base/Blob';
import { createImage, createVideoContext } from '../base/utils/helper';
import { $FontFaceSet } from '../base/Font';
import type { Polyfill } from '../Platform';

// 微信小程序创建离屏画布api变成了createOffScreenCanvas
function OffscreenCanvas() {
  // @ts-ignore
  if (wx.createOffscreenCanvas === undefined)
  {
    return wx.createOffScreenCanvas();
  }
  else
  {
    return wx.createOffscreenCanvas();
  }
}

export class WechatPlatform extends WechatPlatformBase {
  polyfill!: Polyfill;
  private fonts: $FontFaceSet | undefined;

  constructor(canvas: WechatMiniprogram.Canvas, width?: number, height?: number) {
    super(canvas, width, height);
    this.polyfill.document['createElement'] = (type: string) => {
      if (type === 'canvas') return canvas;
      if (type === 'img') return createImage(wx);
      if (type === 'video') return createVideoContext(wx);
    };

    this.fonts = new $FontFaceSet();
    this.polyfill.document['fonts'] = this.fonts;

    this.polyfill.window['Blob'] = $Blob;
    this.polyfill.Blob = this.polyfill.window['Blob'];
    this.polyfill.OffscreenCanvas = OffscreenCanvas;

    this.polyfill.$defaultWebGLExtensions = { OES_vertex_array_object: null };
    this.polyfill.HTMLCanvasElement = canvas.constructor as unknown as HTMLCanvasElement;
    (canvas as any).focus = () => {};
  }
}
