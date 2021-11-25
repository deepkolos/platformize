import * as path from 'path';
import inject from '@rollup/plugin-inject';

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

  'atob',
  'createImageBitmap',
  'cancelAnimationFrame',
  'requestAnimationFrame',
];

/**
 * 构建时把浏览器相关api映射到特定的polyfill
 * @param {Array<string>} apiList
 * @param {string} platformPath
 * @returns
 */
export function platformize(
  apiList = DEFAULT_API_LIST,
  platformManagerPath = path.resolve(__dirname, './PlatformManager'),
) {
  return inject({
    exclude: platformManagerPath,

    ...apiList.reduce((acc, curr) => {
      //@ts-ignore
      acc[curr] = [platformManagerPath, `${curr}`];
      //@ts-ignore
      acc[`self.${curr}`] = [platformManagerPath, `${curr}`];

      return acc;
    }, {}),
  });
}

export default platformize;
