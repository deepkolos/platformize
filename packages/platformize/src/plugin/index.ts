import path from 'path';
import inject from '@rollup/plugin-inject';

export const DEFAULT_API_LIST = [
  'URL',
  'atob',
  'Blob',
  'window',
  'document',
  'DOMParser',
  'TextDecoder',
  'XMLHttpRequest',
  'OffscreenCanvas',
  'HTMLCanvasElement',
  'createImageBitmap',
  'requestAnimationFrame',
];

/**
 * 构建时把浏览器相关api映射到特定的polyfill
 * @param {Array<string>} apiList
 * @param {*} platformPath
 * @returns
 */
export function platformize(
  apiList = DEFAULT_API_LIST,
  platformPath = path.resolve(__dirname, './Platform').replaceAll('\\', '\\\\'),
) {
  return inject({
    exclude: /src\/platforms/,

    'self.URL': [platformPath, '$URL'],
    ...apiList.reduce((acc, curr) => {
      //@ts-ignore
      acc[curr] = [platformPath, `$${curr}`];
      return acc;
    }, {}),
  });
}

export default platformize;
