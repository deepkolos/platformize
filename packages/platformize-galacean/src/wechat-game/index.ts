/// <reference types="minigame-api-typings" />
/// <reference types="@types/offscreencanvas" />

import { WechatGamePlatform as WechatGamePlatformBase } from 'platformize';
import $Blob from '../base/Blob';
import { createImage, createVideo } from '../base/utils/helper';
import { $FontFaceSet } from '../base/Font';
import type { Polyfill } from '../Platform';

const wxGame = wx as unknown as WechatMinigame.Wx;

// 微信小程序创建离屏画布接口变成了createOffScreenCanvas
function OffscreenCanvas() {
  // @ts-ignore
  if (wxGame.createOffscreenCanvas === undefined)
  {
    return wxGame.createOffScreenCanvas();
  }
  else
  {
    return wxGame.createOffscreenCanvas();
  }
}

export class WechatGamePlatform extends WechatGamePlatformBase {
  polyfill!: Polyfill;
  private fonts: $FontFaceSet | undefined;

  constructor(canvas: WechatMinigame.Canvas, width?: number, height?: number) {
    super(canvas, width, height);
    this.polyfill.document['createElement'] = (type: string) => {
      if (type === 'canvas') return canvas;
      if (type === 'img') return createImage(wxGame);
      if (type === 'video') return createVideo(wxGame);
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
