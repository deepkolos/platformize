import * as fs from 'fs';
import * as path from 'path';
import { Args, checkDirExist, parseArgs } from './utils';

type Transformer = (
  code: string,
  cfg: { srcPath: string; dstPath: string; urlPath: string; state: { [k: string]: any } },
) => string;

function main(args: Args) {
  // console.log(args);
  const t = Date.now();

  if (!args.dst || !args.src || !args.url || args.h)
    return console.log(`
  描述:
    转换playcanvas编辑器导出项目到小程序支持写法工具

  参数:
    -src="web离线项目本地目录"
    -dst="转换输出目录"
    -url="网络资源网址前缀"
    -h 显示帮组`);

  const srcPath = checkDirExist(args.src);
  const dstPath = checkDirExist(args.dst);
  const urlPath = args.url;
  const state: Object = {};

  function transform(file: string, transformer: Transformer) {
    let code = fs.readFileSync(path.resolve(srcPath, file), { encoding: 'utf8' }); // ByteSec: ignore FILE_OPER

    code = transformer(code, { srcPath, dstPath, urlPath, state });

    fs.writeFileSync(path.resolve(dstPath, file), code, { encoding: 'utf8' });
  }

  Object.entries(transformers).forEach(([file, transformer]) => {
    transform(file, transformer);
  });

  // write index
  const INDEX_CODE = `
import { start } from './__start__';
import { script } from './__game-scripts';

export function run(canvas) {
  const app = start();
  script();
  return app;
}`;
  fs.writeFileSync(path.resolve(dstPath, 'index.js'), INDEX_CODE, { encoding: 'utf8' });

  console.log('done:' + (Date.now() - t) + 'ms');
}

const transformers: { [k: string]: Transformer } = {
  '__game-scripts.js'(code): string {
    const globalVariables = code
      .match(/window\.([a-zA-Z_]+)\s*=/g)
      ?.map(i => i.match(/window\.([a-zA-Z_]+)\s*=/)?.[1]);
    // console.log(globalVariables);

    globalVariables?.forEach(key => {
      // 可能匹配不太全面
      code = code.replace(`${key}.`, `window.${key}.`);
    });

    return `
import * as pc from 'playcanvas';
    
export function script() { ${code} }`;
  },

  '__settings__.js'(code, cfg): string {
    const constants = code.match(/([A-Z_]+) =/g)?.map(i => i.replace(' =', ''));
    // console.log(constants);
    cfg.state.constants = constants;

    // inject url
    ['ASSET_PREFIX', 'SCRIPT_PREFIX', 'SCENE_PATH', 'CONFIG_FILENAME'].forEach(key => {
      code = code.replace(`${key} = "`, `${key} = "${cfg.urlPath}`);
    });

    // global constant to local
    constants?.forEach(key => {
      code = code.replace(`${key} =`, `const ${key} =`);
    });

    return `
import * as pc from 'playcanvas';
    
export function setting() {
  ${code}

  // export to window
  ${constants?.map(key => `window.${key} = ${key}`).join(';\n')};

  return { ${constants?.join()} };
}`;
  },

  '__start__.js'(code, cfg): string {
    // remove ios check
    code = code.replace(`getIosVersion(),`, 'null,');
    // remove h5 display error
    code = code.replace(`} catch (e) {`, `} catch (e) { console.error(e); return;`);
    // load module is no supported
    code = code.replace(
      `loadModules(PRELOAD_MODULES, ASSET_PREFIX, configure);`,
      `// load modules is no support
        configure();`,
    );
    code = code.replace(`var pcBootstrap`, 'pcBootstrap');
    code = code.replace(`canvas = document`, `const canvas = document`);

    code = code.replace(`app =`, 'APP = app =');
    return `
import * as pc from 'playcanvas';
import { setting } from './__settings__';

// load script remote is no support, script must be imported
pc.ScriptHandler.prototype._loadScript = (url, callback) => callback(null, url);
    
export function start() {
  let pcBootstrap, APP;
  const {${cfg.state.constants.join()}} = setting();
  ${code}

  return APP;
}`;
  },
};

main(parseArgs(process.argv.slice(2)));
