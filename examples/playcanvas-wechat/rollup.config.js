import { mergeRollupOptions } from 'platformize-playcanvas/dist/plugin';

const cfg = mergeRollupOptions(
  {
    input: ['./miniprogram/pages/index/index.ts'],
    treeshake: true,
    output: {
      format: 'cjs',
      dir: 'miniprogram/',
      entryFileNames: 'pages/[name]/[name].js',
      manualChunks: {
        'tests-playcanvas': ['tests-playcanvas'],
      },
    },
  },
  { minify: false },
);

// console.log(cfg);

export default cfg;
