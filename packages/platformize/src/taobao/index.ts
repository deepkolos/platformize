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

declare global {
  const my: any;
}

function OffscreenCanvas() {
  return my.createOffscreenCanvas();
}

const radianToDegree = 180 / Math.PI;

export class TaobaoPlatform extends Platform {
  polyfill: Polyfill;
  canvas: WechatMiniprogram.Canvas & $EventTarget;
  canvasW: number;
  canvasH: number;
  onDeviceMotionChange: (e: any) => void;
  enabledDeviceMotion: boolean = false;

  constructor(canvas: WechatMiniprogram.Canvas, width?: number, height?: number) {
    super();
    const systemInfo = my.getSystemInfoSync();

    // @ts-ignore
    this.canvas = canvas;
    this.canvasW = width === undefined ? canvas.width : width;
    this.canvasH = height === undefined ? canvas.height : height;

    const document = {
      createElementNS(_: string, type: string) {
        if (type === 'canvas') return canvas;
        if (type === 'img') return createImage(canvas);
      },
      createElement(type: string) {
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
      requestAnimationFrame: (cb: () => void) => this.canvas.requestAnimationFrame(cb),
      cancelAnimationFrame: (cb: number) => this.canvas.cancelAnimationFrame(cb),
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
      global: window,
      performance: $performance,
      createImageBitmap: undefined,
      cancelAnimationFrame: window.cancelAnimationFrame,
      requestAnimationFrame: window.requestAnimationFrame,
    };

    this.patchCanvas();
    this.onDeviceMotionChange = e => {
      window.dispatchEvent({
        type: 'deviceorientation',
        // @ts-ignore
        alpha: e.alpha * radianToDegree,
        beta: -e.beta * radianToDegree,
        gamma: e.gamma * radianToDegree,
      });
    };
  }

  patchCanvas() {
    const { canvasH, canvasW, canvas } = this;

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
    canvas.getBoundingClientRect = () => this.canvasRect;
    // 反馈影响模拟器运行了 https://github.com/deepkolos/platformize/issues/8 
    // // @ts-ignore
    // canvas._getContext = this.canvas.getContext;
    // canvas.getContext = function getContext() {
    //   if (arguments[0] !== 'webgl') return null;
    //   // @ts-ignore
    //   return canvas._getContext(...arguments);
    // };
  }

  enableDeviceOrientation() {
    my.onDeviceMotionChange(this.onDeviceMotionChange);
  }

  disableDeviceOrientation() {
    my.offDeviceMotionChange(this.onDeviceMotionChange);
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
    const touches = e.touches.map(touch => new Touch(touch));
    const event = {
      changedTouches,
      touches,
      targetTouches: Array.prototype.slice.call(touches),
      timeStamp: e.timeStamp,
      target: target,
      currentTarget: target,
      type: e.type.toLowerCase(),
      cancelBubble: false,
      cancelable: false,
    };

    this.canvas.dispatchEvent(event);

    if (changedTouches.length) {
      const touch = changedTouches[0];
      const pointerEvent = {
        pageX: touch.pageX,
        pageY: touch.pageY,
        offsetX: touch.pageX,
        offsetY: touch.pageY,
        pointerId: (touch.identifier || 0) + 2,
        // to fix oasis controls https://www.w3.org/TR/uievents/#dom-mouseevent-buttons
        buttons: 1,
        type:
          {
            touchstart: 'pointerdown',
            touchmove: 'pointermove',
            touchend: 'pointerup',
          }[event.type] || '',
        pointerType: 'touch',
      };

      this.canvas.dispatchEvent(pointerEvent);
      if (e.type === 'touchend') this.canvas.dispatchEvent({ ...pointerEvent, type: 'pointerout' });
    }
  }

  setURLModifier(fn: (url: string) => string) {
    $XMLHttpRequest.URLModifier = fn;
  }

  dispose() {
    this.disableDeviceOrientation();
    // 缓解ios内存泄漏, 前后进出页面多几次，降低pixelRatio也可行
    this.canvas.width = 0;
    this.canvas.height = 0;
    // @ts-ignore
    this.onDeviceMotionChange = null;
    // @ts-ignore
    this.canvas = null;
  }
}
