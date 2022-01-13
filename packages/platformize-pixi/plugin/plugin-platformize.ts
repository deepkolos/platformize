import { platformize, DEFAULT_API_LIST as DEFAULT_API_LIST_BAE } from 'platformize/dist-plugin';
import type { Plugin } from 'rollup';
import replaceAll from 'string.prototype.replaceall';

type platformizeOptions = Parameters<typeof platformize>['0'];

export const DEFAULT_API_LIST = [...DEFAULT_API_LIST_BAE, '$defaultWebGLExtensions'];

export default function platformizeOasis({
  apiList = DEFAULT_API_LIST,
  platformManagerPath,
}: platformizeOptions = {}): Plugin[] {
  return [patchPixi(), ...platformize({ apiList, platformManagerPath })];
}

function patchPixi(): Plugin {
  return {
    name: 'patchPixi',
    transform(code, filePath) {
      if (filePath.indexOf('@pixi') > -1) {
        code = code.replace(`self.WebGLRenderingContext`, 'true');
        code = code.replace(
          `function createWhiteTexture() {`,
          `function createWhiteTexture() {return new Texture(new BaseTexture());`,
        );
        code = replaceAll(
          code,
          `'WebGL2RenderingContext' in self && gl instanceof self.WebGL2RenderingContext`,
          'false',
        );
        code = code.replace(
          `var attributes = gl.getContextAttributes();`,
          `var attributes = gl.getContextAttributes() || {};`,
        );
        code = replaceAll(code, `self.console`, `console`);
        code = replaceAll(code, `self.location`, `window.location`);
        code = replaceAll(code, `self.removeEventListener`, `window.removeEventListener`);
        code = replaceAll(code, `self.addEventListener`, `window.addEventListener`);
        code = replaceAll(code, `self.HTMLVideoElement`, `false`);
        code = replaceAll(code, `self.XDomainRequest`, `false`);
        code = code.replace(
          `function determineCrossOrigin(url$1, loc) {`,
          `function determineCrossOrigin(url$1, loc) { return '';`,
        );
        code = replaceAll(
          code,
          `gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)`,
          `gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS) || 1`,
        );
        code = code.replace(
          `function isWebGLSupported() {`,
          `function isWebGLSupported() {return true;`,
        );
        code = replaceAll(code, 'self.origin', "''");
        code = replaceAll(
          code,
          `source instanceof HTMLImageElement`,
          `source.naturalWidth !== undefined`,
        );
        code = replaceAll(code, `'ontouchstart' in self`, 'true');
        code = replaceAll(code, `'PointerEvent' in self`, `false`);
        code = replaceAll(code, `!!self.PointerEvent`, `false`);
        code = replaceAll(code, `event instanceof TouchEvent`, `event.touches !== undefined`);

        if (filePath.indexOf('loader') > -1) {
          code = code.replace(`var Url = self.URL || self.webkitURL;`, ``);
          code = code.replace(`Url.revokeObjectURL`, `URL.revokeObjectURL`);
          code = code.replace(`Url.createObjectURL`, `URL.createObjectURL`);
          code = code.replace(
            `_determineCrossOrigin = function (url, loc) {`,
            `_determineCrossOrigin = function (url, loc) { return '';`,
          );
        }
      }

      if (filePath.indexOf('process-es6') > -1) {
        code = code.replace(`typeof global.setTimeout === 'function'`, 'true');
        code = code.replace(`typeof global.clearTimeout === 'function'`, 'true');
        code = code.replace(`global.performance`, 'false');
      }
      return { code, map: null };
    },
  };
}
