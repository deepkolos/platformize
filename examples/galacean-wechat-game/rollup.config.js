import { mergeRollupOptions } from "platformize-galacean/dist-plugin";
import firelog from './firelog.json';

export default mergeRollupOptions(
  {
    input: ['./minigame/game.ts'],
    output: {
      format: 'cjs',
      dir: "minigame/",
      chunkFileNames: 'chunks/[name].js',
    },
  },
  {
    minify: process.env.BUILD === 'production',
    hotcode: { log: firelog, mode: process.env.HOTCODE_MODE },
  },
)
