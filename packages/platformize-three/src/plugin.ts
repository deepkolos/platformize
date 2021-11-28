import platformize, { inject } from 'platformize';
import type { Plugin } from 'rollup';
import * as path from 'path';

export default function platformizeTHREE(
  apiList?: string[],
  platformManagerPath?: string,
): Plugin[] {
  return [
    ...platformize(apiList, platformManagerPath),

    // 替换TTFLoader所使用的opentype模块
    inject({
      include: /three\/examples\/jsm\/loaders\/TTFLoader\.js$/,
      modules: {
        opentype: {
          modName: path.resolve(__dirname, './base/opentype.module.js'),
          importName: 'default',
          overwrite: true,
        },
      },
    }),
  ];
}
