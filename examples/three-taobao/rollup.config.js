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
  { minify: false },
);

// console.log(cfg);

export default cfg;
