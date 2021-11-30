import {
  platformize,
  inject,
  DEFAULT_API_LIST as DEFAULT_API_LIST_BAE,
} from 'platformize/dist/plugin';
import type { Plugin } from 'rollup';

type platformizeOptions = Parameters<typeof platformize>['0'];

export const DEFAULT_API_LIST = [...DEFAULT_API_LIST_BAE, '$defaultWebGLExtensions'];

export default function platformizePlayCanvas({
  apiList = DEFAULT_API_LIST,
  platformManagerPath,
}: platformizeOptions = {}): Plugin[] {
  return [
    playcanvasPatch(),
    inject({
      modules: {
        pc: ['playcanvas', '*'],
      },
    }),
    ...platformize({ apiList, platformManagerPath }),
  ];
}

function playcanvasPatch(): Plugin {
  return {
    name: 'playcanvasPatch',
    transform(code, filePath) {
      if (filePath.indexOf('playcanvas/build/playcanvas') > -1) {
        // avoid Node redeclare
        code = code.replace(`class Node`, `class Node_`);
        code = code.replace(`new Node`, `new Node_`);
        code = code.replace(`: Node,`, `: Node_,`);
        code = code.replace(`, Node,`, `, Node_ as Node,`);

        // enable animation loop
        code = code.replace(
          `frameRequest = platform.browser ? window.requestAnimationFrame(application.tick) : null;`,
          `window.requestAnimationFrame(application.tick)`,
        );

        // taobao patch & defaultWebGLExtensions
        code = code.replace(
          `original_getExtension.call(this, name);`,
          `$defaultWebGLExtensions[name] !== undefined ? $defaultWebGLExtensions[name] : (original_getExtension.call(this, name) || null);`,
        );
      }

      return {
        code: code,
        map: null,
      };
    },
  };
}
