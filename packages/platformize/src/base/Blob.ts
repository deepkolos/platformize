export default class Blob {
  parts: ArrayBuffer[];
  options: { type: string; };
  constructor(parts: Array<ArrayBuffer>, options: { type: string }) {
    this.parts = parts;
    this.options = options;

    // 目前仅适配如下
    // var blob = new Blob([bufferView], { type: source.mimeType });
    // sourceURI = URL.createObjectURL(blob);

    // var base64 = ArrayBufferToBase64(bufferView);
    // var url = `data:${options.type};base64,${base64}`;
  }
}
