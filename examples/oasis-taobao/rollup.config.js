import { mergeRollupOptions } from 'platformize-oasis/dist-plugin';

const cfg = mergeRollupOptions(
  {
    input: ['./pages/index/index.ts'],
    treeshake: true,
    output: {
      format: 'cjs',
      dir: './',
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
