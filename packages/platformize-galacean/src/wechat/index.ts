/// <reference types="@types/wechat-miniprogram" />
/// <reference types="@types/offscreencanvas" />

import { WechatPlatform as WechatPlatformBase } from 'platformize';
import { Touch, TouchEvent } from 'platformize/dist/base/EventTarget';
import { createImage, createVideoContext } from '../base/utils/helper';
import { $FontFaceSet } from '../base/Font';
import $window from '../base/window';
import type { Polyfill } from '../Platform';

// 微信小游戏创建离屏画布api变成了createOffScreenCanvas
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

    this.polyfill.window['Blob'] = $window.Blob;
    this.polyfill.window['setTimeout'] = $window.setTimeout;
    this.polyfill.Blob = this.polyfill.window['Blob'];
    this.polyfill.OffscreenCanvas = OffscreenCanvas;

    this.polyfill.$defaultWebGLExtensions = { OES_vertex_array_object: null };
    this.polyfill.HTMLCanvasElement = canvas.constructor as unknown as HTMLCanvasElement;
    (canvas as any).focus = () => {};
  }

  dispatchTouchEvent(
    e: TouchEvent = {
      touches: [],
      changedTouches: [],
      timeStamp: 0,
      type: '',
    },
  ) {
    const target = { ...this };
    // 微信小程序type会多on
    const type = e.type.replace('on', '');
    const changedTouches = e.changedTouches.map(touch => new Touch(touch));

    const event = {
      changedTouches: changedTouches,
      touches: e.touches.map(touch => new Touch(touch)),
      targetTouches: Array.prototype.slice.call(e.touches.map(touch => new Touch(touch))),
      timeStamp: e.timeStamp,
      target: target,
      currentTarget: target,
      type,
      cancelBubble: false,
      cancelable: false,
    };

    this.canvas.dispatchEvent(event);

    if (changedTouches.length) {
      const touch = changedTouches[0];
      const pointerEvent = {
        clientX: touch.clientX,
        clientY: touch.clientY,
        pageX: touch.pageX,
        pageY: touch.pageY,
        offsetX: touch.pageX,
        offsetY: touch.pageY,
        pointerId: touch.identifier,
        // to fix oasis controls https://www.w3.org/TR/uievents/#dom-mouseevent-buttons
        buttons: 1,
        type:
          {
            touchstart: 'pointerdown',
            touchmove: 'pointermove',
            touchend: 'pointerup',
            touchcancel: 'pointercancel',
          }[type] || '',
        pointerType: 'touch',
      };

      this.canvas.dispatchEvent(pointerEvent);
      // call pointerleave if touchend after pointerup.
      if (type === 'touchend') {
        this.canvas.dispatchEvent({
          ...pointerEvent,
          type: 'pointerleave'
        });
      }
    }
  }
}
