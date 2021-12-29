import * as fs from 'fs';
import * as path from 'path';

export interface Args {
  src: string;
  dst: string;
  url: string;
  h: string;
}

export function parseArgs(args: string[]) {
  return args.reduce((acc, curr) => {
    if (curr.indexOf('=') !== -1) {
      let [name, value] = curr.split('=');
      name = name.slice(1);
      // @ts-ignore
      acc[name] = value;
    } else {
      let name = curr.slice(1);
      acc[name] = true;
    }

    return acc;
  }, {} as unknown as Args);
}

export function checkDirExist(pathStr: string) {
  const absolutePath = path.resolve(process.cwd(), pathStr);
  const stat = fs.statSync(absolutePath);
  if (!stat.isDirectory()) throw new Error(`目录不存在: ${pathStr}`);
  return absolutePath;
}
