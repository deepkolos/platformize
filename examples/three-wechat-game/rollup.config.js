import { mergeRollupOptions } from 'platformize-three/dist-plugin';

export default mergeRollupOptions(
  {
    input: ['./minigame/game.ts'],
    output: {
      format: 'cjs',
      dir: 'minigame/',
      chunkFileNames: 'chunks/[name].js',
    },
  },
  { minify: false },
);
