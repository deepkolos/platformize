import { Polyfill as PolyfillBase, Platform } from 'platformize';

type Polyfill = PolyfillBase & {
  $defaultWebGLExtensions: Object;
  HTMLCanvasElement: HTMLCanvasElement;
  Image: HTMLImageElement;
};

export { Polyfill, Platform };
