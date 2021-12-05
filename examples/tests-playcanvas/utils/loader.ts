import * as pc from 'playcanvas';

export const getUrl = (str: string) => `https://playcanvas.github.io/${str}`;

export function loadAssets(app: pc.Application, assets: Array<{ url: string; type: string }>) {
  return Promise.all(
    assets.map(
      asset =>
        new Promise<pc.Asset>(resolve => {
          app.assets.loadFromUrl(asset.url, asset.type, (err, asset) => resolve(asset as pc.Asset));
        }),
    ),
  );
}

export function labelAssets(arr: pc.Asset[], labels: string[]) {
  const out: { [k: string]: pc.Asset } = {};
  labels.forEach((v, k) => {
    out[v] = arr[k];
  });
  return out;
}
