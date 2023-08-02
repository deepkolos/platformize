import { DEFAULT_API_LIST as DEFAULT_API_LIST_BAE, platformize } from 'platformize/dist-plugin';
import type { Plugin } from 'rollup';

type platformizeOptions = Parameters<typeof platformize>['0'];

export const DEFAULT_API_LIST = [...DEFAULT_API_LIST_BAE, '$defaultWebGLExtensions', 'fonts'];

export default function platformizeGalacean({
  apiList = DEFAULT_API_LIST,
  platformManagerPath,
}: platformizeOptions = {}): Plugin[] {
  return [patchGalacean(), ...platformize({ apiList, platformManagerPath })];
}

function patchGalacean(): Plugin {
  return {
    name: 'patchGalacean',
    transform(code, filePath) {
      if (filePath.indexOf('@galacean') > -1) {
        code = code.replace(
          `gl[_glKey] = extensionVal;`,
          `try { gl[_glKey] = extensionVal; } catch (e) { console.error(e); }`,
        );
        code = code.replace(
          `this._requireResult = {};`,
          `this._requireResult = Object.assign({}, $defaultWebGLExtensions)`,
        );

        // 开发工具补丁, 但raycast还是不灵敏, 真机没问题
        code = code.replace(/activePointerCount === 1 &&/g, `activePointerCount >= 1 && `);

        // 不适用texSubImage设置ImageSource, 微信小程序内会报错
        // code = code.replace(
          // `gl.texSubImage2D(this._target, mipLevel, x || 0, y || 0, baseFormat, dataType, imageSource);`,
          // `gl.texImage2D(this._target, mipLevel, baseFormat, baseFormat, dataType, imageSource);`,
          // 并且下面的写法会crash...
        //   `try {
        //   // 微信小程序可能报错...
        //   gl.texSubImage2D(this._target, mipLevel, x || 0, y || 0, baseFormat, dataType, imageSource);
        // } catch (e) {
        //   gl.texImage2D(this._target, mipLevel, baseFormat, baseFormat, dataType, imageSource);
        // }`,
        // );
      }
      return { code, map: null };
    },
  };
}
