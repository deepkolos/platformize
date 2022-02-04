import deepmerge from 'deepmerge';
import sucrase from '@rollup/plugin-sucrase';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import type { RollupOptions, Plugin } from 'rollup';
import platformize, { inject, Injectment, DEFAULT_API_LIST } from './plugin-platformize';
// @ts-ignore
import builtins from 'rollup-plugin-node-builtins';
import hotCode, { HotCodeProps } from './plugin-hot-code';

function mergeRollupOptions(
  rollupOptions: RollupOptions,
  cfg: {
    minify?: boolean;
    platformizePlugins?: Plugin[];
    hotcode?: HotCodeProps;
  } = {
    minify: true,
    platformizePlugins: platformize(),
  },
) {
  return deepmerge<RollupOptions>(
    {
      treeshake: true,
      plugins: [
        builtins(),
        resolve({ extensions: ['.ts', '.js'] }),
        sucrase({ transforms: ['typescript'] }),
        commonjs(),
        ...(cfg.platformizePlugins || []),
        hotCode(cfg.hotcode),
        cfg.minify ? terser({ output: { comments: false } }) : null,
      ],
      output: {
        chunkFileNames: 'chunks/[name].js',
      },
    },
    rollupOptions,
  );
}

export { platformize, mergeRollupOptions, deepmerge, inject, Injectment, DEFAULT_API_LIST };
