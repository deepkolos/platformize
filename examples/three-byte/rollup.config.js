import { mergeRollupOptions } from 'platformize-three/dist-plugin';

const cfg = mergeRollupOptions(
  {
    input: ['./miniprogram/pages/index/index.ts', './miniprogram/pages/simple/simple.ts'],
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
  { minify: process.env.BUILD === 'production' },
);

// console.log(cfg);

export default cfg;
