import sucrase from '@rollup/plugin-sucrase';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from "rollup-plugin-terser";
import commonjs from '@rollup/plugin-commonjs';
import platformize from 'platformize'

const plugins = [
  resolve({ extensions: ['.ts', '.js'] }),
  commonjs(),
  sucrase({ transforms: ['typescript'] }),
  platformize(),
  // terser({ output: { comments: false } }),
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
        'three': ['three'],
      }
    },
    plugins
  },
]