import { start } from './__start__';
import { script } from './__game-scripts';

export function savedProject(canvas: any) {
  const app = start();
  script();
  return app;
}
