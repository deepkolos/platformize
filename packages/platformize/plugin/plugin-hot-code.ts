/// <reference types="node" />

import { walk } from 'estree-walker';
import MagicString from 'magic-string';
import { AcornNode, Plugin } from 'rollup';
import { createHash } from 'crypto';

export interface HotCodeProps {
  log?: any;
  mode?: 'slot' | 'remove';
  sourceMap?: boolean;
}

function getMd5(str) {
  const hash = createHash('sha256');
  hash.update(str);
  return hash.digest('hex');
}

export default function hotCode(options: HotCodeProps = { sourceMap: false, log: null }): Plugin {
  const { sourceMap, log, mode } = options;
  if (mode !== 'slot' && mode !== 'remove') return null;

  const isSlotMode = mode === 'slot';
  const isRemoveMode = mode === 'remove';
  const unusedOnRuntime = id => isRemoveMode && log && log[id] === undefined;

  function getInjectCode(blockId) {
    const errorCode = unusedOnRuntime(blockId) ? `__HOTCODE__.error('${blockId}');` : '';
    return `__HOTCODE__.fire('${blockId}');${errorCode}`;
  }

  return {
    name: 'hotCode',
    transform(code, filePath) {
      const fileId = getMd5(filePath).slice(0, 8);
      let fileBlockId = 0;
      function getBlockId() {
        return `${fileId}-${fileBlockId++}`;
      }

      let ast: AcornNode = null;
      try {
        ast = this.parse(code);
      } catch (err) {
        this.warn({
          code: 'PARSE_ERROR',
          message: `rollup-plugin-hotCode: failed to parse ${filePath}.`,
        });
      }
      if (!ast) return null;
      if (filePath.endsWith('hot-code-mod.js')) return { code };

      const magicString = new MagicString(code);
      magicString.prepend(`import __HOTCODE__ from '${__dirname}/hot-code-mod';\n`);

      function injectWithBrackets(node, postFireCode = '', removeFN?: () => void) {
        if (node.start != node.end) {
          const blockId = getBlockId();
          const fireCode = getInjectCode(blockId);

          if (node.type === 'BlockStatement') {
            const raw = code.slice(node.start, node.end);
            let content = '{' + fireCode + raw.slice(1);

            if (unusedOnRuntime(blockId)) content = '{}';
            magicString.overwrite(node.start, node.end, content, {
              storeName: true,
            });
          } else {
            if (isSlotMode) {
              magicString.prependLeft(node.start, '{' + fireCode + postFireCode);
              magicString.prependRight(node.end, '}');
            } else if (unusedOnRuntime(blockId))
              if (removeFN) removeFN();
              else
                magicString.overwrite(node.start, node.end, '{}', {
                  storeName: true,
                });
          }

          return blockId;
        }
      }

      walk(ast, {
        enter(node) {
          if (sourceMap) {
            magicString.addSourcemapLocation(node.start);
            magicString.addSourcemapLocation(node.end);
          }
          if (node.type === 'ArrowFunctionExpression') {
            injectWithBrackets(node.body, 'return ');
            this.skip();
          } else if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') {
            injectWithBrackets(node.body);
            this.skip();
          } else if (node.type === 'IfStatement') {
            injectWithBrackets(node.consequent);
            if (node.alternate) injectWithBrackets(node.alternate);
            this.skip();
          } else if (node.type === 'SwitchStatement') {
            node.cases.forEach(i => {
              injectWithBrackets(i.consequent[0], '', () => {
                magicString.prependLeft(i.consequent[0].start, 'break;');
              });
            });
            this.skip();
          }
        },
      });

      return {
        code: magicString.toString(),
        map: sourceMap ? magicString.generateMap({ hires: true }) : null,
      };
    },
  };
}
