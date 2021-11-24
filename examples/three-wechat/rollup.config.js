import sucrase from '@rollup/plugin-sucrase';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from "rollup-plugin-terser";
import commonjs from '@rollup/plugin-commonjs';

const production = !process.env.ROLLUP_WATCH;

const plugins = [
  resolve({ extensions: ['.ts', '.js'] }),
  commonjs(),
  sucrase({ transforms: ['typescript'] }),
  terser({ output: { comments: false } }),
]

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
        'three-platformize': ['three-platformize']
      }
    },
    plugins
  },
]