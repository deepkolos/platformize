import { Polyfill as PolyfillBase, Platform } from 'platformize';

type Polyfill = PolyfillBase & { $defaultWebGLExtensions: Object };

export { Polyfill, Platform };
