import { mergeRollupOptions } from 'platformize-oasis/dist-plugin';

const cfg = mergeRollupOptions(
  {
    input: ['./miniprogram/pages/index/index.ts', './miniprogram/pages/simple/simple.ts'],
    treeshake: true,
    output: {
      format: 'cjs',
      dir: 'miniprogram/',
      entryFileNames: 'pages/[name]/[name].js',
      manualChunks: {
        'tests-oasis': ['tests-oasis'],
      },
    },
  },
  { minify: process.env.BUILD === 'production' },
);

// console.log(cfg);

export default cfg;
