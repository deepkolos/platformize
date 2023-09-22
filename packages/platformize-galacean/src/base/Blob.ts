export default class $Blob {
    parts: ArrayBuffer[];
    options: { type: string };
    constructor(parts: Array<ArrayBuffer>, options: { type: string } = { type: 'image/jpeg' }) {
      this.parts = parts;
      this.options = options;
  
      // 安卓微信不支持image/jpg的解析, 需改为image/jpeg
      options.type = options.type.replace('jpg', 'jpeg');
      // 目前仅适配如下
      // var blob = new Blob([bufferView], { type: source.mimeType });
      // sourceURI = URL.createObjectURL(blob);
  
      // var base64 = ArrayBufferToBase64(bufferView);
      // var url = `data:${options.type};base64,${base64}`;
    }
  }
  