import * as pc from 'playcanvas';

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
