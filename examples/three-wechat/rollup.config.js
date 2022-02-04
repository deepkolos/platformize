import { mergeRollupOptions } from 'platformize-three/dist-plugin';
import firelog from './firelog.json';

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
  {
    minify: process.env.BUILD === 'production',
    hotcode: { log: firelog, mode: process.env.HOTCODE_MODE },
  },
);

// console.log(cfg);

export default cfg;
