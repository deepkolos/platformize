const fs = require('fs');
const path = require('path');
const os = require('os');

const acorn = require('acorn');
const test = require('ava');

const { platformize } = require('..');

const compare = (t, fixture) => {
  const filename = path.resolve(`test/fixtures/${fixture}/input.js`);
  const input = fs.readFileSync(filename, 'utf-8');
  const output = platformize().transform.call(
    {
      parse: (code) =>
        acorn.parse(code, {
          sourceType: 'module',
          ecmaVersion: 9
        })
    },
    input,
    filename
  );

  t.snapshot(output ? output.code : input);
};

test('URL', (t) => {
  compare(t, 'basic');
});
