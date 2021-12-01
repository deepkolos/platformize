import {
  platformize,
  inject,
  DEFAULT_API_LIST as DEFAULT_API_LIST_BAE,
} from 'platformize/dist-plugin';
import type { Plugin } from 'rollup';
import * as path from 'path';

type platformizeOptions = Parameters<typeof platformize>['0'];

export const DEFAULT_API_LIST = [...DEFAULT_API_LIST_BAE, '$defaultWebGLExtensions'];

export default function platformizeTHREE({
  apiList = DEFAULT_API_LIST,
  platformManagerPath,
}: platformizeOptions = {}): Plugin[] {
  return [
    defaultWebGLExtensionsOverwrite(),

    // 替换TTFLoader所使用的opentype模块
    inject({
      include: /three\/examples\/jsm\/loaders\/TTFLoader\.js$/,
      modules: {
        opentype: {
          modName: path.resolve(__dirname, '../dist/base/opentype.module.js'),
          importName: 'default',
          overwrite: true,
        },
      },
    }),

    ...platformize({ apiList, platformManagerPath }),
  ];
}

const searchConst = `function WebGLExtensions( gl ) {

	const extensions = {};`;
const searchVar = `function WebGLExtensions( gl ) {

	const extensions = {};`;

function defaultWebGLExtensionsOverwrite(): Plugin {
  return {
    name: 'defaultWebGLExtensionsOverwrite',
    transform(code, filePath) {
      if (filePath.endsWith('three.module.js')) {
        // 这种替换的方式可能不太靠谱, 属于补丁
        code = code.replace(
          searchConst,
          `function WebGLExtensions( gl ) {

  const extensions = Object.assign( {}, $defaultWebGLExtensions );`,
        );
        code = code.replace(
          searchVar,
          `function WebGLExtensions( gl ) {

  var extensions = Object.assign( {}, $defaultWebGLExtensions );`,
        );
        // 淘宝小程序ios下对于不支持的扩展返回undefined
        code = code.replace(
          `const extension = getExtension( name );`,
          `const extension = getExtension( name ) || null;`,
        );
      }

      return {
        code: code,
        map: null,
      };
    },
  };
}
