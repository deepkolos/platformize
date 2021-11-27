import parseXML, { Tag } from './xml-parser';

function walkTree(node: Tag, processer: (node: Tag) => void) {
  processer(node);
  node.children.forEach(i => walkTree(i, processer));
}

export default class $DOMParser {
  parseFromString(str: string) {
    const xml = parseXML(str);

    const nodeBase = {
      // @ts-ignore
      hasAttribute(key: string) {
        // @ts-ignore
        return this.attributes[key] !== undefined;
      },
      // @ts-ignore
      getAttribute(key: string) {
        // @ts-ignore
        return this.attributes[key];
      },
      getElementsByTagName(tag: string) {
        // 看了dae的文件结构，xml的节点不算庞大，所以还能接受
        const result: Tag[] = [];
        // @ts-ignore
        this.childNodes.forEach(i => walkTree(i, node => tag === node.name && result.push(node)));
        return result;
      },
    };

    // patch xml
    xml.root &&
      walkTree(xml.root, node => {
        node.nodeType = 1;
        node.nodeName = node.name;
        node.style = new Proxy(
          (node.attributes.style || '').split(';').reduce((acc, curr) => {
            if (curr) {
              let [key, value] = curr.split(':');
              acc[key.trim()] = value.trim();
            }
            return acc;
          }, {} as { [k: string]: any }),
          {
            get(target, key: string) {
              return target[key] || '';
            },
          },
        );
        node.textContent = node.content;
        node.childNodes = node.children;
        // @ts-ignore
        node.__proto__ = nodeBase;
      });

    const out = {
      documentElement: xml.root,
      childNodes: [xml.root],
    };

    // @ts-ignore
    out.__proto__ = nodeBase;

    return out;
  }
}
