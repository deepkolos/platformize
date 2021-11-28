// @ts-nocheck
import { Object3D } from 'three';

export function disposeNode(node: Object3D) {
  if (node.isMesh) {
    if (node.geometry) {
      node.geometry.dispose();
    }

    if (node.material) {
      const materials = Array.isArray(node.material) ? node.material : [node.material];
      materials.forEach(material => {
        Object.keys(material).forEach(key => {
          // @ts-ignore
          const value = material[key];
          if (value && value.dispose instanceof Function) value.dispose();
        });
      });
    }
  } else if (node.isScene) {
    if (node.background && node.background.dispose) node.background.dispose();
    if (node.environment && node.environment.dispose) node.environment.dispose();
  }
}

export function disposeHierarchy(node: Object3D, callback = disposeNode) {
  for (var i = node.children.length - 1; i >= 0; i--) {
    var child = node.children[i];
    disposeHierarchy(child, callback);
    callback(child);
  }
  callback(node);
}
