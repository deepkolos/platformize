import {
    Script,
    Sprite,
    SpriteRenderer,
    Texture2D,
    TextureFormat,
} from "@galacean/engine";

export class VideoPlayer extends Script {
video: HTMLVideoElement;
texture: Texture2D;

videoPkg: Object;

pos: Object;

onAwake() {
    // const { width, height, url } = videoes[`540p_${index++}`];
    // if (index === 4) {
    //   index = 0;
    // }
    // const { width, height, url } = videoes.test;
}

onStart() {
    const width = this.videoPkg["width"];
    const height = this.videoPkg["height"];
    const url = this.videoPkg["url"];

    const entity = this.entity.createChild("video");
    const sr = entity.addComponent(SpriteRenderer);
    const { engine } = this;
    const texture = (this.texture = new Texture2D(
    engine,
    width,
    height,
    TextureFormat.R8G8B8A8,
    // TextureFormat.LuminanceAlpha,
    false,
    // true
    ));
    sr.sprite = new Sprite(engine, this.texture);

    const dom: HTMLVideoElement = document.createElement("video");
    if (dom === null) {
    throw new Error("create video element failed");
    }
    dom.src = url;
    dom.crossOrigin = "anonymous";
    dom.loop = true;
    dom.muted = true;
    dom.x = this.pos.x;
    dom.y = this.pos.y;
    dom.play();
    this.video = dom;

    dom.playsInline = true;
    // document.body.onclick = () => {
    // dom.play();
    // };

    // const id = setTimeout(() => {
    //   dom.src = videoes[`540p_1`].url;
    //   dom.play();
    //   clearTimeout(id);
    // }, 5000);

}

onUpdate() {
    // if (this.video) {
    // this.texture.setImageSource(this.video);
    // }
}

onDestroy() {
    this.video.remove();
    this.texture.destroy();
}
}
