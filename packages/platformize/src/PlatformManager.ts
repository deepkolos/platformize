import { Platform, Polyfill } from './Platform';

class PlatformManager<T extends Platform> {
  polyfill: Polyfill | null = {} as unknown as Polyfill;
  platform?: T | null;

  set(platform: T) {
    this.platform = platform;
    this.polyfill = platform.polyfill;
  }

  dispose() {
    this.platform?.dispose();
    this.platform = null;
    this.polyfill = null;
  }
}

export default new PlatformManager();
