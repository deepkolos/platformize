import { platformize, DEFAULT_API_LIST as DEFAULT_API_LIST_BAE } from 'platformize/dist-plugin';
import type { Plugin } from 'rollup';
// @ts-ignore
import replaceAll from 'string.prototype.replaceall';

type platformizeOptions = Parameters<typeof platformize>['0'];

export const DEFAULT_API_LIST = [...DEFAULT_API_LIST_BAE, '$defaultWebGLExtensions'];

export default function platformizePixi(
  { apiList = DEFAULT_API_LIST, platformManagerPath }: platformizeOptions = {},
  disableContextLost = true,
): Plugin[] {
  return [patchPixi(disableContextLost), ...platformize({ apiList, platformManagerPath })];
}

function patchPixi(disableContextLost: boolean): Plugin {
  return {
    name: 'patchPixi',
    transform(code, filePath) {
      if (filePath.indexOf('@pixi') > -1) {
        code = code.replace(`self.WebGLRenderingContext`, 'true');
        code = code.replace(
          `function createWhiteTexture() {`,
          `function createWhiteTexture() {
            return new Texture(
              new BaseTexture(
                new BufferResource(new Uint8Array(new Array(4 * 16 * 16).fill(255)), {
                  width: 16,
                  height: 16,
                }),
              ),
            );;`,
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
          `source.naturalWidth !== undefined || (source.width !== undefined && source.src)`,
        );
        code = replaceAll(code, `'ontouchstart' in self`, 'true');
        code = replaceAll(code, `'PointerEvent' in self`, `false`);
        code = replaceAll(code, `!!self.PointerEvent`, `false`);
        code = replaceAll(code, `event instanceof TouchEvent`, `event.touches !== undefined`);
        code = code.replace(`self.Promise`, `true`);
        code = replaceAll(code, `source instanceof HTMLCanvasElement`, `source.getContext`);
        code = code.replace(`'letterSpacing' in CanvasRenderingContext2D.prototype`, 'false');
        code = code.replace(`'textLetterSpacing' in CanvasRenderingContext2D.prototype;`, 'false');
        code = code.replace(
          `source = source || this.source;`,
          `source = source || this.source;
          if (source.getContext) {
            const ctx = source.getContext('2d');
            source = ctx.getImageData(0, 0, source.width, source.height);
            if (glTexture.width === width && glTexture.height === height) {
                gl.texSubImage2D(baseTexture.target, 0, 0, 0, width, height, baseTexture.format, glTexture.type, source.data);
            } else {
                glTexture.width = width;
                glTexture.height = height;
    
                gl.texImage2D(baseTexture.target, 0, glTexture.internalFormat, width, height, 0, baseTexture.format, glTexture.type, source.data);
            }
            return true;
          }`,
        );

        code = code.replace(`WebGLRenderingContext.STENCIL_TEST`, '2960');
        code = code.replace(`WebGLRenderingContext.SCISSOR_TEST`, '3089');
        code = code.replace(`!this.domElement.parentElement`, `false`);
        code = code.replace(`!this.interactionDOMElement.parentElement`, `false`);
        // disable context lost enable simulator switch cases
        if (disableContextLost)
          code = replaceAll(code, `gl.getExtension('WEBGL_lose_context')`, `null`);

        // pointerup 事件丢失 @see https://github.com/deepkolos/platformize/issues/5
        code = replaceAll(
          code,
          `var eventAppend = originalEvent.target !== this.interactionDOMElement ? 'outside' : '';`,
          ` var eventAppend = '';`,
        );

        if (filePath.match(/text(-bitmap)?\.js$/)) {
          code = code.replace(
            `// OffscreenCanvas2D measureText can be up to 40% faster.`,
            `return { getContext(){} }`,
          );
          code = code.replace(`data instanceof XMLDocument`, `data && data.isXML`);

          code = replaceAll(
            code,
            `canvas = document.createElement('canvas');`,
            `canvas = window.$canvas2D;`,
          );

          // https://github.com/deepkolos/platformize/issues/4
          code = code.replace(
            `var texture = Texture.from(canvas);`,
            `var idata = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
            var texture = Texture.fromBuffer(new Uint8Array(idata.data), canvas.width, canvas.height);`,
          );

          code = code.replace(
            `texture.orig.width = texture._frame.width - (padding * 2);`,
            `texture.baseTexture.width = texture.trim.width;
              texture.baseTexture.height = texture.trim.height;
              texture.baseTexture.resource.data = new Uint8Array(this.context.getImageData(0, 0, canvas.width, canvas.height).data);
             texture.orig.width = texture._frame.width - (padding * 2);`,
          );
        }

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
