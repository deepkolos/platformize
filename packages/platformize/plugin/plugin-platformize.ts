/// <reference types="node" />

import * as path from 'path';
import inject, { Injectment } from './plugin-inject';
import type { Plugin } from 'rollup';

export const DEFAULT_API_LIST = [
  'URL',
  'Blob',
  'window',
  'document',
  'DOMParser',
  'TextDecoder',
  'XMLHttpRequest',
  'OffscreenCanvas',
  'HTMLCanvasElement',
  'Image',

  'atob',
  'performance',
  'createImageBitmap',
  'cancelAnimationFrame',
  'requestAnimationFrame',
];

/**
 * 构建时把浏览器相关api映射到特定的polyfill
 */
export default function platformize({
  apiList = DEFAULT_API_LIST,
  platformManagerPath = path.resolve(__dirname, '../dist/PlatformManager'), // 相对于构建产物目录
} = {}): Plugin[] {
  return [
    inject({
      exclude: /platformize\/dist\/(wechat-game|wechat|taobao|byte)/,
      modules: apiList.reduce((acc, curr) => {
        const injectSetting: Injectment = {
          modName: platformManagerPath,
          importName: 'default',
          localName: 'PlatformManager',
          localNamePostfix: `.polyfill.${curr}`,
        };

        acc[curr] = injectSetting;
        acc[`self.${curr}`] = injectSetting;

        return acc;
      }, {} as { [k: string]: Injectment }),
    }),
  ];
}

export { inject, Injectment };
