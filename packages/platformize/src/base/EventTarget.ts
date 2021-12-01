const _events = new WeakMap();

interface TouchItem {
  identifier: number;
  force: number;
  pageX?: number;
  pageY?: number;
  clientX: number;
  clientY: number;
  screenX: number;
  screenY: number;
  x: number;
  y: number;
}
export interface TouchEvent {
  touches: TouchItem[];
  changedTouches: TouchItem[];
  timeStamp: number;
  type: string;
  pointerType?: string;
}

export class Touch {
  identifier: number;
  force: number;
  pageX: number;
  pageY: number;
  clientX: number;
  clientY: number;
  screenX: number;
  screenY: number;
  constructor(touch: TouchItem) {
    // CanvasTouch{identifier, x, y}
    // Touch{identifier, pageX, pageY, clientX, clientY, force}
    this.identifier = touch.identifier;

    this.force = touch.force === undefined ? 1 : touch.force;
    this.pageX = touch.pageX === undefined ? touch.x : touch.pageX;
    this.pageY = touch.pageY === undefined ? touch.y : touch.pageY;
    this.clientX = touch.clientX === undefined ? touch.x : touch.clientX;
    this.clientY = touch.clientY === undefined ? touch.y : touch.clientY;

    this.screenX = this.pageX;
    this.screenY = this.pageY;
  }
}

export default class $EventTarget {
  constructor() {
    _events.set(this, {});
  }

  addEventListener(
    type: string,
    listener: Function,
    // options: { capture?: boolean; once?: boolean; passive?: boolean } = {},
  ) {
    let events = _events.get(this);

    if (!events) {
      events = {};
      _events.set(this, events);
    }
    if (!events[type]) {
      events[type] = [];
    }
    events[type].push(listener);

    // if (options.capture) {
    //   // console.warn('EventTarget.addEventListener: options.capture is not implemented.')
    // }
    // if (options.once) {
    //   // console.warn('EventTarget.addEventListener: options.once is not implemented.')
    // }
    // if (options.passive) {
    //   // console.warn('EventTarget.addEventListener: options.passive is not implemented.')
    // }
  }

  removeEventListener(type: string, listener: Function) {
    const events = _events.get(this);

    if (events) {
      const listeners = events[type];

      if (listeners && listeners.length > 0) {
        for (let i = listeners.length; i--; i > 0) {
          if (listeners[i] === listener) {
            listeners.splice(i, 1);
            break;
          }
        }
      }
    }
  }

  dispatchEvent(
    event: { preventDefault?: Function; stopPropagation?: Function; type: string } = { type: '' },
  ) {
    if (typeof event.preventDefault !== 'function') {
      event.preventDefault = () => {};
    }
    if (typeof event.stopPropagation !== 'function') {
      event.stopPropagation = () => {};
    }

    const events = _events.get(this);

    if (events) {
      const listeners = events[event.type];

      if (listeners) {
        for (let i = 0; i < listeners.length; i++) {
          listeners[i](event);
        }
      }
    }

    // @ts-ignore
    if (typeof this[`on${event.type}`] === 'function') {
      // @ts-ignore
      this[`on${event.type}`].call(this, event);
    }
  }

  releasePointerCapture() {}
  setPointerCapture() {}
}
