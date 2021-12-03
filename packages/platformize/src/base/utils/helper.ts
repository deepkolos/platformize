export function copyProperties(target: Object, source: Object) {
  for (let key of Object.getOwnPropertyNames(source)) {
    if (key !== 'constructor' && key !== 'prototype' && key !== 'name') {
      let desc = Object.getOwnPropertyDescriptor(source, key);
      desc && Object.defineProperty(target, key, desc);
    }
  }
}

export function createImage(canvas: any) {
  const img = canvas.createImage();
  img.addEventListener = (name: string, cb: Function) => (img[`on${name}`] = cb.bind(img));
  img.removeEventListener = (name: string) => (img[`on${name}`] = null);
  return img;
}
