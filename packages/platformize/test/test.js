const fs = require('fs');
const acorn = require('acorn');
const test = require('ava');
const path = require('path');

const { default: inject } = require('../dist-plugin/plugin-inject.js');

const modPath = path.resolve(__dirname, '../dist/PlatformManager.js');

const compare = (t, fixture, options) => {
  const filename = path.resolve(`test/fixtures/${fixture}/input.js`);
  const input = fs.readFileSync(filename, 'utf-8');
  const output = inject(options).transform.call(
    {
      parse: code =>
        acorn.parse(code, {
          sourceType: 'module',
          ecmaVersion: 9,
        }),
    },
    input,
    filename,
  );

  t.snapshot(output ? output.code : input);
};

test('relative path & customImportLocalName & importLocalNamePostfix', t => {
  compare(t, 'basic', {
    URL: {
      modName: modPath,
      importName: 'default',
      localName: 'PlatformManager',
      localNamePostfix: `.polyfill.URL`,
    },
    'self.document': {
      modName: modPath,
      importName: 'default',
      localName: 'PlatformManager',
      localNamePostfix: `.polyfill.document`,
    },
  });
});

test('deconstruction', t => {
  compare(t, 'basic', {
    URL: [modPath, 'default.polyfill.URL'],
  });
});

test('avoid same name', t => {
  compare(t, 'avoid-same-name', {
    URL: {
      modName: modPath,
      importName: 'default',
      localName: 'PlatformManager',
      localNamePostfix: `.polyfill.URL`,
    },
  });
});

test('overwrite', t => {
  compare(t, 'overwrite', {
    modA: {
      modName: modPath,
      overwrite: true,
      importName: 'Mod',
    },
  });
});
