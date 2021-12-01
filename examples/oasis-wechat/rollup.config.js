import { mergeRollupOptions } from 'platformize-oasis/dist/plugin';

const cfg = mergeRollupOptions(
  {
    input: ['./miniprogram/pages/index/index.ts'],
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
  { minify: false },
);

// console.log(cfg);

export default cfg;
