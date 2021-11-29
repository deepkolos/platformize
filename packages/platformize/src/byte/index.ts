/// <reference types="offscreencanvas" />

import $URL from '../base/URL';
import $Blob from '../base/Blob';
import $atob from '../base/atob';
import $EventTarget, { Touch, TouchEvent } from '../base/EventTarget';
import $XMLHttpRequest from './XMLHttpRequest';
import copyProperties from '../base/utils/copyProperties';
import $DOMParser from '../base/DOMParser';
import $TextDecoder from '../base/TextDecoder';
import { Platform, Polyfill } from '../Platform';

function OffscreenCanvas() {
  // @ts-ignore
  return tt.createOffscreenCanvas();
}

export class BytePlatform extends Platform {
  polyfill: Polyfill;
  canvas: WechatMiniprogram.Canvas & $EventTarget;
  canvasW: number;
  canvasH: number;

  constructor(canvas: WechatMiniprogram.Canvas, width?: number, height?: number) {
    super();
    // @ts-ignore
    const systemInfo = tt.getSystemInfoSync();

    // @ts-ignore
    this.canvas = canvas;
    this.canvasW = width === undefined ? canvas.width : width;
    this.canvasH = height === undefined ? canvas.height : height;

    const document = {
      createElementNS(_: string, type: string) {
        if (type === 'canvas') return canvas;
        if (type === 'img') return canvas.createImage();
      },
    } as unknown as Document;

    const URL = new $URL();
    const window = {
      innerWidth: systemInfo.windowWidth,
      innerHeight: systemInfo.windowHeight,
      devicePixelRatio: systemInfo.pixelRatio,

      AudioContext: function () {},
      requestAnimationFrame: this.canvas.requestAnimationFrame,
      cancelAnimationFrame: this.canvas.cancelAnimationFrame,
      DeviceOrientationEvent: {
        requestPermission() {
          return Promise.resolve('granted');
        },
      },

      URL,
      DOMParser: $DOMParser,
      TextDecoder: $TextDecoder,
    } as unknown as Window;

    [canvas, document, window].forEach(i => {
      // @ts-ignore
      const old = i.__proto__;
      // @ts-ignore
      i.__proto__ = {};
      // @ts-ignore
      i.__proto__.__proto__ = old;
      // @ts-ignore
      copyProperties(i.__proto__, $EventTarget.prototype);
    });

    this.polyfill = {
      window,
      document,
      // @ts-expect-error
      Blob: $Blob,
      // @ts-expect-error
      DOMParser: $DOMParser,
      // @ts-expect-error
      TextDecoder: $TextDecoder,
      // @ts-expect-error
      XMLHttpRequest: $XMLHttpRequest,
      // @ts-expect-error
      OffscreenCanvas,
      // @ts-expect-error
      URL: URL,

      atob: $atob,
      createImageBitmap: undefined,
      cancelAnimationFrame: window.cancelAnimationFrame,
      requestAnimationFrame: window.requestAnimationFrame,
    };

    this.patchCanvas();
  }

  patchCanvas() {
    const { canvasH, canvasW } = this;

    Object.defineProperty(this.canvas, 'style', {
      get() {
        return {
          width: this.width + 'px',
          height: this.height + 'px',
        };
      },
    });

    Object.defineProperty(this.canvas, 'clientHeight', {
      get() {
        return canvasH || this.height;
      },
    });

    Object.defineProperty(this.canvas, 'clientWidth', {
      get() {
        return canvasW || this.width;
      },
    });

    // @ts-ignore
    this.canvas.ownerDocument = this.document;
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
    const changedTouches = e.changedTouches.map(touch => new Touch(touch));

    const event = {
      changedTouches: changedTouches,
      touches: e.touches.map(touch => new Touch(touch)),
      targetTouches: Array.prototype.slice.call(e.touches.map(touch => new Touch(touch))),
      timeStamp: e.timeStamp,
      target: target,
      currentTarget: target,
      type: e.type,
      cancelBubble: false,
      cancelable: false,
    };

    this.canvas.dispatchEvent(event);

    if (changedTouches.length) {
      const touch = changedTouches[0];
      const pointerEvent = {
        pageX: touch.pageX,
        pageY: touch.pageY,
        pointerId: touch.identifier,
        type:
          {
            touchstart: 'pointerdown',
            touchmove: 'pointermove',
            touchend: 'pointerup',
          }[e.type] || '',
        pointerType: 'touch',
      };

      this.canvas.dispatchEvent(pointerEvent);
    }
  }

  dispose() {
    // @ts-ignore
    this.canvas.dispose();
    this.canvas.width = 0;
    this.canvas.height = 0;
    // @ts-ignore
    if (this.canvas) this.canvas.ownerDocument = null;
    // @ts-ignore
    this.canvas = null;
  }
}
