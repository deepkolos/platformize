import sucrase from '@rollup/plugin-sucrase';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import platformize from 'platformize-three';
import builtins from 'rollup-plugin-node-builtins';
import commonjs from '@rollup/plugin-commonjs';

const plugins = [
  builtins(), // 需要放在首位
  resolve({ extensions: ['.ts', '.js'] }),
  sucrase({ transforms: ['typescript'] }),
  commonjs(),
  ...platformize(),
  terser({ output: { comments: false } }),
];

export default [
  {
    input: ['./miniprogram/pages/index/index.ts', './miniprogram/pages/index-copy/index-copy.ts'],
    treeshake: true,
    output: {
      format: 'cjs',
      dir: 'miniprogram/',
      chunkFileNames: 'chunks/[name].js',
      entryFileNames: 'pages/[name]/[name].js',
      manualChunks: {
        three: ['three'],
      },
    },
    plugins,
  },
];
