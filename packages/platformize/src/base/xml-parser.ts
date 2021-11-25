/**
 * Module dependencies.
 */

/**
 * Expose `parse`.
 */

export interface Declaration {
  attributes: Attributes;
}

export interface Attribute {
  name: string;
  value: string;
}

export interface Attributes {
  [key: string]: string;
}

export interface Tag {
  name?: string;
  attributes: Attributes;
  children: Array<Tag>;
  content?: string;
  nodeType?: number;
  nodeName?: string;
  style?: any;
  childNodes?: Array<Tag>;
  textContent?: string;
}

export interface Document {
  declaration?: Declaration;
  root: Tag;
}

/**
 * Parse the given string of `xml`.
 *
 * @param {String} xml
 * @return {Object}
 * @api public
 */

function parse(xml: string) {
  xml = xml.trim();

  // strip comments
  xml = xml.replace(/<!--[\s\S]*?-->/g, '');

  return document();

  /**
   * XML document.
   */

  function document() {
    return {
      declaration: declaration(),
      root: tag(),
    };
  }

  /**
   * Declaration.
   */

  function declaration() {
    const m = match(/^<\?xml\s*/);
    if (!m) return;

    // tag
    const node: Tag = {
      attributes: {},
      children: []
    };

    // attributes
    while (!(eos() || is('?>'))) {
      const attr = attribute();
      if (!attr) return node;
      node.attributes[attr.name] = attr.value;
    }

    match(/\?>\s*/);

    // remove DOCTYPE
    // <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
    //      "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
    match(/<!DOCTYPE[^>]*>\s/);

    return node;
  }

  /**
   * Tag.
   */

  function tag() {
    const m = match(/^<([\w-:.]+)\s*/);
    if (!m) return;

    // name
    const node: Tag = {
      name: m[1],
      attributes: {},
      children: [],
    };

    // attributes
    while (!(eos() || is('>') || is('?>') || is('/>'))) {
      const attr = attribute();
      if (!attr) return node;
      node.attributes[attr.name] = attr.value;
    }

    // self closing tag
    if (match(/^\s*\/>\s*/)) {
      return node;
    }

    match(/\??>\s*/);

    // @ts-ignore content
    node.content = content();

    // children
    let child: Tag | undefined;
    while ((child = tag())) {
      node.children.push(child);
    }

    // closing
    match(/^<\/[\w-:.]+>\s*/);

    return node;
  }

  /**
   * Text content.
   */

  function content() {
    const m = match(/^([^<]*)/);
    if (m) return m[1];
    return '';
  }

  /**
   * Attribute.
   */

  function attribute() {
    const m = match(/([\w:-]+)\s*=\s*("[^"]*"|'[^']*'|\w+)\s*/);
    if (!m) return;
    return { name: m[1], value: strip(m[2]) };
  }

  /**
   * Strip quotes from `val`.
   */

  function strip(val: string) {
    return val.replace(/^['"]|['"]$/g, '');
  }

  /**
   * Match `re` and advance the string.
   */

  function match(re: RegExp) {
    const m = xml.match(re);
    if (!m) return;
    xml = xml.slice(m[0].length);
    return m;
  }

  /**
   * End-of-source.
   */

  function eos() {
    return xml.length == 0;
  }

  /**
   * Check for `prefix`.
   */

  function is(prefix: string) {
    return xml.indexOf(prefix) == 0;
  }
}

export default parse;
