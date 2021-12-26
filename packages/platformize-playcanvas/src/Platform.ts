import { Polyfill as PolyfillBase, Platform } from 'platformize';

type Polyfill = PolyfillBase & { $defaultWebGLExtensions: Object, global: Object };

export { Polyfill, Platform };
