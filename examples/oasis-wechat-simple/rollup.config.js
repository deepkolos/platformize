import { mergeRollupOptions } from 'platformize-oasis/dist-plugin';
import firelog from './firelog.json';

export default mergeRollupOptions(
  {
    input: ['./miniprogram/pages/index/index.ts'],
    output: {
      format: 'cjs',
      dir: 'miniprogram/',
      entryFileNames: 'pages/[name]/[name].js',
      chunkFileNames: 'chunks/[name].js',
    },
  },
  {
    minify: process.env.BUILD === 'production',
    hotcode: { log: firelog, mode: process.env.HOTCODE_MODE },
  },
);
