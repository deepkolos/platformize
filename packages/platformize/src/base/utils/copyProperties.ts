export default function copyProperties(target: Object, source: Object) {
  for (let key of Object.getOwnPropertyNames(source)) {
    if (key !== 'constructor' && key !== 'prototype' && key !== 'name') {
      let desc = Object.getOwnPropertyDescriptor(source, key);
      desc && Object.defineProperty(target, key, desc);
    }
  }
}
