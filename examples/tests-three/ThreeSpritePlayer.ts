import { Demo } from './Demo';
import { PlaneGeometry, MeshBasicMaterial, Mesh, BoxGeometry, NearestFilter, UnsignedByteType, LinearFilter } from 'three';
import ThreeSpritePlayer from 'three-sprite-player';

// const url: Array<string> = new Array<string>(3).fill('').map((v: string, k: number) => `/imgs/output-${k}.png`);

const url = [
  'https://upload-images.jianshu.io/upload_images/252050-20a1aa9acbfb9446.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240',
  'https://upload-images.jianshu.io/upload_images/252050-4a7c3cc27a087066.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240',
  'https://upload-images.jianshu.io/upload_images/252050-db07cae2bbf672a5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240',
];

const tile = {
  url,
  x: 0,
  y: 0,
  z: -15,
  w: (10 * 358) / 358,
  h: 10,
  col: 2,
  row: 2,
  total: 10,
  fps: 16,
};

export class DemoThreeSpritePlayer extends Demo {
  player!: ThreeSpritePlayer;
  mesh!: Mesh;

  async init(): Promise<void> {
    const { textureLoader } = this.deps;
    const tiles = await Promise.all(tile.url.map(url => textureLoader.loadAsync(url)));
    const spritePlayer = new ThreeSpritePlayer(
      tiles,
      tile.total,
      tile.row,
      tile.col,
      tile.fps,
      true,
    );
    tiles.forEach(texture => {
      // 默认 LinearMipmapLinearFilter 微信新版本会导致渲染异常
      texture.minFilter = LinearFilter;
    });
    const geometry = new PlaneGeometry(tile.w, tile.h);
    const material = new MeshBasicMaterial({
      map: spritePlayer.texture,
      transparent: false,
    });
    const mesh = new Mesh(geometry, material);
    const boxGeometry = new BoxGeometry();
    const box = new Mesh(boxGeometry, material);

    box.position.y = -1.2;
    mesh.position.z = -8;
    mesh.position.y = 4;

    this.add(mesh);
    this.add(box);

    this.mesh = mesh;
    this.player = spritePlayer;
  }

  update(): void {
    this.player.animate();
    // @ts-ignore
    this.mesh.material.map = this.player.texture;
  }

  dispose(): void {
    this.reset();
    this.player.dispose();
    // @ts-ignore
    this.player = null;
    // @ts-ignore
    this.mesh = null;
  }
}
