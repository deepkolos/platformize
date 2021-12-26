import { platformize, DEFAULT_API_LIST as DEFAULT_API_LIST_BAE } from 'platformize/dist-plugin';
import type { Plugin } from 'rollup';

type platformizeOptions = Parameters<typeof platformize>['0'];

export const DEFAULT_API_LIST = [...DEFAULT_API_LIST_BAE, '$defaultWebGLExtensions'];

export default function platformizeOasis({
  apiList = DEFAULT_API_LIST,
  platformManagerPath,
}: platformizeOptions = {}): Plugin[] {
  return [patchOasis(), ...platformize({ apiList, platformManagerPath })];
}

function patchOasis(): Plugin {
  return {
    name: 'patchOasis',
    transform(code, filePath) {
      if (filePath.indexOf('@oasis-engine') > -1) {
        code = code.replace(
          `gl[_glKey] = extensionVal;`,
          `try { gl[_glKey] = extensionVal; } catch (e) { console.error(e); }`,
        );
        code = code.replace(
          `this._requireResult = {};`,
          `this._requireResult = Object.assign({}, $defaultWebGLExtensions)`,
        );

        // 开发工具补丁, 但raycast还是不灵敏, 真机没问题
        code = code.replace(
          /activePointerCount === 1 &&/g,
          `activePointerCount >= 1 && `,
        );

      }
      return { code, map: null };
    },
  };
}
