import Blob from './Blob';
import { encode as ArrayBufferToBase64 } from './base64-arraybuffer';

export default class $URL {
  createObjectURL(obj: Blob) {
    if (obj instanceof Blob) {
      // 更好的方式，使用wx.fileSystemManager写入临时文件来获取url，但是需要手动管理临时文件

      const base64 = ArrayBufferToBase64(obj.parts[0]);
      const url = `data:${obj.options.type};base64,${base64}`;
      return url;
    }

    return '';
  }

  revokeObjectURL() {}
}
