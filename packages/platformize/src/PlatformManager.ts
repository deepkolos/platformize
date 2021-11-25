import { Platform, Polyfill } from "./Platform";

class PlatformManager<T extends Platform> {
  polyfill?: Polyfill;
  platform?: T | null;

  set(platform: T) {
    this.platform = platform;
    this.polyfill = platform.polyfill;
  }

  dispose() {
    this.platform?.dispose();
    this.platform = null;
  }
}

const PLATFORM = new PlatformManager();

export { PLATFORM };
