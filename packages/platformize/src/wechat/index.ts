/// <reference types="@types/wechat-miniprogram" />
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
  return wx.createOffscreenCanvas();
}

export class WechatPlatform extends Platform {
  polyfill: Polyfill;
  canvas: WechatMiniprogram.Canvas & $EventTarget;
  canvasW: number;
  canvasH: number;
  onDeviceMotionChange: (e: any) => void;
  enabledDeviceMotion: boolean = false;
  public canvasRect = {
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  constructor(canvas: WechatMiniprogram.Canvas, width?: number, height?: number) {
    super();
    const systemInfo = wx.getSystemInfoSync();
    const isAndroid = systemInfo.platform === 'android';

    // @ts-ignore
    this.canvas = canvas;
    this.canvasW = width === undefined ? canvas.width : width;
    this.canvasH = height === undefined ? canvas.height : height;
    this.canvasRect.width = this.canvasW;
    this.canvasRect.height = this.canvasH;

    const document = {
      createElementNS(_: string, type: string) {
        if (type === 'canvas') return canvas;
        if (type === 'img') return createImage(canvas);
      },
      body: {},
    } as unknown as Document;
    const img = createImage(canvas);

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
      Blob: $Blob,
      performance: $performance,
    } as unknown as Window;

    [canvas, document, window, document.body].forEach(i => {
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
      HTMLImageElement: img.constructor,

      atob: $atob,
      createImageBitmap: undefined,
      cancelAnimationFrame: window.cancelAnimationFrame,
      requestAnimationFrame: window.requestAnimationFrame,
      performance: window.performance,
    };

    this.patchCanvas();
    this.onDeviceMotionChange = e => {
      e.type = 'deviceorientation';
      if (isAndroid) {
        e.alpha *= -1;
        e.beta *= -1;
        e.gamma *= -1;
      }
      window.dispatchEvent(e);
    };
  }

  private patchCanvas() {
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
    canvas.ownerDocument = this.document;
    // @ts-ignore
    canvas.getBoundingClientRect = () => this.canvasRect;
    // @ts-ignore
    canvas._getContext = this.canvas.getContext;
    canvas.getContext = function getContext() {
      if (arguments[0] !== 'webgl') return null;
      // @ts-ignore
      return canvas._getContext(...arguments);
    };
  }

  // 某些情况下IOS会不success不触发。。。
  patchXHR() {
    $XMLHttpRequest.useFetchPatch = true;
    return this;
  }

  enableDeviceOrientation(
    interval: WechatMiniprogram.StartDeviceMotionListeningOption['interval'],
  ) {
    return new Promise((resolve, reject) => {
      wx.onDeviceMotionChange(this.onDeviceMotionChange);
      wx.startDeviceMotionListening({
        interval,
        success: e => {
          resolve(e);
          this.enabledDeviceMotion = true;
        },
        fail: reject,
      });
    });
  }

  disableDeviceOrientation() {
    return new Promise((resolve, reject) => {
      wx.offDeviceMotionChange(this.onDeviceMotionChange);

      this.enabledDeviceMotion &&
        wx.stopDeviceMotionListening({
          success: () => {
            resolve(true);
            this.enabledDeviceMotion = false;
          },
          fail: reject,
        });
    });
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
  }

  dispose() {
    this.disableDeviceOrientation();
    // 缓解ios内存泄漏, 前后进出页面多几次，降低pixelRatio也可行
    this.canvas.width = 0;
    this.canvas.height = 0;
    // @ts-ignore
    if (this.canvas) this.canvas.ownerDocument = null;
    // @ts-ignore
    this.onDeviceMotionChange = null;
    // @ts-ignore
    this.canvas = null;
  }
}
