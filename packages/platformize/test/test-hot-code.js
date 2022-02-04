const fs = require('fs');
const acorn = require('acorn');
const test = require('ava');
const path = require('path');

const { default: inject } = require('../dist-plugin/plugin-hot-code.js');

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

test('hotcode', t => {
  compare(t, 'hotcode', { mode: 'slot' });
});
