import { platformize, DEFAULT_API_LIST as DEFAULT_API_LIST_BAE } from 'platformize/dist/plugin';
import type { Plugin } from 'rollup';

type platformizeOptions = Parameters<typeof platformize>['0'];

export const DEFAULT_API_LIST = [...DEFAULT_API_LIST_BAE, '$defaultWebGLExtensions'];

export default function platformizeOasis({
  apiList = DEFAULT_API_LIST,
  platformManagerPath,
}: platformizeOptions = {}): Plugin[] {
  return [...platformize({ apiList, platformManagerPath })];
}
