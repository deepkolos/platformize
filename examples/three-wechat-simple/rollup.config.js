import { mergeRollupOptions } from 'platformize-three/dist-plugin';

export default mergeRollupOptions({
  input: ['./miniprogram/pages/index/index.ts'],
  output: {
    format: 'cjs',
    dir: 'miniprogram/',
    chunkFileNames: 'chunks/[name].js',
  },
});
