import { platformize, DEFAULT_API_LIST as DEFAULT_API_LIST_BAE } from 'platformize/dist-plugin';
import type { Plugin } from 'rollup';

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
        code = code.replaceAll(
          `'WebGL2RenderingContext' in self && gl instanceof self.WebGL2RenderingContext`,
          'false',
        );
        code = code.replace(
          `var attributes = gl.getContextAttributes();`,
          `var attributes = gl.getContextAttributes() || {};`,
        );
        code = code.replaceAll(`self.console`, `console`);
        code = code.replaceAll(`self.location`, `window.location`);
        code = code.replaceAll(`self.removeEventListener`, `window.removeEventListener`);
        code = code.replaceAll(`self.addEventListener`, `window.addEventListener`);
        code = code.replaceAll(`self.HTMLVideoElement`, `false`);
        code = code.replace(
          `function determineCrossOrigin(url$1, loc) {`,
          `function determineCrossOrigin(url$1, loc) { return '';`,
        );
        code = code.replaceAll(
          `gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)`,
          `gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS) || 1`,
        );
        code = code.replace(`function isWebGLSupported() {`,`function isWebGLSupported() {return true;`)
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
