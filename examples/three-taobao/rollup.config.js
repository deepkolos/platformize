import { mergeRollupOptions } from 'platformize-three/dist-plugin';

const cfg = mergeRollupOptions(
  {
    input: ['./pages/index/index.ts'],
    treeshake: true,
    output: {
      format: 'cjs',
      dir: './',
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
