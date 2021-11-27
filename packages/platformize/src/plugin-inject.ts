// @ts-nocheck

/**
 * feat: add deconstruction support
 * feat: add relative path support for test
 * feat: add importLocalNamePostfix & customImportLocalName support
 *
 * "default.polyfill.URL"
 * import { default: { polyfill: { URL as URL } } } from 'relative path';
 *
 * import { default as $inject_mod } from 'relative path';
 * const URL = $inject_mod.polyfill.URL;
 *
 * import { default as $inject_mod } from 'relative path';
 * $inject_mod.polyfill.URL;
 */

import * as path from 'path';
import { walk } from 'estree-walker';
import MagicString from 'magic-string';
import { attachScopes, createFilter, makeLegalIdentifier } from '@rollup/pluginutils';

export type Injectment =
  | string
  | [modName: string, importName: string]
  | [
      modName: string,
      importName: string,
      customImportLocalName: string,
      importLocalNamePostfix: string,
    ];

const sep = path.sep;

const escape = str => str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');

const isReference = (node, parent) => {
  if (node.type === 'MemberExpression') {
    return !node.computed && isReference(node.object, node);
  }

  if (node.type === 'Identifier') {
    // TODO is this right?
    if (parent.type === 'MemberExpression') return parent.computed || node === parent.object;

    // disregard the `bar` in { bar: foo }
    if (parent.type === 'Property' && node !== parent.value) return false;

    // disregard the `bar` in `class Foo { bar () {...} }`
    if (parent.type === 'MethodDefinition') return false;

    // disregard the `bar` in `export { foo as bar }`
    if (parent.type === 'ExportSpecifier' && node !== parent.local) return false;

    // disregard the `bar` in `import { bar as foo }`
    if (parent.type === 'ImportSpecifier' && node === parent.imported) {
      return false;
    }

    return true;
  }

  return false;
};

const flatten = startNode => {
  const parts = [];
  let node = startNode;

  while (node.type === 'MemberExpression') {
    parts.unshift(node.property.name);
    node = node.object;
  }

  const { name } = node;
  parts.unshift(name);

  return { name, keypath: parts.join('.') };
};

export default function inject(options) {
  if (!options) throw new Error('Missing options');

  const filter = createFilter(options.include, options.exclude);

  let { modules } = options;

  if (!modules) {
    modules = Object.assign({}, options);
    delete modules.include;
    delete modules.exclude;
    delete modules.sourceMap;
    delete modules.sourcemap;
  }

  const modulesMap = new Map(Object.entries(modules));

  // Fix paths on Windows
  if (sep !== '/') {
    modulesMap.forEach((mod, key) => {
      modulesMap.set(
        key,
        Array.isArray(mod) ? [mod[0].split(sep).join('/'), mod[1]] : mod.split(sep).join('/'),
      );
    });
  }

  const firstpass = new RegExp(`(?:${Array.from(modulesMap.keys()).map(escape).join('|')})`, 'g');
  const sourceMap = options.sourceMap !== false && options.sourcemap !== false;

  return {
    name: 'inject',

    transform(code, id) {
      if (!filter(id)) return null;
      if (code.search(firstpass) === -1) return null;

      if (sep !== '/') id = id.split(sep).join('/'); // eslint-disable-line no-param-reassign

      let ast = null;
      try {
        ast = this.parse(code);
      } catch (err) {
        console.error(id)
        console.error(err);
        this.warn({
          code: 'PARSE_ERROR',
          message: `rollup-plugin-inject: failed to parse ${id}. Consider restricting the plugin to particular files via options.include`,
        });
      }
      if (!ast) {
        return null;
      }

      const imports = new Set();
      ast.body.forEach(node => {
        if (node.type === 'ImportDeclaration') {
          node.specifiers.forEach(specifier => {
            imports.add(specifier.local.name);
          });
        }
      });

      // analyse scopes
      let scope = attachScopes(ast, 'scope');

      const magicString = new MagicString(code);

      const newImports = new Map();

      function handleReference(node, name, keypath) {
        let mod = modulesMap.get(keypath);

        if (mod && !imports.has(name) && !scope.contains(name)) {
          if (typeof mod === 'string') mod = [mod, 'default'];

          const [fromValue, importName, customImportLocalName, importLocalNamePostfix] = mod;
          // prevent module from importing itself
          if (fromValue === id) return false;

          let importLocalName =
            customImportLocalName ||
            (name === keypath ? name : makeLegalIdentifier(`$inject_${keypath}`));

          let i = 0;
          while (imports.has(importLocalName)) {
            importLocalName = importLocalName + `${i++}`;
          }

          const importCode =
            importName === '*'
              ? `* as ${importLocalName}`
              : importName.split('.').reduce((acc, curr, index, arr) => {
                  if (index !== arr.length - 1) {
                    return acc.replace('__SLOT__', `{ ${curr}: __SLOT__ }`);
                  } else {
                    return acc.replace('__SLOT__', `{ ${curr} as ${importLocalName} }`);
                  }
                }, '__SLOT__');

          const hash = `${fromValue}:${importCode}`;

          if (!newImports.has(hash)) {
            // escape apostrophes and backslashes for use in single-quoted string literal
            let modName = fromValue.replace(/[''\\]/g, '\\$&');

            if (path.isAbsolute(modName)) {
              const fileDir = path.resolve(id, '..');
              const modDir = path.resolve(modName, '..');
              const modToFilePath = path.relative(fileDir, modName);
              modName = modToFilePath;
            }

            newImports.set(hash, `import ${importCode} from '${modName}';`);
          }

          if (name !== keypath || customImportLocalName) {
            magicString.overwrite(node.start, node.end, importLocalName + mod[3], {
              storeName: true,
            });
          }

          return true;
        }

        return false;
      }

      walk(ast, {
        enter(node, parent) {
          if (sourceMap) {
            magicString.addSourcemapLocation(node.start);
            magicString.addSourcemapLocation(node.end);
          }

          if (node.scope) {
            scope = node.scope; // eslint-disable-line prefer-destructuring
          }

          // special case – shorthand properties. because node.key === node.value,
          // we can't differentiate once we've descended into the node
          if (node.type === 'Property' && node.shorthand) {
            const { name } = node.key;
            handleReference(node, name, name);
            this.skip();
            return;
          }

          if (isReference(node, parent)) {
            const { name, keypath } = flatten(node);
            const handled = handleReference(node, name, keypath);
            if (handled) {
              this.skip();
            }
          }
        },
        leave(node) {
          if (node.scope) {
            scope = scope.parent;
          }
        },
      });

      if (newImports.size === 0) {
        return {
          code,
          ast,
          map: sourceMap ? magicString.generateMap({ hires: true }) : null,
        };
      }
      const importBlock = Array.from(newImports.values()).join('\n\n');

      magicString.prepend(`${importBlock}\n\n`);

      return {
        code: magicString.toString(),
        map: sourceMap ? magicString.generateMap({ hires: true }) : null,
      };
    },
  };
}
