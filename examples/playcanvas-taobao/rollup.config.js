import { mergeRollupOptions } from 'platformize-playcanvas/dist-plugin';

const cfg = mergeRollupOptions(
  {
    input: ['./pages/index/index.ts'],
    treeshake: true,
    output: {
      format: 'cjs',
      dir: './',
      entryFileNames: 'pages/[name]/[name].js',
      manualChunks: {
        'tests-playcanvas': ['tests-playcanvas'],
      },
    },
  },
  { minify: process.env.BUILD === 'production' },
);

// console.log(cfg);

export default cfg;
