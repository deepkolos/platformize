import { mergeRollupOptions } from 'platformize-oasis/dist-plugin';

export default mergeRollupOptions(
  {
    input: ['./minigame/game.ts'],
    output: {
      format: 'cjs',
      dir: 'minigame/',
      chunkFileNames: 'chunks/[name].js',
    },
  },
  { minify: process.env.BUILD === 'production' },
);
