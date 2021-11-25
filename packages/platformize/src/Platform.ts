export interface Polyfill {
  URL: URL;
  Blob: Blob;
  window: Window;
  document: Document;
  DOMParser: DOMParser;
  TextDecoder: TextDecoder;
  XMLHttpRequest: XMLHttpRequest;
  OffscreenCanvas: OffscreenCanvas;
  HTMLCanvasElement: HTMLCanvasElement;

  atob: Window['atob'],
  createImageBitmap: Window['createImageBitmap'],
  cancelAnimationFrame: Window['cancelAnimationFrame'],
  requestAnimationFrame: Window['requestAnimationFrame'],
}

export interface Platform {
  polyfill: Polyfill;
  dispose(): void;
}