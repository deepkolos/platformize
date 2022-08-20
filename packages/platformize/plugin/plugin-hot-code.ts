/// <reference types="node" />

import { walk } from 'estree-walker';
import MagicString from 'magic-string';
import { AcornNode, Plugin } from 'rollup';
import { createHash } from 'crypto';
import { createFilter } from '@rollup/pluginutils';

export interface HotCodeProps {
  log?: any;
  mode?: 'slot' | 'remove' | 'debug';
  removeSwitch?: boolean;
  sourceMap?: boolean;
  include?: string | RegExp | ReadonlyArray<string | RegExp> | null;
  exclude?: string | RegExp | ReadonlyArray<string | RegExp> | null;
}

function getMd5(str) {
  const hash = createHash('sha256');
  hash.update(str);
  return hash.digest('hex');
}

const overwriteCfg = { storeName: true };

export default function hotCode(options: HotCodeProps = {}): Plugin | null {
  const { sourceMap = false, log = null, mode, removeSwitch = true } = options;
  if (mode !== 'slot' && mode !== 'remove' && mode !== 'debug') return null;

  const isSlotMode = mode === 'slot';
  const isRemoveMode = mode === 'remove';
  const isDebugMode = mode === 'debug';
  const filter = createFilter(options.include, options.exclude);
  const unusedOnRuntime = id => log && log[id] === undefined;

  function getInjectCode(blockId) {
    const errorCode =
      isDebugMode && unusedOnRuntime(blockId) ? `__HOTCODE__.error('${blockId}');` : '';
    return `__HOTCODE__.fire('${blockId}');${errorCode}`;
  }

  return {
    name: 'hotCode',
    transform(code, filePath) {
      if (!filter(filePath)) return null;
      if (filePath.endsWith('hot-code-mod.js')) return null;

      let ast: AcornNode | null = null;
      try {
        ast = this.parse(code);
      } catch (err) {
        this.warn({
          code: 'PARSE_ERROR',
          message: `rollup-plugin-hotCode: failed to parse ${filePath}.`,
        });
      }
      if (!ast) return null;

      let fileBlockId = 0;
      const fileId = getMd5(filePath).slice(0, 8);
      const getBlockId = () => `${fileId}-${fileBlockId++}`;

      const magicString = new MagicString(code);
      magicString.prepend(`import __HOTCODE__ from '${__dirname}/hot-code-mod';\n`);

      function injectWithBrackets(node, removeFN?: (node: any) => void) {
        if (node && node.start !== undefined && node.start != node.end) {
          const blockId = getBlockId();
          const fireCode = getInjectCode(blockId);

          if (node.type === 'BlockStatement') {
            if (isSlotMode || isDebugMode) magicString.prependRight(node.start + 1, fireCode);
            else if (isRemoveMode && unusedOnRuntime(blockId)) {
              magicString.overwrite(node.start, node.end, '{}', overwriteCfg);
            }
          } else if (node.type === 'VariableDeclaration') {
            if (isSlotMode || isDebugMode) {
              magicString.prependLeft(node.start, fireCode);
            } else if (isRemoveMode && unusedOnRuntime(blockId)) {
              if (removeFN) removeFN(node);
            }
          } else {
            if (isSlotMode || isDebugMode) {
              magicString.prependLeft(node.start, '{' + fireCode);
              magicString.prependRight(node.end, '}');
            } else if (isRemoveMode && unusedOnRuntime(blockId))
              if (removeFN) removeFN(node);
              else magicString.overwrite(node.start, node.end, '{}', overwriteCfg);
          }
        }
      }

      function injectWithCommas(node, removeFN?: (node: any) => void) {
        if (node && node.start !== undefined && node.start != node.end) {
          const blockId = getBlockId();
          const fireCode = getInjectCode(blockId).replace(/;/g, ',');

          if (isSlotMode || isDebugMode) {
            magicString.prependLeft(node.start, '(' + fireCode);
            magicString.prependRight(node.end, ')');
          } else if (isRemoveMode && unusedOnRuntime(blockId)) {
            if (removeFN) removeFN(node);
            else magicString.overwrite(node.start, node.end, '0', overwriteCfg);
          }
        }
      }

      walk(ast, {
        leave(node, parent) {
          if (sourceMap && node.start !== undefined) {
            magicString.addSourcemapLocation(node.start);
            magicString.addSourcemapLocation(node.end);
          }

          switch (node.type) {
            case 'ArrowFunctionExpression':
              node.expression ? injectWithCommas(node.body) : injectWithBrackets(node.body);
              break;
            case 'FunctionDeclaration':
            case 'FunctionExpression':
              // 两种避免IIFE未被rollup treeshaking处理方式, 一种是不处理, 一种是返回空对象
              // 但是经过测试体积一样, 先选择不处理, 更加通用
              if (!(parent && parent.type === 'CallExpression' && parent.callee === node))
                injectWithBrackets(node.body);

              // let removeIIFE = undefined;
              // if (parent && parent.type === 'CallExpression' && parent.callee === node)
              //   removeIIFE = node => {
              //     magicString.overwrite(node.start, node.end, '{return {}}', overwriteCfg);
              //   };
              // injectWithBrackets(node.body, undefined, removeIIFE);
              break;
            case 'IfStatement':
              injectWithBrackets(node.consequent);
              injectWithBrackets(node.alternate);
              break;
            case 'SwitchStatement':
              if (removeSwitch)
                node.cases.forEach(i => {
                  injectWithBrackets(i.consequent[0], node => {
                    magicString.prependLeft(node.start, 'break;');
                  });
                });
              break;
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
