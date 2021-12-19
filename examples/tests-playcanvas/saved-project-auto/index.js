
import { start } from './__start__';
import { script } from './__game-scripts';

export function run(canvas) {
  const app = start();
  script();
  return app;
}