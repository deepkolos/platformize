/// <reference types="offscreencanvas" />

import $URL from '../base/URL';
import $Blob from '../base/Blob';
import $atob from '../base/atob';
import $EventTarget, { Touch, TouchEvent } from '../base/EventTarget';
import $XMLHttpRequest from './XMLHttpRequest';
import { copyProperties, createImage } from '../base/utils/helper';
import $DOMParser from '../base/DOMParser';
import $TextDecoder from '../base/TextDecoder';
import $performance from '../base/performance';
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
  touchState: boolean[] = [];

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
        if (type === 'img') return createImage(canvas);
      },
    } as unknown as Document;

    const Image = (() => createImage(canvas)) as unknown as HTMLImageElement;
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
      Image,
      DOMParser: $DOMParser,
      TextDecoder: $TextDecoder,
      performance: $performance,
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
      URL,
      Image,

      atob: $atob,
      performance: $performance,
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

  // 字节小程序changedTouches与web不一致...
  dispatchTouchEvent(
    e: TouchEvent = {
      touches: [],
      changedTouches: [],
      timeStamp: 0,
      type: '',
    },
  ) {
    const target = { ...this };
    let changedTouches = e.changedTouches.map(touch => new Touch(touch));
    const touches = e.touches.map(touch => new Touch(touch));

    const event = {
      changedTouches,
      touches,
      targetTouches: touches,
      timeStamp: e.timeStamp,
      target: target,
      currentTarget: target,
      type: e.type,
      cancelBubble: false,
      cancelable: false,
    };

    if (e.type === 'touchstart')
      for (let i = 0; i < touches.length; i++) this.touchState[touches[i].identifier] = true;

    if (e.type === 'touchend') {
      for (let i = 0; i < changedTouches.length; i++)
        this.touchState[changedTouches[i].identifier] = false;

      if (!changedTouches.length) {
        touches[0].identifier = this.touchState.findIndex(i => i);
        changedTouches = touches;
      }
    }

    this.canvas.dispatchEvent(event);
    if (changedTouches.length)
      for (let i = changedTouches.length - 1; i >= 0; i--)
        this.dispatchPointerEvent(e, changedTouches[i]);
  }

  private dispatchPointerEvent(e: TouchEvent, touch: Touch) {
    const pointerEvent = {
      pageX: touch.pageX,
      pageY: touch.pageY,
      offsetX: touch.pageX,
      offsetY: touch.pageY,
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
