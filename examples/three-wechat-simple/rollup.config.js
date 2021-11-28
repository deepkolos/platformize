import sucrase from '@rollup/plugin-sucrase';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from "rollup-plugin-terser";
import commonjs from '@rollup/plugin-commonjs';
import platformize from 'platformize-three'

const plugins = [
  resolve({ extensions: ['.ts', '.js'] }),
  sucrase({ transforms: ['typescript'] }),
  commonjs(),
  ...platformize(),
  // terser(),
]

export default [
  {
    input: ['./miniprogram/pages/index/index.ts'],
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