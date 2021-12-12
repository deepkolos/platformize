/// <reference types="minigame-api-typings" />
/// <reference types="offscreencanvas" />

import $URL from '../base/URL';
import $Blob from '../base/Blob';
import $atob from '../base/atob';
import $EventTarget, { Touch, TouchEvent } from '../base/EventTarget';
import $XMLHttpRequest from '../wechat/XMLHttpRequest';
import { copyProperties, createImage } from '../base/utils/helper';
import $DOMParser from '../base/DOMParser';
import $TextDecoder from '../base/TextDecoder';
import { Platform, Polyfill } from '../Platform';

const wxGame = wx as unknown as WechatMinigame.Wx;

function OffscreenCanvas() {
  // @ts-ignore
  return wxGame.createOffscreenCanvas();
}

export class WechatGamePlatform extends Platform {
  polyfill: Polyfill;
  canvas: WechatMinigame.Canvas & $EventTarget;
  canvasW: number;
  canvasH: number;
  onDeviceMotionChange: (e: any) => void;
  enabledDeviceMotion: boolean = false;

  constructor(canvas: WechatMinigame.Canvas, width?: number, height?: number) {
    super();
    const systemInfo = wxGame.getSystemInfoSync();
    const isAndroid = systemInfo.platform === 'android';

    // @ts-ignore
    this.canvas = canvas;
    this.canvasW = width === undefined ? canvas.width : width;
    this.canvasH = height === undefined ? canvas.height : height;

    const document = {
      createElementNS(_: string, type: string) {
        if (type === 'canvas') return canvas;
        if (type === 'img') return createImage(wxGame);
      },
    } as unknown as Document;

    const Image = (() => createImage(wxGame)) as unknown as HTMLImageElement;
    const URL = new $URL();
    const window = {
      innerWidth: systemInfo.windowWidth,
      innerHeight: systemInfo.windowHeight,
      devicePixelRatio: systemInfo.pixelRatio,

      AudioContext: function () {},
      requestAnimationFrame: requestAnimationFrame,
      cancelAnimationFrame: cancelAnimationFrame,
      DeviceOrientationEvent: {
        requestPermission() {
          return Promise.resolve('granted');
        },
      },

      URL,
      Image,
      DOMParser: $DOMParser,
      TextDecoder: $TextDecoder,
      performance,
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
      performance,

      atob: $atob,
      createImageBitmap: undefined,
      cancelAnimationFrame: window.cancelAnimationFrame,
      requestAnimationFrame: window.requestAnimationFrame,
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

    const dispatchEvent = (e: any) => this.dispatchTouchEvent(e);
    wxGame.onTouchMove(dispatchEvent);
    wxGame.onTouchStart(dispatchEvent);
    wxGame.onTouchEnd(dispatchEvent);
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
  }

  // 某些情况下IOS会不success不触发。。。
  patchXHR() {
    $XMLHttpRequest.useFetchPatch = true;
    return this;
  }

  enableDeviceOrientation(interval: WechatMinigame.StartDeviceMotionListeningOption['interval']) {
    return new Promise((resolve, reject) => {
      wxGame.onDeviceMotionChange(this.onDeviceMotionChange);
      wxGame.startDeviceMotionListening({
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
      wxGame.offDeviceMotionChange(this.onDeviceMotionChange);

      this.enabledDeviceMotion &&
        wxGame.stopDeviceMotionListening({
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
    // 这一行总觉得有问题
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
