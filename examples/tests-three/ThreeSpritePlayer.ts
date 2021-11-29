import { Demo } from './Demo';
import { PlaneGeometry, MeshBasicMaterial, Mesh, BoxGeometry } from 'three';
import ThreeSpritePlayer from 'three-sprite-player';

// const url: Array<string> = new Array<string>(3).fill('').map((v: string, k: number) => `/imgs/output-${k}.png`);

const url = [
  'https://s3.ax1x.com/2021/02/26/yx0ObV.png',
  'https://s3.ax1x.com/2021/02/26/yx0LD0.png',
  'https://s3.ax1x.com/2021/02/26/yx0Hvn.png',
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
    const spritePlayer = new ThreeSpritePlayer(tiles, tile.total, tile.row, tile.col, tile.fps, true);

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
