import { mergeRollupOptions } from 'platformize-three/dist/plugin';

const cfg = mergeRollupOptions(
  {
    input: ['./miniprogram/pages/index/index.ts', './miniprogram/pages/index-copy/index-copy.ts'],
    treeshake: true,
    output: {
      format: 'cjs',
      dir: 'miniprogram/',
      entryFileNames: 'pages/[name]/[name].js',
      manualChunks: {
        'tests-three': ['tests-three'],
      },
    },
  },
  { minify: false },
);

// console.log(cfg);

export default cfg;
