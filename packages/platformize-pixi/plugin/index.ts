import platformize, { DEFAULT_API_LIST } from './plugin-platformize';
import {
  mergeRollupOptions as mergeRollupOptionsBase,
  deepmerge,
  inject,
  Injectment,
} from 'platformize/dist-plugin';
import { RollupOptions } from 'rollup';

type mergeRollupOptionsBaseCfg = Parameters<typeof mergeRollupOptionsBase>['1'];

const mergeRollupOptions = (rollupOptions: RollupOptions, cfg: mergeRollupOptionsBaseCfg) => {
  return mergeRollupOptionsBase(
    deepmerge<RollupOptions>(
      {
        output: {
          manualChunks: {
            // pixi: [
            //   '@pixi/constants',
            //   '@pixi/core',
            //   '@pixi/math',
            //   '@pixi/runner',
            //   '@pixi/settings',
            //   '@pixi/ticker',
            //   '@pixi/utils',
            // ],
          },
        },
      },
      rollupOptions,
    ),
    { minify: true, platformizePlugins: platformize(), ...cfg },
  );
};

export { platformize, mergeRollupOptions, deepmerge, inject, Injectment, DEFAULT_API_LIST };
