/**
 * @title Compressed Texture
 * @category Texture
 */
import {
  AssetType,
  Camera,
  DirectLight,
  GLCompressedTextureInternalFormat,
  Logger,
  MeshRenderer,
  PrimitiveMesh,
  Texture2D,
  UnlitMaterial,
  Vector3,
  WebGLEngine,
  WebGLRenderer,
} from "@galacean/engine";
import { OrbitControl } from "@galacean/engine-toolkit-controls";

export function Demo(canvas: any) {
    Logger.enable();
    WebGLEngine.create({ canvas: canvas }).then((engine) => {
    engine.canvas.resizeByClientSize();

    const scene = engine.sceneManager.activeScene;
    const rootEntity = scene.createRootEntity();

    // Create camera
    const cameraNode = rootEntity.createChild("camera_node");
    cameraNode.transform.position = new Vector3(0, 0, 3);
    cameraNode.addComponent(Camera);
    cameraNode.addComponent(OrbitControl);

    const lightEntity = rootEntity.createChild();
    lightEntity.addComponent(DirectLight).intensity = 0.5;
    lightEntity.transform.setPosition(-5, 5, 5);
    lightEntity.transform.lookAt(new Vector3(0, 0, 0));

    // material ball
    const ball = rootEntity.createChild("ball");
    const ballRender = ball.addComponent(MeshRenderer);
    const material = new UnlitMaterial(engine);
    ball.transform.setRotation(90, 0, 0);
    ballRender.mesh = PrimitiveMesh.createPlane(engine, 1, 1);
    ballRender.setMaterial(material);

    // debug
    const fileList = {
        [GLCompressedTextureInternalFormat.RGB_S3TC_DXT1_EXT]:
        "https://gw.alipayobjects.com/os/bmw-prod/b38cb09e-154c-430e-98c8-81dc19d4fb8e.ktx",
        [GLCompressedTextureInternalFormat.RGBA_S3TC_DXT5_EXT]:
        "https://gw.alipayobjects.com/os/bmw-prod/269eae01-13d9-43fc-80a5-cc5a784eae7a.ktx",
        [GLCompressedTextureInternalFormat.RGB_ETC1_WEBGL]:
        "https://gw.alipayobjects.com/os/bmw-prod/a704b7a6-b9b1-48ed-a215-04745a90b003.ktx",
        [GLCompressedTextureInternalFormat.RGB8_ETC2]:
        "https://gw.alipayobjects.com/os/bmw-prod/e03d0d5f-be29-412c-b412-2d8e583b7a5a.ktx",
        [GLCompressedTextureInternalFormat.RGBA8_ETC2_EAC]:
        "https://gw.alipayobjects.com/os/bmw-prod/24406406-bfa4-4e08-b5da-b26056fdea62.ktx",
        [GLCompressedTextureInternalFormat.RGBA_ASTC_4X4_KHR]:
        "https://gw.alipayobjects.com/os/bmw-prod/3fb9b745-e02b-425b-98e5-df6a0a058b47.ktx",
        [GLCompressedTextureInternalFormat.RGBA_ASTC_12X12_KHR]:
        "https://gw.alipayobjects.com/os/bmw-prod/6465388f-81b4-45d1-86a4-731344af220b.ktx",
        [GLCompressedTextureInternalFormat.RGB_PVRTC_2BPPV1_IMG]:
        "https://gw.alipayobjects.com/os/bmw-prod/c8883997-3616-4811-a9bf-4d4c07015fb7.ktx",
        [GLCompressedTextureInternalFormat.RGB_PVRTC_4BPPV1_IMG]:
        "https://gw.alipayobjects.com/os/bmw-prod/3de8467b-f626-48e3-8dd4-8cb4e7acbe4f.ktx",
        [GLCompressedTextureInternalFormat.RGBA_PVRTC_2BPPV1_IMG]:
        "https://gw.alipayobjects.com/os/bmw-prod/7955549e-ee62-4982-a810-d118e2fce6dd.ktx",
        [GLCompressedTextureInternalFormat.RGBA_PVRTC_4BPPV1_IMG]:
        "https://gw.alipayobjects.com/os/bmw-prod/dc02693a-f416-4b2e-bf7b-9553c4038ce8.ktx",
    };

    const rhi = engine._hardwareRenderer as WebGLRenderer;
    const formats = [];
    const debugInfo = {
        format: "",
    };
    for (let format in fileList) {
        const can = rhi.canIUseCompressedTextureInternalFormat(format as any);
        const formatDes = `${GLCompressedTextureInternalFormat[format]} ${can}`;
        formats.push(formatDes);
        if (can && !debugInfo.format) {
        debugInfo.format = formatDes;
        }
    }

    function loadTexture(formatDes: string) {
        const format = formatDes.split(" ")[0];
        const url = fileList[GLCompressedTextureInternalFormat[format]];
        engine.resourceManager
        .load<Texture2D>({
            type: AssetType.KTX,
            url,
        })
        .then((res) => {
            const compressedTexture = res;
            material.baseTexture = compressedTexture;
        });
    }

    if (debugInfo.format) {
        loadTexture(debugInfo.format);
    }

    engine.run();
    });
}