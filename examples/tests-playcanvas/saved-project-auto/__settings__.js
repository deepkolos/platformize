
import * as pc from 'playcanvas';
    
export function setting() {
  const ASSET_PREFIX = "http://127.0.0.1:8080/";
const SCRIPT_PREFIX = "http://127.0.0.1:8080/";
const SCENE_PATH = "http://127.0.0.1:8080/1284821.json";
const CONTEXT_OPTIONS = {
    'antialias': true,
    'alpha': false,
    'preserveDrawingBuffer': false,
    'preferWebGl2': true,
    'powerPreference': "default"
};
const SCRIPTS = [ 62306171, 62306172, 62306173, 62306178, 62306182, 62306184 ];
const CONFIG_FILENAME = "http://127.0.0.1:8080/config.json";
const INPUT_SETTINGS = {
    useKeyboard: true,
    useMouse: true,
    useGamepads: false,
    useTouch: true
};
pc.script.legacy = false;
const PRELOAD_MODULES = [
];


  // export to window
  window.ASSET_PREFIX = ASSET_PREFIX;
window.SCRIPT_PREFIX = SCRIPT_PREFIX;
window.SCENE_PATH = SCENE_PATH;
window.CONTEXT_OPTIONS = CONTEXT_OPTIONS;
window.SCRIPTS = SCRIPTS;
window.CONFIG_FILENAME = CONFIG_FILENAME;
window.INPUT_SETTINGS = INPUT_SETTINGS;
window.PRELOAD_MODULES = PRELOAD_MODULES;

  return { ASSET_PREFIX,SCRIPT_PREFIX,SCENE_PATH,CONTEXT_OPTIONS,SCRIPTS,CONFIG_FILENAME,INPUT_SETTINGS,PRELOAD_MODULES };
}