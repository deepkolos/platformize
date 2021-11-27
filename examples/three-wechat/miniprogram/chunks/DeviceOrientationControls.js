'use strict';

var three = require('./three.js');

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn) {
  var module = { exports: {} };
	return fn(module, module.exports), module.exports;
}

class $Blob {
    constructor(parts, options) {
        this.parts = parts;
        this.options = options;
        // 目前仅适配如下
        // var blob = new Blob([bufferView], { type: source.mimeType });
        // sourceURI = URL.createObjectURL(blob);
        // var base64 = ArrayBufferToBase64(bufferView);
        // var url = `data:${options.type};base64,${base64}`;
    }
}
var _default$7 = $Blob;

var Blob = /*#__PURE__*/Object.defineProperty({
	default: _default$7
}, '__esModule', {value: true});

var base64Arraybuffer = createCommonjsModule(function (module, exports) {
/*
 * base64-arraybuffer
 * https://github.com/niklasvh/base64-arraybuffer
 *
 * Copyright (c) 2012 Niklas von Hertzen
 * Licensed under the MIT license.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.decode = exports.encode = void 0;
var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
// Use a lookup table to find the index.
var lookup = new Uint8Array(256);
for (var i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
}
// 快一点
function encode(arrayBuffer) {
    var base64 = '';
    var bytes = new Uint8Array(arrayBuffer);
    var byteLength = bytes.byteLength;
    var byteRemainder = byteLength % 3;
    var mainLength = byteLength - byteRemainder;
    var a, b, c, d;
    var chunk;
    // Main loop deals with bytes in chunks of 3
    for (var i = 0; i < mainLength; i = i + 3) {
        // Combine the three bytes into a single integer
        chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
        // Use bitmasks to extract 6-bit segments from the triplet
        a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
        b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
        c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
        d = chunk & 63; // 63       = 2^6 - 1
        // Convert the raw binary segments to the appropriate ASCII encoding
        base64 += chars[a] + chars[b] + chars[c] + chars[d];
    }
    // Deal with the remaining bytes and padding
    if (byteRemainder == 1) {
        chunk = bytes[mainLength];
        a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2
        // Set the 4 least significant bits to zero
        b = (chunk & 3) << 4; // 3   = 2^2 - 1
        base64 += chars[a] + chars[b] + '==';
    }
    else if (byteRemainder == 2) {
        chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];
        a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
        b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4
        // Set the 2 least significant bits to zero
        c = (chunk & 15) << 2; // 15    = 2^4 - 1
        base64 += chars[a] + chars[b] + chars[c] + '=';
    }
    return base64;
}
exports.encode = encode;
function decode(base64) {
    var bufferLength = base64.length * 0.75, len = base64.length, i, p = 0, encoded1, encoded2, encoded3, encoded4;
    if (base64[base64.length - 1] === '=') {
        bufferLength--;
        if (base64[base64.length - 2] === '=') {
            bufferLength--;
        }
    }
    var arraybuffer = new ArrayBuffer(bufferLength), bytes = new Uint8Array(arraybuffer);
    for (i = 0; i < len; i += 4) {
        encoded1 = lookup[base64.charCodeAt(i)];
        encoded2 = lookup[base64.charCodeAt(i + 1)];
        encoded3 = lookup[base64.charCodeAt(i + 2)];
        encoded4 = lookup[base64.charCodeAt(i + 3)];
        bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
        bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
        bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }
    return arraybuffer;
}
exports.decode = decode;
});

var __importDefault$2 = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};

const Blob_1 = __importDefault$2(Blob);

class $URL {
    createObjectURL(obj) {
        if (obj instanceof Blob_1.default) {
            // 更好的方式，使用wx.fileSystemManager写入临时文件来获取url，但是需要手动管理临时文件
            const base64 = base64Arraybuffer.encode(obj.parts[0]);
            const url = `data:${obj.options.type};base64,${base64}`;
            return url;
        }
        return '';
    }
    revokeObjectURL() { }
}
var _default$6 = $URL;

var URL = /*#__PURE__*/Object.defineProperty({
	default: _default$6
}, '__esModule', {value: true});

/**
 * A lookup table for atob(), which converts an ASCII character to the
 * corresponding six-bit number.
 */

const keystr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
function atobLookup(chr) {
    const index = keystr.indexOf(chr);
    // Throw exception if character is not in the lookup string; should not be hit in tests
    return index < 0 ? undefined : index;
}
/**
 * Implementation of atob() according to the HTML and Infra specs, except that
 * instead of throwing INVALID_CHARACTER_ERR we return null.
 */
function atob(data) {
    // Web IDL requires DOMStrings to just be converted using ECMAScript
    // ToString, which in our case amounts to using a template literal.
    data = `${data}`;
    // "Remove all ASCII whitespace from data."
    data = data.replace(/[ \t\n\f\r]/g, '');
    // "If data's length divides by 4 leaving no remainder, then: if data ends
    // with one or two U+003D (=) code points, then remove them from data."
    if (data.length % 4 === 0) {
        data = data.replace(/==?$/, '');
    }
    // "If data's length divides by 4 leaving a remainder of 1, then return
    // failure."
    //
    // "If data contains a code point that is not one of
    //
    // U+002B (+)
    // U+002F (/)
    // ASCII alphanumeric
    //
    // then return failure."
    if (data.length % 4 === 1 || /[^+/0-9A-Za-z]/.test(data)) {
        return '';
    }
    // "Let output be an empty byte sequence."
    let output = '';
    // "Let buffer be an empty buffer that can have bits appended to it."
    //
    // We append bits via left-shift and or.  accumulatedBits is used to track
    // when we've gotten to 24 bits.
    let buffer = 0;
    let accumulatedBits = 0;
    // "Let position be a position variable for data, initially pointing at the
    // start of data."
    //
    // "While position does not point past the end of data:"
    for (let i = 0; i < data.length; i++) {
        // "Find the code point pointed to by position in the second column of
        // Table 1: The Base 64 Alphabet of RFC 4648. Let n be the number given in
        // the first cell of the same row.
        //
        // "Append to buffer the six bits corresponding to n, most significant bit
        // first."
        //
        // atobLookup() implements the table from RFC 4648.
        buffer <<= 6;
        // @ts-ignore
        buffer |= atobLookup(data[i]);
        accumulatedBits += 6;
        // "If buffer has accumulated 24 bits, interpret them as three 8-bit
        // big-endian numbers. Append three bytes with values equal to those
        // numbers to output, in the same order, and then empty buffer."
        if (accumulatedBits === 24) {
            output += String.fromCharCode((buffer & 0xff0000) >> 16);
            output += String.fromCharCode((buffer & 0xff00) >> 8);
            output += String.fromCharCode(buffer & 0xff);
            buffer = accumulatedBits = 0;
        }
        // "Advance position by 1."
    }
    // "If buffer is not empty, it contains either 12 or 18 bits. If it contains
    // 12 bits, then discard the last four and interpret the remaining eight as
    // an 8-bit big-endian number. If it contains 18 bits, then discard the last
    // two and interpret the remaining 16 as two 8-bit big-endian numbers. Append
    // the one or two bytes with values equal to those one or two numbers to
    // output, in the same order."
    if (accumulatedBits === 12) {
        buffer >>= 4;
        output += String.fromCharCode(buffer);
    }
    else if (accumulatedBits === 18) {
        buffer >>= 2;
        output += String.fromCharCode((buffer & 0xff00) >> 8);
        output += String.fromCharCode(buffer & 0xff);
    }
    // "Return output."
    return output;
}
var _default$5 = atob;

var atob_1 = /*#__PURE__*/Object.defineProperty({
	default: _default$5
}, '__esModule', {value: true});

var EventTarget = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.Touch = void 0;
const _events = new WeakMap();
class Touch {
    constructor(touch) {
        // CanvasTouch{identifier, x, y}
        // Touch{identifier, pageX, pageY, clientX, clientY, force}
        this.identifier = touch.identifier;
        this.force = touch.force === undefined ? 1 : touch.force;
        this.pageX = touch.pageX === undefined ? touch.x : touch.pageX;
        this.pageY = touch.pageY === undefined ? touch.y : touch.pageY;
        this.clientX = touch.clientX === undefined ? touch.x : touch.clientX;
        this.clientY = touch.clientY === undefined ? touch.y : touch.clientY;
        this.screenX = this.pageX;
        this.screenY = this.pageY;
    }
}
exports.Touch = Touch;
class $EventTarget {
    constructor() {
        _events.set(this, {});
    }
    addEventListener(type, listener) {
        let events = _events.get(this);
        if (!events) {
            events = {};
            _events.set(this, events);
        }
        if (!events[type]) {
            events[type] = [];
        }
        events[type].push(listener);
        // if (options.capture) {
        //   // console.warn('EventTarget.addEventListener: options.capture is not implemented.')
        // }
        // if (options.once) {
        //   // console.warn('EventTarget.addEventListener: options.once is not implemented.')
        // }
        // if (options.passive) {
        //   // console.warn('EventTarget.addEventListener: options.passive is not implemented.')
        // }
    }
    removeEventListener(type, listener) {
        const events = _events.get(this);
        if (events) {
            const listeners = events[type];
            if (listeners && listeners.length > 0) {
                for (let i = listeners.length; i--; i > 0) {
                    if (listeners[i] === listener) {
                        listeners.splice(i, 1);
                        break;
                    }
                }
            }
        }
    }
    dispatchEvent(event = { type: '' }) {
        if (typeof event.preventDefault !== 'function') {
            event.preventDefault = () => { };
        }
        if (typeof event.stopPropagation !== 'function') {
            event.stopPropagation = () => { };
        }
        const events = _events.get(this);
        if (events) {
            const listeners = events[event.type];
            if (listeners) {
                for (let i = 0; i < listeners.length; i++) {
                    listeners[i](event);
                }
            }
        }
    }
    releasePointerCapture() { }
    setPointerCapture() { }
}
exports.default = $EventTarget;
});

var __importDefault$1 = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};

// @ts-nocheck
const EventTarget_1 = __importDefault$1(EventTarget);
const _requestHeader = new WeakMap();
const _responseHeader = new WeakMap();
const _requestTask = new WeakMap();
function _triggerEvent(type, event = {}) {
    event.target = event.target || this;
    if (typeof this[`on${type}`] === 'function') {
        this[`on${type}`].call(this, event);
    }
}
function _changeReadyState(readyState, event = {}) {
    this.readyState = readyState;
    event.readyState = readyState;
    _triggerEvent.call(this, 'readystatechange', event);
}
function _isRelativePath(url) {
    return !/^(http|https|ftp|wxfile):\/\/.*/i.test(url);
}
const { platform } = wx.getSystemInfoSync();
class $XMLHttpRequest extends EventTarget_1.default {
    constructor() {
        super();
        /*
         * TODO 这一批事件应该是在 XMLHttpRequestEventTarget.prototype 上面的
         */
        this.onabort = null;
        this.onerror = null;
        this.onload = null;
        this.onloadstart = null;
        this.onprogress = null;
        this.ontimeout = null;
        this.onloadend = null;
        this.onreadystatechange = null;
        this.readyState = 0;
        this.response = null;
        this.responseText = null;
        this.responseType = 'text';
        this.dataType = 'string';
        this.responseXML = null;
        this.status = 0;
        this.statusText = '';
        this.upload = {};
        this.withCredentials = false;
        _requestHeader.set(this, {
            'content-type': 'application/x-www-form-urlencoded',
        });
        _responseHeader.set(this, {});
    }
    abort() {
        const myRequestTask = _requestTask.get(this);
        if (myRequestTask) {
            myRequestTask.abort();
        }
    }
    getAllResponseHeaders() {
        const responseHeader = _responseHeader.get(this);
        return Object.keys(responseHeader)
            .map(header => {
            return `${header}: ${responseHeader[header]}`;
        })
            .join('\n');
    }
    getResponseHeader(header) {
        return _responseHeader.get(this)[header];
    }
    open(method, url /* async, user, password 这几个参数在小程序内不支持*/) {
        this._method = method;
        this._url = url;
        _changeReadyState.call(this, $XMLHttpRequest.OPENED);
    }
    overrideMimeType() { }
    send(data = '') {
        if (this.readyState !== $XMLHttpRequest.OPENED) {
            throw new Error("Failed to execute 'send' on 'XMLHttpRequest': The object's state must be OPENED.");
        }
        else {
            const url = this._url;
            const header = _requestHeader.get(this);
            const responseType = this.responseType;
            const dataType = this.dataType;
            const relative = _isRelativePath(url);
            let encoding;
            if (responseType === 'arraybuffer') ;
            else {
                encoding = 'utf8';
            }
            delete this.response;
            this.response = null;
            let resolved = false;
            const onSuccess = ({ data, statusCode, header }) => {
                // console.log('onSuccess', url)
                if (resolved)
                    return;
                resolved = true;
                statusCode = statusCode === undefined ? 200 : statusCode;
                if (typeof data !== 'string' && !(data instanceof ArrayBuffer)) {
                    try {
                        data = JSON.stringify(data);
                    }
                    catch (e) { }
                }
                this.status = statusCode;
                if (header) {
                    _responseHeader.set(this, header);
                }
                _triggerEvent.call(this, 'loadstart');
                _changeReadyState.call(this, $XMLHttpRequest.HEADERS_RECEIVED);
                _changeReadyState.call(this, $XMLHttpRequest.LOADING);
                this.response = data;
                if (data instanceof ArrayBuffer) {
                    Object.defineProperty(this, 'responseText', {
                        enumerable: true,
                        configurable: true,
                        get: function () {
                            throw 'InvalidStateError : responseType is ' + this.responseType;
                        },
                    });
                }
                else {
                    this.responseText = data;
                }
                _changeReadyState.call(this, $XMLHttpRequest.DONE);
                _triggerEvent.call(this, 'load');
                _triggerEvent.call(this, 'loadend');
            };
            const onFail = ({ errMsg }) => {
                // TODO 规范错误
                if (resolved)
                    return;
                resolved = true;
                if (errMsg.indexOf('abort') !== -1) {
                    _triggerEvent.call(this, 'abort');
                }
                else {
                    _triggerEvent.call(this, 'error', {
                        message: errMsg,
                    });
                }
                _triggerEvent.call(this, 'loadend');
                if (relative) {
                    // 用户即使没监听error事件, 也给出相应的警告
                    console.warn(errMsg);
                }
            };
            if (relative) {
                const fs = wx.getFileSystemManager();
                var options = {
                    filePath: url,
                    success: onSuccess,
                    fail: onFail,
                };
                if (encoding) {
                    options['encoding'] = encoding;
                }
                fs.readFile(options);
                return;
            }
            // IOS在某些情况下不会触发onSuccess...
            const usePatch = responseType === 'arraybuffer' && platform === 'ios' && $XMLHttpRequest.useFetchPatch;
            wx.request({
                data,
                url: url,
                method: this._method,
                header: header,
                dataType: dataType,
                responseType: responseType,
                enableCache: false,
                success: onSuccess,
                // success: usePatch ? undefined : onSuccess,
                fail: onFail,
            });
            if (usePatch) {
                setTimeout(function () {
                    wx.request({
                        data,
                        url: url,
                        method: this._method,
                        header: header,
                        dataType: dataType,
                        responseType: responseType,
                        enableCache: true,
                        success: onSuccess,
                        fail: onFail,
                    });
                }, $XMLHttpRequest.fetchPatchDelay);
            }
        }
    }
    setRequestHeader(header, value) {
        const myHeader = _requestHeader.get(this);
        myHeader[header] = value;
        _requestHeader.set(this, myHeader);
    }
    addEventListener(type, listener) {
        if (typeof listener !== 'function') {
            return;
        }
        this['on' + type] = (event = {}) => {
            event.target = event.target || this;
            listener.call(this, event);
        };
    }
    removeEventListener(type, listener) {
        if (this['on' + type] === listener) {
            this['on' + type] = null;
        }
    }
}
var _default$4 = $XMLHttpRequest;
// TODO 没法模拟 HEADERS_RECEIVED 和 LOADING 两个状态
$XMLHttpRequest.UNSEND = 0;
$XMLHttpRequest.OPENED = 1;
$XMLHttpRequest.HEADERS_RECEIVED = 2;
$XMLHttpRequest.LOADING = 3;
$XMLHttpRequest.DONE = 4;
// 某些情况下IOS会不success不触发。。。
$XMLHttpRequest.useFetchPatch = false;
$XMLHttpRequest.fetchPatchDelay = 200;

var XMLHttpRequest = /*#__PURE__*/Object.defineProperty({
	default: _default$4
}, '__esModule', {value: true});

function copyProperties(target, source) {
    for (let key of Object.getOwnPropertyNames(source)) {
        if (key !== 'constructor' && key !== 'prototype' && key !== 'name') {
            let desc = Object.getOwnPropertyDescriptor(source, key);
            desc && Object.defineProperty(target, key, desc);
        }
    }
}
var _default$3 = copyProperties;

var copyProperties_1 = /*#__PURE__*/Object.defineProperty({
	default: _default$3
}, '__esModule', {value: true});

/**
 * Module dependencies.
 */

/**
 * Parse the given string of `xml`.
 *
 * @param {String} xml
 * @return {Object}
 * @api public
 */
function parse(xml) {
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
        if (!m)
            return;
        // tag
        const node = {
            attributes: {},
            children: []
        };
        // attributes
        while (!(eos() || is('?>'))) {
            const attr = attribute();
            if (!attr)
                return node;
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
        if (!m)
            return;
        // name
        const node = {
            name: m[1],
            attributes: {},
            children: [],
        };
        // attributes
        while (!(eos() || is('>') || is('?>') || is('/>'))) {
            const attr = attribute();
            if (!attr)
                return node;
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
        let child;
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
        if (m)
            return m[1];
        return '';
    }
    /**
     * Attribute.
     */
    function attribute() {
        const m = match(/([\w:-]+)\s*=\s*("[^"]*"|'[^']*'|\w+)\s*/);
        if (!m)
            return;
        return { name: m[1], value: strip(m[2]) };
    }
    /**
     * Strip quotes from `val`.
     */
    function strip(val) {
        return val.replace(/^['"]|['"]$/g, '');
    }
    /**
     * Match `re` and advance the string.
     */
    function match(re) {
        const m = xml.match(re);
        if (!m)
            return;
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
    function is(prefix) {
        return xml.indexOf(prefix) == 0;
    }
}
var _default$2 = parse;

var xmlParser = /*#__PURE__*/Object.defineProperty({
	default: _default$2
}, '__esModule', {value: true});

var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};

const xml_parser_1 = __importDefault(xmlParser);
function walkTree(node, processer) {
    processer(node);
    node.children.forEach(i => walkTree(i, processer));
}
class $DOMParser {
    parseFromString(str) {
        const xml = xml_parser_1.default(str);
        const nodeBase = {
            // @ts-ignore
            hasAttribute(key) {
                // @ts-ignore
                return this.attributes[key] !== undefined;
            },
            // @ts-ignore
            getAttribute(key) {
                // @ts-ignore
                return this.attributes[key];
            },
            getElementsByTagName(tag) {
                // 看了dae的文件结构，xml的节点不算庞大，所以还能接受
                const result = [];
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
                node.style = new Proxy((node.attributes.style || '').split(';').reduce((acc, curr) => {
                    if (curr) {
                        let [key, value] = curr.split(':');
                        acc[key.trim()] = value.trim();
                    }
                    return acc;
                }, {}), {
                    get(target, key) {
                        return target[key] || '';
                    },
                });
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
var _default$1 = $DOMParser;

var DOMParser = /*#__PURE__*/Object.defineProperty({
	default: _default$1
}, '__esModule', {value: true});

class $TextDecoder {
    /**
     * 不支持 UTF-8 code points 大于 1 字节
     * @see https://stackoverflow.com/questions/17191945/conversion-between-utf-8-arraybuffer-and-string
     * @param {Uint8Array|ArrayBuffer} uint8Array
     */
    decode(input) {
        const uint8Array = input instanceof ArrayBuffer ? new Uint8Array(input) : input;
        // from threejs LoaderUtils.js
        let s = '';
        // Implicitly assumes little-endian.
        for (let i = 0, il = uint8Array.length; i < il; i++) {
            s += String.fromCharCode(uint8Array[i]);
        }
        try {
            // merges multi-byte utf-8 characters.
            return decodeURIComponent(escape(s));
        }
        catch (e) {
            // see #16358
            return s;
        }
        // return String.fromCharCode.apply(null, uint8Array);
    }
}
var _default = $TextDecoder;

var TextDecoder = /*#__PURE__*/Object.defineProperty({
	default: _default
}, '__esModule', {value: true});

var Platform_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.Platform = void 0;
class Platform {
}
exports.Platform = Platform;
});

var wechat = createCommonjsModule(function (module, exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WechatPlatform = void 0;
// @ts-ignore
const URL_1 = __importDefault(URL);
const Blob_1 = __importDefault(Blob);
const atob_1$1 = __importDefault(atob_1);
const EventTarget_1 = __importStar(EventTarget);
const XMLHttpRequest_1 = __importDefault(XMLHttpRequest);
const copyProperties_1$1 = __importDefault(copyProperties_1);
const DOMParser_1 = __importDefault(DOMParser);
const TextDecoder_1 = __importDefault(TextDecoder);

function OffscreenCanvas() {
    // @ts-ignore
    return wx.createOffscreenCanvas();
}
class WechatPlatform extends Platform_1.Platform {
    constructor(canvas, width, height) {
        super();
        this.enabledDeviceMotion = false;
        const systemInfo = wx.getSystemInfoSync();
        const isAndroid = systemInfo.platform === 'android';
        // @ts-ignore
        this.canvas = canvas;
        this.canvasW = width === undefined ? canvas.width : width;
        this.canvasH = height === undefined ? canvas.height : height;
        const document = {
            createElementNS(_, type) {
                if (type === 'canvas')
                    return canvas;
                if (type === 'img')
                    return canvas.createImage();
            },
        };
        const $URL = new URL_1.default();
        const window = {
            innerWidth: systemInfo.windowWidth,
            innerHeight: systemInfo.windowHeight,
            devicePixelRatio: systemInfo.pixelRatio,
            AudioContext: function () { },
            requestAnimationFrame: this.canvas.requestAnimationFrame,
            cancelAnimationFrame: this.canvas.cancelAnimationFrame,
            DeviceOrientationEvent: {
                requestPermission() {
                    return Promise.resolve('granted');
                },
            },
            URL: $URL,
            DOMParser: DOMParser_1.default,
            TextDecoder: TextDecoder_1.default,
        };
        [canvas, document, window].forEach(i => {
            // @ts-ignore
            const old = i.__proto__;
            // @ts-ignore
            i.__proto__ = {};
            // @ts-ignore
            i.__proto__.__proto__ = old;
            // @ts-ignore
            copyProperties_1$1.default(i.__proto__, EventTarget_1.default.prototype);
        });
        this.polyfill = {
            // @ts-expect-error
            Blob: Blob_1.default,
            window,
            document,
            // @ts-expect-error
            DOMParser: DOMParser_1.default,
            // @ts-expect-error
            TextDecoder: TextDecoder_1.default,
            // @ts-expect-error
            XMLHttpRequest: XMLHttpRequest_1.default,
            OffscreenCanvas,
            // @ts-expect-error
            URL: $URL,
            atob: atob_1$1.default,
            createImageBitmap: undefined,
            cancelAnimationFrame: window.cancelAnimationFrame,
            requestAnimationFrame: window.requestAnimationFrame,
        };
        this.patchCanvas();
        this.onDeviceMotionChange = e => {
            e.type = 'deviceorientation';
            if (isAndroid) {
                e.alpha *= -1;
                e.beta *= -1;
                e.gamma *= -1;
            }
            window.dispatchEvent(e);
        };
    }
    patchCanvas() {
        const { canvasH, canvasW } = this;
        Object.defineProperty(this.canvas, 'style', {
            get() {
                return {
                    width: this.width + 'px',
                    height: this.height + 'px',
                };
            },
        });
        Object.defineProperty(this.canvas, 'clientHeight', {
            get() {
                return canvasH || this.height;
            },
        });
        Object.defineProperty(this.canvas, 'clientWidth', {
            get() {
                return canvasW || this.width;
            },
        });
        // @ts-ignore
        this.canvas.ownerDocument = this.document;
    }
    // 某些情况下IOS会不success不触发。。。
    patchXHR() {
        XMLHttpRequest_1.default.useFetchPatch = true;
        return this;
    }
    enableDeviceOrientation(interval) {
        return new Promise((resolve, reject) => {
            wx.onDeviceMotionChange(this.onDeviceMotionChange);
            wx.startDeviceMotionListening({
                interval,
                success: e => {
                    resolve(e);
                    this.enabledDeviceMotion = true;
                },
                fail: reject,
            });
        });
    }
    disableDeviceOrientation() {
        return new Promise((resolve, reject) => {
            wx.offDeviceMotionChange(this.onDeviceMotionChange);
            this.enabledDeviceMotion &&
                wx.stopDeviceMotionListening({
                    success: () => {
                        resolve(true);
                        this.enabledDeviceMotion = false;
                    },
                    fail: reject,
                });
        });
    }
    dispatchTouchEvent(e = {
        touches: [],
        changedTouches: [],
        timeStamp: 0,
        type: '',
    }) {
        const target = Object.assign({}, this);
        const changedTouches = e.changedTouches.map(touch => new EventTarget_1.Touch(touch));
        const event = {
            changedTouches: changedTouches,
            touches: e.touches.map(touch => new EventTarget_1.Touch(touch)),
            targetTouches: Array.prototype.slice.call(e.touches.map(touch => new EventTarget_1.Touch(touch))),
            timeStamp: e.timeStamp,
            target: target,
            currentTarget: target,
            type: e.type,
            cancelBubble: false,
            cancelable: false,
        };
        this.canvas.dispatchEvent(event);
        if (changedTouches.length) {
            const touch = changedTouches[0];
            const pointerEvent = {
                pageX: touch.pageX,
                pageY: touch.pageY,
                pointerId: touch.identifier,
                type: {
                    touchstart: 'pointerdown',
                    touchmove: 'pointermove',
                    touchend: 'pointerup',
                }[e.type] || '',
                pointerType: 'touch',
            };
            this.canvas.dispatchEvent(pointerEvent);
        }
    }
    dispose() {
        this.disableDeviceOrientation();
        // 缓解ios内存泄漏, 前后进出页面多几次，降低pixelRatio也可行
        this.canvas.width = 0;
        this.canvas.height = 0;
        // @ts-ignore
        if (this.canvas)
            this.canvas.ownerDocument = null;
        // @ts-ignore
        this.onDeviceMotionChange = null;
        // @ts-ignore
        this.canvas = null;
    }
}
exports.WechatPlatform = WechatPlatform;
});

class GLTFLoader extends three.Loader {

	constructor( manager ) {

		super( manager );

		this.dracoLoader = null;
		this.ktx2Loader = null;
		this.meshoptDecoder = null;

		this.pluginCallbacks = [];

		this.register( function ( parser ) {

			return new GLTFMaterialsClearcoatExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFTextureBasisUExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFTextureWebPExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFMaterialsTransmissionExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFMaterialsVolumeExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFMaterialsIorExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFMaterialsSpecularExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFLightsExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFMeshoptCompression( parser );

		} );

	}

	load( url, onLoad, onProgress, onError ) {

		const scope = this;

		let resourcePath;

		if ( this.resourcePath !== '' ) {

			resourcePath = this.resourcePath;

		} else if ( this.path !== '' ) {

			resourcePath = this.path;

		} else {

			resourcePath = three.LoaderUtils.extractUrlBase( url );

		}

		// Tells the LoadingManager to track an extra item, which resolves after
		// the model is fully loaded. This means the count of items loaded will
		// be incorrect, but ensures manager.onLoad() does not fire early.
		this.manager.itemStart( url );

		const _onError = function ( e ) {

			if ( onError ) {

				onError( e );

			} else {

				console.error( e );

			}

			scope.manager.itemError( url );
			scope.manager.itemEnd( url );

		};

		const loader = new three.FileLoader( this.manager );

		loader.setPath( this.path );
		loader.setResponseType( 'arraybuffer' );
		loader.setRequestHeader( this.requestHeader );
		loader.setWithCredentials( this.withCredentials );

		loader.load( url, function ( data ) {

			try {

				scope.parse( data, resourcePath, function ( gltf ) {

					onLoad( gltf );

					scope.manager.itemEnd( url );

				}, _onError );

			} catch ( e ) {

				_onError( e );

			}

		}, onProgress, _onError );

	}

	setDRACOLoader( dracoLoader ) {

		this.dracoLoader = dracoLoader;
		return this;

	}

	setDDSLoader() {

		throw new Error(

			'THREE.GLTFLoader: "MSFT_texture_dds" no longer supported. Please update to "KHR_texture_basisu".'

		);

	}

	setKTX2Loader( ktx2Loader ) {

		this.ktx2Loader = ktx2Loader;
		return this;

	}

	setMeshoptDecoder( meshoptDecoder ) {

		this.meshoptDecoder = meshoptDecoder;
		return this;

	}

	register( callback ) {

		if ( this.pluginCallbacks.indexOf( callback ) === - 1 ) {

			this.pluginCallbacks.push( callback );

		}

		return this;

	}

	unregister( callback ) {

		if ( this.pluginCallbacks.indexOf( callback ) !== - 1 ) {

			this.pluginCallbacks.splice( this.pluginCallbacks.indexOf( callback ), 1 );

		}

		return this;

	}

	parse( data, path, onLoad, onError ) {

		let content;
		const extensions = {};
		const plugins = {};

		if ( typeof data === 'string' ) {

			content = data;

		} else {

			const magic = three.LoaderUtils.decodeText( new Uint8Array( data, 0, 4 ) );

			if ( magic === BINARY_EXTENSION_HEADER_MAGIC ) {

				try {

					extensions[ EXTENSIONS.KHR_BINARY_GLTF ] = new GLTFBinaryExtension( data );

				} catch ( error ) {

					if ( onError ) onError( error );
					return;

				}

				content = extensions[ EXTENSIONS.KHR_BINARY_GLTF ].content;

			} else {

				content = three.LoaderUtils.decodeText( new Uint8Array( data ) );

			}

		}

		const json = JSON.parse( content );

		if ( json.asset === undefined || json.asset.version[ 0 ] < 2 ) {

			if ( onError ) onError( new Error( 'THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported.' ) );
			return;

		}

		const parser = new GLTFParser( json, {

			path: path || this.resourcePath || '',
			crossOrigin: this.crossOrigin,
			requestHeader: this.requestHeader,
			manager: this.manager,
			ktx2Loader: this.ktx2Loader,
			meshoptDecoder: this.meshoptDecoder

		} );

		parser.fileLoader.setRequestHeader( this.requestHeader );

		for ( let i = 0; i < this.pluginCallbacks.length; i ++ ) {

			const plugin = this.pluginCallbacks[ i ]( parser );
			plugins[ plugin.name ] = plugin;

			// Workaround to avoid determining as unknown extension
			// in addUnknownExtensionsToUserData().
			// Remove this workaround if we move all the existing
			// extension handlers to plugin system
			extensions[ plugin.name ] = true;

		}

		if ( json.extensionsUsed ) {

			for ( let i = 0; i < json.extensionsUsed.length; ++ i ) {

				const extensionName = json.extensionsUsed[ i ];
				const extensionsRequired = json.extensionsRequired || [];

				switch ( extensionName ) {

					case EXTENSIONS.KHR_MATERIALS_UNLIT:
						extensions[ extensionName ] = new GLTFMaterialsUnlitExtension();
						break;

					case EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS:
						extensions[ extensionName ] = new GLTFMaterialsPbrSpecularGlossinessExtension();
						break;

					case EXTENSIONS.KHR_DRACO_MESH_COMPRESSION:
						extensions[ extensionName ] = new GLTFDracoMeshCompressionExtension( json, this.dracoLoader );
						break;

					case EXTENSIONS.KHR_TEXTURE_TRANSFORM:
						extensions[ extensionName ] = new GLTFTextureTransformExtension();
						break;

					case EXTENSIONS.KHR_MESH_QUANTIZATION:
						extensions[ extensionName ] = new GLTFMeshQuantizationExtension();
						break;

					default:

						if ( extensionsRequired.indexOf( extensionName ) >= 0 && plugins[ extensionName ] === undefined ) {

							console.warn( 'THREE.GLTFLoader: Unknown extension "' + extensionName + '".' );

						}

				}

			}

		}

		parser.setExtensions( extensions );
		parser.setPlugins( plugins );
		parser.parse( onLoad, onError );

	}

}

/* GLTFREGISTRY */

function GLTFRegistry() {

	let objects = {};

	return	{

		get: function ( key ) {

			return objects[ key ];

		},

		add: function ( key, object ) {

			objects[ key ] = object;

		},

		remove: function ( key ) {

			delete objects[ key ];

		},

		removeAll: function () {

			objects = {};

		}

	};

}

/*********************************/
/********** EXTENSIONS ***********/
/*********************************/

const EXTENSIONS = {
	KHR_BINARY_GLTF: 'KHR_binary_glTF',
	KHR_DRACO_MESH_COMPRESSION: 'KHR_draco_mesh_compression',
	KHR_LIGHTS_PUNCTUAL: 'KHR_lights_punctual',
	KHR_MATERIALS_CLEARCOAT: 'KHR_materials_clearcoat',
	KHR_MATERIALS_IOR: 'KHR_materials_ior',
	KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS: 'KHR_materials_pbrSpecularGlossiness',
	KHR_MATERIALS_SPECULAR: 'KHR_materials_specular',
	KHR_MATERIALS_TRANSMISSION: 'KHR_materials_transmission',
	KHR_MATERIALS_UNLIT: 'KHR_materials_unlit',
	KHR_MATERIALS_VOLUME: 'KHR_materials_volume',
	KHR_TEXTURE_BASISU: 'KHR_texture_basisu',
	KHR_TEXTURE_TRANSFORM: 'KHR_texture_transform',
	KHR_MESH_QUANTIZATION: 'KHR_mesh_quantization',
	EXT_TEXTURE_WEBP: 'EXT_texture_webp',
	EXT_MESHOPT_COMPRESSION: 'EXT_meshopt_compression'
};

/**
 * Punctual Lights Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_lights_punctual
 */
class GLTFLightsExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_LIGHTS_PUNCTUAL;

		// Object3D instance caches
		this.cache = { refs: {}, uses: {} };

	}

	_markDefs() {

		const parser = this.parser;
		const nodeDefs = this.parser.json.nodes || [];

		for ( let nodeIndex = 0, nodeLength = nodeDefs.length; nodeIndex < nodeLength; nodeIndex ++ ) {

			const nodeDef = nodeDefs[ nodeIndex ];

			if ( nodeDef.extensions
					&& nodeDef.extensions[ this.name ]
					&& nodeDef.extensions[ this.name ].light !== undefined ) {

				parser._addNodeRef( this.cache, nodeDef.extensions[ this.name ].light );

			}

		}

	}

	_loadLight( lightIndex ) {

		const parser = this.parser;
		const cacheKey = 'light:' + lightIndex;
		let dependency = parser.cache.get( cacheKey );

		if ( dependency ) return dependency;

		const json = parser.json;
		const extensions = ( json.extensions && json.extensions[ this.name ] ) || {};
		const lightDefs = extensions.lights || [];
		const lightDef = lightDefs[ lightIndex ];
		let lightNode;

		const color = new three.Color( 0xffffff );

		if ( lightDef.color !== undefined ) color.fromArray( lightDef.color );

		const range = lightDef.range !== undefined ? lightDef.range : 0;

		switch ( lightDef.type ) {

			case 'directional':
				lightNode = new three.DirectionalLight( color );
				lightNode.target.position.set( 0, 0, - 1 );
				lightNode.add( lightNode.target );
				break;

			case 'point':
				lightNode = new three.PointLight( color );
				lightNode.distance = range;
				break;

			case 'spot':
				lightNode = new three.SpotLight( color );
				lightNode.distance = range;
				// Handle spotlight properties.
				lightDef.spot = lightDef.spot || {};
				lightDef.spot.innerConeAngle = lightDef.spot.innerConeAngle !== undefined ? lightDef.spot.innerConeAngle : 0;
				lightDef.spot.outerConeAngle = lightDef.spot.outerConeAngle !== undefined ? lightDef.spot.outerConeAngle : Math.PI / 4.0;
				lightNode.angle = lightDef.spot.outerConeAngle;
				lightNode.penumbra = 1.0 - lightDef.spot.innerConeAngle / lightDef.spot.outerConeAngle;
				lightNode.target.position.set( 0, 0, - 1 );
				lightNode.add( lightNode.target );
				break;

			default:
				throw new Error( 'THREE.GLTFLoader: Unexpected light type: ' + lightDef.type );

		}

		// Some lights (e.g. spot) default to a position other than the origin. Reset the position
		// here, because node-level parsing will only override position if explicitly specified.
		lightNode.position.set( 0, 0, 0 );

		lightNode.decay = 2;

		if ( lightDef.intensity !== undefined ) lightNode.intensity = lightDef.intensity;

		lightNode.name = parser.createUniqueName( lightDef.name || ( 'light_' + lightIndex ) );

		dependency = Promise.resolve( lightNode );

		parser.cache.add( cacheKey, dependency );

		return dependency;

	}

	createNodeAttachment( nodeIndex ) {

		const self = this;
		const parser = this.parser;
		const json = parser.json;
		const nodeDef = json.nodes[ nodeIndex ];
		const lightDef = ( nodeDef.extensions && nodeDef.extensions[ this.name ] ) || {};
		const lightIndex = lightDef.light;

		if ( lightIndex === undefined ) return null;

		return this._loadLight( lightIndex ).then( function ( light ) {

			return parser._getNodeRef( self.cache, lightIndex, light );

		} );

	}

}

/**
 * Unlit Materials Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_unlit
 */
class GLTFMaterialsUnlitExtension {

	constructor() {

		this.name = EXTENSIONS.KHR_MATERIALS_UNLIT;

	}

	getMaterialType() {

		return three.MeshBasicMaterial;

	}

	extendParams( materialParams, materialDef, parser ) {

		const pending = [];

		materialParams.color = new three.Color( 1.0, 1.0, 1.0 );
		materialParams.opacity = 1.0;

		const metallicRoughness = materialDef.pbrMetallicRoughness;

		if ( metallicRoughness ) {

			if ( Array.isArray( metallicRoughness.baseColorFactor ) ) {

				const array = metallicRoughness.baseColorFactor;

				materialParams.color.fromArray( array );
				materialParams.opacity = array[ 3 ];

			}

			if ( metallicRoughness.baseColorTexture !== undefined ) {

				pending.push( parser.assignTexture( materialParams, 'map', metallicRoughness.baseColorTexture ) );

			}

		}

		return Promise.all( pending );

	}

}

/**
 * Clearcoat Materials Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_clearcoat
 */
class GLTFMaterialsClearcoatExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_CLEARCOAT;

	}

	getMaterialType( materialIndex ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) return null;

		return three.MeshPhysicalMaterial;

	}

	extendMaterialParams( materialIndex, materialParams ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) {

			return Promise.resolve();

		}

		const pending = [];

		const extension = materialDef.extensions[ this.name ];

		if ( extension.clearcoatFactor !== undefined ) {

			materialParams.clearcoat = extension.clearcoatFactor;

		}

		if ( extension.clearcoatTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'clearcoatMap', extension.clearcoatTexture ) );

		}

		if ( extension.clearcoatRoughnessFactor !== undefined ) {

			materialParams.clearcoatRoughness = extension.clearcoatRoughnessFactor;

		}

		if ( extension.clearcoatRoughnessTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'clearcoatRoughnessMap', extension.clearcoatRoughnessTexture ) );

		}

		if ( extension.clearcoatNormalTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'clearcoatNormalMap', extension.clearcoatNormalTexture ) );

			if ( extension.clearcoatNormalTexture.scale !== undefined ) {

				const scale = extension.clearcoatNormalTexture.scale;

				materialParams.clearcoatNormalScale = new three.Vector2( scale, scale );

			}

		}

		return Promise.all( pending );

	}

}

/**
 * Transmission Materials Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_transmission
 * Draft: https://github.com/KhronosGroup/glTF/pull/1698
 */
class GLTFMaterialsTransmissionExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_TRANSMISSION;

	}

	getMaterialType( materialIndex ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) return null;

		return three.MeshPhysicalMaterial;

	}

	extendMaterialParams( materialIndex, materialParams ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) {

			return Promise.resolve();

		}

		const pending = [];

		const extension = materialDef.extensions[ this.name ];

		if ( extension.transmissionFactor !== undefined ) {

			materialParams.transmission = extension.transmissionFactor;

		}

		if ( extension.transmissionTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'transmissionMap', extension.transmissionTexture ) );

		}

		return Promise.all( pending );

	}

}

/**
 * Materials Volume Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_volume
 */
class GLTFMaterialsVolumeExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_VOLUME;

	}

	getMaterialType( materialIndex ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) return null;

		return three.MeshPhysicalMaterial;

	}

	extendMaterialParams( materialIndex, materialParams ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) {

			return Promise.resolve();

		}

		const pending = [];

		const extension = materialDef.extensions[ this.name ];

		materialParams.thickness = extension.thicknessFactor !== undefined ? extension.thicknessFactor : 0;

		if ( extension.thicknessTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'thicknessMap', extension.thicknessTexture ) );

		}

		materialParams.attenuationDistance = extension.attenuationDistance || 0;

		const colorArray = extension.attenuationColor || [ 1, 1, 1 ];
		materialParams.attenuationTint = new three.Color( colorArray[ 0 ], colorArray[ 1 ], colorArray[ 2 ] );

		return Promise.all( pending );

	}

}

/**
 * Materials ior Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_ior
 */
class GLTFMaterialsIorExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_IOR;

	}

	getMaterialType( materialIndex ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) return null;

		return three.MeshPhysicalMaterial;

	}

	extendMaterialParams( materialIndex, materialParams ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) {

			return Promise.resolve();

		}

		const extension = materialDef.extensions[ this.name ];

		materialParams.ior = extension.ior !== undefined ? extension.ior : 1.5;

		return Promise.resolve();

	}

}

/**
 * Materials specular Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_specular
 */
class GLTFMaterialsSpecularExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_SPECULAR;

	}

	getMaterialType( materialIndex ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) return null;

		return three.MeshPhysicalMaterial;

	}

	extendMaterialParams( materialIndex, materialParams ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) {

			return Promise.resolve();

		}

		const pending = [];

		const extension = materialDef.extensions[ this.name ];

		materialParams.specularIntensity = extension.specularFactor !== undefined ? extension.specularFactor : 1.0;

		if ( extension.specularTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'specularIntensityMap', extension.specularTexture ) );

		}

		const colorArray = extension.specularColorFactor || [ 1, 1, 1 ];
		materialParams.specularTint = new three.Color( colorArray[ 0 ], colorArray[ 1 ], colorArray[ 2 ] );

		if ( extension.specularColorTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'specularTintMap', extension.specularColorTexture ).then( function ( texture ) {

				texture.encoding = three.sRGBEncoding;

			} ) );

		}

		return Promise.all( pending );

	}

}

/**
 * BasisU Texture Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_texture_basisu
 */
class GLTFTextureBasisUExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_TEXTURE_BASISU;

	}

	loadTexture( textureIndex ) {

		const parser = this.parser;
		const json = parser.json;

		const textureDef = json.textures[ textureIndex ];

		if ( ! textureDef.extensions || ! textureDef.extensions[ this.name ] ) {

			return null;

		}

		const extension = textureDef.extensions[ this.name ];
		const source = json.images[ extension.source ];
		const loader = parser.options.ktx2Loader;

		if ( ! loader ) {

			if ( json.extensionsRequired && json.extensionsRequired.indexOf( this.name ) >= 0 ) {

				throw new Error( 'THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures' );

			} else {

				// Assumes that the extension is optional and that a fallback texture is present
				return null;

			}

		}

		return parser.loadTextureImage( textureIndex, source, loader );

	}

}

/**
 * WebP Texture Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Vendor/EXT_texture_webp
 */
class GLTFTextureWebPExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.EXT_TEXTURE_WEBP;
		this.isSupported = null;

	}

	loadTexture( textureIndex ) {

		const name = this.name;
		const parser = this.parser;
		const json = parser.json;

		const textureDef = json.textures[ textureIndex ];

		if ( ! textureDef.extensions || ! textureDef.extensions[ name ] ) {

			return null;

		}

		const extension = textureDef.extensions[ name ];
		const source = json.images[ extension.source ];

		let loader = parser.textureLoader;
		if ( source.uri ) {

			const handler = parser.options.manager.getHandler( source.uri );
			if ( handler !== null ) loader = handler;

		}

		return this.detectSupport().then( function ( isSupported ) {

			if ( isSupported ) return parser.loadTextureImage( textureIndex, source, loader );

			if ( json.extensionsRequired && json.extensionsRequired.indexOf( name ) >= 0 ) {

				throw new Error( 'THREE.GLTFLoader: WebP required by asset but unsupported.' );

			}

			// Fall back to PNG or JPEG.
			return parser.loadTexture( textureIndex );

		} );

	}

	detectSupport() {

		if ( ! this.isSupported ) {

			this.isSupported = new Promise( function ( resolve ) {

				const image = new Image();

				// Lossy test image. Support for lossy images doesn't guarantee support for all
				// WebP images, unfortunately.
				image.src = 'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA';

				image.onload = image.onerror = function () {

					resolve( image.height === 1 );

				};

			} );

		}

		return this.isSupported;

	}

}

/**
 * meshopt BufferView Compression Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Vendor/EXT_meshopt_compression
 */
class GLTFMeshoptCompression {

	constructor( parser ) {

		this.name = EXTENSIONS.EXT_MESHOPT_COMPRESSION;
		this.parser = parser;

	}

	loadBufferView( index ) {

		const json = this.parser.json;
		const bufferView = json.bufferViews[ index ];

		if ( bufferView.extensions && bufferView.extensions[ this.name ] ) {

			const extensionDef = bufferView.extensions[ this.name ];

			const buffer = this.parser.getDependency( 'buffer', extensionDef.buffer );
			const decoder = this.parser.options.meshoptDecoder;

			if ( ! decoder || ! decoder.supported ) {

				if ( json.extensionsRequired && json.extensionsRequired.indexOf( this.name ) >= 0 ) {

					throw new Error( 'THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files' );

				} else {

					// Assumes that the extension is optional and that fallback buffer data is present
					return null;

				}

			}

			return Promise.all( [ buffer, decoder.ready ] ).then( function ( res ) {

				const byteOffset = extensionDef.byteOffset || 0;
				const byteLength = extensionDef.byteLength || 0;

				const count = extensionDef.count;
				const stride = extensionDef.byteStride;

				const result = new ArrayBuffer( count * stride );
				const source = new Uint8Array( res[ 0 ], byteOffset, byteLength );

				decoder.decodeGltfBuffer( new Uint8Array( result ), count, stride, source, extensionDef.mode, extensionDef.filter );
				return result;

			} );

		} else {

			return null;

		}

	}

}

/* BINARY EXTENSION */
const BINARY_EXTENSION_HEADER_MAGIC = 'glTF';
const BINARY_EXTENSION_HEADER_LENGTH = 12;
const BINARY_EXTENSION_CHUNK_TYPES = { JSON: 0x4E4F534A, BIN: 0x004E4942 };

class GLTFBinaryExtension {

	constructor( data ) {

		this.name = EXTENSIONS.KHR_BINARY_GLTF;
		this.content = null;
		this.body = null;

		const headerView = new DataView( data, 0, BINARY_EXTENSION_HEADER_LENGTH );

		this.header = {
			magic: three.LoaderUtils.decodeText( new Uint8Array( data.slice( 0, 4 ) ) ),
			version: headerView.getUint32( 4, true ),
			length: headerView.getUint32( 8, true )
		};

		if ( this.header.magic !== BINARY_EXTENSION_HEADER_MAGIC ) {

			throw new Error( 'THREE.GLTFLoader: Unsupported glTF-Binary header.' );

		} else if ( this.header.version < 2.0 ) {

			throw new Error( 'THREE.GLTFLoader: Legacy binary file detected.' );

		}

		const chunkContentsLength = this.header.length - BINARY_EXTENSION_HEADER_LENGTH;
		const chunkView = new DataView( data, BINARY_EXTENSION_HEADER_LENGTH );
		let chunkIndex = 0;

		while ( chunkIndex < chunkContentsLength ) {

			const chunkLength = chunkView.getUint32( chunkIndex, true );
			chunkIndex += 4;

			const chunkType = chunkView.getUint32( chunkIndex, true );
			chunkIndex += 4;

			if ( chunkType === BINARY_EXTENSION_CHUNK_TYPES.JSON ) {

				const contentArray = new Uint8Array( data, BINARY_EXTENSION_HEADER_LENGTH + chunkIndex, chunkLength );
				this.content = three.LoaderUtils.decodeText( contentArray );

			} else if ( chunkType === BINARY_EXTENSION_CHUNK_TYPES.BIN ) {

				const byteOffset = BINARY_EXTENSION_HEADER_LENGTH + chunkIndex;
				this.body = data.slice( byteOffset, byteOffset + chunkLength );

			}

			// Clients must ignore chunks with unknown types.

			chunkIndex += chunkLength;

		}

		if ( this.content === null ) {

			throw new Error( 'THREE.GLTFLoader: JSON content not found.' );

		}

	}

}

/**
 * DRACO Mesh Compression Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_draco_mesh_compression
 */
class GLTFDracoMeshCompressionExtension {

	constructor( json, dracoLoader ) {

		if ( ! dracoLoader ) {

			throw new Error( 'THREE.GLTFLoader: No DRACOLoader instance provided.' );

		}

		this.name = EXTENSIONS.KHR_DRACO_MESH_COMPRESSION;
		this.json = json;
		this.dracoLoader = dracoLoader;
		this.dracoLoader.preload();

	}

	decodePrimitive( primitive, parser ) {

		const json = this.json;
		const dracoLoader = this.dracoLoader;
		const bufferViewIndex = primitive.extensions[ this.name ].bufferView;
		const gltfAttributeMap = primitive.extensions[ this.name ].attributes;
		const threeAttributeMap = {};
		const attributeNormalizedMap = {};
		const attributeTypeMap = {};

		for ( const attributeName in gltfAttributeMap ) {

			const threeAttributeName = ATTRIBUTES[ attributeName ] || attributeName.toLowerCase();

			threeAttributeMap[ threeAttributeName ] = gltfAttributeMap[ attributeName ];

		}

		for ( const attributeName in primitive.attributes ) {

			const threeAttributeName = ATTRIBUTES[ attributeName ] || attributeName.toLowerCase();

			if ( gltfAttributeMap[ attributeName ] !== undefined ) {

				const accessorDef = json.accessors[ primitive.attributes[ attributeName ] ];
				const componentType = WEBGL_COMPONENT_TYPES[ accessorDef.componentType ];

				attributeTypeMap[ threeAttributeName ] = componentType;
				attributeNormalizedMap[ threeAttributeName ] = accessorDef.normalized === true;

			}

		}

		return parser.getDependency( 'bufferView', bufferViewIndex ).then( function ( bufferView ) {

			return new Promise( function ( resolve ) {

				dracoLoader.decodeDracoFile( bufferView, function ( geometry ) {

					for ( const attributeName in geometry.attributes ) {

						const attribute = geometry.attributes[ attributeName ];
						const normalized = attributeNormalizedMap[ attributeName ];

						if ( normalized !== undefined ) attribute.normalized = normalized;

					}

					resolve( geometry );

				}, threeAttributeMap, attributeTypeMap );

			} );

		} );

	}

}

/**
 * Texture Transform Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_texture_transform
 */
class GLTFTextureTransformExtension {

	constructor() {

		this.name = EXTENSIONS.KHR_TEXTURE_TRANSFORM;

	}

	extendTexture( texture, transform ) {

		if ( transform.texCoord !== undefined ) {

			console.warn( 'THREE.GLTFLoader: Custom UV sets in "' + this.name + '" extension not yet supported.' );

		}

		if ( transform.offset === undefined && transform.rotation === undefined && transform.scale === undefined ) {

			// See https://github.com/mrdoob/three.js/issues/21819.
			return texture;

		}

		texture = texture.clone();

		if ( transform.offset !== undefined ) {

			texture.offset.fromArray( transform.offset );

		}

		if ( transform.rotation !== undefined ) {

			texture.rotation = transform.rotation;

		}

		if ( transform.scale !== undefined ) {

			texture.repeat.fromArray( transform.scale );

		}

		texture.needsUpdate = true;

		return texture;

	}

}

/**
 * Specular-Glossiness Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_pbrSpecularGlossiness
 */

/**
 * A sub class of StandardMaterial with some of the functionality
 * changed via the `onBeforeCompile` callback
 * @pailhead
 */
class GLTFMeshStandardSGMaterial extends three.MeshStandardMaterial {

	constructor( params ) {

		super();

		this.isGLTFSpecularGlossinessMaterial = true;

		//various chunks that need replacing
		const specularMapParsFragmentChunk = [
			'#ifdef USE_SPECULARMAP',
			'	uniform sampler2D specularMap;',
			'#endif'
		].join( '\n' );

		const glossinessMapParsFragmentChunk = [
			'#ifdef USE_GLOSSINESSMAP',
			'	uniform sampler2D glossinessMap;',
			'#endif'
		].join( '\n' );

		const specularMapFragmentChunk = [
			'vec3 specularFactor = specular;',
			'#ifdef USE_SPECULARMAP',
			'	vec4 texelSpecular = texture2D( specularMap, vUv );',
			'	texelSpecular = sRGBToLinear( texelSpecular );',
			'	// reads channel RGB, compatible with a glTF Specular-Glossiness (RGBA) texture',
			'	specularFactor *= texelSpecular.rgb;',
			'#endif'
		].join( '\n' );

		const glossinessMapFragmentChunk = [
			'float glossinessFactor = glossiness;',
			'#ifdef USE_GLOSSINESSMAP',
			'	vec4 texelGlossiness = texture2D( glossinessMap, vUv );',
			'	// reads channel A, compatible with a glTF Specular-Glossiness (RGBA) texture',
			'	glossinessFactor *= texelGlossiness.a;',
			'#endif'
		].join( '\n' );

		const lightPhysicalFragmentChunk = [
			'PhysicalMaterial material;',
			'material.diffuseColor = diffuseColor.rgb * ( 1. - max( specularFactor.r, max( specularFactor.g, specularFactor.b ) ) );',
			'vec3 dxy = max( abs( dFdx( geometryNormal ) ), abs( dFdy( geometryNormal ) ) );',
			'float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );',
			'material.roughness = max( 1.0 - glossinessFactor, 0.0525 ); // 0.0525 corresponds to the base mip of a 256 cubemap.',
			'material.roughness += geometryRoughness;',
			'material.roughness = min( material.roughness, 1.0 );',
			'material.specularColor = specularFactor;',
		].join( '\n' );

		const uniforms = {
			specular: { value: new three.Color().setHex( 0xffffff ) },
			glossiness: { value: 1 },
			specularMap: { value: null },
			glossinessMap: { value: null }
		};

		this._extraUniforms = uniforms;

		this.onBeforeCompile = function ( shader ) {

			for ( const uniformName in uniforms ) {

				shader.uniforms[ uniformName ] = uniforms[ uniformName ];

			}

			shader.fragmentShader = shader.fragmentShader
				.replace( 'uniform float roughness;', 'uniform vec3 specular;' )
				.replace( 'uniform float metalness;', 'uniform float glossiness;' )
				.replace( '#include <roughnessmap_pars_fragment>', specularMapParsFragmentChunk )
				.replace( '#include <metalnessmap_pars_fragment>', glossinessMapParsFragmentChunk )
				.replace( '#include <roughnessmap_fragment>', specularMapFragmentChunk )
				.replace( '#include <metalnessmap_fragment>', glossinessMapFragmentChunk )
				.replace( '#include <lights_physical_fragment>', lightPhysicalFragmentChunk );

		};

		Object.defineProperties( this, {

			specular: {
				get: function () {

					return uniforms.specular.value;

				},
				set: function ( v ) {

					uniforms.specular.value = v;

				}
			},

			specularMap: {
				get: function () {

					return uniforms.specularMap.value;

				},
				set: function ( v ) {

					uniforms.specularMap.value = v;

					if ( v ) {

						this.defines.USE_SPECULARMAP = ''; // USE_UV is set by the renderer for specular maps

					} else {

						delete this.defines.USE_SPECULARMAP;

					}

				}
			},

			glossiness: {
				get: function () {

					return uniforms.glossiness.value;

				},
				set: function ( v ) {

					uniforms.glossiness.value = v;

				}
			},

			glossinessMap: {
				get: function () {

					return uniforms.glossinessMap.value;

				},
				set: function ( v ) {

					uniforms.glossinessMap.value = v;

					if ( v ) {

						this.defines.USE_GLOSSINESSMAP = '';
						this.defines.USE_UV = '';

					} else {

						delete this.defines.USE_GLOSSINESSMAP;
						delete this.defines.USE_UV;

					}

				}
			}

		} );

		delete this.metalness;
		delete this.roughness;
		delete this.metalnessMap;
		delete this.roughnessMap;

		this.setValues( params );

	}

	copy( source ) {

		super.copy( source );

		this.specularMap = source.specularMap;
		this.specular.copy( source.specular );
		this.glossinessMap = source.glossinessMap;
		this.glossiness = source.glossiness;
		delete this.metalness;
		delete this.roughness;
		delete this.metalnessMap;
		delete this.roughnessMap;
		return this;

	}

}


class GLTFMaterialsPbrSpecularGlossinessExtension {

	constructor() {

		this.name = EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS;

		this.specularGlossinessParams = [
			'color',
			'map',
			'lightMap',
			'lightMapIntensity',
			'aoMap',
			'aoMapIntensity',
			'emissive',
			'emissiveIntensity',
			'emissiveMap',
			'bumpMap',
			'bumpScale',
			'normalMap',
			'normalMapType',
			'displacementMap',
			'displacementScale',
			'displacementBias',
			'specularMap',
			'specular',
			'glossinessMap',
			'glossiness',
			'alphaMap',
			'envMap',
			'envMapIntensity',
			'refractionRatio',
		];

	}

	getMaterialType() {

		return GLTFMeshStandardSGMaterial;

	}

	extendParams( materialParams, materialDef, parser ) {

		const pbrSpecularGlossiness = materialDef.extensions[ this.name ];

		materialParams.color = new three.Color( 1.0, 1.0, 1.0 );
		materialParams.opacity = 1.0;

		const pending = [];

		if ( Array.isArray( pbrSpecularGlossiness.diffuseFactor ) ) {

			const array = pbrSpecularGlossiness.diffuseFactor;

			materialParams.color.fromArray( array );
			materialParams.opacity = array[ 3 ];

		}

		if ( pbrSpecularGlossiness.diffuseTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'map', pbrSpecularGlossiness.diffuseTexture ) );

		}

		materialParams.emissive = new three.Color( 0.0, 0.0, 0.0 );
		materialParams.glossiness = pbrSpecularGlossiness.glossinessFactor !== undefined ? pbrSpecularGlossiness.glossinessFactor : 1.0;
		materialParams.specular = new three.Color( 1.0, 1.0, 1.0 );

		if ( Array.isArray( pbrSpecularGlossiness.specularFactor ) ) {

			materialParams.specular.fromArray( pbrSpecularGlossiness.specularFactor );

		}

		if ( pbrSpecularGlossiness.specularGlossinessTexture !== undefined ) {

			const specGlossMapDef = pbrSpecularGlossiness.specularGlossinessTexture;
			pending.push( parser.assignTexture( materialParams, 'glossinessMap', specGlossMapDef ) );
			pending.push( parser.assignTexture( materialParams, 'specularMap', specGlossMapDef ) );

		}

		return Promise.all( pending );

	}

	createMaterial( materialParams ) {

		const material = new GLTFMeshStandardSGMaterial( materialParams );
		material.fog = true;

		material.color = materialParams.color;

		material.map = materialParams.map === undefined ? null : materialParams.map;

		material.lightMap = null;
		material.lightMapIntensity = 1.0;

		material.aoMap = materialParams.aoMap === undefined ? null : materialParams.aoMap;
		material.aoMapIntensity = 1.0;

		material.emissive = materialParams.emissive;
		material.emissiveIntensity = 1.0;
		material.emissiveMap = materialParams.emissiveMap === undefined ? null : materialParams.emissiveMap;

		material.bumpMap = materialParams.bumpMap === undefined ? null : materialParams.bumpMap;
		material.bumpScale = 1;

		material.normalMap = materialParams.normalMap === undefined ? null : materialParams.normalMap;
		material.normalMapType = three.TangentSpaceNormalMap;

		if ( materialParams.normalScale ) material.normalScale = materialParams.normalScale;

		material.displacementMap = null;
		material.displacementScale = 1;
		material.displacementBias = 0;

		material.specularMap = materialParams.specularMap === undefined ? null : materialParams.specularMap;
		material.specular = materialParams.specular;

		material.glossinessMap = materialParams.glossinessMap === undefined ? null : materialParams.glossinessMap;
		material.glossiness = materialParams.glossiness;

		material.alphaMap = null;

		material.envMap = materialParams.envMap === undefined ? null : materialParams.envMap;
		material.envMapIntensity = 1.0;

		material.refractionRatio = 0.98;

		return material;

	}

}

/**
 * Mesh Quantization Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_mesh_quantization
 */
class GLTFMeshQuantizationExtension {

	constructor() {

		this.name = EXTENSIONS.KHR_MESH_QUANTIZATION;

	}

}

/*********************************/
/********** INTERPOLATION ********/
/*********************************/

// Spline Interpolation
// Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#appendix-c-spline-interpolation
class GLTFCubicSplineInterpolant extends three.Interpolant {

	constructor( parameterPositions, sampleValues, sampleSize, resultBuffer ) {

		super( parameterPositions, sampleValues, sampleSize, resultBuffer );

	}

	copySampleValue_( index ) {

		// Copies a sample value to the result buffer. See description of glTF
		// CUBICSPLINE values layout in interpolate_() function below.

		const result = this.resultBuffer,
			values = this.sampleValues,
			valueSize = this.valueSize,
			offset = index * valueSize * 3 + valueSize;

		for ( let i = 0; i !== valueSize; i ++ ) {

			result[ i ] = values[ offset + i ];

		}

		return result;

	}

}

GLTFCubicSplineInterpolant.prototype.beforeStart_ = GLTFCubicSplineInterpolant.prototype.copySampleValue_;

GLTFCubicSplineInterpolant.prototype.afterEnd_ = GLTFCubicSplineInterpolant.prototype.copySampleValue_;

GLTFCubicSplineInterpolant.prototype.interpolate_ = function ( i1, t0, t, t1 ) {

	const result = this.resultBuffer;
	const values = this.sampleValues;
	const stride = this.valueSize;

	const stride2 = stride * 2;
	const stride3 = stride * 3;

	const td = t1 - t0;

	const p = ( t - t0 ) / td;
	const pp = p * p;
	const ppp = pp * p;

	const offset1 = i1 * stride3;
	const offset0 = offset1 - stride3;

	const s2 = - 2 * ppp + 3 * pp;
	const s3 = ppp - pp;
	const s0 = 1 - s2;
	const s1 = s3 - pp + p;

	// Layout of keyframe output values for CUBICSPLINE animations:
	//   [ inTangent_1, splineVertex_1, outTangent_1, inTangent_2, splineVertex_2, ... ]
	for ( let i = 0; i !== stride; i ++ ) {

		const p0 = values[ offset0 + i + stride ]; // splineVertex_k
		const m0 = values[ offset0 + i + stride2 ] * td; // outTangent_k * (t_k+1 - t_k)
		const p1 = values[ offset1 + i + stride ]; // splineVertex_k+1
		const m1 = values[ offset1 + i ] * td; // inTangent_k+1 * (t_k+1 - t_k)

		result[ i ] = s0 * p0 + s1 * m0 + s2 * p1 + s3 * m1;

	}

	return result;

};

const _q = new three.Quaternion();

class GLTFCubicSplineQuaternionInterpolant extends GLTFCubicSplineInterpolant {

	interpolate_( i1, t0, t, t1 ) {

		const result = super.interpolate_( i1, t0, t, t1 );

		_q.fromArray( result ).normalize().toArray( result );

		return result;

	}

}


/*********************************/
/********** INTERNALS ************/
/*********************************/

/* CONSTANTS */

const WEBGL_CONSTANTS = {
	FLOAT: 5126,
	//FLOAT_MAT2: 35674,
	FLOAT_MAT3: 35675,
	FLOAT_MAT4: 35676,
	FLOAT_VEC2: 35664,
	FLOAT_VEC3: 35665,
	FLOAT_VEC4: 35666,
	LINEAR: 9729,
	REPEAT: 10497,
	SAMPLER_2D: 35678,
	POINTS: 0,
	LINES: 1,
	LINE_LOOP: 2,
	LINE_STRIP: 3,
	TRIANGLES: 4,
	TRIANGLE_STRIP: 5,
	TRIANGLE_FAN: 6,
	UNSIGNED_BYTE: 5121,
	UNSIGNED_SHORT: 5123
};

const WEBGL_COMPONENT_TYPES = {
	5120: Int8Array,
	5121: Uint8Array,
	5122: Int16Array,
	5123: Uint16Array,
	5125: Uint32Array,
	5126: Float32Array
};

const WEBGL_FILTERS = {
	9728: three.NearestFilter,
	9729: three.LinearFilter,
	9984: three.NearestMipmapNearestFilter,
	9985: three.LinearMipmapNearestFilter,
	9986: three.NearestMipmapLinearFilter,
	9987: three.LinearMipmapLinearFilter
};

const WEBGL_WRAPPINGS = {
	33071: three.ClampToEdgeWrapping,
	33648: three.MirroredRepeatWrapping,
	10497: three.RepeatWrapping
};

const WEBGL_TYPE_SIZES = {
	'SCALAR': 1,
	'VEC2': 2,
	'VEC3': 3,
	'VEC4': 4,
	'MAT2': 4,
	'MAT3': 9,
	'MAT4': 16
};

const ATTRIBUTES = {
	POSITION: 'position',
	NORMAL: 'normal',
	TANGENT: 'tangent',
	TEXCOORD_0: 'uv',
	TEXCOORD_1: 'uv2',
	COLOR_0: 'color',
	WEIGHTS_0: 'skinWeight',
	JOINTS_0: 'skinIndex',
};

const PATH_PROPERTIES = {
	scale: 'scale',
	translation: 'position',
	rotation: 'quaternion',
	weights: 'morphTargetInfluences'
};

const INTERPOLATION = {
	CUBICSPLINE: undefined, // We use a custom interpolant (GLTFCubicSplineInterpolation) for CUBICSPLINE tracks. Each
		                        // keyframe track will be initialized with a default interpolation type, then modified.
	LINEAR: three.InterpolateLinear,
	STEP: three.InterpolateDiscrete
};

const ALPHA_MODES = {
	OPAQUE: 'OPAQUE',
	MASK: 'MASK',
	BLEND: 'BLEND'
};

/* UTILITY FUNCTIONS */

function resolveURL( url, path ) {

	// Invalid URL
	if ( typeof url !== 'string' || url === '' ) return '';

	// Host Relative URL
	if ( /^https?:\/\//i.test( path ) && /^\//.test( url ) ) {

		path = path.replace( /(^https?:\/\/[^\/]+).*/i, '$1' );

	}

	// Absolute URL http://,https://,//
	if ( /^(https?:)?\/\//i.test( url ) ) return url;

	// Data URI
	if ( /^data:.*,.*$/i.test( url ) ) return url;

	// Blob URL
	if ( /^blob:.*$/i.test( url ) ) return url;

	// Relative URL
	return path + url;

}

/**
 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#default-material
 */
function createDefaultMaterial( cache ) {

	if ( cache[ 'DefaultMaterial' ] === undefined ) {

		cache[ 'DefaultMaterial' ] = new three.MeshStandardMaterial( {
			color: 0xFFFFFF,
			emissive: 0x000000,
			metalness: 1,
			roughness: 1,
			transparent: false,
			depthTest: true,
			side: three.FrontSide
		} );

	}

	return cache[ 'DefaultMaterial' ];

}

function addUnknownExtensionsToUserData( knownExtensions, object, objectDef ) {

	// Add unknown glTF extensions to an object's userData.

	for ( const name in objectDef.extensions ) {

		if ( knownExtensions[ name ] === undefined ) {

			object.userData.gltfExtensions = object.userData.gltfExtensions || {};
			object.userData.gltfExtensions[ name ] = objectDef.extensions[ name ];

		}

	}

}

/**
 * @param {Object3D|Material|BufferGeometry} object
 * @param {GLTF.definition} gltfDef
 */
function assignExtrasToUserData( object, gltfDef ) {

	if ( gltfDef.extras !== undefined ) {

		if ( typeof gltfDef.extras === 'object' ) {

			Object.assign( object.userData, gltfDef.extras );

		} else {

			console.warn( 'THREE.GLTFLoader: Ignoring primitive type .extras, ' + gltfDef.extras );

		}

	}

}

/**
 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#morph-targets
 *
 * @param {BufferGeometry} geometry
 * @param {Array<GLTF.Target>} targets
 * @param {GLTFParser} parser
 * @return {Promise<BufferGeometry>}
 */
function addMorphTargets( geometry, targets, parser ) {

	let hasMorphPosition = false;
	let hasMorphNormal = false;

	for ( let i = 0, il = targets.length; i < il; i ++ ) {

		const target = targets[ i ];

		if ( target.POSITION !== undefined ) hasMorphPosition = true;
		if ( target.NORMAL !== undefined ) hasMorphNormal = true;

		if ( hasMorphPosition && hasMorphNormal ) break;

	}

	if ( ! hasMorphPosition && ! hasMorphNormal ) return Promise.resolve( geometry );

	const pendingPositionAccessors = [];
	const pendingNormalAccessors = [];

	for ( let i = 0, il = targets.length; i < il; i ++ ) {

		const target = targets[ i ];

		if ( hasMorphPosition ) {

			const pendingAccessor = target.POSITION !== undefined
				? parser.getDependency( 'accessor', target.POSITION )
				: geometry.attributes.position;

			pendingPositionAccessors.push( pendingAccessor );

		}

		if ( hasMorphNormal ) {

			const pendingAccessor = target.NORMAL !== undefined
				? parser.getDependency( 'accessor', target.NORMAL )
				: geometry.attributes.normal;

			pendingNormalAccessors.push( pendingAccessor );

		}

	}

	return Promise.all( [
		Promise.all( pendingPositionAccessors ),
		Promise.all( pendingNormalAccessors )
	] ).then( function ( accessors ) {

		const morphPositions = accessors[ 0 ];
		const morphNormals = accessors[ 1 ];

		if ( hasMorphPosition ) geometry.morphAttributes.position = morphPositions;
		if ( hasMorphNormal ) geometry.morphAttributes.normal = morphNormals;
		geometry.morphTargetsRelative = true;

		return geometry;

	} );

}

/**
 * @param {Mesh} mesh
 * @param {GLTF.Mesh} meshDef
 */
function updateMorphTargets( mesh, meshDef ) {

	mesh.updateMorphTargets();

	if ( meshDef.weights !== undefined ) {

		for ( let i = 0, il = meshDef.weights.length; i < il; i ++ ) {

			mesh.morphTargetInfluences[ i ] = meshDef.weights[ i ];

		}

	}

	// .extras has user-defined data, so check that .extras.targetNames is an array.
	if ( meshDef.extras && Array.isArray( meshDef.extras.targetNames ) ) {

		const targetNames = meshDef.extras.targetNames;

		if ( mesh.morphTargetInfluences.length === targetNames.length ) {

			mesh.morphTargetDictionary = {};

			for ( let i = 0, il = targetNames.length; i < il; i ++ ) {

				mesh.morphTargetDictionary[ targetNames[ i ] ] = i;

			}

		} else {

			console.warn( 'THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.' );

		}

	}

}

function createPrimitiveKey( primitiveDef ) {

	const dracoExtension = primitiveDef.extensions && primitiveDef.extensions[ EXTENSIONS.KHR_DRACO_MESH_COMPRESSION ];
	let geometryKey;

	if ( dracoExtension ) {

		geometryKey = 'draco:' + dracoExtension.bufferView
				+ ':' + dracoExtension.indices
				+ ':' + createAttributesKey( dracoExtension.attributes );

	} else {

		geometryKey = primitiveDef.indices + ':' + createAttributesKey( primitiveDef.attributes ) + ':' + primitiveDef.mode;

	}

	return geometryKey;

}

function createAttributesKey( attributes ) {

	let attributesKey = '';

	const keys = Object.keys( attributes ).sort();

	for ( let i = 0, il = keys.length; i < il; i ++ ) {

		attributesKey += keys[ i ] + ':' + attributes[ keys[ i ] ] + ';';

	}

	return attributesKey;

}

function getNormalizedComponentScale( constructor ) {

	// Reference:
	// https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_mesh_quantization#encoding-quantized-data

	switch ( constructor ) {

		case Int8Array:
			return 1 / 127;

		case Uint8Array:
			return 1 / 255;

		case Int16Array:
			return 1 / 32767;

		case Uint16Array:
			return 1 / 65535;

		default:
			throw new Error( 'THREE.GLTFLoader: Unsupported normalized accessor component type.' );

	}

}

/* GLTF PARSER */

class GLTFParser {

	constructor( json = {}, options = {} ) {

		this.json = json;
		this.extensions = {};
		this.plugins = {};
		this.options = options;

		// loader object cache
		this.cache = new GLTFRegistry();

		// associations between Three.js objects and glTF elements
		this.associations = new Map();

		// BufferGeometry caching
		this.primitiveCache = {};

		// Object3D instance caches
		this.meshCache = { refs: {}, uses: {} };
		this.cameraCache = { refs: {}, uses: {} };
		this.lightCache = { refs: {}, uses: {} };

		this.textureCache = {};

		// Track node names, to ensure no duplicates
		this.nodeNamesUsed = {};

		// Use an ImageBitmapLoader if imageBitmaps are supported. Moves much of the
		// expensive work of uploading a texture to the GPU off the main thread.
		if ( typeof three._default.polyfill.createImageBitmap !== 'undefined' && /Firefox/.test( navigator.userAgent ) === false ) {

			this.textureLoader = new three.ImageBitmapLoader( this.options.manager );

		} else {

			this.textureLoader = new three.TextureLoader( this.options.manager );

		}

		this.textureLoader.setCrossOrigin( this.options.crossOrigin );
		this.textureLoader.setRequestHeader( this.options.requestHeader );

		this.fileLoader = new three.FileLoader( this.options.manager );
		this.fileLoader.setResponseType( 'arraybuffer' );

		if ( this.options.crossOrigin === 'use-credentials' ) {

			this.fileLoader.setWithCredentials( true );

		}

	}

	setExtensions( extensions ) {

		this.extensions = extensions;

	}

	setPlugins( plugins ) {

		this.plugins = plugins;

	}

	parse( onLoad, onError ) {

		const parser = this;
		const json = this.json;
		const extensions = this.extensions;

		// Clear the loader cache
		this.cache.removeAll();

		// Mark the special nodes/meshes in json for efficient parse
		this._invokeAll( function ( ext ) {

			return ext._markDefs && ext._markDefs();

		} );

		Promise.all( this._invokeAll( function ( ext ) {

			return ext.beforeRoot && ext.beforeRoot();

		} ) ).then( function () {

			return Promise.all( [

				parser.getDependencies( 'scene' ),
				parser.getDependencies( 'animation' ),
				parser.getDependencies( 'camera' ),

			] );

		} ).then( function ( dependencies ) {

			const result = {
				scene: dependencies[ 0 ][ json.scene || 0 ],
				scenes: dependencies[ 0 ],
				animations: dependencies[ 1 ],
				cameras: dependencies[ 2 ],
				asset: json.asset,
				parser: parser,
				userData: {}
			};

			addUnknownExtensionsToUserData( extensions, result, json );

			assignExtrasToUserData( result, json );

			Promise.all( parser._invokeAll( function ( ext ) {

				return ext.afterRoot && ext.afterRoot( result );

			} ) ).then( function () {

				onLoad( result );

			} );

		} ).catch( onError );

	}

	/**
	 * Marks the special nodes/meshes in json for efficient parse.
	 */
	_markDefs() {

		const nodeDefs = this.json.nodes || [];
		const skinDefs = this.json.skins || [];
		const meshDefs = this.json.meshes || [];

		// Nothing in the node definition indicates whether it is a Bone or an
		// Object3D. Use the skins' joint references to mark bones.
		for ( let skinIndex = 0, skinLength = skinDefs.length; skinIndex < skinLength; skinIndex ++ ) {

			const joints = skinDefs[ skinIndex ].joints;

			for ( let i = 0, il = joints.length; i < il; i ++ ) {

				nodeDefs[ joints[ i ] ].isBone = true;

			}

		}

		// Iterate over all nodes, marking references to shared resources,
		// as well as skeleton joints.
		for ( let nodeIndex = 0, nodeLength = nodeDefs.length; nodeIndex < nodeLength; nodeIndex ++ ) {

			const nodeDef = nodeDefs[ nodeIndex ];

			if ( nodeDef.mesh !== undefined ) {

				this._addNodeRef( this.meshCache, nodeDef.mesh );

				// Nothing in the mesh definition indicates whether it is
				// a SkinnedMesh or Mesh. Use the node's mesh reference
				// to mark SkinnedMesh if node has skin.
				if ( nodeDef.skin !== undefined ) {

					meshDefs[ nodeDef.mesh ].isSkinnedMesh = true;

				}

			}

			if ( nodeDef.camera !== undefined ) {

				this._addNodeRef( this.cameraCache, nodeDef.camera );

			}

		}

	}

	/**
	 * Counts references to shared node / Object3D resources. These resources
	 * can be reused, or "instantiated", at multiple nodes in the scene
	 * hierarchy. Mesh, Camera, and Light instances are instantiated and must
	 * be marked. Non-scenegraph resources (like Materials, Geometries, and
	 * Textures) can be reused directly and are not marked here.
	 *
	 * Example: CesiumMilkTruck sample model reuses "Wheel" meshes.
	 */
	_addNodeRef( cache, index ) {

		if ( index === undefined ) return;

		if ( cache.refs[ index ] === undefined ) {

			cache.refs[ index ] = cache.uses[ index ] = 0;

		}

		cache.refs[ index ] ++;

	}

	/** Returns a reference to a shared resource, cloning it if necessary. */
	_getNodeRef( cache, index, object ) {

		if ( cache.refs[ index ] <= 1 ) return object;

		const ref = object.clone();

		// Propagates mappings to the cloned object, prevents mappings on the
		// original object from being lost.
		const updateMappings = ( original, clone ) => {

			const mappings = this.associations.get( original );
			if ( mappings != null ) {

				this.associations.set( clone, mappings );

			}

			for ( const [ i, child ] of original.children.entries() ) {

				updateMappings( child, clone.children[ i ] );

			}

		};

		updateMappings( object, ref );

		ref.name += '_instance_' + ( cache.uses[ index ] ++ );

		return ref;

	}

	_invokeOne( func ) {

		const extensions = Object.values( this.plugins );
		extensions.push( this );

		for ( let i = 0; i < extensions.length; i ++ ) {

			const result = func( extensions[ i ] );

			if ( result ) return result;

		}

		return null;

	}

	_invokeAll( func ) {

		const extensions = Object.values( this.plugins );
		extensions.unshift( this );

		const pending = [];

		for ( let i = 0; i < extensions.length; i ++ ) {

			const result = func( extensions[ i ] );

			if ( result ) pending.push( result );

		}

		return pending;

	}

	/**
	 * Requests the specified dependency asynchronously, with caching.
	 * @param {string} type
	 * @param {number} index
	 * @return {Promise<Object3D|Material|THREE.Texture|AnimationClip|ArrayBuffer|Object>}
	 */
	getDependency( type, index ) {

		const cacheKey = type + ':' + index;
		let dependency = this.cache.get( cacheKey );

		if ( ! dependency ) {

			switch ( type ) {

				case 'scene':
					dependency = this.loadScene( index );
					break;

				case 'node':
					dependency = this.loadNode( index );
					break;

				case 'mesh':
					dependency = this._invokeOne( function ( ext ) {

						return ext.loadMesh && ext.loadMesh( index );

					} );
					break;

				case 'accessor':
					dependency = this.loadAccessor( index );
					break;

				case 'bufferView':
					dependency = this._invokeOne( function ( ext ) {

						return ext.loadBufferView && ext.loadBufferView( index );

					} );
					break;

				case 'buffer':
					dependency = this.loadBuffer( index );
					break;

				case 'material':
					dependency = this._invokeOne( function ( ext ) {

						return ext.loadMaterial && ext.loadMaterial( index );

					} );
					break;

				case 'texture':
					dependency = this._invokeOne( function ( ext ) {

						return ext.loadTexture && ext.loadTexture( index );

					} );
					break;

				case 'skin':
					dependency = this.loadSkin( index );
					break;

				case 'animation':
					dependency = this.loadAnimation( index );
					break;

				case 'camera':
					dependency = this.loadCamera( index );
					break;

				default:
					throw new Error( 'Unknown type: ' + type );

			}

			this.cache.add( cacheKey, dependency );

		}

		return dependency;

	}

	/**
	 * Requests all dependencies of the specified type asynchronously, with caching.
	 * @param {string} type
	 * @return {Promise<Array<Object>>}
	 */
	getDependencies( type ) {

		let dependencies = this.cache.get( type );

		if ( ! dependencies ) {

			const parser = this;
			const defs = this.json[ type + ( type === 'mesh' ? 'es' : 's' ) ] || [];

			dependencies = Promise.all( defs.map( function ( def, index ) {

				return parser.getDependency( type, index );

			} ) );

			this.cache.add( type, dependencies );

		}

		return dependencies;

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
	 * @param {number} bufferIndex
	 * @return {Promise<ArrayBuffer>}
	 */
	loadBuffer( bufferIndex ) {

		const bufferDef = this.json.buffers[ bufferIndex ];
		const loader = this.fileLoader;

		if ( bufferDef.type && bufferDef.type !== 'arraybuffer' ) {

			throw new Error( 'THREE.GLTFLoader: ' + bufferDef.type + ' buffer type is not supported.' );

		}

		// If present, GLB container is required to be the first buffer.
		if ( bufferDef.uri === undefined && bufferIndex === 0 ) {

			return Promise.resolve( this.extensions[ EXTENSIONS.KHR_BINARY_GLTF ].body );

		}

		const options = this.options;

		return new Promise( function ( resolve, reject ) {

			loader.load( resolveURL( bufferDef.uri, options.path ), resolve, undefined, function () {

				reject( new Error( 'THREE.GLTFLoader: Failed to load buffer "' + bufferDef.uri + '".' ) );

			} );

		} );

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
	 * @param {number} bufferViewIndex
	 * @return {Promise<ArrayBuffer>}
	 */
	loadBufferView( bufferViewIndex ) {

		const bufferViewDef = this.json.bufferViews[ bufferViewIndex ];

		return this.getDependency( 'buffer', bufferViewDef.buffer ).then( function ( buffer ) {

			const byteLength = bufferViewDef.byteLength || 0;
			const byteOffset = bufferViewDef.byteOffset || 0;
			return buffer.slice( byteOffset, byteOffset + byteLength );

		} );

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#accessors
	 * @param {number} accessorIndex
	 * @return {Promise<BufferAttribute|InterleavedBufferAttribute>}
	 */
	loadAccessor( accessorIndex ) {

		const parser = this;
		const json = this.json;

		const accessorDef = this.json.accessors[ accessorIndex ];

		if ( accessorDef.bufferView === undefined && accessorDef.sparse === undefined ) {

			// Ignore empty accessors, which may be used to declare runtime
			// information about attributes coming from another source (e.g. Draco
			// compression extension).
			return Promise.resolve( null );

		}

		const pendingBufferViews = [];

		if ( accessorDef.bufferView !== undefined ) {

			pendingBufferViews.push( this.getDependency( 'bufferView', accessorDef.bufferView ) );

		} else {

			pendingBufferViews.push( null );

		}

		if ( accessorDef.sparse !== undefined ) {

			pendingBufferViews.push( this.getDependency( 'bufferView', accessorDef.sparse.indices.bufferView ) );
			pendingBufferViews.push( this.getDependency( 'bufferView', accessorDef.sparse.values.bufferView ) );

		}

		return Promise.all( pendingBufferViews ).then( function ( bufferViews ) {

			const bufferView = bufferViews[ 0 ];

			const itemSize = WEBGL_TYPE_SIZES[ accessorDef.type ];
			const TypedArray = WEBGL_COMPONENT_TYPES[ accessorDef.componentType ];

			// For VEC3: itemSize is 3, elementBytes is 4, itemBytes is 12.
			const elementBytes = TypedArray.BYTES_PER_ELEMENT;
			const itemBytes = elementBytes * itemSize;
			const byteOffset = accessorDef.byteOffset || 0;
			const byteStride = accessorDef.bufferView !== undefined ? json.bufferViews[ accessorDef.bufferView ].byteStride : undefined;
			const normalized = accessorDef.normalized === true;
			let array, bufferAttribute;

			// The buffer is not interleaved if the stride is the item size in bytes.
			if ( byteStride && byteStride !== itemBytes ) {

				// Each "slice" of the buffer, as defined by 'count' elements of 'byteStride' bytes, gets its own InterleavedBuffer
				// This makes sure that IBA.count reflects accessor.count properly
				const ibSlice = Math.floor( byteOffset / byteStride );
				const ibCacheKey = 'InterleavedBuffer:' + accessorDef.bufferView + ':' + accessorDef.componentType + ':' + ibSlice + ':' + accessorDef.count;
				let ib = parser.cache.get( ibCacheKey );

				if ( ! ib ) {

					array = new TypedArray( bufferView, ibSlice * byteStride, accessorDef.count * byteStride / elementBytes );

					// Integer parameters to IB/IBA are in array elements, not bytes.
					ib = new three.InterleavedBuffer( array, byteStride / elementBytes );

					parser.cache.add( ibCacheKey, ib );

				}

				bufferAttribute = new three.InterleavedBufferAttribute( ib, itemSize, ( byteOffset % byteStride ) / elementBytes, normalized );

			} else {

				if ( bufferView === null ) {

					array = new TypedArray( accessorDef.count * itemSize );

				} else {

					array = new TypedArray( bufferView, byteOffset, accessorDef.count * itemSize );

				}

				bufferAttribute = new three.BufferAttribute( array, itemSize, normalized );

			}

			// https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#sparse-accessors
			if ( accessorDef.sparse !== undefined ) {

				const itemSizeIndices = WEBGL_TYPE_SIZES.SCALAR;
				const TypedArrayIndices = WEBGL_COMPONENT_TYPES[ accessorDef.sparse.indices.componentType ];

				const byteOffsetIndices = accessorDef.sparse.indices.byteOffset || 0;
				const byteOffsetValues = accessorDef.sparse.values.byteOffset || 0;

				const sparseIndices = new TypedArrayIndices( bufferViews[ 1 ], byteOffsetIndices, accessorDef.sparse.count * itemSizeIndices );
				const sparseValues = new TypedArray( bufferViews[ 2 ], byteOffsetValues, accessorDef.sparse.count * itemSize );

				if ( bufferView !== null ) {

					// Avoid modifying the original ArrayBuffer, if the bufferView wasn't initialized with zeroes.
					bufferAttribute = new three.BufferAttribute( bufferAttribute.array.slice(), bufferAttribute.itemSize, bufferAttribute.normalized );

				}

				for ( let i = 0, il = sparseIndices.length; i < il; i ++ ) {

					const index = sparseIndices[ i ];

					bufferAttribute.setX( index, sparseValues[ i * itemSize ] );
					if ( itemSize >= 2 ) bufferAttribute.setY( index, sparseValues[ i * itemSize + 1 ] );
					if ( itemSize >= 3 ) bufferAttribute.setZ( index, sparseValues[ i * itemSize + 2 ] );
					if ( itemSize >= 4 ) bufferAttribute.setW( index, sparseValues[ i * itemSize + 3 ] );
					if ( itemSize >= 5 ) throw new Error( 'THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.' );

				}

			}

			return bufferAttribute;

		} );

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#textures
	 * @param {number} textureIndex
	 * @return {Promise<THREE.Texture>}
	 */
	loadTexture( textureIndex ) {

		const json = this.json;
		const options = this.options;
		const textureDef = json.textures[ textureIndex ];
		const source = json.images[ textureDef.source ];

		let loader = this.textureLoader;

		if ( source.uri ) {

			const handler = options.manager.getHandler( source.uri );
			if ( handler !== null ) loader = handler;

		}

		return this.loadTextureImage( textureIndex, source, loader );

	}

	loadTextureImage( textureIndex, source, loader ) {

		const parser = this;
		const json = this.json;
		const options = this.options;

		const textureDef = json.textures[ textureIndex ];

		const cacheKey = ( source.uri || source.bufferView ) + ':' + textureDef.sampler;

		if ( this.textureCache[ cacheKey ] ) {

			// See https://github.com/mrdoob/three.js/issues/21559.
			return this.textureCache[ cacheKey ];

		}

		const URL = three._default.polyfill.URL || self.webkitURL;

		let sourceURI = source.uri || '';
		let isObjectURL = false;

		if ( source.bufferView !== undefined ) {

			// Load binary image data from bufferView, if provided.

			sourceURI = parser.getDependency( 'bufferView', source.bufferView ).then( function ( bufferView ) {

				isObjectURL = true;
				const blob = new three._default.polyfill.Blob( [ bufferView ], { type: source.mimeType } );
				sourceURI = URL.createObjectURL( blob );
				return sourceURI;

			} );

		} else if ( source.uri === undefined ) {

			throw new Error( 'THREE.GLTFLoader: Image ' + textureIndex + ' is missing URI and bufferView' );

		}

		const promise = Promise.resolve( sourceURI ).then( function ( sourceURI ) {

			return new Promise( function ( resolve, reject ) {

				let onLoad = resolve;

				if ( loader.isImageBitmapLoader === true ) {

					onLoad = function ( imageBitmap ) {

						const texture = new three.Texture( imageBitmap );
						texture.needsUpdate = true;

						resolve( texture );

					};

				}

				loader.load( resolveURL( sourceURI, options.path ), onLoad, undefined, reject );

			} );

		} ).then( function ( texture ) {

			// Clean up resources and configure Texture.

			if ( isObjectURL === true ) {

				URL.revokeObjectURL( sourceURI );

			}

			texture.flipY = false;

			if ( textureDef.name ) texture.name = textureDef.name;

			const samplers = json.samplers || {};
			const sampler = samplers[ textureDef.sampler ] || {};

			texture.magFilter = WEBGL_FILTERS[ sampler.magFilter ] || three.LinearFilter;
			texture.minFilter = WEBGL_FILTERS[ sampler.minFilter ] || three.LinearMipmapLinearFilter;
			texture.wrapS = WEBGL_WRAPPINGS[ sampler.wrapS ] || three.RepeatWrapping;
			texture.wrapT = WEBGL_WRAPPINGS[ sampler.wrapT ] || three.RepeatWrapping;

			parser.associations.set( texture, { textures: textureIndex } );

			return texture;

		} ).catch( function () {

			console.error( 'THREE.GLTFLoader: Couldn\'t load texture', sourceURI );
			return null;

		} );

		this.textureCache[ cacheKey ] = promise;

		return promise;

	}

	/**
	 * Asynchronously assigns a texture to the given material parameters.
	 * @param {Object} materialParams
	 * @param {string} mapName
	 * @param {Object} mapDef
	 * @return {Promise<Texture>}
	 */
	assignTexture( materialParams, mapName, mapDef ) {

		const parser = this;

		return this.getDependency( 'texture', mapDef.index ).then( function ( texture ) {

			// Materials sample aoMap from UV set 1 and other maps from UV set 0 - this can't be configured
			// However, we will copy UV set 0 to UV set 1 on demand for aoMap
			if ( mapDef.texCoord !== undefined && mapDef.texCoord != 0 && ! ( mapName === 'aoMap' && mapDef.texCoord == 1 ) ) {

				console.warn( 'THREE.GLTFLoader: Custom UV set ' + mapDef.texCoord + ' for texture ' + mapName + ' not yet supported.' );

			}

			if ( parser.extensions[ EXTENSIONS.KHR_TEXTURE_TRANSFORM ] ) {

				const transform = mapDef.extensions !== undefined ? mapDef.extensions[ EXTENSIONS.KHR_TEXTURE_TRANSFORM ] : undefined;

				if ( transform ) {

					const gltfReference = parser.associations.get( texture );
					texture = parser.extensions[ EXTENSIONS.KHR_TEXTURE_TRANSFORM ].extendTexture( texture, transform );
					parser.associations.set( texture, gltfReference );

				}

			}

			materialParams[ mapName ] = texture;

			return texture;

		} );

	}

	/**
	 * Assigns final material to a Mesh, Line, or Points instance. The instance
	 * already has a material (generated from the glTF material options alone)
	 * but reuse of the same glTF material may require multiple threejs materials
	 * to accommodate different primitive types, defines, etc. New materials will
	 * be created if necessary, and reused from a cache.
	 * @param  {Object3D} mesh Mesh, Line, or Points instance.
	 */
	assignFinalMaterial( mesh ) {

		const geometry = mesh.geometry;
		let material = mesh.material;

		const useDerivativeTangents = geometry.attributes.tangent === undefined;
		const useVertexColors = geometry.attributes.color !== undefined;
		const useFlatShading = geometry.attributes.normal === undefined;

		if ( mesh.isPoints ) {

			const cacheKey = 'PointsMaterial:' + material.uuid;

			let pointsMaterial = this.cache.get( cacheKey );

			if ( ! pointsMaterial ) {

				pointsMaterial = new three.PointsMaterial();
				three.Material.prototype.copy.call( pointsMaterial, material );
				pointsMaterial.color.copy( material.color );
				pointsMaterial.map = material.map;
				pointsMaterial.sizeAttenuation = false; // glTF spec says points should be 1px

				this.cache.add( cacheKey, pointsMaterial );

			}

			material = pointsMaterial;

		} else if ( mesh.isLine ) {

			const cacheKey = 'LineBasicMaterial:' + material.uuid;

			let lineMaterial = this.cache.get( cacheKey );

			if ( ! lineMaterial ) {

				lineMaterial = new three.LineBasicMaterial();
				three.Material.prototype.copy.call( lineMaterial, material );
				lineMaterial.color.copy( material.color );

				this.cache.add( cacheKey, lineMaterial );

			}

			material = lineMaterial;

		}

		// Clone the material if it will be modified
		if ( useDerivativeTangents || useVertexColors || useFlatShading ) {

			let cacheKey = 'ClonedMaterial:' + material.uuid + ':';

			if ( material.isGLTFSpecularGlossinessMaterial ) cacheKey += 'specular-glossiness:';
			if ( useDerivativeTangents ) cacheKey += 'derivative-tangents:';
			if ( useVertexColors ) cacheKey += 'vertex-colors:';
			if ( useFlatShading ) cacheKey += 'flat-shading:';

			let cachedMaterial = this.cache.get( cacheKey );

			if ( ! cachedMaterial ) {

				cachedMaterial = material.clone();

				if ( useVertexColors ) cachedMaterial.vertexColors = true;
				if ( useFlatShading ) cachedMaterial.flatShading = true;

				if ( useDerivativeTangents ) {

					// https://github.com/mrdoob/three.js/issues/11438#issuecomment-507003995
					if ( cachedMaterial.normalScale ) cachedMaterial.normalScale.y *= - 1;
					if ( cachedMaterial.clearcoatNormalScale ) cachedMaterial.clearcoatNormalScale.y *= - 1;

				}

				this.cache.add( cacheKey, cachedMaterial );

				this.associations.set( cachedMaterial, this.associations.get( material ) );

			}

			material = cachedMaterial;

		}

		// workarounds for mesh and geometry

		if ( material.aoMap && geometry.attributes.uv2 === undefined && geometry.attributes.uv !== undefined ) {

			geometry.setAttribute( 'uv2', geometry.attributes.uv );

		}

		mesh.material = material;

	}

	getMaterialType( /* materialIndex */ ) {

		return three.MeshStandardMaterial;

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#materials
	 * @param {number} materialIndex
	 * @return {Promise<Material>}
	 */
	loadMaterial( materialIndex ) {

		const parser = this;
		const json = this.json;
		const extensions = this.extensions;
		const materialDef = json.materials[ materialIndex ];

		let materialType;
		const materialParams = {};
		const materialExtensions = materialDef.extensions || {};

		const pending = [];

		if ( materialExtensions[ EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS ] ) {

			const sgExtension = extensions[ EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS ];
			materialType = sgExtension.getMaterialType();
			pending.push( sgExtension.extendParams( materialParams, materialDef, parser ) );

		} else if ( materialExtensions[ EXTENSIONS.KHR_MATERIALS_UNLIT ] ) {

			const kmuExtension = extensions[ EXTENSIONS.KHR_MATERIALS_UNLIT ];
			materialType = kmuExtension.getMaterialType();
			pending.push( kmuExtension.extendParams( materialParams, materialDef, parser ) );

		} else {

			// Specification:
			// https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#metallic-roughness-material

			const metallicRoughness = materialDef.pbrMetallicRoughness || {};

			materialParams.color = new three.Color( 1.0, 1.0, 1.0 );
			materialParams.opacity = 1.0;

			if ( Array.isArray( metallicRoughness.baseColorFactor ) ) {

				const array = metallicRoughness.baseColorFactor;

				materialParams.color.fromArray( array );
				materialParams.opacity = array[ 3 ];

			}

			if ( metallicRoughness.baseColorTexture !== undefined ) {

				pending.push( parser.assignTexture( materialParams, 'map', metallicRoughness.baseColorTexture ) );

			}

			materialParams.metalness = metallicRoughness.metallicFactor !== undefined ? metallicRoughness.metallicFactor : 1.0;
			materialParams.roughness = metallicRoughness.roughnessFactor !== undefined ? metallicRoughness.roughnessFactor : 1.0;

			if ( metallicRoughness.metallicRoughnessTexture !== undefined ) {

				pending.push( parser.assignTexture( materialParams, 'metalnessMap', metallicRoughness.metallicRoughnessTexture ) );
				pending.push( parser.assignTexture( materialParams, 'roughnessMap', metallicRoughness.metallicRoughnessTexture ) );

			}

			materialType = this._invokeOne( function ( ext ) {

				return ext.getMaterialType && ext.getMaterialType( materialIndex );

			} );

			pending.push( Promise.all( this._invokeAll( function ( ext ) {

				return ext.extendMaterialParams && ext.extendMaterialParams( materialIndex, materialParams );

			} ) ) );

		}

		if ( materialDef.doubleSided === true ) {

			materialParams.side = three.DoubleSide;

		}

		const alphaMode = materialDef.alphaMode || ALPHA_MODES.OPAQUE;

		if ( alphaMode === ALPHA_MODES.BLEND ) {

			materialParams.transparent = true;

			// See: https://github.com/mrdoob/three.js/issues/17706
			materialParams.depthWrite = false;

		} else {

			materialParams.format = three.RGBFormat;
			materialParams.transparent = false;

			if ( alphaMode === ALPHA_MODES.MASK ) {

				materialParams.alphaTest = materialDef.alphaCutoff !== undefined ? materialDef.alphaCutoff : 0.5;

			}

		}

		if ( materialDef.normalTexture !== undefined && materialType !== three.MeshBasicMaterial ) {

			pending.push( parser.assignTexture( materialParams, 'normalMap', materialDef.normalTexture ) );

			materialParams.normalScale = new three.Vector2( 1, 1 );

			if ( materialDef.normalTexture.scale !== undefined ) {

				const scale = materialDef.normalTexture.scale;

				materialParams.normalScale.set( scale, scale );

			}

		}

		if ( materialDef.occlusionTexture !== undefined && materialType !== three.MeshBasicMaterial ) {

			pending.push( parser.assignTexture( materialParams, 'aoMap', materialDef.occlusionTexture ) );

			if ( materialDef.occlusionTexture.strength !== undefined ) {

				materialParams.aoMapIntensity = materialDef.occlusionTexture.strength;

			}

		}

		if ( materialDef.emissiveFactor !== undefined && materialType !== three.MeshBasicMaterial ) {

			materialParams.emissive = new three.Color().fromArray( materialDef.emissiveFactor );

		}

		if ( materialDef.emissiveTexture !== undefined && materialType !== three.MeshBasicMaterial ) {

			pending.push( parser.assignTexture( materialParams, 'emissiveMap', materialDef.emissiveTexture ) );

		}

		return Promise.all( pending ).then( function () {

			let material;

			if ( materialType === GLTFMeshStandardSGMaterial ) {

				material = extensions[ EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS ].createMaterial( materialParams );

			} else {

				material = new materialType( materialParams );

			}

			if ( materialDef.name ) material.name = materialDef.name;

			// baseColorTexture, emissiveTexture, and specularGlossinessTexture use sRGB encoding.
			if ( material.map ) material.map.encoding = three.sRGBEncoding;
			if ( material.emissiveMap ) material.emissiveMap.encoding = three.sRGBEncoding;

			assignExtrasToUserData( material, materialDef );

			parser.associations.set( material, { materials: materialIndex } );

			if ( materialDef.extensions ) addUnknownExtensionsToUserData( extensions, material, materialDef );

			return material;

		} );

	}

	/** When Object3D instances are targeted by animation, they need unique names. */
	createUniqueName( originalName ) {

		const sanitizedName = three.PropertyBinding.sanitizeNodeName( originalName || '' );

		let name = sanitizedName;

		for ( let i = 1; this.nodeNamesUsed[ name ]; ++ i ) {

			name = sanitizedName + '_' + i;

		}

		this.nodeNamesUsed[ name ] = true;

		return name;

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#geometry
	 *
	 * Creates BufferGeometries from primitives.
	 *
	 * @param {Array<GLTF.Primitive>} primitives
	 * @return {Promise<Array<BufferGeometry>>}
	 */
	loadGeometries( primitives ) {

		const parser = this;
		const extensions = this.extensions;
		const cache = this.primitiveCache;

		function createDracoPrimitive( primitive ) {

			return extensions[ EXTENSIONS.KHR_DRACO_MESH_COMPRESSION ]
				.decodePrimitive( primitive, parser )
				.then( function ( geometry ) {

					return addPrimitiveAttributes( geometry, primitive, parser );

				} );

		}

		const pending = [];

		for ( let i = 0, il = primitives.length; i < il; i ++ ) {

			const primitive = primitives[ i ];
			const cacheKey = createPrimitiveKey( primitive );

			// See if we've already created this geometry
			const cached = cache[ cacheKey ];

			if ( cached ) {

				// Use the cached geometry if it exists
				pending.push( cached.promise );

			} else {

				let geometryPromise;

				if ( primitive.extensions && primitive.extensions[ EXTENSIONS.KHR_DRACO_MESH_COMPRESSION ] ) {

					// Use DRACO geometry if available
					geometryPromise = createDracoPrimitive( primitive );

				} else {

					// Otherwise create a new geometry
					geometryPromise = addPrimitiveAttributes( new three.BufferGeometry(), primitive, parser );

				}

				// Cache this geometry
				cache[ cacheKey ] = { primitive: primitive, promise: geometryPromise };

				pending.push( geometryPromise );

			}

		}

		return Promise.all( pending );

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#meshes
	 * @param {number} meshIndex
	 * @return {Promise<Group|Mesh|SkinnedMesh>}
	 */
	loadMesh( meshIndex ) {

		const parser = this;
		const json = this.json;
		const extensions = this.extensions;

		const meshDef = json.meshes[ meshIndex ];
		const primitives = meshDef.primitives;

		const pending = [];

		for ( let i = 0, il = primitives.length; i < il; i ++ ) {

			const material = primitives[ i ].material === undefined
				? createDefaultMaterial( this.cache )
				: this.getDependency( 'material', primitives[ i ].material );

			pending.push( material );

		}

		pending.push( parser.loadGeometries( primitives ) );

		return Promise.all( pending ).then( function ( results ) {

			const materials = results.slice( 0, results.length - 1 );
			const geometries = results[ results.length - 1 ];

			const meshes = [];

			for ( let i = 0, il = geometries.length; i < il; i ++ ) {

				const geometry = geometries[ i ];
				const primitive = primitives[ i ];

				// 1. create Mesh

				let mesh;

				const material = materials[ i ];

				if ( primitive.mode === WEBGL_CONSTANTS.TRIANGLES ||
						primitive.mode === WEBGL_CONSTANTS.TRIANGLE_STRIP ||
						primitive.mode === WEBGL_CONSTANTS.TRIANGLE_FAN ||
						primitive.mode === undefined ) {

					// .isSkinnedMesh isn't in glTF spec. See ._markDefs()
					mesh = meshDef.isSkinnedMesh === true
						? new three.SkinnedMesh( geometry, material )
						: new three.Mesh( geometry, material );

					if ( mesh.isSkinnedMesh === true && ! mesh.geometry.attributes.skinWeight.normalized ) {

						// we normalize floating point skin weight array to fix malformed assets (see #15319)
						// it's important to skip this for non-float32 data since normalizeSkinWeights assumes non-normalized inputs
						mesh.normalizeSkinWeights();

					}

					if ( primitive.mode === WEBGL_CONSTANTS.TRIANGLE_STRIP ) {

						mesh.geometry = toTrianglesDrawMode( mesh.geometry, three.TriangleStripDrawMode );

					} else if ( primitive.mode === WEBGL_CONSTANTS.TRIANGLE_FAN ) {

						mesh.geometry = toTrianglesDrawMode( mesh.geometry, three.TriangleFanDrawMode );

					}

				} else if ( primitive.mode === WEBGL_CONSTANTS.LINES ) {

					mesh = new three.LineSegments( geometry, material );

				} else if ( primitive.mode === WEBGL_CONSTANTS.LINE_STRIP ) {

					mesh = new three.Line( geometry, material );

				} else if ( primitive.mode === WEBGL_CONSTANTS.LINE_LOOP ) {

					mesh = new three.LineLoop( geometry, material );

				} else if ( primitive.mode === WEBGL_CONSTANTS.POINTS ) {

					mesh = new three.Points( geometry, material );

				} else {

					throw new Error( 'THREE.GLTFLoader: Primitive mode unsupported: ' + primitive.mode );

				}

				if ( Object.keys( mesh.geometry.morphAttributes ).length > 0 ) {

					updateMorphTargets( mesh, meshDef );

				}

				mesh.name = parser.createUniqueName( meshDef.name || ( 'mesh_' + meshIndex ) );

				assignExtrasToUserData( mesh, meshDef );

				if ( primitive.extensions ) addUnknownExtensionsToUserData( extensions, mesh, primitive );

				parser.assignFinalMaterial( mesh );

				meshes.push( mesh );

			}

			for ( let i = 0, il = meshes.length; i < il; i ++ ) {

				parser.associations.set( meshes[ i ], {
					meshes: meshIndex,
					primitives: i
				} );

			}

			if ( meshes.length === 1 ) {

				return meshes[ 0 ];

			}

			const group = new three.Group();

			parser.associations.set( group, { meshes: meshIndex } );

			for ( let i = 0, il = meshes.length; i < il; i ++ ) {

				group.add( meshes[ i ] );

			}

			return group;

		} );

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#cameras
	 * @param {number} cameraIndex
	 * @return {Promise<THREE.Camera>}
	 */
	loadCamera( cameraIndex ) {

		let camera;
		const cameraDef = this.json.cameras[ cameraIndex ];
		const params = cameraDef[ cameraDef.type ];

		if ( ! params ) {

			console.warn( 'THREE.GLTFLoader: Missing camera parameters.' );
			return;

		}

		if ( cameraDef.type === 'perspective' ) {

			camera = new three.PerspectiveCamera( three.MathUtils.radToDeg( params.yfov ), params.aspectRatio || 1, params.znear || 1, params.zfar || 2e6 );

		} else if ( cameraDef.type === 'orthographic' ) {

			camera = new three.OrthographicCamera( - params.xmag, params.xmag, params.ymag, - params.ymag, params.znear, params.zfar );

		}

		if ( cameraDef.name ) camera.name = this.createUniqueName( cameraDef.name );

		assignExtrasToUserData( camera, cameraDef );

		return Promise.resolve( camera );

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#skins
	 * @param {number} skinIndex
	 * @return {Promise<Object>}
	 */
	loadSkin( skinIndex ) {

		const skinDef = this.json.skins[ skinIndex ];

		const skinEntry = { joints: skinDef.joints };

		if ( skinDef.inverseBindMatrices === undefined ) {

			return Promise.resolve( skinEntry );

		}

		return this.getDependency( 'accessor', skinDef.inverseBindMatrices ).then( function ( accessor ) {

			skinEntry.inverseBindMatrices = accessor;

			return skinEntry;

		} );

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#animations
	 * @param {number} animationIndex
	 * @return {Promise<AnimationClip>}
	 */
	loadAnimation( animationIndex ) {

		const json = this.json;

		const animationDef = json.animations[ animationIndex ];

		const pendingNodes = [];
		const pendingInputAccessors = [];
		const pendingOutputAccessors = [];
		const pendingSamplers = [];
		const pendingTargets = [];

		for ( let i = 0, il = animationDef.channels.length; i < il; i ++ ) {

			const channel = animationDef.channels[ i ];
			const sampler = animationDef.samplers[ channel.sampler ];
			const target = channel.target;
			const name = target.node !== undefined ? target.node : target.id; // NOTE: target.id is deprecated.
			const input = animationDef.parameters !== undefined ? animationDef.parameters[ sampler.input ] : sampler.input;
			const output = animationDef.parameters !== undefined ? animationDef.parameters[ sampler.output ] : sampler.output;

			pendingNodes.push( this.getDependency( 'node', name ) );
			pendingInputAccessors.push( this.getDependency( 'accessor', input ) );
			pendingOutputAccessors.push( this.getDependency( 'accessor', output ) );
			pendingSamplers.push( sampler );
			pendingTargets.push( target );

		}

		return Promise.all( [

			Promise.all( pendingNodes ),
			Promise.all( pendingInputAccessors ),
			Promise.all( pendingOutputAccessors ),
			Promise.all( pendingSamplers ),
			Promise.all( pendingTargets )

		] ).then( function ( dependencies ) {

			const nodes = dependencies[ 0 ];
			const inputAccessors = dependencies[ 1 ];
			const outputAccessors = dependencies[ 2 ];
			const samplers = dependencies[ 3 ];
			const targets = dependencies[ 4 ];

			const tracks = [];

			for ( let i = 0, il = nodes.length; i < il; i ++ ) {

				const node = nodes[ i ];
				const inputAccessor = inputAccessors[ i ];
				const outputAccessor = outputAccessors[ i ];
				const sampler = samplers[ i ];
				const target = targets[ i ];

				if ( node === undefined ) continue;

				node.updateMatrix();
				node.matrixAutoUpdate = true;

				let TypedKeyframeTrack;

				switch ( PATH_PROPERTIES[ target.path ] ) {

					case PATH_PROPERTIES.weights:

						TypedKeyframeTrack = three.NumberKeyframeTrack;
						break;

					case PATH_PROPERTIES.rotation:

						TypedKeyframeTrack = three.QuaternionKeyframeTrack;
						break;

					case PATH_PROPERTIES.position:
					case PATH_PROPERTIES.scale:
					default:

						TypedKeyframeTrack = three.VectorKeyframeTrack;
						break;

				}

				const targetName = node.name ? node.name : node.uuid;

				const interpolation = sampler.interpolation !== undefined ? INTERPOLATION[ sampler.interpolation ] : three.InterpolateLinear;

				const targetNames = [];

				if ( PATH_PROPERTIES[ target.path ] === PATH_PROPERTIES.weights ) {

					// Node may be a Group (glTF mesh with several primitives) or a Mesh.
					node.traverse( function ( object ) {

						if ( object.isMesh === true && object.morphTargetInfluences ) {

							targetNames.push( object.name ? object.name : object.uuid );

						}

					} );

				} else {

					targetNames.push( targetName );

				}

				let outputArray = outputAccessor.array;

				if ( outputAccessor.normalized ) {

					const scale = getNormalizedComponentScale( outputArray.constructor );
					const scaled = new Float32Array( outputArray.length );

					for ( let j = 0, jl = outputArray.length; j < jl; j ++ ) {

						scaled[ j ] = outputArray[ j ] * scale;

					}

					outputArray = scaled;

				}

				for ( let j = 0, jl = targetNames.length; j < jl; j ++ ) {

					const track = new TypedKeyframeTrack(
						targetNames[ j ] + '.' + PATH_PROPERTIES[ target.path ],
						inputAccessor.array,
						outputArray,
						interpolation
					);

					// Override interpolation with custom factory method.
					if ( sampler.interpolation === 'CUBICSPLINE' ) {

						track.createInterpolant = function InterpolantFactoryMethodGLTFCubicSpline( result ) {

							// A CUBICSPLINE keyframe in glTF has three output values for each input value,
							// representing inTangent, splineVertex, and outTangent. As a result, track.getValueSize()
							// must be divided by three to get the interpolant's sampleSize argument.

							const interpolantType = ( this instanceof three.QuaternionKeyframeTrack ) ? GLTFCubicSplineQuaternionInterpolant : GLTFCubicSplineInterpolant;

							return new interpolantType( this.times, this.values, this.getValueSize() / 3, result );

						};

						// Mark as CUBICSPLINE. `track.getInterpolation()` doesn't support custom interpolants.
						track.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline = true;

					}

					tracks.push( track );

				}

			}

			const name = animationDef.name ? animationDef.name : 'animation_' + animationIndex;

			return new three.AnimationClip( name, undefined, tracks );

		} );

	}

	createNodeMesh( nodeIndex ) {

		const json = this.json;
		const parser = this;
		const nodeDef = json.nodes[ nodeIndex ];

		if ( nodeDef.mesh === undefined ) return null;

		return parser.getDependency( 'mesh', nodeDef.mesh ).then( function ( mesh ) {

			const node = parser._getNodeRef( parser.meshCache, nodeDef.mesh, mesh );

			// if weights are provided on the node, override weights on the mesh.
			if ( nodeDef.weights !== undefined ) {

				node.traverse( function ( o ) {

					if ( ! o.isMesh ) return;

					for ( let i = 0, il = nodeDef.weights.length; i < il; i ++ ) {

						o.morphTargetInfluences[ i ] = nodeDef.weights[ i ];

					}

				} );

			}

			return node;

		} );

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#nodes-and-hierarchy
	 * @param {number} nodeIndex
	 * @return {Promise<Object3D>}
	 */
	loadNode( nodeIndex ) {

		const json = this.json;
		const extensions = this.extensions;
		const parser = this;

		const nodeDef = json.nodes[ nodeIndex ];

		// reserve node's name before its dependencies, so the root has the intended name.
		const nodeName = nodeDef.name ? parser.createUniqueName( nodeDef.name ) : '';

		return ( function () {

			const pending = [];

			const meshPromise = parser._invokeOne( function ( ext ) {

				return ext.createNodeMesh && ext.createNodeMesh( nodeIndex );

			} );

			if ( meshPromise ) {

				pending.push( meshPromise );

			}

			if ( nodeDef.camera !== undefined ) {

				pending.push( parser.getDependency( 'camera', nodeDef.camera ).then( function ( camera ) {

					return parser._getNodeRef( parser.cameraCache, nodeDef.camera, camera );

				} ) );

			}

			parser._invokeAll( function ( ext ) {

				return ext.createNodeAttachment && ext.createNodeAttachment( nodeIndex );

			} ).forEach( function ( promise ) {

				pending.push( promise );

			} );

			return Promise.all( pending );

		}() ).then( function ( objects ) {

			let node;

			// .isBone isn't in glTF spec. See ._markDefs
			if ( nodeDef.isBone === true ) {

				node = new three.Bone();

			} else if ( objects.length > 1 ) {

				node = new three.Group();

			} else if ( objects.length === 1 ) {

				node = objects[ 0 ];

			} else {

				node = new three.Object3D();

			}

			if ( node !== objects[ 0 ] ) {

				for ( let i = 0, il = objects.length; i < il; i ++ ) {

					node.add( objects[ i ] );

				}

			}

			if ( nodeDef.name ) {

				node.userData.name = nodeDef.name;
				node.name = nodeName;

			}

			assignExtrasToUserData( node, nodeDef );

			if ( nodeDef.extensions ) addUnknownExtensionsToUserData( extensions, node, nodeDef );

			if ( nodeDef.matrix !== undefined ) {

				const matrix = new three.Matrix4();
				matrix.fromArray( nodeDef.matrix );
				node.applyMatrix4( matrix );

			} else {

				if ( nodeDef.translation !== undefined ) {

					node.position.fromArray( nodeDef.translation );

				}

				if ( nodeDef.rotation !== undefined ) {

					node.quaternion.fromArray( nodeDef.rotation );

				}

				if ( nodeDef.scale !== undefined ) {

					node.scale.fromArray( nodeDef.scale );

				}

			}

			if ( ! parser.associations.has( node ) ) {

				parser.associations.set( node, {} );

			}

			parser.associations.get( node ).nodes = nodeIndex;

			return node;

		} );

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#scenes
	 * @param {number} sceneIndex
	 * @return {Promise<Group>}
	 */
	loadScene( sceneIndex ) {

		const json = this.json;
		const extensions = this.extensions;
		const sceneDef = this.json.scenes[ sceneIndex ];
		const parser = this;

		// Loader returns Group, not Scene.
		// See: https://github.com/mrdoob/three.js/issues/18342#issuecomment-578981172
		const scene = new three.Group();
		if ( sceneDef.name ) scene.name = parser.createUniqueName( sceneDef.name );

		assignExtrasToUserData( scene, sceneDef );

		if ( sceneDef.extensions ) addUnknownExtensionsToUserData( extensions, scene, sceneDef );

		const nodeIds = sceneDef.nodes || [];

		const pending = [];

		for ( let i = 0, il = nodeIds.length; i < il; i ++ ) {

			pending.push( buildNodeHierarchy( nodeIds[ i ], scene, json, parser ) );

		}

		return Promise.all( pending ).then( function () {

			// Removes dangling associations, associations that reference a node that
			// didn't make it into the scene.
			const reduceAssociations = ( node ) => {

				const reducedAssociations = new Map();

				for ( const [ key, value ] of parser.associations ) {

					if ( key instanceof three.Material || key instanceof three.Texture ) {

						reducedAssociations.set( key, value );

					}

				}

				node.traverse( ( node ) => {

					const mappings = parser.associations.get( node );

					if ( mappings != null ) {

						reducedAssociations.set( node, mappings );

					}

				} );

				return reducedAssociations;

			};

			parser.associations = reduceAssociations( scene );

			return scene;

		} );

	}

}

function buildNodeHierarchy( nodeId, parentObject, json, parser ) {

	const nodeDef = json.nodes[ nodeId ];

	return parser.getDependency( 'node', nodeId ).then( function ( node ) {

		if ( nodeDef.skin === undefined ) return node;

		// build skeleton here as well

		let skinEntry;

		return parser.getDependency( 'skin', nodeDef.skin ).then( function ( skin ) {

			skinEntry = skin;

			const pendingJoints = [];

			for ( let i = 0, il = skinEntry.joints.length; i < il; i ++ ) {

				pendingJoints.push( parser.getDependency( 'node', skinEntry.joints[ i ] ) );

			}

			return Promise.all( pendingJoints );

		} ).then( function ( jointNodes ) {

			node.traverse( function ( mesh ) {

				if ( ! mesh.isMesh ) return;

				const bones = [];
				const boneInverses = [];

				for ( let j = 0, jl = jointNodes.length; j < jl; j ++ ) {

					const jointNode = jointNodes[ j ];

					if ( jointNode ) {

						bones.push( jointNode );

						const mat = new three.Matrix4();

						if ( skinEntry.inverseBindMatrices !== undefined ) {

							mat.fromArray( skinEntry.inverseBindMatrices.array, j * 16 );

						}

						boneInverses.push( mat );

					} else {

						console.warn( 'THREE.GLTFLoader: Joint "%s" could not be found.', skinEntry.joints[ j ] );

					}

				}

				mesh.bind( new three.Skeleton( bones, boneInverses ), mesh.matrixWorld );

			} );

			return node;

		} );

	} ).then( function ( node ) {

		// build node hierachy

		parentObject.add( node );

		const pending = [];

		if ( nodeDef.children ) {

			const children = nodeDef.children;

			for ( let i = 0, il = children.length; i < il; i ++ ) {

				const child = children[ i ];
				pending.push( buildNodeHierarchy( child, node, json, parser ) );

			}

		}

		return Promise.all( pending );

	} );

}

/**
 * @param {BufferGeometry} geometry
 * @param {GLTF.Primitive} primitiveDef
 * @param {GLTFParser} parser
 */
function computeBounds( geometry, primitiveDef, parser ) {

	const attributes = primitiveDef.attributes;

	const box = new three.Box3();

	if ( attributes.POSITION !== undefined ) {

		const accessor = parser.json.accessors[ attributes.POSITION ];

		const min = accessor.min;
		const max = accessor.max;

		// glTF requires 'min' and 'max', but VRM (which extends glTF) currently ignores that requirement.

		if ( min !== undefined && max !== undefined ) {

			box.set(
				new three.Vector3( min[ 0 ], min[ 1 ], min[ 2 ] ),
				new three.Vector3( max[ 0 ], max[ 1 ], max[ 2 ] )
			);

			if ( accessor.normalized ) {

				const boxScale = getNormalizedComponentScale( WEBGL_COMPONENT_TYPES[ accessor.componentType ] );
				box.min.multiplyScalar( boxScale );
				box.max.multiplyScalar( boxScale );

			}

		} else {

			console.warn( 'THREE.GLTFLoader: Missing min/max properties for accessor POSITION.' );

			return;

		}

	} else {

		return;

	}

	const targets = primitiveDef.targets;

	if ( targets !== undefined ) {

		const maxDisplacement = new three.Vector3();
		const vector = new three.Vector3();

		for ( let i = 0, il = targets.length; i < il; i ++ ) {

			const target = targets[ i ];

			if ( target.POSITION !== undefined ) {

				const accessor = parser.json.accessors[ target.POSITION ];
				const min = accessor.min;
				const max = accessor.max;

				// glTF requires 'min' and 'max', but VRM (which extends glTF) currently ignores that requirement.

				if ( min !== undefined && max !== undefined ) {

					// we need to get max of absolute components because target weight is [-1,1]
					vector.setX( Math.max( Math.abs( min[ 0 ] ), Math.abs( max[ 0 ] ) ) );
					vector.setY( Math.max( Math.abs( min[ 1 ] ), Math.abs( max[ 1 ] ) ) );
					vector.setZ( Math.max( Math.abs( min[ 2 ] ), Math.abs( max[ 2 ] ) ) );


					if ( accessor.normalized ) {

						const boxScale = getNormalizedComponentScale( WEBGL_COMPONENT_TYPES[ accessor.componentType ] );
						vector.multiplyScalar( boxScale );

					}

					// Note: this assumes that the sum of all weights is at most 1. This isn't quite correct - it's more conservative
					// to assume that each target can have a max weight of 1. However, for some use cases - notably, when morph targets
					// are used to implement key-frame animations and as such only two are active at a time - this results in very large
					// boxes. So for now we make a box that's sometimes a touch too small but is hopefully mostly of reasonable size.
					maxDisplacement.max( vector );

				} else {

					console.warn( 'THREE.GLTFLoader: Missing min/max properties for accessor POSITION.' );

				}

			}

		}

		// As per comment above this box isn't conservative, but has a reasonable size for a very large number of morph targets.
		box.expandByVector( maxDisplacement );

	}

	geometry.boundingBox = box;

	const sphere = new three.Sphere();

	box.getCenter( sphere.center );
	sphere.radius = box.min.distanceTo( box.max ) / 2;

	geometry.boundingSphere = sphere;

}

/**
 * @param {BufferGeometry} geometry
 * @param {GLTF.Primitive} primitiveDef
 * @param {GLTFParser} parser
 * @return {Promise<BufferGeometry>}
 */
function addPrimitiveAttributes( geometry, primitiveDef, parser ) {

	const attributes = primitiveDef.attributes;

	const pending = [];

	function assignAttributeAccessor( accessorIndex, attributeName ) {

		return parser.getDependency( 'accessor', accessorIndex )
			.then( function ( accessor ) {

				geometry.setAttribute( attributeName, accessor );

			} );

	}

	for ( const gltfAttributeName in attributes ) {

		const threeAttributeName = ATTRIBUTES[ gltfAttributeName ] || gltfAttributeName.toLowerCase();

		// Skip attributes already provided by e.g. Draco extension.
		if ( threeAttributeName in geometry.attributes ) continue;

		pending.push( assignAttributeAccessor( attributes[ gltfAttributeName ], threeAttributeName ) );

	}

	if ( primitiveDef.indices !== undefined && ! geometry.index ) {

		const accessor = parser.getDependency( 'accessor', primitiveDef.indices ).then( function ( accessor ) {

			geometry.setIndex( accessor );

		} );

		pending.push( accessor );

	}

	assignExtrasToUserData( geometry, primitiveDef );

	computeBounds( geometry, primitiveDef, parser );

	return Promise.all( pending ).then( function () {

		return primitiveDef.targets !== undefined
			? addMorphTargets( geometry, primitiveDef.targets, parser )
			: geometry;

	} );

}

/**
 * @param {BufferGeometry} geometry
 * @param {Number} drawMode
 * @return {BufferGeometry}
 */
function toTrianglesDrawMode( geometry, drawMode ) {

	let index = geometry.getIndex();

	// generate index if not present

	if ( index === null ) {

		const indices = [];

		const position = geometry.getAttribute( 'position' );

		if ( position !== undefined ) {

			for ( let i = 0; i < position.count; i ++ ) {

				indices.push( i );

			}

			geometry.setIndex( indices );
			index = geometry.getIndex();

		} else {

			console.error( 'THREE.GLTFLoader.toTrianglesDrawMode(): Undefined position attribute. Processing not possible.' );
			return geometry;

		}

	}

	//

	const numberOfTriangles = index.count - 2;
	const newIndices = [];

	if ( drawMode === three.TriangleFanDrawMode ) {

		// gl.TRIANGLE_FAN

		for ( let i = 1; i <= numberOfTriangles; i ++ ) {

			newIndices.push( index.getX( 0 ) );
			newIndices.push( index.getX( i ) );
			newIndices.push( index.getX( i + 1 ) );

		}

	} else {

		// gl.TRIANGLE_STRIP

		for ( let i = 0; i < numberOfTriangles; i ++ ) {

			if ( i % 2 === 0 ) {

				newIndices.push( index.getX( i ) );
				newIndices.push( index.getX( i + 1 ) );
				newIndices.push( index.getX( i + 2 ) );


			} else {

				newIndices.push( index.getX( i + 2 ) );
				newIndices.push( index.getX( i + 1 ) );
				newIndices.push( index.getX( i ) );

			}

		}

	}

	if ( ( newIndices.length / 3 ) !== numberOfTriangles ) {

		console.error( 'THREE.GLTFLoader.toTrianglesDrawMode(): Unable to generate correct amount of triangles.' );

	}

	// build final geometry

	const newGeometry = geometry.clone();
	newGeometry.setIndex( newIndices );

	return newGeometry;

}

// This set of controls performs orbiting, dollying (zooming), and panning.
// Unlike TrackballControls, it maintains the "up" direction object.up (+Y by default).
//
//    Orbit - left mouse / touch: one-finger move
//    Zoom - middle mouse, or mousewheel / touch: two-finger spread or squish
//    Pan - right mouse, or left mouse + ctrl/meta/shiftKey, or arrow keys / touch: two-finger move

const _changeEvent$1 = { type: 'change' };
const _startEvent = { type: 'start' };
const _endEvent = { type: 'end' };

class OrbitControls extends three.EventDispatcher {

	constructor( object, domElement ) {

		super();

		if ( domElement === undefined ) console.warn( 'THREE.OrbitControls: The second parameter "domElement" is now mandatory.' );
		if ( domElement === three._default.polyfill.document ) console.error( 'THREE.OrbitControls: "document" should not be used as the target "domElement". Please use "renderer.domElement" instead.' );

		this.object = object;
		this.domElement = domElement;
		this.domElement.style.touchAction = 'none'; // disable touch scroll

		// Set to false to disable this control
		this.enabled = true;

		// "target" sets the location of focus, where the object orbits around
		this.target = new three.Vector3();

		// How far you can dolly in and out ( PerspectiveCamera only )
		this.minDistance = 0;
		this.maxDistance = Infinity;

		// How far you can zoom in and out ( OrthographicCamera only )
		this.minZoom = 0;
		this.maxZoom = Infinity;

		// How far you can orbit vertically, upper and lower limits.
		// Range is 0 to Math.PI radians.
		this.minPolarAngle = 0; // radians
		this.maxPolarAngle = Math.PI; // radians

		// How far you can orbit horizontally, upper and lower limits.
		// If set, the interval [ min, max ] must be a sub-interval of [ - 2 PI, 2 PI ], with ( max - min < 2 PI )
		this.minAzimuthAngle = - Infinity; // radians
		this.maxAzimuthAngle = Infinity; // radians

		// Set to true to enable damping (inertia)
		// If damping is enabled, you must call controls.update() in your animation loop
		this.enableDamping = false;
		this.dampingFactor = 0.05;

		// This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
		// Set to false to disable zooming
		this.enableZoom = true;
		this.zoomSpeed = 1.0;

		// Set to false to disable rotating
		this.enableRotate = true;
		this.rotateSpeed = 1.0;

		// Set to false to disable panning
		this.enablePan = true;
		this.panSpeed = 1.0;
		this.screenSpacePanning = true; // if false, pan orthogonal to world-space direction camera.up
		this.keyPanSpeed = 7.0;	// pixels moved per arrow key push

		// Set to true to automatically rotate around the target
		// If auto-rotate is enabled, you must call controls.update() in your animation loop
		this.autoRotate = false;
		this.autoRotateSpeed = 2.0; // 30 seconds per orbit when fps is 60

		// The four arrow keys
		this.keys = { LEFT: 'ArrowLeft', UP: 'ArrowUp', RIGHT: 'ArrowRight', BOTTOM: 'ArrowDown' };

		// Mouse buttons
		this.mouseButtons = { LEFT: three.MOUSE.ROTATE, MIDDLE: three.MOUSE.DOLLY, RIGHT: three.MOUSE.PAN };

		// Touch fingers
		this.touches = { ONE: three.TOUCH.ROTATE, TWO: three.TOUCH.DOLLY_PAN };

		// for reset
		this.target0 = this.target.clone();
		this.position0 = this.object.position.clone();
		this.zoom0 = this.object.zoom;

		// the target DOM element for key events
		this._domElementKeyEvents = null;

		//
		// public methods
		//

		this.getPolarAngle = function () {

			return spherical.phi;

		};

		this.getAzimuthalAngle = function () {

			return spherical.theta;

		};

		this.getDistance = function () {

			return this.object.position.distanceTo( this.target );

		};

		this.listenToKeyEvents = function ( domElement ) {

			domElement.addEventListener( 'keydown', onKeyDown );
			this._domElementKeyEvents = domElement;

		};

		this.saveState = function () {

			scope.target0.copy( scope.target );
			scope.position0.copy( scope.object.position );
			scope.zoom0 = scope.object.zoom;

		};

		this.reset = function () {

			scope.target.copy( scope.target0 );
			scope.object.position.copy( scope.position0 );
			scope.object.zoom = scope.zoom0;

			scope.object.updateProjectionMatrix();
			scope.dispatchEvent( _changeEvent$1 );

			scope.update();

			state = STATE.NONE;

		};

		// this method is exposed, but perhaps it would be better if we can make it private...
		this.update = function () {

			const offset = new three.Vector3();

			// so camera.up is the orbit axis
			const quat = new three.Quaternion().setFromUnitVectors( object.up, new three.Vector3( 0, 1, 0 ) );
			const quatInverse = quat.clone().invert();

			const lastPosition = new three.Vector3();
			const lastQuaternion = new three.Quaternion();

			const twoPI = 2 * Math.PI;

			return function update() {

				const position = scope.object.position;

				offset.copy( position ).sub( scope.target );

				// rotate offset to "y-axis-is-up" space
				offset.applyQuaternion( quat );

				// angle from z-axis around y-axis
				spherical.setFromVector3( offset );

				if ( scope.autoRotate && state === STATE.NONE ) {

					rotateLeft( getAutoRotationAngle() );

				}

				if ( scope.enableDamping ) {

					spherical.theta += sphericalDelta.theta * scope.dampingFactor;
					spherical.phi += sphericalDelta.phi * scope.dampingFactor;

				} else {

					spherical.theta += sphericalDelta.theta;
					spherical.phi += sphericalDelta.phi;

				}

				// restrict theta to be between desired limits

				let min = scope.minAzimuthAngle;
				let max = scope.maxAzimuthAngle;

				if ( isFinite( min ) && isFinite( max ) ) {

					if ( min < - Math.PI ) min += twoPI; else if ( min > Math.PI ) min -= twoPI;

					if ( max < - Math.PI ) max += twoPI; else if ( max > Math.PI ) max -= twoPI;

					if ( min <= max ) {

						spherical.theta = Math.max( min, Math.min( max, spherical.theta ) );

					} else {

						spherical.theta = ( spherical.theta > ( min + max ) / 2 ) ?
							Math.max( min, spherical.theta ) :
							Math.min( max, spherical.theta );

					}

				}

				// restrict phi to be between desired limits
				spherical.phi = Math.max( scope.minPolarAngle, Math.min( scope.maxPolarAngle, spherical.phi ) );

				spherical.makeSafe();


				spherical.radius *= scale;

				// restrict radius to be between desired limits
				spherical.radius = Math.max( scope.minDistance, Math.min( scope.maxDistance, spherical.radius ) );

				// move target to panned location

				if ( scope.enableDamping === true ) {

					scope.target.addScaledVector( panOffset, scope.dampingFactor );

				} else {

					scope.target.add( panOffset );

				}

				offset.setFromSpherical( spherical );

				// rotate offset back to "camera-up-vector-is-up" space
				offset.applyQuaternion( quatInverse );

				position.copy( scope.target ).add( offset );

				scope.object.lookAt( scope.target );

				if ( scope.enableDamping === true ) {

					sphericalDelta.theta *= ( 1 - scope.dampingFactor );
					sphericalDelta.phi *= ( 1 - scope.dampingFactor );

					panOffset.multiplyScalar( 1 - scope.dampingFactor );

				} else {

					sphericalDelta.set( 0, 0, 0 );

					panOffset.set( 0, 0, 0 );

				}

				scale = 1;

				// update condition is:
				// min(camera displacement, camera rotation in radians)^2 > EPS
				// using small-angle approximation cos(x/2) = 1 - x^2 / 8

				if ( zoomChanged ||
					lastPosition.distanceToSquared( scope.object.position ) > EPS ||
					8 * ( 1 - lastQuaternion.dot( scope.object.quaternion ) ) > EPS ) {

					scope.dispatchEvent( _changeEvent$1 );

					lastPosition.copy( scope.object.position );
					lastQuaternion.copy( scope.object.quaternion );
					zoomChanged = false;

					return true;

				}

				return false;

			};

		}();

		this.dispose = function () {

			scope.domElement.removeEventListener( 'contextmenu', onContextMenu );

			scope.domElement.removeEventListener( 'pointerdown', onPointerDown );
			scope.domElement.removeEventListener( 'pointercancel', onPointerCancel );
			scope.domElement.removeEventListener( 'wheel', onMouseWheel );

			scope.domElement.removeEventListener( 'pointermove', onPointerMove );
			scope.domElement.removeEventListener( 'pointerup', onPointerUp );


			if ( scope._domElementKeyEvents !== null ) {

				scope._domElementKeyEvents.removeEventListener( 'keydown', onKeyDown );

			}

			//scope.dispatchEvent( { type: 'dispose' } ); // should this be added here?

		};

		//
		// internals
		//

		const scope = this;

		const STATE = {
			NONE: - 1,
			ROTATE: 0,
			DOLLY: 1,
			PAN: 2,
			TOUCH_ROTATE: 3,
			TOUCH_PAN: 4,
			TOUCH_DOLLY_PAN: 5,
			TOUCH_DOLLY_ROTATE: 6
		};

		let state = STATE.NONE;

		const EPS = 0.000001;

		// current position in spherical coordinates
		const spherical = new three.Spherical();
		const sphericalDelta = new three.Spherical();

		let scale = 1;
		const panOffset = new three.Vector3();
		let zoomChanged = false;

		const rotateStart = new three.Vector2();
		const rotateEnd = new three.Vector2();
		const rotateDelta = new three.Vector2();

		const panStart = new three.Vector2();
		const panEnd = new three.Vector2();
		const panDelta = new three.Vector2();

		const dollyStart = new three.Vector2();
		const dollyEnd = new three.Vector2();
		const dollyDelta = new three.Vector2();

		const pointers = [];
		const pointerPositions = {};

		function getAutoRotationAngle() {

			return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;

		}

		function getZoomScale() {

			return Math.pow( 0.95, scope.zoomSpeed );

		}

		function rotateLeft( angle ) {

			sphericalDelta.theta -= angle;

		}

		function rotateUp( angle ) {

			sphericalDelta.phi -= angle;

		}

		const panLeft = function () {

			const v = new three.Vector3();

			return function panLeft( distance, objectMatrix ) {

				v.setFromMatrixColumn( objectMatrix, 0 ); // get X column of objectMatrix
				v.multiplyScalar( - distance );

				panOffset.add( v );

			};

		}();

		const panUp = function () {

			const v = new three.Vector3();

			return function panUp( distance, objectMatrix ) {

				if ( scope.screenSpacePanning === true ) {

					v.setFromMatrixColumn( objectMatrix, 1 );

				} else {

					v.setFromMatrixColumn( objectMatrix, 0 );
					v.crossVectors( scope.object.up, v );

				}

				v.multiplyScalar( distance );

				panOffset.add( v );

			};

		}();

		// deltaX and deltaY are in pixels; right and down are positive
		const pan = function () {

			const offset = new three.Vector3();

			return function pan( deltaX, deltaY ) {

				const element = scope.domElement;

				if ( scope.object.isPerspectiveCamera ) {

					// perspective
					const position = scope.object.position;
					offset.copy( position ).sub( scope.target );
					let targetDistance = offset.length();

					// half of the fov is center to top of screen
					targetDistance *= Math.tan( ( scope.object.fov / 2 ) * Math.PI / 180.0 );

					// we use only clientHeight here so aspect ratio does not distort speed
					panLeft( 2 * deltaX * targetDistance / element.clientHeight, scope.object.matrix );
					panUp( 2 * deltaY * targetDistance / element.clientHeight, scope.object.matrix );

				} else if ( scope.object.isOrthographicCamera ) {

					// orthographic
					panLeft( deltaX * ( scope.object.right - scope.object.left ) / scope.object.zoom / element.clientWidth, scope.object.matrix );
					panUp( deltaY * ( scope.object.top - scope.object.bottom ) / scope.object.zoom / element.clientHeight, scope.object.matrix );

				} else {

					// camera neither orthographic nor perspective
					console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.' );
					scope.enablePan = false;

				}

			};

		}();

		function dollyOut( dollyScale ) {

			if ( scope.object.isPerspectiveCamera ) {

				scale /= dollyScale;

			} else if ( scope.object.isOrthographicCamera ) {

				scope.object.zoom = Math.max( scope.minZoom, Math.min( scope.maxZoom, scope.object.zoom * dollyScale ) );
				scope.object.updateProjectionMatrix();
				zoomChanged = true;

			} else {

				console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.' );
				scope.enableZoom = false;

			}

		}

		function dollyIn( dollyScale ) {

			if ( scope.object.isPerspectiveCamera ) {

				scale *= dollyScale;

			} else if ( scope.object.isOrthographicCamera ) {

				scope.object.zoom = Math.max( scope.minZoom, Math.min( scope.maxZoom, scope.object.zoom / dollyScale ) );
				scope.object.updateProjectionMatrix();
				zoomChanged = true;

			} else {

				console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.' );
				scope.enableZoom = false;

			}

		}

		//
		// event callbacks - update the object state
		//

		function handleMouseDownRotate( event ) {

			rotateStart.set( event.clientX, event.clientY );

		}

		function handleMouseDownDolly( event ) {

			dollyStart.set( event.clientX, event.clientY );

		}

		function handleMouseDownPan( event ) {

			panStart.set( event.clientX, event.clientY );

		}

		function handleMouseMoveRotate( event ) {

			rotateEnd.set( event.clientX, event.clientY );

			rotateDelta.subVectors( rotateEnd, rotateStart ).multiplyScalar( scope.rotateSpeed );

			const element = scope.domElement;

			rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientHeight ); // yes, height

			rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight );

			rotateStart.copy( rotateEnd );

			scope.update();

		}

		function handleMouseMoveDolly( event ) {

			dollyEnd.set( event.clientX, event.clientY );

			dollyDelta.subVectors( dollyEnd, dollyStart );

			if ( dollyDelta.y > 0 ) {

				dollyOut( getZoomScale() );

			} else if ( dollyDelta.y < 0 ) {

				dollyIn( getZoomScale() );

			}

			dollyStart.copy( dollyEnd );

			scope.update();

		}

		function handleMouseMovePan( event ) {

			panEnd.set( event.clientX, event.clientY );

			panDelta.subVectors( panEnd, panStart ).multiplyScalar( scope.panSpeed );

			pan( panDelta.x, panDelta.y );

			panStart.copy( panEnd );

			scope.update();

		}

		function handleMouseWheel( event ) {

			if ( event.deltaY < 0 ) {

				dollyIn( getZoomScale() );

			} else if ( event.deltaY > 0 ) {

				dollyOut( getZoomScale() );

			}

			scope.update();

		}

		function handleKeyDown( event ) {

			let needsUpdate = false;

			switch ( event.code ) {

				case scope.keys.UP:
					pan( 0, scope.keyPanSpeed );
					needsUpdate = true;
					break;

				case scope.keys.BOTTOM:
					pan( 0, - scope.keyPanSpeed );
					needsUpdate = true;
					break;

				case scope.keys.LEFT:
					pan( scope.keyPanSpeed, 0 );
					needsUpdate = true;
					break;

				case scope.keys.RIGHT:
					pan( - scope.keyPanSpeed, 0 );
					needsUpdate = true;
					break;

			}

			if ( needsUpdate ) {

				// prevent the browser from scrolling on cursor keys
				event.preventDefault();

				scope.update();

			}


		}

		function handleTouchStartRotate() {

			if ( pointers.length === 1 ) {

				rotateStart.set( pointers[ 0 ].pageX, pointers[ 0 ].pageY );

			} else {

				const x = 0.5 * ( pointers[ 0 ].pageX + pointers[ 1 ].pageX );
				const y = 0.5 * ( pointers[ 0 ].pageY + pointers[ 1 ].pageY );

				rotateStart.set( x, y );

			}

		}

		function handleTouchStartPan() {

			if ( pointers.length === 1 ) {

				panStart.set( pointers[ 0 ].pageX, pointers[ 0 ].pageY );

			} else {

				const x = 0.5 * ( pointers[ 0 ].pageX + pointers[ 1 ].pageX );
				const y = 0.5 * ( pointers[ 0 ].pageY + pointers[ 1 ].pageY );

				panStart.set( x, y );

			}

		}

		function handleTouchStartDolly() {

			const dx = pointers[ 0 ].pageX - pointers[ 1 ].pageX;
			const dy = pointers[ 0 ].pageY - pointers[ 1 ].pageY;

			const distance = Math.sqrt( dx * dx + dy * dy );

			dollyStart.set( 0, distance );

		}

		function handleTouchStartDollyPan() {

			if ( scope.enableZoom ) handleTouchStartDolly();

			if ( scope.enablePan ) handleTouchStartPan();

		}

		function handleTouchStartDollyRotate() {

			if ( scope.enableZoom ) handleTouchStartDolly();

			if ( scope.enableRotate ) handleTouchStartRotate();

		}

		function handleTouchMoveRotate( event ) {

			if ( pointers.length == 1 ) {

				rotateEnd.set( event.pageX, event.pageY );

			} else {

				const position = getSecondPointerPosition( event );

				const x = 0.5 * ( event.pageX + position.x );
				const y = 0.5 * ( event.pageY + position.y );

				rotateEnd.set( x, y );

			}

			rotateDelta.subVectors( rotateEnd, rotateStart ).multiplyScalar( scope.rotateSpeed );

			const element = scope.domElement;

			rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientHeight ); // yes, height

			rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight );

			rotateStart.copy( rotateEnd );

		}

		function handleTouchMovePan( event ) {

			if ( pointers.length === 1 ) {

				panEnd.set( event.pageX, event.pageY );

			} else {

				const position = getSecondPointerPosition( event );

				const x = 0.5 * ( event.pageX + position.x );
				const y = 0.5 * ( event.pageY + position.y );

				panEnd.set( x, y );

			}

			panDelta.subVectors( panEnd, panStart ).multiplyScalar( scope.panSpeed );

			pan( panDelta.x, panDelta.y );

			panStart.copy( panEnd );

		}

		function handleTouchMoveDolly( event ) {

			const position = getSecondPointerPosition( event );

			const dx = event.pageX - position.x;
			const dy = event.pageY - position.y;

			const distance = Math.sqrt( dx * dx + dy * dy );

			dollyEnd.set( 0, distance );

			dollyDelta.set( 0, Math.pow( dollyEnd.y / dollyStart.y, scope.zoomSpeed ) );

			dollyOut( dollyDelta.y );

			dollyStart.copy( dollyEnd );

		}

		function handleTouchMoveDollyPan( event ) {

			if ( scope.enableZoom ) handleTouchMoveDolly( event );

			if ( scope.enablePan ) handleTouchMovePan( event );

		}

		function handleTouchMoveDollyRotate( event ) {

			if ( scope.enableZoom ) handleTouchMoveDolly( event );

			if ( scope.enableRotate ) handleTouchMoveRotate( event );

		}

		//
		// event handlers - FSM: listen for events and reset state
		//

		function onPointerDown( event ) {

			if ( scope.enabled === false ) return;

			if ( pointers.length === 0 ) {

				scope.domElement.setPointerCapture( event.pointerId );

				scope.domElement.addEventListener( 'pointermove', onPointerMove );
				scope.domElement.addEventListener( 'pointerup', onPointerUp );

			}

			//

			addPointer( event );

			if ( event.pointerType === 'touch' ) {

				onTouchStart( event );

			} else {

				onMouseDown( event );

			}

		}

		function onPointerMove( event ) {

			if ( scope.enabled === false ) return;

			if ( event.pointerType === 'touch' ) {

				onTouchMove( event );

			} else {

				onMouseMove( event );

			}

		}

		function onPointerUp( event ) {

			if ( scope.enabled === false ) return;

			if ( event.pointerType === 'touch' ) {

				onTouchEnd();

			} else {

				onMouseUp();

			}

			removePointer( event );

			//

			if ( pointers.length === 0 ) {

				scope.domElement.releasePointerCapture( event.pointerId );

				scope.domElement.removeEventListener( 'pointermove', onPointerMove );
				scope.domElement.removeEventListener( 'pointerup', onPointerUp );

			}

		}

		function onPointerCancel( event ) {

			removePointer( event );

		}

		function onMouseDown( event ) {

			let mouseAction;

			switch ( event.button ) {

				case 0:

					mouseAction = scope.mouseButtons.LEFT;
					break;

				case 1:

					mouseAction = scope.mouseButtons.MIDDLE;
					break;

				case 2:

					mouseAction = scope.mouseButtons.RIGHT;
					break;

				default:

					mouseAction = - 1;

			}

			switch ( mouseAction ) {

				case three.MOUSE.DOLLY:

					if ( scope.enableZoom === false ) return;

					handleMouseDownDolly( event );

					state = STATE.DOLLY;

					break;

				case three.MOUSE.ROTATE:

					if ( event.ctrlKey || event.metaKey || event.shiftKey ) {

						if ( scope.enablePan === false ) return;

						handleMouseDownPan( event );

						state = STATE.PAN;

					} else {

						if ( scope.enableRotate === false ) return;

						handleMouseDownRotate( event );

						state = STATE.ROTATE;

					}

					break;

				case three.MOUSE.PAN:

					if ( event.ctrlKey || event.metaKey || event.shiftKey ) {

						if ( scope.enableRotate === false ) return;

						handleMouseDownRotate( event );

						state = STATE.ROTATE;

					} else {

						if ( scope.enablePan === false ) return;

						handleMouseDownPan( event );

						state = STATE.PAN;

					}

					break;

				default:

					state = STATE.NONE;

			}

			if ( state !== STATE.NONE ) {

				scope.dispatchEvent( _startEvent );

			}

		}

		function onMouseMove( event ) {

			if ( scope.enabled === false ) return;

			switch ( state ) {

				case STATE.ROTATE:

					if ( scope.enableRotate === false ) return;

					handleMouseMoveRotate( event );

					break;

				case STATE.DOLLY:

					if ( scope.enableZoom === false ) return;

					handleMouseMoveDolly( event );

					break;

				case STATE.PAN:

					if ( scope.enablePan === false ) return;

					handleMouseMovePan( event );

					break;

			}

		}

		function onMouseUp( event ) {

			scope.dispatchEvent( _endEvent );

			state = STATE.NONE;

		}

		function onMouseWheel( event ) {

			if ( scope.enabled === false || scope.enableZoom === false || ( state !== STATE.NONE && state !== STATE.ROTATE ) ) return;

			event.preventDefault();

			scope.dispatchEvent( _startEvent );

			handleMouseWheel( event );

			scope.dispatchEvent( _endEvent );

		}

		function onKeyDown( event ) {

			if ( scope.enabled === false || scope.enablePan === false ) return;

			handleKeyDown( event );

		}

		function onTouchStart( event ) {

			trackPointer( event );

			switch ( pointers.length ) {

				case 1:

					switch ( scope.touches.ONE ) {

						case three.TOUCH.ROTATE:

							if ( scope.enableRotate === false ) return;

							handleTouchStartRotate();

							state = STATE.TOUCH_ROTATE;

							break;

						case three.TOUCH.PAN:

							if ( scope.enablePan === false ) return;

							handleTouchStartPan();

							state = STATE.TOUCH_PAN;

							break;

						default:

							state = STATE.NONE;

					}

					break;

				case 2:

					switch ( scope.touches.TWO ) {

						case three.TOUCH.DOLLY_PAN:

							if ( scope.enableZoom === false && scope.enablePan === false ) return;

							handleTouchStartDollyPan();

							state = STATE.TOUCH_DOLLY_PAN;

							break;

						case three.TOUCH.DOLLY_ROTATE:

							if ( scope.enableZoom === false && scope.enableRotate === false ) return;

							handleTouchStartDollyRotate();

							state = STATE.TOUCH_DOLLY_ROTATE;

							break;

						default:

							state = STATE.NONE;

					}

					break;

				default:

					state = STATE.NONE;

			}

			if ( state !== STATE.NONE ) {

				scope.dispatchEvent( _startEvent );

			}

		}

		function onTouchMove( event ) {

			trackPointer( event );

			switch ( state ) {

				case STATE.TOUCH_ROTATE:

					if ( scope.enableRotate === false ) return;

					handleTouchMoveRotate( event );

					scope.update();

					break;

				case STATE.TOUCH_PAN:

					if ( scope.enablePan === false ) return;

					handleTouchMovePan( event );

					scope.update();

					break;

				case STATE.TOUCH_DOLLY_PAN:

					if ( scope.enableZoom === false && scope.enablePan === false ) return;

					handleTouchMoveDollyPan( event );

					scope.update();

					break;

				case STATE.TOUCH_DOLLY_ROTATE:

					if ( scope.enableZoom === false && scope.enableRotate === false ) return;

					handleTouchMoveDollyRotate( event );

					scope.update();

					break;

				default:

					state = STATE.NONE;

			}

		}

		function onTouchEnd( event ) {

			scope.dispatchEvent( _endEvent );

			state = STATE.NONE;

		}

		function onContextMenu( event ) {

			if ( scope.enabled === false ) return;

			event.preventDefault();

		}

		function addPointer( event ) {

			pointers.push( event );

		}

		function removePointer( event ) {

			delete pointerPositions[ event.pointerId ];

			for ( let i = 0; i < pointers.length; i ++ ) {

				if ( pointers[ i ].pointerId == event.pointerId ) {

					pointers.splice( i, 1 );
					return;

				}

			}

		}

		function trackPointer( event ) {

			let position = pointerPositions[ event.pointerId ];

			if ( position === undefined ) {

				position = new three.Vector2();
				pointerPositions[ event.pointerId ] = position;

			}

			position.set( event.pageX, event.pageY );

		}

		function getSecondPointerPosition( event ) {

			const pointer = ( event.pointerId === pointers[ 0 ].pointerId ) ? pointers[ 1 ] : pointers[ 0 ];

			return pointerPositions[ pointer.pointerId ];

		}

		//

		scope.domElement.addEventListener( 'contextmenu', onContextMenu );

		scope.domElement.addEventListener( 'pointerdown', onPointerDown );
		scope.domElement.addEventListener( 'pointercancel', onPointerCancel );
		scope.domElement.addEventListener( 'wheel', onMouseWheel, { passive: false } );

		// force an update at start

		this.update();

	}

}

function disposeNode(node) {
  if (node.isMesh) {
    if (node.geometry) {
      node.geometry.dispose();
    }

    if (node.material) {
      // if (node.material.isMeshFaceMaterial) {
      //   node.material.materials.forEach(mtrl => {
      //     if (mtrl.map) mtrl.map.dispose();
      //     if (mtrl.lightMap) mtrl.lightMap.dispose();
      //     if (mtrl.bumpMap) mtrl.bumpMap.dispose();
      //     if (mtrl.normalMap) mtrl.normalMap.dispose();
      //     if (mtrl.specularMap) mtrl.specularMap.dispose();
      //     if (mtrl.envMap) mtrl.envMap.dispose();
      //     if (mtrl.alphaMap) mtrl.alphaMap.dispose();
      //     if (mtrl.aoMap) mtrl.aoMap.dispose();
      //     if (mtrl.displacementMap) mtrl.displacementMap.dispose();
      //     if (mtrl.emissiveMap) mtrl.emissiveMap.dispose();
      //     if (mtrl.gradientMap) mtrl.gradientMap.dispose();
      //     if (mtrl.metalnessMap) mtrl.metalnessMap.dispose();
      //     if (mtrl.roughnessMap) mtrl.roughnessMap.dispose();

      //     mtrl.dispose(); // disposes any programs associated with the material
      //   });
      // } else {
      //   if (node.material.map) node.material.map.dispose();
      //   if (node.material.lightMap) node.material.lightMap.dispose();
      //   if (node.material.bumpMap) node.material.bumpMap.dispose();
      //   if (node.material.normalMap) node.material.normalMap.dispose();
      //   if (node.material.specularMap) node.material.specularMap.dispose();
      //   if (node.material.envMap) node.material.envMap.dispose();
      //   if (node.material.alphaMap) node.material.alphaMap.dispose();
      //   if (node.material.aoMap) node.material.aoMap.dispose();
      //   if (node.material.displacementMap) node.material.displacementMap.dispose();
      //   if (node.material.emissiveMap) node.material.emissiveMap.dispose();
      //   if (node.material.gradientMap) node.material.gradientMap.dispose();
      //   if (node.material.metalnessMap) node.material.metalnessMap.dispose();
      //   if (node.material.roughnessMap) node.material.roughnessMap.dispose();

      //   node.material.dispose(); // disposes any programs associated with the material
      // }
      Object.keys(node.material).forEach(key => {
        const value = node.material[key];
        if (value && value.dispose instanceof Function) value.dispose();
      });
    }
  } else if (node.isScene) {
    if (node.background && node.background.dispose) node.background.dispose();
    if (node.environment && node.environment.dispose) node.environment.dispose();
  }
}

function disposeHierarchy(node, callback = disposeNode) {
  for (var i = node.children.length - 1; i >= 0; i--) {
    var child = node.children[i];
    disposeHierarchy(child, callback);
    callback(child);
  }
  callback(node);
}

function _optionalChain$j(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
const baseUrl$2 = 'https://techbrood.com/threejs/examples/';
// export const baseUrl = 'https://threejs.org/examples';










class Demo {
  
   __init() {this._objects = [];}
  
   __init2() {this._cameraObjects = [];}

  constructor(deps) {Demo.prototype.__init.call(this);Demo.prototype.__init2.call(this);
    this.deps = deps;
  }

  add(obj) {
    this._objects.push(obj);
    this.deps.scene.add(obj);
  }

  addCamera(obj) {
    this._cameraObjects.push(obj);
    this.deps.camera.add(obj);
  }

  addControl() {
    const { camera, renderer } = this.deps;
    this.orbitControl = new OrbitControls(camera, renderer.domElement);
    this.orbitControl.enableDamping = true;
    this.orbitControl.dampingFactor = 0.05;
  }

  reset(all = true) {
    const { camera, scene, renderer } = this.deps;
    camera.position.set(0, 0, 0);
    camera.quaternion.set(0, 0, 0, 1);
    _optionalChain$j([(scene.background ), 'optionalAccess', _ => _.dispose, 'optionalCall', _2 => _2()]);
    scene.background = new three.Color(0xffffff);
    scene.fog = null;
    scene.position.z = -3;
    renderer.shadowMap.enabled = false;
    renderer.physicallyCorrectLights = false;
    renderer.outputEncoding = three.sRGBEncoding;

    disposeHierarchy(this.deps.scene);
    this._objects.forEach(object => _optionalChain$j([object, 'access', _3 => _3.material, 'optionalAccess', _4 => _4.dispose, 'optionalCall', _5 => _5()]));
    this._cameraObjects.forEach(object => _optionalChain$j([object, 'access', _6 => _6.material, 'optionalAccess', _7 => _7.dispose, 'optionalCall', _8 => _8()]));
    scene.remove(...this._objects);
    camera.remove(...this._cameraObjects);
    this._objects.length = 0;
    this._cameraObjects.length = 0;

    _optionalChain$j([this, 'access', _9 => _9.orbitControl, 'optionalAccess', _10 => _10.dispose, 'call', _11 => _11()]);

    if (all) {
      this.orbitControl = null;
      this.deps = null;
    }
  }

  


}

class DemoMemoryTest extends Demo {
  
  async init() {
    this.reset(false);
    const gltf = (await this.deps.gltfLoader.loadAsync(
      baseUrl$2 + '/models/gltf/Soldier.glb',
    )) ;

    this.add(new three.DirectionalLight(0xffffff, 1));
    this.add(new three.AmbientLight(0xffffff, 1));
    this.add(gltf.scene);

    this.timer = setTimeout(() => this.init(), 300);
  }

  update() {}
  dispose() {
    this.reset();
    clearTimeout(this.timer);
  }
}

// This file is part of meshoptimizer library and is distributed under the terms of MIT License.
// Copyright (C) 2016-2020, by Arseny Kapoulkine (arseny.kapoulkine@gmail.com)
var MeshoptDecoder = (function (path) {
  // Built with clang version 11.0.0 (https://github.com/llvm/llvm-project.git 0160ad802e899c2922bc9b29564080c22eb0908c)
  // Built from meshoptimizer 0.14

  if (typeof WXWebAssembly !== 'object') {
    // This module requires WebAssembly to function
    return {
      supported: false,
    };
  }

  var instance;
  var readyResolve;
  var promise = new Promise((resovle) => {
    readyResolve = resovle;
  });

  function setWasmPath(path) {
    WXWebAssembly.instantiate(path, {}).then(function (result) {
      instance = result.instance;
      instance.exports.__wasm_call_ctors();
      readyResolve();
    });
  }


  function decode(fun, target, count, size, source, filter) {
    var sbrk = instance.exports.sbrk;
    var count4 = (count + 3) & ~3; // pad for SIMD filter
    var tp = sbrk(count4 * size);
    var sp = sbrk(source.length);
    var heap = new Uint8Array(instance.exports.memory.buffer);
    heap.set(source, sp);
    var res = fun(tp, count, size, sp, source.length);
    if (res == 0 && filter) {
      filter(tp, count4, size);
    }
    target.set(heap.subarray(tp, tp + count * size));
    sbrk(tp - sbrk(0));
    if (res != 0) {
      throw new Error('Malformed buffer data: ' + res);
    }
  }
  var filters = {
    // legacy index-based enums for glTF
    0: '',
    1: 'meshopt_decodeFilterOct',
    2: 'meshopt_decodeFilterQuat',
    3: 'meshopt_decodeFilterExp',
    // string-based enums for glTF
    NONE: '',
    OCTAHEDRAL: 'meshopt_decodeFilterOct',
    QUATERNION: 'meshopt_decodeFilterQuat',
    EXPONENTIAL: 'meshopt_decodeFilterExp',
  };

  var decoders = {
    // legacy index-based enums for glTF
    0: 'meshopt_decodeVertexBuffer',
    1: 'meshopt_decodeIndexBuffer',
    2: 'meshopt_decodeIndexSequence',
    // string-based enums for glTF
    ATTRIBUTES: 'meshopt_decodeVertexBuffer',
    TRIANGLES: 'meshopt_decodeIndexBuffer',
    INDICES: 'meshopt_decodeIndexSequence',
  };

  return {
    setWasmPath,
    ready: promise,
    supported: true,
    decodeVertexBuffer: function (target, count, size, source, filter) {
      decode(
        instance.exports.meshopt_decodeVertexBuffer,
        target,
        count,
        size,
        source,
        instance.exports[filters[filter]],
      );
    },
    decodeIndexBuffer: function (target, count, size, source) {
      decode(instance.exports.meshopt_decodeIndexBuffer, target, count, size, source);
    },
    decodeIndexSequence: function (target, count, size, source) {
      decode(instance.exports.meshopt_decodeIndexSequence, target, count, size, source);
    },
    decodeGltfBuffer: function (target, count, size, source, mode, filter) {
      decode(
        instance.exports[decoders[mode]],
        target,
        count,
        size,
        source,
        instance.exports[filters[filter]],
      );
    },
  };
})();

function _optionalChain$i(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
/**
 * 测试手机：小米8 (微信8.0禁用WebAssembly API，改为WXWebAssembly, 并且不支持SIMD，但是IOS支持WXWebAssembly)
 *
 * 加载时间ms
 *  wasm 58  61  62   (WebAssembly API)
 *  wasm 50  73  83   (WXWebAssembly API)
 *  asm  144 139 134
 * 
 * IPhone7
 *  wasm 22  22  22   (WXWebAssembly API)
 */

class DemoMeshOpt extends Demo {
  async init() {
    const { gltfLoader, camera, scene } = this.deps;
    MeshoptDecoder.setWasmPath('/decoder_base.wasm');
    gltfLoader.setMeshoptDecoder(MeshoptDecoder);
    const t = Date.now();
    const gltf = (await gltfLoader.loadAsync(
      // 'https://meshoptimizer.org/demo/pirate.glb',
      'https://cdn.static.oppenlab.com/weblf/test/pirate.glb',
    )) ;
    console.log(Date.now() - t);

    const pointLight = new three.PointLight(0xffffff, 0.8);
    pointLight.position.set(3, 3, 0);

    this.add(new three.AmbientLight(0xcccccc, 0.3));
    this.add(gltf.scene);
    this.add(camera);
    this.addCamera(pointLight);

    gltf.scene.position.y = -1;
    scene.position.z = 0;
    camera.position.y = 1.0;
    camera.position.z = 3.0;
    scene.background = new three.Color(0x300a24);

    this.addControl();
  }

  update() {
    _optionalChain$i([this, 'access', _ => _.orbitControl, 'optionalAccess', _2 => _2.update, 'call', _3 => _3()]);
  }

  dispose() {
    this.reset();
  }
}

function _optionalChain$h(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
/**
 * ```
 * 模型地址： three.js\examples\models\gltf\PrimaryIonDrive.glb
 * 三角形数：52072
 * 顶点数：91798
 * 转换工具：gltfpack -i PrimaryIonDrive.glb -o PrimaryIonDrive-EXT_MESH_QUANTIZATION.glb
 *           gltfpack -i PrimaryIonDrive.glb -o PrimaryIonDrive-EXT_meshopt_compression.glb -cc
 *           gltf-pipeline -i PrimaryIonDrive.glb -o PrimaryIonDrive-Draco.glb
 *
 * 测试方式：点击菜单的重新进入小程序，加载glb记录时间，重复3次
 *
 *            大小      小米8加载(ms)     IPhone7(ms)
 * orginal    5.53 MB   357 | 284 | 242   584 | 239 | 574
 * mesh_quan  1.39 MB   332 | 301 | 306   261 | 343 | 345
 * meshopt    448 KB    118 | 114 | 110   手机不支持（需WASM）
 * Draco      1.58 MB   未适配Draco       未适配Draco
 * ```
 */

class DemoMeshQuantization extends Demo {
  async init() {
    const { camera, gltfLoader, scene } = this.deps;
    const t = Date.now();
    MeshoptDecoder.setWasmPath('/decoder_base.wasm');
    gltfLoader.setMeshoptDecoder(MeshoptDecoder);
    const gltf = await gltfLoader.loadAsync(
      // 'https://cdn.static.oppenlab.com/weblf/test/PrimaryIonDrive.glb',
      'https://cdn.static.oppenlab.com/weblf/test/PrimaryIonDrive-EXT_MESH_QUANTIZATION.glb',
      // 'https://cdn.static.oppenlab.com/weblf/test/PrimaryIonDrive-EXT_meshopt_compression.glb',
      // 'http://192.168.10.140:8081/PrimaryIonDrive.glb',
      // 'http://192.168.10.140:8081/PrimaryIonDrive-EXT_MESH_QUANTIZATION.glb',
      // 'http://192.168.10.140:8081/PrimaryIonDrive-EXT_meshopt_compression.glb',
    );
    const t1 = Date.now();

    console.log('load glb time', t1 - t);

    this.add(gltf.scene);
    this.add(new three.DirectionalLight(0xffffff, 1));
    this.add(new three.AmbientLight(0xffffff, 1));

    camera.position.z = 3;
    scene.position.z = 0;

    this.addControl();
  }
  update() {
    _optionalChain$h([this, 'access', _ => _.orbitControl, 'optionalAccess', _2 => _2.update, 'call', _3 => _3()]);
  }
  dispose() {
    this.reset();
  }
}

class TGALoader extends three.DataTextureLoader {

	constructor( manager ) {

		super( manager );

	}

	parse( buffer ) {

		// reference from vthibault, https://github.com/vthibault/roBrowser/blob/master/src/Loaders/Targa.js

		function tgaCheckHeader( header ) {

			switch ( header.image_type ) {

				// check indexed type

				case TGA_TYPE_INDEXED:
				case TGA_TYPE_RLE_INDEXED:
					if ( header.colormap_length > 256 || header.colormap_size !== 24 || header.colormap_type !== 1 ) {

						console.error( 'THREE.TGALoader: Invalid type colormap data for indexed type.' );

					}

					break;

					// check colormap type

				case TGA_TYPE_RGB:
				case TGA_TYPE_GREY:
				case TGA_TYPE_RLE_RGB:
				case TGA_TYPE_RLE_GREY:
					if ( header.colormap_type ) {

						console.error( 'THREE.TGALoader: Invalid type colormap data for colormap type.' );

					}

					break;

					// What the need of a file without data ?

				case TGA_TYPE_NO_DATA:
					console.error( 'THREE.TGALoader: No data.' );

					// Invalid type ?

				default:
					console.error( 'THREE.TGALoader: Invalid type "%s".', header.image_type );

			}

			// check image width and height

			if ( header.width <= 0 || header.height <= 0 ) {

				console.error( 'THREE.TGALoader: Invalid image size.' );

			}

			// check image pixel size

			if ( header.pixel_size !== 8 && header.pixel_size !== 16 &&
				header.pixel_size !== 24 && header.pixel_size !== 32 ) {

				console.error( 'THREE.TGALoader: Invalid pixel size "%s".', header.pixel_size );

			}

		}

		// parse tga image buffer

		function tgaParse( use_rle, use_pal, header, offset, data ) {

			let pixel_data,
				palettes;

			const pixel_size = header.pixel_size >> 3;
			const pixel_total = header.width * header.height * pixel_size;

			 // read palettes

			 if ( use_pal ) {

				 palettes = data.subarray( offset, offset += header.colormap_length * ( header.colormap_size >> 3 ) );

			 }

			 // read RLE

			 if ( use_rle ) {

				 pixel_data = new Uint8Array( pixel_total );

				let c, count, i;
				let shift = 0;
				const pixels = new Uint8Array( pixel_size );

				while ( shift < pixel_total ) {

					c = data[ offset ++ ];
					count = ( c & 0x7f ) + 1;

					// RLE pixels

					if ( c & 0x80 ) {

						// bind pixel tmp array

						for ( i = 0; i < pixel_size; ++ i ) {

							pixels[ i ] = data[ offset ++ ];

						}

						// copy pixel array

						for ( i = 0; i < count; ++ i ) {

							pixel_data.set( pixels, shift + i * pixel_size );

						}

						shift += pixel_size * count;

					} else {

						// raw pixels

						count *= pixel_size;

						for ( i = 0; i < count; ++ i ) {

							pixel_data[ shift + i ] = data[ offset ++ ];

						}

						shift += count;

					}

				}

			 } else {

				// raw pixels

				pixel_data = data.subarray(
					 offset, offset += ( use_pal ? header.width * header.height : pixel_total )
				);

			 }

			 return {
				pixel_data: pixel_data,
				palettes: palettes
			 };

		}

		function tgaGetImageData8bits( imageData, y_start, y_step, y_end, x_start, x_step, x_end, image, palettes ) {

			const colormap = palettes;
			let color, i = 0, x, y;
			const width = header.width;

			for ( y = y_start; y !== y_end; y += y_step ) {

				for ( x = x_start; x !== x_end; x += x_step, i ++ ) {

					color = image[ i ];
					imageData[ ( x + width * y ) * 4 + 3 ] = 255;
					imageData[ ( x + width * y ) * 4 + 2 ] = colormap[ ( color * 3 ) + 0 ];
					imageData[ ( x + width * y ) * 4 + 1 ] = colormap[ ( color * 3 ) + 1 ];
					imageData[ ( x + width * y ) * 4 + 0 ] = colormap[ ( color * 3 ) + 2 ];

				}

			}

			return imageData;

		}

		function tgaGetImageData16bits( imageData, y_start, y_step, y_end, x_start, x_step, x_end, image ) {

			let color, i = 0, x, y;
			const width = header.width;

			for ( y = y_start; y !== y_end; y += y_step ) {

				for ( x = x_start; x !== x_end; x += x_step, i += 2 ) {

					color = image[ i + 0 ] + ( image[ i + 1 ] << 8 );
					imageData[ ( x + width * y ) * 4 + 0 ] = ( color & 0x7C00 ) >> 7;
					imageData[ ( x + width * y ) * 4 + 1 ] = ( color & 0x03E0 ) >> 2;
					imageData[ ( x + width * y ) * 4 + 2 ] = ( color & 0x001F ) << 3;
					imageData[ ( x + width * y ) * 4 + 3 ] = ( color & 0x8000 ) ? 0 : 255;

				}

			}

			return imageData;

		}

		function tgaGetImageData24bits( imageData, y_start, y_step, y_end, x_start, x_step, x_end, image ) {

			let i = 0, x, y;
			const width = header.width;

			for ( y = y_start; y !== y_end; y += y_step ) {

				for ( x = x_start; x !== x_end; x += x_step, i += 3 ) {

					imageData[ ( x + width * y ) * 4 + 3 ] = 255;
					imageData[ ( x + width * y ) * 4 + 2 ] = image[ i + 0 ];
					imageData[ ( x + width * y ) * 4 + 1 ] = image[ i + 1 ];
					imageData[ ( x + width * y ) * 4 + 0 ] = image[ i + 2 ];

				}

			}

			return imageData;

		}

		function tgaGetImageData32bits( imageData, y_start, y_step, y_end, x_start, x_step, x_end, image ) {

			let i = 0, x, y;
			const width = header.width;

			for ( y = y_start; y !== y_end; y += y_step ) {

				for ( x = x_start; x !== x_end; x += x_step, i += 4 ) {

					imageData[ ( x + width * y ) * 4 + 2 ] = image[ i + 0 ];
					imageData[ ( x + width * y ) * 4 + 1 ] = image[ i + 1 ];
					imageData[ ( x + width * y ) * 4 + 0 ] = image[ i + 2 ];
					imageData[ ( x + width * y ) * 4 + 3 ] = image[ i + 3 ];

				}

			}

			return imageData;

		}

		function tgaGetImageDataGrey8bits( imageData, y_start, y_step, y_end, x_start, x_step, x_end, image ) {

			let color, i = 0, x, y;
			const width = header.width;

			for ( y = y_start; y !== y_end; y += y_step ) {

				for ( x = x_start; x !== x_end; x += x_step, i ++ ) {

					color = image[ i ];
					imageData[ ( x + width * y ) * 4 + 0 ] = color;
					imageData[ ( x + width * y ) * 4 + 1 ] = color;
					imageData[ ( x + width * y ) * 4 + 2 ] = color;
					imageData[ ( x + width * y ) * 4 + 3 ] = 255;

				}

			}

			return imageData;

		}

		function tgaGetImageDataGrey16bits( imageData, y_start, y_step, y_end, x_start, x_step, x_end, image ) {

			let i = 0, x, y;
			const width = header.width;

			for ( y = y_start; y !== y_end; y += y_step ) {

				for ( x = x_start; x !== x_end; x += x_step, i += 2 ) {

					imageData[ ( x + width * y ) * 4 + 0 ] = image[ i + 0 ];
					imageData[ ( x + width * y ) * 4 + 1 ] = image[ i + 0 ];
					imageData[ ( x + width * y ) * 4 + 2 ] = image[ i + 0 ];
					imageData[ ( x + width * y ) * 4 + 3 ] = image[ i + 1 ];

				}

			}

			return imageData;

		}

		function getTgaRGBA( data, width, height, image, palette ) {

			let x_start,
				y_start,
				x_step,
				y_step,
				x_end,
				y_end;

			switch ( ( header.flags & TGA_ORIGIN_MASK ) >> TGA_ORIGIN_SHIFT ) {

				default:
				case TGA_ORIGIN_UL:
					x_start = 0;
					x_step = 1;
					x_end = width;
					y_start = 0;
					y_step = 1;
					y_end = height;
					break;

				case TGA_ORIGIN_BL:
					x_start = 0;
					x_step = 1;
					x_end = width;
					y_start = height - 1;
					y_step = - 1;
					y_end = - 1;
					break;

				case TGA_ORIGIN_UR:
					x_start = width - 1;
					x_step = - 1;
					x_end = - 1;
					y_start = 0;
					y_step = 1;
					y_end = height;
					break;

				case TGA_ORIGIN_BR:
					x_start = width - 1;
					x_step = - 1;
					x_end = - 1;
					y_start = height - 1;
					y_step = - 1;
					y_end = - 1;
					break;

			}

			if ( use_grey ) {

				switch ( header.pixel_size ) {

					case 8:
						tgaGetImageDataGrey8bits( data, y_start, y_step, y_end, x_start, x_step, x_end, image );
						break;

					case 16:
						tgaGetImageDataGrey16bits( data, y_start, y_step, y_end, x_start, x_step, x_end, image );
						break;

					default:
						console.error( 'THREE.TGALoader: Format not supported.' );
						break;

				}

			} else {

				switch ( header.pixel_size ) {

					case 8:
						tgaGetImageData8bits( data, y_start, y_step, y_end, x_start, x_step, x_end, image, palette );
						break;

					case 16:
						tgaGetImageData16bits( data, y_start, y_step, y_end, x_start, x_step, x_end, image );
						break;

					case 24:
						tgaGetImageData24bits( data, y_start, y_step, y_end, x_start, x_step, x_end, image );
						break;

					case 32:
						tgaGetImageData32bits( data, y_start, y_step, y_end, x_start, x_step, x_end, image );
						break;

					default:
						console.error( 'THREE.TGALoader: Format not supported.' );
						break;

				}

			}

			// Load image data according to specific method
			// let func = 'tgaGetImageData' + (use_grey ? 'Grey' : '') + (header.pixel_size) + 'bits';
			// func(data, y_start, y_step, y_end, x_start, x_step, x_end, width, image, palette );
			return data;

		}

		// TGA constants

		const TGA_TYPE_NO_DATA = 0,
			TGA_TYPE_INDEXED = 1,
			TGA_TYPE_RGB = 2,
			TGA_TYPE_GREY = 3,
			TGA_TYPE_RLE_INDEXED = 9,
			TGA_TYPE_RLE_RGB = 10,
			TGA_TYPE_RLE_GREY = 11,

			TGA_ORIGIN_MASK = 0x30,
			TGA_ORIGIN_SHIFT = 0x04,
			TGA_ORIGIN_BL = 0x00,
			TGA_ORIGIN_BR = 0x01,
			TGA_ORIGIN_UL = 0x02,
			TGA_ORIGIN_UR = 0x03;

		if ( buffer.length < 19 ) console.error( 'THREE.TGALoader: Not enough data to contain header.' );

		let offset = 0;

		const content = new Uint8Array( buffer ),
			header = {
				id_length: content[ offset ++ ],
				colormap_type: content[ offset ++ ],
				image_type: content[ offset ++ ],
				colormap_index: content[ offset ++ ] | content[ offset ++ ] << 8,
				colormap_length: content[ offset ++ ] | content[ offset ++ ] << 8,
				colormap_size: content[ offset ++ ],
				origin: [
					content[ offset ++ ] | content[ offset ++ ] << 8,
					content[ offset ++ ] | content[ offset ++ ] << 8
				],
				width: content[ offset ++ ] | content[ offset ++ ] << 8,
				height: content[ offset ++ ] | content[ offset ++ ] << 8,
				pixel_size: content[ offset ++ ],
				flags: content[ offset ++ ]
			};

		// check tga if it is valid format

		tgaCheckHeader( header );

		if ( header.id_length + offset > buffer.length ) {

			console.error( 'THREE.TGALoader: No data.' );

		}

		// skip the needn't data

		offset += header.id_length;

		// get targa information about RLE compression and palette

		let use_rle = false,
			use_pal = false,
			use_grey = false;

		switch ( header.image_type ) {

			case TGA_TYPE_RLE_INDEXED:
				use_rle = true;
				use_pal = true;
				break;

			case TGA_TYPE_INDEXED:
				use_pal = true;
				break;

			case TGA_TYPE_RLE_RGB:
				use_rle = true;
				break;

			case TGA_TYPE_RGB:
				break;

			case TGA_TYPE_RLE_GREY:
				use_rle = true;
				use_grey = true;
				break;

			case TGA_TYPE_GREY:
				use_grey = true;
				break;

		}

		//

		const imageData = new Uint8Array( header.width * header.height * 4 );
		const result = tgaParse( use_rle, use_pal, header, offset, content );
		getTgaRGBA( imageData, header.width, header.height, result.pixel_data, result.palettes );

		return {

			data: imageData,
			width: header.width,
			height: header.height,
			flipY: true,
			generateMipmaps: true,
			minFilter: three.LinearMipmapLinearFilter,

		};

	}

}

function _optionalChain$g(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
class DemoTGALoader extends Demo {
  async init() {
    const { camera, renderer } = this.deps;
    const loader = new TGALoader();

    const [crateGery, crateColor] = await Promise.all([
      loader.loadAsync(baseUrl$2 + '/textures/crate_grey8.tga'),
      loader.loadAsync(baseUrl$2 + '/textures/crate_color8.tga'),
    ]);

    camera.position.set(0, 50, 250);

    const geometry = new three.BoxGeometry(50, 50, 50);
    const material1 = new three.MeshPhongMaterial({ color: 0xffffff, map: crateGery });
    const mesh1 = new three.Mesh(geometry, material1);
    mesh1.position.x = -50;

    const material2 = new three.MeshPhongMaterial({ color: 0xffffff, map: crateColor });
    const mesh2 = new three.Mesh(geometry, material2);
    mesh2.position.x = 50;

    const dirLight = new three.DirectionalLight(0xffffff, 1);
    dirLight.position.set(1, 1, 1);

    this.add(mesh1);
    this.add(mesh2);
    this.add(dirLight);
    this.add(new three.AmbientLight(0xffffff, 0.4));
    this.addControl();

    renderer.outputEncoding = three.LinearEncoding;
  }
  update() {
    _optionalChain$g([this, 'access', _ => _.orbitControl, 'optionalAccess', _2 => _2.update, 'call', _3 => _3()]);
  }
  dispose() {
    this.reset();
  }
}

class PDBLoader extends three.Loader {

	constructor( manager ) {

		super( manager );

	}

	load( url, onLoad, onProgress, onError ) {

		const scope = this;

		const loader = new three.FileLoader( scope.manager );
		loader.setPath( scope.path );
		loader.setRequestHeader( scope.requestHeader );
		loader.setWithCredentials( scope.withCredentials );
		loader.load( url, function ( text ) {

			try {

				onLoad( scope.parse( text ) );

			} catch ( e ) {

				if ( onError ) {

					onError( e );

				} else {

					console.error( e );

				}

				scope.manager.itemError( url );

			}

		}, onProgress, onError );

	}

	// Based on CanvasMol PDB parser

	parse( text ) {

		function trim( text ) {

			return text.replace( /^\s\s*/, '' ).replace( /\s\s*$/, '' );

		}

		function capitalize( text ) {

			return text.charAt( 0 ).toUpperCase() + text.substr( 1 ).toLowerCase();

		}

		function hash( s, e ) {

			return 's' + Math.min( s, e ) + 'e' + Math.max( s, e );

		}

		function parseBond( start, length, satom, i ) {

			const eatom = parseInt( lines[ i ].substr( start, length ) );

			if ( eatom ) {

				const h = hash( satom, eatom );

				if ( _bhash[ h ] === undefined ) {

					_bonds.push( [ satom - 1, eatom - 1, 1 ] );
					_bhash[ h ] = _bonds.length - 1;

				}

			}

		}

		function buildGeometry() {

			const build = {
				geometryAtoms: new three.BufferGeometry(),
				geometryBonds: new three.BufferGeometry(),
				json: {
					atoms: atoms
				}
			};

			const geometryAtoms = build.geometryAtoms;
			const geometryBonds = build.geometryBonds;

			const verticesAtoms = [];
			const colorsAtoms = [];
			const verticesBonds = [];

			// atoms

			for ( let i = 0, l = atoms.length; i < l; i ++ ) {

				const atom = atoms[ i ];

				const x = atom[ 0 ];
				const y = atom[ 1 ];
				const z = atom[ 2 ];

				verticesAtoms.push( x, y, z );

				const r = atom[ 3 ][ 0 ] / 255;
				const g = atom[ 3 ][ 1 ] / 255;
				const b = atom[ 3 ][ 2 ] / 255;

				colorsAtoms.push( r, g, b );

			}

			// bonds

			for ( let i = 0, l = _bonds.length; i < l; i ++ ) {

				const bond = _bonds[ i ];

				const start = bond[ 0 ];
				const end = bond[ 1 ];

				const startAtom = _atomMap[ start ];
				const endAtom = _atomMap[ end ];

				let x = startAtom[ 0 ];
				let y = startAtom[ 1 ];
				let z = startAtom[ 2 ];

				verticesBonds.push( x, y, z );

				x = endAtom[ 0 ];
				y = endAtom[ 1 ];
				z = endAtom[ 2 ];

				verticesBonds.push( x, y, z );

			}

			// build geometry

			geometryAtoms.setAttribute( 'position', new three.Float32BufferAttribute( verticesAtoms, 3 ) );
			geometryAtoms.setAttribute( 'color', new three.Float32BufferAttribute( colorsAtoms, 3 ) );

			geometryBonds.setAttribute( 'position', new three.Float32BufferAttribute( verticesBonds, 3 ) );

			return build;

		}

		const CPK = { h: [ 255, 255, 255 ], he: [ 217, 255, 255 ], li: [ 204, 128, 255 ], be: [ 194, 255, 0 ], b: [ 255, 181, 181 ], c: [ 144, 144, 144 ], n: [ 48, 80, 248 ], o: [ 255, 13, 13 ], f: [ 144, 224, 80 ], ne: [ 179, 227, 245 ], na: [ 171, 92, 242 ], mg: [ 138, 255, 0 ], al: [ 191, 166, 166 ], si: [ 240, 200, 160 ], p: [ 255, 128, 0 ], s: [ 255, 255, 48 ], cl: [ 31, 240, 31 ], ar: [ 128, 209, 227 ], k: [ 143, 64, 212 ], ca: [ 61, 255, 0 ], sc: [ 230, 230, 230 ], ti: [ 191, 194, 199 ], v: [ 166, 166, 171 ], cr: [ 138, 153, 199 ], mn: [ 156, 122, 199 ], fe: [ 224, 102, 51 ], co: [ 240, 144, 160 ], ni: [ 80, 208, 80 ], cu: [ 200, 128, 51 ], zn: [ 125, 128, 176 ], ga: [ 194, 143, 143 ], ge: [ 102, 143, 143 ], as: [ 189, 128, 227 ], se: [ 255, 161, 0 ], br: [ 166, 41, 41 ], kr: [ 92, 184, 209 ], rb: [ 112, 46, 176 ], sr: [ 0, 255, 0 ], y: [ 148, 255, 255 ], zr: [ 148, 224, 224 ], nb: [ 115, 194, 201 ], mo: [ 84, 181, 181 ], tc: [ 59, 158, 158 ], ru: [ 36, 143, 143 ], rh: [ 10, 125, 140 ], pd: [ 0, 105, 133 ], ag: [ 192, 192, 192 ], cd: [ 255, 217, 143 ], in: [ 166, 117, 115 ], sn: [ 102, 128, 128 ], sb: [ 158, 99, 181 ], te: [ 212, 122, 0 ], i: [ 148, 0, 148 ], xe: [ 66, 158, 176 ], cs: [ 87, 23, 143 ], ba: [ 0, 201, 0 ], la: [ 112, 212, 255 ], ce: [ 255, 255, 199 ], pr: [ 217, 255, 199 ], nd: [ 199, 255, 199 ], pm: [ 163, 255, 199 ], sm: [ 143, 255, 199 ], eu: [ 97, 255, 199 ], gd: [ 69, 255, 199 ], tb: [ 48, 255, 199 ], dy: [ 31, 255, 199 ], ho: [ 0, 255, 156 ], er: [ 0, 230, 117 ], tm: [ 0, 212, 82 ], yb: [ 0, 191, 56 ], lu: [ 0, 171, 36 ], hf: [ 77, 194, 255 ], ta: [ 77, 166, 255 ], w: [ 33, 148, 214 ], re: [ 38, 125, 171 ], os: [ 38, 102, 150 ], ir: [ 23, 84, 135 ], pt: [ 208, 208, 224 ], au: [ 255, 209, 35 ], hg: [ 184, 184, 208 ], tl: [ 166, 84, 77 ], pb: [ 87, 89, 97 ], bi: [ 158, 79, 181 ], po: [ 171, 92, 0 ], at: [ 117, 79, 69 ], rn: [ 66, 130, 150 ], fr: [ 66, 0, 102 ], ra: [ 0, 125, 0 ], ac: [ 112, 171, 250 ], th: [ 0, 186, 255 ], pa: [ 0, 161, 255 ], u: [ 0, 143, 255 ], np: [ 0, 128, 255 ], pu: [ 0, 107, 255 ], am: [ 84, 92, 242 ], cm: [ 120, 92, 227 ], bk: [ 138, 79, 227 ], cf: [ 161, 54, 212 ], es: [ 179, 31, 212 ], fm: [ 179, 31, 186 ], md: [ 179, 13, 166 ], no: [ 189, 13, 135 ], lr: [ 199, 0, 102 ], rf: [ 204, 0, 89 ], db: [ 209, 0, 79 ], sg: [ 217, 0, 69 ], bh: [ 224, 0, 56 ], hs: [ 230, 0, 46 ], mt: [ 235, 0, 38 ], ds: [ 235, 0, 38 ], rg: [ 235, 0, 38 ], cn: [ 235, 0, 38 ], uut: [ 235, 0, 38 ], uuq: [ 235, 0, 38 ], uup: [ 235, 0, 38 ], uuh: [ 235, 0, 38 ], uus: [ 235, 0, 38 ], uuo: [ 235, 0, 38 ] };

		const atoms = [];

		const _bonds = [];
		const _bhash = {};
		const _atomMap = {};

		// parse

		const lines = text.split( '\n' );

		for ( let i = 0, l = lines.length; i < l; i ++ ) {

			if ( lines[ i ].substr( 0, 4 ) === 'ATOM' || lines[ i ].substr( 0, 6 ) === 'HETATM' ) {

				const x = parseFloat( lines[ i ].substr( 30, 7 ) );
				const y = parseFloat( lines[ i ].substr( 38, 7 ) );
				const z = parseFloat( lines[ i ].substr( 46, 7 ) );
				const index = parseInt( lines[ i ].substr( 6, 5 ) ) - 1;

				let e = trim( lines[ i ].substr( 76, 2 ) ).toLowerCase();

				if ( e === '' ) {

					e = trim( lines[ i ].substr( 12, 2 ) ).toLowerCase();

				}

				const atomData = [ x, y, z, CPK[ e ], capitalize( e ) ];

				atoms.push( atomData );
				_atomMap[ index ] = atomData;

			} else if ( lines[ i ].substr( 0, 6 ) === 'CONECT' ) {

				const satom = parseInt( lines[ i ].substr( 6, 5 ) );

				parseBond( 11, 5, satom, i );
				parseBond( 16, 5, satom, i );
				parseBond( 21, 5, satom, i );
				parseBond( 26, 5, satom, i );

			}

		}

		// build and return geometry

		return buildGeometry();

	}

}

function _optionalChain$f(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
class DemoPDBLoader extends Demo {
  
  

  async init() {
    const { camera, scene, renderer } = this.deps;

    camera.position.z = 100;
    scene.position.z = 0;
    scene.background = new three.Color(0x050505);
    renderer.outputEncoding = three.LinearEncoding;

    this.addControl();

    this.obj = new three.Group();
    this.obj.scale.set(0.1, 0.1, 0.1);
    this.add(this.obj);
    const light1 = new three.DirectionalLight(0xffffff, 0.8);
    light1.position.set(1, 1, 1);
    const light2 = new three.DirectionalLight(0xffffff, 0.5);
    light2.position.set(-1, -1, 1);
    this.add(light1);
    this.add(light2);

    const loader = new PDBLoader();
    const pdb = await loader.loadAsync(
      baseUrl$2 + '/models/molecules/caffeine.pdb',
    );
    this.loadMolecule(pdb);
  }
  update() {
    _optionalChain$f([this, 'access', _ => _.orbitControl, 'optionalAccess', _2 => _2.update, 'call', _3 => _3()]);
  }
  dispose() {
    this.reset();
  }

  loadMolecule(pdb) {
    var geometryAtoms = pdb.geometryAtoms;
    var geometryBonds = pdb.geometryBonds;
    var json = pdb.json;
    var offset = new three.Vector3();

    var boxGeometry = new three.BoxGeometry(1, 1, 1);
    var sphereGeometry = new three.IcosahedronGeometry(1, 2);

    geometryAtoms.computeBoundingBox();
    geometryAtoms.boundingBox.getCenter(offset).negate();

    geometryAtoms.translate(offset.x, offset.y, offset.z);
    geometryBonds.translate(offset.x, offset.y, offset.z);

    var positions = geometryAtoms.getAttribute('position');
    var colors = geometryAtoms.getAttribute('color');

    var position = new three.Vector3();
    var color = new three.Color();

    for (var i = 0; i < positions.count; i++) {
      position.x = positions.getX(i);
      position.y = positions.getY(i);
      position.z = positions.getZ(i);

      color.r = colors.getX(i);
      color.g = colors.getY(i);
      color.b = colors.getZ(i);

      var material = new three.MeshPhongMaterial({ color: color });

      var object = new three.Mesh(sphereGeometry, material);
      object.position.copy(position);
      object.position.multiplyScalar(75);
      object.scale.multiplyScalar(25);
      this.obj.add(object);

      json.atoms[i];
    }

    positions = geometryBonds.getAttribute('position');

    var start = new three.Vector3();
    var end = new three.Vector3();

    for (var i = 0; i < positions.count; i += 2) {
      start.x = positions.getX(i);
      start.y = positions.getY(i);
      start.z = positions.getZ(i);

      end.x = positions.getX(i + 1);
      end.y = positions.getY(i + 1);
      end.z = positions.getZ(i + 1);

      start.multiplyScalar(75);
      end.multiplyScalar(75);

      var object = new three.Mesh(
        boxGeometry,
        new three.MeshPhongMaterial({ color: 0xffffff }),
      );
      object.position.copy(start);
      object.position.lerp(end, 0.5);
      object.scale.set(5, 5, start.distanceTo(end));
      object.lookAt(end);
      this.obj.add(object);
    }
  }
}

/**
 * Description: A THREE loader for STL ASCII files, as created by Solidworks and other CAD programs.
 *
 * Supports both binary and ASCII encoded files, with automatic detection of type.
 *
 * The loader returns a non-indexed buffer geometry.
 *
 * Limitations:
 *  Binary decoding supports "Magics" color format (http://en.wikipedia.org/wiki/STL_(file_format)#Color_in_binary_STL).
 *  There is perhaps some question as to how valid it is to always assume little-endian-ness.
 *  ASCII decoding assumes file is UTF-8.
 *
 * Usage:
 *  const loader = new STLLoader();
 *  loader.load( './models/stl/slotted_disk.stl', function ( geometry ) {
 *    scene.add( new THREE.Mesh( geometry ) );
 *  });
 *
 * For binary STLs geometry might contain colors for vertices. To use it:
 *  // use the same code to load STL as above
 *  if (geometry.hasColors) {
 *    material = new THREE.MeshPhongMaterial({ opacity: geometry.alpha, vertexColors: true });
 *  } else { .... }
 *  const mesh = new THREE.Mesh( geometry, material );
 *
 * For ASCII STLs containing multiple solids, each solid is assigned to a different group.
 * Groups can be used to assign a different color by defining an array of materials with the same length of
 * geometry.groups and passing it to the Mesh constructor:
 *
 * const mesh = new THREE.Mesh( geometry, material );
 *
 * For example:
 *
 *  const materials = [];
 *  const nGeometryGroups = geometry.groups.length;
 *
 *  const colorMap = ...; // Some logic to index colors.
 *
 *  for (let i = 0; i < nGeometryGroups; i++) {
 *
 *		const material = new THREE.MeshPhongMaterial({
 *			color: colorMap[i],
 *			wireframe: false
 *		});
 *
 *  }
 *
 *  materials.push(material);
 *  const mesh = new THREE.Mesh(geometry, materials);
 */


class STLLoader extends three.Loader {

	constructor( manager ) {

		super( manager );

	}

	load( url, onLoad, onProgress, onError ) {

		const scope = this;

		const loader = new three.FileLoader( this.manager );
		loader.setPath( this.path );
		loader.setResponseType( 'arraybuffer' );
		loader.setRequestHeader( this.requestHeader );
		loader.setWithCredentials( this.withCredentials );

		loader.load( url, function ( text ) {

			try {

				onLoad( scope.parse( text ) );

			} catch ( e ) {

				if ( onError ) {

					onError( e );

				} else {

					console.error( e );

				}

				scope.manager.itemError( url );

			}

		}, onProgress, onError );

	}

	parse( data ) {

		function isBinary( data ) {

			const reader = new DataView( data );
			const face_size = ( 32 / 8 * 3 ) + ( ( 32 / 8 * 3 ) * 3 ) + ( 16 / 8 );
			const n_faces = reader.getUint32( 80, true );
			const expect = 80 + ( 32 / 8 ) + ( n_faces * face_size );

			if ( expect === reader.byteLength ) {

				return true;

			}

			// An ASCII STL data must begin with 'solid ' as the first six bytes.
			// However, ASCII STLs lacking the SPACE after the 'd' are known to be
			// plentiful.  So, check the first 5 bytes for 'solid'.

			// Several encodings, such as UTF-8, precede the text with up to 5 bytes:
			// https://en.wikipedia.org/wiki/Byte_order_mark#Byte_order_marks_by_encoding
			// Search for "solid" to start anywhere after those prefixes.

			// US-ASCII ordinal values for 's', 'o', 'l', 'i', 'd'

			const solid = [ 115, 111, 108, 105, 100 ];

			for ( let off = 0; off < 5; off ++ ) {

				// If "solid" text is matched to the current offset, declare it to be an ASCII STL.

				if ( matchDataViewAt( solid, reader, off ) ) return false;

			}

			// Couldn't find "solid" text at the beginning; it is binary STL.

			return true;

		}

		function matchDataViewAt( query, reader, offset ) {

			// Check if each byte in query matches the corresponding byte from the current offset

			for ( let i = 0, il = query.length; i < il; i ++ ) {

				if ( query[ i ] !== reader.getUint8( offset + i, false ) ) return false;

			}

			return true;

		}

		function parseBinary( data ) {

			const reader = new DataView( data );
			const faces = reader.getUint32( 80, true );

			let r, g, b, hasColors = false, colors;
			let defaultR, defaultG, defaultB, alpha;

			// process STL header
			// check for default color in header ("COLOR=rgba" sequence).

			for ( let index = 0; index < 80 - 10; index ++ ) {

				if ( ( reader.getUint32( index, false ) == 0x434F4C4F /*COLO*/ ) &&
					( reader.getUint8( index + 4 ) == 0x52 /*'R'*/ ) &&
					( reader.getUint8( index + 5 ) == 0x3D /*'='*/ ) ) {

					hasColors = true;
					colors = new Float32Array( faces * 3 * 3 );

					defaultR = reader.getUint8( index + 6 ) / 255;
					defaultG = reader.getUint8( index + 7 ) / 255;
					defaultB = reader.getUint8( index + 8 ) / 255;
					alpha = reader.getUint8( index + 9 ) / 255;

				}

			}

			const dataOffset = 84;
			const faceLength = 12 * 4 + 2;

			const geometry = new three.BufferGeometry();

			const vertices = new Float32Array( faces * 3 * 3 );
			const normals = new Float32Array( faces * 3 * 3 );

			for ( let face = 0; face < faces; face ++ ) {

				const start = dataOffset + face * faceLength;
				const normalX = reader.getFloat32( start, true );
				const normalY = reader.getFloat32( start + 4, true );
				const normalZ = reader.getFloat32( start + 8, true );

				if ( hasColors ) {

					const packedColor = reader.getUint16( start + 48, true );

					if ( ( packedColor & 0x8000 ) === 0 ) {

						// facet has its own unique color

						r = ( packedColor & 0x1F ) / 31;
						g = ( ( packedColor >> 5 ) & 0x1F ) / 31;
						b = ( ( packedColor >> 10 ) & 0x1F ) / 31;

					} else {

						r = defaultR;
						g = defaultG;
						b = defaultB;

					}

				}

				for ( let i = 1; i <= 3; i ++ ) {

					const vertexstart = start + i * 12;
					const componentIdx = ( face * 3 * 3 ) + ( ( i - 1 ) * 3 );

					vertices[ componentIdx ] = reader.getFloat32( vertexstart, true );
					vertices[ componentIdx + 1 ] = reader.getFloat32( vertexstart + 4, true );
					vertices[ componentIdx + 2 ] = reader.getFloat32( vertexstart + 8, true );

					normals[ componentIdx ] = normalX;
					normals[ componentIdx + 1 ] = normalY;
					normals[ componentIdx + 2 ] = normalZ;

					if ( hasColors ) {

						colors[ componentIdx ] = r;
						colors[ componentIdx + 1 ] = g;
						colors[ componentIdx + 2 ] = b;

					}

				}

			}

			geometry.setAttribute( 'position', new three.BufferAttribute( vertices, 3 ) );
			geometry.setAttribute( 'normal', new three.BufferAttribute( normals, 3 ) );

			if ( hasColors ) {

				geometry.setAttribute( 'color', new three.BufferAttribute( colors, 3 ) );
				geometry.hasColors = true;
				geometry.alpha = alpha;

			}

			return geometry;

		}

		function parseASCII( data ) {

			const geometry = new three.BufferGeometry();
			const patternSolid = /solid([\s\S]*?)endsolid/g;
			const patternFace = /facet([\s\S]*?)endfacet/g;
			let faceCounter = 0;

			const patternFloat = /[\s]+([+-]?(?:\d*)(?:\.\d*)?(?:[eE][+-]?\d+)?)/.source;
			const patternVertex = new RegExp( 'vertex' + patternFloat + patternFloat + patternFloat, 'g' );
			const patternNormal = new RegExp( 'normal' + patternFloat + patternFloat + patternFloat, 'g' );

			const vertices = [];
			const normals = [];

			const normal = new three.Vector3();

			let result;

			let groupCount = 0;
			let startVertex = 0;
			let endVertex = 0;

			while ( ( result = patternSolid.exec( data ) ) !== null ) {

				startVertex = endVertex;

				const solid = result[ 0 ];

				while ( ( result = patternFace.exec( solid ) ) !== null ) {

					let vertexCountPerFace = 0;
					let normalCountPerFace = 0;

					const text = result[ 0 ];

					while ( ( result = patternNormal.exec( text ) ) !== null ) {

						normal.x = parseFloat( result[ 1 ] );
						normal.y = parseFloat( result[ 2 ] );
						normal.z = parseFloat( result[ 3 ] );
						normalCountPerFace ++;

					}

					while ( ( result = patternVertex.exec( text ) ) !== null ) {

						vertices.push( parseFloat( result[ 1 ] ), parseFloat( result[ 2 ] ), parseFloat( result[ 3 ] ) );
						normals.push( normal.x, normal.y, normal.z );
						vertexCountPerFace ++;
						endVertex ++;

					}

					// every face have to own ONE valid normal

					if ( normalCountPerFace !== 1 ) {

						console.error( 'THREE.STLLoader: Something isn\'t right with the normal of face number ' + faceCounter );

					}

					// each face have to own THREE valid vertices

					if ( vertexCountPerFace !== 3 ) {

						console.error( 'THREE.STLLoader: Something isn\'t right with the vertices of face number ' + faceCounter );

					}

					faceCounter ++;

				}

				const start = startVertex;
				const count = endVertex - startVertex;

				geometry.addGroup( start, count, groupCount );
				groupCount ++;

			}

			geometry.setAttribute( 'position', new three.Float32BufferAttribute( vertices, 3 ) );
			geometry.setAttribute( 'normal', new three.Float32BufferAttribute( normals, 3 ) );

			return geometry;

		}

		function ensureString( buffer ) {

			if ( typeof buffer !== 'string' ) {

				return three.LoaderUtils.decodeText( new Uint8Array( buffer ) );

			}

			return buffer;

		}

		function ensureBinary( buffer ) {

			if ( typeof buffer === 'string' ) {

				const array_buffer = new Uint8Array( buffer.length );
				for ( let i = 0; i < buffer.length; i ++ ) {

					array_buffer[ i ] = buffer.charCodeAt( i ) & 0xff; // implicitly assumes little-endian

				}

				return array_buffer.buffer || array_buffer;

			} else {

				return buffer;

			}

		}

		// start

		const binData = ensureBinary( data );

		return isBinary( binData ) ? parseBinary( binData ) : parseASCII( ensureString( data ) );

	}

}

function _optionalChain$e(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
class DemoSTLLoader extends Demo {
  async init() {
    const { camera, renderer, scene } = this.deps;

    camera.position.set(3, 0.15, 3);
    renderer.setClearColor(0xffffff);
    scene.position.z = 0;
    scene.background = new three.Color(0x72645b);
    scene.fog = new three.Fog(0x72645b, 2, 15);
    renderer.shadowMap.enabled = true;

    const plane = new three.Mesh(new three.PlaneGeometry(40, 40), new three.MeshPhongMaterial({ color: 0x999999, specular: 0x101010 }));
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -0.5;
    plane.receiveShadow = true;

    this.add(plane);
    this.add(new three.AmbientLight(0x444444));
    this.addShadowedLight(1, 1, 1, 0xffffff, 1.35);
    this.addShadowedLight(0.5, 1, -1, 0xffaa00, 1);
    this.addControl();
    this.loadModels();
  }

  addShadowedLight(x, y, z, color, intensity) {
    const directionalLight = new three.DirectionalLight(color, intensity);
    directionalLight.position.set(x, y, z);
    this.add(directionalLight);

    directionalLight.castShadow = true;

    const d = 1;
    directionalLight.shadow.camera.left = -d;
    directionalLight.shadow.camera.right = d;
    directionalLight.shadow.camera.top = d;
    directionalLight.shadow.camera.bottom = -d;

    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 4;

    directionalLight.shadow.bias = -0.002;
  }

  loadModels() {
    const loader = new STLLoader();
    loader.load(baseUrl$2 + '/models/stl/ascii/slotted_disk.stl', geometry => {
      const material = new three.MeshPhongMaterial({ color: 0xff5533, specular: 0x111111, shininess: 200 });
      const mesh = new three.Mesh(geometry, material);

      mesh.position.set(0, -0.25, 0.6);
      mesh.rotation.set(0, -Math.PI / 2, 0);
      mesh.scale.set(0.5, 0.5, 0.5);

      mesh.castShadow = true;
      mesh.receiveShadow = true;

      this.add(mesh);
    });

    // Binary files
    const material = new three.MeshPhongMaterial({ color: 0xaaaaaa, specular: 0x111111, shininess: 200 });

    loader.load(baseUrl$2 + '/models/stl/binary/pr2_head_pan.stl', geometry => {
      const mesh = new three.Mesh(geometry, material);

      mesh.position.set(0, -0.37, -0.6);
      mesh.rotation.set(-Math.PI / 2, 0, 0);
      mesh.scale.set(2, 2, 2);

      mesh.castShadow = true;
      mesh.receiveShadow = true;

      this.add(mesh);
    });

    loader.load('./models/stl/binary/pr2_head_tilt.stl', geometry => {
      const mesh = new three.Mesh(geometry, material);

      mesh.position.set(0.136, -0.37, -0.6);
      mesh.rotation.set(-Math.PI / 2, 0.3, 0);
      mesh.scale.set(2, 2, 2);

      mesh.castShadow = true;
      mesh.receiveShadow = true;

      this.add(mesh);
    });

    // Colored binary STL
    loader.load(baseUrl$2 + '/models/stl/binary/colored.stl', geometry => {
      let meshMaterial = material;
      // @ts-ignore
      if (geometry.hasColors) {
        // @ts-ignore
        meshMaterial = new three.MeshPhongMaterial({ opacity: geometry.alpha, vertexColors: true });
      }

      const mesh = new three.Mesh(geometry, meshMaterial);

      mesh.position.set(0.5, 0.2, 0);
      mesh.rotation.set(-Math.PI / 2, Math.PI / 2, 0);
      mesh.scale.set(0.3, 0.3, 0.3);

      mesh.castShadow = true;
      mesh.receiveShadow = true;

      this.add(mesh);
    });
  }
  update() {
    _optionalChain$e([this, 'access', _ => _.orbitControl, 'optionalAccess', _2 => _2.update, 'call', _3 => _3()]);
    this.deps.camera.lookAt(new three.Vector3(0, -0.25, 0));
  }
  dispose() {
    this.reset();
  }
}

/**
 * Description: reads BVH files and outputs a single Skeleton and an AnimationClip
 *
 * Currently only supports bvh files containing a single root.
 *
 */

class BVHLoader extends three.Loader {

	constructor( manager ) {

		super( manager );

		this.animateBonePositions = true;
		this.animateBoneRotations = true;

	}

	load( url, onLoad, onProgress, onError ) {

		const scope = this;

		const loader = new three.FileLoader( scope.manager );
		loader.setPath( scope.path );
		loader.setRequestHeader( scope.requestHeader );
		loader.setWithCredentials( scope.withCredentials );
		loader.load( url, function ( text ) {

			try {

				onLoad( scope.parse( text ) );

			} catch ( e ) {

				if ( onError ) {

					onError( e );

				} else {

					console.error( e );

				}

				scope.manager.itemError( url );

			}

		}, onProgress, onError );

	}

	parse( text ) {

		/*
			reads a string array (lines) from a BVH file
			and outputs a skeleton structure including motion data

			returns thee root node:
			{ name: '', channels: [], children: [] }
		*/
		function readBvh( lines ) {

			// read model structure

			if ( nextLine( lines ) !== 'HIERARCHY' ) {

				console.error( 'THREE.BVHLoader: HIERARCHY expected.' );

			}

			const list = []; // collects flat array of all bones
			const root = readNode( lines, nextLine( lines ), list );

			// read motion data

			if ( nextLine( lines ) !== 'MOTION' ) {

				console.error( 'THREE.BVHLoader: MOTION expected.' );

			}

			// number of frames

			let tokens = nextLine( lines ).split( /[\s]+/ );
			const numFrames = parseInt( tokens[ 1 ] );

			if ( isNaN( numFrames ) ) {

				console.error( 'THREE.BVHLoader: Failed to read number of frames.' );

			}

			// frame time

			tokens = nextLine( lines ).split( /[\s]+/ );
			const frameTime = parseFloat( tokens[ 2 ] );

			if ( isNaN( frameTime ) ) {

				console.error( 'THREE.BVHLoader: Failed to read frame time.' );

			}

			// read frame data line by line

			for ( let i = 0; i < numFrames; i ++ ) {

				tokens = nextLine( lines ).split( /[\s]+/ );
				readFrameData( tokens, i * frameTime, root );

			}

			return list;

		}

		/*
			Recursively reads data from a single frame into the bone hierarchy.
			The passed bone hierarchy has to be structured in the same order as the BVH file.
			keyframe data is stored in bone.frames.

			- data: splitted string array (frame values), values are shift()ed so
			this should be empty after parsing the whole hierarchy.
			- frameTime: playback time for this keyframe.
			- bone: the bone to read frame data from.
		*/
		function readFrameData( data, frameTime, bone ) {

			// end sites have no motion data

			if ( bone.type === 'ENDSITE' ) return;

			// add keyframe

			const keyframe = {
				time: frameTime,
				position: new three.Vector3(),
				rotation: new three.Quaternion()
			};

			bone.frames.push( keyframe );

			const quat = new three.Quaternion();

			const vx = new three.Vector3( 1, 0, 0 );
			const vy = new three.Vector3( 0, 1, 0 );
			const vz = new three.Vector3( 0, 0, 1 );

			// parse values for each channel in node

			for ( let i = 0; i < bone.channels.length; i ++ ) {

				switch ( bone.channels[ i ] ) {

					case 'Xposition':
						keyframe.position.x = parseFloat( data.shift().trim() );
						break;
					case 'Yposition':
						keyframe.position.y = parseFloat( data.shift().trim() );
						break;
					case 'Zposition':
						keyframe.position.z = parseFloat( data.shift().trim() );
						break;
					case 'Xrotation':
						quat.setFromAxisAngle( vx, parseFloat( data.shift().trim() ) * Math.PI / 180 );
						keyframe.rotation.multiply( quat );
						break;
					case 'Yrotation':
						quat.setFromAxisAngle( vy, parseFloat( data.shift().trim() ) * Math.PI / 180 );
						keyframe.rotation.multiply( quat );
						break;
					case 'Zrotation':
						quat.setFromAxisAngle( vz, parseFloat( data.shift().trim() ) * Math.PI / 180 );
						keyframe.rotation.multiply( quat );
						break;
					default:
						console.warn( 'THREE.BVHLoader: Invalid channel type.' );

				}

			}

			// parse child nodes

			for ( let i = 0; i < bone.children.length; i ++ ) {

				readFrameData( data, frameTime, bone.children[ i ] );

			}

		}

		/*
		 Recursively parses the HIERACHY section of the BVH file

		 - lines: all lines of the file. lines are consumed as we go along.
		 - firstline: line containing the node type and name e.g. 'JOINT hip'
		 - list: collects a flat list of nodes

		 returns: a BVH node including children
		*/
		function readNode( lines, firstline, list ) {

			const node = { name: '', type: '', frames: [] };
			list.push( node );

			// parse node type and name

			let tokens = firstline.split( /[\s]+/ );

			if ( tokens[ 0 ].toUpperCase() === 'END' && tokens[ 1 ].toUpperCase() === 'SITE' ) {

				node.type = 'ENDSITE';
				node.name = 'ENDSITE'; // bvh end sites have no name

			} else {

				node.name = tokens[ 1 ];
				node.type = tokens[ 0 ].toUpperCase();

			}

			if ( nextLine( lines ) !== '{' ) {

				console.error( 'THREE.BVHLoader: Expected opening { after type & name' );

			}

			// parse OFFSET

			tokens = nextLine( lines ).split( /[\s]+/ );

			if ( tokens[ 0 ] !== 'OFFSET' ) {

				console.error( 'THREE.BVHLoader: Expected OFFSET but got: ' + tokens[ 0 ] );

			}

			if ( tokens.length !== 4 ) {

				console.error( 'THREE.BVHLoader: Invalid number of values for OFFSET.' );

			}

			const offset = new three.Vector3(
				parseFloat( tokens[ 1 ] ),
				parseFloat( tokens[ 2 ] ),
				parseFloat( tokens[ 3 ] )
			);

			if ( isNaN( offset.x ) || isNaN( offset.y ) || isNaN( offset.z ) ) {

				console.error( 'THREE.BVHLoader: Invalid values of OFFSET.' );

			}

			node.offset = offset;

			// parse CHANNELS definitions

			if ( node.type !== 'ENDSITE' ) {

				tokens = nextLine( lines ).split( /[\s]+/ );

				if ( tokens[ 0 ] !== 'CHANNELS' ) {

					console.error( 'THREE.BVHLoader: Expected CHANNELS definition.' );

				}

				const numChannels = parseInt( tokens[ 1 ] );
				node.channels = tokens.splice( 2, numChannels );
				node.children = [];

			}

			// read children

			while ( true ) {

				const line = nextLine( lines );

				if ( line === '}' ) {

					return node;

				} else {

					node.children.push( readNode( lines, line, list ) );

				}

			}

		}

		/*
			recursively converts the internal bvh node structure to a Bone hierarchy

			source: the bvh root node
			list: pass an empty array, collects a flat list of all converted THREE.Bones

			returns the root Bone
		*/
		function toTHREEBone( source, list ) {

			const bone = new three.Bone();
			list.push( bone );

			bone.position.add( source.offset );
			bone.name = source.name;

			if ( source.type !== 'ENDSITE' ) {

				for ( let i = 0; i < source.children.length; i ++ ) {

					bone.add( toTHREEBone( source.children[ i ], list ) );

				}

			}

			return bone;

		}

		/*
			builds a AnimationClip from the keyframe data saved in each bone.

			bone: bvh root node

			returns: a AnimationClip containing position and quaternion tracks
		*/
		function toTHREEAnimation( bones ) {

			const tracks = [];

			// create a position and quaternion animation track for each node

			for ( let i = 0; i < bones.length; i ++ ) {

				const bone = bones[ i ];

				if ( bone.type === 'ENDSITE' )
					continue;

				// track data

				const times = [];
				const positions = [];
				const rotations = [];

				for ( let j = 0; j < bone.frames.length; j ++ ) {

					const frame = bone.frames[ j ];

					times.push( frame.time );

					// the animation system animates the position property,
					// so we have to add the joint offset to all values

					positions.push( frame.position.x + bone.offset.x );
					positions.push( frame.position.y + bone.offset.y );
					positions.push( frame.position.z + bone.offset.z );

					rotations.push( frame.rotation.x );
					rotations.push( frame.rotation.y );
					rotations.push( frame.rotation.z );
					rotations.push( frame.rotation.w );

				}

				if ( scope.animateBonePositions ) {

					tracks.push( new three.VectorKeyframeTrack( '.bones[' + bone.name + '].position', times, positions ) );

				}

				if ( scope.animateBoneRotations ) {

					tracks.push( new three.QuaternionKeyframeTrack( '.bones[' + bone.name + '].quaternion', times, rotations ) );

				}

			}

			return new three.AnimationClip( 'animation', - 1, tracks );

		}

		/*
			returns the next non-empty line in lines
		*/
		function nextLine( lines ) {

			let line;
			// skip empty lines
			while ( ( line = lines.shift().trim() ).length === 0 ) { }

			return line;

		}

		const scope = this;

		const lines = text.split( /[\r\n]+/g );

		const bones = readBvh( lines );

		const threeBones = [];
		toTHREEBone( bones[ 0 ], threeBones );

		const threeClip = toTHREEAnimation( bones );

		return {
			skeleton: new three.Skeleton( threeBones ),
			clip: threeClip
		};

	}

}

function _optionalChain$d(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
class DemoBVHLoader extends Demo {
  
  async init() {
    const { scene, camera } = this.deps;
    const loader = new BVHLoader();

    camera.position.set(0, 200, 300);

    const result = await loader.loadAsync(
      baseUrl$2 + '/models/bvh/pirouette.bvh',
    );
    const skeletonHelper = new three.SkeletonHelper(result.skeleton.bones[0]);
    // @ts-ignore
    skeletonHelper.skeleton = result.skeleton; // allow animation mixer to bind to SkeletonHelper directly

    const boneContainer = new three.Group();
    boneContainer.add(result.skeleton.bones[0]);

    this.add(skeletonHelper);
    this.add(boneContainer);
    scene.background = new three.Color(0xeeeeee);

    this.add(new three.GridHelper(400, 10));

    // play animation
    this.mixer = new three.AnimationMixer(skeletonHelper);
    this.mixer.clipAction(result.clip).setEffectiveWeight(1.0).play();

    this.addControl();
    this.orbitControl.minDistance = 300;
    this.orbitControl.maxDistance = 700;
  }
  update() {
    _optionalChain$d([this, 'access', _ => _.mixer, 'optionalAccess', _2 => _2.update, 'call', _3 => _3(this.deps.clock.getDelta())]);
    _optionalChain$d([this, 'access', _4 => _4.orbitControl, 'optionalAccess', _5 => _5.update, 'call', _6 => _6()]);
  }
  dispose() {
    this.reset();
    this.mixer.stopAllAction();
    this.mixer = null;
  }
}

/*!
fflate - fast JavaScript compression/decompression
<https://101arrowz.github.io/fflate>
Licensed under MIT. https://github.com/101arrowz/fflate/blob/master/LICENSE
version 0.6.9
*/

// DEFLATE is a complex format; to read this code, you should probably check the RFC first:
// https://tools.ietf.org/html/rfc1951
// You may also wish to take a look at the guide I made about this program:
// https://gist.github.com/101arrowz/253f31eb5abc3d9275ab943003ffecad
// Some of the following code is similar to that of UZIP.js:
// https://github.com/photopea/UZIP.js
// However, the vast majority of the codebase has diverged from UZIP.js to increase performance and reduce bundle size.
// Sometimes 0 will appear where -1 would be more appropriate. This is because using a uint
// is better for memory in most engines (I *think*).
var ch2 = {};
var durl = function (c) { return three._default.polyfill.URL.createObjectURL(new three._default.polyfill.Blob([c], { type: 'text/javascript' })); };
var cwk = function (u) { return new Worker(u); };
try {
    three._default.polyfill.URL.revokeObjectURL(durl(''));
}
catch (e) {
    // We're in Deno or a very old browser
    durl = function (c) { return 'data:application/javascript;charset=UTF-8,' + encodeURI(c); };
    // If Deno, this is necessary; if not, this changes nothing
    cwk = function (u) { return new Worker(u, { type: 'module' }); };
}
var wk = (function (c, id, msg, transfer, cb) {
    var w = cwk(ch2[id] || (ch2[id] = durl(c)));
    w.onerror = function (e) { return cb(e.error, null); };
    w.onmessage = function (e) { return cb(null, e.data); };
    w.postMessage(msg, transfer);
    return w;
});

// aliases for shorter compressed code (most minifers don't do this)
var u8 = Uint8Array, u16 = Uint16Array, u32 = Uint32Array;
// fixed length extra bits
var fleb = new u8([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, /* unused */ 0, 0, /* impossible */ 0]);
// fixed distance extra bits
// see fleb note
var fdeb = new u8([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, /* unused */ 0, 0]);
// code length index map
var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
// get base, reverse index map from extra bits
var freb = function (eb, start) {
    var b = new u16(31);
    for (var i = 0; i < 31; ++i) {
        b[i] = start += 1 << eb[i - 1];
    }
    // numbers here are at max 18 bits
    var r = new u32(b[30]);
    for (var i = 1; i < 30; ++i) {
        for (var j = b[i]; j < b[i + 1]; ++j) {
            r[j] = ((j - b[i]) << 5) | i;
        }
    }
    return [b, r];
};
var _a = freb(fleb, 2), fl = _a[0], revfl = _a[1];
// we can ignore the fact that the other numbers are wrong; they never happen anyway
fl[28] = 258, revfl[258] = 28;
var _b = freb(fdeb, 0), fd = _b[0], revfd = _b[1];
// map of value to reverse (assuming 16 bits)
var rev = new u16(32768);
for (var i = 0; i < 32768; ++i) {
    // reverse table algorithm from SO
    var x = ((i & 0xAAAA) >>> 1) | ((i & 0x5555) << 1);
    x = ((x & 0xCCCC) >>> 2) | ((x & 0x3333) << 2);
    x = ((x & 0xF0F0) >>> 4) | ((x & 0x0F0F) << 4);
    rev[i] = (((x & 0xFF00) >>> 8) | ((x & 0x00FF) << 8)) >>> 1;
}
// create huffman tree from u8 "map": index -> code length for code index
// mb (max bits) must be at most 15
// TODO: optimize/split up?
var hMap = (function (cd, mb, r) {
    var s = cd.length;
    // index
    var i = 0;
    // u16 "map": index -> # of codes with bit length = index
    var l = new u16(mb);
    // length of cd must be 288 (total # of codes)
    for (; i < s; ++i)
        ++l[cd[i] - 1];
    // u16 "map": index -> minimum code for bit length = index
    var le = new u16(mb);
    for (i = 0; i < mb; ++i) {
        le[i] = (le[i - 1] + l[i - 1]) << 1;
    }
    var co;
    if (r) {
        // u16 "map": index -> number of actual bits, symbol for code
        co = new u16(1 << mb);
        // bits to remove for reverser
        var rvb = 15 - mb;
        for (i = 0; i < s; ++i) {
            // ignore 0 lengths
            if (cd[i]) {
                // num encoding both symbol and bits read
                var sv = (i << 4) | cd[i];
                // free bits
                var r_1 = mb - cd[i];
                // start value
                var v = le[cd[i] - 1]++ << r_1;
                // m is end value
                for (var m = v | ((1 << r_1) - 1); v <= m; ++v) {
                    // every 16 bit value starting with the code yields the same result
                    co[rev[v] >>> rvb] = sv;
                }
            }
        }
    }
    else {
        co = new u16(s);
        for (i = 0; i < s; ++i) {
            if (cd[i]) {
                co[i] = rev[le[cd[i] - 1]++] >>> (15 - cd[i]);
            }
        }
    }
    return co;
});
// fixed length tree
var flt = new u8(288);
for (var i = 0; i < 144; ++i)
    flt[i] = 8;
for (var i = 144; i < 256; ++i)
    flt[i] = 9;
for (var i = 256; i < 280; ++i)
    flt[i] = 7;
for (var i = 280; i < 288; ++i)
    flt[i] = 8;
// fixed distance tree
var fdt = new u8(32);
for (var i = 0; i < 32; ++i)
    fdt[i] = 5;
// fixed length map
var flm = /*#__PURE__*/ hMap(flt, 9, 0), flrm = /*#__PURE__*/ hMap(flt, 9, 1);
// fixed distance map
var fdm = /*#__PURE__*/ hMap(fdt, 5, 0), fdrm = /*#__PURE__*/ hMap(fdt, 5, 1);
// find max of array
var max = function (a) {
    var m = a[0];
    for (var i = 1; i < a.length; ++i) {
        if (a[i] > m)
            m = a[i];
    }
    return m;
};
// read d, starting at bit p and mask with m
var bits = function (d, p, m) {
    var o = (p / 8) | 0;
    return ((d[o] | (d[o + 1] << 8)) >> (p & 7)) & m;
};
// read d, starting at bit p continuing for at least 16 bits
var bits16 = function (d, p) {
    var o = (p / 8) | 0;
    return ((d[o] | (d[o + 1] << 8) | (d[o + 2] << 16)) >> (p & 7));
};
// get end of byte
var shft = function (p) { return ((p / 8) | 0) + (p & 7 && 1); };
// typed array slice - allows garbage collector to free original reference,
// while being more compatible than .slice
var slc = function (v, s, e) {
    if (s == null || s < 0)
        s = 0;
    if (e == null || e > v.length)
        e = v.length;
    // can't use .constructor in case user-supplied
    var n = new (v instanceof u16 ? u16 : v instanceof u32 ? u32 : u8)(e - s);
    n.set(v.subarray(s, e));
    return n;
};
// expands raw DEFLATE data
var inflt = function (dat, buf, st) {
    // source length
    var sl = dat.length;
    if (!sl || (st && !st.l && sl < 5))
        return buf || new u8(0);
    // have to estimate size
    var noBuf = !buf || st;
    // no state
    var noSt = !st || st.i;
    if (!st)
        st = {};
    // Assumes roughly 33% compression ratio average
    if (!buf)
        buf = new u8(sl * 3);
    // ensure buffer can fit at least l elements
    var cbuf = function (l) {
        var bl = buf.length;
        // need to increase size to fit
        if (l > bl) {
            // Double or set to necessary, whichever is greater
            var nbuf = new u8(Math.max(bl * 2, l));
            nbuf.set(buf);
            buf = nbuf;
        }
    };
    //  last chunk         bitpos           bytes
    var final = st.f || 0, pos = st.p || 0, bt = st.b || 0, lm = st.l, dm = st.d, lbt = st.m, dbt = st.n;
    // total bits
    var tbts = sl * 8;
    do {
        if (!lm) {
            // BFINAL - this is only 1 when last chunk is next
            st.f = final = bits(dat, pos, 1);
            // type: 0 = no compression, 1 = fixed huffman, 2 = dynamic huffman
            var type = bits(dat, pos + 1, 3);
            pos += 3;
            if (!type) {
                // go to end of byte boundary
                var s = shft(pos) + 4, l = dat[s - 4] | (dat[s - 3] << 8), t = s + l;
                if (t > sl) {
                    if (noSt)
                        throw 'unexpected EOF';
                    break;
                }
                // ensure size
                if (noBuf)
                    cbuf(bt + l);
                // Copy over uncompressed data
                buf.set(dat.subarray(s, t), bt);
                // Get new bitpos, update byte count
                st.b = bt += l, st.p = pos = t * 8;
                continue;
            }
            else if (type == 1)
                lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
            else if (type == 2) {
                //  literal                            lengths
                var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
                var tl = hLit + bits(dat, pos + 5, 31) + 1;
                pos += 14;
                // length+distance tree
                var ldt = new u8(tl);
                // code length tree
                var clt = new u8(19);
                for (var i = 0; i < hcLen; ++i) {
                    // use index map to get real code
                    clt[clim[i]] = bits(dat, pos + i * 3, 7);
                }
                pos += hcLen * 3;
                // code lengths bits
                var clb = max(clt), clbmsk = (1 << clb) - 1;
                // code lengths map
                var clm = hMap(clt, clb, 1);
                for (var i = 0; i < tl;) {
                    var r = clm[bits(dat, pos, clbmsk)];
                    // bits read
                    pos += r & 15;
                    // symbol
                    var s = r >>> 4;
                    // code length to copy
                    if (s < 16) {
                        ldt[i++] = s;
                    }
                    else {
                        //  copy   count
                        var c = 0, n = 0;
                        if (s == 16)
                            n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i - 1];
                        else if (s == 17)
                            n = 3 + bits(dat, pos, 7), pos += 3;
                        else if (s == 18)
                            n = 11 + bits(dat, pos, 127), pos += 7;
                        while (n--)
                            ldt[i++] = c;
                    }
                }
                //    length tree                 distance tree
                var lt = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
                // max length bits
                lbt = max(lt);
                // max dist bits
                dbt = max(dt);
                lm = hMap(lt, lbt, 1);
                dm = hMap(dt, dbt, 1);
            }
            else
                throw 'invalid block type';
            if (pos > tbts) {
                if (noSt)
                    throw 'unexpected EOF';
                break;
            }
        }
        // Make sure the buffer can hold this + the largest possible addition
        // Maximum chunk size (practically, theoretically infinite) is 2^17;
        if (noBuf)
            cbuf(bt + 131072);
        var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
        var lpos = pos;
        for (;; lpos = pos) {
            // bits read, code
            var c = lm[bits16(dat, pos) & lms], sym = c >>> 4;
            pos += c & 15;
            if (pos > tbts) {
                if (noSt)
                    throw 'unexpected EOF';
                break;
            }
            if (!c)
                throw 'invalid length/literal';
            if (sym < 256)
                buf[bt++] = sym;
            else if (sym == 256) {
                lpos = pos, lm = null;
                break;
            }
            else {
                var add = sym - 254;
                // no extra bits needed if less
                if (sym > 264) {
                    // index
                    var i = sym - 257, b = fleb[i];
                    add = bits(dat, pos, (1 << b) - 1) + fl[i];
                    pos += b;
                }
                // dist
                var d = dm[bits16(dat, pos) & dms], dsym = d >>> 4;
                if (!d)
                    throw 'invalid distance';
                pos += d & 15;
                var dt = fd[dsym];
                if (dsym > 3) {
                    var b = fdeb[dsym];
                    dt += bits16(dat, pos) & ((1 << b) - 1), pos += b;
                }
                if (pos > tbts) {
                    if (noSt)
                        throw 'unexpected EOF';
                    break;
                }
                if (noBuf)
                    cbuf(bt + 131072);
                var end = bt + add;
                for (; bt < end; bt += 4) {
                    buf[bt] = buf[bt - dt];
                    buf[bt + 1] = buf[bt + 1 - dt];
                    buf[bt + 2] = buf[bt + 2 - dt];
                    buf[bt + 3] = buf[bt + 3 - dt];
                }
                bt = end;
            }
        }
        st.l = lm, st.p = lpos, st.b = bt;
        if (lm)
            final = 1, st.m = lbt, st.d = dm, st.n = dbt;
    } while (!final);
    return bt == buf.length ? buf : slc(buf, 0, bt);
};
// starting at p, write the minimum number of bits that can hold v to d
var wbits = function (d, p, v) {
    v <<= p & 7;
    var o = (p / 8) | 0;
    d[o] |= v;
    d[o + 1] |= v >>> 8;
};
// starting at p, write the minimum number of bits (>8) that can hold v to d
var wbits16 = function (d, p, v) {
    v <<= p & 7;
    var o = (p / 8) | 0;
    d[o] |= v;
    d[o + 1] |= v >>> 8;
    d[o + 2] |= v >>> 16;
};
// creates code lengths from a frequency table
var hTree = function (d, mb) {
    // Need extra info to make a tree
    var t = [];
    for (var i = 0; i < d.length; ++i) {
        if (d[i])
            t.push({ s: i, f: d[i] });
    }
    var s = t.length;
    var t2 = t.slice();
    if (!s)
        return [et, 0];
    if (s == 1) {
        var v = new u8(t[0].s + 1);
        v[t[0].s] = 1;
        return [v, 1];
    }
    t.sort(function (a, b) { return a.f - b.f; });
    // after i2 reaches last ind, will be stopped
    // freq must be greater than largest possible number of symbols
    t.push({ s: -1, f: 25001 });
    var l = t[0], r = t[1], i0 = 0, i1 = 1, i2 = 2;
    t[0] = { s: -1, f: l.f + r.f, l: l, r: r };
    // efficient algorithm from UZIP.js
    // i0 is lookbehind, i2 is lookahead - after processing two low-freq
    // symbols that combined have high freq, will start processing i2 (high-freq,
    // non-composite) symbols instead
    // see https://reddit.com/r/photopea/comments/ikekht/uzipjs_questions/
    while (i1 != s - 1) {
        l = t[t[i0].f < t[i2].f ? i0++ : i2++];
        r = t[i0 != i1 && t[i0].f < t[i2].f ? i0++ : i2++];
        t[i1++] = { s: -1, f: l.f + r.f, l: l, r: r };
    }
    var maxSym = t2[0].s;
    for (var i = 1; i < s; ++i) {
        if (t2[i].s > maxSym)
            maxSym = t2[i].s;
    }
    // code lengths
    var tr = new u16(maxSym + 1);
    // max bits in tree
    var mbt = ln(t[i1 - 1], tr, 0);
    if (mbt > mb) {
        // more algorithms from UZIP.js
        // TODO: find out how this code works (debt)
        //  ind    debt
        var i = 0, dt = 0;
        //    left            cost
        var lft = mbt - mb, cst = 1 << lft;
        t2.sort(function (a, b) { return tr[b.s] - tr[a.s] || a.f - b.f; });
        for (; i < s; ++i) {
            var i2_1 = t2[i].s;
            if (tr[i2_1] > mb) {
                dt += cst - (1 << (mbt - tr[i2_1]));
                tr[i2_1] = mb;
            }
            else
                break;
        }
        dt >>>= lft;
        while (dt > 0) {
            var i2_2 = t2[i].s;
            if (tr[i2_2] < mb)
                dt -= 1 << (mb - tr[i2_2]++ - 1);
            else
                ++i;
        }
        for (; i >= 0 && dt; --i) {
            var i2_3 = t2[i].s;
            if (tr[i2_3] == mb) {
                --tr[i2_3];
                ++dt;
            }
        }
        mbt = mb;
    }
    return [new u8(tr), mbt];
};
// get the max length and assign length codes
var ln = function (n, l, d) {
    return n.s == -1
        ? Math.max(ln(n.l, l, d + 1), ln(n.r, l, d + 1))
        : (l[n.s] = d);
};
// length codes generation
var lc = function (c) {
    var s = c.length;
    // Note that the semicolon was intentional
    while (s && !c[--s])
        ;
    var cl = new u16(++s);
    //  ind      num         streak
    var cli = 0, cln = c[0], cls = 1;
    var w = function (v) { cl[cli++] = v; };
    for (var i = 1; i <= s; ++i) {
        if (c[i] == cln && i != s)
            ++cls;
        else {
            if (!cln && cls > 2) {
                for (; cls > 138; cls -= 138)
                    w(32754);
                if (cls > 2) {
                    w(cls > 10 ? ((cls - 11) << 5) | 28690 : ((cls - 3) << 5) | 12305);
                    cls = 0;
                }
            }
            else if (cls > 3) {
                w(cln), --cls;
                for (; cls > 6; cls -= 6)
                    w(8304);
                if (cls > 2)
                    w(((cls - 3) << 5) | 8208), cls = 0;
            }
            while (cls--)
                w(cln);
            cls = 1;
            cln = c[i];
        }
    }
    return [cl.subarray(0, cli), s];
};
// calculate the length of output from tree, code lengths
var clen = function (cf, cl) {
    var l = 0;
    for (var i = 0; i < cl.length; ++i)
        l += cf[i] * cl[i];
    return l;
};
// writes a fixed block
// returns the new bit pos
var wfblk = function (out, pos, dat) {
    // no need to write 00 as type: TypedArray defaults to 0
    var s = dat.length;
    var o = shft(pos + 2);
    out[o] = s & 255;
    out[o + 1] = s >>> 8;
    out[o + 2] = out[o] ^ 255;
    out[o + 3] = out[o + 1] ^ 255;
    for (var i = 0; i < s; ++i)
        out[o + i + 4] = dat[i];
    return (o + 4 + s) * 8;
};
// writes a block
var wblk = function (dat, out, final, syms, lf, df, eb, li, bs, bl, p) {
    wbits(out, p++, final);
    ++lf[256];
    var _a = hTree(lf, 15), dlt = _a[0], mlb = _a[1];
    var _b = hTree(df, 15), ddt = _b[0], mdb = _b[1];
    var _c = lc(dlt), lclt = _c[0], nlc = _c[1];
    var _d = lc(ddt), lcdt = _d[0], ndc = _d[1];
    var lcfreq = new u16(19);
    for (var i = 0; i < lclt.length; ++i)
        lcfreq[lclt[i] & 31]++;
    for (var i = 0; i < lcdt.length; ++i)
        lcfreq[lcdt[i] & 31]++;
    var _e = hTree(lcfreq, 7), lct = _e[0], mlcb = _e[1];
    var nlcc = 19;
    for (; nlcc > 4 && !lct[clim[nlcc - 1]]; --nlcc)
        ;
    var flen = (bl + 5) << 3;
    var ftlen = clen(lf, flt) + clen(df, fdt) + eb;
    var dtlen = clen(lf, dlt) + clen(df, ddt) + eb + 14 + 3 * nlcc + clen(lcfreq, lct) + (2 * lcfreq[16] + 3 * lcfreq[17] + 7 * lcfreq[18]);
    if (flen <= ftlen && flen <= dtlen)
        return wfblk(out, p, dat.subarray(bs, bs + bl));
    var lm, ll, dm, dl;
    wbits(out, p, 1 + (dtlen < ftlen)), p += 2;
    if (dtlen < ftlen) {
        lm = hMap(dlt, mlb, 0), ll = dlt, dm = hMap(ddt, mdb, 0), dl = ddt;
        var llm = hMap(lct, mlcb, 0);
        wbits(out, p, nlc - 257);
        wbits(out, p + 5, ndc - 1);
        wbits(out, p + 10, nlcc - 4);
        p += 14;
        for (var i = 0; i < nlcc; ++i)
            wbits(out, p + 3 * i, lct[clim[i]]);
        p += 3 * nlcc;
        var lcts = [lclt, lcdt];
        for (var it = 0; it < 2; ++it) {
            var clct = lcts[it];
            for (var i = 0; i < clct.length; ++i) {
                var len = clct[i] & 31;
                wbits(out, p, llm[len]), p += lct[len];
                if (len > 15)
                    wbits(out, p, (clct[i] >>> 5) & 127), p += clct[i] >>> 12;
            }
        }
    }
    else {
        lm = flm, ll = flt, dm = fdm, dl = fdt;
    }
    for (var i = 0; i < li; ++i) {
        if (syms[i] > 255) {
            var len = (syms[i] >>> 18) & 31;
            wbits16(out, p, lm[len + 257]), p += ll[len + 257];
            if (len > 7)
                wbits(out, p, (syms[i] >>> 23) & 31), p += fleb[len];
            var dst = syms[i] & 31;
            wbits16(out, p, dm[dst]), p += dl[dst];
            if (dst > 3)
                wbits16(out, p, (syms[i] >>> 5) & 8191), p += fdeb[dst];
        }
        else {
            wbits16(out, p, lm[syms[i]]), p += ll[syms[i]];
        }
    }
    wbits16(out, p, lm[256]);
    return p + ll[256];
};
// deflate options (nice << 13) | chain
var deo = /*#__PURE__*/ new u32([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]);
// empty
var et = /*#__PURE__*/ new u8(0);
// compresses data into a raw DEFLATE buffer
var dflt = function (dat, lvl, plvl, pre, post, lst) {
    var s = dat.length;
    var o = new u8(pre + s + 5 * (1 + Math.ceil(s / 7000)) + post);
    // writing to this writes to the output buffer
    var w = o.subarray(pre, o.length - post);
    var pos = 0;
    if (!lvl || s < 8) {
        for (var i = 0; i <= s; i += 65535) {
            // end
            var e = i + 65535;
            if (e < s) {
                // write full block
                pos = wfblk(w, pos, dat.subarray(i, e));
            }
            else {
                // write final block
                w[i] = lst;
                pos = wfblk(w, pos, dat.subarray(i, s));
            }
        }
    }
    else {
        var opt = deo[lvl - 1];
        var n = opt >>> 13, c = opt & 8191;
        var msk_1 = (1 << plvl) - 1;
        //    prev 2-byte val map    curr 2-byte val map
        var prev = new u16(32768), head = new u16(msk_1 + 1);
        var bs1_1 = Math.ceil(plvl / 3), bs2_1 = 2 * bs1_1;
        var hsh = function (i) { return (dat[i] ^ (dat[i + 1] << bs1_1) ^ (dat[i + 2] << bs2_1)) & msk_1; };
        // 24576 is an arbitrary number of maximum symbols per block
        // 424 buffer for last block
        var syms = new u32(25000);
        // length/literal freq   distance freq
        var lf = new u16(288), df = new u16(32);
        //  l/lcnt  exbits  index  l/lind  waitdx  bitpos
        var lc_1 = 0, eb = 0, i = 0, li = 0, wi = 0, bs = 0;
        for (; i < s; ++i) {
            // hash value
            // deopt when i > s - 3 - at end, deopt acceptable
            var hv = hsh(i);
            // index mod 32768    previous index mod
            var imod = i & 32767, pimod = head[hv];
            prev[imod] = pimod;
            head[hv] = imod;
            // We always should modify head and prev, but only add symbols if
            // this data is not yet processed ("wait" for wait index)
            if (wi <= i) {
                // bytes remaining
                var rem = s - i;
                if ((lc_1 > 7000 || li > 24576) && rem > 423) {
                    pos = wblk(dat, w, 0, syms, lf, df, eb, li, bs, i - bs, pos);
                    li = lc_1 = eb = 0, bs = i;
                    for (var j = 0; j < 286; ++j)
                        lf[j] = 0;
                    for (var j = 0; j < 30; ++j)
                        df[j] = 0;
                }
                //  len    dist   chain
                var l = 2, d = 0, ch_1 = c, dif = (imod - pimod) & 32767;
                if (rem > 2 && hv == hsh(i - dif)) {
                    var maxn = Math.min(n, rem) - 1;
                    var maxd = Math.min(32767, i);
                    // max possible length
                    // not capped at dif because decompressors implement "rolling" index population
                    var ml = Math.min(258, rem);
                    while (dif <= maxd && --ch_1 && imod != pimod) {
                        if (dat[i + l] == dat[i + l - dif]) {
                            var nl = 0;
                            for (; nl < ml && dat[i + nl] == dat[i + nl - dif]; ++nl)
                                ;
                            if (nl > l) {
                                l = nl, d = dif;
                                // break out early when we reach "nice" (we are satisfied enough)
                                if (nl > maxn)
                                    break;
                                // now, find the rarest 2-byte sequence within this
                                // length of literals and search for that instead.
                                // Much faster than just using the start
                                var mmd = Math.min(dif, nl - 2);
                                var md = 0;
                                for (var j = 0; j < mmd; ++j) {
                                    var ti = (i - dif + j + 32768) & 32767;
                                    var pti = prev[ti];
                                    var cd = (ti - pti + 32768) & 32767;
                                    if (cd > md)
                                        md = cd, pimod = ti;
                                }
                            }
                        }
                        // check the previous match
                        imod = pimod, pimod = prev[imod];
                        dif += (imod - pimod + 32768) & 32767;
                    }
                }
                // d will be nonzero only when a match was found
                if (d) {
                    // store both dist and len data in one Uint32
                    // Make sure this is recognized as a len/dist with 28th bit (2^28)
                    syms[li++] = 268435456 | (revfl[l] << 18) | revfd[d];
                    var lin = revfl[l] & 31, din = revfd[d] & 31;
                    eb += fleb[lin] + fdeb[din];
                    ++lf[257 + lin];
                    ++df[din];
                    wi = i + l;
                    ++lc_1;
                }
                else {
                    syms[li++] = dat[i];
                    ++lf[dat[i]];
                }
            }
        }
        pos = wblk(dat, w, lst, syms, lf, df, eb, li, bs, i - bs, pos);
        // this is the easiest way to avoid needing to maintain state
        if (!lst && pos & 7)
            pos = wfblk(w, pos + 1, et);
    }
    return slc(o, 0, pre + shft(pos) + post);
};
// CRC32 table
var crct = /*#__PURE__*/ (function () {
    var t = new u32(256);
    for (var i = 0; i < 256; ++i) {
        var c = i, k = 9;
        while (--k)
            c = ((c & 1) && 0xEDB88320) ^ (c >>> 1);
        t[i] = c;
    }
    return t;
})();
// CRC32
var crc = function () {
    var c = -1;
    return {
        p: function (d) {
            // closures have awful performance
            var cr = c;
            for (var i = 0; i < d.length; ++i)
                cr = crct[(cr & 255) ^ d[i]] ^ (cr >>> 8);
            c = cr;
        },
        d: function () { return ~c; }
    };
};
// Alder32
var adler = function () {
    var a = 1, b = 0;
    return {
        p: function (d) {
            // closures have awful performance
            var n = a, m = b;
            var l = d.length;
            for (var i = 0; i != l;) {
                var e = Math.min(i + 2655, l);
                for (; i < e; ++i)
                    m += n += d[i];
                n = (n & 65535) + 15 * (n >> 16), m = (m & 65535) + 15 * (m >> 16);
            }
            a = n, b = m;
        },
        d: function () {
            a %= 65521, b %= 65521;
            return (a & 255) << 24 | (a >>> 8) << 16 | (b & 255) << 8 | (b >>> 8);
        }
    };
};
// deflate with opts
var dopt = function (dat, opt, pre, post, st) {
    return dflt(dat, opt.level == null ? 6 : opt.level, opt.mem == null ? Math.ceil(Math.max(8, Math.min(13, Math.log(dat.length))) * 1.5) : (12 + opt.mem), pre, post, !st);
};
// Walmart object spread
var mrg = function (a, b) {
    var o = {};
    for (var k in a)
        o[k] = a[k];
    for (var k in b)
        o[k] = b[k];
    return o;
};
// worker clone
// This is possibly the craziest part of the entire codebase, despite how simple it may seem.
// The only parameter to this function is a closure that returns an array of variables outside of the function scope.
// We're going to try to figure out the variable names used in the closure as strings because that is crucial for workerization.
// We will return an object mapping of true variable name to value (basically, the current scope as a JS object).
// The reason we can't just use the original variable names is minifiers mangling the toplevel scope.
// This took me three weeks to figure out how to do.
var wcln = function (fn, fnStr, td) {
    var dt = fn();
    var st = fn.toString();
    var ks = st.slice(st.indexOf('[') + 1, st.lastIndexOf(']')).replace(/ /g, '').split(',');
    for (var i = 0; i < dt.length; ++i) {
        var v = dt[i], k = ks[i];
        if (typeof v == 'function') {
            fnStr += ';' + k + '=';
            var st_1 = v.toString();
            if (v.prototype) {
                // for global objects
                if (st_1.indexOf('[native code]') != -1) {
                    var spInd = st_1.indexOf(' ', 8) + 1;
                    fnStr += st_1.slice(spInd, st_1.indexOf('(', spInd));
                }
                else {
                    fnStr += st_1;
                    for (var t in v.prototype)
                        fnStr += ';' + k + '.prototype.' + t + '=' + v.prototype[t].toString();
                }
            }
            else
                fnStr += st_1;
        }
        else
            td[k] = v;
    }
    return [fnStr, td];
};
var ch = [];
// clone bufs
var cbfs = function (v) {
    var tl = [];
    for (var k in v) {
        if (v[k] instanceof u8 || v[k] instanceof u16 || v[k] instanceof u32)
            tl.push((v[k] = new v[k].constructor(v[k])).buffer);
    }
    return tl;
};
// use a worker to execute code
var wrkr = function (fns, init, id, cb) {
    var _a;
    if (!ch[id]) {
        var fnStr = '', td_1 = {}, m = fns.length - 1;
        for (var i = 0; i < m; ++i)
            _a = wcln(fns[i], fnStr, td_1), fnStr = _a[0], td_1 = _a[1];
        ch[id] = wcln(fns[m], fnStr, td_1);
    }
    var td = mrg({}, ch[id][1]);
    return wk(ch[id][0] + ';onmessage=function(e){for(var k in e.data)self[k]=e.data[k];onmessage=' + init.toString() + '}', id, td, cbfs(td), cb);
};
// base async inflate fn
var bInflt = function () { return [u8, u16, u32, fleb, fdeb, clim, fl, fd, flrm, fdrm, rev, hMap, max, bits, bits16, shft, slc, inflt, inflateSync, pbf, gu8]; };
var bDflt = function () { return [u8, u16, u32, fleb, fdeb, clim, revfl, revfd, flm, flt, fdm, fdt, rev, deo, et, hMap, wbits, wbits16, hTree, ln, lc, clen, wfblk, wblk, shft, slc, dflt, dopt, deflateSync, pbf]; };
// gzip extra
var gze = function () { return [gzh, gzhl, wbytes, crc, crct]; };
// gunzip extra
var guze = function () { return [gzs, gzl]; };
// zlib extra
var zle = function () { return [zlh, wbytes, adler]; };
// unzlib extra
var zule = function () { return [zlv]; };
// post buf
var pbf = function (msg) { return postMessage(msg, [msg.buffer]); };
// get u8
var gu8 = function (o) { return o && o.size && new u8(o.size); };
// async helper
var cbify = function (dat, opts, fns, init, id, cb) {
    var w = wrkr(fns, init, id, function (err, dat) {
        w.terminate();
        cb(err, dat);
    });
    w.postMessage([dat, opts], opts.consume ? [dat.buffer] : []);
    return function () { w.terminate(); };
};
// auto stream
var astrm = function (strm) {
    strm.ondata = function (dat, final) { return postMessage([dat, final], [dat.buffer]); };
    return function (ev) { return strm.push(ev.data[0], ev.data[1]); };
};
// async stream attach
var astrmify = function (fns, strm, opts, init, id) {
    var t;
    var w = wrkr(fns, init, id, function (err, dat) {
        if (err)
            w.terminate(), strm.ondata.call(strm, err);
        else {
            if (dat[1])
                w.terminate();
            strm.ondata.call(strm, err, dat[0], dat[1]);
        }
    });
    w.postMessage(opts);
    strm.push = function (d, f) {
        if (t)
            throw 'stream finished';
        if (!strm.ondata)
            throw 'no stream handler';
        w.postMessage([d, t = f], [d.buffer]);
    };
    strm.terminate = function () { w.terminate(); };
};
// read 2 bytes
var b2 = function (d, b) { return d[b] | (d[b + 1] << 8); };
// read 4 bytes
var b4 = function (d, b) { return (d[b] | (d[b + 1] << 8) | (d[b + 2] << 16) | (d[b + 3] << 24)) >>> 0; };
var b8 = function (d, b) { return b4(d, b) + (b4(d, b + 4) * 4294967296); };
// write bytes
var wbytes = function (d, b, v) {
    for (; v; ++b)
        d[b] = v, v >>>= 8;
};
// gzip header
var gzh = function (c, o) {
    var fn = o.filename;
    c[0] = 31, c[1] = 139, c[2] = 8, c[8] = o.level < 2 ? 4 : o.level == 9 ? 2 : 0, c[9] = 3; // assume Unix
    if (o.mtime != 0)
        wbytes(c, 4, Math.floor(new Date(o.mtime || Date.now()) / 1000));
    if (fn) {
        c[3] = 8;
        for (var i = 0; i <= fn.length; ++i)
            c[i + 10] = fn.charCodeAt(i);
    }
};
// gzip footer: -8 to -4 = CRC, -4 to -0 is length
// gzip start
var gzs = function (d) {
    if (d[0] != 31 || d[1] != 139 || d[2] != 8)
        throw 'invalid gzip data';
    var flg = d[3];
    var st = 10;
    if (flg & 4)
        st += d[10] | (d[11] << 8) + 2;
    for (var zs = (flg >> 3 & 1) + (flg >> 4 & 1); zs > 0; zs -= !d[st++])
        ;
    return st + (flg & 2);
};
// gzip length
var gzl = function (d) {
    var l = d.length;
    return ((d[l - 4] | d[l - 3] << 8 | d[l - 2] << 16) | (d[l - 1] << 24)) >>> 0;
};
// gzip header length
var gzhl = function (o) { return 10 + ((o.filename && (o.filename.length + 1)) || 0); };
// zlib header
var zlh = function (c, o) {
    var lv = o.level, fl = lv == 0 ? 0 : lv < 6 ? 1 : lv == 9 ? 3 : 2;
    c[0] = 120, c[1] = (fl << 6) | (fl ? (32 - 2 * fl) : 1);
};
// zlib valid
var zlv = function (d) {
    if ((d[0] & 15) != 8 || (d[0] >>> 4) > 7 || ((d[0] << 8 | d[1]) % 31))
        throw 'invalid zlib data';
    if (d[1] & 32)
        throw 'invalid zlib data: preset dictionaries not supported';
};
function AsyncCmpStrm(opts, cb) {
    if (!cb && typeof opts == 'function')
        cb = opts, opts = {};
    this.ondata = cb;
    return opts;
}
// zlib footer: -4 to -0 is Adler32
/**
 * Streaming DEFLATE compression
 */
var Deflate = /*#__PURE__*/ (function () {
    function Deflate(opts, cb) {
        if (!cb && typeof opts == 'function')
            cb = opts, opts = {};
        this.ondata = cb;
        this.o = opts || {};
    }
    Deflate.prototype.p = function (c, f) {
        this.ondata(dopt(c, this.o, 0, 0, !f), f);
    };
    /**
     * Pushes a chunk to be deflated
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    Deflate.prototype.push = function (chunk, final) {
        if (this.d)
            throw 'stream finished';
        if (!this.ondata)
            throw 'no stream handler';
        this.d = final;
        this.p(chunk, final || false);
    };
    return Deflate;
}());
/**
 * Asynchronous streaming DEFLATE compression
 */
var AsyncDeflate = /*#__PURE__*/ (function () {
    function AsyncDeflate(opts, cb) {
        astrmify([
            bDflt,
            function () { return [astrm, Deflate]; }
        ], this, AsyncCmpStrm.call(this, opts, cb), function (ev) {
            var strm = new Deflate(ev.data);
            onmessage = astrm(strm);
        }, 6);
    }
    return AsyncDeflate;
}());
function deflate(data, opts, cb) {
    if (!cb)
        cb = opts, opts = {};
    if (typeof cb != 'function')
        throw 'no callback';
    return cbify(data, opts, [
        bDflt,
    ], function (ev) { return pbf(deflateSync(ev.data[0], ev.data[1])); }, 0, cb);
}
/**
 * Compresses data with DEFLATE without any wrapper
 * @param data The data to compress
 * @param opts The compression options
 * @returns The deflated version of the data
 */
function deflateSync(data, opts) {
    return dopt(data, opts || {}, 0, 0);
}
/**
 * Streaming DEFLATE decompression
 */
var Inflate = /*#__PURE__*/ (function () {
    /**
     * Creates an inflation stream
     * @param cb The callback to call whenever data is inflated
     */
    function Inflate(cb) {
        this.s = {};
        this.p = new u8(0);
        this.ondata = cb;
    }
    Inflate.prototype.e = function (c) {
        if (this.d)
            throw 'stream finished';
        if (!this.ondata)
            throw 'no stream handler';
        var l = this.p.length;
        var n = new u8(l + c.length);
        n.set(this.p), n.set(c, l), this.p = n;
    };
    Inflate.prototype.c = function (final) {
        this.d = this.s.i = final || false;
        var bts = this.s.b;
        var dt = inflt(this.p, this.o, this.s);
        this.ondata(slc(dt, bts, this.s.b), this.d);
        this.o = slc(dt, this.s.b - 32768), this.s.b = this.o.length;
        this.p = slc(this.p, (this.s.p / 8) | 0), this.s.p &= 7;
    };
    /**
     * Pushes a chunk to be inflated
     * @param chunk The chunk to push
     * @param final Whether this is the final chunk
     */
    Inflate.prototype.push = function (chunk, final) {
        this.e(chunk), this.c(final);
    };
    return Inflate;
}());
/**
 * Asynchronous streaming DEFLATE decompression
 */
var AsyncInflate = /*#__PURE__*/ (function () {
    /**
     * Creates an asynchronous inflation stream
     * @param cb The callback to call whenever data is deflated
     */
    function AsyncInflate(cb) {
        this.ondata = cb;
        astrmify([
            bInflt,
            function () { return [astrm, Inflate]; }
        ], this, 0, function () {
            var strm = new Inflate();
            onmessage = astrm(strm);
        }, 7);
    }
    return AsyncInflate;
}());
function inflate(data, opts, cb) {
    if (!cb)
        cb = opts, opts = {};
    if (typeof cb != 'function')
        throw 'no callback';
    return cbify(data, opts, [
        bInflt
    ], function (ev) { return pbf(inflateSync(ev.data[0], gu8(ev.data[1]))); }, 1, cb);
}
/**
 * Expands DEFLATE data with no wrapper
 * @param data The data to decompress
 * @param out Where to write the data. Saves memory if you know the decompressed size and provide an output buffer of that length.
 * @returns The decompressed version of the data
 */
function inflateSync(data, out) {
    return inflt(data, out);
}
// before you yell at me for not just using extends, my reason is that TS inheritance is hard to workerize.
/**
 * Streaming GZIP compression
 */
var Gzip = /*#__PURE__*/ (function () {
    function Gzip(opts, cb) {
        this.c = crc();
        this.l = 0;
        this.v = 1;
        Deflate.call(this, opts, cb);
    }
    /**
     * Pushes a chunk to be GZIPped
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    Gzip.prototype.push = function (chunk, final) {
        Deflate.prototype.push.call(this, chunk, final);
    };
    Gzip.prototype.p = function (c, f) {
        this.c.p(c);
        this.l += c.length;
        var raw = dopt(c, this.o, this.v && gzhl(this.o), f && 8, !f);
        if (this.v)
            gzh(raw, this.o), this.v = 0;
        if (f)
            wbytes(raw, raw.length - 8, this.c.d()), wbytes(raw, raw.length - 4, this.l);
        this.ondata(raw, f);
    };
    return Gzip;
}());
/**
 * Asynchronous streaming GZIP compression
 */
var AsyncGzip = /*#__PURE__*/ (function () {
    function AsyncGzip(opts, cb) {
        astrmify([
            bDflt,
            gze,
            function () { return [astrm, Deflate, Gzip]; }
        ], this, AsyncCmpStrm.call(this, opts, cb), function (ev) {
            var strm = new Gzip(ev.data);
            onmessage = astrm(strm);
        }, 8);
    }
    return AsyncGzip;
}());
function gzip(data, opts, cb) {
    if (!cb)
        cb = opts, opts = {};
    if (typeof cb != 'function')
        throw 'no callback';
    return cbify(data, opts, [
        bDflt,
        gze,
        function () { return [gzipSync]; }
    ], function (ev) { return pbf(gzipSync(ev.data[0], ev.data[1])); }, 2, cb);
}
/**
 * Compresses data with GZIP
 * @param data The data to compress
 * @param opts The compression options
 * @returns The gzipped version of the data
 */
function gzipSync(data, opts) {
    if (!opts)
        opts = {};
    var c = crc(), l = data.length;
    c.p(data);
    var d = dopt(data, opts, gzhl(opts), 8), s = d.length;
    return gzh(d, opts), wbytes(d, s - 8, c.d()), wbytes(d, s - 4, l), d;
}
/**
 * Streaming GZIP decompression
 */
var Gunzip = /*#__PURE__*/ (function () {
    /**
     * Creates a GUNZIP stream
     * @param cb The callback to call whenever data is inflated
     */
    function Gunzip(cb) {
        this.v = 1;
        Inflate.call(this, cb);
    }
    /**
     * Pushes a chunk to be GUNZIPped
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    Gunzip.prototype.push = function (chunk, final) {
        Inflate.prototype.e.call(this, chunk);
        if (this.v) {
            var s = this.p.length > 3 ? gzs(this.p) : 4;
            if (s >= this.p.length && !final)
                return;
            this.p = this.p.subarray(s), this.v = 0;
        }
        if (final) {
            if (this.p.length < 8)
                throw 'invalid gzip stream';
            this.p = this.p.subarray(0, -8);
        }
        // necessary to prevent TS from using the closure value
        // This allows for workerization to function correctly
        Inflate.prototype.c.call(this, final);
    };
    return Gunzip;
}());
/**
 * Asynchronous streaming GZIP decompression
 */
var AsyncGunzip = /*#__PURE__*/ (function () {
    /**
     * Creates an asynchronous GUNZIP stream
     * @param cb The callback to call whenever data is deflated
     */
    function AsyncGunzip(cb) {
        this.ondata = cb;
        astrmify([
            bInflt,
            guze,
            function () { return [astrm, Inflate, Gunzip]; }
        ], this, 0, function () {
            var strm = new Gunzip();
            onmessage = astrm(strm);
        }, 9);
    }
    return AsyncGunzip;
}());
function gunzip(data, opts, cb) {
    if (!cb)
        cb = opts, opts = {};
    if (typeof cb != 'function')
        throw 'no callback';
    return cbify(data, opts, [
        bInflt,
        guze,
        function () { return [gunzipSync]; }
    ], function (ev) { return pbf(gunzipSync(ev.data[0])); }, 3, cb);
}
/**
 * Expands GZIP data
 * @param data The data to decompress
 * @param out Where to write the data. GZIP already encodes the output size, so providing this doesn't save memory.
 * @returns The decompressed version of the data
 */
function gunzipSync(data, out) {
    return inflt(data.subarray(gzs(data), -8), out || new u8(gzl(data)));
}
/**
 * Streaming Zlib compression
 */
var Zlib = /*#__PURE__*/ (function () {
    function Zlib(opts, cb) {
        this.c = adler();
        this.v = 1;
        Deflate.call(this, opts, cb);
    }
    /**
     * Pushes a chunk to be zlibbed
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    Zlib.prototype.push = function (chunk, final) {
        Deflate.prototype.push.call(this, chunk, final);
    };
    Zlib.prototype.p = function (c, f) {
        this.c.p(c);
        var raw = dopt(c, this.o, this.v && 2, f && 4, !f);
        if (this.v)
            zlh(raw, this.o), this.v = 0;
        if (f)
            wbytes(raw, raw.length - 4, this.c.d());
        this.ondata(raw, f);
    };
    return Zlib;
}());
/**
 * Asynchronous streaming Zlib compression
 */
var AsyncZlib = /*#__PURE__*/ (function () {
    function AsyncZlib(opts, cb) {
        astrmify([
            bDflt,
            zle,
            function () { return [astrm, Deflate, Zlib]; }
        ], this, AsyncCmpStrm.call(this, opts, cb), function (ev) {
            var strm = new Zlib(ev.data);
            onmessage = astrm(strm);
        }, 10);
    }
    return AsyncZlib;
}());
function zlib(data, opts, cb) {
    if (!cb)
        cb = opts, opts = {};
    if (typeof cb != 'function')
        throw 'no callback';
    return cbify(data, opts, [
        bDflt,
        zle,
        function () { return [zlibSync]; }
    ], function (ev) { return pbf(zlibSync(ev.data[0], ev.data[1])); }, 4, cb);
}
/**
 * Compress data with Zlib
 * @param data The data to compress
 * @param opts The compression options
 * @returns The zlib-compressed version of the data
 */
function zlibSync(data, opts) {
    if (!opts)
        opts = {};
    var a = adler();
    a.p(data);
    var d = dopt(data, opts, 2, 4);
    return zlh(d, opts), wbytes(d, d.length - 4, a.d()), d;
}
/**
 * Streaming Zlib decompression
 */
var Unzlib = /*#__PURE__*/ (function () {
    /**
     * Creates a Zlib decompression stream
     * @param cb The callback to call whenever data is inflated
     */
    function Unzlib(cb) {
        this.v = 1;
        Inflate.call(this, cb);
    }
    /**
     * Pushes a chunk to be unzlibbed
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    Unzlib.prototype.push = function (chunk, final) {
        Inflate.prototype.e.call(this, chunk);
        if (this.v) {
            if (this.p.length < 2 && !final)
                return;
            this.p = this.p.subarray(2), this.v = 0;
        }
        if (final) {
            if (this.p.length < 4)
                throw 'invalid zlib stream';
            this.p = this.p.subarray(0, -4);
        }
        // necessary to prevent TS from using the closure value
        // This allows for workerization to function correctly
        Inflate.prototype.c.call(this, final);
    };
    return Unzlib;
}());
/**
 * Asynchronous streaming Zlib decompression
 */
var AsyncUnzlib = /*#__PURE__*/ (function () {
    /**
     * Creates an asynchronous Zlib decompression stream
     * @param cb The callback to call whenever data is deflated
     */
    function AsyncUnzlib(cb) {
        this.ondata = cb;
        astrmify([
            bInflt,
            zule,
            function () { return [astrm, Inflate, Unzlib]; }
        ], this, 0, function () {
            var strm = new Unzlib();
            onmessage = astrm(strm);
        }, 11);
    }
    return AsyncUnzlib;
}());
function unzlib(data, opts, cb) {
    if (!cb)
        cb = opts, opts = {};
    if (typeof cb != 'function')
        throw 'no callback';
    return cbify(data, opts, [
        bInflt,
        zule,
        function () { return [unzlibSync]; }
    ], function (ev) { return pbf(unzlibSync(ev.data[0], gu8(ev.data[1]))); }, 5, cb);
}
/**
 * Expands Zlib data
 * @param data The data to decompress
 * @param out Where to write the data. Saves memory if you know the decompressed size and provide an output buffer of that length.
 * @returns The decompressed version of the data
 */
function unzlibSync(data, out) {
    return inflt((zlv(data), data.subarray(2, -4)), out);
}
/**
 * Streaming GZIP, Zlib, or raw DEFLATE decompression
 */
var Decompress = /*#__PURE__*/ (function () {
    /**
     * Creates a decompression stream
     * @param cb The callback to call whenever data is decompressed
     */
    function Decompress(cb) {
        this.G = Gunzip;
        this.I = Inflate;
        this.Z = Unzlib;
        this.ondata = cb;
    }
    /**
     * Pushes a chunk to be decompressed
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    Decompress.prototype.push = function (chunk, final) {
        if (!this.ondata)
            throw 'no stream handler';
        if (!this.s) {
            if (this.p && this.p.length) {
                var n = new u8(this.p.length + chunk.length);
                n.set(this.p), n.set(chunk, this.p.length);
            }
            else
                this.p = chunk;
            if (this.p.length > 2) {
                var _this_1 = this;
                var cb = function () { _this_1.ondata.apply(_this_1, arguments); };
                this.s = (this.p[0] == 31 && this.p[1] == 139 && this.p[2] == 8)
                    ? new this.G(cb)
                    : ((this.p[0] & 15) != 8 || (this.p[0] >> 4) > 7 || ((this.p[0] << 8 | this.p[1]) % 31))
                        ? new this.I(cb)
                        : new this.Z(cb);
                this.s.push(this.p, final);
                this.p = null;
            }
        }
        else
            this.s.push(chunk, final);
    };
    return Decompress;
}());
/**
 * Asynchronous streaming GZIP, Zlib, or raw DEFLATE decompression
 */
var AsyncDecompress = /*#__PURE__*/ (function () {
    /**
   * Creates an asynchronous decompression stream
   * @param cb The callback to call whenever data is decompressed
   */
    function AsyncDecompress(cb) {
        this.G = AsyncGunzip;
        this.I = AsyncInflate;
        this.Z = AsyncUnzlib;
        this.ondata = cb;
    }
    /**
     * Pushes a chunk to be decompressed
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    AsyncDecompress.prototype.push = function (chunk, final) {
        Decompress.prototype.push.call(this, chunk, final);
    };
    return AsyncDecompress;
}());
function decompress(data, opts, cb) {
    if (!cb)
        cb = opts, opts = {};
    if (typeof cb != 'function')
        throw 'no callback';
    return (data[0] == 31 && data[1] == 139 && data[2] == 8)
        ? gunzip(data, opts, cb)
        : ((data[0] & 15) != 8 || (data[0] >> 4) > 7 || ((data[0] << 8 | data[1]) % 31))
            ? inflate(data, opts, cb)
            : unzlib(data, opts, cb);
}
/**
 * Expands compressed GZIP, Zlib, or raw DEFLATE data, automatically detecting the format
 * @param data The data to decompress
 * @param out Where to write the data. Saves memory if you know the decompressed size and provide an output buffer of that length.
 * @returns The decompressed version of the data
 */
function decompressSync(data, out) {
    return (data[0] == 31 && data[1] == 139 && data[2] == 8)
        ? gunzipSync(data, out)
        : ((data[0] & 15) != 8 || (data[0] >> 4) > 7 || ((data[0] << 8 | data[1]) % 31))
            ? inflateSync(data, out)
            : unzlibSync(data, out);
}
// flatten a directory structure
var fltn = function (d, p, t, o) {
    for (var k in d) {
        var val = d[k], n = p + k;
        if (val instanceof u8)
            t[n] = [val, o];
        else if (Array.isArray(val))
            t[n] = [val[0], mrg(o, val[1])];
        else
            fltn(val, n + '/', t, o);
    }
};
// text encoder
var te = typeof TextEncoder != 'undefined' && /*#__PURE__*/ new TextEncoder();
// text decoder
var td = typeof three._default.polyfill.TextDecoder != 'undefined' && /*#__PURE__*/ new three._default.polyfill.TextDecoder();
// text decoder stream
var tds = 0;
try {
    td.decode(et, { stream: true });
    tds = 1;
}
catch (e) { }
// decode UTF8
var dutf8 = function (d) {
    for (var r = '', i = 0;;) {
        var c = d[i++];
        var eb = (c > 127) + (c > 223) + (c > 239);
        if (i + eb > d.length)
            return [r, slc(d, i - 1)];
        if (!eb)
            r += String.fromCharCode(c);
        else if (eb == 3) {
            c = ((c & 15) << 18 | (d[i++] & 63) << 12 | (d[i++] & 63) << 6 | (d[i++] & 63)) - 65536,
                r += String.fromCharCode(55296 | (c >> 10), 56320 | (c & 1023));
        }
        else if (eb & 1)
            r += String.fromCharCode((c & 31) << 6 | (d[i++] & 63));
        else
            r += String.fromCharCode((c & 15) << 12 | (d[i++] & 63) << 6 | (d[i++] & 63));
    }
};
/**
 * Streaming UTF-8 decoding
 */
var DecodeUTF8 = /*#__PURE__*/ (function () {
    /**
     * Creates a UTF-8 decoding stream
     * @param cb The callback to call whenever data is decoded
     */
    function DecodeUTF8(cb) {
        this.ondata = cb;
        if (tds)
            this.t = new three._default.polyfill.TextDecoder();
        else
            this.p = et;
    }
    /**
     * Pushes a chunk to be decoded from UTF-8 binary
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    DecodeUTF8.prototype.push = function (chunk, final) {
        if (!this.ondata)
            throw 'no callback';
        final = !!final;
        if (this.t) {
            this.ondata(this.t.decode(chunk, { stream: true }), final);
            if (final) {
                if (this.t.decode().length)
                    throw 'invalid utf-8 data';
                this.t = null;
            }
            return;
        }
        if (!this.p)
            throw 'stream finished';
        var dat = new u8(this.p.length + chunk.length);
        dat.set(this.p);
        dat.set(chunk, this.p.length);
        var _a = dutf8(dat), ch = _a[0], np = _a[1];
        if (final) {
            if (np.length)
                throw 'invalid utf-8 data';
            this.p = null;
        }
        else
            this.p = np;
        this.ondata(ch, final);
    };
    return DecodeUTF8;
}());
/**
 * Streaming UTF-8 encoding
 */
var EncodeUTF8 = /*#__PURE__*/ (function () {
    /**
     * Creates a UTF-8 decoding stream
     * @param cb The callback to call whenever data is encoded
     */
    function EncodeUTF8(cb) {
        this.ondata = cb;
    }
    /**
     * Pushes a chunk to be encoded to UTF-8
     * @param chunk The string data to push
     * @param final Whether this is the last chunk
     */
    EncodeUTF8.prototype.push = function (chunk, final) {
        if (!this.ondata)
            throw 'no callback';
        if (this.d)
            throw 'stream finished';
        this.ondata(strToU8(chunk), this.d = final || false);
    };
    return EncodeUTF8;
}());
/**
 * Converts a string into a Uint8Array for use with compression/decompression methods
 * @param str The string to encode
 * @param latin1 Whether or not to interpret the data as Latin-1. This should
 *               not need to be true unless decoding a binary string.
 * @returns The string encoded in UTF-8/Latin-1 binary
 */
function strToU8(str, latin1) {
    if (latin1) {
        var ar_1 = new u8(str.length);
        for (var i = 0; i < str.length; ++i)
            ar_1[i] = str.charCodeAt(i);
        return ar_1;
    }
    if (te)
        return te.encode(str);
    var l = str.length;
    var ar = new u8(str.length + (str.length >> 1));
    var ai = 0;
    var w = function (v) { ar[ai++] = v; };
    for (var i = 0; i < l; ++i) {
        if (ai + 5 > ar.length) {
            var n = new u8(ai + 8 + ((l - i) << 1));
            n.set(ar);
            ar = n;
        }
        var c = str.charCodeAt(i);
        if (c < 128 || latin1)
            w(c);
        else if (c < 2048)
            w(192 | (c >> 6)), w(128 | (c & 63));
        else if (c > 55295 && c < 57344)
            c = 65536 + (c & 1023 << 10) | (str.charCodeAt(++i) & 1023),
                w(240 | (c >> 18)), w(128 | ((c >> 12) & 63)), w(128 | ((c >> 6) & 63)), w(128 | (c & 63));
        else
            w(224 | (c >> 12)), w(128 | ((c >> 6) & 63)), w(128 | (c & 63));
    }
    return slc(ar, 0, ai);
}
/**
 * Converts a Uint8Array to a string
 * @param dat The data to decode to string
 * @param latin1 Whether or not to interpret the data as Latin-1. This should
 *               not need to be true unless encoding to binary string.
 * @returns The original UTF-8/Latin-1 string
 */
function strFromU8(dat, latin1) {
    if (latin1) {
        var r = '';
        for (var i = 0; i < dat.length; i += 16384)
            r += String.fromCharCode.apply(null, dat.subarray(i, i + 16384));
        return r;
    }
    else if (td)
        return td.decode(dat);
    else {
        var _a = dutf8(dat), out = _a[0], ext = _a[1];
        if (ext.length)
            throw 'invalid utf-8 data';
        return out;
    }
}
// deflate bit flag
var dbf = function (l) { return l == 1 ? 3 : l < 6 ? 2 : l == 9 ? 1 : 0; };
// skip local zip header
var slzh = function (d, b) { return b + 30 + b2(d, b + 26) + b2(d, b + 28); };
// read zip header
var zh = function (d, b, z) {
    var fnl = b2(d, b + 28), fn = strFromU8(d.subarray(b + 46, b + 46 + fnl), !(b2(d, b + 8) & 2048)), es = b + 46 + fnl, bs = b4(d, b + 20);
    var _a = z && bs == 4294967295 ? z64e(d, es) : [bs, b4(d, b + 24), b4(d, b + 42)], sc = _a[0], su = _a[1], off = _a[2];
    return [b2(d, b + 10), sc, su, fn, es + b2(d, b + 30) + b2(d, b + 32), off];
};
// read zip64 extra field
var z64e = function (d, b) {
    for (; b2(d, b) != 1; b += 4 + b2(d, b + 2))
        ;
    return [b8(d, b + 12), b8(d, b + 4), b8(d, b + 20)];
};
// extra field length
var exfl = function (ex) {
    var le = 0;
    if (ex) {
        for (var k in ex) {
            var l = ex[k].length;
            if (l > 65535)
                throw 'extra field too long';
            le += l + 4;
        }
    }
    return le;
};
// write zip header
var wzh = function (d, b, f, fn, u, c, ce, co) {
    var fl = fn.length, ex = f.extra, col = co && co.length;
    var exl = exfl(ex);
    wbytes(d, b, ce != null ? 0x2014B50 : 0x4034B50), b += 4;
    if (ce != null)
        d[b++] = 20, d[b++] = f.os;
    d[b] = 20, b += 2; // spec compliance? what's that?
    d[b++] = (f.flag << 1) | (c == null && 8), d[b++] = u && 8;
    d[b++] = f.compression & 255, d[b++] = f.compression >> 8;
    var dt = new Date(f.mtime == null ? Date.now() : f.mtime), y = dt.getFullYear() - 1980;
    if (y < 0 || y > 119)
        throw 'date not in range 1980-2099';
    wbytes(d, b, (y << 25) | ((dt.getMonth() + 1) << 21) | (dt.getDate() << 16) | (dt.getHours() << 11) | (dt.getMinutes() << 5) | (dt.getSeconds() >>> 1)), b += 4;
    if (c != null) {
        wbytes(d, b, f.crc);
        wbytes(d, b + 4, c);
        wbytes(d, b + 8, f.size);
    }
    wbytes(d, b + 12, fl);
    wbytes(d, b + 14, exl), b += 16;
    if (ce != null) {
        wbytes(d, b, col);
        wbytes(d, b + 6, f.attrs);
        wbytes(d, b + 10, ce), b += 14;
    }
    d.set(fn, b);
    b += fl;
    if (exl) {
        for (var k in ex) {
            var exf = ex[k], l = exf.length;
            wbytes(d, b, +k);
            wbytes(d, b + 2, l);
            d.set(exf, b + 4), b += 4 + l;
        }
    }
    if (col)
        d.set(co, b), b += col;
    return b;
};
// write zip footer (end of central directory)
var wzf = function (o, b, c, d, e) {
    wbytes(o, b, 0x6054B50); // skip disk
    wbytes(o, b + 8, c);
    wbytes(o, b + 10, c);
    wbytes(o, b + 12, d);
    wbytes(o, b + 16, e);
};
/**
 * A pass-through stream to keep data uncompressed in a ZIP archive.
 */
var ZipPassThrough = /*#__PURE__*/ (function () {
    /**
     * Creates a pass-through stream that can be added to ZIP archives
     * @param filename The filename to associate with this data stream
     */
    function ZipPassThrough(filename) {
        this.filename = filename;
        this.c = crc();
        this.size = 0;
        this.compression = 0;
    }
    /**
     * Processes a chunk and pushes to the output stream. You can override this
     * method in a subclass for custom behavior, but by default this passes
     * the data through. You must call this.ondata(err, chunk, final) at some
     * point in this method.
     * @param chunk The chunk to process
     * @param final Whether this is the last chunk
     */
    ZipPassThrough.prototype.process = function (chunk, final) {
        this.ondata(null, chunk, final);
    };
    /**
     * Pushes a chunk to be added. If you are subclassing this with a custom
     * compression algorithm, note that you must push data from the source
     * file only, pre-compression.
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    ZipPassThrough.prototype.push = function (chunk, final) {
        if (!this.ondata)
            throw 'no callback - add to ZIP archive before pushing';
        this.c.p(chunk);
        this.size += chunk.length;
        if (final)
            this.crc = this.c.d();
        this.process(chunk, final || false);
    };
    return ZipPassThrough;
}());
// I don't extend because TypeScript extension adds 1kB of runtime bloat
/**
 * Streaming DEFLATE compression for ZIP archives. Prefer using AsyncZipDeflate
 * for better performance
 */
var ZipDeflate = /*#__PURE__*/ (function () {
    /**
     * Creates a DEFLATE stream that can be added to ZIP archives
     * @param filename The filename to associate with this data stream
     * @param opts The compression options
     */
    function ZipDeflate(filename, opts) {
        var _this_1 = this;
        if (!opts)
            opts = {};
        ZipPassThrough.call(this, filename);
        this.d = new Deflate(opts, function (dat, final) {
            _this_1.ondata(null, dat, final);
        });
        this.compression = 8;
        this.flag = dbf(opts.level);
    }
    ZipDeflate.prototype.process = function (chunk, final) {
        try {
            this.d.push(chunk, final);
        }
        catch (e) {
            this.ondata(e, null, final);
        }
    };
    /**
     * Pushes a chunk to be deflated
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    ZipDeflate.prototype.push = function (chunk, final) {
        ZipPassThrough.prototype.push.call(this, chunk, final);
    };
    return ZipDeflate;
}());
/**
 * Asynchronous streaming DEFLATE compression for ZIP archives
 */
var AsyncZipDeflate = /*#__PURE__*/ (function () {
    /**
     * Creates a DEFLATE stream that can be added to ZIP archives
     * @param filename The filename to associate with this data stream
     * @param opts The compression options
     */
    function AsyncZipDeflate(filename, opts) {
        var _this_1 = this;
        if (!opts)
            opts = {};
        ZipPassThrough.call(this, filename);
        this.d = new AsyncDeflate(opts, function (err, dat, final) {
            _this_1.ondata(err, dat, final);
        });
        this.compression = 8;
        this.flag = dbf(opts.level);
        this.terminate = this.d.terminate;
    }
    AsyncZipDeflate.prototype.process = function (chunk, final) {
        this.d.push(chunk, final);
    };
    /**
     * Pushes a chunk to be deflated
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    AsyncZipDeflate.prototype.push = function (chunk, final) {
        ZipPassThrough.prototype.push.call(this, chunk, final);
    };
    return AsyncZipDeflate;
}());
// TODO: Better tree shaking
/**
 * A zippable archive to which files can incrementally be added
 */
var Zip = /*#__PURE__*/ (function () {
    /**
     * Creates an empty ZIP archive to which files can be added
     * @param cb The callback to call whenever data for the generated ZIP archive
     *           is available
     */
    function Zip(cb) {
        this.ondata = cb;
        this.u = [];
        this.d = 1;
    }
    /**
     * Adds a file to the ZIP archive
     * @param file The file stream to add
     */
    Zip.prototype.add = function (file) {
        var _this_1 = this;
        if (this.d & 2)
            throw 'stream finished';
        var f = strToU8(file.filename), fl = f.length;
        var com = file.comment, o = com && strToU8(com);
        var u = fl != file.filename.length || (o && (com.length != o.length));
        var hl = fl + exfl(file.extra) + 30;
        if (fl > 65535)
            throw 'filename too long';
        var header = new u8(hl);
        wzh(header, 0, file, f, u);
        var chks = [header];
        var pAll = function () {
            for (var _i = 0, chks_1 = chks; _i < chks_1.length; _i++) {
                var chk = chks_1[_i];
                _this_1.ondata(null, chk, false);
            }
            chks = [];
        };
        var tr = this.d;
        this.d = 0;
        var ind = this.u.length;
        var uf = mrg(file, {
            f: f,
            u: u,
            o: o,
            t: function () {
                if (file.terminate)
                    file.terminate();
            },
            r: function () {
                pAll();
                if (tr) {
                    var nxt = _this_1.u[ind + 1];
                    if (nxt)
                        nxt.r();
                    else
                        _this_1.d = 1;
                }
                tr = 1;
            }
        });
        var cl = 0;
        file.ondata = function (err, dat, final) {
            if (err) {
                _this_1.ondata(err, dat, final);
                _this_1.terminate();
            }
            else {
                cl += dat.length;
                chks.push(dat);
                if (final) {
                    var dd = new u8(16);
                    wbytes(dd, 0, 0x8074B50);
                    wbytes(dd, 4, file.crc);
                    wbytes(dd, 8, cl);
                    wbytes(dd, 12, file.size);
                    chks.push(dd);
                    uf.c = cl, uf.b = hl + cl + 16, uf.crc = file.crc, uf.size = file.size;
                    if (tr)
                        uf.r();
                    tr = 1;
                }
                else if (tr)
                    pAll();
            }
        };
        this.u.push(uf);
    };
    /**
     * Ends the process of adding files and prepares to emit the final chunks.
     * This *must* be called after adding all desired files for the resulting
     * ZIP file to work properly.
     */
    Zip.prototype.end = function () {
        var _this_1 = this;
        if (this.d & 2) {
            if (this.d & 1)
                throw 'stream finishing';
            throw 'stream finished';
        }
        if (this.d)
            this.e();
        else
            this.u.push({
                r: function () {
                    if (!(_this_1.d & 1))
                        return;
                    _this_1.u.splice(-1, 1);
                    _this_1.e();
                },
                t: function () { }
            });
        this.d = 3;
    };
    Zip.prototype.e = function () {
        var bt = 0, l = 0, tl = 0;
        for (var _i = 0, _a = this.u; _i < _a.length; _i++) {
            var f = _a[_i];
            tl += 46 + f.f.length + exfl(f.extra) + (f.o ? f.o.length : 0);
        }
        var out = new u8(tl + 22);
        for (var _b = 0, _c = this.u; _b < _c.length; _b++) {
            var f = _c[_b];
            wzh(out, bt, f, f.f, f.u, f.c, l, f.o);
            bt += 46 + f.f.length + exfl(f.extra) + (f.o ? f.o.length : 0), l += f.b;
        }
        wzf(out, bt, this.u.length, tl, l);
        this.ondata(null, out, true);
        this.d = 2;
    };
    /**
     * A method to terminate any internal workers used by the stream. Subsequent
     * calls to add() will fail.
     */
    Zip.prototype.terminate = function () {
        for (var _i = 0, _a = this.u; _i < _a.length; _i++) {
            var f = _a[_i];
            f.t();
        }
        this.d = 2;
    };
    return Zip;
}());
function zip(data, opts, cb) {
    if (!cb)
        cb = opts, opts = {};
    if (typeof cb != 'function')
        throw 'no callback';
    var r = {};
    fltn(data, '', r, opts);
    var k = Object.keys(r);
    var lft = k.length, o = 0, tot = 0;
    var slft = lft, files = new Array(lft);
    var term = [];
    var tAll = function () {
        for (var i = 0; i < term.length; ++i)
            term[i]();
    };
    var cbf = function () {
        var out = new u8(tot + 22), oe = o, cdl = tot - o;
        tot = 0;
        for (var i = 0; i < slft; ++i) {
            var f = files[i];
            try {
                var l = f.c.length;
                wzh(out, tot, f, f.f, f.u, l);
                var badd = 30 + f.f.length + exfl(f.extra);
                var loc = tot + badd;
                out.set(f.c, loc);
                wzh(out, o, f, f.f, f.u, l, tot, f.m), o += 16 + badd + (f.m ? f.m.length : 0), tot = loc + l;
            }
            catch (e) {
                return cb(e, null);
            }
        }
        wzf(out, o, files.length, cdl, oe);
        cb(null, out);
    };
    if (!lft)
        cbf();
    var _loop_1 = function (i) {
        var fn = k[i];
        var _a = r[fn], file = _a[0], p = _a[1];
        var c = crc(), size = file.length;
        c.p(file);
        var f = strToU8(fn), s = f.length;
        var com = p.comment, m = com && strToU8(com), ms = m && m.length;
        var exl = exfl(p.extra);
        var compression = p.level == 0 ? 0 : 8;
        var cbl = function (e, d) {
            if (e) {
                tAll();
                cb(e, null);
            }
            else {
                var l = d.length;
                files[i] = mrg(p, {
                    size: size,
                    crc: c.d(),
                    c: d,
                    f: f,
                    m: m,
                    u: s != fn.length || (m && (com.length != ms)),
                    compression: compression
                });
                o += 30 + s + exl + l;
                tot += 76 + 2 * (s + exl) + (ms || 0) + l;
                if (!--lft)
                    cbf();
            }
        };
        if (s > 65535)
            cbl('filename too long', null);
        if (!compression)
            cbl(null, file);
        else if (size < 160000) {
            try {
                cbl(null, deflateSync(file, p));
            }
            catch (e) {
                cbl(e, null);
            }
        }
        else
            term.push(deflate(file, p, cbl));
    };
    // Cannot use lft because it can decrease
    for (var i = 0; i < slft; ++i) {
        _loop_1(i);
    }
    return tAll;
}
/**
 * Synchronously creates a ZIP file. Prefer using `zip` for better performance
 * with more than one file.
 * @param data The directory structure for the ZIP archive
 * @param opts The main options, merged with per-file options
 * @returns The generated ZIP archive
 */
function zipSync(data, opts) {
    if (!opts)
        opts = {};
    var r = {};
    var files = [];
    fltn(data, '', r, opts);
    var o = 0;
    var tot = 0;
    for (var fn in r) {
        var _a = r[fn], file = _a[0], p = _a[1];
        var compression = p.level == 0 ? 0 : 8;
        var f = strToU8(fn), s = f.length;
        var com = p.comment, m = com && strToU8(com), ms = m && m.length;
        var exl = exfl(p.extra);
        if (s > 65535)
            throw 'filename too long';
        var d = compression ? deflateSync(file, p) : file, l = d.length;
        var c = crc();
        c.p(file);
        files.push(mrg(p, {
            size: file.length,
            crc: c.d(),
            c: d,
            f: f,
            m: m,
            u: s != fn.length || (m && (com.length != ms)),
            o: o,
            compression: compression
        }));
        o += 30 + s + exl + l;
        tot += 76 + 2 * (s + exl) + (ms || 0) + l;
    }
    var out = new u8(tot + 22), oe = o, cdl = tot - o;
    for (var i = 0; i < files.length; ++i) {
        var f = files[i];
        wzh(out, f.o, f, f.f, f.u, f.c.length);
        var badd = 30 + f.f.length + exfl(f.extra);
        out.set(f.c, f.o + badd);
        wzh(out, o, f, f.f, f.u, f.c.length, f.o, f.m), o += 16 + badd + (f.m ? f.m.length : 0);
    }
    wzf(out, o, files.length, cdl, oe);
    return out;
}
/**
 * Streaming pass-through decompression for ZIP archives
 */
var UnzipPassThrough = /*#__PURE__*/ (function () {
    function UnzipPassThrough() {
    }
    UnzipPassThrough.prototype.push = function (data, final) {
        this.ondata(null, data, final);
    };
    UnzipPassThrough.compression = 0;
    return UnzipPassThrough;
}());
/**
 * Streaming DEFLATE decompression for ZIP archives. Prefer AsyncZipInflate for
 * better performance.
 */
var UnzipInflate = /*#__PURE__*/ (function () {
    /**
     * Creates a DEFLATE decompression that can be used in ZIP archives
     */
    function UnzipInflate() {
        var _this_1 = this;
        this.i = new Inflate(function (dat, final) {
            _this_1.ondata(null, dat, final);
        });
    }
    UnzipInflate.prototype.push = function (data, final) {
        try {
            this.i.push(data, final);
        }
        catch (e) {
            this.ondata(e, data, final);
        }
    };
    UnzipInflate.compression = 8;
    return UnzipInflate;
}());
/**
 * Asynchronous streaming DEFLATE decompression for ZIP archives
 */
var AsyncUnzipInflate = /*#__PURE__*/ (function () {
    /**
     * Creates a DEFLATE decompression that can be used in ZIP archives
     */
    function AsyncUnzipInflate(_, sz) {
        var _this_1 = this;
        if (sz < 320000) {
            this.i = new Inflate(function (dat, final) {
                _this_1.ondata(null, dat, final);
            });
        }
        else {
            this.i = new AsyncInflate(function (err, dat, final) {
                _this_1.ondata(err, dat, final);
            });
            this.terminate = this.i.terminate;
        }
    }
    AsyncUnzipInflate.prototype.push = function (data, final) {
        if (this.i.terminate)
            data = slc(data, 0);
        this.i.push(data, final);
    };
    AsyncUnzipInflate.compression = 8;
    return AsyncUnzipInflate;
}());
/**
 * A ZIP archive decompression stream that emits files as they are discovered
 */
var Unzip = /*#__PURE__*/ (function () {
    /**
     * Creates a ZIP decompression stream
     * @param cb The callback to call whenever a file in the ZIP archive is found
     */
    function Unzip(cb) {
        this.onfile = cb;
        this.k = [];
        this.o = {
            0: UnzipPassThrough
        };
        this.p = et;
    }
    /**
     * Pushes a chunk to be unzipped
     * @param chunk The chunk to push
     * @param final Whether this is the last chunk
     */
    Unzip.prototype.push = function (chunk, final) {
        var _this_1 = this;
        if (!this.onfile)
            throw 'no callback';
        if (!this.p)
            throw 'stream finished';
        if (this.c > 0) {
            var len = Math.min(this.c, chunk.length);
            var toAdd = chunk.subarray(0, len);
            this.c -= len;
            if (this.d)
                this.d.push(toAdd, !this.c);
            else
                this.k[0].push(toAdd);
            chunk = chunk.subarray(len);
            if (chunk.length)
                return this.push(chunk, final);
        }
        else {
            var f = 0, i = 0, is = void 0, buf = void 0;
            if (!this.p.length)
                buf = chunk;
            else if (!chunk.length)
                buf = this.p;
            else {
                buf = new u8(this.p.length + chunk.length);
                buf.set(this.p), buf.set(chunk, this.p.length);
            }
            var l = buf.length, oc = this.c, add = oc && this.d;
            var _loop_2 = function () {
                var _a;
                var sig = b4(buf, i);
                if (sig == 0x4034B50) {
                    f = 1, is = i;
                    this_1.d = null;
                    this_1.c = 0;
                    var bf = b2(buf, i + 6), cmp_1 = b2(buf, i + 8), u = bf & 2048, dd = bf & 8, fnl = b2(buf, i + 26), es = b2(buf, i + 28);
                    if (l > i + 30 + fnl + es) {
                        var chks_2 = [];
                        this_1.k.unshift(chks_2);
                        f = 2;
                        var sc_1 = b4(buf, i + 18), su_1 = b4(buf, i + 22);
                        var fn_1 = strFromU8(buf.subarray(i + 30, i += 30 + fnl), !u);
                        if (sc_1 == 4294967295) {
                            _a = dd ? [-2] : z64e(buf, i), sc_1 = _a[0], su_1 = _a[1];
                        }
                        else if (dd)
                            sc_1 = -1;
                        i += es;
                        this_1.c = sc_1;
                        var d_1;
                        var file_1 = {
                            name: fn_1,
                            compression: cmp_1,
                            start: function () {
                                if (!file_1.ondata)
                                    throw 'no callback';
                                if (!sc_1)
                                    file_1.ondata(null, et, true);
                                else {
                                    var ctr = _this_1.o[cmp_1];
                                    if (!ctr)
                                        throw 'unknown compression type ' + cmp_1;
                                    d_1 = sc_1 < 0 ? new ctr(fn_1) : new ctr(fn_1, sc_1, su_1);
                                    d_1.ondata = function (err, dat, final) { file_1.ondata(err, dat, final); };
                                    for (var _i = 0, chks_3 = chks_2; _i < chks_3.length; _i++) {
                                        var dat = chks_3[_i];
                                        d_1.push(dat, false);
                                    }
                                    if (_this_1.k[0] == chks_2 && _this_1.c)
                                        _this_1.d = d_1;
                                    else
                                        d_1.push(et, true);
                                }
                            },
                            terminate: function () {
                                if (d_1 && d_1.terminate)
                                    d_1.terminate();
                            }
                        };
                        if (sc_1 >= 0)
                            file_1.size = sc_1, file_1.originalSize = su_1;
                        this_1.onfile(file_1);
                    }
                    return "break";
                }
                else if (oc) {
                    if (sig == 0x8074B50) {
                        is = i += 12 + (oc == -2 && 8), f = 3, this_1.c = 0;
                        return "break";
                    }
                    else if (sig == 0x2014B50) {
                        is = i -= 4, f = 3, this_1.c = 0;
                        return "break";
                    }
                }
            };
            var this_1 = this;
            for (; i < l - 4; ++i) {
                var state_1 = _loop_2();
                if (state_1 === "break")
                    break;
            }
            this.p = et;
            if (oc < 0) {
                var dat = f ? buf.subarray(0, is - 12 - (oc == -2 && 8) - (b4(buf, is - 16) == 0x8074B50 && 4)) : buf.subarray(0, i);
                if (add)
                    add.push(dat, !!f);
                else
                    this.k[+(f == 2)].push(dat);
            }
            if (f & 2)
                return this.push(buf.subarray(i), final);
            this.p = buf.subarray(i);
        }
        if (final) {
            if (this.c)
                throw 'invalid zip file';
            this.p = null;
        }
    };
    /**
     * Registers a decoder with the stream, allowing for files compressed with
     * the compression type provided to be expanded correctly
     * @param decoder The decoder constructor
     */
    Unzip.prototype.register = function (decoder) {
        this.o[decoder.compression] = decoder;
    };
    return Unzip;
}());
/**
 * Asynchronously decompresses a ZIP archive
 * @param data The raw compressed ZIP file
 * @param cb The callback to call with the decompressed files
 * @returns A function that can be used to immediately terminate the unzipping
 */
function unzip(data, cb) {
    if (typeof cb != 'function')
        throw 'no callback';
    var term = [];
    var tAll = function () {
        for (var i = 0; i < term.length; ++i)
            term[i]();
    };
    var files = {};
    var e = data.length - 22;
    for (; b4(data, e) != 0x6054B50; --e) {
        if (!e || data.length - e > 65558) {
            cb('invalid zip file', null);
            return;
        }
    }
    var lft = b2(data, e + 8);
    if (!lft)
        cb(null, {});
    var c = lft;
    var o = b4(data, e + 16);
    var z = o == 4294967295;
    if (z) {
        e = b4(data, e - 12);
        if (b4(data, e) != 0x6064B50) {
            cb('invalid zip file', null);
            return;
        }
        c = lft = b4(data, e + 32);
        o = b4(data, e + 48);
    }
    var _loop_3 = function (i) {
        var _a = zh(data, o, z), c_1 = _a[0], sc = _a[1], su = _a[2], fn = _a[3], no = _a[4], off = _a[5], b = slzh(data, off);
        o = no;
        var cbl = function (e, d) {
            if (e) {
                tAll();
                cb(e, null);
            }
            else {
                files[fn] = d;
                if (!--lft)
                    cb(null, files);
            }
        };
        if (!c_1)
            cbl(null, slc(data, b, b + sc));
        else if (c_1 == 8) {
            var infl = data.subarray(b, b + sc);
            if (sc < 320000) {
                try {
                    cbl(null, inflateSync(infl, new u8(su)));
                }
                catch (e) {
                    cbl(e, null);
                }
            }
            else
                term.push(inflate(infl, { size: su }, cbl));
        }
        else
            cbl('unknown compression type ' + c_1, null);
    };
    for (var i = 0; i < c; ++i) {
        _loop_3();
    }
    return tAll;
}
/**
 * Synchronously decompresses a ZIP archive. Prefer using `unzip` for better
 * performance with more than one file.
 * @param data The raw compressed ZIP file
 * @returns The decompressed files
 */
function unzipSync(data) {
    var files = {};
    var e = data.length - 22;
    for (; b4(data, e) != 0x6054B50; --e) {
        if (!e || data.length - e > 65558)
            throw 'invalid zip file';
    }
    var c = b2(data, e + 8);
    if (!c)
        return {};
    var o = b4(data, e + 16);
    var z = o == 4294967295;
    if (z) {
        e = b4(data, e - 12);
        if (b4(data, e) != 0x6064B50)
            throw 'invalid zip file';
        c = b4(data, e + 32);
        o = b4(data, e + 48);
    }
    for (var i = 0; i < c; ++i) {
        var _a = zh(data, o, z), c_2 = _a[0], sc = _a[1], su = _a[2], fn = _a[3], no = _a[4], off = _a[5], b = slzh(data, off);
        o = no;
        if (!c_2)
            files[fn] = slc(data, b, b + sc);
        else if (c_2 == 8)
            files[fn] = inflateSync(data.subarray(b, b + sc), new u8(su));
        else
            throw 'unknown compression type ' + c_2;
    }
    return files;
}

var fflate = /*#__PURE__*/Object.freeze({
	__proto__: null,
	Deflate: Deflate,
	AsyncDeflate: AsyncDeflate,
	deflate: deflate,
	deflateSync: deflateSync,
	Inflate: Inflate,
	AsyncInflate: AsyncInflate,
	inflate: inflate,
	inflateSync: inflateSync,
	Gzip: Gzip,
	AsyncGzip: AsyncGzip,
	gzip: gzip,
	gzipSync: gzipSync,
	Gunzip: Gunzip,
	AsyncGunzip: AsyncGunzip,
	gunzip: gunzip,
	gunzipSync: gunzipSync,
	Zlib: Zlib,
	AsyncZlib: AsyncZlib,
	zlib: zlib,
	zlibSync: zlibSync,
	Unzlib: Unzlib,
	AsyncUnzlib: AsyncUnzlib,
	unzlib: unzlib,
	unzlibSync: unzlibSync,
	compress: gzip,
	AsyncCompress: AsyncGzip,
	compressSync: gzipSync,
	Compress: Gzip,
	Decompress: Decompress,
	AsyncDecompress: AsyncDecompress,
	decompress: decompress,
	decompressSync: decompressSync,
	DecodeUTF8: DecodeUTF8,
	EncodeUTF8: EncodeUTF8,
	strToU8: strToU8,
	strFromU8: strFromU8,
	ZipPassThrough: ZipPassThrough,
	ZipDeflate: ZipDeflate,
	AsyncZipDeflate: AsyncZipDeflate,
	Zip: Zip,
	zip: zip,
	zipSync: zipSync,
	UnzipPassThrough: UnzipPassThrough,
	UnzipInflate: UnzipInflate,
	AsyncUnzipInflate: AsyncUnzipInflate,
	Unzip: Unzip,
	unzip: unzip,
	unzipSync: unzipSync
});

/**
 * NURBS utils
 *
 * See NURBSCurve and NURBSSurface.
 **/


/**************************************************************
 *	NURBS Utils
 **************************************************************/

/*
Finds knot vector span.

p : degree
u : parametric value
U : knot vector

returns the span
*/
function findSpan( p, u, U ) {

	const n = U.length - p - 1;

	if ( u >= U[ n ] ) {

		return n - 1;

	}

	if ( u <= U[ p ] ) {

		return p;

	}

	let low = p;
	let high = n;
	let mid = Math.floor( ( low + high ) / 2 );

	while ( u < U[ mid ] || u >= U[ mid + 1 ] ) {

		if ( u < U[ mid ] ) {

			high = mid;

		} else {

			low = mid;

		}

		mid = Math.floor( ( low + high ) / 2 );

	}

	return mid;

}


/*
Calculate basis functions. See The NURBS Book, page 70, algorithm A2.2

span : span in which u lies
u    : parametric point
p    : degree
U    : knot vector

returns array[p+1] with basis functions values.
*/
function calcBasisFunctions( span, u, p, U ) {

	const N = [];
	const left = [];
	const right = [];
	N[ 0 ] = 1.0;

	for ( let j = 1; j <= p; ++ j ) {

		left[ j ] = u - U[ span + 1 - j ];
		right[ j ] = U[ span + j ] - u;

		let saved = 0.0;

		for ( let r = 0; r < j; ++ r ) {

			const rv = right[ r + 1 ];
			const lv = left[ j - r ];
			const temp = N[ r ] / ( rv + lv );
			N[ r ] = saved + rv * temp;
			saved = lv * temp;

		}

		N[ j ] = saved;

	}

	return N;

}


/*
Calculate B-Spline curve points. See The NURBS Book, page 82, algorithm A3.1.

p : degree of B-Spline
U : knot vector
P : control points (x, y, z, w)
u : parametric point

returns point for given u
*/
function calcBSplinePoint( p, U, P, u ) {

	const span = findSpan( p, u, U );
	const N = calcBasisFunctions( span, u, p, U );
	const C = new three.Vector4( 0, 0, 0, 0 );

	for ( let j = 0; j <= p; ++ j ) {

		const point = P[ span - p + j ];
		const Nj = N[ j ];
		const wNj = point.w * Nj;
		C.x += point.x * wNj;
		C.y += point.y * wNj;
		C.z += point.z * wNj;
		C.w += point.w * Nj;

	}

	return C;

}


/*
Calculate basis functions derivatives. See The NURBS Book, page 72, algorithm A2.3.

span : span in which u lies
u    : parametric point
p    : degree
n    : number of derivatives to calculate
U    : knot vector

returns array[n+1][p+1] with basis functions derivatives
*/
function calcBasisFunctionDerivatives( span, u, p, n, U ) {

	const zeroArr = [];
	for ( let i = 0; i <= p; ++ i )
		zeroArr[ i ] = 0.0;

	const ders = [];

	for ( let i = 0; i <= n; ++ i )
		ders[ i ] = zeroArr.slice( 0 );

	const ndu = [];

	for ( let i = 0; i <= p; ++ i )
		ndu[ i ] = zeroArr.slice( 0 );

	ndu[ 0 ][ 0 ] = 1.0;

	const left = zeroArr.slice( 0 );
	const right = zeroArr.slice( 0 );

	for ( let j = 1; j <= p; ++ j ) {

		left[ j ] = u - U[ span + 1 - j ];
		right[ j ] = U[ span + j ] - u;

		let saved = 0.0;

		for ( let r = 0; r < j; ++ r ) {

			const rv = right[ r + 1 ];
			const lv = left[ j - r ];
			ndu[ j ][ r ] = rv + lv;

			const temp = ndu[ r ][ j - 1 ] / ndu[ j ][ r ];
			ndu[ r ][ j ] = saved + rv * temp;
			saved = lv * temp;

		}

		ndu[ j ][ j ] = saved;

	}

	for ( let j = 0; j <= p; ++ j ) {

		ders[ 0 ][ j ] = ndu[ j ][ p ];

	}

	for ( let r = 0; r <= p; ++ r ) {

		let s1 = 0;
		let s2 = 1;

		const a = [];
		for ( let i = 0; i <= p; ++ i ) {

			a[ i ] = zeroArr.slice( 0 );

		}

		a[ 0 ][ 0 ] = 1.0;

		for ( let k = 1; k <= n; ++ k ) {

			let d = 0.0;
			const rk = r - k;
			const pk = p - k;

			if ( r >= k ) {

				a[ s2 ][ 0 ] = a[ s1 ][ 0 ] / ndu[ pk + 1 ][ rk ];
				d = a[ s2 ][ 0 ] * ndu[ rk ][ pk ];

			}

			const j1 = ( rk >= - 1 ) ? 1 : - rk;
			const j2 = ( r - 1 <= pk ) ? k - 1 : p - r;

			for ( let j = j1; j <= j2; ++ j ) {

				a[ s2 ][ j ] = ( a[ s1 ][ j ] - a[ s1 ][ j - 1 ] ) / ndu[ pk + 1 ][ rk + j ];
				d += a[ s2 ][ j ] * ndu[ rk + j ][ pk ];

			}

			if ( r <= pk ) {

				a[ s2 ][ k ] = - a[ s1 ][ k - 1 ] / ndu[ pk + 1 ][ r ];
				d += a[ s2 ][ k ] * ndu[ r ][ pk ];

			}

			ders[ k ][ r ] = d;

			const j = s1;
			s1 = s2;
			s2 = j;

		}

	}

	let r = p;

	for ( let k = 1; k <= n; ++ k ) {

		for ( let j = 0; j <= p; ++ j ) {

			ders[ k ][ j ] *= r;

		}

		r *= p - k;

	}

	return ders;

}


/*
	Calculate derivatives of a B-Spline. See The NURBS Book, page 93, algorithm A3.2.

	p  : degree
	U  : knot vector
	P  : control points
	u  : Parametric points
	nd : number of derivatives

	returns array[d+1] with derivatives
	*/
function calcBSplineDerivatives( p, U, P, u, nd ) {

	const du = nd < p ? nd : p;
	const CK = [];
	const span = findSpan( p, u, U );
	const nders = calcBasisFunctionDerivatives( span, u, p, du, U );
	const Pw = [];

	for ( let i = 0; i < P.length; ++ i ) {

		const point = P[ i ].clone();
		const w = point.w;

		point.x *= w;
		point.y *= w;
		point.z *= w;

		Pw[ i ] = point;

	}

	for ( let k = 0; k <= du; ++ k ) {

		const point = Pw[ span - p ].clone().multiplyScalar( nders[ k ][ 0 ] );

		for ( let j = 1; j <= p; ++ j ) {

			point.add( Pw[ span - p + j ].clone().multiplyScalar( nders[ k ][ j ] ) );

		}

		CK[ k ] = point;

	}

	for ( let k = du + 1; k <= nd + 1; ++ k ) {

		CK[ k ] = new three.Vector4( 0, 0, 0 );

	}

	return CK;

}


/*
Calculate "K over I"

returns k!/(i!(k-i)!)
*/
function calcKoverI( k, i ) {

	let nom = 1;

	for ( let j = 2; j <= k; ++ j ) {

		nom *= j;

	}

	let denom = 1;

	for ( let j = 2; j <= i; ++ j ) {

		denom *= j;

	}

	for ( let j = 2; j <= k - i; ++ j ) {

		denom *= j;

	}

	return nom / denom;

}


/*
Calculate derivatives (0-nd) of rational curve. See The NURBS Book, page 127, algorithm A4.2.

Pders : result of function calcBSplineDerivatives

returns array with derivatives for rational curve.
*/
function calcRationalCurveDerivatives( Pders ) {

	const nd = Pders.length;
	const Aders = [];
	const wders = [];

	for ( let i = 0; i < nd; ++ i ) {

		const point = Pders[ i ];
		Aders[ i ] = new three.Vector3( point.x, point.y, point.z );
		wders[ i ] = point.w;

	}

	const CK = [];

	for ( let k = 0; k < nd; ++ k ) {

		const v = Aders[ k ].clone();

		for ( let i = 1; i <= k; ++ i ) {

			v.sub( CK[ k - i ].clone().multiplyScalar( calcKoverI( k, i ) * wders[ i ] ) );

		}

		CK[ k ] = v.divideScalar( wders[ 0 ] );

	}

	return CK;

}


/*
Calculate NURBS curve derivatives. See The NURBS Book, page 127, algorithm A4.2.

p  : degree
U  : knot vector
P  : control points in homogeneous space
u  : parametric points
nd : number of derivatives

returns array with derivatives.
*/
function calcNURBSDerivatives( p, U, P, u, nd ) {

	const Pders = calcBSplineDerivatives( p, U, P, u, nd );
	return calcRationalCurveDerivatives( Pders );

}

/**
 * NURBS curve object
 *
 * Derives from Curve, overriding getPoint and getTangent.
 *
 * Implementation is based on (x, y [, z=0 [, w=1]]) control points with w=weight.
 *
 **/

class NURBSCurve extends three.Curve {

	constructor(
		degree,
		knots /* array of reals */,
		controlPoints /* array of Vector(2|3|4) */,
		startKnot /* index in knots */,
		endKnot /* index in knots */
	) {

		super();

		this.degree = degree;
		this.knots = knots;
		this.controlPoints = [];
		// Used by periodic NURBS to remove hidden spans
		this.startKnot = startKnot || 0;
		this.endKnot = endKnot || ( this.knots.length - 1 );

		for ( let i = 0; i < controlPoints.length; ++ i ) {

			// ensure Vector4 for control points
			const point = controlPoints[ i ];
			this.controlPoints[ i ] = new three.Vector4( point.x, point.y, point.z, point.w );

		}

	}

	getPoint( t, optionalTarget = new three.Vector3() ) {

		const point = optionalTarget;

		const u = this.knots[ this.startKnot ] + t * ( this.knots[ this.endKnot ] - this.knots[ this.startKnot ] ); // linear mapping t->u

		// following results in (wx, wy, wz, w) homogeneous point
		const hpoint = calcBSplinePoint( this.degree, this.knots, this.controlPoints, u );

		if ( hpoint.w !== 1.0 ) {

			// project to 3D space: (wx, wy, wz, w) -> (x, y, z, 1)
			hpoint.divideScalar( hpoint.w );

		}

		return point.set( hpoint.x, hpoint.y, hpoint.z );

	}

	getTangent( t, optionalTarget = new three.Vector3() ) {

		const tangent = optionalTarget;

		const u = this.knots[ 0 ] + t * ( this.knots[ this.knots.length - 1 ] - this.knots[ 0 ] );
		const ders = calcNURBSDerivatives( this.degree, this.knots, this.controlPoints, u, 1 );
		tangent.copy( ders[ 1 ] ).normalize();

		return tangent;

	}

}

/**
 * Loader loads FBX file and generates Group representing FBX scene.
 * Requires FBX file to be >= 7.0 and in ASCII or >= 6400 in Binary format
 * Versions lower than this may load but will probably have errors
 *
 * Needs Support:
 *  Morph normals / blend shape normals
 *
 * FBX format references:
 * 	https://wiki.blender.org/index.php/User:Mont29/Foundation/FBX_File_Structure
 * 	http://help.autodesk.com/view/FBX/2017/ENU/?guid=__cpp_ref_index_html (C++ SDK reference)
 *
 * 	Binary format specification:
 *		https://code.blender.org/2013/08/fbx-binary-file-format-specification/
 */


let fbxTree;
let connections;
let sceneGraph;

class FBXLoader extends three.Loader {

	constructor( manager ) {

		super( manager );

	}

	load( url, onLoad, onProgress, onError ) {

		const scope = this;

		const path = ( scope.path === '' ) ? three.LoaderUtils.extractUrlBase( url ) : scope.path;

		const loader = new three.FileLoader( this.manager );
		loader.setPath( scope.path );
		loader.setResponseType( 'arraybuffer' );
		loader.setRequestHeader( scope.requestHeader );
		loader.setWithCredentials( scope.withCredentials );

		loader.load( url, function ( buffer ) {

			try {

				onLoad( scope.parse( buffer, path ) );

			} catch ( e ) {

				if ( onError ) {

					onError( e );

				} else {

					console.error( e );

				}

				scope.manager.itemError( url );

			}

		}, onProgress, onError );

	}

	parse( FBXBuffer, path ) {

		if ( isFbxFormatBinary( FBXBuffer ) ) {

			fbxTree = new BinaryParser().parse( FBXBuffer );

		} else {

			const FBXText = convertArrayBufferToString( FBXBuffer );

			if ( ! isFbxFormatASCII( FBXText ) ) {

				throw new Error( 'THREE.FBXLoader: Unknown format.' );

			}

			if ( getFbxVersion( FBXText ) < 7000 ) {

				throw new Error( 'THREE.FBXLoader: FBX version not supported, FileVersion: ' + getFbxVersion( FBXText ) );

			}

			fbxTree = new TextParser().parse( FBXText );

		}

		// console.log( fbxTree );

		const textureLoader = new three.TextureLoader( this.manager ).setPath( this.resourcePath || path ).setCrossOrigin( this.crossOrigin );

		return new FBXTreeParser( textureLoader, this.manager ).parse( fbxTree );

	}

}

// Parse the FBXTree object returned by the BinaryParser or TextParser and return a Group
class FBXTreeParser {

	constructor( textureLoader, manager ) {

		this.textureLoader = textureLoader;
		this.manager = manager;

	}

	parse() {

		connections = this.parseConnections();

		const images = this.parseImages();
		const textures = this.parseTextures( images );
		const materials = this.parseMaterials( textures );
		const deformers = this.parseDeformers();
		const geometryMap = new GeometryParser$1().parse( deformers );

		this.parseScene( deformers, geometryMap, materials );

		return sceneGraph;

	}

	// Parses FBXTree.Connections which holds parent-child connections between objects (e.g. material -> texture, model->geometry )
	// and details the connection type
	parseConnections() {

		const connectionMap = new Map();

		if ( 'Connections' in fbxTree ) {

			const rawConnections = fbxTree.Connections.connections;

			rawConnections.forEach( function ( rawConnection ) {

				const fromID = rawConnection[ 0 ];
				const toID = rawConnection[ 1 ];
				const relationship = rawConnection[ 2 ];

				if ( ! connectionMap.has( fromID ) ) {

					connectionMap.set( fromID, {
						parents: [],
						children: []
					} );

				}

				const parentRelationship = { ID: toID, relationship: relationship };
				connectionMap.get( fromID ).parents.push( parentRelationship );

				if ( ! connectionMap.has( toID ) ) {

					connectionMap.set( toID, {
						parents: [],
						children: []
					} );

				}

				const childRelationship = { ID: fromID, relationship: relationship };
				connectionMap.get( toID ).children.push( childRelationship );

			} );

		}

		return connectionMap;

	}

	// Parse FBXTree.Objects.Video for embedded image data
	// These images are connected to textures in FBXTree.Objects.Textures
	// via FBXTree.Connections.
	parseImages() {

		const images = {};
		const blobs = {};

		if ( 'Video' in fbxTree.Objects ) {

			const videoNodes = fbxTree.Objects.Video;

			for ( const nodeID in videoNodes ) {

				const videoNode = videoNodes[ nodeID ];

				const id = parseInt( nodeID );

				images[ id ] = videoNode.RelativeFilename || videoNode.Filename;

				// raw image data is in videoNode.Content
				if ( 'Content' in videoNode ) {

					const arrayBufferContent = ( videoNode.Content instanceof ArrayBuffer ) && ( videoNode.Content.byteLength > 0 );
					const base64Content = ( typeof videoNode.Content === 'string' ) && ( videoNode.Content !== '' );

					if ( arrayBufferContent || base64Content ) {

						const image = this.parseImage( videoNodes[ nodeID ] );

						blobs[ videoNode.RelativeFilename || videoNode.Filename ] = image;

					}

				}

			}

		}

		for ( const id in images ) {

			const filename = images[ id ];

			if ( blobs[ filename ] !== undefined ) images[ id ] = blobs[ filename ];
			else images[ id ] = images[ id ].split( '\\' ).pop();

		}

		return images;

	}

	// Parse embedded image data in FBXTree.Video.Content
	parseImage( videoNode ) {

		const content = videoNode.Content;
		const fileName = videoNode.RelativeFilename || videoNode.Filename;
		const extension = fileName.slice( fileName.lastIndexOf( '.' ) + 1 ).toLowerCase();

		let type;

		switch ( extension ) {

			case 'bmp':

				type = 'image/bmp';
				break;

			case 'jpg':
			case 'jpeg':

				type = 'image/jpeg';
				break;

			case 'png':

				type = 'image/png';
				break;

			case 'tif':

				type = 'image/tiff';
				break;

			case 'tga':

				if ( this.manager.getHandler( '.tga' ) === null ) {

					console.warn( 'FBXLoader: TGA loader not found, skipping ', fileName );

				}

				type = 'image/tga';
				break;

			default:

				console.warn( 'FBXLoader: Image type "' + extension + '" is not supported.' );
				return;

		}

		if ( typeof content === 'string' ) { // ASCII format

			return 'data:' + type + ';base64,' + content;

		} else { // Binary Format

			const array = new Uint8Array( content );
			return three._default.polyfill.window.URL.createObjectURL( new three._default.polyfill.Blob( [ array ], { type: type } ) );

		}

	}

	// Parse nodes in FBXTree.Objects.Texture
	// These contain details such as UV scaling, cropping, rotation etc and are connected
	// to images in FBXTree.Objects.Video
	parseTextures( images ) {

		const textureMap = new Map();

		if ( 'Texture' in fbxTree.Objects ) {

			const textureNodes = fbxTree.Objects.Texture;
			for ( const nodeID in textureNodes ) {

				const texture = this.parseTexture( textureNodes[ nodeID ], images );
				textureMap.set( parseInt( nodeID ), texture );

			}

		}

		return textureMap;

	}

	// Parse individual node in FBXTree.Objects.Texture
	parseTexture( textureNode, images ) {

		const texture = this.loadTexture( textureNode, images );

		texture.ID = textureNode.id;

		texture.name = textureNode.attrName;

		const wrapModeU = textureNode.WrapModeU;
		const wrapModeV = textureNode.WrapModeV;

		const valueU = wrapModeU !== undefined ? wrapModeU.value : 0;
		const valueV = wrapModeV !== undefined ? wrapModeV.value : 0;

		// http://download.autodesk.com/us/fbx/SDKdocs/FBX_SDK_Help/files/fbxsdkref/class_k_fbx_texture.html#889640e63e2e681259ea81061b85143a
		// 0: repeat(default), 1: clamp

		texture.wrapS = valueU === 0 ? three.RepeatWrapping : three.ClampToEdgeWrapping;
		texture.wrapT = valueV === 0 ? three.RepeatWrapping : three.ClampToEdgeWrapping;

		if ( 'Scaling' in textureNode ) {

			const values = textureNode.Scaling.value;

			texture.repeat.x = values[ 0 ];
			texture.repeat.y = values[ 1 ];

		}

		return texture;

	}

	// load a texture specified as a blob or data URI, or via an external URL using TextureLoader
	loadTexture( textureNode, images ) {

		let fileName;

		const currentPath = this.textureLoader.path;

		const children = connections.get( textureNode.id ).children;

		if ( children !== undefined && children.length > 0 && images[ children[ 0 ].ID ] !== undefined ) {

			fileName = images[ children[ 0 ].ID ];

			if ( fileName.indexOf( 'blob:' ) === 0 || fileName.indexOf( 'data:' ) === 0 ) {

				this.textureLoader.setPath( undefined );

			}

		}

		let texture;

		const extension = textureNode.FileName.slice( - 3 ).toLowerCase();

		if ( extension === 'tga' ) {

			const loader = this.manager.getHandler( '.tga' );

			if ( loader === null ) {

				console.warn( 'FBXLoader: TGA loader not found, creating placeholder texture for', textureNode.RelativeFilename );
				texture = new three.Texture();

			} else {

				loader.setPath( this.textureLoader.path );
				texture = loader.load( fileName );

			}

		} else if ( extension === 'psd' ) {

			console.warn( 'FBXLoader: PSD textures are not supported, creating placeholder texture for', textureNode.RelativeFilename );
			texture = new three.Texture();

		} else {

			texture = this.textureLoader.load( fileName );

		}

		this.textureLoader.setPath( currentPath );

		return texture;

	}

	// Parse nodes in FBXTree.Objects.Material
	parseMaterials( textureMap ) {

		const materialMap = new Map();

		if ( 'Material' in fbxTree.Objects ) {

			const materialNodes = fbxTree.Objects.Material;

			for ( const nodeID in materialNodes ) {

				const material = this.parseMaterial( materialNodes[ nodeID ], textureMap );

				if ( material !== null ) materialMap.set( parseInt( nodeID ), material );

			}

		}

		return materialMap;

	}

	// Parse single node in FBXTree.Objects.Material
	// Materials are connected to texture maps in FBXTree.Objects.Textures
	// FBX format currently only supports Lambert and Phong shading models
	parseMaterial( materialNode, textureMap ) {

		const ID = materialNode.id;
		const name = materialNode.attrName;
		let type = materialNode.ShadingModel;

		// Case where FBX wraps shading model in property object.
		if ( typeof type === 'object' ) {

			type = type.value;

		}

		// Ignore unused materials which don't have any connections.
		if ( ! connections.has( ID ) ) return null;

		const parameters = this.parseParameters( materialNode, textureMap, ID );

		let material;

		switch ( type.toLowerCase() ) {

			case 'phong':
				material = new three.MeshPhongMaterial();
				break;
			case 'lambert':
				material = new three.MeshLambertMaterial();
				break;
			default:
				console.warn( 'THREE.FBXLoader: unknown material type "%s". Defaulting to MeshPhongMaterial.', type );
				material = new three.MeshPhongMaterial();
				break;

		}

		material.setValues( parameters );
		material.name = name;

		return material;

	}

	// Parse FBX material and return parameters suitable for a three.js material
	// Also parse the texture map and return any textures associated with the material
	parseParameters( materialNode, textureMap, ID ) {

		const parameters = {};

		if ( materialNode.BumpFactor ) {

			parameters.bumpScale = materialNode.BumpFactor.value;

		}

		if ( materialNode.Diffuse ) {

			parameters.color = new three.Color().fromArray( materialNode.Diffuse.value );

		} else if ( materialNode.DiffuseColor && ( materialNode.DiffuseColor.type === 'Color' || materialNode.DiffuseColor.type === 'ColorRGB' ) ) {

			// The blender exporter exports diffuse here instead of in materialNode.Diffuse
			parameters.color = new three.Color().fromArray( materialNode.DiffuseColor.value );

		}

		if ( materialNode.DisplacementFactor ) {

			parameters.displacementScale = materialNode.DisplacementFactor.value;

		}

		if ( materialNode.Emissive ) {

			parameters.emissive = new three.Color().fromArray( materialNode.Emissive.value );

		} else if ( materialNode.EmissiveColor && ( materialNode.EmissiveColor.type === 'Color' || materialNode.EmissiveColor.type === 'ColorRGB' ) ) {

			// The blender exporter exports emissive color here instead of in materialNode.Emissive
			parameters.emissive = new three.Color().fromArray( materialNode.EmissiveColor.value );

		}

		if ( materialNode.EmissiveFactor ) {

			parameters.emissiveIntensity = parseFloat( materialNode.EmissiveFactor.value );

		}

		if ( materialNode.Opacity ) {

			parameters.opacity = parseFloat( materialNode.Opacity.value );

		}

		if ( parameters.opacity < 1.0 ) {

			parameters.transparent = true;

		}

		if ( materialNode.ReflectionFactor ) {

			parameters.reflectivity = materialNode.ReflectionFactor.value;

		}

		if ( materialNode.Shininess ) {

			parameters.shininess = materialNode.Shininess.value;

		}

		if ( materialNode.Specular ) {

			parameters.specular = new three.Color().fromArray( materialNode.Specular.value );

		} else if ( materialNode.SpecularColor && materialNode.SpecularColor.type === 'Color' ) {

			// The blender exporter exports specular color here instead of in materialNode.Specular
			parameters.specular = new three.Color().fromArray( materialNode.SpecularColor.value );

		}

		const scope = this;
		connections.get( ID ).children.forEach( function ( child ) {

			const type = child.relationship;

			switch ( type ) {

				case 'Bump':
					parameters.bumpMap = scope.getTexture( textureMap, child.ID );
					break;

				case 'Maya|TEX_ao_map':
					parameters.aoMap = scope.getTexture( textureMap, child.ID );
					break;

				case 'DiffuseColor':
				case 'Maya|TEX_color_map':
					parameters.map = scope.getTexture( textureMap, child.ID );
					if ( parameters.map !== undefined ) {

						parameters.map.encoding = three.sRGBEncoding;

					}

					break;

				case 'DisplacementColor':
					parameters.displacementMap = scope.getTexture( textureMap, child.ID );
					break;

				case 'EmissiveColor':
					parameters.emissiveMap = scope.getTexture( textureMap, child.ID );
					if ( parameters.emissiveMap !== undefined ) {

						parameters.emissiveMap.encoding = three.sRGBEncoding;

					}

					break;

				case 'NormalMap':
				case 'Maya|TEX_normal_map':
					parameters.normalMap = scope.getTexture( textureMap, child.ID );
					break;

				case 'ReflectionColor':
					parameters.envMap = scope.getTexture( textureMap, child.ID );
					if ( parameters.envMap !== undefined ) {

						parameters.envMap.mapping = three.EquirectangularReflectionMapping;
						parameters.envMap.encoding = three.sRGBEncoding;

					}

					break;

				case 'SpecularColor':
					parameters.specularMap = scope.getTexture( textureMap, child.ID );
					if ( parameters.specularMap !== undefined ) {

						parameters.specularMap.encoding = three.sRGBEncoding;

					}

					break;

				case 'TransparentColor':
				case 'TransparencyFactor':
					parameters.alphaMap = scope.getTexture( textureMap, child.ID );
					parameters.transparent = true;
					break;

				case 'AmbientColor':
				case 'ShininessExponent': // AKA glossiness map
				case 'SpecularFactor': // AKA specularLevel
				case 'VectorDisplacementColor': // NOTE: Seems to be a copy of DisplacementColor
				default:
					console.warn( 'THREE.FBXLoader: %s map is not supported in three.js, skipping texture.', type );
					break;

			}

		} );

		return parameters;

	}

	// get a texture from the textureMap for use by a material.
	getTexture( textureMap, id ) {

		// if the texture is a layered texture, just use the first layer and issue a warning
		if ( 'LayeredTexture' in fbxTree.Objects && id in fbxTree.Objects.LayeredTexture ) {

			console.warn( 'THREE.FBXLoader: layered textures are not supported in three.js. Discarding all but first layer.' );
			id = connections.get( id ).children[ 0 ].ID;

		}

		return textureMap.get( id );

	}

	// Parse nodes in FBXTree.Objects.Deformer
	// Deformer node can contain skinning or Vertex Cache animation data, however only skinning is supported here
	// Generates map of Skeleton-like objects for use later when generating and binding skeletons.
	parseDeformers() {

		const skeletons = {};
		const morphTargets = {};

		if ( 'Deformer' in fbxTree.Objects ) {

			const DeformerNodes = fbxTree.Objects.Deformer;

			for ( const nodeID in DeformerNodes ) {

				const deformerNode = DeformerNodes[ nodeID ];

				const relationships = connections.get( parseInt( nodeID ) );

				if ( deformerNode.attrType === 'Skin' ) {

					const skeleton = this.parseSkeleton( relationships, DeformerNodes );
					skeleton.ID = nodeID;

					if ( relationships.parents.length > 1 ) console.warn( 'THREE.FBXLoader: skeleton attached to more than one geometry is not supported.' );
					skeleton.geometryID = relationships.parents[ 0 ].ID;

					skeletons[ nodeID ] = skeleton;

				} else if ( deformerNode.attrType === 'BlendShape' ) {

					const morphTarget = {
						id: nodeID,
					};

					morphTarget.rawTargets = this.parseMorphTargets( relationships, DeformerNodes );
					morphTarget.id = nodeID;

					if ( relationships.parents.length > 1 ) console.warn( 'THREE.FBXLoader: morph target attached to more than one geometry is not supported.' );

					morphTargets[ nodeID ] = morphTarget;

				}

			}

		}

		return {

			skeletons: skeletons,
			morphTargets: morphTargets,

		};

	}

	// Parse single nodes in FBXTree.Objects.Deformer
	// The top level skeleton node has type 'Skin' and sub nodes have type 'Cluster'
	// Each skin node represents a skeleton and each cluster node represents a bone
	parseSkeleton( relationships, deformerNodes ) {

		const rawBones = [];

		relationships.children.forEach( function ( child ) {

			const boneNode = deformerNodes[ child.ID ];

			if ( boneNode.attrType !== 'Cluster' ) return;

			const rawBone = {

				ID: child.ID,
				indices: [],
				weights: [],
				transformLink: new three.Matrix4().fromArray( boneNode.TransformLink.a ),
				// transform: new Matrix4().fromArray( boneNode.Transform.a ),
				// linkMode: boneNode.Mode,

			};

			if ( 'Indexes' in boneNode ) {

				rawBone.indices = boneNode.Indexes.a;
				rawBone.weights = boneNode.Weights.a;

			}

			rawBones.push( rawBone );

		} );

		return {

			rawBones: rawBones,
			bones: []

		};

	}

	// The top level morph deformer node has type "BlendShape" and sub nodes have type "BlendShapeChannel"
	parseMorphTargets( relationships, deformerNodes ) {

		const rawMorphTargets = [];

		for ( let i = 0; i < relationships.children.length; i ++ ) {

			const child = relationships.children[ i ];

			const morphTargetNode = deformerNodes[ child.ID ];

			const rawMorphTarget = {

				name: morphTargetNode.attrName,
				initialWeight: morphTargetNode.DeformPercent,
				id: morphTargetNode.id,
				fullWeights: morphTargetNode.FullWeights.a

			};

			if ( morphTargetNode.attrType !== 'BlendShapeChannel' ) return;

			rawMorphTarget.geoID = connections.get( parseInt( child.ID ) ).children.filter( function ( child ) {

				return child.relationship === undefined;

			} )[ 0 ].ID;

			rawMorphTargets.push( rawMorphTarget );

		}

		return rawMorphTargets;

	}

	// create the main Group() to be returned by the loader
	parseScene( deformers, geometryMap, materialMap ) {

		sceneGraph = new three.Group();

		const modelMap = this.parseModels( deformers.skeletons, geometryMap, materialMap );

		const modelNodes = fbxTree.Objects.Model;

		const scope = this;
		modelMap.forEach( function ( model ) {

			const modelNode = modelNodes[ model.ID ];
			scope.setLookAtProperties( model, modelNode );

			const parentConnections = connections.get( model.ID ).parents;

			parentConnections.forEach( function ( connection ) {

				const parent = modelMap.get( connection.ID );
				if ( parent !== undefined ) parent.add( model );

			} );

			if ( model.parent === null ) {

				sceneGraph.add( model );

			}


		} );

		this.bindSkeleton( deformers.skeletons, geometryMap, modelMap );

		this.createAmbientLight();

		sceneGraph.traverse( function ( node ) {

			if ( node.userData.transformData ) {

				if ( node.parent ) {

					node.userData.transformData.parentMatrix = node.parent.matrix;
					node.userData.transformData.parentMatrixWorld = node.parent.matrixWorld;

				}

				const transform = generateTransform( node.userData.transformData );

				node.applyMatrix4( transform );
				node.updateWorldMatrix();

			}

		} );

		const animations = new AnimationParser().parse();

		// if all the models where already combined in a single group, just return that
		if ( sceneGraph.children.length === 1 && sceneGraph.children[ 0 ].isGroup ) {

			sceneGraph.children[ 0 ].animations = animations;
			sceneGraph = sceneGraph.children[ 0 ];

		}

		sceneGraph.animations = animations;

	}

	// parse nodes in FBXTree.Objects.Model
	parseModels( skeletons, geometryMap, materialMap ) {

		const modelMap = new Map();
		const modelNodes = fbxTree.Objects.Model;

		for ( const nodeID in modelNodes ) {

			const id = parseInt( nodeID );
			const node = modelNodes[ nodeID ];
			const relationships = connections.get( id );

			let model = this.buildSkeleton( relationships, skeletons, id, node.attrName );

			if ( ! model ) {

				switch ( node.attrType ) {

					case 'Camera':
						model = this.createCamera( relationships );
						break;
					case 'Light':
						model = this.createLight( relationships );
						break;
					case 'Mesh':
						model = this.createMesh( relationships, geometryMap, materialMap );
						break;
					case 'NurbsCurve':
						model = this.createCurve( relationships, geometryMap );
						break;
					case 'LimbNode':
					case 'Root':
						model = new three.Bone();
						break;
					case 'Null':
					default:
						model = new three.Group();
						break;

				}

				model.name = node.attrName ? three.PropertyBinding.sanitizeNodeName( node.attrName ) : '';

				model.ID = id;

			}

			this.getTransformData( model, node );
			modelMap.set( id, model );

		}

		return modelMap;

	}

	buildSkeleton( relationships, skeletons, id, name ) {

		let bone = null;

		relationships.parents.forEach( function ( parent ) {

			for ( const ID in skeletons ) {

				const skeleton = skeletons[ ID ];

				skeleton.rawBones.forEach( function ( rawBone, i ) {

					if ( rawBone.ID === parent.ID ) {

						const subBone = bone;
						bone = new three.Bone();

						bone.matrixWorld.copy( rawBone.transformLink );

						// set name and id here - otherwise in cases where "subBone" is created it will not have a name / id

						bone.name = name ? three.PropertyBinding.sanitizeNodeName( name ) : '';
						bone.ID = id;

						skeleton.bones[ i ] = bone;

						// In cases where a bone is shared between multiple meshes
						// duplicate the bone here and and it as a child of the first bone
						if ( subBone !== null ) {

							bone.add( subBone );

						}

					}

				} );

			}

		} );

		return bone;

	}

	// create a PerspectiveCamera or OrthographicCamera
	createCamera( relationships ) {

		let model;
		let cameraAttribute;

		relationships.children.forEach( function ( child ) {

			const attr = fbxTree.Objects.NodeAttribute[ child.ID ];

			if ( attr !== undefined ) {

				cameraAttribute = attr;

			}

		} );

		if ( cameraAttribute === undefined ) {

			model = new three.Object3D();

		} else {

			let type = 0;
			if ( cameraAttribute.CameraProjectionType !== undefined && cameraAttribute.CameraProjectionType.value === 1 ) {

				type = 1;

			}

			let nearClippingPlane = 1;
			if ( cameraAttribute.NearPlane !== undefined ) {

				nearClippingPlane = cameraAttribute.NearPlane.value / 1000;

			}

			let farClippingPlane = 1000;
			if ( cameraAttribute.FarPlane !== undefined ) {

				farClippingPlane = cameraAttribute.FarPlane.value / 1000;

			}


			let width = three._default.polyfill.window.innerWidth;
			let height = three._default.polyfill.window.innerHeight;

			if ( cameraAttribute.AspectWidth !== undefined && cameraAttribute.AspectHeight !== undefined ) {

				width = cameraAttribute.AspectWidth.value;
				height = cameraAttribute.AspectHeight.value;

			}

			const aspect = width / height;

			let fov = 45;
			if ( cameraAttribute.FieldOfView !== undefined ) {

				fov = cameraAttribute.FieldOfView.value;

			}

			const focalLength = cameraAttribute.FocalLength ? cameraAttribute.FocalLength.value : null;

			switch ( type ) {

				case 0: // Perspective
					model = new three.PerspectiveCamera( fov, aspect, nearClippingPlane, farClippingPlane );
					if ( focalLength !== null ) model.setFocalLength( focalLength );
					break;

				case 1: // Orthographic
					model = new three.OrthographicCamera( - width / 2, width / 2, height / 2, - height / 2, nearClippingPlane, farClippingPlane );
					break;

				default:
					console.warn( 'THREE.FBXLoader: Unknown camera type ' + type + '.' );
					model = new three.Object3D();
					break;

			}

		}

		return model;

	}

	// Create a DirectionalLight, PointLight or SpotLight
	createLight( relationships ) {

		let model;
		let lightAttribute;

		relationships.children.forEach( function ( child ) {

			const attr = fbxTree.Objects.NodeAttribute[ child.ID ];

			if ( attr !== undefined ) {

				lightAttribute = attr;

			}

		} );

		if ( lightAttribute === undefined ) {

			model = new three.Object3D();

		} else {

			let type;

			// LightType can be undefined for Point lights
			if ( lightAttribute.LightType === undefined ) {

				type = 0;

			} else {

				type = lightAttribute.LightType.value;

			}

			let color = 0xffffff;

			if ( lightAttribute.Color !== undefined ) {

				color = new three.Color().fromArray( lightAttribute.Color.value );

			}

			let intensity = ( lightAttribute.Intensity === undefined ) ? 1 : lightAttribute.Intensity.value / 100;

			// light disabled
			if ( lightAttribute.CastLightOnObject !== undefined && lightAttribute.CastLightOnObject.value === 0 ) {

				intensity = 0;

			}

			let distance = 0;
			if ( lightAttribute.FarAttenuationEnd !== undefined ) {

				if ( lightAttribute.EnableFarAttenuation !== undefined && lightAttribute.EnableFarAttenuation.value === 0 ) {

					distance = 0;

				} else {

					distance = lightAttribute.FarAttenuationEnd.value;

				}

			}

			// TODO: could this be calculated linearly from FarAttenuationStart to FarAttenuationEnd?
			const decay = 1;

			switch ( type ) {

				case 0: // Point
					model = new three.PointLight( color, intensity, distance, decay );
					break;

				case 1: // Directional
					model = new three.DirectionalLight( color, intensity );
					break;

				case 2: // Spot
					let angle = Math.PI / 3;

					if ( lightAttribute.InnerAngle !== undefined ) {

						angle = three.MathUtils.degToRad( lightAttribute.InnerAngle.value );

					}

					let penumbra = 0;
					if ( lightAttribute.OuterAngle !== undefined ) {

						// TODO: this is not correct - FBX calculates outer and inner angle in degrees
						// with OuterAngle > InnerAngle && OuterAngle <= Math.PI
						// while three.js uses a penumbra between (0, 1) to attenuate the inner angle
						penumbra = three.MathUtils.degToRad( lightAttribute.OuterAngle.value );
						penumbra = Math.max( penumbra, 1 );

					}

					model = new three.SpotLight( color, intensity, distance, angle, penumbra, decay );
					break;

				default:
					console.warn( 'THREE.FBXLoader: Unknown light type ' + lightAttribute.LightType.value + ', defaulting to a PointLight.' );
					model = new three.PointLight( color, intensity );
					break;

			}

			if ( lightAttribute.CastShadows !== undefined && lightAttribute.CastShadows.value === 1 ) {

				model.castShadow = true;

			}

		}

		return model;

	}

	createMesh( relationships, geometryMap, materialMap ) {

		let model;
		let geometry = null;
		let material = null;
		const materials = [];

		// get geometry and materials(s) from connections
		relationships.children.forEach( function ( child ) {

			if ( geometryMap.has( child.ID ) ) {

				geometry = geometryMap.get( child.ID );

			}

			if ( materialMap.has( child.ID ) ) {

				materials.push( materialMap.get( child.ID ) );

			}

		} );

		if ( materials.length > 1 ) {

			material = materials;

		} else if ( materials.length > 0 ) {

			material = materials[ 0 ];

		} else {

			material = new three.MeshPhongMaterial( { color: 0xcccccc } );
			materials.push( material );

		}

		if ( 'color' in geometry.attributes ) {

			materials.forEach( function ( material ) {

				material.vertexColors = true;

			} );

		}

		if ( geometry.FBX_Deformer ) {

			model = new three.SkinnedMesh( geometry, material );
			model.normalizeSkinWeights();

		} else {

			model = new three.Mesh( geometry, material );

		}

		return model;

	}

	createCurve( relationships, geometryMap ) {

		const geometry = relationships.children.reduce( function ( geo, child ) {

			if ( geometryMap.has( child.ID ) ) geo = geometryMap.get( child.ID );

			return geo;

		}, null );

		// FBX does not list materials for Nurbs lines, so we'll just put our own in here.
		const material = new three.LineBasicMaterial( { color: 0x3300ff, linewidth: 1 } );
		return new three.Line( geometry, material );

	}

	// parse the model node for transform data
	getTransformData( model, modelNode ) {

		const transformData = {};

		if ( 'InheritType' in modelNode ) transformData.inheritType = parseInt( modelNode.InheritType.value );

		if ( 'RotationOrder' in modelNode ) transformData.eulerOrder = getEulerOrder( modelNode.RotationOrder.value );
		else transformData.eulerOrder = 'ZYX';

		if ( 'Lcl_Translation' in modelNode ) transformData.translation = modelNode.Lcl_Translation.value;

		if ( 'PreRotation' in modelNode ) transformData.preRotation = modelNode.PreRotation.value;
		if ( 'Lcl_Rotation' in modelNode ) transformData.rotation = modelNode.Lcl_Rotation.value;
		if ( 'PostRotation' in modelNode ) transformData.postRotation = modelNode.PostRotation.value;

		if ( 'Lcl_Scaling' in modelNode ) transformData.scale = modelNode.Lcl_Scaling.value;

		if ( 'ScalingOffset' in modelNode ) transformData.scalingOffset = modelNode.ScalingOffset.value;
		if ( 'ScalingPivot' in modelNode ) transformData.scalingPivot = modelNode.ScalingPivot.value;

		if ( 'RotationOffset' in modelNode ) transformData.rotationOffset = modelNode.RotationOffset.value;
		if ( 'RotationPivot' in modelNode ) transformData.rotationPivot = modelNode.RotationPivot.value;

		model.userData.transformData = transformData;

	}

	setLookAtProperties( model, modelNode ) {

		if ( 'LookAtProperty' in modelNode ) {

			const children = connections.get( model.ID ).children;

			children.forEach( function ( child ) {

				if ( child.relationship === 'LookAtProperty' ) {

					const lookAtTarget = fbxTree.Objects.Model[ child.ID ];

					if ( 'Lcl_Translation' in lookAtTarget ) {

						const pos = lookAtTarget.Lcl_Translation.value;

						// DirectionalLight, SpotLight
						if ( model.target !== undefined ) {

							model.target.position.fromArray( pos );
							sceneGraph.add( model.target );

						} else { // Cameras and other Object3Ds

							model.lookAt( new three.Vector3().fromArray( pos ) );

						}

					}

				}

			} );

		}

	}

	bindSkeleton( skeletons, geometryMap, modelMap ) {

		const bindMatrices = this.parsePoseNodes();

		for ( const ID in skeletons ) {

			const skeleton = skeletons[ ID ];

			const parents = connections.get( parseInt( skeleton.ID ) ).parents;

			parents.forEach( function ( parent ) {

				if ( geometryMap.has( parent.ID ) ) {

					const geoID = parent.ID;
					const geoRelationships = connections.get( geoID );

					geoRelationships.parents.forEach( function ( geoConnParent ) {

						if ( modelMap.has( geoConnParent.ID ) ) {

							const model = modelMap.get( geoConnParent.ID );

							model.bind( new three.Skeleton( skeleton.bones ), bindMatrices[ geoConnParent.ID ] );

						}

					} );

				}

			} );

		}

	}

	parsePoseNodes() {

		const bindMatrices = {};

		if ( 'Pose' in fbxTree.Objects ) {

			const BindPoseNode = fbxTree.Objects.Pose;

			for ( const nodeID in BindPoseNode ) {

				if ( BindPoseNode[ nodeID ].attrType === 'BindPose' ) {

					const poseNodes = BindPoseNode[ nodeID ].PoseNode;

					if ( Array.isArray( poseNodes ) ) {

						poseNodes.forEach( function ( poseNode ) {

							bindMatrices[ poseNode.Node ] = new three.Matrix4().fromArray( poseNode.Matrix.a );

						} );

					} else {

						bindMatrices[ poseNodes.Node ] = new three.Matrix4().fromArray( poseNodes.Matrix.a );

					}

				}

			}

		}

		return bindMatrices;

	}

	// Parse ambient color in FBXTree.GlobalSettings - if it's not set to black (default), create an ambient light
	createAmbientLight() {

		if ( 'GlobalSettings' in fbxTree && 'AmbientColor' in fbxTree.GlobalSettings ) {

			const ambientColor = fbxTree.GlobalSettings.AmbientColor.value;
			const r = ambientColor[ 0 ];
			const g = ambientColor[ 1 ];
			const b = ambientColor[ 2 ];

			if ( r !== 0 || g !== 0 || b !== 0 ) {

				const color = new three.Color( r, g, b );
				sceneGraph.add( new three.AmbientLight( color, 1 ) );

			}

		}

	}

}

// parse Geometry data from FBXTree and return map of BufferGeometries
class GeometryParser$1 {

	// Parse nodes in FBXTree.Objects.Geometry
	parse( deformers ) {

		const geometryMap = new Map();

		if ( 'Geometry' in fbxTree.Objects ) {

			const geoNodes = fbxTree.Objects.Geometry;

			for ( const nodeID in geoNodes ) {

				const relationships = connections.get( parseInt( nodeID ) );
				const geo = this.parseGeometry( relationships, geoNodes[ nodeID ], deformers );

				geometryMap.set( parseInt( nodeID ), geo );

			}

		}

		return geometryMap;

	}

	// Parse single node in FBXTree.Objects.Geometry
	parseGeometry( relationships, geoNode, deformers ) {

		switch ( geoNode.attrType ) {

			case 'Mesh':
				return this.parseMeshGeometry( relationships, geoNode, deformers );

			case 'NurbsCurve':
				return this.parseNurbsGeometry( geoNode );

		}

	}

	// Parse single node mesh geometry in FBXTree.Objects.Geometry
	parseMeshGeometry( relationships, geoNode, deformers ) {

		const skeletons = deformers.skeletons;
		const morphTargets = [];

		const modelNodes = relationships.parents.map( function ( parent ) {

			return fbxTree.Objects.Model[ parent.ID ];

		} );

		// don't create geometry if it is not associated with any models
		if ( modelNodes.length === 0 ) return;

		const skeleton = relationships.children.reduce( function ( skeleton, child ) {

			if ( skeletons[ child.ID ] !== undefined ) skeleton = skeletons[ child.ID ];

			return skeleton;

		}, null );

		relationships.children.forEach( function ( child ) {

			if ( deformers.morphTargets[ child.ID ] !== undefined ) {

				morphTargets.push( deformers.morphTargets[ child.ID ] );

			}

		} );

		// Assume one model and get the preRotation from that
		// if there is more than one model associated with the geometry this may cause problems
		const modelNode = modelNodes[ 0 ];

		const transformData = {};

		if ( 'RotationOrder' in modelNode ) transformData.eulerOrder = getEulerOrder( modelNode.RotationOrder.value );
		if ( 'InheritType' in modelNode ) transformData.inheritType = parseInt( modelNode.InheritType.value );

		if ( 'GeometricTranslation' in modelNode ) transformData.translation = modelNode.GeometricTranslation.value;
		if ( 'GeometricRotation' in modelNode ) transformData.rotation = modelNode.GeometricRotation.value;
		if ( 'GeometricScaling' in modelNode ) transformData.scale = modelNode.GeometricScaling.value;

		const transform = generateTransform( transformData );

		return this.genGeometry( geoNode, skeleton, morphTargets, transform );

	}

	// Generate a BufferGeometry from a node in FBXTree.Objects.Geometry
	genGeometry( geoNode, skeleton, morphTargets, preTransform ) {

		const geo = new three.BufferGeometry();
		if ( geoNode.attrName ) geo.name = geoNode.attrName;

		const geoInfo = this.parseGeoNode( geoNode, skeleton );
		const buffers = this.genBuffers( geoInfo );

		const positionAttribute = new three.Float32BufferAttribute( buffers.vertex, 3 );

		positionAttribute.applyMatrix4( preTransform );

		geo.setAttribute( 'position', positionAttribute );

		if ( buffers.colors.length > 0 ) {

			geo.setAttribute( 'color', new three.Float32BufferAttribute( buffers.colors, 3 ) );

		}

		if ( skeleton ) {

			geo.setAttribute( 'skinIndex', new three.Uint16BufferAttribute( buffers.weightsIndices, 4 ) );

			geo.setAttribute( 'skinWeight', new three.Float32BufferAttribute( buffers.vertexWeights, 4 ) );

			// used later to bind the skeleton to the model
			geo.FBX_Deformer = skeleton;

		}

		if ( buffers.normal.length > 0 ) {

			const normalMatrix = new three.Matrix3().getNormalMatrix( preTransform );

			const normalAttribute = new three.Float32BufferAttribute( buffers.normal, 3 );
			normalAttribute.applyNormalMatrix( normalMatrix );

			geo.setAttribute( 'normal', normalAttribute );

		}

		buffers.uvs.forEach( function ( uvBuffer, i ) {

			// subsequent uv buffers are called 'uv1', 'uv2', ...
			let name = 'uv' + ( i + 1 ).toString();

			// the first uv buffer is just called 'uv'
			if ( i === 0 ) {

				name = 'uv';

			}

			geo.setAttribute( name, new three.Float32BufferAttribute( buffers.uvs[ i ], 2 ) );

		} );

		if ( geoInfo.material && geoInfo.material.mappingType !== 'AllSame' ) {

			// Convert the material indices of each vertex into rendering groups on the geometry.
			let prevMaterialIndex = buffers.materialIndex[ 0 ];
			let startIndex = 0;

			buffers.materialIndex.forEach( function ( currentIndex, i ) {

				if ( currentIndex !== prevMaterialIndex ) {

					geo.addGroup( startIndex, i - startIndex, prevMaterialIndex );

					prevMaterialIndex = currentIndex;
					startIndex = i;

				}

			} );

			// the loop above doesn't add the last group, do that here.
			if ( geo.groups.length > 0 ) {

				const lastGroup = geo.groups[ geo.groups.length - 1 ];
				const lastIndex = lastGroup.start + lastGroup.count;

				if ( lastIndex !== buffers.materialIndex.length ) {

					geo.addGroup( lastIndex, buffers.materialIndex.length - lastIndex, prevMaterialIndex );

				}

			}

			// case where there are multiple materials but the whole geometry is only
			// using one of them
			if ( geo.groups.length === 0 ) {

				geo.addGroup( 0, buffers.materialIndex.length, buffers.materialIndex[ 0 ] );

			}

		}

		this.addMorphTargets( geo, geoNode, morphTargets, preTransform );

		return geo;

	}

	parseGeoNode( geoNode, skeleton ) {

		const geoInfo = {};

		geoInfo.vertexPositions = ( geoNode.Vertices !== undefined ) ? geoNode.Vertices.a : [];
		geoInfo.vertexIndices = ( geoNode.PolygonVertexIndex !== undefined ) ? geoNode.PolygonVertexIndex.a : [];

		if ( geoNode.LayerElementColor ) {

			geoInfo.color = this.parseVertexColors( geoNode.LayerElementColor[ 0 ] );

		}

		if ( geoNode.LayerElementMaterial ) {

			geoInfo.material = this.parseMaterialIndices( geoNode.LayerElementMaterial[ 0 ] );

		}

		if ( geoNode.LayerElementNormal ) {

			geoInfo.normal = this.parseNormals( geoNode.LayerElementNormal[ 0 ] );

		}

		if ( geoNode.LayerElementUV ) {

			geoInfo.uv = [];

			let i = 0;
			while ( geoNode.LayerElementUV[ i ] ) {

				if ( geoNode.LayerElementUV[ i ].UV ) {

					geoInfo.uv.push( this.parseUVs( geoNode.LayerElementUV[ i ] ) );

				}

				i ++;

			}

		}

		geoInfo.weightTable = {};

		if ( skeleton !== null ) {

			geoInfo.skeleton = skeleton;

			skeleton.rawBones.forEach( function ( rawBone, i ) {

				// loop over the bone's vertex indices and weights
				rawBone.indices.forEach( function ( index, j ) {

					if ( geoInfo.weightTable[ index ] === undefined ) geoInfo.weightTable[ index ] = [];

					geoInfo.weightTable[ index ].push( {

						id: i,
						weight: rawBone.weights[ j ],

					} );

				} );

			} );

		}

		return geoInfo;

	}

	genBuffers( geoInfo ) {

		const buffers = {
			vertex: [],
			normal: [],
			colors: [],
			uvs: [],
			materialIndex: [],
			vertexWeights: [],
			weightsIndices: [],
		};

		let polygonIndex = 0;
		let faceLength = 0;
		let displayedWeightsWarning = false;

		// these will hold data for a single face
		let facePositionIndexes = [];
		let faceNormals = [];
		let faceColors = [];
		let faceUVs = [];
		let faceWeights = [];
		let faceWeightIndices = [];

		const scope = this;
		geoInfo.vertexIndices.forEach( function ( vertexIndex, polygonVertexIndex ) {

			let materialIndex;
			let endOfFace = false;

			// Face index and vertex index arrays are combined in a single array
			// A cube with quad faces looks like this:
			// PolygonVertexIndex: *24 {
			//  a: 0, 1, 3, -3, 2, 3, 5, -5, 4, 5, 7, -7, 6, 7, 1, -1, 1, 7, 5, -4, 6, 0, 2, -5
			//  }
			// Negative numbers mark the end of a face - first face here is 0, 1, 3, -3
			// to find index of last vertex bit shift the index: ^ - 1
			if ( vertexIndex < 0 ) {

				vertexIndex = vertexIndex ^ - 1; // equivalent to ( x * -1 ) - 1
				endOfFace = true;

			}

			let weightIndices = [];
			let weights = [];

			facePositionIndexes.push( vertexIndex * 3, vertexIndex * 3 + 1, vertexIndex * 3 + 2 );

			if ( geoInfo.color ) {

				const data = getData( polygonVertexIndex, polygonIndex, vertexIndex, geoInfo.color );

				faceColors.push( data[ 0 ], data[ 1 ], data[ 2 ] );

			}

			if ( geoInfo.skeleton ) {

				if ( geoInfo.weightTable[ vertexIndex ] !== undefined ) {

					geoInfo.weightTable[ vertexIndex ].forEach( function ( wt ) {

						weights.push( wt.weight );
						weightIndices.push( wt.id );

					} );


				}

				if ( weights.length > 4 ) {

					if ( ! displayedWeightsWarning ) {

						console.warn( 'THREE.FBXLoader: Vertex has more than 4 skinning weights assigned to vertex. Deleting additional weights.' );
						displayedWeightsWarning = true;

					}

					const wIndex = [ 0, 0, 0, 0 ];
					const Weight = [ 0, 0, 0, 0 ];

					weights.forEach( function ( weight, weightIndex ) {

						let currentWeight = weight;
						let currentIndex = weightIndices[ weightIndex ];

						Weight.forEach( function ( comparedWeight, comparedWeightIndex, comparedWeightArray ) {

							if ( currentWeight > comparedWeight ) {

								comparedWeightArray[ comparedWeightIndex ] = currentWeight;
								currentWeight = comparedWeight;

								const tmp = wIndex[ comparedWeightIndex ];
								wIndex[ comparedWeightIndex ] = currentIndex;
								currentIndex = tmp;

							}

						} );

					} );

					weightIndices = wIndex;
					weights = Weight;

				}

				// if the weight array is shorter than 4 pad with 0s
				while ( weights.length < 4 ) {

					weights.push( 0 );
					weightIndices.push( 0 );

				}

				for ( let i = 0; i < 4; ++ i ) {

					faceWeights.push( weights[ i ] );
					faceWeightIndices.push( weightIndices[ i ] );

				}

			}

			if ( geoInfo.normal ) {

				const data = getData( polygonVertexIndex, polygonIndex, vertexIndex, geoInfo.normal );

				faceNormals.push( data[ 0 ], data[ 1 ], data[ 2 ] );

			}

			if ( geoInfo.material && geoInfo.material.mappingType !== 'AllSame' ) {

				materialIndex = getData( polygonVertexIndex, polygonIndex, vertexIndex, geoInfo.material )[ 0 ];

			}

			if ( geoInfo.uv ) {

				geoInfo.uv.forEach( function ( uv, i ) {

					const data = getData( polygonVertexIndex, polygonIndex, vertexIndex, uv );

					if ( faceUVs[ i ] === undefined ) {

						faceUVs[ i ] = [];

					}

					faceUVs[ i ].push( data[ 0 ] );
					faceUVs[ i ].push( data[ 1 ] );

				} );

			}

			faceLength ++;

			if ( endOfFace ) {

				scope.genFace( buffers, geoInfo, facePositionIndexes, materialIndex, faceNormals, faceColors, faceUVs, faceWeights, faceWeightIndices, faceLength );

				polygonIndex ++;
				faceLength = 0;

				// reset arrays for the next face
				facePositionIndexes = [];
				faceNormals = [];
				faceColors = [];
				faceUVs = [];
				faceWeights = [];
				faceWeightIndices = [];

			}

		} );

		return buffers;

	}

	// Generate data for a single face in a geometry. If the face is a quad then split it into 2 tris
	genFace( buffers, geoInfo, facePositionIndexes, materialIndex, faceNormals, faceColors, faceUVs, faceWeights, faceWeightIndices, faceLength ) {

		for ( let i = 2; i < faceLength; i ++ ) {

			buffers.vertex.push( geoInfo.vertexPositions[ facePositionIndexes[ 0 ] ] );
			buffers.vertex.push( geoInfo.vertexPositions[ facePositionIndexes[ 1 ] ] );
			buffers.vertex.push( geoInfo.vertexPositions[ facePositionIndexes[ 2 ] ] );

			buffers.vertex.push( geoInfo.vertexPositions[ facePositionIndexes[ ( i - 1 ) * 3 ] ] );
			buffers.vertex.push( geoInfo.vertexPositions[ facePositionIndexes[ ( i - 1 ) * 3 + 1 ] ] );
			buffers.vertex.push( geoInfo.vertexPositions[ facePositionIndexes[ ( i - 1 ) * 3 + 2 ] ] );

			buffers.vertex.push( geoInfo.vertexPositions[ facePositionIndexes[ i * 3 ] ] );
			buffers.vertex.push( geoInfo.vertexPositions[ facePositionIndexes[ i * 3 + 1 ] ] );
			buffers.vertex.push( geoInfo.vertexPositions[ facePositionIndexes[ i * 3 + 2 ] ] );

			if ( geoInfo.skeleton ) {

				buffers.vertexWeights.push( faceWeights[ 0 ] );
				buffers.vertexWeights.push( faceWeights[ 1 ] );
				buffers.vertexWeights.push( faceWeights[ 2 ] );
				buffers.vertexWeights.push( faceWeights[ 3 ] );

				buffers.vertexWeights.push( faceWeights[ ( i - 1 ) * 4 ] );
				buffers.vertexWeights.push( faceWeights[ ( i - 1 ) * 4 + 1 ] );
				buffers.vertexWeights.push( faceWeights[ ( i - 1 ) * 4 + 2 ] );
				buffers.vertexWeights.push( faceWeights[ ( i - 1 ) * 4 + 3 ] );

				buffers.vertexWeights.push( faceWeights[ i * 4 ] );
				buffers.vertexWeights.push( faceWeights[ i * 4 + 1 ] );
				buffers.vertexWeights.push( faceWeights[ i * 4 + 2 ] );
				buffers.vertexWeights.push( faceWeights[ i * 4 + 3 ] );

				buffers.weightsIndices.push( faceWeightIndices[ 0 ] );
				buffers.weightsIndices.push( faceWeightIndices[ 1 ] );
				buffers.weightsIndices.push( faceWeightIndices[ 2 ] );
				buffers.weightsIndices.push( faceWeightIndices[ 3 ] );

				buffers.weightsIndices.push( faceWeightIndices[ ( i - 1 ) * 4 ] );
				buffers.weightsIndices.push( faceWeightIndices[ ( i - 1 ) * 4 + 1 ] );
				buffers.weightsIndices.push( faceWeightIndices[ ( i - 1 ) * 4 + 2 ] );
				buffers.weightsIndices.push( faceWeightIndices[ ( i - 1 ) * 4 + 3 ] );

				buffers.weightsIndices.push( faceWeightIndices[ i * 4 ] );
				buffers.weightsIndices.push( faceWeightIndices[ i * 4 + 1 ] );
				buffers.weightsIndices.push( faceWeightIndices[ i * 4 + 2 ] );
				buffers.weightsIndices.push( faceWeightIndices[ i * 4 + 3 ] );

			}

			if ( geoInfo.color ) {

				buffers.colors.push( faceColors[ 0 ] );
				buffers.colors.push( faceColors[ 1 ] );
				buffers.colors.push( faceColors[ 2 ] );

				buffers.colors.push( faceColors[ ( i - 1 ) * 3 ] );
				buffers.colors.push( faceColors[ ( i - 1 ) * 3 + 1 ] );
				buffers.colors.push( faceColors[ ( i - 1 ) * 3 + 2 ] );

				buffers.colors.push( faceColors[ i * 3 ] );
				buffers.colors.push( faceColors[ i * 3 + 1 ] );
				buffers.colors.push( faceColors[ i * 3 + 2 ] );

			}

			if ( geoInfo.material && geoInfo.material.mappingType !== 'AllSame' ) {

				buffers.materialIndex.push( materialIndex );
				buffers.materialIndex.push( materialIndex );
				buffers.materialIndex.push( materialIndex );

			}

			if ( geoInfo.normal ) {

				buffers.normal.push( faceNormals[ 0 ] );
				buffers.normal.push( faceNormals[ 1 ] );
				buffers.normal.push( faceNormals[ 2 ] );

				buffers.normal.push( faceNormals[ ( i - 1 ) * 3 ] );
				buffers.normal.push( faceNormals[ ( i - 1 ) * 3 + 1 ] );
				buffers.normal.push( faceNormals[ ( i - 1 ) * 3 + 2 ] );

				buffers.normal.push( faceNormals[ i * 3 ] );
				buffers.normal.push( faceNormals[ i * 3 + 1 ] );
				buffers.normal.push( faceNormals[ i * 3 + 2 ] );

			}

			if ( geoInfo.uv ) {

				geoInfo.uv.forEach( function ( uv, j ) {

					if ( buffers.uvs[ j ] === undefined ) buffers.uvs[ j ] = [];

					buffers.uvs[ j ].push( faceUVs[ j ][ 0 ] );
					buffers.uvs[ j ].push( faceUVs[ j ][ 1 ] );

					buffers.uvs[ j ].push( faceUVs[ j ][ ( i - 1 ) * 2 ] );
					buffers.uvs[ j ].push( faceUVs[ j ][ ( i - 1 ) * 2 + 1 ] );

					buffers.uvs[ j ].push( faceUVs[ j ][ i * 2 ] );
					buffers.uvs[ j ].push( faceUVs[ j ][ i * 2 + 1 ] );

				} );

			}

		}

	}

	addMorphTargets( parentGeo, parentGeoNode, morphTargets, preTransform ) {

		if ( morphTargets.length === 0 ) return;

		parentGeo.morphTargetsRelative = true;

		parentGeo.morphAttributes.position = [];
		// parentGeo.morphAttributes.normal = []; // not implemented

		const scope = this;
		morphTargets.forEach( function ( morphTarget ) {

			morphTarget.rawTargets.forEach( function ( rawTarget ) {

				const morphGeoNode = fbxTree.Objects.Geometry[ rawTarget.geoID ];

				if ( morphGeoNode !== undefined ) {

					scope.genMorphGeometry( parentGeo, parentGeoNode, morphGeoNode, preTransform, rawTarget.name );

				}

			} );

		} );

	}

	// a morph geometry node is similar to a standard  node, and the node is also contained
	// in FBXTree.Objects.Geometry, however it can only have attributes for position, normal
	// and a special attribute Index defining which vertices of the original geometry are affected
	// Normal and position attributes only have data for the vertices that are affected by the morph
	genMorphGeometry( parentGeo, parentGeoNode, morphGeoNode, preTransform, name ) {

		const vertexIndices = ( parentGeoNode.PolygonVertexIndex !== undefined ) ? parentGeoNode.PolygonVertexIndex.a : [];

		const morphPositionsSparse = ( morphGeoNode.Vertices !== undefined ) ? morphGeoNode.Vertices.a : [];
		const indices = ( morphGeoNode.Indexes !== undefined ) ? morphGeoNode.Indexes.a : [];

		const length = parentGeo.attributes.position.count * 3;
		const morphPositions = new Float32Array( length );

		for ( let i = 0; i < indices.length; i ++ ) {

			const morphIndex = indices[ i ] * 3;

			morphPositions[ morphIndex ] = morphPositionsSparse[ i * 3 ];
			morphPositions[ morphIndex + 1 ] = morphPositionsSparse[ i * 3 + 1 ];
			morphPositions[ morphIndex + 2 ] = morphPositionsSparse[ i * 3 + 2 ];

		}

		// TODO: add morph normal support
		const morphGeoInfo = {
			vertexIndices: vertexIndices,
			vertexPositions: morphPositions,

		};

		const morphBuffers = this.genBuffers( morphGeoInfo );

		const positionAttribute = new three.Float32BufferAttribute( morphBuffers.vertex, 3 );
		positionAttribute.name = name || morphGeoNode.attrName;

		positionAttribute.applyMatrix4( preTransform );

		parentGeo.morphAttributes.position.push( positionAttribute );

	}

	// Parse normal from FBXTree.Objects.Geometry.LayerElementNormal if it exists
	parseNormals( NormalNode ) {

		const mappingType = NormalNode.MappingInformationType;
		const referenceType = NormalNode.ReferenceInformationType;
		const buffer = NormalNode.Normals.a;
		let indexBuffer = [];
		if ( referenceType === 'IndexToDirect' ) {

			if ( 'NormalIndex' in NormalNode ) {

				indexBuffer = NormalNode.NormalIndex.a;

			} else if ( 'NormalsIndex' in NormalNode ) {

				indexBuffer = NormalNode.NormalsIndex.a;

			}

		}

		return {
			dataSize: 3,
			buffer: buffer,
			indices: indexBuffer,
			mappingType: mappingType,
			referenceType: referenceType
		};

	}

	// Parse UVs from FBXTree.Objects.Geometry.LayerElementUV if it exists
	parseUVs( UVNode ) {

		const mappingType = UVNode.MappingInformationType;
		const referenceType = UVNode.ReferenceInformationType;
		const buffer = UVNode.UV.a;
		let indexBuffer = [];
		if ( referenceType === 'IndexToDirect' ) {

			indexBuffer = UVNode.UVIndex.a;

		}

		return {
			dataSize: 2,
			buffer: buffer,
			indices: indexBuffer,
			mappingType: mappingType,
			referenceType: referenceType
		};

	}

	// Parse Vertex Colors from FBXTree.Objects.Geometry.LayerElementColor if it exists
	parseVertexColors( ColorNode ) {

		const mappingType = ColorNode.MappingInformationType;
		const referenceType = ColorNode.ReferenceInformationType;
		const buffer = ColorNode.Colors.a;
		let indexBuffer = [];
		if ( referenceType === 'IndexToDirect' ) {

			indexBuffer = ColorNode.ColorIndex.a;

		}

		return {
			dataSize: 4,
			buffer: buffer,
			indices: indexBuffer,
			mappingType: mappingType,
			referenceType: referenceType
		};

	}

	// Parse mapping and material data in FBXTree.Objects.Geometry.LayerElementMaterial if it exists
	parseMaterialIndices( MaterialNode ) {

		const mappingType = MaterialNode.MappingInformationType;
		const referenceType = MaterialNode.ReferenceInformationType;

		if ( mappingType === 'NoMappingInformation' ) {

			return {
				dataSize: 1,
				buffer: [ 0 ],
				indices: [ 0 ],
				mappingType: 'AllSame',
				referenceType: referenceType
			};

		}

		const materialIndexBuffer = MaterialNode.Materials.a;

		// Since materials are stored as indices, there's a bit of a mismatch between FBX and what
		// we expect.So we create an intermediate buffer that points to the index in the buffer,
		// for conforming with the other functions we've written for other data.
		const materialIndices = [];

		for ( let i = 0; i < materialIndexBuffer.length; ++ i ) {

			materialIndices.push( i );

		}

		return {
			dataSize: 1,
			buffer: materialIndexBuffer,
			indices: materialIndices,
			mappingType: mappingType,
			referenceType: referenceType
		};

	}

	// Generate a NurbGeometry from a node in FBXTree.Objects.Geometry
	parseNurbsGeometry( geoNode ) {

		if ( NURBSCurve === undefined ) {

			console.error( 'THREE.FBXLoader: The loader relies on NURBSCurve for any nurbs present in the model. Nurbs will show up as empty geometry.' );
			return new three.BufferGeometry();

		}

		const order = parseInt( geoNode.Order );

		if ( isNaN( order ) ) {

			console.error( 'THREE.FBXLoader: Invalid Order %s given for geometry ID: %s', geoNode.Order, geoNode.id );
			return new three.BufferGeometry();

		}

		const degree = order - 1;

		const knots = geoNode.KnotVector.a;
		const controlPoints = [];
		const pointsValues = geoNode.Points.a;

		for ( let i = 0, l = pointsValues.length; i < l; i += 4 ) {

			controlPoints.push( new three.Vector4().fromArray( pointsValues, i ) );

		}

		let startKnot, endKnot;

		if ( geoNode.Form === 'Closed' ) {

			controlPoints.push( controlPoints[ 0 ] );

		} else if ( geoNode.Form === 'Periodic' ) {

			startKnot = degree;
			endKnot = knots.length - 1 - startKnot;

			for ( let i = 0; i < degree; ++ i ) {

				controlPoints.push( controlPoints[ i ] );

			}

		}

		const curve = new NURBSCurve( degree, knots, controlPoints, startKnot, endKnot );
		const points = curve.getPoints( controlPoints.length * 12 );

		return new three.BufferGeometry().setFromPoints( points );

	}

}

// parse animation data from FBXTree
class AnimationParser {

	// take raw animation clips and turn them into three.js animation clips
	parse() {

		const animationClips = [];

		const rawClips = this.parseClips();

		if ( rawClips !== undefined ) {

			for ( const key in rawClips ) {

				const rawClip = rawClips[ key ];

				const clip = this.addClip( rawClip );

				animationClips.push( clip );

			}

		}

		return animationClips;

	}

	parseClips() {

		// since the actual transformation data is stored in FBXTree.Objects.AnimationCurve,
		// if this is undefined we can safely assume there are no animations
		if ( fbxTree.Objects.AnimationCurve === undefined ) return undefined;

		const curveNodesMap = this.parseAnimationCurveNodes();

		this.parseAnimationCurves( curveNodesMap );

		const layersMap = this.parseAnimationLayers( curveNodesMap );
		const rawClips = this.parseAnimStacks( layersMap );

		return rawClips;

	}

	// parse nodes in FBXTree.Objects.AnimationCurveNode
	// each AnimationCurveNode holds data for an animation transform for a model (e.g. left arm rotation )
	// and is referenced by an AnimationLayer
	parseAnimationCurveNodes() {

		const rawCurveNodes = fbxTree.Objects.AnimationCurveNode;

		const curveNodesMap = new Map();

		for ( const nodeID in rawCurveNodes ) {

			const rawCurveNode = rawCurveNodes[ nodeID ];

			if ( rawCurveNode.attrName.match( /S|R|T|DeformPercent/ ) !== null ) {

				const curveNode = {

					id: rawCurveNode.id,
					attr: rawCurveNode.attrName,
					curves: {},

				};

				curveNodesMap.set( curveNode.id, curveNode );

			}

		}

		return curveNodesMap;

	}

	// parse nodes in FBXTree.Objects.AnimationCurve and connect them up to
	// previously parsed AnimationCurveNodes. Each AnimationCurve holds data for a single animated
	// axis ( e.g. times and values of x rotation)
	parseAnimationCurves( curveNodesMap ) {

		const rawCurves = fbxTree.Objects.AnimationCurve;

		// TODO: Many values are identical up to roundoff error, but won't be optimised
		// e.g. position times: [0, 0.4, 0. 8]
		// position values: [7.23538335023477e-7, 93.67518615722656, -0.9982695579528809, 7.23538335023477e-7, 93.67518615722656, -0.9982695579528809, 7.235384487103147e-7, 93.67520904541016, -0.9982695579528809]
		// clearly, this should be optimised to
		// times: [0], positions [7.23538335023477e-7, 93.67518615722656, -0.9982695579528809]
		// this shows up in nearly every FBX file, and generally time array is length > 100

		for ( const nodeID in rawCurves ) {

			const animationCurve = {

				id: rawCurves[ nodeID ].id,
				times: rawCurves[ nodeID ].KeyTime.a.map( convertFBXTimeToSeconds ),
				values: rawCurves[ nodeID ].KeyValueFloat.a,

			};

			const relationships = connections.get( animationCurve.id );

			if ( relationships !== undefined ) {

				const animationCurveID = relationships.parents[ 0 ].ID;
				const animationCurveRelationship = relationships.parents[ 0 ].relationship;

				if ( animationCurveRelationship.match( /X/ ) ) {

					curveNodesMap.get( animationCurveID ).curves[ 'x' ] = animationCurve;

				} else if ( animationCurveRelationship.match( /Y/ ) ) {

					curveNodesMap.get( animationCurveID ).curves[ 'y' ] = animationCurve;

				} else if ( animationCurveRelationship.match( /Z/ ) ) {

					curveNodesMap.get( animationCurveID ).curves[ 'z' ] = animationCurve;

				} else if ( animationCurveRelationship.match( /d|DeformPercent/ ) && curveNodesMap.has( animationCurveID ) ) {

					curveNodesMap.get( animationCurveID ).curves[ 'morph' ] = animationCurve;

				}

			}

		}

	}

	// parse nodes in FBXTree.Objects.AnimationLayer. Each layers holds references
	// to various AnimationCurveNodes and is referenced by an AnimationStack node
	// note: theoretically a stack can have multiple layers, however in practice there always seems to be one per stack
	parseAnimationLayers( curveNodesMap ) {

		const rawLayers = fbxTree.Objects.AnimationLayer;

		const layersMap = new Map();

		for ( const nodeID in rawLayers ) {

			const layerCurveNodes = [];

			const connection = connections.get( parseInt( nodeID ) );

			if ( connection !== undefined ) {

				// all the animationCurveNodes used in the layer
				const children = connection.children;

				children.forEach( function ( child, i ) {

					if ( curveNodesMap.has( child.ID ) ) {

						const curveNode = curveNodesMap.get( child.ID );

						// check that the curves are defined for at least one axis, otherwise ignore the curveNode
						if ( curveNode.curves.x !== undefined || curveNode.curves.y !== undefined || curveNode.curves.z !== undefined ) {

							if ( layerCurveNodes[ i ] === undefined ) {

								const modelID = connections.get( child.ID ).parents.filter( function ( parent ) {

									return parent.relationship !== undefined;

								} )[ 0 ].ID;

								if ( modelID !== undefined ) {

									const rawModel = fbxTree.Objects.Model[ modelID.toString() ];

									if ( rawModel === undefined ) {

										console.warn( 'THREE.FBXLoader: Encountered a unused curve.', child );
										return;

									}

									const node = {

										modelName: rawModel.attrName ? three.PropertyBinding.sanitizeNodeName( rawModel.attrName ) : '',
										ID: rawModel.id,
										initialPosition: [ 0, 0, 0 ],
										initialRotation: [ 0, 0, 0 ],
										initialScale: [ 1, 1, 1 ],

									};

									sceneGraph.traverse( function ( child ) {

										if ( child.ID === rawModel.id ) {

											node.transform = child.matrix;

											if ( child.userData.transformData ) node.eulerOrder = child.userData.transformData.eulerOrder;

										}

									} );

									if ( ! node.transform ) node.transform = new three.Matrix4();

									// if the animated model is pre rotated, we'll have to apply the pre rotations to every
									// animation value as well
									if ( 'PreRotation' in rawModel ) node.preRotation = rawModel.PreRotation.value;
									if ( 'PostRotation' in rawModel ) node.postRotation = rawModel.PostRotation.value;

									layerCurveNodes[ i ] = node;

								}

							}

							if ( layerCurveNodes[ i ] ) layerCurveNodes[ i ][ curveNode.attr ] = curveNode;

						} else if ( curveNode.curves.morph !== undefined ) {

							if ( layerCurveNodes[ i ] === undefined ) {

								const deformerID = connections.get( child.ID ).parents.filter( function ( parent ) {

									return parent.relationship !== undefined;

								} )[ 0 ].ID;

								const morpherID = connections.get( deformerID ).parents[ 0 ].ID;
								const geoID = connections.get( morpherID ).parents[ 0 ].ID;

								// assuming geometry is not used in more than one model
								const modelID = connections.get( geoID ).parents[ 0 ].ID;

								const rawModel = fbxTree.Objects.Model[ modelID ];

								const node = {

									modelName: rawModel.attrName ? three.PropertyBinding.sanitizeNodeName( rawModel.attrName ) : '',
									morphName: fbxTree.Objects.Deformer[ deformerID ].attrName,

								};

								layerCurveNodes[ i ] = node;

							}

							layerCurveNodes[ i ][ curveNode.attr ] = curveNode;

						}

					}

				} );

				layersMap.set( parseInt( nodeID ), layerCurveNodes );

			}

		}

		return layersMap;

	}

	// parse nodes in FBXTree.Objects.AnimationStack. These are the top level node in the animation
	// hierarchy. Each Stack node will be used to create a AnimationClip
	parseAnimStacks( layersMap ) {

		const rawStacks = fbxTree.Objects.AnimationStack;

		// connect the stacks (clips) up to the layers
		const rawClips = {};

		for ( const nodeID in rawStacks ) {

			const children = connections.get( parseInt( nodeID ) ).children;

			if ( children.length > 1 ) {

				// it seems like stacks will always be associated with a single layer. But just in case there are files
				// where there are multiple layers per stack, we'll display a warning
				console.warn( 'THREE.FBXLoader: Encountered an animation stack with multiple layers, this is currently not supported. Ignoring subsequent layers.' );

			}

			const layer = layersMap.get( children[ 0 ].ID );

			rawClips[ nodeID ] = {

				name: rawStacks[ nodeID ].attrName,
				layer: layer,

			};

		}

		return rawClips;

	}

	addClip( rawClip ) {

		let tracks = [];

		const scope = this;
		rawClip.layer.forEach( function ( rawTracks ) {

			tracks = tracks.concat( scope.generateTracks( rawTracks ) );

		} );

		return new three.AnimationClip( rawClip.name, - 1, tracks );

	}

	generateTracks( rawTracks ) {

		const tracks = [];

		let initialPosition = new three.Vector3();
		let initialRotation = new three.Quaternion();
		let initialScale = new three.Vector3();

		if ( rawTracks.transform ) rawTracks.transform.decompose( initialPosition, initialRotation, initialScale );

		initialPosition = initialPosition.toArray();
		initialRotation = new three.Euler().setFromQuaternion( initialRotation, rawTracks.eulerOrder ).toArray();
		initialScale = initialScale.toArray();

		if ( rawTracks.T !== undefined && Object.keys( rawTracks.T.curves ).length > 0 ) {

			const positionTrack = this.generateVectorTrack( rawTracks.modelName, rawTracks.T.curves, initialPosition, 'position' );
			if ( positionTrack !== undefined ) tracks.push( positionTrack );

		}

		if ( rawTracks.R !== undefined && Object.keys( rawTracks.R.curves ).length > 0 ) {

			const rotationTrack = this.generateRotationTrack( rawTracks.modelName, rawTracks.R.curves, initialRotation, rawTracks.preRotation, rawTracks.postRotation, rawTracks.eulerOrder );
			if ( rotationTrack !== undefined ) tracks.push( rotationTrack );

		}

		if ( rawTracks.S !== undefined && Object.keys( rawTracks.S.curves ).length > 0 ) {

			const scaleTrack = this.generateVectorTrack( rawTracks.modelName, rawTracks.S.curves, initialScale, 'scale' );
			if ( scaleTrack !== undefined ) tracks.push( scaleTrack );

		}

		if ( rawTracks.DeformPercent !== undefined ) {

			const morphTrack = this.generateMorphTrack( rawTracks );
			if ( morphTrack !== undefined ) tracks.push( morphTrack );

		}

		return tracks;

	}

	generateVectorTrack( modelName, curves, initialValue, type ) {

		const times = this.getTimesForAllAxes( curves );
		const values = this.getKeyframeTrackValues( times, curves, initialValue );

		return new three.VectorKeyframeTrack( modelName + '.' + type, times, values );

	}

	generateRotationTrack( modelName, curves, initialValue, preRotation, postRotation, eulerOrder ) {

		if ( curves.x !== undefined ) {

			this.interpolateRotations( curves.x );
			curves.x.values = curves.x.values.map( three.MathUtils.degToRad );

		}

		if ( curves.y !== undefined ) {

			this.interpolateRotations( curves.y );
			curves.y.values = curves.y.values.map( three.MathUtils.degToRad );

		}

		if ( curves.z !== undefined ) {

			this.interpolateRotations( curves.z );
			curves.z.values = curves.z.values.map( three.MathUtils.degToRad );

		}

		const times = this.getTimesForAllAxes( curves );
		const values = this.getKeyframeTrackValues( times, curves, initialValue );

		if ( preRotation !== undefined ) {

			preRotation = preRotation.map( three.MathUtils.degToRad );
			preRotation.push( eulerOrder );

			preRotation = new three.Euler().fromArray( preRotation );
			preRotation = new three.Quaternion().setFromEuler( preRotation );

		}

		if ( postRotation !== undefined ) {

			postRotation = postRotation.map( three.MathUtils.degToRad );
			postRotation.push( eulerOrder );

			postRotation = new three.Euler().fromArray( postRotation );
			postRotation = new three.Quaternion().setFromEuler( postRotation ).invert();

		}

		const quaternion = new three.Quaternion();
		const euler = new three.Euler();

		const quaternionValues = [];

		for ( let i = 0; i < values.length; i += 3 ) {

			euler.set( values[ i ], values[ i + 1 ], values[ i + 2 ], eulerOrder );

			quaternion.setFromEuler( euler );

			if ( preRotation !== undefined ) quaternion.premultiply( preRotation );
			if ( postRotation !== undefined ) quaternion.multiply( postRotation );

			quaternion.toArray( quaternionValues, ( i / 3 ) * 4 );

		}

		return new three.QuaternionKeyframeTrack( modelName + '.quaternion', times, quaternionValues );

	}

	generateMorphTrack( rawTracks ) {

		const curves = rawTracks.DeformPercent.curves.morph;
		const values = curves.values.map( function ( val ) {

			return val / 100;

		} );

		const morphNum = sceneGraph.getObjectByName( rawTracks.modelName ).morphTargetDictionary[ rawTracks.morphName ];

		return new three.NumberKeyframeTrack( rawTracks.modelName + '.morphTargetInfluences[' + morphNum + ']', curves.times, values );

	}

	// For all animated objects, times are defined separately for each axis
	// Here we'll combine the times into one sorted array without duplicates
	getTimesForAllAxes( curves ) {

		let times = [];

		// first join together the times for each axis, if defined
		if ( curves.x !== undefined ) times = times.concat( curves.x.times );
		if ( curves.y !== undefined ) times = times.concat( curves.y.times );
		if ( curves.z !== undefined ) times = times.concat( curves.z.times );

		// then sort them
		times = times.sort( function ( a, b ) {

			return a - b;

		} );

		// and remove duplicates
		if ( times.length > 1 ) {

			let targetIndex = 1;
			let lastValue = times[ 0 ];
			for ( let i = 1; i < times.length; i ++ ) {

				const currentValue = times[ i ];
				if ( currentValue !== lastValue ) {

					times[ targetIndex ] = currentValue;
					lastValue = currentValue;
					targetIndex ++;

				}

			}

			times = times.slice( 0, targetIndex );

		}

		return times;

	}

	getKeyframeTrackValues( times, curves, initialValue ) {

		const prevValue = initialValue;

		const values = [];

		let xIndex = - 1;
		let yIndex = - 1;
		let zIndex = - 1;

		times.forEach( function ( time ) {

			if ( curves.x ) xIndex = curves.x.times.indexOf( time );
			if ( curves.y ) yIndex = curves.y.times.indexOf( time );
			if ( curves.z ) zIndex = curves.z.times.indexOf( time );

			// if there is an x value defined for this frame, use that
			if ( xIndex !== - 1 ) {

				const xValue = curves.x.values[ xIndex ];
				values.push( xValue );
				prevValue[ 0 ] = xValue;

			} else {

				// otherwise use the x value from the previous frame
				values.push( prevValue[ 0 ] );

			}

			if ( yIndex !== - 1 ) {

				const yValue = curves.y.values[ yIndex ];
				values.push( yValue );
				prevValue[ 1 ] = yValue;

			} else {

				values.push( prevValue[ 1 ] );

			}

			if ( zIndex !== - 1 ) {

				const zValue = curves.z.values[ zIndex ];
				values.push( zValue );
				prevValue[ 2 ] = zValue;

			} else {

				values.push( prevValue[ 2 ] );

			}

		} );

		return values;

	}

	// Rotations are defined as Euler angles which can have values  of any size
	// These will be converted to quaternions which don't support values greater than
	// PI, so we'll interpolate large rotations
	interpolateRotations( curve ) {

		for ( let i = 1; i < curve.values.length; i ++ ) {

			const initialValue = curve.values[ i - 1 ];
			const valuesSpan = curve.values[ i ] - initialValue;

			const absoluteSpan = Math.abs( valuesSpan );

			if ( absoluteSpan >= 180 ) {

				const numSubIntervals = absoluteSpan / 180;

				const step = valuesSpan / numSubIntervals;
				let nextValue = initialValue + step;

				const initialTime = curve.times[ i - 1 ];
				const timeSpan = curve.times[ i ] - initialTime;
				const interval = timeSpan / numSubIntervals;
				let nextTime = initialTime + interval;

				const interpolatedTimes = [];
				const interpolatedValues = [];

				while ( nextTime < curve.times[ i ] ) {

					interpolatedTimes.push( nextTime );
					nextTime += interval;

					interpolatedValues.push( nextValue );
					nextValue += step;

				}

				curve.times = inject( curve.times, i, interpolatedTimes );
				curve.values = inject( curve.values, i, interpolatedValues );

			}

		}

	}

}

// parse an FBX file in ASCII format
class TextParser {

	getPrevNode() {

		return this.nodeStack[ this.currentIndent - 2 ];

	}

	getCurrentNode() {

		return this.nodeStack[ this.currentIndent - 1 ];

	}

	getCurrentProp() {

		return this.currentProp;

	}

	pushStack( node ) {

		this.nodeStack.push( node );
		this.currentIndent += 1;

	}

	popStack() {

		this.nodeStack.pop();
		this.currentIndent -= 1;

	}

	setCurrentProp( val, name ) {

		this.currentProp = val;
		this.currentPropName = name;

	}

	parse( text ) {

		this.currentIndent = 0;

		this.allNodes = new FBXTree();
		this.nodeStack = [];
		this.currentProp = [];
		this.currentPropName = '';

		const scope = this;

		const split = text.split( /[\r\n]+/ );

		split.forEach( function ( line, i ) {

			const matchComment = line.match( /^[\s\t]*;/ );
			const matchEmpty = line.match( /^[\s\t]*$/ );

			if ( matchComment || matchEmpty ) return;

			const matchBeginning = line.match( '^\\t{' + scope.currentIndent + '}(\\w+):(.*){', '' );
			const matchProperty = line.match( '^\\t{' + ( scope.currentIndent ) + '}(\\w+):[\\s\\t\\r\\n](.*)' );
			const matchEnd = line.match( '^\\t{' + ( scope.currentIndent - 1 ) + '}}' );

			if ( matchBeginning ) {

				scope.parseNodeBegin( line, matchBeginning );

			} else if ( matchProperty ) {

				scope.parseNodeProperty( line, matchProperty, split[ ++ i ] );

			} else if ( matchEnd ) {

				scope.popStack();

			} else if ( line.match( /^[^\s\t}]/ ) ) {

				// large arrays are split over multiple lines terminated with a ',' character
				// if this is encountered the line needs to be joined to the previous line
				scope.parseNodePropertyContinued( line );

			}

		} );

		return this.allNodes;

	}

	parseNodeBegin( line, property ) {

		const nodeName = property[ 1 ].trim().replace( /^"/, '' ).replace( /"$/, '' );

		const nodeAttrs = property[ 2 ].split( ',' ).map( function ( attr ) {

			return attr.trim().replace( /^"/, '' ).replace( /"$/, '' );

		} );

		const node = { name: nodeName };
		const attrs = this.parseNodeAttr( nodeAttrs );

		const currentNode = this.getCurrentNode();

		// a top node
		if ( this.currentIndent === 0 ) {

			this.allNodes.add( nodeName, node );

		} else { // a subnode

			// if the subnode already exists, append it
			if ( nodeName in currentNode ) {

				// special case Pose needs PoseNodes as an array
				if ( nodeName === 'PoseNode' ) {

					currentNode.PoseNode.push( node );

				} else if ( currentNode[ nodeName ].id !== undefined ) {

					currentNode[ nodeName ] = {};
					currentNode[ nodeName ][ currentNode[ nodeName ].id ] = currentNode[ nodeName ];

				}

				if ( attrs.id !== '' ) currentNode[ nodeName ][ attrs.id ] = node;

			} else if ( typeof attrs.id === 'number' ) {

				currentNode[ nodeName ] = {};
				currentNode[ nodeName ][ attrs.id ] = node;

			} else if ( nodeName !== 'Properties70' ) {

				if ( nodeName === 'PoseNode' )	currentNode[ nodeName ] = [ node ];
				else currentNode[ nodeName ] = node;

			}

		}

		if ( typeof attrs.id === 'number' ) node.id = attrs.id;
		if ( attrs.name !== '' ) node.attrName = attrs.name;
		if ( attrs.type !== '' ) node.attrType = attrs.type;

		this.pushStack( node );

	}

	parseNodeAttr( attrs ) {

		let id = attrs[ 0 ];

		if ( attrs[ 0 ] !== '' ) {

			id = parseInt( attrs[ 0 ] );

			if ( isNaN( id ) ) {

				id = attrs[ 0 ];

			}

		}

		let name = '', type = '';

		if ( attrs.length > 1 ) {

			name = attrs[ 1 ].replace( /^(\w+)::/, '' );
			type = attrs[ 2 ];

		}

		return { id: id, name: name, type: type };

	}

	parseNodeProperty( line, property, contentLine ) {

		let propName = property[ 1 ].replace( /^"/, '' ).replace( /"$/, '' ).trim();
		let propValue = property[ 2 ].replace( /^"/, '' ).replace( /"$/, '' ).trim();

		// for special case: base64 image data follows "Content: ," line
		//	Content: ,
		//	 "/9j/4RDaRXhpZgAATU0A..."
		if ( propName === 'Content' && propValue === ',' ) {

			propValue = contentLine.replace( /"/g, '' ).replace( /,$/, '' ).trim();

		}

		const currentNode = this.getCurrentNode();
		const parentName = currentNode.name;

		if ( parentName === 'Properties70' ) {

			this.parseNodeSpecialProperty( line, propName, propValue );
			return;

		}

		// Connections
		if ( propName === 'C' ) {

			const connProps = propValue.split( ',' ).slice( 1 );
			const from = parseInt( connProps[ 0 ] );
			const to = parseInt( connProps[ 1 ] );

			let rest = propValue.split( ',' ).slice( 3 );

			rest = rest.map( function ( elem ) {

				return elem.trim().replace( /^"/, '' );

			} );

			propName = 'connections';
			propValue = [ from, to ];
			append( propValue, rest );

			if ( currentNode[ propName ] === undefined ) {

				currentNode[ propName ] = [];

			}

		}

		// Node
		if ( propName === 'Node' ) currentNode.id = propValue;

		// connections
		if ( propName in currentNode && Array.isArray( currentNode[ propName ] ) ) {

			currentNode[ propName ].push( propValue );

		} else {

			if ( propName !== 'a' ) currentNode[ propName ] = propValue;
			else currentNode.a = propValue;

		}

		this.setCurrentProp( currentNode, propName );

		// convert string to array, unless it ends in ',' in which case more will be added to it
		if ( propName === 'a' && propValue.slice( - 1 ) !== ',' ) {

			currentNode.a = parseNumberArray( propValue );

		}

	}

	parseNodePropertyContinued( line ) {

		const currentNode = this.getCurrentNode();

		currentNode.a += line;

		// if the line doesn't end in ',' we have reached the end of the property value
		// so convert the string to an array
		if ( line.slice( - 1 ) !== ',' ) {

			currentNode.a = parseNumberArray( currentNode.a );

		}

	}

	// parse "Property70"
	parseNodeSpecialProperty( line, propName, propValue ) {

		// split this
		// P: "Lcl Scaling", "Lcl Scaling", "", "A",1,1,1
		// into array like below
		// ["Lcl Scaling", "Lcl Scaling", "", "A", "1,1,1" ]
		const props = propValue.split( '",' ).map( function ( prop ) {

			return prop.trim().replace( /^\"/, '' ).replace( /\s/, '_' );

		} );

		const innerPropName = props[ 0 ];
		const innerPropType1 = props[ 1 ];
		const innerPropType2 = props[ 2 ];
		const innerPropFlag = props[ 3 ];
		let innerPropValue = props[ 4 ];

		// cast values where needed, otherwise leave as strings
		switch ( innerPropType1 ) {

			case 'int':
			case 'enum':
			case 'bool':
			case 'ULongLong':
			case 'double':
			case 'Number':
			case 'FieldOfView':
				innerPropValue = parseFloat( innerPropValue );
				break;

			case 'Color':
			case 'ColorRGB':
			case 'Vector3D':
			case 'Lcl_Translation':
			case 'Lcl_Rotation':
			case 'Lcl_Scaling':
				innerPropValue = parseNumberArray( innerPropValue );
				break;

		}

		// CAUTION: these props must append to parent's parent
		this.getPrevNode()[ innerPropName ] = {

			'type': innerPropType1,
			'type2': innerPropType2,
			'flag': innerPropFlag,
			'value': innerPropValue

		};

		this.setCurrentProp( this.getPrevNode(), innerPropName );

	}

}

// Parse an FBX file in Binary format
class BinaryParser {

	parse( buffer ) {

		const reader = new BinaryReader( buffer );
		reader.skip( 23 ); // skip magic 23 bytes

		const version = reader.getUint32();

		if ( version < 6400 ) {

			throw new Error( 'THREE.FBXLoader: FBX version not supported, FileVersion: ' + version );

		}

		const allNodes = new FBXTree();

		while ( ! this.endOfContent( reader ) ) {

			const node = this.parseNode( reader, version );
			if ( node !== null ) allNodes.add( node.name, node );

		}

		return allNodes;

	}

	// Check if reader has reached the end of content.
	endOfContent( reader ) {

		// footer size: 160bytes + 16-byte alignment padding
		// - 16bytes: magic
		// - padding til 16-byte alignment (at least 1byte?)
		//	(seems like some exporters embed fixed 15 or 16bytes?)
		// - 4bytes: magic
		// - 4bytes: version
		// - 120bytes: zero
		// - 16bytes: magic
		if ( reader.size() % 16 === 0 ) {

			return ( ( reader.getOffset() + 160 + 16 ) & ~ 0xf ) >= reader.size();

		} else {

			return reader.getOffset() + 160 + 16 >= reader.size();

		}

	}

	// recursively parse nodes until the end of the file is reached
	parseNode( reader, version ) {

		const node = {};

		// The first three data sizes depends on version.
		const endOffset = ( version >= 7500 ) ? reader.getUint64() : reader.getUint32();
		const numProperties = ( version >= 7500 ) ? reader.getUint64() : reader.getUint32();

		( version >= 7500 ) ? reader.getUint64() : reader.getUint32(); // the returned propertyListLen is not used

		const nameLen = reader.getUint8();
		const name = reader.getString( nameLen );

		// Regards this node as NULL-record if endOffset is zero
		if ( endOffset === 0 ) return null;

		const propertyList = [];

		for ( let i = 0; i < numProperties; i ++ ) {

			propertyList.push( this.parseProperty( reader ) );

		}

		// Regards the first three elements in propertyList as id, attrName, and attrType
		const id = propertyList.length > 0 ? propertyList[ 0 ] : '';
		const attrName = propertyList.length > 1 ? propertyList[ 1 ] : '';
		const attrType = propertyList.length > 2 ? propertyList[ 2 ] : '';

		// check if this node represents just a single property
		// like (name, 0) set or (name2, [0, 1, 2]) set of {name: 0, name2: [0, 1, 2]}
		node.singleProperty = ( numProperties === 1 && reader.getOffset() === endOffset ) ? true : false;

		while ( endOffset > reader.getOffset() ) {

			const subNode = this.parseNode( reader, version );

			if ( subNode !== null ) this.parseSubNode( name, node, subNode );

		}

		node.propertyList = propertyList; // raw property list used by parent

		if ( typeof id === 'number' ) node.id = id;
		if ( attrName !== '' ) node.attrName = attrName;
		if ( attrType !== '' ) node.attrType = attrType;
		if ( name !== '' ) node.name = name;

		return node;

	}

	parseSubNode( name, node, subNode ) {

		// special case: child node is single property
		if ( subNode.singleProperty === true ) {

			const value = subNode.propertyList[ 0 ];

			if ( Array.isArray( value ) ) {

				node[ subNode.name ] = subNode;

				subNode.a = value;

			} else {

				node[ subNode.name ] = value;

			}

		} else if ( name === 'Connections' && subNode.name === 'C' ) {

			const array = [];

			subNode.propertyList.forEach( function ( property, i ) {

				// first Connection is FBX type (OO, OP, etc.). We'll discard these
				if ( i !== 0 ) array.push( property );

			} );

			if ( node.connections === undefined ) {

				node.connections = [];

			}

			node.connections.push( array );

		} else if ( subNode.name === 'Properties70' ) {

			const keys = Object.keys( subNode );

			keys.forEach( function ( key ) {

				node[ key ] = subNode[ key ];

			} );

		} else if ( name === 'Properties70' && subNode.name === 'P' ) {

			let innerPropName = subNode.propertyList[ 0 ];
			let innerPropType1 = subNode.propertyList[ 1 ];
			const innerPropType2 = subNode.propertyList[ 2 ];
			const innerPropFlag = subNode.propertyList[ 3 ];
			let innerPropValue;

			if ( innerPropName.indexOf( 'Lcl ' ) === 0 ) innerPropName = innerPropName.replace( 'Lcl ', 'Lcl_' );
			if ( innerPropType1.indexOf( 'Lcl ' ) === 0 ) innerPropType1 = innerPropType1.replace( 'Lcl ', 'Lcl_' );

			if ( innerPropType1 === 'Color' || innerPropType1 === 'ColorRGB' || innerPropType1 === 'Vector' || innerPropType1 === 'Vector3D' || innerPropType1.indexOf( 'Lcl_' ) === 0 ) {

				innerPropValue = [
					subNode.propertyList[ 4 ],
					subNode.propertyList[ 5 ],
					subNode.propertyList[ 6 ]
				];

			} else {

				innerPropValue = subNode.propertyList[ 4 ];

			}

			// this will be copied to parent, see above
			node[ innerPropName ] = {

				'type': innerPropType1,
				'type2': innerPropType2,
				'flag': innerPropFlag,
				'value': innerPropValue

			};

		} else if ( node[ subNode.name ] === undefined ) {

			if ( typeof subNode.id === 'number' ) {

				node[ subNode.name ] = {};
				node[ subNode.name ][ subNode.id ] = subNode;

			} else {

				node[ subNode.name ] = subNode;

			}

		} else {

			if ( subNode.name === 'PoseNode' ) {

				if ( ! Array.isArray( node[ subNode.name ] ) ) {

					node[ subNode.name ] = [ node[ subNode.name ] ];

				}

				node[ subNode.name ].push( subNode );

			} else if ( node[ subNode.name ][ subNode.id ] === undefined ) {

				node[ subNode.name ][ subNode.id ] = subNode;

			}

		}

	}

	parseProperty( reader ) {

		const type = reader.getString( 1 );
		let length;

		switch ( type ) {

			case 'C':
				return reader.getBoolean();

			case 'D':
				return reader.getFloat64();

			case 'F':
				return reader.getFloat32();

			case 'I':
				return reader.getInt32();

			case 'L':
				return reader.getInt64();

			case 'R':
				length = reader.getUint32();
				return reader.getArrayBuffer( length );

			case 'S':
				length = reader.getUint32();
				return reader.getString( length );

			case 'Y':
				return reader.getInt16();

			case 'b':
			case 'c':
			case 'd':
			case 'f':
			case 'i':
			case 'l':

				const arrayLength = reader.getUint32();
				const encoding = reader.getUint32(); // 0: non-compressed, 1: compressed
				const compressedLength = reader.getUint32();

				if ( encoding === 0 ) {

					switch ( type ) {

						case 'b':
						case 'c':
							return reader.getBooleanArray( arrayLength );

						case 'd':
							return reader.getFloat64Array( arrayLength );

						case 'f':
							return reader.getFloat32Array( arrayLength );

						case 'i':
							return reader.getInt32Array( arrayLength );

						case 'l':
							return reader.getInt64Array( arrayLength );

					}

				}

				if ( typeof fflate === 'undefined' ) {

					console.error( 'THREE.FBXLoader: External library fflate.min.js required.' );

				}

				const data = unzlibSync( new Uint8Array( reader.getArrayBuffer( compressedLength ) ) ); // eslint-disable-line no-undef
				const reader2 = new BinaryReader( data.buffer );

				switch ( type ) {

					case 'b':
					case 'c':
						return reader2.getBooleanArray( arrayLength );

					case 'd':
						return reader2.getFloat64Array( arrayLength );

					case 'f':
						return reader2.getFloat32Array( arrayLength );

					case 'i':
						return reader2.getInt32Array( arrayLength );

					case 'l':
						return reader2.getInt64Array( arrayLength );

				}

			default:
				throw new Error( 'THREE.FBXLoader: Unknown property type ' + type );

		}

	}

}

class BinaryReader {

	constructor( buffer, littleEndian ) {

		this.dv = new DataView( buffer );
		this.offset = 0;
		this.littleEndian = ( littleEndian !== undefined ) ? littleEndian : true;

	}

	getOffset() {

		return this.offset;

	}

	size() {

		return this.dv.buffer.byteLength;

	}

	skip( length ) {

		this.offset += length;

	}

	// seems like true/false representation depends on exporter.
	// true: 1 or 'Y'(=0x59), false: 0 or 'T'(=0x54)
	// then sees LSB.
	getBoolean() {

		return ( this.getUint8() & 1 ) === 1;

	}

	getBooleanArray( size ) {

		const a = [];

		for ( let i = 0; i < size; i ++ ) {

			a.push( this.getBoolean() );

		}

		return a;

	}

	getUint8() {

		const value = this.dv.getUint8( this.offset );
		this.offset += 1;
		return value;

	}

	getInt16() {

		const value = this.dv.getInt16( this.offset, this.littleEndian );
		this.offset += 2;
		return value;

	}

	getInt32() {

		const value = this.dv.getInt32( this.offset, this.littleEndian );
		this.offset += 4;
		return value;

	}

	getInt32Array( size ) {

		const a = [];

		for ( let i = 0; i < size; i ++ ) {

			a.push( this.getInt32() );

		}

		return a;

	}

	getUint32() {

		const value = this.dv.getUint32( this.offset, this.littleEndian );
		this.offset += 4;
		return value;

	}

	// JavaScript doesn't support 64-bit integer so calculate this here
	// 1 << 32 will return 1 so using multiply operation instead here.
	// There's a possibility that this method returns wrong value if the value
	// is out of the range between Number.MAX_SAFE_INTEGER and Number.MIN_SAFE_INTEGER.
	// TODO: safely handle 64-bit integer
	getInt64() {

		let low, high;

		if ( this.littleEndian ) {

			low = this.getUint32();
			high = this.getUint32();

		} else {

			high = this.getUint32();
			low = this.getUint32();

		}

		// calculate negative value
		if ( high & 0x80000000 ) {

			high = ~ high & 0xFFFFFFFF;
			low = ~ low & 0xFFFFFFFF;

			if ( low === 0xFFFFFFFF ) high = ( high + 1 ) & 0xFFFFFFFF;

			low = ( low + 1 ) & 0xFFFFFFFF;

			return - ( high * 0x100000000 + low );

		}

		return high * 0x100000000 + low;

	}

	getInt64Array( size ) {

		const a = [];

		for ( let i = 0; i < size; i ++ ) {

			a.push( this.getInt64() );

		}

		return a;

	}

	// Note: see getInt64() comment
	getUint64() {

		let low, high;

		if ( this.littleEndian ) {

			low = this.getUint32();
			high = this.getUint32();

		} else {

			high = this.getUint32();
			low = this.getUint32();

		}

		return high * 0x100000000 + low;

	}

	getFloat32() {

		const value = this.dv.getFloat32( this.offset, this.littleEndian );
		this.offset += 4;
		return value;

	}

	getFloat32Array( size ) {

		const a = [];

		for ( let i = 0; i < size; i ++ ) {

			a.push( this.getFloat32() );

		}

		return a;

	}

	getFloat64() {

		const value = this.dv.getFloat64( this.offset, this.littleEndian );
		this.offset += 8;
		return value;

	}

	getFloat64Array( size ) {

		const a = [];

		for ( let i = 0; i < size; i ++ ) {

			a.push( this.getFloat64() );

		}

		return a;

	}

	getArrayBuffer( size ) {

		const value = this.dv.buffer.slice( this.offset, this.offset + size );
		this.offset += size;
		return value;

	}

	getString( size ) {

		// note: safari 9 doesn't support Uint8Array.indexOf; create intermediate array instead
		let a = [];

		for ( let i = 0; i < size; i ++ ) {

			a[ i ] = this.getUint8();

		}

		const nullByte = a.indexOf( 0 );
		if ( nullByte >= 0 ) a = a.slice( 0, nullByte );

		return three.LoaderUtils.decodeText( new Uint8Array( a ) );

	}

}

// FBXTree holds a representation of the FBX data, returned by the TextParser ( FBX ASCII format)
// and BinaryParser( FBX Binary format)
class FBXTree {

	add( key, val ) {

		this[ key ] = val;

	}

}

// ************** UTILITY FUNCTIONS **************

function isFbxFormatBinary( buffer ) {

	const CORRECT = 'Kaydara\u0020FBX\u0020Binary\u0020\u0020\0';

	return buffer.byteLength >= CORRECT.length && CORRECT === convertArrayBufferToString( buffer, 0, CORRECT.length );

}

function isFbxFormatASCII( text ) {

	const CORRECT = [ 'K', 'a', 'y', 'd', 'a', 'r', 'a', '\\', 'F', 'B', 'X', '\\', 'B', 'i', 'n', 'a', 'r', 'y', '\\', '\\' ];

	let cursor = 0;

	function read( offset ) {

		const result = text[ offset - 1 ];
		text = text.slice( cursor + offset );
		cursor ++;
		return result;

	}

	for ( let i = 0; i < CORRECT.length; ++ i ) {

		const num = read( 1 );
		if ( num === CORRECT[ i ] ) {

			return false;

		}

	}

	return true;

}

function getFbxVersion( text ) {

	const versionRegExp = /FBXVersion: (\d+)/;
	const match = text.match( versionRegExp );

	if ( match ) {

		const version = parseInt( match[ 1 ] );
		return version;

	}

	throw new Error( 'THREE.FBXLoader: Cannot find the version number for the file given.' );

}

// Converts FBX ticks into real time seconds.
function convertFBXTimeToSeconds( time ) {

	return time / 46186158000;

}

const dataArray = [];

// extracts the data from the correct position in the FBX array based on indexing type
function getData( polygonVertexIndex, polygonIndex, vertexIndex, infoObject ) {

	let index;

	switch ( infoObject.mappingType ) {

		case 'ByPolygonVertex' :
			index = polygonVertexIndex;
			break;
		case 'ByPolygon' :
			index = polygonIndex;
			break;
		case 'ByVertice' :
			index = vertexIndex;
			break;
		case 'AllSame' :
			index = infoObject.indices[ 0 ];
			break;
		default :
			console.warn( 'THREE.FBXLoader: unknown attribute mapping type ' + infoObject.mappingType );

	}

	if ( infoObject.referenceType === 'IndexToDirect' ) index = infoObject.indices[ index ];

	const from = index * infoObject.dataSize;
	const to = from + infoObject.dataSize;

	return slice( dataArray, infoObject.buffer, from, to );

}

const tempEuler = new three.Euler();
const tempVec = new three.Vector3();

// generate transformation from FBX transform data
// ref: https://help.autodesk.com/view/FBX/2017/ENU/?guid=__files_GUID_10CDD63C_79C1_4F2D_BB28_AD2BE65A02ED_htm
// ref: http://docs.autodesk.com/FBX/2014/ENU/FBX-SDK-Documentation/index.html?url=cpp_ref/_transformations_2main_8cxx-example.html,topicNumber=cpp_ref__transformations_2main_8cxx_example_htmlfc10a1e1-b18d-4e72-9dc0-70d0f1959f5e
function generateTransform( transformData ) {

	const lTranslationM = new three.Matrix4();
	const lPreRotationM = new three.Matrix4();
	const lRotationM = new three.Matrix4();
	const lPostRotationM = new three.Matrix4();

	const lScalingM = new three.Matrix4();
	const lScalingPivotM = new three.Matrix4();
	const lScalingOffsetM = new three.Matrix4();
	const lRotationOffsetM = new three.Matrix4();
	const lRotationPivotM = new three.Matrix4();

	const lParentGX = new three.Matrix4();
	const lParentLX = new three.Matrix4();
	const lGlobalT = new three.Matrix4();

	const inheritType = ( transformData.inheritType ) ? transformData.inheritType : 0;

	if ( transformData.translation ) lTranslationM.setPosition( tempVec.fromArray( transformData.translation ) );

	if ( transformData.preRotation ) {

		const array = transformData.preRotation.map( three.MathUtils.degToRad );
		array.push( transformData.eulerOrder );
		lPreRotationM.makeRotationFromEuler( tempEuler.fromArray( array ) );

	}

	if ( transformData.rotation ) {

		const array = transformData.rotation.map( three.MathUtils.degToRad );
		array.push( transformData.eulerOrder );
		lRotationM.makeRotationFromEuler( tempEuler.fromArray( array ) );

	}

	if ( transformData.postRotation ) {

		const array = transformData.postRotation.map( three.MathUtils.degToRad );
		array.push( transformData.eulerOrder );
		lPostRotationM.makeRotationFromEuler( tempEuler.fromArray( array ) );
		lPostRotationM.invert();

	}

	if ( transformData.scale ) lScalingM.scale( tempVec.fromArray( transformData.scale ) );

	// Pivots and offsets
	if ( transformData.scalingOffset ) lScalingOffsetM.setPosition( tempVec.fromArray( transformData.scalingOffset ) );
	if ( transformData.scalingPivot ) lScalingPivotM.setPosition( tempVec.fromArray( transformData.scalingPivot ) );
	if ( transformData.rotationOffset ) lRotationOffsetM.setPosition( tempVec.fromArray( transformData.rotationOffset ) );
	if ( transformData.rotationPivot ) lRotationPivotM.setPosition( tempVec.fromArray( transformData.rotationPivot ) );

	// parent transform
	if ( transformData.parentMatrixWorld ) {

		lParentLX.copy( transformData.parentMatrix );
		lParentGX.copy( transformData.parentMatrixWorld );

	}

	const lLRM = lPreRotationM.clone().multiply( lRotationM ).multiply( lPostRotationM );
	// Global Rotation
	const lParentGRM = new three.Matrix4();
	lParentGRM.extractRotation( lParentGX );

	// Global Shear*Scaling
	const lParentTM = new three.Matrix4();
	lParentTM.copyPosition( lParentGX );

	const lParentGRSM = lParentTM.clone().invert().multiply( lParentGX );
	const lParentGSM = lParentGRM.clone().invert().multiply( lParentGRSM );
	const lLSM = lScalingM;

	const lGlobalRS = new three.Matrix4();

	if ( inheritType === 0 ) {

		lGlobalRS.copy( lParentGRM ).multiply( lLRM ).multiply( lParentGSM ).multiply( lLSM );

	} else if ( inheritType === 1 ) {

		lGlobalRS.copy( lParentGRM ).multiply( lParentGSM ).multiply( lLRM ).multiply( lLSM );

	} else {

		const lParentLSM = new three.Matrix4().scale( new three.Vector3().setFromMatrixScale( lParentLX ) );
		const lParentLSM_inv = lParentLSM.clone().invert();
		const lParentGSM_noLocal = lParentGSM.clone().multiply( lParentLSM_inv );

		lGlobalRS.copy( lParentGRM ).multiply( lLRM ).multiply( lParentGSM_noLocal ).multiply( lLSM );

	}

	const lRotationPivotM_inv = lRotationPivotM.clone().invert();
	const lScalingPivotM_inv = lScalingPivotM.clone().invert();
	// Calculate the local transform matrix
	let lTransform = lTranslationM.clone().multiply( lRotationOffsetM ).multiply( lRotationPivotM ).multiply( lPreRotationM ).multiply( lRotationM ).multiply( lPostRotationM ).multiply( lRotationPivotM_inv ).multiply( lScalingOffsetM ).multiply( lScalingPivotM ).multiply( lScalingM ).multiply( lScalingPivotM_inv );

	const lLocalTWithAllPivotAndOffsetInfo = new three.Matrix4().copyPosition( lTransform );

	const lGlobalTranslation = lParentGX.clone().multiply( lLocalTWithAllPivotAndOffsetInfo );
	lGlobalT.copyPosition( lGlobalTranslation );

	lTransform = lGlobalT.clone().multiply( lGlobalRS );

	// from global to local
	lTransform.premultiply( lParentGX.invert() );

	return lTransform;

}

// Returns the three.js intrinsic Euler order corresponding to FBX extrinsic Euler order
// ref: http://help.autodesk.com/view/FBX/2017/ENU/?guid=__cpp_ref_class_fbx_euler_html
function getEulerOrder( order ) {

	order = order || 0;

	const enums = [
		'ZYX', // -> XYZ extrinsic
		'YZX', // -> XZY extrinsic
		'XZY', // -> YZX extrinsic
		'ZXY', // -> YXZ extrinsic
		'YXZ', // -> ZXY extrinsic
		'XYZ', // -> ZYX extrinsic
		//'SphericXYZ', // not possible to support
	];

	if ( order === 6 ) {

		console.warn( 'THREE.FBXLoader: unsupported Euler Order: Spherical XYZ. Animations and rotations may be incorrect.' );
		return enums[ 0 ];

	}

	return enums[ order ];

}

// Parses comma separated list of numbers and returns them an array.
// Used internally by the TextParser
function parseNumberArray( value ) {

	const array = value.split( ',' ).map( function ( val ) {

		return parseFloat( val );

	} );

	return array;

}

function convertArrayBufferToString( buffer, from, to ) {

	if ( from === undefined ) from = 0;
	if ( to === undefined ) to = buffer.byteLength;

	return three.LoaderUtils.decodeText( new Uint8Array( buffer, from, to ) );

}

function append( a, b ) {

	for ( let i = 0, j = a.length, l = b.length; i < l; i ++, j ++ ) {

		a[ j ] = b[ i ];

	}

}

function slice( a, b, from, to ) {

	for ( let i = from, j = 0; i < to; i ++, j ++ ) {

		a[ j ] = b[ i ];

	}

	return a;

}

// inject array a2 into array a1 at index
function inject( a1, index, a2 ) {

	return a1.slice( 0, index ).concat( a2 ).concat( a1.slice( index ) );

}

function _optionalChain$c(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
class DemoFBXLoader extends Demo {
  
  async init() {
    const { camera, scene } = this.deps;
    camera.position.set(100, 200, 300);
    scene.background = new three.Color(0xa0a0a0);
    scene.fog = new three.Fog(0xa0a0a0, 200, 1000);

    const hemiLight = new three.HemisphereLight(0xffffff, 0x444444);
    hemiLight.position.set(0, 200, 0);
    this.add(hemiLight);

    const dirLight = new three.DirectionalLight(0xffffff);
    dirLight.position.set(0, 200, 100);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 180;
    dirLight.shadow.camera.bottom = -100;
    dirLight.shadow.camera.left = -120;
    dirLight.shadow.camera.right = 120;
    this.add(dirLight);

    // ground
    const mesh = new three.Mesh(
      new three.PlaneGeometry(2000, 2000),
      new three.MeshPhongMaterial({ color: 0x999999, depthWrite: false }),
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    this.add(mesh);

    const grid = new three.GridHelper(2000, 20, 0x000000, 0x000000);
    // @ts-ignore
    grid.material.opacity = 0.2;
    // @ts-ignore
    grid.material.transparent = true;
    this.add(grid);

    const loader = new FBXLoader();
    const object = await loader.loadAsync(
      baseUrl$2 + '/models/fbx/Samba Dancing.fbx',
    );
    const mixer = new three.AnimationMixer(object);

    const action = mixer.clipAction(object.animations[0]);
    action.play();

    object.traverse(function (child) {
      // @ts-ignore
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    this.add(object);

    this.addControl();
    this.orbitControl.target.set(0, 100, 0);
    this.orbitControl.update();

    this.mixer = mixer;
  }
  update() {
    _optionalChain$c([this, 'access', _ => _.mixer, 'optionalAccess', _2 => _2.update, 'call', _3 => _3(this.deps.clock.getDelta())]);
    _optionalChain$c([this, 'access', _4 => _4.orbitControl, 'optionalAccess', _5 => _5.update, 'call', _6 => _6()]);
  }
  dispose() {
    this.reset();
    this.mixer.stopAllAction();
    this.mixer = null;
  }
}

function LWO2Parser( IFFParser ) {

	this.IFF = IFFParser;

}

LWO2Parser.prototype = {

	constructor: LWO2Parser,

	parseBlock: function () {

		this.IFF.debugger.offset = this.IFF.reader.offset;
		this.IFF.debugger.closeForms();

		var blockID = this.IFF.reader.getIDTag();
		var length = this.IFF.reader.getUint32(); // size of data in bytes
		if ( length > this.IFF.reader.dv.byteLength - this.IFF.reader.offset ) {

			this.IFF.reader.offset -= 4;
			length = this.IFF.reader.getUint16();

		}

		this.IFF.debugger.dataOffset = this.IFF.reader.offset;
		this.IFF.debugger.length = length;

		// Data types may be found in either LWO2 OR LWO3 spec
		switch ( blockID ) {

			case 'FORM': // form blocks may consist of sub -chunks or sub-forms
				this.IFF.parseForm( length );
				break;

			// SKIPPED CHUNKS
			// if break; is called directly, the position in the lwoTree is not created
			// any sub chunks and forms are added to the parent form instead
			// MISC skipped
			case 'ICON': // Thumbnail Icon Image
			case 'VMPA': // Vertex Map Parameter
			case 'BBOX': // bounding box
			// case 'VMMD':
			// case 'VTYP':

			// normal maps can be specified, normally on models imported from other applications. Currently ignored
			case 'NORM':

			// ENVL FORM skipped
			case 'PRE ':
			case 'POST':
			case 'KEY ':
			case 'SPAN':

			// CLIP FORM skipped
			case 'TIME':
			case 'CLRS':
			case 'CLRA':
			case 'FILT':
			case 'DITH':
			case 'CONT':
			case 'BRIT':
			case 'SATR':
			case 'HUE ':
			case 'GAMM':
			case 'NEGA':
			case 'IFLT':
			case 'PFLT':

			// Image Map Layer skipped
			case 'PROJ':
			case 'AXIS':
			case 'AAST':
			case 'PIXB':
			case 'AUVO':
			case 'STCK':

			// Procedural Textures skipped
			case 'PROC':
			case 'VALU':
			case 'FUNC':

			// Gradient Textures skipped
			case 'PNAM':
			case 'INAM':
			case 'GRST':
			case 'GREN':
			case 'GRPT':
			case 'FKEY':
			case 'IKEY':

			// Texture Mapping Form skipped
			case 'CSYS':

			// Surface CHUNKs skipped
			case 'OPAQ': // top level 'opacity' checkbox
			case 'CMAP': // clip map

			// Surface node CHUNKS skipped
			// These mainly specify the node editor setup in LW
			case 'NLOC':
			case 'NZOM':
			case 'NVER':
			case 'NSRV':
			case 'NVSK': // unknown
			case 'NCRD':
			case 'WRPW': // image wrap w ( for cylindrical and spherical projections)
			case 'WRPH': // image wrap h
			case 'NMOD':
			case 'NPRW':
			case 'NPLA':
			case 'NODS':
			case 'VERS':
			case 'ENUM':
			case 'TAG ':
			case 'OPAC':

			// Car Material CHUNKS
			case 'CGMD':
			case 'CGTY':
			case 'CGST':
			case 'CGEN':
			case 'CGTS':
			case 'CGTE':
			case 'OSMP':
			case 'OMDE':
			case 'OUTR':
			case 'FLAG':

			case 'TRNL':
			case 'GLOW':
			case 'GVAL': // glow intensity
			case 'SHRP':
			case 'RFOP':
			case 'RSAN':
			case 'TROP':
			case 'RBLR':
			case 'TBLR':
			case 'CLRH':
			case 'CLRF':
			case 'ADTR':
			case 'LINE':
			case 'ALPH':
			case 'VCOL':
			case 'ENAB':
				this.IFF.debugger.skipped = true;
				this.IFF.reader.skip( length );
				break;

			case 'SURF':
				this.IFF.parseSurfaceLwo2( length );
				break;

			case 'CLIP':
				this.IFF.parseClipLwo2( length );
				break;

			// Texture node chunks (not in spec)
			case 'IPIX': // usePixelBlending
			case 'IMIP': // useMipMaps
			case 'IMOD': // imageBlendingMode
			case 'AMOD': // unknown
			case 'IINV': // imageInvertAlpha
			case 'INCR': // imageInvertColor
			case 'IAXS': // imageAxis ( for non-UV maps)
			case 'IFOT': // imageFallofType
			case 'ITIM': // timing for animated textures
			case 'IWRL':
			case 'IUTI':
			case 'IINX':
			case 'IINY':
			case 'IINZ':
			case 'IREF': // possibly a VX for reused texture nodes
				if ( length === 4 ) this.IFF.currentNode[ blockID ] = this.IFF.reader.getInt32();
				else this.IFF.reader.skip( length );
				break;

			case 'OTAG':
				this.IFF.parseObjectTag();
				break;

			case 'LAYR':
				this.IFF.parseLayer( length );
				break;

			case 'PNTS':
				this.IFF.parsePoints( length );
				break;

			case 'VMAP':
				this.IFF.parseVertexMapping( length );
				break;

			case 'AUVU':
			case 'AUVN':
				this.IFF.reader.skip( length - 1 );
				this.IFF.reader.getVariableLengthIndex(); // VX
				break;

			case 'POLS':
				this.IFF.parsePolygonList( length );
				break;

			case 'TAGS':
				this.IFF.parseTagStrings( length );
				break;

			case 'PTAG':
				this.IFF.parsePolygonTagMapping( length );
				break;

			case 'VMAD':
				this.IFF.parseVertexMapping( length, true );
				break;

			// Misc CHUNKS
			case 'DESC': // Description Line
				this.IFF.currentForm.description = this.IFF.reader.getString();
				break;

			case 'TEXT':
			case 'CMNT':
			case 'NCOM':
				this.IFF.currentForm.comment = this.IFF.reader.getString();
				break;

			// Envelope Form
			case 'NAME':
				this.IFF.currentForm.channelName = this.IFF.reader.getString();
				break;

			// Image Map Layer
			case 'WRAP':
				this.IFF.currentForm.wrap = { w: this.IFF.reader.getUint16(), h: this.IFF.reader.getUint16() };
				break;

			case 'IMAG':
				var index = this.IFF.reader.getVariableLengthIndex();
				this.IFF.currentForm.imageIndex = index;
				break;

			// Texture Mapping Form
			case 'OREF':
				this.IFF.currentForm.referenceObject = this.IFF.reader.getString();
				break;

			case 'ROID':
				this.IFF.currentForm.referenceObjectID = this.IFF.reader.getUint32();
				break;

			// Surface Blocks
			case 'SSHN':
				this.IFF.currentSurface.surfaceShaderName = this.IFF.reader.getString();
				break;

			case 'AOVN':
				this.IFF.currentSurface.surfaceCustomAOVName = this.IFF.reader.getString();
				break;

			// Nodal Blocks
			case 'NSTA':
				this.IFF.currentForm.disabled = this.IFF.reader.getUint16();
				break;

			case 'NRNM':
				this.IFF.currentForm.realName = this.IFF.reader.getString();
				break;

			case 'NNME':
				this.IFF.currentForm.refName = this.IFF.reader.getString();
				this.IFF.currentSurface.nodes[ this.IFF.currentForm.refName ] = this.IFF.currentForm;
				break;

			// Nodal Blocks : connections
			case 'INME':
				if ( ! this.IFF.currentForm.nodeName ) this.IFF.currentForm.nodeName = [];
				this.IFF.currentForm.nodeName.push( this.IFF.reader.getString() );
				break;

			case 'IINN':
				if ( ! this.IFF.currentForm.inputNodeName ) this.IFF.currentForm.inputNodeName = [];
				this.IFF.currentForm.inputNodeName.push( this.IFF.reader.getString() );
				break;

			case 'IINM':
				if ( ! this.IFF.currentForm.inputName ) this.IFF.currentForm.inputName = [];
				this.IFF.currentForm.inputName.push( this.IFF.reader.getString() );
				break;

			case 'IONM':
				if ( ! this.IFF.currentForm.inputOutputName ) this.IFF.currentForm.inputOutputName = [];
				this.IFF.currentForm.inputOutputName.push( this.IFF.reader.getString() );
				break;

			case 'FNAM':
				this.IFF.currentForm.fileName = this.IFF.reader.getString();
				break;

			case 'CHAN': // NOTE: ENVL Forms may also have CHAN chunk, however ENVL is currently ignored
				if ( length === 4 ) this.IFF.currentForm.textureChannel = this.IFF.reader.getIDTag();
				else this.IFF.reader.skip( length );
				break;

			// LWO2 Spec chunks: these are needed since the SURF FORMs are often in LWO2 format
			case 'SMAN':
				var maxSmoothingAngle = this.IFF.reader.getFloat32();
				this.IFF.currentSurface.attributes.smooth = ( maxSmoothingAngle < 0 ) ? false : true;
				break;

			// LWO2: Basic Surface Parameters
			case 'COLR':
				this.IFF.currentSurface.attributes.Color = { value: this.IFF.reader.getFloat32Array( 3 ) };
				this.IFF.reader.skip( 2 ); // VX: envelope
				break;

			case 'LUMI':
				this.IFF.currentSurface.attributes.Luminosity = { value: this.IFF.reader.getFloat32() };
				this.IFF.reader.skip( 2 );
				break;

			case 'SPEC':
				this.IFF.currentSurface.attributes.Specular = { value: this.IFF.reader.getFloat32() };
				this.IFF.reader.skip( 2 );
				break;

			case 'DIFF':
				this.IFF.currentSurface.attributes.Diffuse = { value: this.IFF.reader.getFloat32() };
				this.IFF.reader.skip( 2 );
				break;

			case 'REFL':
				this.IFF.currentSurface.attributes.Reflection = { value: this.IFF.reader.getFloat32() };
				this.IFF.reader.skip( 2 );
				break;

			case 'GLOS':
				this.IFF.currentSurface.attributes.Glossiness = { value: this.IFF.reader.getFloat32() };
				this.IFF.reader.skip( 2 );
				break;

			case 'TRAN':
				this.IFF.currentSurface.attributes.opacity = this.IFF.reader.getFloat32();
				this.IFF.reader.skip( 2 );
				break;

			case 'BUMP':
				this.IFF.currentSurface.attributes.bumpStrength = this.IFF.reader.getFloat32();
				this.IFF.reader.skip( 2 );
				break;

			case 'SIDE':
				this.IFF.currentSurface.attributes.side = this.IFF.reader.getUint16();
				break;

			case 'RIMG':
				this.IFF.currentSurface.attributes.reflectionMap = this.IFF.reader.getVariableLengthIndex();
				break;

			case 'RIND':
				this.IFF.currentSurface.attributes.refractiveIndex = this.IFF.reader.getFloat32();
				this.IFF.reader.skip( 2 );
				break;

			case 'TIMG':
				this.IFF.currentSurface.attributes.refractionMap = this.IFF.reader.getVariableLengthIndex();
				break;

			case 'IMAP':
				this.IFF.reader.skip( 2 );
				break;

			case 'TMAP':
				this.IFF.debugger.skipped = true;
				this.IFF.reader.skip( length ); // needs implementing
				break;

			case 'IUVI': // uv channel name
				this.IFF.currentNode.UVChannel = this.IFF.reader.getString( length );
				break;

			case 'IUTL': // widthWrappingMode: 0 = Reset, 1 = Repeat, 2 = Mirror, 3 = Edge
				this.IFF.currentNode.widthWrappingMode = this.IFF.reader.getUint32();
				break;
			case 'IVTL': // heightWrappingMode
				this.IFF.currentNode.heightWrappingMode = this.IFF.reader.getUint32();
				break;

			// LWO2 USE
			case 'BLOK':
				// skip
				break;

			default:
				this.IFF.parseUnknownCHUNK( blockID, length );

		}

		if ( blockID != 'FORM' ) {

			this.IFF.debugger.node = 1;
			this.IFF.debugger.nodeID = blockID;
			this.IFF.debugger.log();

		}

		if ( this.IFF.reader.offset >= this.IFF.currentFormEnd ) {

			this.IFF.currentForm = this.IFF.parentForm;

		}

	}

};

function LWO3Parser( IFFParser ) {

	this.IFF = IFFParser;

}

LWO3Parser.prototype = {

	constructor: LWO3Parser,

	parseBlock: function () {

		this.IFF.debugger.offset = this.IFF.reader.offset;
		this.IFF.debugger.closeForms();

		var blockID = this.IFF.reader.getIDTag();
		var length = this.IFF.reader.getUint32(); // size of data in bytes

		this.IFF.debugger.dataOffset = this.IFF.reader.offset;
		this.IFF.debugger.length = length;

		// Data types may be found in either LWO2 OR LWO3 spec
		switch ( blockID ) {

			case 'FORM': // form blocks may consist of sub -chunks or sub-forms
				this.IFF.parseForm( length );
				break;

			// SKIPPED CHUNKS
			// MISC skipped
			case 'ICON': // Thumbnail Icon Image
			case 'VMPA': // Vertex Map Parameter
			case 'BBOX': // bounding box
			// case 'VMMD':
			// case 'VTYP':

			// normal maps can be specified, normally on models imported from other applications. Currently ignored
			case 'NORM':

			// ENVL FORM skipped
			case 'PRE ':
			case 'POST':
			case 'KEY ':
			case 'SPAN':

			// CLIP FORM skipped
			case 'TIME':
			case 'CLRS':
			case 'CLRA':
			case 'FILT':
			case 'DITH':
			case 'CONT':
			case 'BRIT':
			case 'SATR':
			case 'HUE ':
			case 'GAMM':
			case 'NEGA':
			case 'IFLT':
			case 'PFLT':

			// Image Map Layer skipped
			case 'PROJ':
			case 'AXIS':
			case 'AAST':
			case 'PIXB':
			case 'STCK':

			// Procedural Textures skipped
			case 'VALU':

			// Gradient Textures skipped
			case 'PNAM':
			case 'INAM':
			case 'GRST':
			case 'GREN':
			case 'GRPT':
			case 'FKEY':
			case 'IKEY':

			// Texture Mapping Form skipped
			case 'CSYS':

				// Surface CHUNKs skipped
			case 'OPAQ': // top level 'opacity' checkbox
			case 'CMAP': // clip map

			// Surface node CHUNKS skipped
			// These mainly specify the node editor setup in LW
			case 'NLOC':
			case 'NZOM':
			case 'NVER':
			case 'NSRV':
			case 'NCRD':
			case 'NMOD':
			case 'NSEL':
			case 'NPRW':
			case 'NPLA':
			case 'VERS':
			case 'ENUM':
			case 'TAG ':

			// Car Material CHUNKS
			case 'CGMD':
			case 'CGTY':
			case 'CGST':
			case 'CGEN':
			case 'CGTS':
			case 'CGTE':
			case 'OSMP':
			case 'OMDE':
			case 'OUTR':
			case 'FLAG':

			case 'TRNL':
			case 'SHRP':
			case 'RFOP':
			case 'RSAN':
			case 'TROP':
			case 'RBLR':
			case 'TBLR':
			case 'CLRH':
			case 'CLRF':
			case 'ADTR':
			case 'GLOW':
			case 'LINE':
			case 'ALPH':
			case 'VCOL':
			case 'ENAB':
				this.IFF.debugger.skipped = true;
				this.IFF.reader.skip( length );
				break;

			// Texture node chunks (not in spec)
			case 'IPIX': // usePixelBlending
			case 'IMIP': // useMipMaps
			case 'IMOD': // imageBlendingMode
			case 'AMOD': // unknown
			case 'IINV': // imageInvertAlpha
			case 'INCR': // imageInvertColor
			case 'IAXS': // imageAxis ( for non-UV maps)
			case 'IFOT': // imageFallofType
			case 'ITIM': // timing for animated textures
			case 'IWRL':
			case 'IUTI':
			case 'IINX':
			case 'IINY':
			case 'IINZ':
			case 'IREF': // possibly a VX for reused texture nodes
				if ( length === 4 ) this.IFF.currentNode[ blockID ] = this.IFF.reader.getInt32();
				else this.IFF.reader.skip( length );
				break;

			case 'OTAG':
				this.IFF.parseObjectTag();
				break;

			case 'LAYR':
				this.IFF.parseLayer( length );
				break;

			case 'PNTS':
				this.IFF.parsePoints( length );
				break;

			case 'VMAP':
				this.IFF.parseVertexMapping( length );
				break;

			case 'POLS':
				this.IFF.parsePolygonList( length );
				break;

			case 'TAGS':
				this.IFF.parseTagStrings( length );
				break;

			case 'PTAG':
				this.IFF.parsePolygonTagMapping( length );
				break;

			case 'VMAD':
				this.IFF.parseVertexMapping( length, true );
				break;

			// Misc CHUNKS
			case 'DESC': // Description Line
				this.IFF.currentForm.description = this.IFF.reader.getString();
				break;

			case 'TEXT':
			case 'CMNT':
			case 'NCOM':
				this.IFF.currentForm.comment = this.IFF.reader.getString();
				break;

			// Envelope Form
			case 'NAME':
				this.IFF.currentForm.channelName = this.IFF.reader.getString();
				break;

			// Image Map Layer
			case 'WRAP':
				this.IFF.currentForm.wrap = { w: this.IFF.reader.getUint16(), h: this.IFF.reader.getUint16() };
				break;

			case 'IMAG':
				var index = this.IFF.reader.getVariableLengthIndex();
				this.IFF.currentForm.imageIndex = index;
				break;

			// Texture Mapping Form
			case 'OREF':
				this.IFF.currentForm.referenceObject = this.IFF.reader.getString();
				break;

			case 'ROID':
				this.IFF.currentForm.referenceObjectID = this.IFF.reader.getUint32();
				break;

			// Surface Blocks
			case 'SSHN':
				this.IFF.currentSurface.surfaceShaderName = this.IFF.reader.getString();
				break;

			case 'AOVN':
				this.IFF.currentSurface.surfaceCustomAOVName = this.IFF.reader.getString();
				break;

			// Nodal Blocks
			case 'NSTA':
				this.IFF.currentForm.disabled = this.IFF.reader.getUint16();
				break;

			case 'NRNM':
				this.IFF.currentForm.realName = this.IFF.reader.getString();
				break;

			case 'NNME':
				this.IFF.currentForm.refName = this.IFF.reader.getString();
				this.IFF.currentSurface.nodes[ this.IFF.currentForm.refName ] = this.IFF.currentForm;
				break;

			// Nodal Blocks : connections
			case 'INME':
				if ( ! this.IFF.currentForm.nodeName ) this.IFF.currentForm.nodeName = [];
				this.IFF.currentForm.nodeName.push( this.IFF.reader.getString() );
				break;

			case 'IINN':
				if ( ! this.IFF.currentForm.inputNodeName ) this.IFF.currentForm.inputNodeName = [];
				this.IFF.currentForm.inputNodeName.push( this.IFF.reader.getString() );
				break;

			case 'IINM':
				if ( ! this.IFF.currentForm.inputName ) this.IFF.currentForm.inputName = [];
				this.IFF.currentForm.inputName.push( this.IFF.reader.getString() );
				break;

			case 'IONM':
				if ( ! this.IFF.currentForm.inputOutputName ) this.IFF.currentForm.inputOutputName = [];
				this.IFF.currentForm.inputOutputName.push( this.IFF.reader.getString() );
				break;

			case 'FNAM':
				this.IFF.currentForm.fileName = this.IFF.reader.getString();
				break;

			case 'CHAN': // NOTE: ENVL Forms may also have CHAN chunk, however ENVL is currently ignored
				if ( length === 4 ) this.IFF.currentForm.textureChannel = this.IFF.reader.getIDTag();
				else this.IFF.reader.skip( length );
				break;

			// LWO2 Spec chunks: these are needed since the SURF FORMs are often in LWO2 format
			case 'SMAN':
				var maxSmoothingAngle = this.IFF.reader.getFloat32();
				this.IFF.currentSurface.attributes.smooth = ( maxSmoothingAngle < 0 ) ? false : true;
				break;

			// LWO2: Basic Surface Parameters
			case 'COLR':
				this.IFF.currentSurface.attributes.Color = { value: this.IFF.reader.getFloat32Array( 3 ) };
				this.IFF.reader.skip( 2 ); // VX: envelope
				break;

			case 'LUMI':
				this.IFF.currentSurface.attributes.Luminosity = { value: this.IFF.reader.getFloat32() };
				this.IFF.reader.skip( 2 );
				break;

			case 'SPEC':
				this.IFF.currentSurface.attributes.Specular = { value: this.IFF.reader.getFloat32() };
				this.IFF.reader.skip( 2 );
				break;

			case 'DIFF':
				this.IFF.currentSurface.attributes.Diffuse = { value: this.IFF.reader.getFloat32() };
				this.IFF.reader.skip( 2 );
				break;

			case 'REFL':
				this.IFF.currentSurface.attributes.Reflection = { value: this.IFF.reader.getFloat32() };
				this.IFF.reader.skip( 2 );
				break;

			case 'GLOS':
				this.IFF.currentSurface.attributes.Glossiness = { value: this.IFF.reader.getFloat32() };
				this.IFF.reader.skip( 2 );
				break;

			case 'TRAN':
				this.IFF.currentSurface.attributes.opacity = this.IFF.reader.getFloat32();
				this.IFF.reader.skip( 2 );
				break;

			case 'BUMP':
				this.IFF.currentSurface.attributes.bumpStrength = this.IFF.reader.getFloat32();
				this.IFF.reader.skip( 2 );
				break;

			case 'SIDE':
				this.IFF.currentSurface.attributes.side = this.IFF.reader.getUint16();
				break;

			case 'RIMG':
				this.IFF.currentSurface.attributes.reflectionMap = this.IFF.reader.getVariableLengthIndex();
				break;

			case 'RIND':
				this.IFF.currentSurface.attributes.refractiveIndex = this.IFF.reader.getFloat32();
				this.IFF.reader.skip( 2 );
				break;

			case 'TIMG':
				this.IFF.currentSurface.attributes.refractionMap = this.IFF.reader.getVariableLengthIndex();
				break;

			case 'IMAP':
				this.IFF.currentSurface.attributes.imageMapIndex = this.IFF.reader.getUint32();
				break;

			case 'IUVI': // uv channel name
				this.IFF.currentNode.UVChannel = this.IFF.reader.getString( length );
				break;

			case 'IUTL': // widthWrappingMode: 0 = Reset, 1 = Repeat, 2 = Mirror, 3 = Edge
				this.IFF.currentNode.widthWrappingMode = this.IFF.reader.getUint32();
				break;
			case 'IVTL': // heightWrappingMode
				this.IFF.currentNode.heightWrappingMode = this.IFF.reader.getUint32();
				break;

			default:
				this.IFF.parseUnknownCHUNK( blockID, length );

		}

		if ( blockID != 'FORM' ) {

			this.IFF.debugger.node = 1;
			this.IFF.debugger.nodeID = blockID;
			this.IFF.debugger.log();

		}

		if ( this.IFF.reader.offset >= this.IFF.currentFormEnd ) {

			this.IFF.currentForm = this.IFF.parentForm;

		}

	}

};

/**
 * === IFFParser ===
 * - Parses data from the IFF buffer.
 * - LWO3 files are in IFF format and can contain the following data types, referred to by shorthand codes
 *
 * ATOMIC DATA TYPES
 *  ID Tag - 4x 7 bit uppercase ASCII chars: ID4
 *  signed integer, 1, 2, or 4 byte length: I1, I2, I4
 *  unsigned integer, 1, 2, or 4 byte length: U1, U2, U4
 *  float, 4 byte length: F4
 *  string, series of ASCII chars followed by null byte (If the length of the string including the null terminating byte is odd, an extra null is added so that the data that follows will begin on an even byte boundary): S0
 *
 * COMPOUND DATA TYPES
 *  Variable-length Index (index into an array or collection): U2 or U4 : VX
 *  Color (RGB): F4 + F4 + F4: COL12
 *  Coordinate (x, y, z): F4 + F4 + F4: VEC12
 *  Percentage F4 data type from 0->1 with 1 = 100%: FP4
 *  Angle in radian F4: ANG4
 *  Filename (string) S0: FNAM0
 *  XValue F4 + index (VX) + optional envelope( ENVL ): XVAL
 *  XValue vector VEC12 + index (VX) + optional envelope( ENVL ): XVAL3
 *
 *  The IFF file is arranged in chunks:
 *  CHUNK = ID4 + length (U4) + length X bytes of data + optional 0 pad byte
 *  optional 0 pad byte is there to ensure chunk ends on even boundary, not counted in size
 *
 * COMPOUND DATA TYPES
 * - Chunks are combined in Forms (collections of chunks)
 * - FORM = string 'FORM' (ID4) + length (U4) + type (ID4) + optional ( CHUNK | FORM )
 * - CHUNKS and FORMS are collectively referred to as blocks
 * - The entire file is contained in one top level FORM
 *
 **/

function IFFParser( ) {

	this.debugger = new Debugger();
	// this.debugger.enable(); // un-comment to log IFF hierarchy.

}

IFFParser.prototype = {

	constructor: IFFParser,

	parse: function ( buffer ) {

		this.reader = new DataViewReader( buffer );

		this.tree = {
			materials: {},
			layers: [],
			tags: [],
			textures: [],
		};

		// start out at the top level to add any data before first layer is encountered
		this.currentLayer = this.tree;
		this.currentForm = this.tree;

		this.parseTopForm();

		if ( this.tree.format === undefined ) return;

		if ( this.tree.format === 'LWO2' ) {

			this.parser = new LWO2Parser( this );
			while ( ! this.reader.endOfFile() ) this.parser.parseBlock();

		} else if ( this.tree.format === 'LWO3' ) {

			this.parser = new LWO3Parser( this );
			while ( ! this.reader.endOfFile() ) this.parser.parseBlock();

		}

		this.debugger.offset = this.reader.offset;
		this.debugger.closeForms();

		return this.tree;

	},

	parseTopForm() {

		this.debugger.offset = this.reader.offset;

		var topForm = this.reader.getIDTag();

		if ( topForm !== 'FORM' ) {

			console.warn( 'LWOLoader: Top-level FORM missing.' );
			return;

		}

		var length = this.reader.getUint32();

		this.debugger.dataOffset = this.reader.offset;
		this.debugger.length = length;

		var type = this.reader.getIDTag();

		if ( type === 'LWO2' ) {

			this.tree.format = type;

		} else if ( type === 'LWO3' ) {

			this.tree.format = type;

		}

		this.debugger.node = 0;
		this.debugger.nodeID = type;
		this.debugger.log();

		return;

	},


	///
	// FORM PARSING METHODS
	///

	// Forms are organisational and can contain any number of sub chunks and sub forms
	// FORM ::= 'FORM'[ID4], length[U4], type[ID4], ( chunk[CHUNK] | form[FORM] ) * }
	parseForm( length ) {

		var type = this.reader.getIDTag();

		switch ( type ) {

			// SKIPPED FORMS
			// if skipForm( length ) is called, the entire form and any sub forms and chunks are skipped

			case 'ISEQ': // Image sequence
			case 'ANIM': // plug in animation
			case 'STCC': // Color-cycling Still
			case 'VPVL':
			case 'VPRM':
			case 'NROT':
			case 'WRPW': // image wrap w ( for cylindrical and spherical projections)
			case 'WRPH': // image wrap h
			case 'FUNC':
			case 'FALL':
			case 'OPAC':
			case 'GRAD': // gradient texture
			case 'ENVS':
			case 'VMOP':
			case 'VMBG':

			// Car Material FORMS
			case 'OMAX':
			case 'STEX':
			case 'CKBG':
			case 'CKEY':
			case 'VMLA':
			case 'VMLB':
				this.debugger.skipped = true;
				this.skipForm( length ); // not currently supported
				break;

			// if break; is called directly, the position in the lwoTree is not created
			// any sub chunks and forms are added to the parent form instead
			case 'META':
			case 'NNDS':
			case 'NODS':
			case 'NDTA':
			case 'ADAT':
			case 'AOVS':
			case 'BLOK':

			// used by texture nodes
			case 'IBGC': // imageBackgroundColor
			case 'IOPC': // imageOpacity
			case 'IIMG': // hold reference to image path
			case 'TXTR':
				// this.setupForm( type, length );
				this.debugger.length = 4;
				this.debugger.skipped = true;
				break;

			case 'IFAL': // imageFallof
			case 'ISCL': // imageScale
			case 'IPOS': // imagePosition
			case 'IROT': // imageRotation
			case 'IBMP':
			case 'IUTD':
			case 'IVTD':
				this.parseTextureNodeAttribute( type );
				break;

			case 'ENVL':
				this.parseEnvelope( length );
				break;

				// CLIP FORM AND SUB FORMS

			case 'CLIP':
				if ( this.tree.format === 'LWO2' ) {

					this.parseForm( length );

				} else {

					this.parseClip( length );

				}

				break;

			case 'STIL':
				this.parseImage();
				break;

			case 'XREF': // clone of another STIL
				this.reader.skip( 8 ); // unknown
				this.currentForm.referenceTexture = {
					index: this.reader.getUint32(),
					refName: this.reader.getString() // internal unique ref
				};
				break;

				// Not in spec, used by texture nodes

			case 'IMST':
				this.parseImageStateForm( length );
				break;

				// SURF FORM AND SUB FORMS

			case 'SURF':
				this.parseSurfaceForm( length );
				break;

			case 'VALU': // Not in spec
				this.parseValueForm( length );
				break;

			case 'NTAG':
				this.parseSubNode( length );
				break;

			case 'ATTR': // BSDF Node Attributes
			case 'SATR': // Standard Node Attributes
				this.setupForm( 'attributes', length );
				break;

			case 'NCON':
				this.parseConnections( length );
				break;

			case 'SSHA':
				this.parentForm = this.currentForm;
				this.currentForm = this.currentSurface;
				this.setupForm( 'surfaceShader', length );
				break;

			case 'SSHD':
				this.setupForm( 'surfaceShaderData', length );
				break;

			case 'ENTR': // Not in spec
				this.parseEntryForm( length );
				break;

				// Image Map Layer

			case 'IMAP':
				this.parseImageMap( length );
				break;

			case 'TAMP':
				this.parseXVAL( 'amplitude', length );
				break;

				//Texture Mapping Form

			case 'TMAP':
				this.setupForm( 'textureMap', length );
				break;

			case 'CNTR':
				this.parseXVAL3( 'center', length );
				break;

			case 'SIZE':
				this.parseXVAL3( 'scale', length );
				break;

			case 'ROTA':
				this.parseXVAL3( 'rotation', length );
				break;

			default:
				this.parseUnknownForm( type, length );

		}

		this.debugger.node = 0;
		this.debugger.nodeID = type;
		this.debugger.log();

	},

	setupForm( type, length ) {

		if ( ! this.currentForm ) this.currentForm = this.currentNode;

		this.currentFormEnd = this.reader.offset + length;
		this.parentForm = this.currentForm;

		if ( ! this.currentForm[ type ] ) {

			this.currentForm[ type ] = {};
			this.currentForm = this.currentForm[ type ];


		} else {

			// should never see this unless there's a bug in the reader
			console.warn( 'LWOLoader: form already exists on parent: ', type, this.currentForm );

			this.currentForm = this.currentForm[ type ];

		}


	},

	skipForm( length ) {

		this.reader.skip( length - 4 );

	},

	parseUnknownForm( type, length ) {

		console.warn( 'LWOLoader: unknown FORM encountered: ' + type, length );

		printBuffer( this.reader.dv.buffer, this.reader.offset, length - 4 );
		this.reader.skip( length - 4 );

	},

	parseSurfaceForm( length ) {

		this.reader.skip( 8 ); // unknown Uint32 x2

		var name = this.reader.getString();

		var surface = {
			attributes: {}, // LWO2 style non-node attributes will go here
			connections: {},
			name: name,
			inputName: name,
			nodes: {},
			source: this.reader.getString(),
		};

		this.tree.materials[ name ] = surface;
		this.currentSurface = surface;

		this.parentForm = this.tree.materials;
		this.currentForm = surface;
		this.currentFormEnd = this.reader.offset + length;

	},

	parseSurfaceLwo2( length ) {

		var name = this.reader.getString();

		var surface = {
			attributes: {}, // LWO2 style non-node attributes will go here
			connections: {},
			name: name,
			nodes: {},
			source: this.reader.getString(),
		};

		this.tree.materials[ name ] = surface;
		this.currentSurface = surface;

		this.parentForm = this.tree.materials;
		this.currentForm = surface;
		this.currentFormEnd = this.reader.offset + length;

	},

	parseSubNode( length ) {

		// parse the NRNM CHUNK of the subnode FORM to get
		// a meaningful name for the subNode
		// some subnodes can be renamed, but Input and Surface cannot

		this.reader.skip( 8 ); // NRNM + length
		var name = this.reader.getString();

		var node = {
			name: name
		};
		this.currentForm = node;
		this.currentNode = node;

		this.currentFormEnd = this.reader.offset + length;


	},

	// collect attributes from all nodes at the top level of a surface
	parseConnections( length ) {

		this.currentFormEnd = this.reader.offset + length;
		this.parentForm = this.currentForm;

		this.currentForm = this.currentSurface.connections;

	},

	// surface node attribute data, e.g. specular, roughness etc
	parseEntryForm( length ) {

		this.reader.skip( 8 ); // NAME + length
		var name = this.reader.getString();
		this.currentForm = this.currentNode.attributes;

		this.setupForm( name, length );

	},

	// parse values from material - doesn't match up to other LWO3 data types
	// sub form of entry form
	parseValueForm() {

		this.reader.skip( 8 ); // unknown + length

		var valueType = this.reader.getString();

		if ( valueType === 'double' ) {

			this.currentForm.value = this.reader.getUint64();

		} else if ( valueType === 'int' ) {

			this.currentForm.value = this.reader.getUint32();

		} else if ( valueType === 'vparam' ) {

			this.reader.skip( 24 );
			this.currentForm.value = this.reader.getFloat64();

		} else if ( valueType === 'vparam3' ) {

			this.reader.skip( 24 );
			this.currentForm.value = this.reader.getFloat64Array( 3 );

		}

	},

	// holds various data about texture node image state
	// Data other thanmipMapLevel unknown
	parseImageStateForm() {

		this.reader.skip( 8 ); // unknown

		this.currentForm.mipMapLevel = this.reader.getFloat32();

	},

	// LWO2 style image data node OR LWO3 textures defined at top level in editor (not as SURF node)
	parseImageMap( length ) {

		this.currentFormEnd = this.reader.offset + length;
		this.parentForm = this.currentForm;

		if ( ! this.currentForm.maps ) this.currentForm.maps = [];

		var map = {};
		this.currentForm.maps.push( map );
		this.currentForm = map;

		this.reader.skip( 10 ); // unknown, could be an issue if it contains a VX

	},

	parseTextureNodeAttribute( type ) {

		this.reader.skip( 28 ); // FORM + length + VPRM + unknown + Uint32 x2 + float32

		this.reader.skip( 20 ); // FORM + length + VPVL + float32 + Uint32

		switch ( type ) {

			case 'ISCL':
				this.currentNode.scale = this.reader.getFloat32Array( 3 );
				break;
			case 'IPOS':
				this.currentNode.position = this.reader.getFloat32Array( 3 );
				break;
			case 'IROT':
				this.currentNode.rotation = this.reader.getFloat32Array( 3 );
				break;
			case 'IFAL':
				this.currentNode.falloff = this.reader.getFloat32Array( 3 );
				break;

			case 'IBMP':
				this.currentNode.amplitude = this.reader.getFloat32();
				break;
			case 'IUTD':
				this.currentNode.uTiles = this.reader.getFloat32();
				break;
			case 'IVTD':
				this.currentNode.vTiles = this.reader.getFloat32();
				break;

		}

		this.reader.skip( 2 ); // unknown


	},

	// ENVL forms are currently ignored
	parseEnvelope( length ) {

		this.reader.skip( length - 4 ); // skipping  entirely for now

	},

	///
	// CHUNK PARSING METHODS
	///

	// clips can either be defined inside a surface node, or at the top
	// level and they have a different format in each case
	parseClip( length ) {

		var tag = this.reader.getIDTag();

		// inside surface node
		if ( tag === 'FORM' ) {

			this.reader.skip( 16 );

			this.currentNode.fileName = this.reader.getString();

			return;

		}

		// otherwise top level
		this.reader.setOffset( this.reader.offset - 4 );

		this.currentFormEnd = this.reader.offset + length;
		this.parentForm = this.currentForm;

		this.reader.skip( 8 ); // unknown

		var texture = {
			index: this.reader.getUint32()
		};
		this.tree.textures.push( texture );
		this.currentForm = texture;

	},

	parseClipLwo2( length ) {

		var texture = {
			index: this.reader.getUint32(),
			fileName: ''
		};

		// seach STIL block
		while ( true ) {

			var tag = this.reader.getIDTag();
			var n_length = this.reader.getUint16();
			if ( tag === 'STIL' ) {

				texture.fileName = this.reader.getString();
				break;

			}

			if ( n_length >= length ) {

				break;

			}

		}

		this.tree.textures.push( texture );
		this.currentForm = texture;

	},

	parseImage() {

		this.reader.skip( 8 ); // unknown
		this.currentForm.fileName = this.reader.getString();

	},

	parseXVAL( type, length ) {

		var endOffset = this.reader.offset + length - 4;
		this.reader.skip( 8 );

		this.currentForm[ type ] = this.reader.getFloat32();

		this.reader.setOffset( endOffset ); // set end offset directly to skip optional envelope

	},

	parseXVAL3( type, length ) {

		var endOffset = this.reader.offset + length - 4;
		this.reader.skip( 8 );

		this.currentForm[ type ] = {
			x: this.reader.getFloat32(),
			y: this.reader.getFloat32(),
			z: this.reader.getFloat32(),
		};

		this.reader.setOffset( endOffset );

	},

	// Tags associated with an object
	// OTAG { type[ID4], tag-string[S0] }
	parseObjectTag() {

		if ( ! this.tree.objectTags ) this.tree.objectTags = {};

		this.tree.objectTags[ this.reader.getIDTag() ] = {
			tagString: this.reader.getString()
		};

	},

	// Signals the start of a new layer. All the data chunks which follow will be included in this layer until another layer chunk is encountered.
	// LAYR: number[U2], flags[U2], pivot[VEC12], name[S0], parent[U2]
	parseLayer( length ) {

		var layer = {
			number: this.reader.getUint16(),
			flags: this.reader.getUint16(), // If the least significant bit of flags is set, the layer is hidden.
			pivot: this.reader.getFloat32Array( 3 ), // Note: this seems to be superflous, as the geometry is translated when pivot is present
			name: this.reader.getString(),
		};

		this.tree.layers.push( layer );
		this.currentLayer = layer;

		var parsedLength = 16 + stringOffset( this.currentLayer.name ); // index ( 2 ) + flags( 2 ) + pivot( 12 ) + stringlength

		// if we have not reached then end of the layer block, there must be a parent defined
		this.currentLayer.parent = ( parsedLength < length ) ? this.reader.getUint16() : - 1; // omitted or -1 for no parent

	},

	// VEC12 * ( F4 + F4 + F4 ) array of x,y,z vectors
	// Converting from left to right handed coordinate system:
	// x -> -x and switch material FrontSide -> BackSide
	parsePoints( length ) {

		this.currentPoints = [];
		for ( var i = 0; i < length / 4; i += 3 ) {

			// z -> -z to match three.js right handed coords
			this.currentPoints.push( this.reader.getFloat32(), this.reader.getFloat32(), - this.reader.getFloat32() );

		}

	},

	// parse VMAP or VMAD
	// Associates a set of floating-point vectors with a set of points.
	// VMAP: { type[ID4], dimension[U2], name[S0], ( vert[VX], value[F4] # dimension ) * }

	// VMAD Associates a set of floating-point vectors with the vertices of specific polygons.
	// Similar to VMAP UVs, but associates with polygon vertices rather than points
	// to solve to problem of UV seams:  VMAD chunks are paired with VMAPs of the same name,
	// if they exist. The vector values in the VMAD will then replace those in the
	// corresponding VMAP, but only for calculations involving the specified polygons.
	// VMAD { type[ID4], dimension[U2], name[S0], ( vert[VX], poly[VX], value[F4] # dimension ) * }
	parseVertexMapping( length, discontinuous ) {

		var finalOffset = this.reader.offset + length;

		var channelName = this.reader.getString();

		if ( this.reader.offset === finalOffset ) {

			// then we are in a texture node and the VMAP chunk is just a reference to a UV channel name
			this.currentForm.UVChannel = channelName;
			return;

		}

		// otherwise reset to initial length and parse normal VMAP CHUNK
		this.reader.setOffset( this.reader.offset - stringOffset( channelName ) );

		var type = this.reader.getIDTag();

		this.reader.getUint16(); // dimension
		var name = this.reader.getString();

		var remainingLength = length - 6 - stringOffset( name );

		switch ( type ) {

			case 'TXUV':
				this.parseUVMapping( name, finalOffset, discontinuous );
				break;
			case 'MORF':
			case 'SPOT':
				this.parseMorphTargets( name, finalOffset, type ); // can't be discontinuous
				break;
			// unsupported VMAPs
			case 'APSL':
			case 'NORM':
			case 'WGHT':
			case 'MNVW':
			case 'PICK':
			case 'RGB ':
			case 'RGBA':
				this.reader.skip( remainingLength );
				break;
			default:
				console.warn( 'LWOLoader: unknown vertex map type: ' + type );
				this.reader.skip( remainingLength );

		}

	},

	parseUVMapping( name, finalOffset, discontinuous ) {

		var uvIndices = [];
		var polyIndices = [];
		var uvs = [];

		while ( this.reader.offset < finalOffset ) {

			uvIndices.push( this.reader.getVariableLengthIndex() );

			if ( discontinuous ) polyIndices.push( this.reader.getVariableLengthIndex() );

			uvs.push( this.reader.getFloat32(), this.reader.getFloat32() );

		}

		if ( discontinuous ) {

			if ( ! this.currentLayer.discontinuousUVs ) this.currentLayer.discontinuousUVs = {};

			this.currentLayer.discontinuousUVs[ name ] = {
				uvIndices: uvIndices,
				polyIndices: polyIndices,
				uvs: uvs,
			};

		} else {

			if ( ! this.currentLayer.uvs ) this.currentLayer.uvs = {};

			this.currentLayer.uvs[ name ] = {
				uvIndices: uvIndices,
				uvs: uvs,
			};

		}

	},

	parseMorphTargets( name, finalOffset, type ) {

		var indices = [];
		var points = [];

		type = ( type === 'MORF' ) ? 'relative' : 'absolute';

		while ( this.reader.offset < finalOffset ) {

			indices.push( this.reader.getVariableLengthIndex() );
			// z -> -z to match three.js right handed coords
			points.push( this.reader.getFloat32(), this.reader.getFloat32(), - this.reader.getFloat32() );

		}

		if ( ! this.currentLayer.morphTargets ) this.currentLayer.morphTargets = {};

		this.currentLayer.morphTargets[ name ] = {
			indices: indices,
			points: points,
			type: type,
		};

	},

	// A list of polygons for the current layer.
	// POLS { type[ID4], ( numvert+flags[U2], vert[VX] # numvert ) * }
	parsePolygonList( length ) {

		var finalOffset = this.reader.offset + length;
		var type = this.reader.getIDTag();

		var indices = [];

		// hold a list of polygon sizes, to be split up later
		var polygonDimensions = [];

		while ( this.reader.offset < finalOffset ) {

			var numverts = this.reader.getUint16();

			//var flags = numverts & 64512; // 6 high order bits are flags - ignoring for now
			numverts = numverts & 1023; // remaining ten low order bits are vertex num
			polygonDimensions.push( numverts );

			for ( var j = 0; j < numverts; j ++ ) indices.push( this.reader.getVariableLengthIndex() );

		}

		var geometryData = {
			type: type,
			vertexIndices: indices,
			polygonDimensions: polygonDimensions,
			points: this.currentPoints
		};

		// Note: assuming that all polys will be lines or points if the first is
		if ( polygonDimensions[ 0 ] === 1 ) geometryData.type = 'points';
		else if ( polygonDimensions[ 0 ] === 2 ) geometryData.type = 'lines';

		this.currentLayer.geometry = geometryData;

	},

	// Lists the tag strings that can be associated with polygons by the PTAG chunk.
	// TAGS { tag-string[S0] * }
	parseTagStrings( length ) {

		this.tree.tags = this.reader.getStringArray( length );

	},

	// Associates tags of a given type with polygons in the most recent POLS chunk.
	// PTAG { type[ID4], ( poly[VX], tag[U2] ) * }
	parsePolygonTagMapping( length ) {

		var finalOffset = this.reader.offset + length;
		var type = this.reader.getIDTag();
		if ( type === 'SURF' ) this.parseMaterialIndices( finalOffset );
		else { //PART, SMGP, COLR not supported

			this.reader.skip( length - 4 );

		}

	},

	parseMaterialIndices( finalOffset ) {

		// array holds polygon index followed by material index
		this.currentLayer.geometry.materialIndices = [];

		while ( this.reader.offset < finalOffset ) {

			var polygonIndex = this.reader.getVariableLengthIndex();
			var materialIndex = this.reader.getUint16();

			this.currentLayer.geometry.materialIndices.push( polygonIndex, materialIndex );

		}

	},

	parseUnknownCHUNK( blockID, length ) {

		console.warn( 'LWOLoader: unknown chunk type: ' + blockID + ' length: ' + length );

		// print the chunk plus some bytes padding either side
		// printBuffer( this.reader.dv.buffer, this.reader.offset - 20, length + 40 );

		var data = this.reader.getString( length );

		this.currentForm[ blockID ] = data;

	}

};

function DataViewReader( buffer ) {

	this.dv = new DataView( buffer );
	this.offset = 0;

}

DataViewReader.prototype = {

	constructor: DataViewReader,

	size: function () {

		return this.dv.buffer.byteLength;

	},

	setOffset( offset ) {

		if ( offset > 0 && offset < this.dv.buffer.byteLength ) {

			this.offset = offset;

		} else {

			console.error( 'LWOLoader: invalid buffer offset' );

		}

	},

	endOfFile: function () {

		if ( this.offset >= this.size() ) return true;
		return false;

	},

	skip: function ( length ) {

		this.offset += length;

	},

	getUint8: function () {

		var value = this.dv.getUint8( this.offset );
		this.offset += 1;
		return value;

	},

	getUint16: function () {

		var value = this.dv.getUint16( this.offset );
		this.offset += 2;
		return value;

	},

	getInt32: function () {

		var value = this.dv.getInt32( this.offset, false );
		this.offset += 4;
		return value;

	},

	getUint32: function () {

		var value = this.dv.getUint32( this.offset, false );
		this.offset += 4;
		return value;

	},

	getUint64: function () {

		var low, high;

		high = this.getUint32();
		low = this.getUint32();
		return high * 0x100000000 + low;

	},

	getFloat32: function () {

		var value = this.dv.getFloat32( this.offset, false );
		this.offset += 4;
		return value;

	},

	getFloat32Array: function ( size ) {

		var a = [];

		for ( var i = 0; i < size; i ++ ) {

			a.push( this.getFloat32() );

		}

		return a;

	},

	getFloat64: function () {

		var value = this.dv.getFloat64( this.offset, this.littleEndian );
		this.offset += 8;
		return value;

	},

	getFloat64Array: function ( size ) {

		var a = [];

		for ( var i = 0; i < size; i ++ ) {

			a.push( this.getFloat64() );

		}

		return a;

	},

	// get variable-length index data type
	// VX ::= index[U2] | (index + 0xFF000000)[U4]
	// If the index value is less than 65,280 (0xFF00),then VX === U2
	// otherwise VX === U4 with bits 24-31 set
	// When reading an index, if the first byte encountered is 255 (0xFF), then
	// the four-byte form is being used and the first byte should be discarded or masked out.
	getVariableLengthIndex() {

		var firstByte = this.getUint8();

		if ( firstByte === 255 ) {

			return this.getUint8() * 65536 + this.getUint8() * 256 + this.getUint8();

		}

		return firstByte * 256 + this.getUint8();

	},

	// An ID tag is a sequence of 4 bytes containing 7-bit ASCII values
	getIDTag() {

		return this.getString( 4 );

	},

	getString: function ( size ) {

		if ( size === 0 ) return;

		// note: safari 9 doesn't support Uint8Array.indexOf; create intermediate array instead
		var a = [];

		if ( size ) {

			for ( var i = 0; i < size; i ++ ) {

				a[ i ] = this.getUint8();

			}

		} else {

			var currentChar;
			var len = 0;

			while ( currentChar !== 0 ) {

				currentChar = this.getUint8();
				if ( currentChar !== 0 ) a.push( currentChar );
				len ++;

			}

			if ( ! isEven( len + 1 ) ) this.getUint8(); // if string with terminating nullbyte is uneven, extra nullbyte is added

		}

		return three.LoaderUtils.decodeText( new Uint8Array( a ) );

	},

	getStringArray: function ( size ) {

		var a = this.getString( size );
		a = a.split( '\0' );

		return a.filter( Boolean ); // return array with any empty strings removed

	}

};

// ************** DEBUGGER  **************

function Debugger( ) {

	this.active = false;
	this.depth = 0;
	this.formList = [];

}

Debugger.prototype = {

	constructor: Debugger,

	enable: function () {

		this.active = true;

	},

	log: function () {

		if ( ! this.active ) return;

		var nodeType;

		switch ( this.node ) {

			case 0:
				nodeType = 'FORM';
				break;

			case 1:
				nodeType = 'CHK';
				break;

			case 2:
				nodeType = 'S-CHK';
				break;

		}

		console.log(
			'| '.repeat( this.depth ) +
			nodeType,
			this.nodeID,
			`( ${this.offset} ) -> ( ${this.dataOffset + this.length} )`,
			( ( this.node == 0 ) ? ' {' : '' ),
			( ( this.skipped ) ? 'SKIPPED' : '' ),
			( ( this.node == 0 && this.skipped ) ? '}' : '' )
		);

		if ( this.node == 0 && ! this.skipped ) {

			this.depth += 1;
			this.formList.push( this.dataOffset + this.length );

		}

		this.skipped = false;

	},

	closeForms: function () {

		if ( ! this.active ) return;

		for ( var i = this.formList.length - 1; i >= 0; i -- ) {

			if ( this.offset >= this.formList[ i ] ) {

				this.depth -= 1;
				console.log( '| '.repeat( this.depth ) + '}' );
				this.formList.splice( - 1, 1 );

			}

		}

	}

};

// ************** UTILITY FUNCTIONS **************

function isEven( num ) {

	return num % 2;

}

// calculate the length of the string in the buffer
// this will be string.length + nullbyte + optional padbyte to make the length even
function stringOffset( string ) {

	return string.length + 1 + ( isEven( string.length + 1 ) ? 1 : 0 );

}

// for testing purposes, dump buffer to console
// printBuffer( this.reader.dv.buffer, this.reader.offset, length );
function printBuffer( buffer, from, to ) {

	console.log( three.LoaderUtils.decodeText( new Uint8Array( buffer, from, to ) ) );

}

/**
 * @version 1.1.1
 *
 * @desc Load files in LWO3 and LWO2 format on Three.js
 *
 * LWO3 format specification:
 * 	http://static.lightwave3d.com/sdk/2018/html/filefmts/lwo3.html
 *
 * LWO2 format specification:
 * 	http://static.lightwave3d.com/sdk/2018/html/filefmts/lwo2.html
 *
 **/

let _lwoTree;

class LWOLoader extends three.Loader {

	constructor( manager, parameters = {} ) {

		super( manager );

		this.resourcePath = ( parameters.resourcePath !== undefined ) ? parameters.resourcePath : '';

	}

	load( url, onLoad, onProgress, onError ) {

		const scope = this;

		const path = ( scope.path === '' ) ? extractParentUrl( url, 'Objects' ) : scope.path;

		// give the mesh a default name based on the filename
		const modelName = url.split( path ).pop().split( '.' )[ 0 ];

		const loader = new three.FileLoader( this.manager );
		loader.setPath( scope.path );
		loader.setResponseType( 'arraybuffer' );

		loader.load( url, function ( buffer ) {

			// console.time( 'Total parsing: ' );

			try {

				onLoad( scope.parse( buffer, path, modelName ) );

			} catch ( e ) {

				if ( onError ) {

					onError( e );

				} else {

					console.error( e );

				}

				scope.manager.itemError( url );

			}

			// console.timeEnd( 'Total parsing: ' );

		}, onProgress, onError );

	}

	parse( iffBuffer, path, modelName ) {

		_lwoTree = new IFFParser().parse( iffBuffer );

		// console.log( 'lwoTree', lwoTree );

		const textureLoader = new three.TextureLoader( this.manager ).setPath( this.resourcePath || path ).setCrossOrigin( this.crossOrigin );

		return new LWOTreeParser( textureLoader ).parse( modelName );

	}

}

// Parse the lwoTree object
class LWOTreeParser {

	constructor( textureLoader ) {

		this.textureLoader = textureLoader;

	}

	parse( modelName ) {

		this.materials = new MaterialParser( this.textureLoader ).parse();
		this.defaultLayerName = modelName;

		this.meshes = this.parseLayers();

		return {
			materials: this.materials,
			meshes: this.meshes,
		};

	}

	parseLayers() {

		// array of all meshes for building hierarchy
		const meshes = [];

		// final array containing meshes with scene graph hierarchy set up
		const finalMeshes = [];

		const geometryParser = new GeometryParser();

		const scope = this;
		_lwoTree.layers.forEach( function ( layer ) {

			const geometry = geometryParser.parse( layer.geometry, layer );

			const mesh = scope.parseMesh( geometry, layer );

			meshes[ layer.number ] = mesh;

			if ( layer.parent === - 1 ) finalMeshes.push( mesh );
			else meshes[ layer.parent ].add( mesh );


		} );

		this.applyPivots( finalMeshes );

		return finalMeshes;

	}

	parseMesh( geometry, layer ) {

		let mesh;

		const materials = this.getMaterials( geometry.userData.matNames, layer.geometry.type );

		this.duplicateUVs( geometry, materials );

		if ( layer.geometry.type === 'points' ) mesh = new three.Points( geometry, materials );
		else if ( layer.geometry.type === 'lines' ) mesh = new three.LineSegments( geometry, materials );
		else mesh = new three.Mesh( geometry, materials );

		if ( layer.name ) mesh.name = layer.name;
		else mesh.name = this.defaultLayerName + '_layer_' + layer.number;

		mesh.userData.pivot = layer.pivot;

		return mesh;

	}

	// TODO: may need to be reversed in z to convert LWO to three.js coordinates
	applyPivots( meshes ) {

		meshes.forEach( function ( mesh ) {

			mesh.traverse( function ( child ) {

				const pivot = child.userData.pivot;

				child.position.x += pivot[ 0 ];
				child.position.y += pivot[ 1 ];
				child.position.z += pivot[ 2 ];

				if ( child.parent ) {

					const parentPivot = child.parent.userData.pivot;

					child.position.x -= parentPivot[ 0 ];
					child.position.y -= parentPivot[ 1 ];
					child.position.z -= parentPivot[ 2 ];

				}

			} );

		} );

	}

	getMaterials( namesArray, type ) {

		const materials = [];

		const scope = this;

		namesArray.forEach( function ( name, i ) {

			materials[ i ] = scope.getMaterialByName( name );

		} );

		// convert materials to line or point mats if required
		if ( type === 'points' || type === 'lines' ) {

			materials.forEach( function ( mat, i ) {

				const spec = {
					color: mat.color,
				};

				if ( type === 'points' ) {

					spec.size = 0.1;
					spec.map = mat.map;
					materials[ i ] = new three.PointsMaterial( spec );

				} else if ( type === 'lines' ) {

					materials[ i ] = new three.LineBasicMaterial( spec );

				}

			} );

		}

		// if there is only one material, return that directly instead of array
		const filtered = materials.filter( Boolean );
		if ( filtered.length === 1 ) return filtered[ 0 ];

		return materials;

	}

	getMaterialByName( name ) {

		return this.materials.filter( function ( m ) {

			return m.name === name;

		} )[ 0 ];

	}

	// If the material has an aoMap, duplicate UVs
	duplicateUVs( geometry, materials ) {

		let duplicateUVs = false;

		if ( ! Array.isArray( materials ) ) {

			if ( materials.aoMap ) duplicateUVs = true;

		} else {

			materials.forEach( function ( material ) {

				if ( material.aoMap ) duplicateUVs = true;

			} );

		}

		if ( ! duplicateUVs ) return;

		geometry.setAttribute( 'uv2', new three.BufferAttribute( geometry.attributes.uv.array, 2 ) );

	}

}

class MaterialParser {

	constructor( textureLoader ) {

		this.textureLoader = textureLoader;

	}

	parse() {

		const materials = [];
		this.textures = {};

		for ( const name in _lwoTree.materials ) {

			if ( _lwoTree.format === 'LWO3' ) {

				materials.push( this.parseMaterial( _lwoTree.materials[ name ], name, _lwoTree.textures ) );

			} else if ( _lwoTree.format === 'LWO2' ) {

				materials.push( this.parseMaterialLwo2( _lwoTree.materials[ name ], name, _lwoTree.textures ) );

			}

		}

		return materials;

	}

	parseMaterial( materialData, name, textures ) {

		let params = {
			name: name,
			side: this.getSide( materialData.attributes ),
			flatShading: this.getSmooth( materialData.attributes ),
		};

		const connections = this.parseConnections( materialData.connections, materialData.nodes );

		const maps = this.parseTextureNodes( connections.maps );

		this.parseAttributeImageMaps( connections.attributes, textures, maps, materialData.maps );

		const attributes = this.parseAttributes( connections.attributes, maps );

		this.parseEnvMap( connections, maps, attributes );

		params = Object.assign( maps, params );
		params = Object.assign( params, attributes );

		const materialType = this.getMaterialType( connections.attributes );

		return new materialType( params );

	}

	parseMaterialLwo2( materialData, name/*, textures*/ ) {

		let params = {
			name: name,
			side: this.getSide( materialData.attributes ),
			flatShading: this.getSmooth( materialData.attributes ),
		};

		const attributes = this.parseAttributes( materialData.attributes, {} );
		params = Object.assign( params, attributes );
		return new three.MeshPhongMaterial( params );

	}

	// Note: converting from left to right handed coords by switching x -> -x in vertices, and
	// then switching mat FrontSide -> BackSide
	// NB: this means that FrontSide and BackSide have been switched!
	getSide( attributes ) {

		if ( ! attributes.side ) return three.BackSide;

		switch ( attributes.side ) {

			case 0:
			case 1:
				return three.BackSide;
			case 2: return three.FrontSide;
			case 3: return three.DoubleSide;

		}

	}

	getSmooth( attributes ) {

		if ( ! attributes.smooth ) return true;
		return ! attributes.smooth;

	}

	parseConnections( connections, nodes ) {

		const materialConnections = {
			maps: {}
		};

		const inputName = connections.inputName;
		const inputNodeName = connections.inputNodeName;
		const nodeName = connections.nodeName;

		const scope = this;
		inputName.forEach( function ( name, index ) {

			if ( name === 'Material' ) {

				const matNode = scope.getNodeByRefName( inputNodeName[ index ], nodes );
				materialConnections.attributes = matNode.attributes;
				materialConnections.envMap = matNode.fileName;
				materialConnections.name = inputNodeName[ index ];

			}

		} );

		nodeName.forEach( function ( name, index ) {

			if ( name === materialConnections.name ) {

				materialConnections.maps[ inputName[ index ] ] = scope.getNodeByRefName( inputNodeName[ index ], nodes );

			}

		} );

		return materialConnections;

	}

	getNodeByRefName( refName, nodes ) {

		for ( const name in nodes ) {

			if ( nodes[ name ].refName === refName ) return nodes[ name ];

		}

	}

	parseTextureNodes( textureNodes ) {

		const maps = {};

		for ( const name in textureNodes ) {

			const node = textureNodes[ name ];
			const path = node.fileName;

			if ( ! path ) return;

			const texture = this.loadTexture( path );

			if ( node.widthWrappingMode !== undefined ) texture.wrapS = this.getWrappingType( node.widthWrappingMode );
			if ( node.heightWrappingMode !== undefined ) texture.wrapT = this.getWrappingType( node.heightWrappingMode );

			switch ( name ) {

				case 'Color':
					maps.map = texture;
					break;
				case 'Roughness':
					maps.roughnessMap = texture;
					maps.roughness = 0.5;
					break;
				case 'Specular':
					maps.specularMap = texture;
					maps.specular = 0xffffff;
					break;
				case 'Luminous':
					maps.emissiveMap = texture;
					maps.emissive = 0x808080;
					break;
				case 'Luminous Color':
					maps.emissive = 0x808080;
					break;
				case 'Metallic':
					maps.metalnessMap = texture;
					maps.metalness = 0.5;
					break;
				case 'Transparency':
				case 'Alpha':
					maps.alphaMap = texture;
					maps.transparent = true;
					break;
				case 'Normal':
					maps.normalMap = texture;
					if ( node.amplitude !== undefined ) maps.normalScale = new three.Vector2( node.amplitude, node.amplitude );
					break;
				case 'Bump':
					maps.bumpMap = texture;
					break;

			}

		}

		// LWO BSDF materials can have both spec and rough, but this is not valid in three
		if ( maps.roughnessMap && maps.specularMap ) delete maps.specularMap;

		return maps;

	}

	// maps can also be defined on individual material attributes, parse those here
	// This occurs on Standard (Phong) surfaces
	parseAttributeImageMaps( attributes, textures, maps ) {

		for ( const name in attributes ) {

			const attribute = attributes[ name ];

			if ( attribute.maps ) {

				const mapData = attribute.maps[ 0 ];

				const path = this.getTexturePathByIndex( mapData.imageIndex, textures );
				if ( ! path ) return;

				const texture = this.loadTexture( path );

				if ( mapData.wrap !== undefined ) texture.wrapS = this.getWrappingType( mapData.wrap.w );
				if ( mapData.wrap !== undefined ) texture.wrapT = this.getWrappingType( mapData.wrap.h );

				switch ( name ) {

					case 'Color':
						maps.map = texture;
						break;
					case 'Diffuse':
						maps.aoMap = texture;
						break;
					case 'Roughness':
						maps.roughnessMap = texture;
						maps.roughness = 1;
						break;
					case 'Specular':
						maps.specularMap = texture;
						maps.specular = 0xffffff;
						break;
					case 'Luminosity':
						maps.emissiveMap = texture;
						maps.emissive = 0x808080;
						break;
					case 'Metallic':
						maps.metalnessMap = texture;
						maps.metalness = 1;
						break;
					case 'Transparency':
					case 'Alpha':
						maps.alphaMap = texture;
						maps.transparent = true;
						break;
					case 'Normal':
						maps.normalMap = texture;
						break;
					case 'Bump':
						maps.bumpMap = texture;
						break;

				}

			}

		}

	}

	parseAttributes( attributes, maps ) {

		const params = {};

		// don't use color data if color map is present
		if ( attributes.Color && ! maps.map ) {

			params.color = new three.Color().fromArray( attributes.Color.value );

		} else params.color = new three.Color();


		if ( attributes.Transparency && attributes.Transparency.value !== 0 ) {

			params.opacity = 1 - attributes.Transparency.value;
			params.transparent = true;

		}

		if ( attributes[ 'Bump Height' ] ) params.bumpScale = attributes[ 'Bump Height' ].value * 0.1;

		if ( attributes[ 'Refraction Index' ] ) params.refractionRatio = 1 / attributes[ 'Refraction Index' ].value;

		this.parsePhysicalAttributes( params, attributes, maps );
		this.parseStandardAttributes( params, attributes, maps );
		this.parsePhongAttributes( params, attributes, maps );

		return params;

	}

	parsePhysicalAttributes( params, attributes/*, maps*/ ) {

		if ( attributes.Clearcoat && attributes.Clearcoat.value > 0 ) {

			params.clearcoat = attributes.Clearcoat.value;

			if ( attributes[ 'Clearcoat Gloss' ] ) {

				params.clearcoatRoughness = 0.5 * ( 1 - attributes[ 'Clearcoat Gloss' ].value );

			}

		}

	}

	parseStandardAttributes( params, attributes, maps ) {


		if ( attributes.Luminous ) {

			params.emissiveIntensity = attributes.Luminous.value;

			if ( attributes[ 'Luminous Color' ] && ! maps.emissive ) {

				params.emissive = new three.Color().fromArray( attributes[ 'Luminous Color' ].value );

			} else {

				params.emissive = new three.Color( 0x808080 );

			}

		}

		if ( attributes.Roughness && ! maps.roughnessMap ) params.roughness = attributes.Roughness.value;
		if ( attributes.Metallic && ! maps.metalnessMap ) params.metalness = attributes.Metallic.value;

	}

	parsePhongAttributes( params, attributes, maps ) {

		if ( attributes.Diffuse ) params.color.multiplyScalar( attributes.Diffuse.value );

		if ( attributes.Reflection ) {

			params.reflectivity = attributes.Reflection.value;
			params.combine = three.AddOperation;

		}

		if ( attributes.Luminosity ) {

			params.emissiveIntensity = attributes.Luminosity.value;

			if ( ! maps.emissiveMap && ! maps.map ) {

				params.emissive = params.color;

			} else {

				params.emissive = new three.Color( 0x808080 );

			}

		}

		// parse specular if there is no roughness - we will interpret the material as 'Phong' in this case
		if ( ! attributes.Roughness && attributes.Specular && ! maps.specularMap ) {

			if ( attributes[ 'Color Highlight' ] ) {

				params.specular = new three.Color().setScalar( attributes.Specular.value ).lerp( params.color.clone().multiplyScalar( attributes.Specular.value ), attributes[ 'Color Highlight' ].value );

			} else {

				params.specular = new three.Color().setScalar( attributes.Specular.value );

			}

		}

		if ( params.specular && attributes.Glossiness ) params.shininess = 7 + Math.pow( 2, attributes.Glossiness.value * 12 + 2 );

	}

	parseEnvMap( connections, maps, attributes ) {

		if ( connections.envMap ) {

			const envMap = this.loadTexture( connections.envMap );

			if ( attributes.transparent && attributes.opacity < 0.999 ) {

				envMap.mapping = three.EquirectangularRefractionMapping;

				// Reflectivity and refraction mapping don't work well together in Phong materials
				if ( attributes.reflectivity !== undefined ) {

					delete attributes.reflectivity;
					delete attributes.combine;

				}

				if ( attributes.metalness !== undefined ) {

					delete attributes.metalness;

				}

			} else envMap.mapping = three.EquirectangularReflectionMapping;

			maps.envMap = envMap;

		}

	}

	// get texture defined at top level by its index
	getTexturePathByIndex( index ) {

		let fileName = '';

		if ( ! _lwoTree.textures ) return fileName;

		_lwoTree.textures.forEach( function ( texture ) {

			if ( texture.index === index ) fileName = texture.fileName;

		} );

		return fileName;

	}

	loadTexture( path ) {

		if ( ! path ) return null;

		const texture = this.textureLoader.load(
			path,
			undefined,
			undefined,
			function () {

				console.warn( 'LWOLoader: non-standard resource hierarchy. Use \`resourcePath\` parameter to specify root content directory.' );

			}
		);

		return texture;

	}

	// 0 = Reset, 1 = Repeat, 2 = Mirror, 3 = Edge
	getWrappingType( num ) {

		switch ( num ) {

			case 0:
				console.warn( 'LWOLoader: "Reset" texture wrapping type is not supported in three.js' );
				return three.ClampToEdgeWrapping;
			case 1: return three.RepeatWrapping;
			case 2: return three.MirroredRepeatWrapping;
			case 3: return three.ClampToEdgeWrapping;

		}

	}

	getMaterialType( nodeData ) {

		if ( nodeData.Clearcoat && nodeData.Clearcoat.value > 0 ) return three.MeshPhysicalMaterial;
		if ( nodeData.Roughness ) return three.MeshStandardMaterial;
		return three.MeshPhongMaterial;

	}

}

class GeometryParser {

	parse( geoData, layer ) {

		const geometry = new three.BufferGeometry();

		geometry.setAttribute( 'position', new three.Float32BufferAttribute( geoData.points, 3 ) );

		const indices = this.splitIndices( geoData.vertexIndices, geoData.polygonDimensions );
		geometry.setIndex( indices );

		this.parseGroups( geometry, geoData );

		geometry.computeVertexNormals();

		this.parseUVs( geometry, layer, indices );
		this.parseMorphTargets( geometry, layer, indices );

		// TODO: z may need to be reversed to account for coordinate system change
		geometry.translate( - layer.pivot[ 0 ], - layer.pivot[ 1 ], - layer.pivot[ 2 ] );

		// let userData = geometry.userData;
		// geometry = geometry.toNonIndexed()
		// geometry.userData = userData;

		return geometry;

	}

	// split quads into tris
	splitIndices( indices, polygonDimensions ) {

		const remappedIndices = [];

		let i = 0;
		polygonDimensions.forEach( function ( dim ) {

			if ( dim < 4 ) {

				for ( let k = 0; k < dim; k ++ ) remappedIndices.push( indices[ i + k ] );

			} else if ( dim === 4 ) {

				remappedIndices.push(
					indices[ i ],
					indices[ i + 1 ],
					indices[ i + 2 ],

					indices[ i ],
					indices[ i + 2 ],
					indices[ i + 3 ]

				);

			} else if ( dim > 4 ) {

				for ( let k = 1; k < dim - 1; k ++ ) {

					remappedIndices.push( indices[ i ], indices[ i + k ], indices[ i + k + 1 ] );

				}

				console.warn( 'LWOLoader: polygons with greater than 4 sides are not supported' );

			}

			i += dim;

		} );

		return remappedIndices;

	}

	// NOTE: currently ignoring poly indices and assuming that they are intelligently ordered
	parseGroups( geometry, geoData ) {

		const tags = _lwoTree.tags;
		const matNames = [];

		let elemSize = 3;
		if ( geoData.type === 'lines' ) elemSize = 2;
		if ( geoData.type === 'points' ) elemSize = 1;

		const remappedIndices = this.splitMaterialIndices( geoData.polygonDimensions, geoData.materialIndices );

		let indexNum = 0; // create new indices in numerical order
		const indexPairs = {}; // original indices mapped to numerical indices

		let prevMaterialIndex;
		let materialIndex;

		let prevStart = 0;
		let currentCount = 0;

		for ( let i = 0; i < remappedIndices.length; i += 2 ) {

			materialIndex = remappedIndices[ i + 1 ];

			if ( i === 0 ) matNames[ indexNum ] = tags[ materialIndex ];

			if ( prevMaterialIndex === undefined ) prevMaterialIndex = materialIndex;

			if ( materialIndex !== prevMaterialIndex ) {

				let currentIndex;
				if ( indexPairs[ tags[ prevMaterialIndex ] ] ) {

					currentIndex = indexPairs[ tags[ prevMaterialIndex ] ];

				} else {

					currentIndex = indexNum;
					indexPairs[ tags[ prevMaterialIndex ] ] = indexNum;
					matNames[ indexNum ] = tags[ prevMaterialIndex ];
					indexNum ++;

				}

				geometry.addGroup( prevStart, currentCount, currentIndex );

				prevStart += currentCount;

				prevMaterialIndex = materialIndex;
				currentCount = 0;

			}

			currentCount += elemSize;

		}

		// the loop above doesn't add the last group, do that here.
		if ( geometry.groups.length > 0 ) {

			let currentIndex;
			if ( indexPairs[ tags[ materialIndex ] ] ) {

				currentIndex = indexPairs[ tags[ materialIndex ] ];

			} else {

				currentIndex = indexNum;
				indexPairs[ tags[ materialIndex ] ] = indexNum;
				matNames[ indexNum ] = tags[ materialIndex ];

			}

			geometry.addGroup( prevStart, currentCount, currentIndex );

		}

		// Mat names from TAGS chunk, used to build up an array of materials for this geometry
		geometry.userData.matNames = matNames;

	}

	splitMaterialIndices( polygonDimensions, indices ) {

		const remappedIndices = [];

		polygonDimensions.forEach( function ( dim, i ) {

			if ( dim <= 3 ) {

				remappedIndices.push( indices[ i * 2 ], indices[ i * 2 + 1 ] );

			} else if ( dim === 4 ) {

				remappedIndices.push( indices[ i * 2 ], indices[ i * 2 + 1 ], indices[ i * 2 ], indices[ i * 2 + 1 ] );

			} else {

				 // ignore > 4 for now
				for ( let k = 0; k < dim - 2; k ++ ) {

					remappedIndices.push( indices[ i * 2 ], indices[ i * 2 + 1 ] );

				}

			}

		} );

		return remappedIndices;

	}

	// UV maps:
	// 1: are defined via index into an array of points, not into a geometry
	// - the geometry is also defined by an index into this array, but the indexes may not match
	// 2: there can be any number of UV maps for a single geometry. Here these are combined,
	// 	with preference given to the first map encountered
	// 3: UV maps can be partial - that is, defined for only a part of the geometry
	// 4: UV maps can be VMAP or VMAD (discontinuous, to allow for seams). In practice, most
	// UV maps are defined as partially VMAP and partially VMAD
	// VMADs are currently not supported
	parseUVs( geometry, layer ) {

		// start by creating a UV map set to zero for the whole geometry
		const remappedUVs = Array.from( Array( geometry.attributes.position.count * 2 ), function () {

			return 0;

		} );

		for ( const name in layer.uvs ) {

			const uvs = layer.uvs[ name ].uvs;
			const uvIndices = layer.uvs[ name ].uvIndices;

			uvIndices.forEach( function ( i, j ) {

				remappedUVs[ i * 2 ] = uvs[ j * 2 ];
				remappedUVs[ i * 2 + 1 ] = uvs[ j * 2 + 1 ];

			} );

		}

		geometry.setAttribute( 'uv', new three.Float32BufferAttribute( remappedUVs, 2 ) );

	}

	parseMorphTargets( geometry, layer ) {

		let num = 0;
		for ( const name in layer.morphTargets ) {

			const remappedPoints = geometry.attributes.position.array.slice();

			if ( ! geometry.morphAttributes.position ) geometry.morphAttributes.position = [];

			const morphPoints = layer.morphTargets[ name ].points;
			const morphIndices = layer.morphTargets[ name ].indices;
			const type = layer.morphTargets[ name ].type;

			morphIndices.forEach( function ( i, j ) {

				if ( type === 'relative' ) {

					remappedPoints[ i * 3 ] += morphPoints[ j * 3 ];
					remappedPoints[ i * 3 + 1 ] += morphPoints[ j * 3 + 1 ];
					remappedPoints[ i * 3 + 2 ] += morphPoints[ j * 3 + 2 ];

				} else {

					remappedPoints[ i * 3 ] = morphPoints[ j * 3 ];
					remappedPoints[ i * 3 + 1 ] = morphPoints[ j * 3 + 1 ];
					remappedPoints[ i * 3 + 2 ] = morphPoints[ j * 3 + 2 ];

				}

			} );

			geometry.morphAttributes.position[ num ] = new three.Float32BufferAttribute( remappedPoints, 3 );
			geometry.morphAttributes.position[ num ].name = name;

			num ++;

		}

		geometry.morphTargetsRelative = false;

	}

}


// ************** UTILITY FUNCTIONS **************

function extractParentUrl( url, dir ) {

	const index = url.indexOf( dir );

	if ( index === - 1 ) return './';

	return url.substr( 0, index );

}

function _optionalChain$b(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

class DemoLWOLoader extends Demo {
  
  

  async init() {
    const { scene, renderer, camera } = this.deps;
    camera.position.set(-0.7, 14.6, 43.2);
    scene.background = new three.Color(0xa0a0a0);

    const ambientLight = new three.AmbientLight(0xaaaaaa, 1.75);
    this.add(ambientLight);

    const light1 = new three.DirectionalLight(0xffffff, 1);
    light1.position.set(0, 200, 100);
    light1.castShadow = true;
    light1.shadow.camera.top = 180;
    light1.shadow.camera.bottom = -100;
    light1.shadow.camera.left = -120;
    light1.shadow.camera.right = 120;
    this.add(light1);

    const light2 = new three.DirectionalLight(0xffffff, 0.7);
    light2.position.set(-100, 200, -100);
    this.add(light2);

    const light3 = new three.DirectionalLight(0xffffff, 0.4);
    light3.position.set(100, -200, 100);
    this.add(light3);

    const light4 = new three.DirectionalLight(0xffffff, 1);
    light4.position.set(-100, -100, 100);
    this.add(light4);

    const grid = new three.GridHelper(200, 20, 0x000000, 0x000000);
    // @ts-ignore
    grid.material.opacity = 0.3;
    // @ts-ignore
    grid.material.transparent = true;
    this.add(grid);

    const loader = new LWOLoader();
    const object = (await loader.loadAsync(
      baseUrl$2 + '/models/lwo/Objects/LWO3/Demo.lwo',
    )) ;

    const phong = object.meshes[0];
    phong.position.set(-2, 12, 0);

    const standard = object.meshes[1];
    standard.position.set(2, 12, 0);

    const rocket = object.meshes[2];
    rocket.position.set(0, 10.5, -1);

    this.add(phong);
    this.add(rocket);
    this.add(standard);

    renderer.shadowMap.enabled = true;
    renderer.physicallyCorrectLights = true;
    renderer.gammaFactor = 1.18;

    this.addControl();
    this.orbitControl.target.set(1.33, 10, -6.7);
  }
  update() {
    _optionalChain$b([this, 'access', _ => _.orbitControl, 'optionalAccess', _2 => _2.update, 'call', _3 => _3()]);
  }
  dispose() {
    this.reset();
  }
}

/**
 * Loads a Wavefront .mtl file specifying materials
 */

class MTLLoader extends three.Loader {

	constructor( manager ) {

		super( manager );

	}

	/**
	 * Loads and parses a MTL asset from a URL.
	 *
	 * @param {String} url - URL to the MTL file.
	 * @param {Function} [onLoad] - Callback invoked with the loaded object.
	 * @param {Function} [onProgress] - Callback for download progress.
	 * @param {Function} [onError] - Callback for download errors.
	 *
	 * @see setPath setResourcePath
	 *
	 * @note In order for relative texture references to resolve correctly
	 * you must call setResourcePath() explicitly prior to load.
	 */
	load( url, onLoad, onProgress, onError ) {

		const scope = this;

		const path = ( this.path === '' ) ? three.LoaderUtils.extractUrlBase( url ) : this.path;

		const loader = new three.FileLoader( this.manager );
		loader.setPath( this.path );
		loader.setRequestHeader( this.requestHeader );
		loader.setWithCredentials( this.withCredentials );
		loader.load( url, function ( text ) {

			try {

				onLoad( scope.parse( text, path ) );

			} catch ( e ) {

				if ( onError ) {

					onError( e );

				} else {

					console.error( e );

				}

				scope.manager.itemError( url );

			}

		}, onProgress, onError );

	}

	setMaterialOptions( value ) {

		this.materialOptions = value;
		return this;

	}

	/**
	 * Parses a MTL file.
	 *
	 * @param {String} text - Content of MTL file
	 * @return {MaterialCreator}
	 *
	 * @see setPath setResourcePath
	 *
	 * @note In order for relative texture references to resolve correctly
	 * you must call setResourcePath() explicitly prior to parse.
	 */
	parse( text, path ) {

		const lines = text.split( '\n' );
		let info = {};
		const delimiter_pattern = /\s+/;
		const materialsInfo = {};

		for ( let i = 0; i < lines.length; i ++ ) {

			let line = lines[ i ];
			line = line.trim();

			if ( line.length === 0 || line.charAt( 0 ) === '#' ) {

				// Blank line or comment ignore
				continue;

			}

			const pos = line.indexOf( ' ' );

			let key = ( pos >= 0 ) ? line.substring( 0, pos ) : line;
			key = key.toLowerCase();

			let value = ( pos >= 0 ) ? line.substring( pos + 1 ) : '';
			value = value.trim();

			if ( key === 'newmtl' ) {

				// New material

				info = { name: value };
				materialsInfo[ value ] = info;

			} else {

				if ( key === 'ka' || key === 'kd' || key === 'ks' || key === 'ke' ) {

					const ss = value.split( delimiter_pattern, 3 );
					info[ key ] = [ parseFloat( ss[ 0 ] ), parseFloat( ss[ 1 ] ), parseFloat( ss[ 2 ] ) ];

				} else {

					info[ key ] = value;

				}

			}

		}

		const materialCreator = new MaterialCreator( this.resourcePath || path, this.materialOptions );
		materialCreator.setCrossOrigin( this.crossOrigin );
		materialCreator.setManager( this.manager );
		materialCreator.setMaterials( materialsInfo );
		return materialCreator;

	}

}

/**
 * Create a new MTLLoader.MaterialCreator
 * @param baseUrl - Url relative to which textures are loaded
 * @param options - Set of options on how to construct the materials
 *                  side: Which side to apply the material
 *                        FrontSide (default), THREE.BackSide, THREE.DoubleSide
 *                  wrap: What type of wrapping to apply for textures
 *                        RepeatWrapping (default), THREE.ClampToEdgeWrapping, THREE.MirroredRepeatWrapping
 *                  normalizeRGB: RGBs need to be normalized to 0-1 from 0-255
 *                                Default: false, assumed to be already normalized
 *                  ignoreZeroRGBs: Ignore values of RGBs (Ka,Kd,Ks) that are all 0's
 *                                  Default: false
 * @constructor
 */

class MaterialCreator {

	constructor( baseUrl = '', options = {} ) {

		this.baseUrl = baseUrl;
		this.options = options;
		this.materialsInfo = {};
		this.materials = {};
		this.materialsArray = [];
		this.nameLookup = {};

		this.crossOrigin = 'anonymous';

		this.side = ( this.options.side !== undefined ) ? this.options.side : three.FrontSide;
		this.wrap = ( this.options.wrap !== undefined ) ? this.options.wrap : three.RepeatWrapping;

	}

	setCrossOrigin( value ) {

		this.crossOrigin = value;
		return this;

	}

	setManager( value ) {

		this.manager = value;

	}

	setMaterials( materialsInfo ) {

		this.materialsInfo = this.convert( materialsInfo );
		this.materials = {};
		this.materialsArray = [];
		this.nameLookup = {};

	}

	convert( materialsInfo ) {

		if ( ! this.options ) return materialsInfo;

		const converted = {};

		for ( const mn in materialsInfo ) {

			// Convert materials info into normalized form based on options

			const mat = materialsInfo[ mn ];

			const covmat = {};

			converted[ mn ] = covmat;

			for ( const prop in mat ) {

				let save = true;
				let value = mat[ prop ];
				const lprop = prop.toLowerCase();

				switch ( lprop ) {

					case 'kd':
					case 'ka':
					case 'ks':

						// Diffuse color (color under white light) using RGB values

						if ( this.options && this.options.normalizeRGB ) {

							value = [ value[ 0 ] / 255, value[ 1 ] / 255, value[ 2 ] / 255 ];

						}

						if ( this.options && this.options.ignoreZeroRGBs ) {

							if ( value[ 0 ] === 0 && value[ 1 ] === 0 && value[ 2 ] === 0 ) {

								// ignore

								save = false;

							}

						}

						break;

				}

				if ( save ) {

					covmat[ lprop ] = value;

				}

			}

		}

		return converted;

	}

	preload() {

		for ( const mn in this.materialsInfo ) {

			this.create( mn );

		}

	}

	getIndex( materialName ) {

		return this.nameLookup[ materialName ];

	}

	getAsArray() {

		let index = 0;

		for ( const mn in this.materialsInfo ) {

			this.materialsArray[ index ] = this.create( mn );
			this.nameLookup[ mn ] = index;
			index ++;

		}

		return this.materialsArray;

	}

	create( materialName ) {

		if ( this.materials[ materialName ] === undefined ) {

			this.createMaterial_( materialName );

		}

		return this.materials[ materialName ];

	}

	createMaterial_( materialName ) {

		// Create material

		const scope = this;
		const mat = this.materialsInfo[ materialName ];
		const params = {

			name: materialName,
			side: this.side

		};

		function resolveURL( baseUrl, url ) {

			if ( typeof url !== 'string' || url === '' )
				return '';

			// Absolute URL
			if ( /^https?:\/\//i.test( url ) ) return url;

			return baseUrl + url;

		}

		function setMapForType( mapType, value ) {

			if ( params[ mapType ] ) return; // Keep the first encountered texture

			const texParams = scope.getTextureParams( value, params );
			const map = scope.loadTexture( resolveURL( scope.baseUrl, texParams.url ) );

			map.repeat.copy( texParams.scale );
			map.offset.copy( texParams.offset );

			map.wrapS = scope.wrap;
			map.wrapT = scope.wrap;

			params[ mapType ] = map;

		}

		for ( const prop in mat ) {

			const value = mat[ prop ];
			let n;

			if ( value === '' ) continue;

			switch ( prop.toLowerCase() ) {

				// Ns is material specular exponent

				case 'kd':

					// Diffuse color (color under white light) using RGB values

					params.color = new three.Color().fromArray( value );

					break;

				case 'ks':

					// Specular color (color when light is reflected from shiny surface) using RGB values
					params.specular = new three.Color().fromArray( value );

					break;

				case 'ke':

					// Emissive using RGB values
					params.emissive = new three.Color().fromArray( value );

					break;

				case 'map_kd':

					// Diffuse texture map

					setMapForType( 'map', value );

					break;

				case 'map_ks':

					// Specular map

					setMapForType( 'specularMap', value );

					break;

				case 'map_ke':

					// Emissive map

					setMapForType( 'emissiveMap', value );

					break;

				case 'norm':

					setMapForType( 'normalMap', value );

					break;

				case 'map_bump':
				case 'bump':

					// Bump texture map

					setMapForType( 'bumpMap', value );

					break;

				case 'map_d':

					// Alpha map

					setMapForType( 'alphaMap', value );
					params.transparent = true;

					break;

				case 'ns':

					// The specular exponent (defines the focus of the specular highlight)
					// A high exponent results in a tight, concentrated highlight. Ns values normally range from 0 to 1000.

					params.shininess = parseFloat( value );

					break;

				case 'd':
					n = parseFloat( value );

					if ( n < 1 ) {

						params.opacity = n;
						params.transparent = true;

					}

					break;

				case 'tr':
					n = parseFloat( value );

					if ( this.options && this.options.invertTrProperty ) n = 1 - n;

					if ( n > 0 ) {

						params.opacity = 1 - n;
						params.transparent = true;

					}

					break;

			}

		}

		this.materials[ materialName ] = new three.MeshPhongMaterial( params );
		return this.materials[ materialName ];

	}

	getTextureParams( value, matParams ) {

		const texParams = {

			scale: new three.Vector2( 1, 1 ),
			offset: new three.Vector2( 0, 0 )

		 };

		const items = value.split( /\s+/ );
		let pos;

		pos = items.indexOf( '-bm' );

		if ( pos >= 0 ) {

			matParams.bumpScale = parseFloat( items[ pos + 1 ] );
			items.splice( pos, 2 );

		}

		pos = items.indexOf( '-s' );

		if ( pos >= 0 ) {

			texParams.scale.set( parseFloat( items[ pos + 1 ] ), parseFloat( items[ pos + 2 ] ) );
			items.splice( pos, 4 ); // we expect 3 parameters here!

		}

		pos = items.indexOf( '-o' );

		if ( pos >= 0 ) {

			texParams.offset.set( parseFloat( items[ pos + 1 ] ), parseFloat( items[ pos + 2 ] ) );
			items.splice( pos, 4 ); // we expect 3 parameters here!

		}

		texParams.url = items.join( ' ' ).trim();
		return texParams;

	}

	loadTexture( url, mapping, onLoad, onProgress, onError ) {

		const manager = ( this.manager !== undefined ) ? this.manager : three.DefaultLoadingManager;
		let loader = manager.getHandler( url );

		if ( loader === null ) {

			loader = new three.TextureLoader( manager );

		}

		if ( loader.setCrossOrigin ) loader.setCrossOrigin( this.crossOrigin );

		const texture = loader.load( url, onLoad, onProgress, onError );

		if ( mapping !== undefined ) texture.mapping = mapping;

		return texture;

	}

}

class DDSLoader extends three.CompressedTextureLoader {

	constructor( manager ) {

		super( manager );

	}

	parse( buffer, loadMipmaps ) {

		const dds = { mipmaps: [], width: 0, height: 0, format: null, mipmapCount: 1 };

		// Adapted from @toji's DDS utils
		// https://github.com/toji/webgl-texture-utils/blob/master/texture-util/dds.js

		// All values and structures referenced from:
		// http://msdn.microsoft.com/en-us/library/bb943991.aspx/

		const DDS_MAGIC = 0x20534444;

		// let DDSD_CAPS = 0x1;
		// let DDSD_HEIGHT = 0x2;
		// let DDSD_WIDTH = 0x4;
		// let DDSD_PITCH = 0x8;
		// let DDSD_PIXELFORMAT = 0x1000;
		const DDSD_MIPMAPCOUNT = 0x20000;
		// let DDSD_LINEARSIZE = 0x80000;
		// let DDSD_DEPTH = 0x800000;

		// let DDSCAPS_COMPLEX = 0x8;
		// let DDSCAPS_MIPMAP = 0x400000;
		// let DDSCAPS_TEXTURE = 0x1000;

		const DDSCAPS2_CUBEMAP = 0x200;
		const DDSCAPS2_CUBEMAP_POSITIVEX = 0x400;
		const DDSCAPS2_CUBEMAP_NEGATIVEX = 0x800;
		const DDSCAPS2_CUBEMAP_POSITIVEY = 0x1000;
		const DDSCAPS2_CUBEMAP_NEGATIVEY = 0x2000;
		const DDSCAPS2_CUBEMAP_POSITIVEZ = 0x4000;
		const DDSCAPS2_CUBEMAP_NEGATIVEZ = 0x8000;
		// let DDSCAPS2_VOLUME = 0x200000;

		// let DDPF_ALPHAPIXELS = 0x1;
		// let DDPF_ALPHA = 0x2;
		const DDPF_FOURCC = 0x4;
		// let DDPF_RGB = 0x40;
		// let DDPF_YUV = 0x200;
		// let DDPF_LUMINANCE = 0x20000;

		function fourCCToInt32( value ) {

			return value.charCodeAt( 0 ) +
				( value.charCodeAt( 1 ) << 8 ) +
				( value.charCodeAt( 2 ) << 16 ) +
				( value.charCodeAt( 3 ) << 24 );

		}

		function int32ToFourCC( value ) {

			return String.fromCharCode(
				value & 0xff,
				( value >> 8 ) & 0xff,
				( value >> 16 ) & 0xff,
				( value >> 24 ) & 0xff
			);

		}

		function loadARGBMip( buffer, dataOffset, width, height ) {

			const dataLength = width * height * 4;
			const srcBuffer = new Uint8Array( buffer, dataOffset, dataLength );
			const byteArray = new Uint8Array( dataLength );
			let dst = 0;
			let src = 0;
			for ( let y = 0; y < height; y ++ ) {

				for ( let x = 0; x < width; x ++ ) {

					const b = srcBuffer[ src ]; src ++;
					const g = srcBuffer[ src ]; src ++;
					const r = srcBuffer[ src ]; src ++;
					const a = srcBuffer[ src ]; src ++;
					byteArray[ dst ] = r; dst ++;	//r
					byteArray[ dst ] = g; dst ++;	//g
					byteArray[ dst ] = b; dst ++;	//b
					byteArray[ dst ] = a; dst ++;	//a

				}

			}

			return byteArray;

		}

		const FOURCC_DXT1 = fourCCToInt32( 'DXT1' );
		const FOURCC_DXT3 = fourCCToInt32( 'DXT3' );
		const FOURCC_DXT5 = fourCCToInt32( 'DXT5' );
		const FOURCC_ETC1 = fourCCToInt32( 'ETC1' );

		const headerLengthInt = 31; // The header length in 32 bit ints

		// Offsets into the header array

		const off_magic = 0;

		const off_size = 1;
		const off_flags = 2;
		const off_height = 3;
		const off_width = 4;

		const off_mipmapCount = 7;

		const off_pfFlags = 20;
		const off_pfFourCC = 21;
		const off_RGBBitCount = 22;
		const off_RBitMask = 23;
		const off_GBitMask = 24;
		const off_BBitMask = 25;
		const off_ABitMask = 26;

		// let off_caps = 27;
		const off_caps2 = 28;
		// let off_caps3 = 29;
		// let off_caps4 = 30;

		// Parse header

		const header = new Int32Array( buffer, 0, headerLengthInt );

		if ( header[ off_magic ] !== DDS_MAGIC ) {

			console.error( 'THREE.DDSLoader.parse: Invalid magic number in DDS header.' );
			return dds;

		}

		if ( ! header[ off_pfFlags ] & DDPF_FOURCC ) {

			console.error( 'THREE.DDSLoader.parse: Unsupported format, must contain a FourCC code.' );
			return dds;

		}

		let blockBytes;

		const fourCC = header[ off_pfFourCC ];

		let isRGBAUncompressed = false;

		switch ( fourCC ) {

			case FOURCC_DXT1:

				blockBytes = 8;
				dds.format = three.RGB_S3TC_DXT1_Format;
				break;

			case FOURCC_DXT3:

				blockBytes = 16;
				dds.format = three.RGBA_S3TC_DXT3_Format;
				break;

			case FOURCC_DXT5:

				blockBytes = 16;
				dds.format = three.RGBA_S3TC_DXT5_Format;
				break;

			case FOURCC_ETC1:

				blockBytes = 8;
				dds.format = three.RGB_ETC1_Format;
				break;

			default:

				if ( header[ off_RGBBitCount ] === 32
					&& header[ off_RBitMask ] & 0xff0000
					&& header[ off_GBitMask ] & 0xff00
					&& header[ off_BBitMask ] & 0xff
					&& header[ off_ABitMask ] & 0xff000000 ) {

					isRGBAUncompressed = true;
					blockBytes = 64;
					dds.format = three.RGBAFormat;

				} else {

					console.error( 'THREE.DDSLoader.parse: Unsupported FourCC code ', int32ToFourCC( fourCC ) );
					return dds;

				}

		}

		dds.mipmapCount = 1;

		if ( header[ off_flags ] & DDSD_MIPMAPCOUNT && loadMipmaps !== false ) {

			dds.mipmapCount = Math.max( 1, header[ off_mipmapCount ] );

		}

		const caps2 = header[ off_caps2 ];
		dds.isCubemap = caps2 & DDSCAPS2_CUBEMAP ? true : false;
		if ( dds.isCubemap && (
			! ( caps2 & DDSCAPS2_CUBEMAP_POSITIVEX ) ||
			! ( caps2 & DDSCAPS2_CUBEMAP_NEGATIVEX ) ||
			! ( caps2 & DDSCAPS2_CUBEMAP_POSITIVEY ) ||
			! ( caps2 & DDSCAPS2_CUBEMAP_NEGATIVEY ) ||
			! ( caps2 & DDSCAPS2_CUBEMAP_POSITIVEZ ) ||
			! ( caps2 & DDSCAPS2_CUBEMAP_NEGATIVEZ )
		) ) {

			console.error( 'THREE.DDSLoader.parse: Incomplete cubemap faces' );
			return dds;

		}

		dds.width = header[ off_width ];
		dds.height = header[ off_height ];

		let dataOffset = header[ off_size ] + 4;

		// Extract mipmaps buffers

		const faces = dds.isCubemap ? 6 : 1;

		for ( let face = 0; face < faces; face ++ ) {

			let width = dds.width;
			let height = dds.height;

			for ( let i = 0; i < dds.mipmapCount; i ++ ) {

				let byteArray, dataLength;

				if ( isRGBAUncompressed ) {

					byteArray = loadARGBMip( buffer, dataOffset, width, height );
					dataLength = byteArray.length;

				} else {

					dataLength = Math.max( 4, width ) / 4 * Math.max( 4, height ) / 4 * blockBytes;
					byteArray = new Uint8Array( buffer, dataOffset, dataLength );

				}

				const mipmap = { 'data': byteArray, 'width': width, 'height': height };
				dds.mipmaps.push( mipmap );

				dataOffset += dataLength;

				width = Math.max( width >> 1, 1 );
				height = Math.max( height >> 1, 1 );

			}

		}

		return dds;

	}

}

// o object_name | g group_name
const _object_pattern = /^[og]\s*(.+)?/;
// mtllib file_reference
const _material_library_pattern = /^mtllib /;
// usemtl material_name
const _material_use_pattern = /^usemtl /;
// usemap map_name
const _map_use_pattern = /^usemap /;

const _vA = new three.Vector3();
const _vB = new three.Vector3();
const _vC = new three.Vector3();

const _ab = new three.Vector3();
const _cb = new three.Vector3();

function ParserState() {

	const state = {
		objects: [],
		object: {},

		vertices: [],
		normals: [],
		colors: [],
		uvs: [],

		materials: {},
		materialLibraries: [],

		startObject: function ( name, fromDeclaration ) {

			// If the current object (initial from reset) is not from a g/o declaration in the parsed
			// file. We need to use it for the first parsed g/o to keep things in sync.
			if ( this.object && this.object.fromDeclaration === false ) {

				this.object.name = name;
				this.object.fromDeclaration = ( fromDeclaration !== false );
				return;

			}

			const previousMaterial = ( this.object && typeof this.object.currentMaterial === 'function' ? this.object.currentMaterial() : undefined );

			if ( this.object && typeof this.object._finalize === 'function' ) {

				this.object._finalize( true );

			}

			this.object = {
				name: name || '',
				fromDeclaration: ( fromDeclaration !== false ),

				geometry: {
					vertices: [],
					normals: [],
					colors: [],
					uvs: [],
					hasUVIndices: false
				},
				materials: [],
				smooth: true,

				startMaterial: function ( name, libraries ) {

					const previous = this._finalize( false );

					// New usemtl declaration overwrites an inherited material, except if faces were declared
					// after the material, then it must be preserved for proper MultiMaterial continuation.
					if ( previous && ( previous.inherited || previous.groupCount <= 0 ) ) {

						this.materials.splice( previous.index, 1 );

					}

					const material = {
						index: this.materials.length,
						name: name || '',
						mtllib: ( Array.isArray( libraries ) && libraries.length > 0 ? libraries[ libraries.length - 1 ] : '' ),
						smooth: ( previous !== undefined ? previous.smooth : this.smooth ),
						groupStart: ( previous !== undefined ? previous.groupEnd : 0 ),
						groupEnd: - 1,
						groupCount: - 1,
						inherited: false,

						clone: function ( index ) {

							const cloned = {
								index: ( typeof index === 'number' ? index : this.index ),
								name: this.name,
								mtllib: this.mtllib,
								smooth: this.smooth,
								groupStart: 0,
								groupEnd: - 1,
								groupCount: - 1,
								inherited: false
							};
							cloned.clone = this.clone.bind( cloned );
							return cloned;

						}
					};

					this.materials.push( material );

					return material;

				},

				currentMaterial: function () {

					if ( this.materials.length > 0 ) {

						return this.materials[ this.materials.length - 1 ];

					}

					return undefined;

				},

				_finalize: function ( end ) {

					const lastMultiMaterial = this.currentMaterial();
					if ( lastMultiMaterial && lastMultiMaterial.groupEnd === - 1 ) {

						lastMultiMaterial.groupEnd = this.geometry.vertices.length / 3;
						lastMultiMaterial.groupCount = lastMultiMaterial.groupEnd - lastMultiMaterial.groupStart;
						lastMultiMaterial.inherited = false;

					}

					// Ignore objects tail materials if no face declarations followed them before a new o/g started.
					if ( end && this.materials.length > 1 ) {

						for ( let mi = this.materials.length - 1; mi >= 0; mi -- ) {

							if ( this.materials[ mi ].groupCount <= 0 ) {

								this.materials.splice( mi, 1 );

							}

						}

					}

					// Guarantee at least one empty material, this makes the creation later more straight forward.
					if ( end && this.materials.length === 0 ) {

						this.materials.push( {
							name: '',
							smooth: this.smooth
						} );

					}

					return lastMultiMaterial;

				}
			};

			// Inherit previous objects material.
			// Spec tells us that a declared material must be set to all objects until a new material is declared.
			// If a usemtl declaration is encountered while this new object is being parsed, it will
			// overwrite the inherited material. Exception being that there was already face declarations
			// to the inherited material, then it will be preserved for proper MultiMaterial continuation.

			if ( previousMaterial && previousMaterial.name && typeof previousMaterial.clone === 'function' ) {

				const declared = previousMaterial.clone( 0 );
				declared.inherited = true;
				this.object.materials.push( declared );

			}

			this.objects.push( this.object );

		},

		finalize: function () {

			if ( this.object && typeof this.object._finalize === 'function' ) {

				this.object._finalize( true );

			}

		},

		parseVertexIndex: function ( value, len ) {

			const index = parseInt( value, 10 );
			return ( index >= 0 ? index - 1 : index + len / 3 ) * 3;

		},

		parseNormalIndex: function ( value, len ) {

			const index = parseInt( value, 10 );
			return ( index >= 0 ? index - 1 : index + len / 3 ) * 3;

		},

		parseUVIndex: function ( value, len ) {

			const index = parseInt( value, 10 );
			return ( index >= 0 ? index - 1 : index + len / 2 ) * 2;

		},

		addVertex: function ( a, b, c ) {

			const src = this.vertices;
			const dst = this.object.geometry.vertices;

			dst.push( src[ a + 0 ], src[ a + 1 ], src[ a + 2 ] );
			dst.push( src[ b + 0 ], src[ b + 1 ], src[ b + 2 ] );
			dst.push( src[ c + 0 ], src[ c + 1 ], src[ c + 2 ] );

		},

		addVertexPoint: function ( a ) {

			const src = this.vertices;
			const dst = this.object.geometry.vertices;

			dst.push( src[ a + 0 ], src[ a + 1 ], src[ a + 2 ] );

		},

		addVertexLine: function ( a ) {

			const src = this.vertices;
			const dst = this.object.geometry.vertices;

			dst.push( src[ a + 0 ], src[ a + 1 ], src[ a + 2 ] );

		},

		addNormal: function ( a, b, c ) {

			const src = this.normals;
			const dst = this.object.geometry.normals;

			dst.push( src[ a + 0 ], src[ a + 1 ], src[ a + 2 ] );
			dst.push( src[ b + 0 ], src[ b + 1 ], src[ b + 2 ] );
			dst.push( src[ c + 0 ], src[ c + 1 ], src[ c + 2 ] );

		},

		addFaceNormal: function ( a, b, c ) {

			const src = this.vertices;
			const dst = this.object.geometry.normals;

			_vA.fromArray( src, a );
			_vB.fromArray( src, b );
			_vC.fromArray( src, c );

			_cb.subVectors( _vC, _vB );
			_ab.subVectors( _vA, _vB );
			_cb.cross( _ab );

			_cb.normalize();

			dst.push( _cb.x, _cb.y, _cb.z );
			dst.push( _cb.x, _cb.y, _cb.z );
			dst.push( _cb.x, _cb.y, _cb.z );

		},

		addColor: function ( a, b, c ) {

			const src = this.colors;
			const dst = this.object.geometry.colors;

			if ( src[ a ] !== undefined ) dst.push( src[ a + 0 ], src[ a + 1 ], src[ a + 2 ] );
			if ( src[ b ] !== undefined ) dst.push( src[ b + 0 ], src[ b + 1 ], src[ b + 2 ] );
			if ( src[ c ] !== undefined ) dst.push( src[ c + 0 ], src[ c + 1 ], src[ c + 2 ] );

		},

		addUV: function ( a, b, c ) {

			const src = this.uvs;
			const dst = this.object.geometry.uvs;

			dst.push( src[ a + 0 ], src[ a + 1 ] );
			dst.push( src[ b + 0 ], src[ b + 1 ] );
			dst.push( src[ c + 0 ], src[ c + 1 ] );

		},

		addDefaultUV: function () {

			const dst = this.object.geometry.uvs;

			dst.push( 0, 0 );
			dst.push( 0, 0 );
			dst.push( 0, 0 );

		},

		addUVLine: function ( a ) {

			const src = this.uvs;
			const dst = this.object.geometry.uvs;

			dst.push( src[ a + 0 ], src[ a + 1 ] );

		},

		addFace: function ( a, b, c, ua, ub, uc, na, nb, nc ) {

			const vLen = this.vertices.length;

			let ia = this.parseVertexIndex( a, vLen );
			let ib = this.parseVertexIndex( b, vLen );
			let ic = this.parseVertexIndex( c, vLen );

			this.addVertex( ia, ib, ic );
			this.addColor( ia, ib, ic );

			// normals

			if ( na !== undefined && na !== '' ) {

				const nLen = this.normals.length;

				ia = this.parseNormalIndex( na, nLen );
				ib = this.parseNormalIndex( nb, nLen );
				ic = this.parseNormalIndex( nc, nLen );

				this.addNormal( ia, ib, ic );

			} else {

				this.addFaceNormal( ia, ib, ic );

			}

			// uvs

			if ( ua !== undefined && ua !== '' ) {

				const uvLen = this.uvs.length;

				ia = this.parseUVIndex( ua, uvLen );
				ib = this.parseUVIndex( ub, uvLen );
				ic = this.parseUVIndex( uc, uvLen );

				this.addUV( ia, ib, ic );

				this.object.geometry.hasUVIndices = true;

			} else {

				// add placeholder values (for inconsistent face definitions)

				this.addDefaultUV();

			}

		},

		addPointGeometry: function ( vertices ) {

			this.object.geometry.type = 'Points';

			const vLen = this.vertices.length;

			for ( let vi = 0, l = vertices.length; vi < l; vi ++ ) {

				const index = this.parseVertexIndex( vertices[ vi ], vLen );

				this.addVertexPoint( index );
				this.addColor( index );

			}

		},

		addLineGeometry: function ( vertices, uvs ) {

			this.object.geometry.type = 'Line';

			const vLen = this.vertices.length;
			const uvLen = this.uvs.length;

			for ( let vi = 0, l = vertices.length; vi < l; vi ++ ) {

				this.addVertexLine( this.parseVertexIndex( vertices[ vi ], vLen ) );

			}

			for ( let uvi = 0, l = uvs.length; uvi < l; uvi ++ ) {

				this.addUVLine( this.parseUVIndex( uvs[ uvi ], uvLen ) );

			}

		}

	};

	state.startObject( '', false );

	return state;

}

//

class OBJLoader extends three.Loader {

	constructor( manager ) {

		super( manager );

		this.materials = null;

	}

	load( url, onLoad, onProgress, onError ) {

		const scope = this;

		const loader = new three.FileLoader( this.manager );
		loader.setPath( this.path );
		loader.setRequestHeader( this.requestHeader );
		loader.setWithCredentials( this.withCredentials );
		loader.load( url, function ( text ) {

			try {

				onLoad( scope.parse( text ) );

			} catch ( e ) {

				if ( onError ) {

					onError( e );

				} else {

					console.error( e );

				}

				scope.manager.itemError( url );

			}

		}, onProgress, onError );

	}

	setMaterials( materials ) {

		this.materials = materials;

		return this;

	}

	parse( text ) {

		const state = new ParserState();

		if ( text.indexOf( '\r\n' ) !== - 1 ) {

			// This is faster than String.split with regex that splits on both
			text = text.replace( /\r\n/g, '\n' );

		}

		if ( text.indexOf( '\\\n' ) !== - 1 ) {

			// join lines separated by a line continuation character (\)
			text = text.replace( /\\\n/g, '' );

		}

		const lines = text.split( '\n' );
		let line = '', lineFirstChar = '';
		let lineLength = 0;
		let result = [];

		// Faster to just trim left side of the line. Use if available.
		const trimLeft = ( typeof ''.trimLeft === 'function' );

		for ( let i = 0, l = lines.length; i < l; i ++ ) {

			line = lines[ i ];

			line = trimLeft ? line.trimLeft() : line.trim();

			lineLength = line.length;

			if ( lineLength === 0 ) continue;

			lineFirstChar = line.charAt( 0 );

			// @todo invoke passed in handler if any
			if ( lineFirstChar === '#' ) continue;

			if ( lineFirstChar === 'v' ) {

				const data = line.split( /\s+/ );

				switch ( data[ 0 ] ) {

					case 'v':
						state.vertices.push(
							parseFloat( data[ 1 ] ),
							parseFloat( data[ 2 ] ),
							parseFloat( data[ 3 ] )
						);
						if ( data.length >= 7 ) {

							state.colors.push(
								parseFloat( data[ 4 ] ),
								parseFloat( data[ 5 ] ),
								parseFloat( data[ 6 ] )

							);

						} else {

							// if no colors are defined, add placeholders so color and vertex indices match

							state.colors.push( undefined, undefined, undefined );

						}

						break;
					case 'vn':
						state.normals.push(
							parseFloat( data[ 1 ] ),
							parseFloat( data[ 2 ] ),
							parseFloat( data[ 3 ] )
						);
						break;
					case 'vt':
						state.uvs.push(
							parseFloat( data[ 1 ] ),
							parseFloat( data[ 2 ] )
						);
						break;

				}

			} else if ( lineFirstChar === 'f' ) {

				const lineData = line.substr( 1 ).trim();
				const vertexData = lineData.split( /\s+/ );
				const faceVertices = [];

				// Parse the face vertex data into an easy to work with format

				for ( let j = 0, jl = vertexData.length; j < jl; j ++ ) {

					const vertex = vertexData[ j ];

					if ( vertex.length > 0 ) {

						const vertexParts = vertex.split( '/' );
						faceVertices.push( vertexParts );

					}

				}

				// Draw an edge between the first vertex and all subsequent vertices to form an n-gon

				const v1 = faceVertices[ 0 ];

				for ( let j = 1, jl = faceVertices.length - 1; j < jl; j ++ ) {

					const v2 = faceVertices[ j ];
					const v3 = faceVertices[ j + 1 ];

					state.addFace(
						v1[ 0 ], v2[ 0 ], v3[ 0 ],
						v1[ 1 ], v2[ 1 ], v3[ 1 ],
						v1[ 2 ], v2[ 2 ], v3[ 2 ]
					);

				}

			} else if ( lineFirstChar === 'l' ) {

				const lineParts = line.substring( 1 ).trim().split( ' ' );
				let lineVertices = [];
				const lineUVs = [];

				if ( line.indexOf( '/' ) === - 1 ) {

					lineVertices = lineParts;

				} else {

					for ( let li = 0, llen = lineParts.length; li < llen; li ++ ) {

						const parts = lineParts[ li ].split( '/' );

						if ( parts[ 0 ] !== '' ) lineVertices.push( parts[ 0 ] );
						if ( parts[ 1 ] !== '' ) lineUVs.push( parts[ 1 ] );

					}

				}

				state.addLineGeometry( lineVertices, lineUVs );

			} else if ( lineFirstChar === 'p' ) {

				const lineData = line.substr( 1 ).trim();
				const pointData = lineData.split( ' ' );

				state.addPointGeometry( pointData );

			} else if ( ( result = _object_pattern.exec( line ) ) !== null ) {

				// o object_name
				// or
				// g group_name

				// WORKAROUND: https://bugs.chromium.org/p/v8/issues/detail?id=2869
				// let name = result[ 0 ].substr( 1 ).trim();
				const name = ( ' ' + result[ 0 ].substr( 1 ).trim() ).substr( 1 );

				state.startObject( name );

			} else if ( _material_use_pattern.test( line ) ) {

				// material

				state.object.startMaterial( line.substring( 7 ).trim(), state.materialLibraries );

			} else if ( _material_library_pattern.test( line ) ) {

				// mtl file

				state.materialLibraries.push( line.substring( 7 ).trim() );

			} else if ( _map_use_pattern.test( line ) ) {

				// the line is parsed but ignored since the loader assumes textures are defined MTL files
				// (according to https://www.okino.com/conv/imp_wave.htm, 'usemap' is the old-style Wavefront texture reference method)

				console.warn( 'THREE.OBJLoader: Rendering identifier "usemap" not supported. Textures must be defined in MTL files.' );

			} else if ( lineFirstChar === 's' ) {

				result = line.split( ' ' );

				// smooth shading

				// @todo Handle files that have varying smooth values for a set of faces inside one geometry,
				// but does not define a usemtl for each face set.
				// This should be detected and a dummy material created (later MultiMaterial and geometry groups).
				// This requires some care to not create extra material on each smooth value for "normal" obj files.
				// where explicit usemtl defines geometry groups.
				// Example asset: examples/models/obj/cerberus/Cerberus.obj

				/*
					 * http://paulbourke.net/dataformats/obj/
					 * or
					 * http://www.cs.utah.edu/~boulos/cs3505/obj_spec.pdf
					 *
					 * From chapter "Grouping" Syntax explanation "s group_number":
					 * "group_number is the smoothing group number. To turn off smoothing groups, use a value of 0 or off.
					 * Polygonal elements use group numbers to put elements in different smoothing groups. For free-form
					 * surfaces, smoothing groups are either turned on or off; there is no difference between values greater
					 * than 0."
					 */
				if ( result.length > 1 ) {

					const value = result[ 1 ].trim().toLowerCase();
					state.object.smooth = ( value !== '0' && value !== 'off' );

				} else {

					// ZBrush can produce "s" lines #11707
					state.object.smooth = true;

				}

				const material = state.object.currentMaterial();
				if ( material ) material.smooth = state.object.smooth;

			} else {

				// Handle null terminated files without exception
				if ( line === '\0' ) continue;

				console.warn( 'THREE.OBJLoader: Unexpected line: "' + line + '"' );

			}

		}

		state.finalize();

		const container = new three.Group();
		container.materialLibraries = [].concat( state.materialLibraries );

		const hasPrimitives = ! ( state.objects.length === 1 && state.objects[ 0 ].geometry.vertices.length === 0 );

		if ( hasPrimitives === true ) {

			for ( let i = 0, l = state.objects.length; i < l; i ++ ) {

				const object = state.objects[ i ];
				const geometry = object.geometry;
				const materials = object.materials;
				const isLine = ( geometry.type === 'Line' );
				const isPoints = ( geometry.type === 'Points' );
				let hasVertexColors = false;

				// Skip o/g line declarations that did not follow with any faces
				if ( geometry.vertices.length === 0 ) continue;

				const buffergeometry = new three.BufferGeometry();

				buffergeometry.setAttribute( 'position', new three.Float32BufferAttribute( geometry.vertices, 3 ) );

				if ( geometry.normals.length > 0 ) {

					buffergeometry.setAttribute( 'normal', new three.Float32BufferAttribute( geometry.normals, 3 ) );

				}

				if ( geometry.colors.length > 0 ) {

					hasVertexColors = true;
					buffergeometry.setAttribute( 'color', new three.Float32BufferAttribute( geometry.colors, 3 ) );

				}

				if ( geometry.hasUVIndices === true ) {

					buffergeometry.setAttribute( 'uv', new three.Float32BufferAttribute( geometry.uvs, 2 ) );

				}

				// Create materials

				const createdMaterials = [];

				for ( let mi = 0, miLen = materials.length; mi < miLen; mi ++ ) {

					const sourceMaterial = materials[ mi ];
					const materialHash = sourceMaterial.name + '_' + sourceMaterial.smooth + '_' + hasVertexColors;
					let material = state.materials[ materialHash ];

					if ( this.materials !== null ) {

						material = this.materials.create( sourceMaterial.name );

						// mtl etc. loaders probably can't create line materials correctly, copy properties to a line material.
						if ( isLine && material && ! ( material instanceof three.LineBasicMaterial ) ) {

							const materialLine = new three.LineBasicMaterial();
							three.Material.prototype.copy.call( materialLine, material );
							materialLine.color.copy( material.color );
							material = materialLine;

						} else if ( isPoints && material && ! ( material instanceof three.PointsMaterial ) ) {

							const materialPoints = new three.PointsMaterial( { size: 10, sizeAttenuation: false } );
							three.Material.prototype.copy.call( materialPoints, material );
							materialPoints.color.copy( material.color );
							materialPoints.map = material.map;
							material = materialPoints;

						}

					}

					if ( material === undefined ) {

						if ( isLine ) {

							material = new three.LineBasicMaterial();

						} else if ( isPoints ) {

							material = new three.PointsMaterial( { size: 1, sizeAttenuation: false } );

						} else {

							material = new three.MeshPhongMaterial();

						}

						material.name = sourceMaterial.name;
						material.flatShading = sourceMaterial.smooth ? false : true;
						material.vertexColors = hasVertexColors;

						state.materials[ materialHash ] = material;

					}

					createdMaterials.push( material );

				}

				// Create mesh

				let mesh;

				if ( createdMaterials.length > 1 ) {

					for ( let mi = 0, miLen = materials.length; mi < miLen; mi ++ ) {

						const sourceMaterial = materials[ mi ];
						buffergeometry.addGroup( sourceMaterial.groupStart, sourceMaterial.groupCount, mi );

					}

					if ( isLine ) {

						mesh = new three.LineSegments( buffergeometry, createdMaterials );

					} else if ( isPoints ) {

						mesh = new three.Points( buffergeometry, createdMaterials );

					} else {

						mesh = new three.Mesh( buffergeometry, createdMaterials );

					}

				} else {

					if ( isLine ) {

						mesh = new three.LineSegments( buffergeometry, createdMaterials[ 0 ] );

					} else if ( isPoints ) {

						mesh = new three.Points( buffergeometry, createdMaterials[ 0 ] );

					} else {

						mesh = new three.Mesh( buffergeometry, createdMaterials[ 0 ] );

					}

				}

				mesh.name = object.name;

				container.add( mesh );

			}

		} else {

			// if there is only the default parser state object with no geometry data, interpret data as point cloud

			if ( state.vertices.length > 0 ) {

				const material = new three.PointsMaterial( { size: 1, sizeAttenuation: false } );

				const buffergeometry = new three.BufferGeometry();

				buffergeometry.setAttribute( 'position', new three.Float32BufferAttribute( state.vertices, 3 ) );

				if ( state.colors.length > 0 && state.colors[ 0 ] !== undefined ) {

					buffergeometry.setAttribute( 'color', new three.Float32BufferAttribute( state.colors, 3 ) );
					material.vertexColors = true;

				}

				const points = new three.Points( buffergeometry, material );
				container.add( points );

			}

		}

		return container;

	}

}

function _optionalChain$a(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
class DemoMTLLoader extends Demo {
  async init() {
    const { camera, renderer } = this.deps;
    const loadMgr = new three.LoadingManager();
    loadMgr.addHandler(/\.dds$/i, new DDSLoader());
    const mtlLoader = new MTLLoader(loadMgr);
    const objLoader = new OBJLoader(loadMgr);

    const materials = (await mtlLoader.loadAsync(
      baseUrl$2 + '/models/obj/male02/male02.mtl',
    )) ;
    materials.preload();

    const object = (await objLoader
      .setMaterials(materials)
      .loadAsync(baseUrl$2 + '/models/obj/male02/male02.obj')) ;
    object.position.y = -95;

    this.addControl();

    this.add(new three.AmbientLight(0xcccccc, 0.4));
    this.addCamera(new three.PointLight(0xffffff, 0.8));
    this.add(object);
    this.add(camera);
    object.position.y = -95;
    camera.position.z = 200;
    renderer.outputEncoding = three.LinearEncoding;
  }
  update() {
    _optionalChain$a([this, 'access', _ => _.orbitControl, 'optionalAccess', _2 => _2.update, 'call', _3 => _3()]);
  }
  dispose() {
    this.reset();
  }
}

/**
 * OpenEXR loader currently supports uncompressed, ZIP(S), RLE, PIZ and DWA/B compression.
 * Supports reading as UnsignedByte, HalfFloat and Float type data texture.
 *
 * Referred to the original Industrial Light & Magic OpenEXR implementation and the TinyEXR / Syoyo Fujita
 * implementation, so I have preserved their copyright notices.
 */

// /*
// Copyright (c) 2014 - 2017, Syoyo Fujita
// All rights reserved.

// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Syoyo Fujita nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.

// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
// ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
// WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
// DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
// (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
// LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
// ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
// SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
// */

// // TinyEXR contains some OpenEXR code, which is licensed under ------------

// ///////////////////////////////////////////////////////////////////////////
// //
// // Copyright (c) 2002, Industrial Light & Magic, a division of Lucas
// // Digital Ltd. LLC
// //
// // All rights reserved.
// //
// // Redistribution and use in source and binary forms, with or without
// // modification, are permitted provided that the following conditions are
// // met:
// // *       Redistributions of source code must retain the above copyright
// // notice, this list of conditions and the following disclaimer.
// // *       Redistributions in binary form must reproduce the above
// // copyright notice, this list of conditions and the following disclaimer
// // in the documentation and/or other materials provided with the
// // distribution.
// // *       Neither the name of Industrial Light & Magic nor the names of
// // its contributors may be used to endorse or promote products derived
// // from this software without specific prior written permission.
// //
// // THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// // "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// // LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// // A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// // OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// // SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// // LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// // DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// // THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// // (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// // OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
// //
// ///////////////////////////////////////////////////////////////////////////

// // End of OpenEXR license -------------------------------------------------

class EXRLoader extends three.DataTextureLoader {

	constructor( manager ) {

		super( manager );

		this.type = three.HalfFloatType;

	}

	parse( buffer ) {

		const USHORT_RANGE = ( 1 << 16 );
		const BITMAP_SIZE = ( USHORT_RANGE >> 3 );

		const HUF_ENCBITS = 16; // literal (value) bit length
		const HUF_DECBITS = 14; // decoding bit size (>= 8)

		const HUF_ENCSIZE = ( 1 << HUF_ENCBITS ) + 1; // encoding table size
		const HUF_DECSIZE = 1 << HUF_DECBITS; // decoding table size
		const HUF_DECMASK = HUF_DECSIZE - 1;

		const NBITS = 16;
		const A_OFFSET = 1 << ( NBITS - 1 );
		const MOD_MASK = ( 1 << NBITS ) - 1;

		const SHORT_ZEROCODE_RUN = 59;
		const LONG_ZEROCODE_RUN = 63;
		const SHORTEST_LONG_RUN = 2 + LONG_ZEROCODE_RUN - SHORT_ZEROCODE_RUN;

		const ULONG_SIZE = 8;
		const FLOAT32_SIZE = 4;
		const INT32_SIZE = 4;
		const INT16_SIZE = 2;
		const INT8_SIZE = 1;

		const STATIC_HUFFMAN = 0;
		const DEFLATE = 1;

		const UNKNOWN = 0;
		const LOSSY_DCT = 1;
		const RLE = 2;

		const logBase = Math.pow( 2.7182818, 2.2 );

		var tmpDataView = new DataView( new ArrayBuffer( 8 ) );

		function frexp( value ) {

			if ( value === 0 ) return [ value, 0 ];

			tmpDataView.setFloat64( 0, value );

			var bits = ( tmpDataView.getUint32( 0 ) >>> 20 ) & 0x7FF;
			if ( bits === 0 ) { // denormal

				tmpDataView.setFloat64( 0, value * Math.pow( 2, 64 ) ); // exp + 64
				bits = ( ( tmpDataView.getUint32( 0 ) >>> 20 ) & 0x7FF ) - 64;

			}

			var exponent = bits - 1022;
			var mantissa = ldexp( value, - exponent );

			return [ mantissa, exponent ];

		}

		function ldexp( mantissa, exponent ) {

			var steps = Math.min( 3, Math.ceil( Math.abs( exponent ) / 1023 ) );
			var result = mantissa;

			for ( var i = 0; i < steps; i ++ )
				result *= Math.pow( 2, Math.floor( ( exponent + i ) / steps ) );

			return result;

		}

		function reverseLutFromBitmap( bitmap, lut ) {

			var k = 0;

			for ( var i = 0; i < USHORT_RANGE; ++ i ) {

				if ( ( i == 0 ) || ( bitmap[ i >> 3 ] & ( 1 << ( i & 7 ) ) ) ) {

					lut[ k ++ ] = i;

				}

			}

			var n = k - 1;

			while ( k < USHORT_RANGE ) lut[ k ++ ] = 0;

			return n;

		}

		function hufClearDecTable( hdec ) {

			for ( var i = 0; i < HUF_DECSIZE; i ++ ) {

				hdec[ i ] = {};
				hdec[ i ].len = 0;
				hdec[ i ].lit = 0;
				hdec[ i ].p = null;

			}

		}

		const getBitsReturn = { l: 0, c: 0, lc: 0 };

		function getBits( nBits, c, lc, uInt8Array, inOffset ) {

			while ( lc < nBits ) {

				c = ( c << 8 ) | parseUint8Array( uInt8Array, inOffset );
				lc += 8;

			}

			lc -= nBits;

			getBitsReturn.l = ( c >> lc ) & ( ( 1 << nBits ) - 1 );
			getBitsReturn.c = c;
			getBitsReturn.lc = lc;

		}

		const hufTableBuffer = new Array( 59 );

		function hufCanonicalCodeTable( hcode ) {

			for ( var i = 0; i <= 58; ++ i ) hufTableBuffer[ i ] = 0;
			for ( var i = 0; i < HUF_ENCSIZE; ++ i ) hufTableBuffer[ hcode[ i ] ] += 1;

			var c = 0;

			for ( var i = 58; i > 0; -- i ) {

				var nc = ( ( c + hufTableBuffer[ i ] ) >> 1 );
				hufTableBuffer[ i ] = c;
				c = nc;

			}

			for ( var i = 0; i < HUF_ENCSIZE; ++ i ) {

				var l = hcode[ i ];
				if ( l > 0 ) hcode[ i ] = l | ( hufTableBuffer[ l ] ++ << 6 );

			}

		}

		function hufUnpackEncTable( uInt8Array, inDataView, inOffset, ni, im, iM, hcode ) {

			var p = inOffset;
			var c = 0;
			var lc = 0;

			for ( ; im <= iM; im ++ ) {

				if ( p.value - inOffset.value > ni ) return false;

				getBits( 6, c, lc, uInt8Array, p );

				var l = getBitsReturn.l;
				c = getBitsReturn.c;
				lc = getBitsReturn.lc;

				hcode[ im ] = l;

				if ( l == LONG_ZEROCODE_RUN ) {

					if ( p.value - inOffset.value > ni ) {

						throw 'Something wrong with hufUnpackEncTable';

					}

					getBits( 8, c, lc, uInt8Array, p );

					var zerun = getBitsReturn.l + SHORTEST_LONG_RUN;
					c = getBitsReturn.c;
					lc = getBitsReturn.lc;

					if ( im + zerun > iM + 1 ) {

						throw 'Something wrong with hufUnpackEncTable';

					}

					while ( zerun -- ) hcode[ im ++ ] = 0;

					im --;

				} else if ( l >= SHORT_ZEROCODE_RUN ) {

					var zerun = l - SHORT_ZEROCODE_RUN + 2;

					if ( im + zerun > iM + 1 ) {

						throw 'Something wrong with hufUnpackEncTable';

					}

					while ( zerun -- ) hcode[ im ++ ] = 0;

					im --;

				}

			}

			hufCanonicalCodeTable( hcode );

		}

		function hufLength( code ) {

			return code & 63;

		}

		function hufCode( code ) {

			return code >> 6;

		}

		function hufBuildDecTable( hcode, im, iM, hdecod ) {

			for ( ; im <= iM; im ++ ) {

				var c = hufCode( hcode[ im ] );
				var l = hufLength( hcode[ im ] );

				if ( c >> l ) {

					throw 'Invalid table entry';

				}

				if ( l > HUF_DECBITS ) {

					var pl = hdecod[ ( c >> ( l - HUF_DECBITS ) ) ];

					if ( pl.len ) {

						throw 'Invalid table entry';

					}

					pl.lit ++;

					if ( pl.p ) {

						var p = pl.p;
						pl.p = new Array( pl.lit );

						for ( var i = 0; i < pl.lit - 1; ++ i ) {

							pl.p[ i ] = p[ i ];

						}

					} else {

						pl.p = new Array( 1 );

					}

					pl.p[ pl.lit - 1 ] = im;

				} else if ( l ) {

					var plOffset = 0;

					for ( var i = 1 << ( HUF_DECBITS - l ); i > 0; i -- ) {

						var pl = hdecod[ ( c << ( HUF_DECBITS - l ) ) + plOffset ];

						if ( pl.len || pl.p ) {

							throw 'Invalid table entry';

						}

						pl.len = l;
						pl.lit = im;

						plOffset ++;

					}

				}

			}

			return true;

		}

		const getCharReturn = { c: 0, lc: 0 };

		function getChar( c, lc, uInt8Array, inOffset ) {

			c = ( c << 8 ) | parseUint8Array( uInt8Array, inOffset );
			lc += 8;

			getCharReturn.c = c;
			getCharReturn.lc = lc;

		}

		const getCodeReturn = { c: 0, lc: 0 };

		function getCode( po, rlc, c, lc, uInt8Array, inDataView, inOffset, outBuffer, outBufferOffset, outBufferEndOffset ) {

			if ( po == rlc ) {

				if ( lc < 8 ) {

					getChar( c, lc, uInt8Array, inOffset );
					c = getCharReturn.c;
					lc = getCharReturn.lc;

				}

				lc -= 8;

				var cs = ( c >> lc );
				var cs = new Uint8Array( [ cs ] )[ 0 ];

				if ( outBufferOffset.value + cs > outBufferEndOffset ) {

					return false;

				}

				var s = outBuffer[ outBufferOffset.value - 1 ];

				while ( cs -- > 0 ) {

					outBuffer[ outBufferOffset.value ++ ] = s;

				}

			} else if ( outBufferOffset.value < outBufferEndOffset ) {

				outBuffer[ outBufferOffset.value ++ ] = po;

			} else {

				return false;

			}

			getCodeReturn.c = c;
			getCodeReturn.lc = lc;

		}

		function UInt16( value ) {

			return ( value & 0xFFFF );

		}

		function Int16( value ) {

			var ref = UInt16( value );
			return ( ref > 0x7FFF ) ? ref - 0x10000 : ref;

		}

		const wdec14Return = { a: 0, b: 0 };

		function wdec14( l, h ) {

			var ls = Int16( l );
			var hs = Int16( h );

			var hi = hs;
			var ai = ls + ( hi & 1 ) + ( hi >> 1 );

			var as = ai;
			var bs = ai - hi;

			wdec14Return.a = as;
			wdec14Return.b = bs;

		}

		function wdec16( l, h ) {

			var m = UInt16( l );
			var d = UInt16( h );

			var bb = ( m - ( d >> 1 ) ) & MOD_MASK;
			var aa = ( d + bb - A_OFFSET ) & MOD_MASK;

			wdec14Return.a = aa;
			wdec14Return.b = bb;

		}

		function wav2Decode( buffer, j, nx, ox, ny, oy, mx ) {

			var w14 = mx < ( 1 << 14 );
			var n = ( nx > ny ) ? ny : nx;
			var p = 1;
			var p2;

			while ( p <= n ) p <<= 1;

			p >>= 1;
			p2 = p;
			p >>= 1;

			while ( p >= 1 ) {

				var py = 0;
				var ey = py + oy * ( ny - p2 );
				var oy1 = oy * p;
				var oy2 = oy * p2;
				var ox1 = ox * p;
				var ox2 = ox * p2;
				var i00, i01, i10, i11;

				for ( ; py <= ey; py += oy2 ) {

					var px = py;
					var ex = py + ox * ( nx - p2 );

					for ( ; px <= ex; px += ox2 ) {

						var p01 = px + ox1;
						var p10 = px + oy1;
						var p11 = p10 + ox1;

						if ( w14 ) {

							wdec14( buffer[ px + j ], buffer[ p10 + j ] );

							i00 = wdec14Return.a;
							i10 = wdec14Return.b;

							wdec14( buffer[ p01 + j ], buffer[ p11 + j ] );

							i01 = wdec14Return.a;
							i11 = wdec14Return.b;

							wdec14( i00, i01 );

							buffer[ px + j ] = wdec14Return.a;
							buffer[ p01 + j ] = wdec14Return.b;

							wdec14( i10, i11 );

							buffer[ p10 + j ] = wdec14Return.a;
							buffer[ p11 + j ] = wdec14Return.b;

						} else {

							wdec16( buffer[ px + j ], buffer[ p10 + j ] );

							i00 = wdec14Return.a;
							i10 = wdec14Return.b;

							wdec16( buffer[ p01 + j ], buffer[ p11 + j ] );

							i01 = wdec14Return.a;
							i11 = wdec14Return.b;

							wdec16( i00, i01 );

							buffer[ px + j ] = wdec14Return.a;
							buffer[ p01 + j ] = wdec14Return.b;

							wdec16( i10, i11 );

							buffer[ p10 + j ] = wdec14Return.a;
							buffer[ p11 + j ] = wdec14Return.b;


						}

					}

					if ( nx & p ) {

						var p10 = px + oy1;

						if ( w14 )
							wdec14( buffer[ px + j ], buffer[ p10 + j ] );
						else
							wdec16( buffer[ px + j ], buffer[ p10 + j ] );

						i00 = wdec14Return.a;
						buffer[ p10 + j ] = wdec14Return.b;

						buffer[ px + j ] = i00;

					}

				}

				if ( ny & p ) {

					var px = py;
					var ex = py + ox * ( nx - p2 );

					for ( ; px <= ex; px += ox2 ) {

						var p01 = px + ox1;

						if ( w14 )
							wdec14( buffer[ px + j ], buffer[ p01 + j ] );
						else
							wdec16( buffer[ px + j ], buffer[ p01 + j ] );

						i00 = wdec14Return.a;
						buffer[ p01 + j ] = wdec14Return.b;

						buffer[ px + j ] = i00;

					}

				}

				p2 = p;
				p >>= 1;

			}

			return py;

		}

		function hufDecode( encodingTable, decodingTable, uInt8Array, inDataView, inOffset, ni, rlc, no, outBuffer, outOffset ) {

			var c = 0;
			var lc = 0;
			var outBufferEndOffset = no;
			var inOffsetEnd = Math.trunc( inOffset.value + ( ni + 7 ) / 8 );

			while ( inOffset.value < inOffsetEnd ) {

				getChar( c, lc, uInt8Array, inOffset );

				c = getCharReturn.c;
				lc = getCharReturn.lc;

				while ( lc >= HUF_DECBITS ) {

					var index = ( c >> ( lc - HUF_DECBITS ) ) & HUF_DECMASK;
					var pl = decodingTable[ index ];

					if ( pl.len ) {

						lc -= pl.len;

						getCode( pl.lit, rlc, c, lc, uInt8Array, inDataView, inOffset, outBuffer, outOffset, outBufferEndOffset );

						c = getCodeReturn.c;
						lc = getCodeReturn.lc;

					} else {

						if ( ! pl.p ) {

							throw 'hufDecode issues';

						}

						var j;

						for ( j = 0; j < pl.lit; j ++ ) {

							var l = hufLength( encodingTable[ pl.p[ j ] ] );

							while ( lc < l && inOffset.value < inOffsetEnd ) {

								getChar( c, lc, uInt8Array, inOffset );

								c = getCharReturn.c;
								lc = getCharReturn.lc;

							}

							if ( lc >= l ) {

								if ( hufCode( encodingTable[ pl.p[ j ] ] ) == ( ( c >> ( lc - l ) ) & ( ( 1 << l ) - 1 ) ) ) {

									lc -= l;

									getCode( pl.p[ j ], rlc, c, lc, uInt8Array, inDataView, inOffset, outBuffer, outOffset, outBufferEndOffset );

									c = getCodeReturn.c;
									lc = getCodeReturn.lc;

									break;

								}

							}

						}

						if ( j == pl.lit ) {

							throw 'hufDecode issues';

						}

					}

				}

			}

			var i = ( 8 - ni ) & 7;

			c >>= i;
			lc -= i;

			while ( lc > 0 ) {

				var pl = decodingTable[ ( c << ( HUF_DECBITS - lc ) ) & HUF_DECMASK ];

				if ( pl.len ) {

					lc -= pl.len;

					getCode( pl.lit, rlc, c, lc, uInt8Array, inDataView, inOffset, outBuffer, outOffset, outBufferEndOffset );

					c = getCodeReturn.c;
					lc = getCodeReturn.lc;

				} else {

					throw 'hufDecode issues';

				}

			}

			return true;

		}

		function hufUncompress( uInt8Array, inDataView, inOffset, nCompressed, outBuffer, nRaw ) {

			var outOffset = { value: 0 };
			var initialInOffset = inOffset.value;

			var im = parseUint32( inDataView, inOffset );
			var iM = parseUint32( inDataView, inOffset );

			inOffset.value += 4;

			var nBits = parseUint32( inDataView, inOffset );

			inOffset.value += 4;

			if ( im < 0 || im >= HUF_ENCSIZE || iM < 0 || iM >= HUF_ENCSIZE ) {

				throw 'Something wrong with HUF_ENCSIZE';

			}

			var freq = new Array( HUF_ENCSIZE );
			var hdec = new Array( HUF_DECSIZE );

			hufClearDecTable( hdec );

			var ni = nCompressed - ( inOffset.value - initialInOffset );

			hufUnpackEncTable( uInt8Array, inDataView, inOffset, ni, im, iM, freq );

			if ( nBits > 8 * ( nCompressed - ( inOffset.value - initialInOffset ) ) ) {

				throw 'Something wrong with hufUncompress';

			}

			hufBuildDecTable( freq, im, iM, hdec );

			hufDecode( freq, hdec, uInt8Array, inDataView, inOffset, nBits, iM, nRaw, outBuffer, outOffset );

		}

		function applyLut( lut, data, nData ) {

			for ( var i = 0; i < nData; ++ i ) {

				data[ i ] = lut[ data[ i ] ];

			}

		}

		function predictor( source ) {

			for ( var t = 1; t < source.length; t ++ ) {

				var d = source[ t - 1 ] + source[ t ] - 128;
				source[ t ] = d;

			}

		}

		function interleaveScalar( source, out ) {

			var t1 = 0;
			var t2 = Math.floor( ( source.length + 1 ) / 2 );
			var s = 0;
			var stop = source.length - 1;

			while ( true ) {

				if ( s > stop ) break;
				out[ s ++ ] = source[ t1 ++ ];

				if ( s > stop ) break;
				out[ s ++ ] = source[ t2 ++ ];

			}

		}

		function decodeRunLength( source ) {

			var size = source.byteLength;
			var out = new Array();
			var p = 0;

			var reader = new DataView( source );

			while ( size > 0 ) {

				var l = reader.getInt8( p ++ );

				if ( l < 0 ) {

					var count = - l;
					size -= count + 1;

					for ( var i = 0; i < count; i ++ ) {

						out.push( reader.getUint8( p ++ ) );

					}


				} else {

					var count = l;
					size -= 2;

					var value = reader.getUint8( p ++ );

					for ( var i = 0; i < count + 1; i ++ ) {

						out.push( value );

					}

				}

			}

			return out;

		}

		function lossyDctDecode( cscSet, rowPtrs, channelData, acBuffer, dcBuffer, outBuffer ) {

			var dataView = new DataView( outBuffer.buffer );

			var width = channelData[ cscSet.idx[ 0 ] ].width;
			var height = channelData[ cscSet.idx[ 0 ] ].height;

			var numComp = 3;

			var numFullBlocksX = Math.floor( width / 8.0 );
			var numBlocksX = Math.ceil( width / 8.0 );
			var numBlocksY = Math.ceil( height / 8.0 );
			var leftoverX = width - ( numBlocksX - 1 ) * 8;
			var leftoverY = height - ( numBlocksY - 1 ) * 8;

			var currAcComp = { value: 0 };
			var currDcComp = new Array( numComp );
			var dctData = new Array( numComp );
			var halfZigBlock = new Array( numComp );
			var rowBlock = new Array( numComp );
			var rowOffsets = new Array( numComp );

			for ( let comp = 0; comp < numComp; ++ comp ) {

				rowOffsets[ comp ] = rowPtrs[ cscSet.idx[ comp ] ];
				currDcComp[ comp ] = ( comp < 1 ) ? 0 : currDcComp[ comp - 1 ] + numBlocksX * numBlocksY;
				dctData[ comp ] = new Float32Array( 64 );
				halfZigBlock[ comp ] = new Uint16Array( 64 );
				rowBlock[ comp ] = new Uint16Array( numBlocksX * 64 );

			}

			for ( let blocky = 0; blocky < numBlocksY; ++ blocky ) {

				var maxY = 8;

				if ( blocky == numBlocksY - 1 )
					maxY = leftoverY;

				var maxX = 8;

				for ( let blockx = 0; blockx < numBlocksX; ++ blockx ) {

					if ( blockx == numBlocksX - 1 )
						maxX = leftoverX;

					for ( let comp = 0; comp < numComp; ++ comp ) {

						halfZigBlock[ comp ].fill( 0 );

						// set block DC component
						halfZigBlock[ comp ][ 0 ] = dcBuffer[ currDcComp[ comp ] ++ ];
						// set block AC components
						unRleAC( currAcComp, acBuffer, halfZigBlock[ comp ] );

						// UnZigZag block to float
						unZigZag( halfZigBlock[ comp ], dctData[ comp ] );
						// decode float dct
						dctInverse( dctData[ comp ] );

					}

					{

						csc709Inverse( dctData );

					}

					for ( let comp = 0; comp < numComp; ++ comp ) {

						convertToHalf( dctData[ comp ], rowBlock[ comp ], blockx * 64 );

					}

				} // blockx

				let offset = 0;

				for ( let comp = 0; comp < numComp; ++ comp ) {

					const type = channelData[ cscSet.idx[ comp ] ].type;

					for ( let y = 8 * blocky; y < 8 * blocky + maxY; ++ y ) {

						offset = rowOffsets[ comp ][ y ];

						for ( let blockx = 0; blockx < numFullBlocksX; ++ blockx ) {

							const src = blockx * 64 + ( ( y & 0x7 ) * 8 );

							dataView.setUint16( offset + 0 * INT16_SIZE * type, rowBlock[ comp ][ src + 0 ], true );
							dataView.setUint16( offset + 1 * INT16_SIZE * type, rowBlock[ comp ][ src + 1 ], true );
							dataView.setUint16( offset + 2 * INT16_SIZE * type, rowBlock[ comp ][ src + 2 ], true );
							dataView.setUint16( offset + 3 * INT16_SIZE * type, rowBlock[ comp ][ src + 3 ], true );

							dataView.setUint16( offset + 4 * INT16_SIZE * type, rowBlock[ comp ][ src + 4 ], true );
							dataView.setUint16( offset + 5 * INT16_SIZE * type, rowBlock[ comp ][ src + 5 ], true );
							dataView.setUint16( offset + 6 * INT16_SIZE * type, rowBlock[ comp ][ src + 6 ], true );
							dataView.setUint16( offset + 7 * INT16_SIZE * type, rowBlock[ comp ][ src + 7 ], true );

							offset += 8 * INT16_SIZE * type;

						}

					}

					// handle partial X blocks
					if ( numFullBlocksX != numBlocksX ) {

						for ( let y = 8 * blocky; y < 8 * blocky + maxY; ++ y ) {

							const offset = rowOffsets[ comp ][ y ] + 8 * numFullBlocksX * INT16_SIZE * type;
							const src = numFullBlocksX * 64 + ( ( y & 0x7 ) * 8 );

							for ( let x = 0; x < maxX; ++ x ) {

								dataView.setUint16( offset + x * INT16_SIZE * type, rowBlock[ comp ][ src + x ], true );

							}

						}

					}

				} // comp

			} // blocky

			var halfRow = new Uint16Array( width );
			var dataView = new DataView( outBuffer.buffer );

			// convert channels back to float, if needed
			for ( var comp = 0; comp < numComp; ++ comp ) {

				channelData[ cscSet.idx[ comp ] ].decoded = true;
				var type = channelData[ cscSet.idx[ comp ] ].type;

				if ( channelData[ comp ].type != 2 ) continue;

				for ( var y = 0; y < height; ++ y ) {

					const offset = rowOffsets[ comp ][ y ];

					for ( var x = 0; x < width; ++ x ) {

						halfRow[ x ] = dataView.getUint16( offset + x * INT16_SIZE * type, true );

					}

					for ( var x = 0; x < width; ++ x ) {

						dataView.setFloat32( offset + x * INT16_SIZE * type, decodeFloat16( halfRow[ x ] ), true );

					}

				}

			}

		}

		function unRleAC( currAcComp, acBuffer, halfZigBlock ) {

			var acValue;
			var dctComp = 1;

			while ( dctComp < 64 ) {

				acValue = acBuffer[ currAcComp.value ];

				if ( acValue == 0xff00 ) {

					dctComp = 64;

				} else if ( acValue >> 8 == 0xff ) {

					dctComp += acValue & 0xff;

				} else {

					halfZigBlock[ dctComp ] = acValue;
					dctComp ++;

				}

				currAcComp.value ++;

			}

		}

		function unZigZag( src, dst ) {

			dst[ 0 ] = decodeFloat16( src[ 0 ] );
			dst[ 1 ] = decodeFloat16( src[ 1 ] );
			dst[ 2 ] = decodeFloat16( src[ 5 ] );
			dst[ 3 ] = decodeFloat16( src[ 6 ] );
			dst[ 4 ] = decodeFloat16( src[ 14 ] );
			dst[ 5 ] = decodeFloat16( src[ 15 ] );
			dst[ 6 ] = decodeFloat16( src[ 27 ] );
			dst[ 7 ] = decodeFloat16( src[ 28 ] );
			dst[ 8 ] = decodeFloat16( src[ 2 ] );
			dst[ 9 ] = decodeFloat16( src[ 4 ] );

			dst[ 10 ] = decodeFloat16( src[ 7 ] );
			dst[ 11 ] = decodeFloat16( src[ 13 ] );
			dst[ 12 ] = decodeFloat16( src[ 16 ] );
			dst[ 13 ] = decodeFloat16( src[ 26 ] );
			dst[ 14 ] = decodeFloat16( src[ 29 ] );
			dst[ 15 ] = decodeFloat16( src[ 42 ] );
			dst[ 16 ] = decodeFloat16( src[ 3 ] );
			dst[ 17 ] = decodeFloat16( src[ 8 ] );
			dst[ 18 ] = decodeFloat16( src[ 12 ] );
			dst[ 19 ] = decodeFloat16( src[ 17 ] );

			dst[ 20 ] = decodeFloat16( src[ 25 ] );
			dst[ 21 ] = decodeFloat16( src[ 30 ] );
			dst[ 22 ] = decodeFloat16( src[ 41 ] );
			dst[ 23 ] = decodeFloat16( src[ 43 ] );
			dst[ 24 ] = decodeFloat16( src[ 9 ] );
			dst[ 25 ] = decodeFloat16( src[ 11 ] );
			dst[ 26 ] = decodeFloat16( src[ 18 ] );
			dst[ 27 ] = decodeFloat16( src[ 24 ] );
			dst[ 28 ] = decodeFloat16( src[ 31 ] );
			dst[ 29 ] = decodeFloat16( src[ 40 ] );

			dst[ 30 ] = decodeFloat16( src[ 44 ] );
			dst[ 31 ] = decodeFloat16( src[ 53 ] );
			dst[ 32 ] = decodeFloat16( src[ 10 ] );
			dst[ 33 ] = decodeFloat16( src[ 19 ] );
			dst[ 34 ] = decodeFloat16( src[ 23 ] );
			dst[ 35 ] = decodeFloat16( src[ 32 ] );
			dst[ 36 ] = decodeFloat16( src[ 39 ] );
			dst[ 37 ] = decodeFloat16( src[ 45 ] );
			dst[ 38 ] = decodeFloat16( src[ 52 ] );
			dst[ 39 ] = decodeFloat16( src[ 54 ] );

			dst[ 40 ] = decodeFloat16( src[ 20 ] );
			dst[ 41 ] = decodeFloat16( src[ 22 ] );
			dst[ 42 ] = decodeFloat16( src[ 33 ] );
			dst[ 43 ] = decodeFloat16( src[ 38 ] );
			dst[ 44 ] = decodeFloat16( src[ 46 ] );
			dst[ 45 ] = decodeFloat16( src[ 51 ] );
			dst[ 46 ] = decodeFloat16( src[ 55 ] );
			dst[ 47 ] = decodeFloat16( src[ 60 ] );
			dst[ 48 ] = decodeFloat16( src[ 21 ] );
			dst[ 49 ] = decodeFloat16( src[ 34 ] );

			dst[ 50 ] = decodeFloat16( src[ 37 ] );
			dst[ 51 ] = decodeFloat16( src[ 47 ] );
			dst[ 52 ] = decodeFloat16( src[ 50 ] );
			dst[ 53 ] = decodeFloat16( src[ 56 ] );
			dst[ 54 ] = decodeFloat16( src[ 59 ] );
			dst[ 55 ] = decodeFloat16( src[ 61 ] );
			dst[ 56 ] = decodeFloat16( src[ 35 ] );
			dst[ 57 ] = decodeFloat16( src[ 36 ] );
			dst[ 58 ] = decodeFloat16( src[ 48 ] );
			dst[ 59 ] = decodeFloat16( src[ 49 ] );

			dst[ 60 ] = decodeFloat16( src[ 57 ] );
			dst[ 61 ] = decodeFloat16( src[ 58 ] );
			dst[ 62 ] = decodeFloat16( src[ 62 ] );
			dst[ 63 ] = decodeFloat16( src[ 63 ] );

		}

		function dctInverse( data ) {

			const a = 0.5 * Math.cos( 3.14159 / 4.0 );
			const b = 0.5 * Math.cos( 3.14159 / 16.0 );
			const c = 0.5 * Math.cos( 3.14159 / 8.0 );
			const d = 0.5 * Math.cos( 3.0 * 3.14159 / 16.0 );
			const e = 0.5 * Math.cos( 5.0 * 3.14159 / 16.0 );
			const f = 0.5 * Math.cos( 3.0 * 3.14159 / 8.0 );
			const g = 0.5 * Math.cos( 7.0 * 3.14159 / 16.0 );

			var alpha = new Array( 4 );
			var beta = new Array( 4 );
			var theta = new Array( 4 );
			var gamma = new Array( 4 );

			for ( var row = 0; row < 8; ++ row ) {

				var rowPtr = row * 8;

				alpha[ 0 ] = c * data[ rowPtr + 2 ];
				alpha[ 1 ] = f * data[ rowPtr + 2 ];
				alpha[ 2 ] = c * data[ rowPtr + 6 ];
				alpha[ 3 ] = f * data[ rowPtr + 6 ];

				beta[ 0 ] = b * data[ rowPtr + 1 ] + d * data[ rowPtr + 3 ] + e * data[ rowPtr + 5 ] + g * data[ rowPtr + 7 ];
				beta[ 1 ] = d * data[ rowPtr + 1 ] - g * data[ rowPtr + 3 ] - b * data[ rowPtr + 5 ] - e * data[ rowPtr + 7 ];
				beta[ 2 ] = e * data[ rowPtr + 1 ] - b * data[ rowPtr + 3 ] + g * data[ rowPtr + 5 ] + d * data[ rowPtr + 7 ];
				beta[ 3 ] = g * data[ rowPtr + 1 ] - e * data[ rowPtr + 3 ] + d * data[ rowPtr + 5 ] - b * data[ rowPtr + 7 ];

				theta[ 0 ] = a * ( data[ rowPtr + 0 ] + data[ rowPtr + 4 ] );
				theta[ 3 ] = a * ( data[ rowPtr + 0 ] - data[ rowPtr + 4 ] );
				theta[ 1 ] = alpha[ 0 ] + alpha[ 3 ];
				theta[ 2 ] = alpha[ 1 ] - alpha[ 2 ];

				gamma[ 0 ] = theta[ 0 ] + theta[ 1 ];
				gamma[ 1 ] = theta[ 3 ] + theta[ 2 ];
				gamma[ 2 ] = theta[ 3 ] - theta[ 2 ];
				gamma[ 3 ] = theta[ 0 ] - theta[ 1 ];

				data[ rowPtr + 0 ] = gamma[ 0 ] + beta[ 0 ];
				data[ rowPtr + 1 ] = gamma[ 1 ] + beta[ 1 ];
				data[ rowPtr + 2 ] = gamma[ 2 ] + beta[ 2 ];
				data[ rowPtr + 3 ] = gamma[ 3 ] + beta[ 3 ];

				data[ rowPtr + 4 ] = gamma[ 3 ] - beta[ 3 ];
				data[ rowPtr + 5 ] = gamma[ 2 ] - beta[ 2 ];
				data[ rowPtr + 6 ] = gamma[ 1 ] - beta[ 1 ];
				data[ rowPtr + 7 ] = gamma[ 0 ] - beta[ 0 ];

			}

			for ( var column = 0; column < 8; ++ column ) {

				alpha[ 0 ] = c * data[ 16 + column ];
				alpha[ 1 ] = f * data[ 16 + column ];
				alpha[ 2 ] = c * data[ 48 + column ];
				alpha[ 3 ] = f * data[ 48 + column ];

				beta[ 0 ] = b * data[ 8 + column ] + d * data[ 24 + column ] + e * data[ 40 + column ] + g * data[ 56 + column ];
				beta[ 1 ] = d * data[ 8 + column ] - g * data[ 24 + column ] - b * data[ 40 + column ] - e * data[ 56 + column ];
				beta[ 2 ] = e * data[ 8 + column ] - b * data[ 24 + column ] + g * data[ 40 + column ] + d * data[ 56 + column ];
				beta[ 3 ] = g * data[ 8 + column ] - e * data[ 24 + column ] + d * data[ 40 + column ] - b * data[ 56 + column ];

				theta[ 0 ] = a * ( data[ column ] + data[ 32 + column ] );
				theta[ 3 ] = a * ( data[ column ] - data[ 32 + column ] );

				theta[ 1 ] = alpha[ 0 ] + alpha[ 3 ];
				theta[ 2 ] = alpha[ 1 ] - alpha[ 2 ];

				gamma[ 0 ] = theta[ 0 ] + theta[ 1 ];
				gamma[ 1 ] = theta[ 3 ] + theta[ 2 ];
				gamma[ 2 ] = theta[ 3 ] - theta[ 2 ];
				gamma[ 3 ] = theta[ 0 ] - theta[ 1 ];

				data[ 0 + column ] = gamma[ 0 ] + beta[ 0 ];
				data[ 8 + column ] = gamma[ 1 ] + beta[ 1 ];
				data[ 16 + column ] = gamma[ 2 ] + beta[ 2 ];
				data[ 24 + column ] = gamma[ 3 ] + beta[ 3 ];

				data[ 32 + column ] = gamma[ 3 ] - beta[ 3 ];
				data[ 40 + column ] = gamma[ 2 ] - beta[ 2 ];
				data[ 48 + column ] = gamma[ 1 ] - beta[ 1 ];
				data[ 56 + column ] = gamma[ 0 ] - beta[ 0 ];

			}

		}

		function csc709Inverse( data ) {

			for ( var i = 0; i < 64; ++ i ) {

				var y = data[ 0 ][ i ];
				var cb = data[ 1 ][ i ];
				var cr = data[ 2 ][ i ];

				data[ 0 ][ i ] = y + 1.5747 * cr;
				data[ 1 ][ i ] = y - 0.1873 * cb - 0.4682 * cr;
				data[ 2 ][ i ] = y + 1.8556 * cb;

			}

		}

		function convertToHalf( src, dst, idx ) {

			for ( var i = 0; i < 64; ++ i ) {

				dst[ idx + i ] = three.DataUtils.toHalfFloat( toLinear( src[ i ] ) );

			}

		}

		function toLinear( float ) {

			if ( float <= 1 ) {

				return Math.sign( float ) * Math.pow( Math.abs( float ), 2.2 );

			} else {

				return Math.sign( float ) * Math.pow( logBase, Math.abs( float ) - 1.0 );

			}

		}

		function uncompressRAW( info ) {

			return new DataView( info.array.buffer, info.offset.value, info.size );

		}

		function uncompressRLE( info ) {

			var compressed = info.viewer.buffer.slice( info.offset.value, info.offset.value + info.size );

			var rawBuffer = new Uint8Array( decodeRunLength( compressed ) );
			var tmpBuffer = new Uint8Array( rawBuffer.length );

			predictor( rawBuffer ); // revert predictor

			interleaveScalar( rawBuffer, tmpBuffer ); // interleave pixels

			return new DataView( tmpBuffer.buffer );

		}

		function uncompressZIP( info ) {

			var compressed = info.array.slice( info.offset.value, info.offset.value + info.size );

			if ( typeof fflate === 'undefined' ) {

				console.error( 'THREE.EXRLoader: External library fflate.min.js required.' );

			}

			var rawBuffer = unzlibSync( compressed ); // eslint-disable-line no-undef
			var tmpBuffer = new Uint8Array( rawBuffer.length );

			predictor( rawBuffer ); // revert predictor

			interleaveScalar( rawBuffer, tmpBuffer ); // interleave pixels

			return new DataView( tmpBuffer.buffer );

		}

		function uncompressPIZ( info ) {

			var inDataView = info.viewer;
			var inOffset = { value: info.offset.value };

			var tmpBufSize = info.width * scanlineBlockSize * ( EXRHeader.channels.length * info.type );
			var outBuffer = new Uint16Array( tmpBufSize );
			var bitmap = new Uint8Array( BITMAP_SIZE );

			// Setup channel info
			var outBufferEnd = 0;
			var pizChannelData = new Array( info.channels );
			for ( var i = 0; i < info.channels; i ++ ) {

				pizChannelData[ i ] = {};
				pizChannelData[ i ][ 'start' ] = outBufferEnd;
				pizChannelData[ i ][ 'end' ] = pizChannelData[ i ][ 'start' ];
				pizChannelData[ i ][ 'nx' ] = info.width;
				pizChannelData[ i ][ 'ny' ] = info.lines;
				pizChannelData[ i ][ 'size' ] = info.type;

				outBufferEnd += pizChannelData[ i ].nx * pizChannelData[ i ].ny * pizChannelData[ i ].size;

			}

			// Read range compression data
			var minNonZero = parseUint16( inDataView, inOffset );
			var maxNonZero = parseUint16( inDataView, inOffset );

			if ( maxNonZero >= BITMAP_SIZE ) {

				throw 'Something is wrong with PIZ_COMPRESSION BITMAP_SIZE';

			}

			if ( minNonZero <= maxNonZero ) {

				for ( var i = 0; i < maxNonZero - minNonZero + 1; i ++ ) {

					bitmap[ i + minNonZero ] = parseUint8( inDataView, inOffset );

				}

			}

			// Reverse LUT
			var lut = new Uint16Array( USHORT_RANGE );
			var maxValue = reverseLutFromBitmap( bitmap, lut );

			var length = parseUint32( inDataView, inOffset );

			// Huffman decoding
			hufUncompress( info.array, inDataView, inOffset, length, outBuffer, outBufferEnd );

			// Wavelet decoding
			for ( var i = 0; i < info.channels; ++ i ) {

				var cd = pizChannelData[ i ];

				for ( var j = 0; j < pizChannelData[ i ].size; ++ j ) {

					wav2Decode(
						outBuffer,
						cd.start + j,
						cd.nx,
						cd.size,
						cd.ny,
						cd.nx * cd.size,
						maxValue
					);

				}

			}

			// Expand the pixel data to their original range
			applyLut( lut, outBuffer, outBufferEnd );

			// Rearrange the pixel data into the format expected by the caller.
			var tmpOffset = 0;
			var tmpBuffer = new Uint8Array( outBuffer.buffer.byteLength );
			for ( var y = 0; y < info.lines; y ++ ) {

				for ( var c = 0; c < info.channels; c ++ ) {

					var cd = pizChannelData[ c ];

					var n = cd.nx * cd.size;
					var cp = new Uint8Array( outBuffer.buffer, cd.end * INT16_SIZE, n * INT16_SIZE );

					tmpBuffer.set( cp, tmpOffset );
					tmpOffset += n * INT16_SIZE;
					cd.end += n;

				}

			}

			return new DataView( tmpBuffer.buffer );

		}

		function uncompressPXR( info ) {

			var compressed = info.array.slice( info.offset.value, info.offset.value + info.size );

			if ( typeof fflate === 'undefined' ) {

				console.error( 'THREE.EXRLoader: External library fflate.min.js required.' );

			}

			var rawBuffer = unzlibSync( compressed ); // eslint-disable-line no-undef

			const sz = info.lines * info.channels * info.width;
			const tmpBuffer = ( info.type == 1 ) ? new Uint16Array( sz ) : new Uint32Array( sz );

			let tmpBufferEnd = 0;
			let writePtr = 0;
			const ptr = new Array( 4 );

			for ( let y = 0; y < info.lines; y ++ ) {

				for ( let c = 0; c < info.channels; c ++ ) {

					let pixel = 0;

					switch ( info.type ) {

						case 1:

							ptr[ 0 ] = tmpBufferEnd;
							ptr[ 1 ] = ptr[ 0 ] + info.width;
							tmpBufferEnd = ptr[ 1 ] + info.width;

							for ( let j = 0; j < info.width; ++ j ) {

								const diff = ( rawBuffer[ ptr[ 0 ] ++ ] << 8 ) | rawBuffer[ ptr[ 1 ] ++ ];

								pixel += diff;

								tmpBuffer[ writePtr ] = pixel;
								writePtr ++;

							}

							break;

						case 2:

							ptr[ 0 ] = tmpBufferEnd;
							ptr[ 1 ] = ptr[ 0 ] + info.width;
							ptr[ 2 ] = ptr[ 1 ] + info.width;
							tmpBufferEnd = ptr[ 2 ] + info.width;

							for ( let j = 0; j < info.width; ++ j ) {

								const diff = ( rawBuffer[ ptr[ 0 ] ++ ] << 24 ) | ( rawBuffer[ ptr[ 1 ] ++ ] << 16 ) | ( rawBuffer[ ptr[ 2 ] ++ ] << 8 );

								pixel += diff;

								tmpBuffer[ writePtr ] = pixel;
								writePtr ++;

							}

							break;

					}

				}

			}

			return new DataView( tmpBuffer.buffer );

		}

		function uncompressDWA( info ) {

			var inDataView = info.viewer;
			var inOffset = { value: info.offset.value };
			var outBuffer = new Uint8Array( info.width * info.lines * ( EXRHeader.channels.length * info.type * INT16_SIZE ) );

			// Read compression header information
			var dwaHeader = {

				version: parseInt64( inDataView, inOffset ),
				unknownUncompressedSize: parseInt64( inDataView, inOffset ),
				unknownCompressedSize: parseInt64( inDataView, inOffset ),
				acCompressedSize: parseInt64( inDataView, inOffset ),
				dcCompressedSize: parseInt64( inDataView, inOffset ),
				rleCompressedSize: parseInt64( inDataView, inOffset ),
				rleUncompressedSize: parseInt64( inDataView, inOffset ),
				rleRawSize: parseInt64( inDataView, inOffset ),
				totalAcUncompressedCount: parseInt64( inDataView, inOffset ),
				totalDcUncompressedCount: parseInt64( inDataView, inOffset ),
				acCompression: parseInt64( inDataView, inOffset )

			};

			if ( dwaHeader.version < 2 )
				throw 'EXRLoader.parse: ' + EXRHeader.compression + ' version ' + dwaHeader.version + ' is unsupported';

			// Read channel ruleset information
			var channelRules = new Array();
			var ruleSize = parseUint16( inDataView, inOffset ) - INT16_SIZE;

			while ( ruleSize > 0 ) {

				var name = parseNullTerminatedString( inDataView.buffer, inOffset );
				var value = parseUint8( inDataView, inOffset );
				var compression = ( value >> 2 ) & 3;
				var csc = ( value >> 4 ) - 1;
				var index = new Int8Array( [ csc ] )[ 0 ];
				var type = parseUint8( inDataView, inOffset );

				channelRules.push( {
					name: name,
					index: index,
					type: type,
					compression: compression,
				} );

				ruleSize -= name.length + 3;

			}

			// Classify channels
			var channels = EXRHeader.channels;
			var channelData = new Array( info.channels );

			for ( var i = 0; i < info.channels; ++ i ) {

				var cd = channelData[ i ] = {};
				var channel = channels[ i ];

				cd.name = channel.name;
				cd.compression = UNKNOWN;
				cd.decoded = false;
				cd.type = channel.pixelType;
				cd.pLinear = channel.pLinear;
				cd.width = info.width;
				cd.height = info.lines;

			}

			var cscSet = {
				idx: new Array( 3 )
			};

			for ( var offset = 0; offset < info.channels; ++ offset ) {

				var cd = channelData[ offset ];

				for ( var i = 0; i < channelRules.length; ++ i ) {

					var rule = channelRules[ i ];

					if ( cd.name == rule.name ) {

						cd.compression = rule.compression;

						if ( rule.index >= 0 ) {

							cscSet.idx[ rule.index ] = offset;

						}

						cd.offset = offset;

					}

				}

			}

			// Read DCT - AC component data
			if ( dwaHeader.acCompressedSize > 0 ) {

				switch ( dwaHeader.acCompression ) {

					case STATIC_HUFFMAN:

						var acBuffer = new Uint16Array( dwaHeader.totalAcUncompressedCount );
						hufUncompress( info.array, inDataView, inOffset, dwaHeader.acCompressedSize, acBuffer, dwaHeader.totalAcUncompressedCount );
						break;

					case DEFLATE:

						var compressed = info.array.slice( inOffset.value, inOffset.value + dwaHeader.totalAcUncompressedCount );
						var data = unzlibSync( compressed ); // eslint-disable-line no-undef
						var acBuffer = new Uint16Array( data.buffer );
						inOffset.value += dwaHeader.totalAcUncompressedCount;
						break;

				}


			}

			// Read DCT - DC component data
			if ( dwaHeader.dcCompressedSize > 0 ) {

				var zlibInfo = {
					array: info.array,
					offset: inOffset,
					size: dwaHeader.dcCompressedSize
				};
				var dcBuffer = new Uint16Array( uncompressZIP( zlibInfo ).buffer );
				inOffset.value += dwaHeader.dcCompressedSize;

			}

			// Read RLE compressed data
			if ( dwaHeader.rleRawSize > 0 ) {

				var compressed = info.array.slice( inOffset.value, inOffset.value + dwaHeader.rleCompressedSize );
				var data = unzlibSync( compressed ); // eslint-disable-line no-undef
				var rleBuffer = decodeRunLength( data.buffer );

				inOffset.value += dwaHeader.rleCompressedSize;

			}

			// Prepare outbuffer data offset
			var outBufferEnd = 0;
			var rowOffsets = new Array( channelData.length );
			for ( var i = 0; i < rowOffsets.length; ++ i ) {

				rowOffsets[ i ] = new Array();

			}

			for ( var y = 0; y < info.lines; ++ y ) {

				for ( var chan = 0; chan < channelData.length; ++ chan ) {

					rowOffsets[ chan ].push( outBufferEnd );
					outBufferEnd += channelData[ chan ].width * info.type * INT16_SIZE;

				}

			}

			// Lossy DCT decode RGB channels
			lossyDctDecode( cscSet, rowOffsets, channelData, acBuffer, dcBuffer, outBuffer );

			// Decode other channels
			for ( var i = 0; i < channelData.length; ++ i ) {

				var cd = channelData[ i ];

				if ( cd.decoded ) continue;

				switch ( cd.compression ) {

					case RLE:

						var row = 0;
						var rleOffset = 0;

						for ( var y = 0; y < info.lines; ++ y ) {

							var rowOffsetBytes = rowOffsets[ i ][ row ];

							for ( var x = 0; x < cd.width; ++ x ) {

								for ( var byte = 0; byte < INT16_SIZE * cd.type; ++ byte ) {

									outBuffer[ rowOffsetBytes ++ ] = rleBuffer[ rleOffset + byte * cd.width * cd.height ];

								}

								rleOffset ++;

							}

							row ++;

						}

						break;

					case LOSSY_DCT: // skip

					default:
						throw 'EXRLoader.parse: unsupported channel compression';

				}

			}

			return new DataView( outBuffer.buffer );

		}

		function parseNullTerminatedString( buffer, offset ) {

			var uintBuffer = new Uint8Array( buffer );
			var endOffset = 0;

			while ( uintBuffer[ offset.value + endOffset ] != 0 ) {

				endOffset += 1;

			}

			var stringValue = new three._default.polyfill.TextDecoder().decode(
				uintBuffer.slice( offset.value, offset.value + endOffset )
			);

			offset.value = offset.value + endOffset + 1;

			return stringValue;

		}

		function parseFixedLengthString( buffer, offset, size ) {

			var stringValue = new three._default.polyfill.TextDecoder().decode(
				new Uint8Array( buffer ).slice( offset.value, offset.value + size )
			);

			offset.value = offset.value + size;

			return stringValue;

		}

		function parseUlong( dataView, offset ) {

			var uLong = dataView.getUint32( 0, true );

			offset.value = offset.value + ULONG_SIZE;

			return uLong;

		}

		function parseRational( dataView, offset ) {

			var x = parseInt32( dataView, offset );
			var y = parseUint32( dataView, offset );

			return [ x, y ];

		}

		function parseTimecode( dataView, offset ) {

			var x = parseUint32( dataView, offset );
			var y = parseUint32( dataView, offset );

			return [ x, y ];

		}

		function parseInt32( dataView, offset ) {

			var Int32 = dataView.getInt32( offset.value, true );

			offset.value = offset.value + INT32_SIZE;

			return Int32;

		}

		function parseUint32( dataView, offset ) {

			var Uint32 = dataView.getUint32( offset.value, true );

			offset.value = offset.value + INT32_SIZE;

			return Uint32;

		}

		function parseUint8Array( uInt8Array, offset ) {

			var Uint8 = uInt8Array[ offset.value ];

			offset.value = offset.value + INT8_SIZE;

			return Uint8;

		}

		function parseUint8( dataView, offset ) {

			var Uint8 = dataView.getUint8( offset.value );

			offset.value = offset.value + INT8_SIZE;

			return Uint8;

		}

		function parseInt64( dataView, offset ) {

			var int = Number( dataView.getBigInt64( offset.value, true ) );

			offset.value += ULONG_SIZE;

			return int;

		}

		function parseFloat32( dataView, offset ) {

			var float = dataView.getFloat32( offset.value, true );

			offset.value += FLOAT32_SIZE;

			return float;

		}

		function decodeFloat32( dataView, offset ) {

			return three.DataUtils.toHalfFloat( parseFloat32( dataView, offset ) );

		}

		// https://stackoverflow.com/questions/5678432/decompressing-half-precision-floats-in-javascript
		function decodeFloat16( binary ) {

			var exponent = ( binary & 0x7C00 ) >> 10,
				fraction = binary & 0x03FF;

			return ( binary >> 15 ? - 1 : 1 ) * (
				exponent ?
					(
						exponent === 0x1F ?
							fraction ? NaN : Infinity :
							Math.pow( 2, exponent - 15 ) * ( 1 + fraction / 0x400 )
					) :
					6.103515625e-5 * ( fraction / 0x400 )
			);

		}

		function parseUint16( dataView, offset ) {

			var Uint16 = dataView.getUint16( offset.value, true );

			offset.value += INT16_SIZE;

			return Uint16;

		}

		function parseFloat16( buffer, offset ) {

			return decodeFloat16( parseUint16( buffer, offset ) );

		}

		function parseChlist( dataView, buffer, offset, size ) {

			var startOffset = offset.value;
			var channels = [];

			while ( offset.value < ( startOffset + size - 1 ) ) {

				var name = parseNullTerminatedString( buffer, offset );
				var pixelType = parseInt32( dataView, offset );
				var pLinear = parseUint8( dataView, offset );
				offset.value += 3; // reserved, three chars
				var xSampling = parseInt32( dataView, offset );
				var ySampling = parseInt32( dataView, offset );

				channels.push( {
					name: name,
					pixelType: pixelType,
					pLinear: pLinear,
					xSampling: xSampling,
					ySampling: ySampling
				} );

			}

			offset.value += 1;

			return channels;

		}

		function parseChromaticities( dataView, offset ) {

			var redX = parseFloat32( dataView, offset );
			var redY = parseFloat32( dataView, offset );
			var greenX = parseFloat32( dataView, offset );
			var greenY = parseFloat32( dataView, offset );
			var blueX = parseFloat32( dataView, offset );
			var blueY = parseFloat32( dataView, offset );
			var whiteX = parseFloat32( dataView, offset );
			var whiteY = parseFloat32( dataView, offset );

			return { redX: redX, redY: redY, greenX: greenX, greenY: greenY, blueX: blueX, blueY: blueY, whiteX: whiteX, whiteY: whiteY };

		}

		function parseCompression( dataView, offset ) {

			var compressionCodes = [
				'NO_COMPRESSION',
				'RLE_COMPRESSION',
				'ZIPS_COMPRESSION',
				'ZIP_COMPRESSION',
				'PIZ_COMPRESSION',
				'PXR24_COMPRESSION',
				'B44_COMPRESSION',
				'B44A_COMPRESSION',
				'DWAA_COMPRESSION',
				'DWAB_COMPRESSION'
			];

			var compression = parseUint8( dataView, offset );

			return compressionCodes[ compression ];

		}

		function parseBox2i( dataView, offset ) {

			var xMin = parseUint32( dataView, offset );
			var yMin = parseUint32( dataView, offset );
			var xMax = parseUint32( dataView, offset );
			var yMax = parseUint32( dataView, offset );

			return { xMin: xMin, yMin: yMin, xMax: xMax, yMax: yMax };

		}

		function parseLineOrder( dataView, offset ) {

			var lineOrders = [
				'INCREASING_Y'
			];

			var lineOrder = parseUint8( dataView, offset );

			return lineOrders[ lineOrder ];

		}

		function parseV2f( dataView, offset ) {

			var x = parseFloat32( dataView, offset );
			var y = parseFloat32( dataView, offset );

			return [ x, y ];

		}

		function parseV3f( dataView, offset ) {

			var x = parseFloat32( dataView, offset );
			var y = parseFloat32( dataView, offset );
			var z = parseFloat32( dataView, offset );

			return [ x, y, z ];

		}

		function parseValue( dataView, buffer, offset, type, size ) {

			if ( type === 'string' || type === 'stringvector' || type === 'iccProfile' ) {

				return parseFixedLengthString( buffer, offset, size );

			} else if ( type === 'chlist' ) {

				return parseChlist( dataView, buffer, offset, size );

			} else if ( type === 'chromaticities' ) {

				return parseChromaticities( dataView, offset );

			} else if ( type === 'compression' ) {

				return parseCompression( dataView, offset );

			} else if ( type === 'box2i' ) {

				return parseBox2i( dataView, offset );

			} else if ( type === 'lineOrder' ) {

				return parseLineOrder( dataView, offset );

			} else if ( type === 'float' ) {

				return parseFloat32( dataView, offset );

			} else if ( type === 'v2f' ) {

				return parseV2f( dataView, offset );

			} else if ( type === 'v3f' ) {

				return parseV3f( dataView, offset );

			} else if ( type === 'int' ) {

				return parseInt32( dataView, offset );

			} else if ( type === 'rational' ) {

				return parseRational( dataView, offset );

			} else if ( type === 'timecode' ) {

				return parseTimecode( dataView, offset );

			} else if ( type === 'preview' ) {

				offset.value += size;
				return 'skipped';

			} else {

				offset.value += size;
				return undefined;

			}

		}

		var bufferDataView = new DataView( buffer );
		var uInt8Array = new Uint8Array( buffer );

		var EXRHeader = {};

		bufferDataView.getUint32( 0, true ); // magic
		bufferDataView.getUint8( 4, true ); // versionByteZero
		bufferDataView.getUint8( 5, true ); // fullMask

		// start of header

		var offset = { value: 8 }; // start at 8, after magic stuff

		var keepReading = true;

		while ( keepReading ) {

			var attributeName = parseNullTerminatedString( buffer, offset );

			if ( attributeName == 0 ) {

				keepReading = false;

			} else {

				var attributeType = parseNullTerminatedString( buffer, offset );
				var attributeSize = parseUint32( bufferDataView, offset );
				var attributeValue = parseValue( bufferDataView, buffer, offset, attributeType, attributeSize );

				if ( attributeValue === undefined ) {

					console.warn( `EXRLoader.parse: skipped unknown header attribute type \'${ attributeType }\'.` );

				} else {

					EXRHeader[ attributeName ] = attributeValue;

				}

			}

		}

		// offsets
		var dataWindowHeight = EXRHeader.dataWindow.yMax + 1;

		var uncompress;
		var scanlineBlockSize;

		switch ( EXRHeader.compression ) {

			case 'NO_COMPRESSION':

				scanlineBlockSize = 1;
				uncompress = uncompressRAW;
				break;

			case 'RLE_COMPRESSION':

				scanlineBlockSize = 1;
				uncompress = uncompressRLE;
				break;

			case 'ZIPS_COMPRESSION':

				scanlineBlockSize = 1;
				uncompress = uncompressZIP;
				break;

			case 'ZIP_COMPRESSION':

				scanlineBlockSize = 16;
				uncompress = uncompressZIP;
				break;

			case 'PIZ_COMPRESSION':

				scanlineBlockSize = 32;
				uncompress = uncompressPIZ;
				break;

			case 'PXR24_COMPRESSION':

				scanlineBlockSize = 16;
				uncompress = uncompressPXR;
				break;

			case 'DWAA_COMPRESSION':

				scanlineBlockSize = 32;
				uncompress = uncompressDWA;
				break;

			case 'DWAB_COMPRESSION':

				scanlineBlockSize = 256;
				uncompress = uncompressDWA;
				break;

			default:

				throw 'EXRLoader.parse: ' + EXRHeader.compression + ' is unsupported';

		}

		var size_t;
		var getValue;

		// mixed pixelType not supported
		var pixelType = EXRHeader.channels[ 0 ].pixelType;

		if ( pixelType === 1 ) { // half

			switch ( this.type ) {

				case three.UnsignedByteType:
				case three.FloatType:

					getValue = parseFloat16;
					size_t = INT16_SIZE;
					break;

				case three.HalfFloatType:

					getValue = parseUint16;
					size_t = INT16_SIZE;
					break;

			}

		} else if ( pixelType === 2 ) { // float

			switch ( this.type ) {

				case three.UnsignedByteType:
				case three.FloatType:

					getValue = parseFloat32;
					size_t = FLOAT32_SIZE;
					break;

				case three.HalfFloatType:

					getValue = decodeFloat32;
					size_t = FLOAT32_SIZE;

			}

		} else {

			throw 'EXRLoader.parse: unsupported pixelType ' + pixelType + ' for ' + EXRHeader.compression + '.';

		}

		var numBlocks = dataWindowHeight / scanlineBlockSize;

		for ( var i = 0; i < numBlocks; i ++ ) {

			parseUlong( bufferDataView, offset ); // scanlineOffset

		}

		// we should be passed the scanline offset table, start reading pixel data

		var width = EXRHeader.dataWindow.xMax - EXRHeader.dataWindow.xMin + 1;
		var height = EXRHeader.dataWindow.yMax - EXRHeader.dataWindow.yMin + 1;
		// Firefox only supports RGBA (half) float textures
		// var numChannels = EXRHeader.channels.length;
		var numChannels = 4;
		var size = width * height * numChannels;

		// Fill initially with 1s for the alpha value if the texture is not RGBA, RGB values will be overwritten
		switch ( this.type ) {

			case three.UnsignedByteType:
			case three.FloatType:

				var byteArray = new Float32Array( size );

				if ( EXRHeader.channels.length < numChannels ) {

					byteArray.fill( 1, 0, size );

				}

				break;

			case three.HalfFloatType:

				var byteArray = new Uint16Array( size );

				if ( EXRHeader.channels.length < numChannels ) {

					byteArray.fill( 0x3C00, 0, size ); // Uint16Array holds half float data, 0x3C00 is 1

				}

				break;

			default:

				console.error( 'THREE.EXRLoader: unsupported type: ', this.type );
				break;

		}

		var channelOffsets = {
			R: 0,
			G: 1,
			B: 2,
			A: 3
		};

		var compressionInfo = {

			size: 0,
			width: width,
			lines: scanlineBlockSize,

			offset: offset,
			array: uInt8Array,
			viewer: bufferDataView,

			type: pixelType,
			channels: EXRHeader.channels.length,

		};

		var line;
		var size;
		var viewer;
		var tmpOffset = { value: 0 };

		for ( var scanlineBlockIdx = 0; scanlineBlockIdx < height / scanlineBlockSize; scanlineBlockIdx ++ ) {

			line = parseUint32( bufferDataView, offset ); // line_no
			size = parseUint32( bufferDataView, offset ); // data_len

			compressionInfo.lines = ( line + scanlineBlockSize > height ) ? height - line : scanlineBlockSize;
			compressionInfo.offset = offset;
			compressionInfo.size = size;

			viewer = uncompress( compressionInfo );

			offset.value += size;

			for ( var line_y = 0; line_y < scanlineBlockSize; line_y ++ ) {

				var true_y = line_y + ( scanlineBlockIdx * scanlineBlockSize );

				if ( true_y >= height ) break;

				for ( var channelID = 0; channelID < EXRHeader.channels.length; channelID ++ ) {

					var cOff = channelOffsets[ EXRHeader.channels[ channelID ].name ];

					for ( var x = 0; x < width; x ++ ) {

						var idx = ( line_y * ( EXRHeader.channels.length * width ) ) + ( channelID * width ) + x;
						tmpOffset.value = idx * size_t;

						var val = getValue( viewer, tmpOffset );

						byteArray[ ( ( ( height - 1 - true_y ) * ( width * numChannels ) ) + ( x * numChannels ) ) + cOff ] = val;

					}

				}

			}

		}

		if ( this.type === three.UnsignedByteType ) {

			let v, i;
			const size = byteArray.length;
			const RGBEArray = new Uint8Array( size );

			for ( let h = 0; h < height; ++ h ) {

				for ( let w = 0; w < width; ++ w ) {

					i = h * width * 4 + w * 4;

					const red = byteArray[ i ];
					const green = byteArray[ i + 1 ];
					const blue = byteArray[ i + 2 ];

					v = ( red > green ) ? red : green;
					v = ( blue > v ) ? blue : v;

					if ( v < 1e-32 ) {

						RGBEArray[ i ] = RGBEArray[ i + 1 ] = RGBEArray[ i + 2 ] = RGBEArray[ i + 3 ] = 0;

					} else {

						const res = frexp( v );
						v = res[ 0 ] * 256 / v;

						RGBEArray[ i ] = red * v;
						RGBEArray[ i + 1 ] = green * v;
						RGBEArray[ i + 2 ] = blue * v;
						RGBEArray[ i + 3 ] = res[ 1 ] + 128;

					}

				}

			}

			byteArray = RGBEArray;

		}

		const format = ( this.type === three.UnsignedByteType ) ? three.RGBEFormat : three.RGBAFormat ;

		return {
			header: EXRHeader,
			width: width,
			height: height,
			data: byteArray,
			format: format,
			type: this.type
		};

	}

	setDataType( value ) {

		this.type = value;
		return this;

	}

	load( url, onLoad, onProgress, onError ) {

		function onLoadCallback( texture, texData ) {

			switch ( texture.type ) {

				case three.UnsignedByteType:

					texture.encoding = three.RGBEEncoding;
					texture.minFilter = three.NearestFilter;
					texture.magFilter = three.NearestFilter;
					texture.generateMipmaps = false;
					texture.flipY = false;
					break;

				case three.FloatType:
				case three.HalfFloatType:

					texture.encoding = three.LinearEncoding;
					texture.minFilter = three.LinearFilter;
					texture.magFilter = three.LinearFilter;
					texture.generateMipmaps = false;
					texture.flipY = false;
					break;

			}

			if ( onLoad ) onLoad( texture, texData );

		}

		return super.load( url, onLoadCallback, onProgress, onError );

	}

}

class DemoEXRLoader extends Demo {
  
  

  async init() {
    const { renderer } = this.deps;
    const loader = new EXRLoader().setDataType(three.FloatType);
    const texture = await loader.loadAsync(baseUrl$2 + '/textures/memorial.exr');

    const material = new three.MeshBasicMaterial({ map: texture });
    const geometry = new three.PlaneGeometry(
      (4.5 * texture.image.width) / texture.image.height,
      4.5,
    );
    this.add(new three.Mesh(geometry, material));
    this.lastToneMapping = renderer.toneMapping;
    this.lastToneMappingExposure = renderer.toneMappingExposure;
    renderer.toneMapping = three.ReinhardToneMapping;
    renderer.toneMappingExposure = 2.0;
  }
  update() {}
  dispose() {
    this.deps.renderer.toneMapping = this.lastToneMapping;
    this.deps.renderer.toneMappingExposure = this.lastToneMappingExposure;
    this.reset();
  }
}

function _optionalChain$9(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
class DemoOBJLoader extends Demo {
  async init() {
    const { textureLoader, camera, renderer } = this.deps;
    const uvMap = await textureLoader.loadAsync(
      baseUrl$2 + '/textures/UV_Grid_Sm.jpg',
    );
    const objLoader = new OBJLoader();
    const object = await objLoader.loadAsync(
      baseUrl$2 + '/models/obj/male02/male02.obj',
    );

    this.add(new three.AmbientLight(0xcccccc, 0.4));
    this.addCamera(new three.PointLight(0xffffff, 0.8));
    this.add(object);
    this.add(camera);

    object.traverse(function (child) {
      // @ts-ignore
      if (child.isMesh) child.material.map = uvMap;
    });

    object.position.y = -95;
    camera.position.z = 200;
    renderer.outputEncoding = three.LinearEncoding;
    this.addControl();
  }

  update() {
    _optionalChain$9([this, 'access', _ => _.orbitControl, 'optionalAccess', _2 => _2.update, 'call', _3 => _3()]);
  }

  dispose() {
    this.reset();
  }
}

class SVGLoader extends three.Loader {

	constructor( manager ) {

		super( manager );

		// Default dots per inch
		this.defaultDPI = 90;

		// Accepted units: 'mm', 'cm', 'in', 'pt', 'pc', 'px'
		this.defaultUnit = 'px';

	}

	load( url, onLoad, onProgress, onError ) {

		const scope = this;

		const loader = new three.FileLoader( scope.manager );
		loader.setPath( scope.path );
		loader.setRequestHeader( scope.requestHeader );
		loader.setWithCredentials( scope.withCredentials );
		loader.load( url, function ( text ) {

			try {

				onLoad( scope.parse( text ) );

			} catch ( e ) {

				if ( onError ) {

					onError( e );

				} else {

					console.error( e );

				}

				scope.manager.itemError( url );

			}

		}, onProgress, onError );

	}

	parse( text ) {

		const scope = this;

		function parseNode( node, style ) {

			if ( node.nodeType !== 1 ) return;

			const transform = getNodeTransform( node );

			let traverseChildNodes = true;

			let path = null;

			switch ( node.nodeName ) {

				case 'svg':
					break;

				case 'style':
					parseCSSStylesheet( node );
					break;

				case 'g':
					style = parseStyle( node, style );
					break;

				case 'path':
					style = parseStyle( node, style );
					if ( node.hasAttribute( 'd' ) ) path = parsePathNode( node );
					break;

				case 'rect':
					style = parseStyle( node, style );
					path = parseRectNode( node );
					break;

				case 'polygon':
					style = parseStyle( node, style );
					path = parsePolygonNode( node );
					break;

				case 'polyline':
					style = parseStyle( node, style );
					path = parsePolylineNode( node );
					break;

				case 'circle':
					style = parseStyle( node, style );
					path = parseCircleNode( node );
					break;

				case 'ellipse':
					style = parseStyle( node, style );
					path = parseEllipseNode( node );
					break;

				case 'line':
					style = parseStyle( node, style );
					path = parseLineNode( node );
					break;

				case 'defs':
					traverseChildNodes = false;
					break;

				case 'use':
					style = parseStyle( node, style );
					const usedNodeId = node.href.baseVal.substring( 1 );
					const usedNode = node.viewportElement.getElementById( usedNodeId );
					if ( usedNode ) {

						parseNode( usedNode, style );

					} else {

						console.warn( 'SVGLoader: \'use node\' references non-existent node id: ' + usedNodeId );

					}

					break;
					// console.log( node );

			}

			if ( path ) {

				if ( style.fill !== undefined && style.fill !== 'none' ) {

					path.color.setStyle( style.fill );

				}

				transformPath( path, currentTransform );

				paths.push( path );

				path.userData = { node: node, style: style };

			}

			if ( traverseChildNodes ) {

				const nodes = node.childNodes;

				for ( let i = 0; i < nodes.length; i ++ ) {

					parseNode( nodes[ i ], style );

				}

			}

			if ( transform ) {

				transformStack.pop();

				if ( transformStack.length > 0 ) {

					currentTransform.copy( transformStack[ transformStack.length - 1 ] );

				} else {

					currentTransform.identity();

				}

			}

		}

		function parsePathNode( node ) {

			const path = new three.ShapePath();

			const point = new three.Vector2();
			const control = new three.Vector2();

			const firstPoint = new three.Vector2();
			let isFirstPoint = true;
			let doSetFirstPoint = false;

			const d = node.getAttribute( 'd' );

			// console.log( d );

			const commands = d.match( /[a-df-z][^a-df-z]*/ig );

			for ( let i = 0, l = commands.length; i < l; i ++ ) {

				const command = commands[ i ];

				const type = command.charAt( 0 );
				const data = command.substr( 1 ).trim();

				if ( isFirstPoint === true ) {

					doSetFirstPoint = true;
					isFirstPoint = false;

				}

				let numbers;

				switch ( type ) {

					case 'M':
						numbers = parseFloats( data );
						for ( let j = 0, jl = numbers.length; j < jl; j += 2 ) {

							point.x = numbers[ j + 0 ];
							point.y = numbers[ j + 1 ];
							control.x = point.x;
							control.y = point.y;

							if ( j === 0 ) {

								path.moveTo( point.x, point.y );

							} else {

								path.lineTo( point.x, point.y );

							}

							if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

						}

						break;

					case 'H':
						numbers = parseFloats( data );

						for ( let j = 0, jl = numbers.length; j < jl; j ++ ) {

							point.x = numbers[ j ];
							control.x = point.x;
							control.y = point.y;
							path.lineTo( point.x, point.y );

							if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

						}

						break;

					case 'V':
						numbers = parseFloats( data );

						for ( let j = 0, jl = numbers.length; j < jl; j ++ ) {

							point.y = numbers[ j ];
							control.x = point.x;
							control.y = point.y;
							path.lineTo( point.x, point.y );

							if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

						}

						break;

					case 'L':
						numbers = parseFloats( data );

						for ( let j = 0, jl = numbers.length; j < jl; j += 2 ) {

							point.x = numbers[ j + 0 ];
							point.y = numbers[ j + 1 ];
							control.x = point.x;
							control.y = point.y;
							path.lineTo( point.x, point.y );

							if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

						}

						break;

					case 'C':
						numbers = parseFloats( data );

						for ( let j = 0, jl = numbers.length; j < jl; j += 6 ) {

							path.bezierCurveTo(
								numbers[ j + 0 ],
								numbers[ j + 1 ],
								numbers[ j + 2 ],
								numbers[ j + 3 ],
								numbers[ j + 4 ],
								numbers[ j + 5 ]
							);
							control.x = numbers[ j + 2 ];
							control.y = numbers[ j + 3 ];
							point.x = numbers[ j + 4 ];
							point.y = numbers[ j + 5 ];

							if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

						}

						break;

					case 'S':
						numbers = parseFloats( data );

						for ( let j = 0, jl = numbers.length; j < jl; j += 4 ) {

							path.bezierCurveTo(
								getReflection( point.x, control.x ),
								getReflection( point.y, control.y ),
								numbers[ j + 0 ],
								numbers[ j + 1 ],
								numbers[ j + 2 ],
								numbers[ j + 3 ]
							);
							control.x = numbers[ j + 0 ];
							control.y = numbers[ j + 1 ];
							point.x = numbers[ j + 2 ];
							point.y = numbers[ j + 3 ];

							if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

						}

						break;

					case 'Q':
						numbers = parseFloats( data );

						for ( let j = 0, jl = numbers.length; j < jl; j += 4 ) {

							path.quadraticCurveTo(
								numbers[ j + 0 ],
								numbers[ j + 1 ],
								numbers[ j + 2 ],
								numbers[ j + 3 ]
							);
							control.x = numbers[ j + 0 ];
							control.y = numbers[ j + 1 ];
							point.x = numbers[ j + 2 ];
							point.y = numbers[ j + 3 ];

							if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

						}

						break;

					case 'T':
						numbers = parseFloats( data );

						for ( let j = 0, jl = numbers.length; j < jl; j += 2 ) {

							const rx = getReflection( point.x, control.x );
							const ry = getReflection( point.y, control.y );
							path.quadraticCurveTo(
								rx,
								ry,
								numbers[ j + 0 ],
								numbers[ j + 1 ]
							);
							control.x = rx;
							control.y = ry;
							point.x = numbers[ j + 0 ];
							point.y = numbers[ j + 1 ];

							if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

						}

						break;

					case 'A':
						numbers = parseFloats( data, [ 3, 4 ], 7 );

						for ( let j = 0, jl = numbers.length; j < jl; j += 7 ) {

							// skip command if start point == end point
							if ( numbers[ j + 5 ] == point.x && numbers[ j + 6 ] == point.y ) continue;

							const start = point.clone();
							point.x = numbers[ j + 5 ];
							point.y = numbers[ j + 6 ];
							control.x = point.x;
							control.y = point.y;
							parseArcCommand(
								path, numbers[ j ], numbers[ j + 1 ], numbers[ j + 2 ], numbers[ j + 3 ], numbers[ j + 4 ], start, point
							);

							if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

						}

						break;

					case 'm':
						numbers = parseFloats( data );

						for ( let j = 0, jl = numbers.length; j < jl; j += 2 ) {

							point.x += numbers[ j + 0 ];
							point.y += numbers[ j + 1 ];
							control.x = point.x;
							control.y = point.y;

							if ( j === 0 ) {

								path.moveTo( point.x, point.y );

							} else {

								path.lineTo( point.x, point.y );

							}

							if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

						}

						break;

					case 'h':
						numbers = parseFloats( data );

						for ( let j = 0, jl = numbers.length; j < jl; j ++ ) {

							point.x += numbers[ j ];
							control.x = point.x;
							control.y = point.y;
							path.lineTo( point.x, point.y );

							if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

						}

						break;

					case 'v':
						numbers = parseFloats( data );

						for ( let j = 0, jl = numbers.length; j < jl; j ++ ) {

							point.y += numbers[ j ];
							control.x = point.x;
							control.y = point.y;
							path.lineTo( point.x, point.y );

							if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

						}

						break;

					case 'l':
						numbers = parseFloats( data );

						for ( let j = 0, jl = numbers.length; j < jl; j += 2 ) {

							point.x += numbers[ j + 0 ];
							point.y += numbers[ j + 1 ];
							control.x = point.x;
							control.y = point.y;
							path.lineTo( point.x, point.y );

							if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

						}

						break;

					case 'c':
						numbers = parseFloats( data );

						for ( let j = 0, jl = numbers.length; j < jl; j += 6 ) {

							path.bezierCurveTo(
								point.x + numbers[ j + 0 ],
								point.y + numbers[ j + 1 ],
								point.x + numbers[ j + 2 ],
								point.y + numbers[ j + 3 ],
								point.x + numbers[ j + 4 ],
								point.y + numbers[ j + 5 ]
							);
							control.x = point.x + numbers[ j + 2 ];
							control.y = point.y + numbers[ j + 3 ];
							point.x += numbers[ j + 4 ];
							point.y += numbers[ j + 5 ];

							if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

						}

						break;

					case 's':
						numbers = parseFloats( data );

						for ( let j = 0, jl = numbers.length; j < jl; j += 4 ) {

							path.bezierCurveTo(
								getReflection( point.x, control.x ),
								getReflection( point.y, control.y ),
								point.x + numbers[ j + 0 ],
								point.y + numbers[ j + 1 ],
								point.x + numbers[ j + 2 ],
								point.y + numbers[ j + 3 ]
							);
							control.x = point.x + numbers[ j + 0 ];
							control.y = point.y + numbers[ j + 1 ];
							point.x += numbers[ j + 2 ];
							point.y += numbers[ j + 3 ];

							if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

						}

						break;

					case 'q':
						numbers = parseFloats( data );

						for ( let j = 0, jl = numbers.length; j < jl; j += 4 ) {

							path.quadraticCurveTo(
								point.x + numbers[ j + 0 ],
								point.y + numbers[ j + 1 ],
								point.x + numbers[ j + 2 ],
								point.y + numbers[ j + 3 ]
							);
							control.x = point.x + numbers[ j + 0 ];
							control.y = point.y + numbers[ j + 1 ];
							point.x += numbers[ j + 2 ];
							point.y += numbers[ j + 3 ];

							if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

						}

						break;

					case 't':
						numbers = parseFloats( data );

						for ( let j = 0, jl = numbers.length; j < jl; j += 2 ) {

							const rx = getReflection( point.x, control.x );
							const ry = getReflection( point.y, control.y );
							path.quadraticCurveTo(
								rx,
								ry,
								point.x + numbers[ j + 0 ],
								point.y + numbers[ j + 1 ]
							);
							control.x = rx;
							control.y = ry;
							point.x = point.x + numbers[ j + 0 ];
							point.y = point.y + numbers[ j + 1 ];

							if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

						}

						break;

					case 'a':
						numbers = parseFloats( data, [ 3, 4 ], 7 );

						for ( let j = 0, jl = numbers.length; j < jl; j += 7 ) {

							// skip command if no displacement
							if ( numbers[ j + 5 ] == 0 && numbers[ j + 6 ] == 0 ) continue;

							const start = point.clone();
							point.x += numbers[ j + 5 ];
							point.y += numbers[ j + 6 ];
							control.x = point.x;
							control.y = point.y;
							parseArcCommand(
								path, numbers[ j ], numbers[ j + 1 ], numbers[ j + 2 ], numbers[ j + 3 ], numbers[ j + 4 ], start, point
							);

							if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

						}

						break;

					case 'Z':
					case 'z':
						path.currentPath.autoClose = true;

						if ( path.currentPath.curves.length > 0 ) {

							// Reset point to beginning of Path
							point.copy( firstPoint );
							path.currentPath.currentPoint.copy( point );
							isFirstPoint = true;

						}

						break;

					default:
						console.warn( command );

				}

				// console.log( type, parseFloats( data ), parseFloats( data ).length  )

				doSetFirstPoint = false;

			}

			return path;

		}

		function parseCSSStylesheet( node ) {

			if ( ! node.sheet || ! node.sheet.cssRules || ! node.sheet.cssRules.length ) return;

			for ( let i = 0; i < node.sheet.cssRules.length; i ++ ) {

				const stylesheet = node.sheet.cssRules[ i ];

				if ( stylesheet.type !== 1 ) continue;

				const selectorList = stylesheet.selectorText
					.split( /,/gm )
					.filter( Boolean )
					.map( i => i.trim() );

				for ( let j = 0; j < selectorList.length; j ++ ) {

					stylesheets[ selectorList[ j ] ] = Object.assign(
						stylesheets[ selectorList[ j ] ] || {},
						stylesheet.style
					);

				}

			}

		}

		/**
		 * https://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
		 * https://mortoray.com/2017/02/16/rendering-an-svg-elliptical-arc-as-bezier-curves/ Appendix: Endpoint to center arc conversion
		 * From
		 * rx ry x-axis-rotation large-arc-flag sweep-flag x y
		 * To
		 * aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation
		 */

		function parseArcCommand( path, rx, ry, x_axis_rotation, large_arc_flag, sweep_flag, start, end ) {

			if ( rx == 0 || ry == 0 ) {

				// draw a line if either of the radii == 0
				path.lineTo( end.x, end.y );
				return;

			}

			x_axis_rotation = x_axis_rotation * Math.PI / 180;

			// Ensure radii are positive
			rx = Math.abs( rx );
			ry = Math.abs( ry );

			// Compute (x1', y1')
			const dx2 = ( start.x - end.x ) / 2.0;
			const dy2 = ( start.y - end.y ) / 2.0;
			const x1p = Math.cos( x_axis_rotation ) * dx2 + Math.sin( x_axis_rotation ) * dy2;
			const y1p = - Math.sin( x_axis_rotation ) * dx2 + Math.cos( x_axis_rotation ) * dy2;

			// Compute (cx', cy')
			let rxs = rx * rx;
			let rys = ry * ry;
			const x1ps = x1p * x1p;
			const y1ps = y1p * y1p;

			// Ensure radii are large enough
			const cr = x1ps / rxs + y1ps / rys;

			if ( cr > 1 ) {

				// scale up rx,ry equally so cr == 1
				const s = Math.sqrt( cr );
				rx = s * rx;
				ry = s * ry;
				rxs = rx * rx;
				rys = ry * ry;

			}

			const dq = ( rxs * y1ps + rys * x1ps );
			const pq = ( rxs * rys - dq ) / dq;
			let q = Math.sqrt( Math.max( 0, pq ) );
			if ( large_arc_flag === sweep_flag ) q = - q;
			const cxp = q * rx * y1p / ry;
			const cyp = - q * ry * x1p / rx;

			// Step 3: Compute (cx, cy) from (cx', cy')
			const cx = Math.cos( x_axis_rotation ) * cxp - Math.sin( x_axis_rotation ) * cyp + ( start.x + end.x ) / 2;
			const cy = Math.sin( x_axis_rotation ) * cxp + Math.cos( x_axis_rotation ) * cyp + ( start.y + end.y ) / 2;

			// Step 4: Compute θ1 and Δθ
			const theta = svgAngle( 1, 0, ( x1p - cxp ) / rx, ( y1p - cyp ) / ry );
			const delta = svgAngle( ( x1p - cxp ) / rx, ( y1p - cyp ) / ry, ( - x1p - cxp ) / rx, ( - y1p - cyp ) / ry ) % ( Math.PI * 2 );

			path.currentPath.absellipse( cx, cy, rx, ry, theta, theta + delta, sweep_flag === 0, x_axis_rotation );

		}

		function svgAngle( ux, uy, vx, vy ) {

			const dot = ux * vx + uy * vy;
			const len = Math.sqrt( ux * ux + uy * uy ) * Math.sqrt( vx * vx + vy * vy );
			let ang = Math.acos( Math.max( - 1, Math.min( 1, dot / len ) ) ); // floating point precision, slightly over values appear
			if ( ( ux * vy - uy * vx ) < 0 ) ang = - ang;
			return ang;

		}

		/*
		* According to https://www.w3.org/TR/SVG/shapes.html#RectElementRXAttribute
		* rounded corner should be rendered to elliptical arc, but bezier curve does the job well enough
		*/
		function parseRectNode( node ) {

			const x = parseFloatWithUnits( node.getAttribute( 'x' ) || 0 );
			const y = parseFloatWithUnits( node.getAttribute( 'y' ) || 0 );
			const rx = parseFloatWithUnits( node.getAttribute( 'rx' ) || node.getAttribute( 'ry' ) || 0 );
			const ry = parseFloatWithUnits( node.getAttribute( 'ry' ) || node.getAttribute( 'rx' ) || 0 );
			const w = parseFloatWithUnits( node.getAttribute( 'width' ) );
			const h = parseFloatWithUnits( node.getAttribute( 'height' ) );

			// Ellipse arc to Bezier approximation Coefficient (Inversed). See:
			// https://spencermortensen.com/articles/bezier-circle/
			const bci = 1 - 0.551915024494;

			const path = new three.ShapePath();

			// top left
			path.moveTo( x + rx, y );

			// top right
			path.lineTo( x + w - rx, y );
			if ( rx !== 0 || ry !== 0 ) {

				path.bezierCurveTo(
					x + w - rx * bci,
					y,
					x + w,
					y + ry * bci,
					x + w,
					y + ry
				);

			}

			// bottom right
			path.lineTo( x + w, y + h - ry );
			if ( rx !== 0 || ry !== 0 ) {

				path.bezierCurveTo(
					x + w,
					y + h - ry * bci,
					x + w - rx * bci,
					y + h,
					x + w - rx,
					y + h
				);

			}

			// bottom left
			path.lineTo( x + rx, y + h );
			if ( rx !== 0 || ry !== 0 ) {

				path.bezierCurveTo(
					x + rx * bci,
					y + h,
					x,
					y + h - ry * bci,
					x,
					y + h - ry
				);

			}

			// back to top left
			path.lineTo( x, y + ry );
			if ( rx !== 0 || ry !== 0 ) {

				path.bezierCurveTo( x, y + ry * bci, x + rx * bci, y, x + rx, y );

			}

			return path;

		}

		function parsePolygonNode( node ) {

			function iterator( match, a, b ) {

				const x = parseFloatWithUnits( a );
				const y = parseFloatWithUnits( b );

				if ( index === 0 ) {

					path.moveTo( x, y );

				} else {

					path.lineTo( x, y );

				}

				index ++;

			}

			const regex = /(-?[\d\.?]+)[,|\s](-?[\d\.?]+)/g;

			const path = new three.ShapePath();

			let index = 0;

			node.getAttribute( 'points' ).replace( regex, iterator );

			path.currentPath.autoClose = true;

			return path;

		}

		function parsePolylineNode( node ) {

			function iterator( match, a, b ) {

				const x = parseFloatWithUnits( a );
				const y = parseFloatWithUnits( b );

				if ( index === 0 ) {

					path.moveTo( x, y );

				} else {

					path.lineTo( x, y );

				}

				index ++;

			}

			const regex = /(-?[\d\.?]+)[,|\s](-?[\d\.?]+)/g;

			const path = new three.ShapePath();

			let index = 0;

			node.getAttribute( 'points' ).replace( regex, iterator );

			path.currentPath.autoClose = false;

			return path;

		}

		function parseCircleNode( node ) {

			const x = parseFloatWithUnits( node.getAttribute( 'cx' ) || 0 );
			const y = parseFloatWithUnits( node.getAttribute( 'cy' ) || 0 );
			const r = parseFloatWithUnits( node.getAttribute( 'r' ) || 0 );

			const subpath = new three.Path();
			subpath.absarc( x, y, r, 0, Math.PI * 2 );

			const path = new three.ShapePath();
			path.subPaths.push( subpath );

			return path;

		}

		function parseEllipseNode( node ) {

			const x = parseFloatWithUnits( node.getAttribute( 'cx' ) || 0 );
			const y = parseFloatWithUnits( node.getAttribute( 'cy' ) || 0 );
			const rx = parseFloatWithUnits( node.getAttribute( 'rx' ) || 0 );
			const ry = parseFloatWithUnits( node.getAttribute( 'ry' ) || 0 );

			const subpath = new three.Path();
			subpath.absellipse( x, y, rx, ry, 0, Math.PI * 2 );

			const path = new three.ShapePath();
			path.subPaths.push( subpath );

			return path;

		}

		function parseLineNode( node ) {

			const x1 = parseFloatWithUnits( node.getAttribute( 'x1' ) || 0 );
			const y1 = parseFloatWithUnits( node.getAttribute( 'y1' ) || 0 );
			const x2 = parseFloatWithUnits( node.getAttribute( 'x2' ) || 0 );
			const y2 = parseFloatWithUnits( node.getAttribute( 'y2' ) || 0 );

			const path = new three.ShapePath();
			path.moveTo( x1, y1 );
			path.lineTo( x2, y2 );
			path.currentPath.autoClose = false;

			return path;

		}

		//

		function parseStyle( node, style ) {

			style = Object.assign( {}, style ); // clone style

			let stylesheetStyles = {};

			if ( node.hasAttribute( 'class' ) ) {

				const classSelectors = node.getAttribute( 'class' )
					.split( /\s/ )
					.filter( Boolean )
					.map( i => i.trim() );

				for ( let i = 0; i < classSelectors.length; i ++ ) {

					stylesheetStyles = Object.assign( stylesheetStyles, stylesheets[ '.' + classSelectors[ i ] ] );

				}

			}

			if ( node.hasAttribute( 'id' ) ) {

				stylesheetStyles = Object.assign( stylesheetStyles, stylesheets[ '#' + node.getAttribute( 'id' ) ] );

			}

			function addStyle( svgName, jsName, adjustFunction ) {

				if ( adjustFunction === undefined ) adjustFunction = function copy( v ) {

					if ( v.startsWith( 'url' ) ) console.warn( 'SVGLoader: url access in attributes is not implemented.' );

					return v;

				};

				if ( node.hasAttribute( svgName ) ) style[ jsName ] = adjustFunction( node.getAttribute( svgName ) );
				if ( stylesheetStyles[ svgName ] ) style[ jsName ] = adjustFunction( stylesheetStyles[ svgName ] );
				if ( node.style && node.style[ svgName ] !== '' ) style[ jsName ] = adjustFunction( node.style[ svgName ] );

			}

			function clamp( v ) {

				return Math.max( 0, Math.min( 1, parseFloatWithUnits( v ) ) );

			}

			function positive( v ) {

				return Math.max( 0, parseFloatWithUnits( v ) );

			}

			addStyle( 'fill', 'fill' );
			addStyle( 'fill-opacity', 'fillOpacity', clamp );
			addStyle( 'fill-rule', 'fillRule' );
			addStyle( 'opacity', 'opacity', clamp );
			addStyle( 'stroke', 'stroke' );
			addStyle( 'stroke-opacity', 'strokeOpacity', clamp );
			addStyle( 'stroke-width', 'strokeWidth', positive );
			addStyle( 'stroke-linejoin', 'strokeLineJoin' );
			addStyle( 'stroke-linecap', 'strokeLineCap' );
			addStyle( 'stroke-miterlimit', 'strokeMiterLimit', positive );
			addStyle( 'visibility', 'visibility' );

			return style;

		}

		// http://www.w3.org/TR/SVG11/implnote.html#PathElementImplementationNotes

		function getReflection( a, b ) {

			return a - ( b - a );

		}

		// from https://github.com/ppvg/svg-numbers (MIT License)

		function parseFloats( input, flags, stride ) {

			if ( typeof input !== 'string' ) {

				throw new TypeError( 'Invalid input: ' + typeof input );

			}

			// Character groups
			const RE = {
				SEPARATOR: /[ \t\r\n\,.\-+]/,
				WHITESPACE: /[ \t\r\n]/,
				DIGIT: /[\d]/,
				SIGN: /[-+]/,
				POINT: /\./,
				COMMA: /,/,
				EXP: /e/i,
				FLAGS: /[01]/
			};

			// States
			const SEP = 0;
			const INT = 1;
			const FLOAT = 2;
			const EXP = 3;

			let state = SEP;
			let seenComma = true;
			let number = '', exponent = '';
			const result = [];

			function throwSyntaxError( current, i, partial ) {

				const error = new SyntaxError( 'Unexpected character "' + current + '" at index ' + i + '.' );
				error.partial = partial;
				throw error;

			}

			function newNumber() {

				if ( number !== '' ) {

					if ( exponent === '' ) result.push( Number( number ) );
					else result.push( Number( number ) * Math.pow( 10, Number( exponent ) ) );

				}

				number = '';
				exponent = '';

			}

			let current;
			const length = input.length;

			for ( let i = 0; i < length; i ++ ) {

				current = input[ i ];

				// check for flags
				if ( Array.isArray( flags ) && flags.includes( result.length % stride ) && RE.FLAGS.test( current ) ) {

					state = INT;
					number = current;
					newNumber();
					continue;

				}

				// parse until next number
				if ( state === SEP ) {

					// eat whitespace
					if ( RE.WHITESPACE.test( current ) ) {

						continue;

					}

					// start new number
					if ( RE.DIGIT.test( current ) || RE.SIGN.test( current ) ) {

						state = INT;
						number = current;
						continue;

					}

					if ( RE.POINT.test( current ) ) {

						state = FLOAT;
						number = current;
						continue;

					}

					// throw on double commas (e.g. "1, , 2")
					if ( RE.COMMA.test( current ) ) {

						if ( seenComma ) {

							throwSyntaxError( current, i, result );

						}

						seenComma = true;

					}

				}

				// parse integer part
				if ( state === INT ) {

					if ( RE.DIGIT.test( current ) ) {

						number += current;
						continue;

					}

					if ( RE.POINT.test( current ) ) {

						number += current;
						state = FLOAT;
						continue;

					}

					if ( RE.EXP.test( current ) ) {

						state = EXP;
						continue;

					}

					// throw on double signs ("-+1"), but not on sign as separator ("-1-2")
					if ( RE.SIGN.test( current )
							&& number.length === 1
							&& RE.SIGN.test( number[ 0 ] ) ) {

						throwSyntaxError( current, i, result );

					}

				}

				// parse decimal part
				if ( state === FLOAT ) {

					if ( RE.DIGIT.test( current ) ) {

						number += current;
						continue;

					}

					if ( RE.EXP.test( current ) ) {

						state = EXP;
						continue;

					}

					// throw on double decimal points (e.g. "1..2")
					if ( RE.POINT.test( current ) && number[ number.length - 1 ] === '.' ) {

						throwSyntaxError( current, i, result );

					}

				}

				// parse exponent part
				if ( state === EXP ) {

					if ( RE.DIGIT.test( current ) ) {

						exponent += current;
						continue;

					}

					if ( RE.SIGN.test( current ) ) {

						if ( exponent === '' ) {

							exponent += current;
							continue;

						}

						if ( exponent.length === 1 && RE.SIGN.test( exponent ) ) {

							throwSyntaxError( current, i, result );

						}

					}

				}


				// end of number
				if ( RE.WHITESPACE.test( current ) ) {

					newNumber();
					state = SEP;
					seenComma = false;

				} else if ( RE.COMMA.test( current ) ) {

					newNumber();
					state = SEP;
					seenComma = true;

				} else if ( RE.SIGN.test( current ) ) {

					newNumber();
					state = INT;
					number = current;

				} else if ( RE.POINT.test( current ) ) {

					newNumber();
					state = FLOAT;
					number = current;

				} else {

					throwSyntaxError( current, i, result );

				}

			}

			// add the last number found (if any)
			newNumber();

			return result;

		}

		// Units

		const units = [ 'mm', 'cm', 'in', 'pt', 'pc', 'px' ];

		// Conversion: [ fromUnit ][ toUnit ] (-1 means dpi dependent)
		const unitConversion = {

			'mm': {
				'mm': 1,
				'cm': 0.1,
				'in': 1 / 25.4,
				'pt': 72 / 25.4,
				'pc': 6 / 25.4,
				'px': - 1
			},
			'cm': {
				'mm': 10,
				'cm': 1,
				'in': 1 / 2.54,
				'pt': 72 / 2.54,
				'pc': 6 / 2.54,
				'px': - 1
			},
			'in': {
				'mm': 25.4,
				'cm': 2.54,
				'in': 1,
				'pt': 72,
				'pc': 6,
				'px': - 1
			},
			'pt': {
				'mm': 25.4 / 72,
				'cm': 2.54 / 72,
				'in': 1 / 72,
				'pt': 1,
				'pc': 6 / 72,
				'px': - 1
			},
			'pc': {
				'mm': 25.4 / 6,
				'cm': 2.54 / 6,
				'in': 1 / 6,
				'pt': 72 / 6,
				'pc': 1,
				'px': - 1
			},
			'px': {
				'px': 1
			}

		};

		function parseFloatWithUnits( string ) {

			let theUnit = 'px';

			if ( typeof string === 'string' || string instanceof String ) {

				for ( let i = 0, n = units.length; i < n; i ++ ) {

					const u = units[ i ];

					if ( string.endsWith( u ) ) {

						theUnit = u;
						string = string.substring( 0, string.length - u.length );
						break;

					}

				}

			}

			let scale = undefined;

			if ( theUnit === 'px' && scope.defaultUnit !== 'px' ) {

				// Conversion scale from  pixels to inches, then to default units

				scale = unitConversion[ 'in' ][ scope.defaultUnit ] / scope.defaultDPI;

			} else {

				scale = unitConversion[ theUnit ][ scope.defaultUnit ];

				if ( scale < 0 ) {

					// Conversion scale to pixels

					scale = unitConversion[ theUnit ][ 'in' ] * scope.defaultDPI;

				}

			}

			return scale * parseFloat( string );

		}

		// Transforms

		function getNodeTransform( node ) {

			if ( ! ( node.hasAttribute( 'transform' ) || ( node.nodeName === 'use' && ( node.hasAttribute( 'x' ) || node.hasAttribute( 'y' ) ) ) ) ) {

				return null;

			}

			const transform = parseNodeTransform( node );

			if ( transformStack.length > 0 ) {

				transform.premultiply( transformStack[ transformStack.length - 1 ] );

			}

			currentTransform.copy( transform );
			transformStack.push( transform );

			return transform;

		}

		function parseNodeTransform( node ) {

			const transform = new three.Matrix3();
			const currentTransform = tempTransform0;

			if ( node.nodeName === 'use' && ( node.hasAttribute( 'x' ) || node.hasAttribute( 'y' ) ) ) {

				const tx = parseFloatWithUnits( node.getAttribute( 'x' ) );
				const ty = parseFloatWithUnits( node.getAttribute( 'y' ) );

				transform.translate( tx, ty );

			}

			if ( node.hasAttribute( 'transform' ) ) {

				const transformsTexts = node.getAttribute( 'transform' ).split( ')' );

				for ( let tIndex = transformsTexts.length - 1; tIndex >= 0; tIndex -- ) {

					const transformText = transformsTexts[ tIndex ].trim();

					if ( transformText === '' ) continue;

					const openParPos = transformText.indexOf( '(' );
					const closeParPos = transformText.length;

					if ( openParPos > 0 && openParPos < closeParPos ) {

						const transformType = transformText.substr( 0, openParPos );

						const array = parseFloats( transformText.substr( openParPos + 1, closeParPos - openParPos - 1 ) );

						currentTransform.identity();

						switch ( transformType ) {

							case 'translate':

								if ( array.length >= 1 ) {

									const tx = array[ 0 ];
									let ty = tx;

									if ( array.length >= 2 ) {

										ty = array[ 1 ];

									}

									currentTransform.translate( tx, ty );

								}

								break;

							case 'rotate':

								if ( array.length >= 1 ) {

									let angle = 0;
									let cx = 0;
									let cy = 0;

									// Angle
									angle = - array[ 0 ] * Math.PI / 180;

									if ( array.length >= 3 ) {

										// Center x, y
										cx = array[ 1 ];
										cy = array[ 2 ];

									}

									// Rotate around center (cx, cy)
									tempTransform1.identity().translate( - cx, - cy );
									tempTransform2.identity().rotate( angle );
									tempTransform3.multiplyMatrices( tempTransform2, tempTransform1 );
									tempTransform1.identity().translate( cx, cy );
									currentTransform.multiplyMatrices( tempTransform1, tempTransform3 );

								}

								break;

							case 'scale':

								if ( array.length >= 1 ) {

									const scaleX = array[ 0 ];
									let scaleY = scaleX;

									if ( array.length >= 2 ) {

										scaleY = array[ 1 ];

									}

									currentTransform.scale( scaleX, scaleY );

								}

								break;

							case 'skewX':

								if ( array.length === 1 ) {

									currentTransform.set(
										1, Math.tan( array[ 0 ] * Math.PI / 180 ), 0,
										0, 1, 0,
										0, 0, 1
									);

								}

								break;

							case 'skewY':

								if ( array.length === 1 ) {

									currentTransform.set(
										1, 0, 0,
										Math.tan( array[ 0 ] * Math.PI / 180 ), 1, 0,
										0, 0, 1
									);

								}

								break;

							case 'matrix':

								if ( array.length === 6 ) {

									currentTransform.set(
										array[ 0 ], array[ 2 ], array[ 4 ],
										array[ 1 ], array[ 3 ], array[ 5 ],
										0, 0, 1
									);

								}

								break;

						}

					}

					transform.premultiply( currentTransform );

				}

			}

			return transform;

		}

		function transformPath( path, m ) {

			function transfVec2( v2 ) {

				tempV3.set( v2.x, v2.y, 1 ).applyMatrix3( m );

				v2.set( tempV3.x, tempV3.y );

			}

			const isRotated = isTransformRotated( m );

			const subPaths = path.subPaths;

			for ( let i = 0, n = subPaths.length; i < n; i ++ ) {

				const subPath = subPaths[ i ];
				const curves = subPath.curves;

				for ( let j = 0; j < curves.length; j ++ ) {

					const curve = curves[ j ];

					if ( curve.isLineCurve ) {

						transfVec2( curve.v1 );
						transfVec2( curve.v2 );

					} else if ( curve.isCubicBezierCurve ) {

						transfVec2( curve.v0 );
						transfVec2( curve.v1 );
						transfVec2( curve.v2 );
						transfVec2( curve.v3 );

					} else if ( curve.isQuadraticBezierCurve ) {

						transfVec2( curve.v0 );
						transfVec2( curve.v1 );
						transfVec2( curve.v2 );

					} else if ( curve.isEllipseCurve ) {

						if ( isRotated ) {

							console.warn( 'SVGLoader: Elliptic arc or ellipse rotation or skewing is not implemented.' );

						}

						tempV2.set( curve.aX, curve.aY );
						transfVec2( tempV2 );
						curve.aX = tempV2.x;
						curve.aY = tempV2.y;

						curve.xRadius *= getTransformScaleX( m );
						curve.yRadius *= getTransformScaleY( m );

					}

				}

			}

		}

		function isTransformRotated( m ) {

			return m.elements[ 1 ] !== 0 || m.elements[ 3 ] !== 0;

		}

		function getTransformScaleX( m ) {

			const te = m.elements;
			return Math.sqrt( te[ 0 ] * te[ 0 ] + te[ 1 ] * te[ 1 ] );

		}

		function getTransformScaleY( m ) {

			const te = m.elements;
			return Math.sqrt( te[ 3 ] * te[ 3 ] + te[ 4 ] * te[ 4 ] );

		}

		//

		const paths = [];
		const stylesheets = {};

		const transformStack = [];

		const tempTransform0 = new three.Matrix3();
		const tempTransform1 = new three.Matrix3();
		const tempTransform2 = new three.Matrix3();
		const tempTransform3 = new three.Matrix3();
		const tempV2 = new three.Vector2();
		const tempV3 = new three.Vector3();

		const currentTransform = new three.Matrix3();

		const xml = new three._default.polyfill.DOMParser().parseFromString( text, 'image/svg+xml' ); // application/xml

		parseNode( xml.documentElement, {
			fill: '#000',
			fillOpacity: 1,
			strokeOpacity: 1,
			strokeWidth: 1,
			strokeLineJoin: 'miter',
			strokeLineCap: 'butt',
			strokeMiterLimit: 4
		} );

		const data = { paths: paths, xml: xml.documentElement };

		// console.log( paths );
		return data;

	}

	static createShapes( shapePath ) {

		// Param shapePath: a shapepath as returned by the parse function of this class
		// Returns Shape object

		const BIGNUMBER = 999999999;

		const IntersectionLocationType = {
			ORIGIN: 0,
			DESTINATION: 1,
			BETWEEN: 2,
			LEFT: 3,
			RIGHT: 4,
			BEHIND: 5,
			BEYOND: 6
		};

		const classifyResult = {
			loc: IntersectionLocationType.ORIGIN,
			t: 0
		};

		function findEdgeIntersection( a0, a1, b0, b1 ) {

			const x1 = a0.x;
			const x2 = a1.x;
			const x3 = b0.x;
			const x4 = b1.x;
			const y1 = a0.y;
			const y2 = a1.y;
			const y3 = b0.y;
			const y4 = b1.y;
			const nom1 = ( x4 - x3 ) * ( y1 - y3 ) - ( y4 - y3 ) * ( x1 - x3 );
			const nom2 = ( x2 - x1 ) * ( y1 - y3 ) - ( y2 - y1 ) * ( x1 - x3 );
			const denom = ( y4 - y3 ) * ( x2 - x1 ) - ( x4 - x3 ) * ( y2 - y1 );
			const t1 = nom1 / denom;
			const t2 = nom2 / denom;

			if ( ( ( denom === 0 ) && ( nom1 !== 0 ) ) || ( t1 <= 0 ) || ( t1 >= 1 ) || ( t2 < 0 ) || ( t2 > 1 ) ) {

				//1. lines are parallel or edges don't intersect

				return null;

			} else if ( ( nom1 === 0 ) && ( denom === 0 ) ) {

				//2. lines are colinear

				//check if endpoints of edge2 (b0-b1) lies on edge1 (a0-a1)
				for ( let i = 0; i < 2; i ++ ) {

					classifyPoint( i === 0 ? b0 : b1, a0, a1 );
					//find position of this endpoints relatively to edge1
					if ( classifyResult.loc == IntersectionLocationType.ORIGIN ) {

						const point = ( i === 0 ? b0 : b1 );
						return { x: point.x, y: point.y, t: classifyResult.t };

					} else if ( classifyResult.loc == IntersectionLocationType.BETWEEN ) {

						const x = + ( ( x1 + classifyResult.t * ( x2 - x1 ) ).toPrecision( 10 ) );
						const y = + ( ( y1 + classifyResult.t * ( y2 - y1 ) ).toPrecision( 10 ) );
						return { x: x, y: y, t: classifyResult.t, };

					}

				}

				return null;

			} else {

				//3. edges intersect

				for ( let i = 0; i < 2; i ++ ) {

					classifyPoint( i === 0 ? b0 : b1, a0, a1 );

					if ( classifyResult.loc == IntersectionLocationType.ORIGIN ) {

						const point = ( i === 0 ? b0 : b1 );
						return { x: point.x, y: point.y, t: classifyResult.t };

					}

				}

				const x = + ( ( x1 + t1 * ( x2 - x1 ) ).toPrecision( 10 ) );
				const y = + ( ( y1 + t1 * ( y2 - y1 ) ).toPrecision( 10 ) );
				return { x: x, y: y, t: t1 };

			}

		}

		function classifyPoint( p, edgeStart, edgeEnd ) {

			const ax = edgeEnd.x - edgeStart.x;
			const ay = edgeEnd.y - edgeStart.y;
			const bx = p.x - edgeStart.x;
			const by = p.y - edgeStart.y;
			const sa = ax * by - bx * ay;

			if ( ( p.x === edgeStart.x ) && ( p.y === edgeStart.y ) ) {

				classifyResult.loc = IntersectionLocationType.ORIGIN;
				classifyResult.t = 0;
				return;

			}

			if ( ( p.x === edgeEnd.x ) && ( p.y === edgeEnd.y ) ) {

				classifyResult.loc = IntersectionLocationType.DESTINATION;
				classifyResult.t = 1;
				return;

			}

			if ( sa < - Number.EPSILON ) {

				classifyResult.loc = IntersectionLocationType.LEFT;
				return;

			}

			if ( sa > Number.EPSILON ) {

				classifyResult.loc = IntersectionLocationType.RIGHT;
				return;


			}

			if ( ( ( ax * bx ) < 0 ) || ( ( ay * by ) < 0 ) ) {

				classifyResult.loc = IntersectionLocationType.BEHIND;
				return;

			}

			if ( ( Math.sqrt( ax * ax + ay * ay ) ) < ( Math.sqrt( bx * bx + by * by ) ) ) {

				classifyResult.loc = IntersectionLocationType.BEYOND;
				return;

			}

			let t;

			if ( ax !== 0 ) {

				t = bx / ax;

			} else {

				t = by / ay;

			}

			classifyResult.loc = IntersectionLocationType.BETWEEN;
			classifyResult.t = t;

		}

		function getIntersections( path1, path2 ) {

			const intersectionsRaw = [];
			const intersections = [];

			for ( let index = 1; index < path1.length; index ++ ) {

				const path1EdgeStart = path1[ index - 1 ];
				const path1EdgeEnd = path1[ index ];

				for ( let index2 = 1; index2 < path2.length; index2 ++ ) {

					const path2EdgeStart = path2[ index2 - 1 ];
					const path2EdgeEnd = path2[ index2 ];

					const intersection = findEdgeIntersection( path1EdgeStart, path1EdgeEnd, path2EdgeStart, path2EdgeEnd );

					if ( intersection !== null && intersectionsRaw.find( i => i.t <= intersection.t + Number.EPSILON && i.t >= intersection.t - Number.EPSILON ) === undefined ) {

						intersectionsRaw.push( intersection );
						intersections.push( new three.Vector2( intersection.x, intersection.y ) );

					}

				}

			}

			return intersections;

		}

		function getScanlineIntersections( scanline, boundingBox, paths ) {

			const center = new three.Vector2();
			boundingBox.getCenter( center );

			const allIntersections = [];

			paths.forEach( path => {

				// check if the center of the bounding box is in the bounding box of the paths.
				// this is a pruning method to limit the search of intersections in paths that can't envelop of the current path.
				// if a path envelops another path. The center of that oter path, has to be inside the bounding box of the enveloping path.
				if ( path.boundingBox.containsPoint( center ) ) {

					const intersections = getIntersections( scanline, path.points );

					intersections.forEach( p => {

						allIntersections.push( { identifier: path.identifier, isCW: path.isCW, point: p } );

					} );

				}

			} );

			allIntersections.sort( ( i1, i2 ) => {

				return i1.point.x - i2.point.x;

			} );

			return allIntersections;

		}

		function isHoleTo( simplePath, allPaths, scanlineMinX, scanlineMaxX, _fillRule ) {

			if ( _fillRule === null || _fillRule === undefined || _fillRule === '' ) {

				_fillRule = 'nonzero';

			}

			const centerBoundingBox = new three.Vector2();
			simplePath.boundingBox.getCenter( centerBoundingBox );

			const scanline = [ new three.Vector2( scanlineMinX, centerBoundingBox.y ), new three.Vector2( scanlineMaxX, centerBoundingBox.y ) ];

			const scanlineIntersections = getScanlineIntersections( scanline, simplePath.boundingBox, allPaths );

			scanlineIntersections.sort( ( i1, i2 ) => {

				return i1.point.x - i2.point.x;

			} );

			const baseIntersections = [];
			const otherIntersections = [];

			scanlineIntersections.forEach( i => {

				if ( i.identifier === simplePath.identifier ) {

					baseIntersections.push( i );

				} else {

					otherIntersections.push( i );

				}

			} );

			const firstXOfPath = baseIntersections[ 0 ].point.x;

			// build up the path hierarchy
			const stack = [];
			let i = 0;

			while ( i < otherIntersections.length && otherIntersections[ i ].point.x < firstXOfPath ) {

				if ( stack.length > 0 && stack[ stack.length - 1 ] === otherIntersections[ i ].identifier ) {

					stack.pop();

				} else {

					stack.push( otherIntersections[ i ].identifier );

				}

				i ++;

			}

			stack.push( simplePath.identifier );

			if ( _fillRule === 'evenodd' ) {

				const isHole = stack.length % 2 === 0 ? true : false;
				const isHoleFor = stack[ stack.length - 2 ];

				return { identifier: simplePath.identifier, isHole: isHole, for: isHoleFor };

			} else if ( _fillRule === 'nonzero' ) {

				// check if path is a hole by counting the amount of paths with alternating rotations it has to cross.
				let isHole = true;
				let isHoleFor = null;
				let lastCWValue = null;

				for ( let i = 0; i < stack.length; i ++ ) {

					const identifier = stack[ i ];
					if ( isHole ) {

						lastCWValue = allPaths[ identifier ].isCW;
						isHole = false;
						isHoleFor = identifier;

					} else if ( lastCWValue !== allPaths[ identifier ].isCW ) {

						lastCWValue = allPaths[ identifier ].isCW;
						isHole = true;

					}

				}

				return { identifier: simplePath.identifier, isHole: isHole, for: isHoleFor };

			} else {

				console.warn( 'fill-rule: "' + _fillRule + '" is currently not implemented.' );

			}

		}

		// check for self intersecting paths
		// TODO

		// check intersecting paths
		// TODO

		// prepare paths for hole detection
		let identifier = 0;

		let scanlineMinX = BIGNUMBER;
		let scanlineMaxX = - BIGNUMBER;

		let simplePaths = shapePath.subPaths.map( p => {

			const points = p.getPoints();
			let maxY = - BIGNUMBER;
			let minY = BIGNUMBER;
			let maxX = - BIGNUMBER;
			let minX = BIGNUMBER;

	      	//points.forEach(p => p.y *= -1);

			for ( let i = 0; i < points.length; i ++ ) {

				const p = points[ i ];

				if ( p.y > maxY ) {

					maxY = p.y;

				}

				if ( p.y < minY ) {

					minY = p.y;

				}

				if ( p.x > maxX ) {

					maxX = p.x;

				}

				if ( p.x < minX ) {

					minX = p.x;

				}

			}

			//
			if ( scanlineMaxX <= maxX ) {

				scanlineMaxX = maxX + 1;

			}

			if ( scanlineMinX >= minX ) {

				scanlineMinX = minX - 1;

			}

			return { points: points, isCW: three.ShapeUtils.isClockWise( points ), identifier: identifier ++, boundingBox: new three.Box2( new three.Vector2( minX, minY ), new three.Vector2( maxX, maxY ) ) };

		} );

		simplePaths = simplePaths.filter( sp => sp.points.length > 1 );

		// check if path is solid or a hole
		const isAHole = simplePaths.map( p => isHoleTo( p, simplePaths, scanlineMinX, scanlineMaxX, shapePath.userData.style.fillRule ) );


		const shapesToReturn = [];
		simplePaths.forEach( p => {

			const amIAHole = isAHole[ p.identifier ];

			if ( ! amIAHole.isHole ) {

				const shape = new three.Shape( p.points );
				const holes = isAHole.filter( h => h.isHole && h.for === p.identifier );
				holes.forEach( h => {

					const path = simplePaths[ h.identifier ];
					shape.holes.push( new three.Path( path.points ) );

				} );
				shapesToReturn.push( shape );

			}

		} );

		return shapesToReturn;

	}

	static getStrokeStyle( width, color, lineJoin, lineCap, miterLimit ) {

		// Param width: Stroke width
		// Param color: As returned by THREE.Color.getStyle()
		// Param lineJoin: One of "round", "bevel", "miter" or "miter-limit"
		// Param lineCap: One of "round", "square" or "butt"
		// Param miterLimit: Maximum join length, in multiples of the "width" parameter (join is truncated if it exceeds that distance)
		// Returns style object

		width = width !== undefined ? width : 1;
		color = color !== undefined ? color : '#000';
		lineJoin = lineJoin !== undefined ? lineJoin : 'miter';
		lineCap = lineCap !== undefined ? lineCap : 'butt';
		miterLimit = miterLimit !== undefined ? miterLimit : 4;

		return {
			strokeColor: color,
			strokeWidth: width,
			strokeLineJoin: lineJoin,
			strokeLineCap: lineCap,
			strokeMiterLimit: miterLimit
		};

	}

	static pointsToStroke( points, style, arcDivisions, minDistance ) {

		// Generates a stroke with some witdh around the given path.
		// The path can be open or closed (last point equals to first point)
		// Param points: Array of Vector2D (the path). Minimum 2 points.
		// Param style: Object with SVG properties as returned by SVGLoader.getStrokeStyle(), or SVGLoader.parse() in the path.userData.style object
		// Params arcDivisions: Arc divisions for round joins and endcaps. (Optional)
		// Param minDistance: Points closer to this distance will be merged. (Optional)
		// Returns BufferGeometry with stroke triangles (In plane z = 0). UV coordinates are generated ('u' along path. 'v' across it, from left to right)

		const vertices = [];
		const normals = [];
		const uvs = [];

		if ( SVGLoader.pointsToStrokeWithBuffers( points, style, arcDivisions, minDistance, vertices, normals, uvs ) === 0 ) {

			return null;

		}

		const geometry = new three.BufferGeometry();
		geometry.setAttribute( 'position', new three.Float32BufferAttribute( vertices, 3 ) );
		geometry.setAttribute( 'normal', new three.Float32BufferAttribute( normals, 3 ) );
		geometry.setAttribute( 'uv', new three.Float32BufferAttribute( uvs, 2 ) );

		return geometry;

	}

	static pointsToStrokeWithBuffers( points, style, arcDivisions, minDistance, vertices, normals, uvs, vertexOffset ) {

		// This function can be called to update existing arrays or buffers.
		// Accepts same parameters as pointsToStroke, plus the buffers and optional offset.
		// Param vertexOffset: Offset vertices to start writing in the buffers (3 elements/vertex for vertices and normals, and 2 elements/vertex for uvs)
		// Returns number of written vertices / normals / uvs pairs
		// if 'vertices' parameter is undefined no triangles will be generated, but the returned vertices count will still be valid (useful to preallocate the buffers)
		// 'normals' and 'uvs' buffers are optional

		const tempV2_1 = new three.Vector2();
		const tempV2_2 = new three.Vector2();
		const tempV2_3 = new three.Vector2();
		const tempV2_4 = new three.Vector2();
		const tempV2_5 = new three.Vector2();
		const tempV2_6 = new three.Vector2();
		const tempV2_7 = new three.Vector2();
		const lastPointL = new three.Vector2();
		const lastPointR = new three.Vector2();
		const point0L = new three.Vector2();
		const point0R = new three.Vector2();
		const currentPointL = new three.Vector2();
		const currentPointR = new three.Vector2();
		const nextPointL = new three.Vector2();
		const nextPointR = new three.Vector2();
		const innerPoint = new three.Vector2();
		const outerPoint = new three.Vector2();

		arcDivisions = arcDivisions !== undefined ? arcDivisions : 12;
		minDistance = minDistance !== undefined ? minDistance : 0.001;
		vertexOffset = vertexOffset !== undefined ? vertexOffset : 0;

		// First ensure there are no duplicated points
		points = removeDuplicatedPoints( points );

		const numPoints = points.length;

		if ( numPoints < 2 ) return 0;

		const isClosed = points[ 0 ].equals( points[ numPoints - 1 ] );

		let currentPoint;
		let previousPoint = points[ 0 ];
		let nextPoint;

		const strokeWidth2 = style.strokeWidth / 2;

		const deltaU = 1 / ( numPoints - 1 );
		let u0 = 0, u1;

		let innerSideModified;
		let joinIsOnLeftSide;
		let isMiter;
		let initialJoinIsOnLeftSide = false;

		let numVertices = 0;
		let currentCoordinate = vertexOffset * 3;
		let currentCoordinateUV = vertexOffset * 2;

		// Get initial left and right stroke points
		getNormal( points[ 0 ], points[ 1 ], tempV2_1 ).multiplyScalar( strokeWidth2 );
		lastPointL.copy( points[ 0 ] ).sub( tempV2_1 );
		lastPointR.copy( points[ 0 ] ).add( tempV2_1 );
		point0L.copy( lastPointL );
		point0R.copy( lastPointR );

		for ( let iPoint = 1; iPoint < numPoints; iPoint ++ ) {

			currentPoint = points[ iPoint ];

			// Get next point
			if ( iPoint === numPoints - 1 ) {

				if ( isClosed ) {

					// Skip duplicated initial point
					nextPoint = points[ 1 ];

				} else nextPoint = undefined;

			} else {

				nextPoint = points[ iPoint + 1 ];

			}

			// Normal of previous segment in tempV2_1
			const normal1 = tempV2_1;
			getNormal( previousPoint, currentPoint, normal1 );

			tempV2_3.copy( normal1 ).multiplyScalar( strokeWidth2 );
			currentPointL.copy( currentPoint ).sub( tempV2_3 );
			currentPointR.copy( currentPoint ).add( tempV2_3 );

			u1 = u0 + deltaU;

			innerSideModified = false;

			if ( nextPoint !== undefined ) {

				// Normal of next segment in tempV2_2
				getNormal( currentPoint, nextPoint, tempV2_2 );

				tempV2_3.copy( tempV2_2 ).multiplyScalar( strokeWidth2 );
				nextPointL.copy( currentPoint ).sub( tempV2_3 );
				nextPointR.copy( currentPoint ).add( tempV2_3 );

				joinIsOnLeftSide = true;
				tempV2_3.subVectors( nextPoint, previousPoint );
				if ( normal1.dot( tempV2_3 ) < 0 ) {

					joinIsOnLeftSide = false;

				}

				if ( iPoint === 1 ) initialJoinIsOnLeftSide = joinIsOnLeftSide;

				tempV2_3.subVectors( nextPoint, currentPoint );
				tempV2_3.normalize();
				const dot = Math.abs( normal1.dot( tempV2_3 ) );

				// If path is straight, don't create join
				if ( dot !== 0 ) {

					// Compute inner and outer segment intersections
					const miterSide = strokeWidth2 / dot;
					tempV2_3.multiplyScalar( - miterSide );
					tempV2_4.subVectors( currentPoint, previousPoint );
					tempV2_5.copy( tempV2_4 ).setLength( miterSide ).add( tempV2_3 );
					innerPoint.copy( tempV2_5 ).negate();
					const miterLength2 = tempV2_5.length();
					const segmentLengthPrev = tempV2_4.length();
					tempV2_4.divideScalar( segmentLengthPrev );
					tempV2_6.subVectors( nextPoint, currentPoint );
					const segmentLengthNext = tempV2_6.length();
					tempV2_6.divideScalar( segmentLengthNext );
					// Check that previous and next segments doesn't overlap with the innerPoint of intersection
					if ( tempV2_4.dot( innerPoint ) < segmentLengthPrev && tempV2_6.dot( innerPoint ) < segmentLengthNext ) {

						innerSideModified = true;

					}

					outerPoint.copy( tempV2_5 ).add( currentPoint );
					innerPoint.add( currentPoint );

					isMiter = false;

					if ( innerSideModified ) {

						if ( joinIsOnLeftSide ) {

							nextPointR.copy( innerPoint );
							currentPointR.copy( innerPoint );

						} else {

							nextPointL.copy( innerPoint );
							currentPointL.copy( innerPoint );

						}

					} else {

						// The segment triangles are generated here if there was overlapping

						makeSegmentTriangles();

					}

					switch ( style.strokeLineJoin ) {

						case 'bevel':

							makeSegmentWithBevelJoin( joinIsOnLeftSide, innerSideModified, u1 );

							break;

						case 'round':

							// Segment triangles

							createSegmentTrianglesWithMiddleSection( joinIsOnLeftSide, innerSideModified );

							// Join triangles

							if ( joinIsOnLeftSide ) {

								makeCircularSector( currentPoint, currentPointL, nextPointL, u1, 0 );

							} else {

								makeCircularSector( currentPoint, nextPointR, currentPointR, u1, 1 );

							}

							break;

						case 'miter':
						case 'miter-clip':
						default:

							const miterFraction = ( strokeWidth2 * style.strokeMiterLimit ) / miterLength2;

							if ( miterFraction < 1 ) {

								// The join miter length exceeds the miter limit

								if ( style.strokeLineJoin !== 'miter-clip' ) {

									makeSegmentWithBevelJoin( joinIsOnLeftSide, innerSideModified, u1 );
									break;

								} else {

									// Segment triangles

									createSegmentTrianglesWithMiddleSection( joinIsOnLeftSide, innerSideModified );

									// Miter-clip join triangles

									if ( joinIsOnLeftSide ) {

										tempV2_6.subVectors( outerPoint, currentPointL ).multiplyScalar( miterFraction ).add( currentPointL );
										tempV2_7.subVectors( outerPoint, nextPointL ).multiplyScalar( miterFraction ).add( nextPointL );

										addVertex( currentPointL, u1, 0 );
										addVertex( tempV2_6, u1, 0 );
										addVertex( currentPoint, u1, 0.5 );

										addVertex( currentPoint, u1, 0.5 );
										addVertex( tempV2_6, u1, 0 );
										addVertex( tempV2_7, u1, 0 );

										addVertex( currentPoint, u1, 0.5 );
										addVertex( tempV2_7, u1, 0 );
										addVertex( nextPointL, u1, 0 );

									} else {

										tempV2_6.subVectors( outerPoint, currentPointR ).multiplyScalar( miterFraction ).add( currentPointR );
										tempV2_7.subVectors( outerPoint, nextPointR ).multiplyScalar( miterFraction ).add( nextPointR );

										addVertex( currentPointR, u1, 1 );
										addVertex( tempV2_6, u1, 1 );
										addVertex( currentPoint, u1, 0.5 );

										addVertex( currentPoint, u1, 0.5 );
										addVertex( tempV2_6, u1, 1 );
										addVertex( tempV2_7, u1, 1 );

										addVertex( currentPoint, u1, 0.5 );
										addVertex( tempV2_7, u1, 1 );
										addVertex( nextPointR, u1, 1 );

									}

								}

							} else {

								// Miter join segment triangles

								if ( innerSideModified ) {

									// Optimized segment + join triangles

									if ( joinIsOnLeftSide ) {

										addVertex( lastPointR, u0, 1 );
										addVertex( lastPointL, u0, 0 );
										addVertex( outerPoint, u1, 0 );

										addVertex( lastPointR, u0, 1 );
										addVertex( outerPoint, u1, 0 );
										addVertex( innerPoint, u1, 1 );

									} else {

										addVertex( lastPointR, u0, 1 );
										addVertex( lastPointL, u0, 0 );
										addVertex( outerPoint, u1, 1 );

										addVertex( lastPointL, u0, 0 );
										addVertex( innerPoint, u1, 0 );
										addVertex( outerPoint, u1, 1 );

									}


									if ( joinIsOnLeftSide ) {

										nextPointL.copy( outerPoint );

									} else {

										nextPointR.copy( outerPoint );

									}


								} else {

									// Add extra miter join triangles

									if ( joinIsOnLeftSide ) {

										addVertex( currentPointL, u1, 0 );
										addVertex( outerPoint, u1, 0 );
										addVertex( currentPoint, u1, 0.5 );

										addVertex( currentPoint, u1, 0.5 );
										addVertex( outerPoint, u1, 0 );
										addVertex( nextPointL, u1, 0 );

									} else {

										addVertex( currentPointR, u1, 1 );
										addVertex( outerPoint, u1, 1 );
										addVertex( currentPoint, u1, 0.5 );

										addVertex( currentPoint, u1, 0.5 );
										addVertex( outerPoint, u1, 1 );
										addVertex( nextPointR, u1, 1 );

									}

								}

								isMiter = true;

							}

							break;

					}

				} else {

					// The segment triangles are generated here when two consecutive points are collinear

					makeSegmentTriangles();

				}

			} else {

				// The segment triangles are generated here if it is the ending segment

				makeSegmentTriangles();

			}

			if ( ! isClosed && iPoint === numPoints - 1 ) {

				// Start line endcap
				addCapGeometry( points[ 0 ], point0L, point0R, joinIsOnLeftSide, true, u0 );

			}

			// Increment loop variables

			u0 = u1;

			previousPoint = currentPoint;

			lastPointL.copy( nextPointL );
			lastPointR.copy( nextPointR );

		}

		if ( ! isClosed ) {

			// Ending line endcap
			addCapGeometry( currentPoint, currentPointL, currentPointR, joinIsOnLeftSide, false, u1 );

		} else if ( innerSideModified && vertices ) {

			// Modify path first segment vertices to adjust to the segments inner and outer intersections

			let lastOuter = outerPoint;
			let lastInner = innerPoint;

			if ( initialJoinIsOnLeftSide !== joinIsOnLeftSide ) {

				lastOuter = innerPoint;
				lastInner = outerPoint;

			}

			if ( joinIsOnLeftSide ) {

				if ( isMiter || initialJoinIsOnLeftSide ) {

					lastInner.toArray( vertices, 0 * 3 );
					lastInner.toArray( vertices, 3 * 3 );

					if ( isMiter ) {

						lastOuter.toArray( vertices, 1 * 3 );

					}

				}

			} else {

				if ( isMiter || ! initialJoinIsOnLeftSide ) {

					lastInner.toArray( vertices, 1 * 3 );
					lastInner.toArray( vertices, 3 * 3 );

					if ( isMiter ) {

						lastOuter.toArray( vertices, 0 * 3 );

					}

				}

			}

		}

		return numVertices;

		// -- End of algorithm

		// -- Functions

		function getNormal( p1, p2, result ) {

			result.subVectors( p2, p1 );
			return result.set( - result.y, result.x ).normalize();

		}

		function addVertex( position, u, v ) {

			if ( vertices ) {

				vertices[ currentCoordinate ] = position.x;
				vertices[ currentCoordinate + 1 ] = position.y;
				vertices[ currentCoordinate + 2 ] = 0;

				if ( normals ) {

					normals[ currentCoordinate ] = 0;
					normals[ currentCoordinate + 1 ] = 0;
					normals[ currentCoordinate + 2 ] = 1;

				}

				currentCoordinate += 3;

				if ( uvs ) {

					uvs[ currentCoordinateUV ] = u;
					uvs[ currentCoordinateUV + 1 ] = v;

					currentCoordinateUV += 2;

				}

			}

			numVertices += 3;

		}

		function makeCircularSector( center, p1, p2, u, v ) {

			// param p1, p2: Points in the circle arc.
			// p1 and p2 are in clockwise direction.

			tempV2_1.copy( p1 ).sub( center ).normalize();
			tempV2_2.copy( p2 ).sub( center ).normalize();

			let angle = Math.PI;
			const dot = tempV2_1.dot( tempV2_2 );
			if ( Math.abs( dot ) < 1 ) angle = Math.abs( Math.acos( dot ) );

			angle /= arcDivisions;

			tempV2_3.copy( p1 );

			for ( let i = 0, il = arcDivisions - 1; i < il; i ++ ) {

				tempV2_4.copy( tempV2_3 ).rotateAround( center, angle );

				addVertex( tempV2_3, u, v );
				addVertex( tempV2_4, u, v );
				addVertex( center, u, 0.5 );

				tempV2_3.copy( tempV2_4 );

			}

			addVertex( tempV2_4, u, v );
			addVertex( p2, u, v );
			addVertex( center, u, 0.5 );

		}

		function makeSegmentTriangles() {

			addVertex( lastPointR, u0, 1 );
			addVertex( lastPointL, u0, 0 );
			addVertex( currentPointL, u1, 0 );

			addVertex( lastPointR, u0, 1 );
			addVertex( currentPointL, u1, 1 );
			addVertex( currentPointR, u1, 0 );

		}

		function makeSegmentWithBevelJoin( joinIsOnLeftSide, innerSideModified, u ) {

			if ( innerSideModified ) {

				// Optimized segment + bevel triangles

				if ( joinIsOnLeftSide ) {

					// Path segments triangles

					addVertex( lastPointR, u0, 1 );
					addVertex( lastPointL, u0, 0 );
					addVertex( currentPointL, u1, 0 );

					addVertex( lastPointR, u0, 1 );
					addVertex( currentPointL, u1, 0 );
					addVertex( innerPoint, u1, 1 );

					// Bevel join triangle

					addVertex( currentPointL, u, 0 );
					addVertex( nextPointL, u, 0 );
					addVertex( innerPoint, u, 0.5 );

				} else {

					// Path segments triangles

					addVertex( lastPointR, u0, 1 );
					addVertex( lastPointL, u0, 0 );
					addVertex( currentPointR, u1, 1 );

					addVertex( lastPointL, u0, 0 );
					addVertex( innerPoint, u1, 0 );
					addVertex( currentPointR, u1, 1 );

					// Bevel join triangle

					addVertex( currentPointR, u, 1 );
					addVertex( nextPointR, u, 0 );
					addVertex( innerPoint, u, 0.5 );

				}

			} else {

				// Bevel join triangle. The segment triangles are done in the main loop

				if ( joinIsOnLeftSide ) {

					addVertex( currentPointL, u, 0 );
					addVertex( nextPointL, u, 0 );
					addVertex( currentPoint, u, 0.5 );

				} else {

					addVertex( currentPointR, u, 1 );
					addVertex( nextPointR, u, 0 );
					addVertex( currentPoint, u, 0.5 );

				}

			}

		}

		function createSegmentTrianglesWithMiddleSection( joinIsOnLeftSide, innerSideModified ) {

			if ( innerSideModified ) {

				if ( joinIsOnLeftSide ) {

					addVertex( lastPointR, u0, 1 );
					addVertex( lastPointL, u0, 0 );
					addVertex( currentPointL, u1, 0 );

					addVertex( lastPointR, u0, 1 );
					addVertex( currentPointL, u1, 0 );
					addVertex( innerPoint, u1, 1 );

					addVertex( currentPointL, u0, 0 );
					addVertex( currentPoint, u1, 0.5 );
					addVertex( innerPoint, u1, 1 );

					addVertex( currentPoint, u1, 0.5 );
					addVertex( nextPointL, u0, 0 );
					addVertex( innerPoint, u1, 1 );

				} else {

					addVertex( lastPointR, u0, 1 );
					addVertex( lastPointL, u0, 0 );
					addVertex( currentPointR, u1, 1 );

					addVertex( lastPointL, u0, 0 );
					addVertex( innerPoint, u1, 0 );
					addVertex( currentPointR, u1, 1 );

					addVertex( currentPointR, u0, 1 );
					addVertex( innerPoint, u1, 0 );
					addVertex( currentPoint, u1, 0.5 );

					addVertex( currentPoint, u1, 0.5 );
					addVertex( innerPoint, u1, 0 );
					addVertex( nextPointR, u0, 1 );

				}

			}

		}

		function addCapGeometry( center, p1, p2, joinIsOnLeftSide, start, u ) {

			// param center: End point of the path
			// param p1, p2: Left and right cap points

			switch ( style.strokeLineCap ) {

				case 'round':

					if ( start ) {

						makeCircularSector( center, p2, p1, u, 0.5 );

					} else {

						makeCircularSector( center, p1, p2, u, 0.5 );

					}

					break;

				case 'square':

					if ( start ) {

						tempV2_1.subVectors( p1, center );
						tempV2_2.set( tempV2_1.y, - tempV2_1.x );

						tempV2_3.addVectors( tempV2_1, tempV2_2 ).add( center );
						tempV2_4.subVectors( tempV2_2, tempV2_1 ).add( center );

						// Modify already existing vertices
						if ( joinIsOnLeftSide ) {

							tempV2_3.toArray( vertices, 1 * 3 );
							tempV2_4.toArray( vertices, 0 * 3 );
							tempV2_4.toArray( vertices, 3 * 3 );

						} else {

							tempV2_3.toArray( vertices, 1 * 3 );
							tempV2_3.toArray( vertices, 3 * 3 );
							tempV2_4.toArray( vertices, 0 * 3 );

						}

					} else {

						tempV2_1.subVectors( p2, center );
						tempV2_2.set( tempV2_1.y, - tempV2_1.x );

						tempV2_3.addVectors( tempV2_1, tempV2_2 ).add( center );
						tempV2_4.subVectors( tempV2_2, tempV2_1 ).add( center );

						const vl = vertices.length;

						// Modify already existing vertices
						if ( joinIsOnLeftSide ) {

							tempV2_3.toArray( vertices, vl - 1 * 3 );
							tempV2_4.toArray( vertices, vl - 2 * 3 );
							tempV2_4.toArray( vertices, vl - 4 * 3 );

						} else {

							tempV2_3.toArray( vertices, vl - 2 * 3 );
							tempV2_4.toArray( vertices, vl - 1 * 3 );
							tempV2_4.toArray( vertices, vl - 4 * 3 );

						}

					}

					break;

			}

		}

		function removeDuplicatedPoints( points ) {

			// Creates a new array if necessary with duplicated points removed.
			// This does not remove duplicated initial and ending points of a closed path.

			let dupPoints = false;
			for ( let i = 1, n = points.length - 1; i < n; i ++ ) {

				if ( points[ i ].distanceTo( points[ i + 1 ] ) < minDistance ) {

					dupPoints = true;
					break;

				}

			}

			if ( ! dupPoints ) return points;

			const newPoints = [];
			newPoints.push( points[ 0 ] );

			for ( let i = 1, n = points.length - 1; i < n; i ++ ) {

				if ( points[ i ].distanceTo( points[ i + 1 ] ) >= minDistance ) {

					newPoints.push( points[ i ] );

				}

			}

			newPoints.push( points[ points.length - 1 ] );

			return newPoints;

		}

	}


}

function _optionalChain$8(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
const baseUrl$1 = 'https://techbrood.com/threejs';

class DemoSVGLoader extends Demo {
  async init() {
    const { camera, renderer } = this.deps;
    const svgLoader = new SVGLoader();
    const svg = (await svgLoader.loadAsync(
      baseUrl$1 + '/examples/models/svg/tiger.svg',
      // 'http://192.168.0.103:8080/test.svg'
    )) ;

    const helper = new three.GridHelper(160, 10);
    helper.rotation.x = Math.PI / 2;

    this.add(helper);
    this.add(this.initSVG(svg));
    this.addControl();

    camera.position.set(0, 0, 200);
    renderer.outputEncoding = three.LinearEncoding;
  }

  initSVG(svg) {
    const guiData = {
      drawFillShapes: true,
      drawStrokes: true,
      fillShapesWireframe: false,
      strokesWireframe: false,
    };

    const { paths } = svg;
    var group = new three.Group();
    group.scale.multiplyScalar(0.25);
    group.position.x = -70;
    group.position.y = 70;
    group.scale.y *= -1;

    for (var i = 0; i < paths.length; i++) {
      var path = paths[i];

      var fillColor = path.userData.style.fill;
      if (
        fillColor !== undefined &&
        fillColor !== 'none'
      ) {
        var material = new three.MeshBasicMaterial({
          color: new three.Color().setStyle(fillColor),
          opacity: path.userData.style.fillOpacity,
          transparent: path.userData.style.fillOpacity < 1,
          side: three.DoubleSide,
          depthWrite: false,
          wireframe: guiData.fillShapesWireframe,
        });

        var shapes = path.toShapes(true);

        for (var j = 0; j < shapes.length; j++) {
          var shape = shapes[j];

          var geometry = new three.ShapeGeometry(shape);
          var mesh = new three.Mesh(geometry, material);

          group.add(mesh);
        }
      }

      var strokeColor = path.userData.style.stroke;
      if (
        strokeColor !== undefined &&
        strokeColor !== 'none'
      ) {
        var material = new three.MeshBasicMaterial({
          color: new three.Color().setStyle(strokeColor),
          opacity: path.userData.style.strokeOpacity,
          transparent: path.userData.style.strokeOpacity < 1,
          side: three.DoubleSide,
          depthWrite: false,
          wireframe: guiData.strokesWireframe,
        });

        for (var j = 0, jl = path.subPaths.length; j < jl; j++) {
          var subPath = path.subPaths[j];

          var geometry = SVGLoader.pointsToStroke(
            subPath.getPoints(),
            path.userData.style,
          );

          if (geometry) {
            var mesh = new three.Mesh(geometry, material);

            group.add(mesh);
          }
        }
      }
    }

    return group;
  }

  update() {
    _optionalChain$8([this, 'access', _ => _.orbitControl, 'optionalAccess', _2 => _2.update, 'call', _3 => _3()]);
  }

  dispose() {
    this.reset();
  }
}

// https://github.com/mrdoob/three.js/issues/5552
// http://en.wikipedia.org/wiki/RGBE_image_format

class RGBELoader extends three.DataTextureLoader {

	constructor( manager ) {

		super( manager );

		this.type = three.HalfFloatType;

	}

	// adapted from http://www.graphics.cornell.edu/~bjw/rgbe.html

	parse( buffer ) {

		const
			/* return codes for rgbe routines */
			//RGBE_RETURN_SUCCESS = 0,
			RGBE_RETURN_FAILURE = - 1,

			/* default error routine.  change this to change error handling */
			rgbe_read_error = 1,
			rgbe_write_error = 2,
			rgbe_format_error = 3,
			rgbe_memory_error = 4,
			rgbe_error = function ( rgbe_error_code, msg ) {

				switch ( rgbe_error_code ) {

					case rgbe_read_error: console.error( 'THREE.RGBELoader Read Error: ' + ( msg || '' ) );
						break;
					case rgbe_write_error: console.error( 'THREE.RGBELoader Write Error: ' + ( msg || '' ) );
						break;
					case rgbe_format_error: console.error( 'THREE.RGBELoader Bad File Format: ' + ( msg || '' ) );
						break;
					default:
					case rgbe_memory_error: console.error( 'THREE.RGBELoader: Error: ' + ( msg || '' ) );

				}

				return RGBE_RETURN_FAILURE;

			},

			/* offsets to red, green, and blue components in a data (float) pixel */
			//RGBE_DATA_RED = 0,
			//RGBE_DATA_GREEN = 1,
			//RGBE_DATA_BLUE = 2,

			/* number of floats per pixel, use 4 since stored in rgba image format */
			//RGBE_DATA_SIZE = 4,

			/* flags indicating which fields in an rgbe_header_info are valid */
			RGBE_VALID_PROGRAMTYPE = 1,
			RGBE_VALID_FORMAT = 2,
			RGBE_VALID_DIMENSIONS = 4,

			NEWLINE = '\n',

			fgets = function ( buffer, lineLimit, consume ) {

				const chunkSize = 128;

				lineLimit = ! lineLimit ? 1024 : lineLimit;
				let p = buffer.pos,
					i = - 1, len = 0, s = '',
					chunk = String.fromCharCode.apply( null, new Uint16Array( buffer.subarray( p, p + chunkSize ) ) );

				while ( ( 0 > ( i = chunk.indexOf( NEWLINE ) ) ) && ( len < lineLimit ) && ( p < buffer.byteLength ) ) {

					s += chunk; len += chunk.length;
					p += chunkSize;
					chunk += String.fromCharCode.apply( null, new Uint16Array( buffer.subarray( p, p + chunkSize ) ) );

				}

				if ( - 1 < i ) {

					/*for (i=l-1; i>=0; i--) {
						byteCode = m.charCodeAt(i);
						if (byteCode > 0x7f && byteCode <= 0x7ff) byteLen++;
						else if (byteCode > 0x7ff && byteCode <= 0xffff) byteLen += 2;
						if (byteCode >= 0xDC00 && byteCode <= 0xDFFF) i--; //trail surrogate
					}*/
					if ( false !== consume ) buffer.pos += len + i + 1;
					return s + chunk.slice( 0, i );

				}

				return false;

			},

			/* minimal header reading.  modify if you want to parse more information */
			RGBE_ReadHeader = function ( buffer ) {


				// regexes to parse header info fields
				const magic_token_re = /^#\?(\S+)/,
					gamma_re = /^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,
					exposure_re = /^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,
					format_re = /^\s*FORMAT=(\S+)\s*$/,
					dimensions_re = /^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,

					// RGBE format header struct
					header = {

						valid: 0, /* indicate which fields are valid */

						string: '', /* the actual header string */

						comments: '', /* comments found in header */

						programtype: 'RGBE', /* listed at beginning of file to identify it after "#?". defaults to "RGBE" */

						format: '', /* RGBE format, default 32-bit_rle_rgbe */

						gamma: 1.0, /* image has already been gamma corrected with given gamma. defaults to 1.0 (no correction) */

						exposure: 1.0, /* a value of 1.0 in an image corresponds to <exposure> watts/steradian/m^2. defaults to 1.0 */

						width: 0, height: 0 /* image dimensions, width/height */

					};

				let line, match;

				if ( buffer.pos >= buffer.byteLength || ! ( line = fgets( buffer ) ) ) {

					return rgbe_error( rgbe_read_error, 'no header found' );

				}

				/* if you want to require the magic token then uncomment the next line */
				if ( ! ( match = line.match( magic_token_re ) ) ) {

					return rgbe_error( rgbe_format_error, 'bad initial token' );

				}

				header.valid |= RGBE_VALID_PROGRAMTYPE;
				header.programtype = match[ 1 ];
				header.string += line + '\n';

				while ( true ) {

					line = fgets( buffer );
					if ( false === line ) break;
					header.string += line + '\n';

					if ( '#' === line.charAt( 0 ) ) {

						header.comments += line + '\n';
						continue; // comment line

					}

					if ( match = line.match( gamma_re ) ) {

						header.gamma = parseFloat( match[ 1 ], 10 );

					}

					if ( match = line.match( exposure_re ) ) {

						header.exposure = parseFloat( match[ 1 ], 10 );

					}

					if ( match = line.match( format_re ) ) {

						header.valid |= RGBE_VALID_FORMAT;
						header.format = match[ 1 ];//'32-bit_rle_rgbe';

					}

					if ( match = line.match( dimensions_re ) ) {

						header.valid |= RGBE_VALID_DIMENSIONS;
						header.height = parseInt( match[ 1 ], 10 );
						header.width = parseInt( match[ 2 ], 10 );

					}

					if ( ( header.valid & RGBE_VALID_FORMAT ) && ( header.valid & RGBE_VALID_DIMENSIONS ) ) break;

				}

				if ( ! ( header.valid & RGBE_VALID_FORMAT ) ) {

					return rgbe_error( rgbe_format_error, 'missing format specifier' );

				}

				if ( ! ( header.valid & RGBE_VALID_DIMENSIONS ) ) {

					return rgbe_error( rgbe_format_error, 'missing image size specifier' );

				}

				return header;

			},

			RGBE_ReadPixels_RLE = function ( buffer, w, h ) {

				const scanline_width = w;

				if (
					// run length encoding is not allowed so read flat
					( ( scanline_width < 8 ) || ( scanline_width > 0x7fff ) ) ||
					// this file is not run length encoded
					( ( 2 !== buffer[ 0 ] ) || ( 2 !== buffer[ 1 ] ) || ( buffer[ 2 ] & 0x80 ) )
				) {

					// return the flat buffer
					return new Uint8Array( buffer );

				}

				if ( scanline_width !== ( ( buffer[ 2 ] << 8 ) | buffer[ 3 ] ) ) {

					return rgbe_error( rgbe_format_error, 'wrong scanline width' );

				}

				const data_rgba = new Uint8Array( 4 * w * h );

				if ( ! data_rgba.length ) {

					return rgbe_error( rgbe_memory_error, 'unable to allocate buffer space' );

				}

				let offset = 0, pos = 0;

				const ptr_end = 4 * scanline_width;
				const rgbeStart = new Uint8Array( 4 );
				const scanline_buffer = new Uint8Array( ptr_end );
				let num_scanlines = h;

				// read in each successive scanline
				while ( ( num_scanlines > 0 ) && ( pos < buffer.byteLength ) ) {

					if ( pos + 4 > buffer.byteLength ) {

						return rgbe_error( rgbe_read_error );

					}

					rgbeStart[ 0 ] = buffer[ pos ++ ];
					rgbeStart[ 1 ] = buffer[ pos ++ ];
					rgbeStart[ 2 ] = buffer[ pos ++ ];
					rgbeStart[ 3 ] = buffer[ pos ++ ];

					if ( ( 2 != rgbeStart[ 0 ] ) || ( 2 != rgbeStart[ 1 ] ) || ( ( ( rgbeStart[ 2 ] << 8 ) | rgbeStart[ 3 ] ) != scanline_width ) ) {

						return rgbe_error( rgbe_format_error, 'bad rgbe scanline format' );

					}

					// read each of the four channels for the scanline into the buffer
					// first red, then green, then blue, then exponent
					let ptr = 0, count;

					while ( ( ptr < ptr_end ) && ( pos < buffer.byteLength ) ) {

						count = buffer[ pos ++ ];
						const isEncodedRun = count > 128;
						if ( isEncodedRun ) count -= 128;

						if ( ( 0 === count ) || ( ptr + count > ptr_end ) ) {

							return rgbe_error( rgbe_format_error, 'bad scanline data' );

						}

						if ( isEncodedRun ) {

							// a (encoded) run of the same value
							const byteValue = buffer[ pos ++ ];
							for ( let i = 0; i < count; i ++ ) {

								scanline_buffer[ ptr ++ ] = byteValue;

							}
							//ptr += count;

						} else {

							// a literal-run
							scanline_buffer.set( buffer.subarray( pos, pos + count ), ptr );
							ptr += count; pos += count;

						}

					}


					// now convert data from buffer into rgba
					// first red, then green, then blue, then exponent (alpha)
					const l = scanline_width; //scanline_buffer.byteLength;
					for ( let i = 0; i < l; i ++ ) {

						let off = 0;
						data_rgba[ offset ] = scanline_buffer[ i + off ];
						off += scanline_width; //1;
						data_rgba[ offset + 1 ] = scanline_buffer[ i + off ];
						off += scanline_width; //1;
						data_rgba[ offset + 2 ] = scanline_buffer[ i + off ];
						off += scanline_width; //1;
						data_rgba[ offset + 3 ] = scanline_buffer[ i + off ];
						offset += 4;

					}

					num_scanlines --;

				}

				return data_rgba;

			};

		const RGBEByteToRGBFloat = function ( sourceArray, sourceOffset, destArray, destOffset ) {

			const e = sourceArray[ sourceOffset + 3 ];
			const scale = Math.pow( 2.0, e - 128.0 ) / 255.0;

			destArray[ destOffset + 0 ] = sourceArray[ sourceOffset + 0 ] * scale;
			destArray[ destOffset + 1 ] = sourceArray[ sourceOffset + 1 ] * scale;
			destArray[ destOffset + 2 ] = sourceArray[ sourceOffset + 2 ] * scale;

		};

		const RGBEByteToRGBHalf = function ( sourceArray, sourceOffset, destArray, destOffset ) {

			const e = sourceArray[ sourceOffset + 3 ];
			const scale = Math.pow( 2.0, e - 128.0 ) / 255.0;

			// clamping to 65504, the maximum representable value in float16
			destArray[ destOffset + 0 ] = three.DataUtils.toHalfFloat( Math.min( sourceArray[ sourceOffset + 0 ] * scale, 65504 ) );
			destArray[ destOffset + 1 ] = three.DataUtils.toHalfFloat( Math.min( sourceArray[ sourceOffset + 1 ] * scale, 65504 ) );
			destArray[ destOffset + 2 ] = three.DataUtils.toHalfFloat( Math.min( sourceArray[ sourceOffset + 2 ] * scale, 65504 ) );

		};

		const byteArray = new Uint8Array( buffer );
		byteArray.pos = 0;
		const rgbe_header_info = RGBE_ReadHeader( byteArray );

		if ( RGBE_RETURN_FAILURE !== rgbe_header_info ) {

			const w = rgbe_header_info.width,
				h = rgbe_header_info.height,
				image_rgba_data = RGBE_ReadPixels_RLE( byteArray.subarray( byteArray.pos ), w, h );

			if ( RGBE_RETURN_FAILURE !== image_rgba_data ) {

				let data, format, type;
				let numElements;

				switch ( this.type ) {

					case three.UnsignedByteType:

						data = image_rgba_data;
						format = three.RGBEFormat; // handled as THREE.RGBAFormat in shaders
						type = three.UnsignedByteType;
						break;

					case three.FloatType:

						numElements = image_rgba_data.length / 4;
						const floatArray = new Float32Array( numElements * 3 );

						for ( let j = 0; j < numElements; j ++ ) {

							RGBEByteToRGBFloat( image_rgba_data, j * 4, floatArray, j * 3 );

						}

						data = floatArray;
						format = three.RGBFormat;
						type = three.FloatType;
						break;

					case three.HalfFloatType:

						numElements = image_rgba_data.length / 4;
						const halfArray = new Uint16Array( numElements * 3 );

						for ( let j = 0; j < numElements; j ++ ) {

							RGBEByteToRGBHalf( image_rgba_data, j * 4, halfArray, j * 3 );

						}

						data = halfArray;
						format = three.RGBFormat;
						type = three.HalfFloatType;
						break;

					default:

						console.error( 'THREE.RGBELoader: unsupported type: ', this.type );
						break;

				}

				return {
					width: w, height: h,
					data: data,
					header: rgbe_header_info.string,
					gamma: rgbe_header_info.gamma,
					exposure: rgbe_header_info.exposure,
					format: format,
					type: type
				};

			}

		}

		return null;

	}

	setDataType( value ) {

		this.type = value;
		return this;

	}

	load( url, onLoad, onProgress, onError ) {

		function onLoadCallback( texture, texData ) {

			switch ( texture.type ) {

				case three.UnsignedByteType:

					texture.encoding = three.RGBEEncoding;
					texture.minFilter = three.NearestFilter;
					texture.magFilter = three.NearestFilter;
					texture.generateMipmaps = false;
					texture.flipY = true;
					break;

				case three.FloatType:

					texture.encoding = three.LinearEncoding;
					texture.minFilter = three.LinearFilter;
					texture.magFilter = three.LinearFilter;
					texture.generateMipmaps = false;
					texture.flipY = true;
					break;

				case three.HalfFloatType:

					texture.encoding = three.LinearEncoding;
					texture.minFilter = three.LinearFilter;
					texture.magFilter = three.LinearFilter;
					texture.generateMipmaps = false;
					texture.flipY = true;
					break;

			}

			if ( onLoad ) onLoad( texture, texData );

		}

		return super.load( url, onLoadCallback, onProgress, onError );

	}

}

function _optionalChain$7(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
const baseUrl = 'https://techbrood.com/threejs';

class DemoRGBELoader extends Demo {
  async init() {
    const { renderer, gltfLoader, scene, camera } = this.deps;
    const gltf = (await gltfLoader.loadAsync(
      baseUrl +
        '/examples/models/gltf/MetalRoughSpheres/glTF/MetalRoughSpheres.gltf',
    )) ;

    gltf.scene.rotation.copy(new three.Euler(0, 0, 0));
    renderer.physicallyCorrectLights = true;

    // env map
    const rgbeLoader = new RGBELoader();
    const pmremGenerator = new three.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const t0 = Date.now();
    const envTexture = (await rgbeLoader
      .setDataType(three.UnsignedByteType)
      .loadAsync(
        baseUrl + '/examples/textures/equirectangular/venice_sunset_2k.hdr',
      )) ;
    const t = Date.now();
    const envMap = pmremGenerator.fromEquirectangular(envTexture).texture;
    console.log('time cost', Date.now() - t, t - t0);

    envTexture.dispose();
    pmremGenerator.dispose();
    scene.background = envMap;

    // prettier-ignore
    gltf.scene.traverse( function ( node ) {
      // @ts-ignore
      if ( node.material && ( node.material.isMeshStandardMaterial ||
      // @ts-ignore
         ( node.material.isShaderMaterial && node.material.envMap !== undefined ) ) ) {
        // @ts-ignore
        node.material.envMap = envMap;
        // @ts-ignore
        node.material.envMapIntensity = 1.5; // boombox seems too dark otherwise
      }
      // @ts-ignore
      if ( node.isMesh || node.isLight ) node.castShadow = true;
    } );

    // lights
    const directionalLight = new three.DirectionalLight(0xdddddd, 4);
    directionalLight.position.set(0, 0, 1).normalize();

    const spotLight = new three.SpotLight(0xffffff, 1);
    spotLight.position.set(5, 10, 5);
    spotLight.angle = 0.5;
    spotLight.penumbra = 0.75;
    spotLight.intensity = 100;
    spotLight.decay = 2;

    camera.position.set(2, 1, 15);

    this.add(gltf.scene);
    this.add(directionalLight);
    this.add(new three.AmbientLight(0x222222));
    this.add(spotLight);
    this.addControl();
  }

  update() {
    _optionalChain$7([this, 'access', _ => _.orbitControl, 'optionalAccess', _2 => _2.update, 'call', _3 => _3()]);
  }

  dispose() {
    this.reset();
  }
}

function _optionalChain$6(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
class DemoGLTFLoader extends Demo {
  

  async init() {
    const gltf = (await this.deps.gltfLoader.loadAsync(
      // baseUrl + '/models/gltf/RobotExpressive/RobotExpressive.glb',
      'https://dtmall-tel.alicdn.com/edgeComputingConfig/upload_models/1591673169101/RobotExpressive.glb',
    )) ;
    gltf.scene.position.z = 2.5;
    gltf.scene.position.y = -2;

    this.add(new three.DirectionalLight(0xffffff, 1));
    this.add(new three.AmbientLight(0xffffff, 1));
    this.add(gltf.scene);
    this.deps.camera.position.z = 10;

    // init animtion
    const states = ['Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing'];
    const emotes = ['Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp'];
    this.mixer = new three.AnimationMixer(gltf.scene);
    const actions = {};
    for (let i = 0; i < gltf.animations.length; i++) {
      const clip = gltf.animations[i];
      const action = this.mixer.clipAction(clip);
      actions[clip.name] = action;
      if (emotes.indexOf(clip.name) >= 0 || states.indexOf(clip.name) >= 4) {
        action.clampWhenFinished = true;
        action.loop = three.LoopOnce;
      }
    }

    const activeAction = actions['Walking'];
    activeAction.play();

    this.addControl();
  }

  update() {
    _optionalChain$6([this, 'access', _ => _.mixer, 'optionalAccess', _2 => _2.update, 'call', _3 => _3(this.deps.clock.getDelta())]);
    _optionalChain$6([this, 'access', _4 => _4.orbitControl, 'optionalAccess', _5 => _5.update, 'call', _6 => _6()]);
  }

  dispose() {
    this.mixer.stopAllAction();
    this.mixer = null;
    this.reset();
  }
}

class ColladaLoader extends three.Loader {

	constructor( manager ) {

		super( manager );

	}

	load( url, onLoad, onProgress, onError ) {

		const scope = this;

		const path = ( scope.path === '' ) ? three.LoaderUtils.extractUrlBase( url ) : scope.path;

		const loader = new three.FileLoader( scope.manager );
		loader.setPath( scope.path );
		loader.setRequestHeader( scope.requestHeader );
		loader.setWithCredentials( scope.withCredentials );
		loader.load( url, function ( text ) {

			try {

				onLoad( scope.parse( text, path ) );

			} catch ( e ) {

				if ( onError ) {

					onError( e );

				} else {

					console.error( e );

				}

				scope.manager.itemError( url );

			}

		}, onProgress, onError );

	}

	parse( text, path ) {

		function getElementsByTagName( xml, name ) {

			// Non recursive xml.getElementsByTagName() ...

			const array = [];
			const childNodes = xml.childNodes;

			for ( let i = 0, l = childNodes.length; i < l; i ++ ) {

				const child = childNodes[ i ];

				if ( child.nodeName === name ) {

					array.push( child );

				}

			}

			return array;

		}

		function parseStrings( text ) {

			if ( text.length === 0 ) return [];

			const parts = text.trim().split( /\s+/ );
			const array = new Array( parts.length );

			for ( let i = 0, l = parts.length; i < l; i ++ ) {

				array[ i ] = parts[ i ];

			}

			return array;

		}

		function parseFloats( text ) {

			if ( text.length === 0 ) return [];

			const parts = text.trim().split( /\s+/ );
			const array = new Array( parts.length );

			for ( let i = 0, l = parts.length; i < l; i ++ ) {

				array[ i ] = parseFloat( parts[ i ] );

			}

			return array;

		}

		function parseInts( text ) {

			if ( text.length === 0 ) return [];

			const parts = text.trim().split( /\s+/ );
			const array = new Array( parts.length );

			for ( let i = 0, l = parts.length; i < l; i ++ ) {

				array[ i ] = parseInt( parts[ i ] );

			}

			return array;

		}

		function parseId( text ) {

			return text.substring( 1 );

		}

		function generateId() {

			return 'three_default_' + ( count ++ );

		}

		function isEmpty( object ) {

			return Object.keys( object ).length === 0;

		}

		// asset

		function parseAsset( xml ) {

			return {
				unit: parseAssetUnit( getElementsByTagName( xml, 'unit' )[ 0 ] ),
				upAxis: parseAssetUpAxis( getElementsByTagName( xml, 'up_axis' )[ 0 ] )
			};

		}

		function parseAssetUnit( xml ) {

			if ( ( xml !== undefined ) && ( xml.hasAttribute( 'meter' ) === true ) ) {

				return parseFloat( xml.getAttribute( 'meter' ) );

			} else {

				return 1; // default 1 meter

			}

		}

		function parseAssetUpAxis( xml ) {

			return xml !== undefined ? xml.textContent : 'Y_UP';

		}

		// library

		function parseLibrary( xml, libraryName, nodeName, parser ) {

			const library = getElementsByTagName( xml, libraryName )[ 0 ];

			if ( library !== undefined ) {

				const elements = getElementsByTagName( library, nodeName );

				for ( let i = 0; i < elements.length; i ++ ) {

					parser( elements[ i ] );

				}

			}

		}

		function buildLibrary( data, builder ) {

			for ( const name in data ) {

				const object = data[ name ];
				object.build = builder( data[ name ] );

			}

		}

		// get

		function getBuild( data, builder ) {

			if ( data.build !== undefined ) return data.build;

			data.build = builder( data );

			return data.build;

		}

		// animation

		function parseAnimation( xml ) {

			const data = {
				sources: {},
				samplers: {},
				channels: {}
			};

			let hasChildren = false;

			for ( let i = 0, l = xml.childNodes.length; i < l; i ++ ) {

				const child = xml.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				let id;

				switch ( child.nodeName ) {

					case 'source':
						id = child.getAttribute( 'id' );
						data.sources[ id ] = parseSource( child );
						break;

					case 'sampler':
						id = child.getAttribute( 'id' );
						data.samplers[ id ] = parseAnimationSampler( child );
						break;

					case 'channel':
						id = child.getAttribute( 'target' );
						data.channels[ id ] = parseAnimationChannel( child );
						break;

					case 'animation':
						// hierarchy of related animations
						parseAnimation( child );
						hasChildren = true;
						break;

					default:
						console.log( child );

				}

			}

			if ( hasChildren === false ) {

				// since 'id' attributes can be optional, it's necessary to generate a UUID for unqiue assignment

				library.animations[ xml.getAttribute( 'id' ) || three.MathUtils.generateUUID() ] = data;

			}

		}

		function parseAnimationSampler( xml ) {

			const data = {
				inputs: {},
			};

			for ( let i = 0, l = xml.childNodes.length; i < l; i ++ ) {

				const child = xml.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				switch ( child.nodeName ) {

					case 'input':
						const id = parseId( child.getAttribute( 'source' ) );
						const semantic = child.getAttribute( 'semantic' );
						data.inputs[ semantic ] = id;
						break;

				}

			}

			return data;

		}

		function parseAnimationChannel( xml ) {

			const data = {};

			const target = xml.getAttribute( 'target' );

			// parsing SID Addressing Syntax

			let parts = target.split( '/' );

			const id = parts.shift();
			let sid = parts.shift();

			// check selection syntax

			const arraySyntax = ( sid.indexOf( '(' ) !== - 1 );
			const memberSyntax = ( sid.indexOf( '.' ) !== - 1 );

			if ( memberSyntax ) {

				//  member selection access

				parts = sid.split( '.' );
				sid = parts.shift();
				data.member = parts.shift();

			} else if ( arraySyntax ) {

				// array-access syntax. can be used to express fields in one-dimensional vectors or two-dimensional matrices.

				const indices = sid.split( '(' );
				sid = indices.shift();

				for ( let i = 0; i < indices.length; i ++ ) {

					indices[ i ] = parseInt( indices[ i ].replace( /\)/, '' ) );

				}

				data.indices = indices;

			}

			data.id = id;
			data.sid = sid;

			data.arraySyntax = arraySyntax;
			data.memberSyntax = memberSyntax;

			data.sampler = parseId( xml.getAttribute( 'source' ) );

			return data;

		}

		function buildAnimation( data ) {

			const tracks = [];

			const channels = data.channels;
			const samplers = data.samplers;
			const sources = data.sources;

			for ( const target in channels ) {

				if ( channels.hasOwnProperty( target ) ) {

					const channel = channels[ target ];
					const sampler = samplers[ channel.sampler ];

					const inputId = sampler.inputs.INPUT;
					const outputId = sampler.inputs.OUTPUT;

					const inputSource = sources[ inputId ];
					const outputSource = sources[ outputId ];

					const animation = buildAnimationChannel( channel, inputSource, outputSource );

					createKeyframeTracks( animation, tracks );

				}

			}

			return tracks;

		}

		function getAnimation( id ) {

			return getBuild( library.animations[ id ], buildAnimation );

		}

		function buildAnimationChannel( channel, inputSource, outputSource ) {

			const node = library.nodes[ channel.id ];
			const object3D = getNode( node.id );

			const transform = node.transforms[ channel.sid ];
			const defaultMatrix = node.matrix.clone().transpose();

			let time, stride;
			let i, il, j, jl;

			const data = {};

			// the collada spec allows the animation of data in various ways.
			// depending on the transform type (matrix, translate, rotate, scale), we execute different logic

			switch ( transform ) {

				case 'matrix':

					for ( i = 0, il = inputSource.array.length; i < il; i ++ ) {

						time = inputSource.array[ i ];
						stride = i * outputSource.stride;

						if ( data[ time ] === undefined ) data[ time ] = {};

						if ( channel.arraySyntax === true ) {

							const value = outputSource.array[ stride ];
							const index = channel.indices[ 0 ] + 4 * channel.indices[ 1 ];

							data[ time ][ index ] = value;

						} else {

							for ( j = 0, jl = outputSource.stride; j < jl; j ++ ) {

								data[ time ][ j ] = outputSource.array[ stride + j ];

							}

						}

					}

					break;

				case 'translate':
					console.warn( 'THREE.ColladaLoader: Animation transform type "%s" not yet implemented.', transform );
					break;

				case 'rotate':
					console.warn( 'THREE.ColladaLoader: Animation transform type "%s" not yet implemented.', transform );
					break;

				case 'scale':
					console.warn( 'THREE.ColladaLoader: Animation transform type "%s" not yet implemented.', transform );
					break;

			}

			const keyframes = prepareAnimationData( data, defaultMatrix );

			const animation = {
				name: object3D.uuid,
				keyframes: keyframes
			};

			return animation;

		}

		function prepareAnimationData( data, defaultMatrix ) {

			const keyframes = [];

			// transfer data into a sortable array

			for ( const time in data ) {

				keyframes.push( { time: parseFloat( time ), value: data[ time ] } );

			}

			// ensure keyframes are sorted by time

			keyframes.sort( ascending );

			// now we clean up all animation data, so we can use them for keyframe tracks

			for ( let i = 0; i < 16; i ++ ) {

				transformAnimationData( keyframes, i, defaultMatrix.elements[ i ] );

			}

			return keyframes;

			// array sort function

			function ascending( a, b ) {

				return a.time - b.time;

			}

		}

		const position = new three.Vector3();
		const scale = new three.Vector3();
		const quaternion = new three.Quaternion();

		function createKeyframeTracks( animation, tracks ) {

			const keyframes = animation.keyframes;
			const name = animation.name;

			const times = [];
			const positionData = [];
			const quaternionData = [];
			const scaleData = [];

			for ( let i = 0, l = keyframes.length; i < l; i ++ ) {

				const keyframe = keyframes[ i ];

				const time = keyframe.time;
				const value = keyframe.value;

				matrix.fromArray( value ).transpose();
				matrix.decompose( position, quaternion, scale );

				times.push( time );
				positionData.push( position.x, position.y, position.z );
				quaternionData.push( quaternion.x, quaternion.y, quaternion.z, quaternion.w );
				scaleData.push( scale.x, scale.y, scale.z );

			}

			if ( positionData.length > 0 ) tracks.push( new three.VectorKeyframeTrack( name + '.position', times, positionData ) );
			if ( quaternionData.length > 0 ) tracks.push( new three.QuaternionKeyframeTrack( name + '.quaternion', times, quaternionData ) );
			if ( scaleData.length > 0 ) tracks.push( new three.VectorKeyframeTrack( name + '.scale', times, scaleData ) );

			return tracks;

		}

		function transformAnimationData( keyframes, property, defaultValue ) {

			let keyframe;

			let empty = true;
			let i, l;

			// check, if values of a property are missing in our keyframes

			for ( i = 0, l = keyframes.length; i < l; i ++ ) {

				keyframe = keyframes[ i ];

				if ( keyframe.value[ property ] === undefined ) {

					keyframe.value[ property ] = null; // mark as missing

				} else {

					empty = false;

				}

			}

			if ( empty === true ) {

				// no values at all, so we set a default value

				for ( i = 0, l = keyframes.length; i < l; i ++ ) {

					keyframe = keyframes[ i ];

					keyframe.value[ property ] = defaultValue;

				}

			} else {

				// filling gaps

				createMissingKeyframes( keyframes, property );

			}

		}

		function createMissingKeyframes( keyframes, property ) {

			let prev, next;

			for ( let i = 0, l = keyframes.length; i < l; i ++ ) {

				const keyframe = keyframes[ i ];

				if ( keyframe.value[ property ] === null ) {

					prev = getPrev( keyframes, i, property );
					next = getNext( keyframes, i, property );

					if ( prev === null ) {

						keyframe.value[ property ] = next.value[ property ];
						continue;

					}

					if ( next === null ) {

						keyframe.value[ property ] = prev.value[ property ];
						continue;

					}

					interpolate( keyframe, prev, next, property );

				}

			}

		}

		function getPrev( keyframes, i, property ) {

			while ( i >= 0 ) {

				const keyframe = keyframes[ i ];

				if ( keyframe.value[ property ] !== null ) return keyframe;

				i --;

			}

			return null;

		}

		function getNext( keyframes, i, property ) {

			while ( i < keyframes.length ) {

				const keyframe = keyframes[ i ];

				if ( keyframe.value[ property ] !== null ) return keyframe;

				i ++;

			}

			return null;

		}

		function interpolate( key, prev, next, property ) {

			if ( ( next.time - prev.time ) === 0 ) {

				key.value[ property ] = prev.value[ property ];
				return;

			}

			key.value[ property ] = ( ( key.time - prev.time ) * ( next.value[ property ] - prev.value[ property ] ) / ( next.time - prev.time ) ) + prev.value[ property ];

		}

		// animation clips

		function parseAnimationClip( xml ) {

			const data = {
				name: xml.getAttribute( 'id' ) || 'default',
				start: parseFloat( xml.getAttribute( 'start' ) || 0 ),
				end: parseFloat( xml.getAttribute( 'end' ) || 0 ),
				animations: []
			};

			for ( let i = 0, l = xml.childNodes.length; i < l; i ++ ) {

				const child = xml.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				switch ( child.nodeName ) {

					case 'instance_animation':
						data.animations.push( parseId( child.getAttribute( 'url' ) ) );
						break;

				}

			}

			library.clips[ xml.getAttribute( 'id' ) ] = data;

		}

		function buildAnimationClip( data ) {

			const tracks = [];

			const name = data.name;
			const duration = ( data.end - data.start ) || - 1;
			const animations = data.animations;

			for ( let i = 0, il = animations.length; i < il; i ++ ) {

				const animationTracks = getAnimation( animations[ i ] );

				for ( let j = 0, jl = animationTracks.length; j < jl; j ++ ) {

					tracks.push( animationTracks[ j ] );

				}

			}

			return new three.AnimationClip( name, duration, tracks );

		}

		function getAnimationClip( id ) {

			return getBuild( library.clips[ id ], buildAnimationClip );

		}

		// controller

		function parseController( xml ) {

			const data = {};

			for ( let i = 0, l = xml.childNodes.length; i < l; i ++ ) {

				const child = xml.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				switch ( child.nodeName ) {

					case 'skin':
						// there is exactly one skin per controller
						data.id = parseId( child.getAttribute( 'source' ) );
						data.skin = parseSkin( child );
						break;

					case 'morph':
						data.id = parseId( child.getAttribute( 'source' ) );
						console.warn( 'THREE.ColladaLoader: Morph target animation not supported yet.' );
						break;

				}

			}

			library.controllers[ xml.getAttribute( 'id' ) ] = data;

		}

		function parseSkin( xml ) {

			const data = {
				sources: {}
			};

			for ( let i = 0, l = xml.childNodes.length; i < l; i ++ ) {

				const child = xml.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				switch ( child.nodeName ) {

					case 'bind_shape_matrix':
						data.bindShapeMatrix = parseFloats( child.textContent );
						break;

					case 'source':
						const id = child.getAttribute( 'id' );
						data.sources[ id ] = parseSource( child );
						break;

					case 'joints':
						data.joints = parseJoints( child );
						break;

					case 'vertex_weights':
						data.vertexWeights = parseVertexWeights( child );
						break;

				}

			}

			return data;

		}

		function parseJoints( xml ) {

			const data = {
				inputs: {}
			};

			for ( let i = 0, l = xml.childNodes.length; i < l; i ++ ) {

				const child = xml.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				switch ( child.nodeName ) {

					case 'input':
						const semantic = child.getAttribute( 'semantic' );
						const id = parseId( child.getAttribute( 'source' ) );
						data.inputs[ semantic ] = id;
						break;

				}

			}

			return data;

		}

		function parseVertexWeights( xml ) {

			const data = {
				inputs: {}
			};

			for ( let i = 0, l = xml.childNodes.length; i < l; i ++ ) {

				const child = xml.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				switch ( child.nodeName ) {

					case 'input':
						const semantic = child.getAttribute( 'semantic' );
						const id = parseId( child.getAttribute( 'source' ) );
						const offset = parseInt( child.getAttribute( 'offset' ) );
						data.inputs[ semantic ] = { id: id, offset: offset };
						break;

					case 'vcount':
						data.vcount = parseInts( child.textContent );
						break;

					case 'v':
						data.v = parseInts( child.textContent );
						break;

				}

			}

			return data;

		}

		function buildController( data ) {

			const build = {
				id: data.id
			};

			const geometry = library.geometries[ build.id ];

			if ( data.skin !== undefined ) {

				build.skin = buildSkin( data.skin );

				// we enhance the 'sources' property of the corresponding geometry with our skin data

				geometry.sources.skinIndices = build.skin.indices;
				geometry.sources.skinWeights = build.skin.weights;

			}

			return build;

		}

		function buildSkin( data ) {

			const BONE_LIMIT = 4;

			const build = {
				joints: [], // this must be an array to preserve the joint order
				indices: {
					array: [],
					stride: BONE_LIMIT
				},
				weights: {
					array: [],
					stride: BONE_LIMIT
				}
			};

			const sources = data.sources;
			const vertexWeights = data.vertexWeights;

			const vcount = vertexWeights.vcount;
			const v = vertexWeights.v;
			const jointOffset = vertexWeights.inputs.JOINT.offset;
			const weightOffset = vertexWeights.inputs.WEIGHT.offset;

			const jointSource = data.sources[ data.joints.inputs.JOINT ];
			const inverseSource = data.sources[ data.joints.inputs.INV_BIND_MATRIX ];

			const weights = sources[ vertexWeights.inputs.WEIGHT.id ].array;
			let stride = 0;

			let i, j, l;

			// procces skin data for each vertex

			for ( i = 0, l = vcount.length; i < l; i ++ ) {

				const jointCount = vcount[ i ]; // this is the amount of joints that affect a single vertex
				const vertexSkinData = [];

				for ( j = 0; j < jointCount; j ++ ) {

					const skinIndex = v[ stride + jointOffset ];
					const weightId = v[ stride + weightOffset ];
					const skinWeight = weights[ weightId ];

					vertexSkinData.push( { index: skinIndex, weight: skinWeight } );

					stride += 2;

				}

				// we sort the joints in descending order based on the weights.
				// this ensures, we only procced the most important joints of the vertex

				vertexSkinData.sort( descending );

				// now we provide for each vertex a set of four index and weight values.
				// the order of the skin data matches the order of vertices

				for ( j = 0; j < BONE_LIMIT; j ++ ) {

					const d = vertexSkinData[ j ];

					if ( d !== undefined ) {

						build.indices.array.push( d.index );
						build.weights.array.push( d.weight );

					} else {

						build.indices.array.push( 0 );
						build.weights.array.push( 0 );

					}

				}

			}

			// setup bind matrix

			if ( data.bindShapeMatrix ) {

				build.bindMatrix = new three.Matrix4().fromArray( data.bindShapeMatrix ).transpose();

			} else {

				build.bindMatrix = new three.Matrix4().identity();

			}

			// process bones and inverse bind matrix data

			for ( i = 0, l = jointSource.array.length; i < l; i ++ ) {

				const name = jointSource.array[ i ];
				const boneInverse = new three.Matrix4().fromArray( inverseSource.array, i * inverseSource.stride ).transpose();

				build.joints.push( { name: name, boneInverse: boneInverse } );

			}

			return build;

			// array sort function

			function descending( a, b ) {

				return b.weight - a.weight;

			}

		}

		function getController( id ) {

			return getBuild( library.controllers[ id ], buildController );

		}

		// image

		function parseImage( xml ) {

			const data = {
				init_from: getElementsByTagName( xml, 'init_from' )[ 0 ].textContent
			};

			library.images[ xml.getAttribute( 'id' ) ] = data;

		}

		function buildImage( data ) {

			if ( data.build !== undefined ) return data.build;

			return data.init_from;

		}

		function getImage( id ) {

			const data = library.images[ id ];

			if ( data !== undefined ) {

				return getBuild( data, buildImage );

			}

			console.warn( 'THREE.ColladaLoader: Couldn\'t find image with ID:', id );

			return null;

		}

		// effect

		function parseEffect( xml ) {

			const data = {};

			for ( let i = 0, l = xml.childNodes.length; i < l; i ++ ) {

				const child = xml.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				switch ( child.nodeName ) {

					case 'profile_COMMON':
						data.profile = parseEffectProfileCOMMON( child );
						break;

				}

			}

			library.effects[ xml.getAttribute( 'id' ) ] = data;

		}

		function parseEffectProfileCOMMON( xml ) {

			const data = {
				surfaces: {},
				samplers: {}
			};

			for ( let i = 0, l = xml.childNodes.length; i < l; i ++ ) {

				const child = xml.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				switch ( child.nodeName ) {

					case 'newparam':
						parseEffectNewparam( child, data );
						break;

					case 'technique':
						data.technique = parseEffectTechnique( child );
						break;

					case 'extra':
						data.extra = parseEffectExtra( child );
						break;

				}

			}

			return data;

		}

		function parseEffectNewparam( xml, data ) {

			const sid = xml.getAttribute( 'sid' );

			for ( let i = 0, l = xml.childNodes.length; i < l; i ++ ) {

				const child = xml.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				switch ( child.nodeName ) {

					case 'surface':
						data.surfaces[ sid ] = parseEffectSurface( child );
						break;

					case 'sampler2D':
						data.samplers[ sid ] = parseEffectSampler( child );
						break;

				}

			}

		}

		function parseEffectSurface( xml ) {

			const data = {};

			for ( let i = 0, l = xml.childNodes.length; i < l; i ++ ) {

				const child = xml.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				switch ( child.nodeName ) {

					case 'init_from':
						data.init_from = child.textContent;
						break;

				}

			}

			return data;

		}

		function parseEffectSampler( xml ) {

			const data = {};

			for ( let i = 0, l = xml.childNodes.length; i < l; i ++ ) {

				const child = xml.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				switch ( child.nodeName ) {

					case 'source':
						data.source = child.textContent;
						break;

				}

			}

			return data;

		}

		function parseEffectTechnique( xml ) {

			const data = {};

			for ( let i = 0, l = xml.childNodes.length; i < l; i ++ ) {

				const child = xml.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				switch ( child.nodeName ) {

					case 'constant':
					case 'lambert':
					case 'blinn':
					case 'phong':
						data.type = child.nodeName;
						data.parameters = parseEffectParameters( child );
						break;

				}

			}

			return data;

		}

		function parseEffectParameters( xml ) {

			const data = {};

			for ( let i = 0, l = xml.childNodes.length; i < l; i ++ ) {

				const child = xml.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				switch ( child.nodeName ) {

					case 'emission':
					case 'diffuse':
					case 'specular':
					case 'bump':
					case 'ambient':
					case 'shininess':
					case 'transparency':
						data[ child.nodeName ] = parseEffectParameter( child );
						break;
					case 'transparent':
						data[ child.nodeName ] = {
							opaque: child.getAttribute( 'opaque' ),
							data: parseEffectParameter( child )
						};
						break;

				}

			}

			return data;

		}

		function parseEffectParameter( xml ) {

			const data = {};

			for ( let i = 0, l = xml.childNodes.length; i < l; i ++ ) {

				const child = xml.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				switch ( child.nodeName ) {

					case 'color':
						data[ child.nodeName ] = parseFloats( child.textContent );
						break;

					case 'float':
						data[ child.nodeName ] = parseFloat( child.textContent );
						break;

					case 'texture':
						data[ child.nodeName ] = { id: child.getAttribute( 'texture' ), extra: parseEffectParameterTexture( child ) };
						break;

				}

			}

			return data;

		}

		function parseEffectParameterTexture( xml ) {

			const data = {
				technique: {}
			};

			for ( let i = 0, l = xml.childNodes.length; i < l; i ++ ) {

				const child = xml.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				switch ( child.nodeName ) {

					case 'extra':
						parseEffectParameterTextureExtra( child, data );
						break;

				}

			}

			return data;

		}

		function parseEffectParameterTextureExtra( xml, data ) {

			for ( let i = 0, l = xml.childNodes.length; i < l; i ++ ) {

				const child = xml.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				switch ( child.nodeName ) {

					case 'technique':
						parseEffectParameterTextureExtraTechnique( child, data );
						break;

				}

			}

		}

		function parseEffectParameterTextureExtraTechnique( xml, data ) {

			for ( let i = 0, l = xml.childNodes.length; i < l; i ++ ) {

				const child = xml.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				switch ( child.nodeName ) {

					case 'repeatU':
					case 'repeatV':
					case 'offsetU':
					case 'offsetV':
						data.technique[ child.nodeName ] = parseFloat( child.textContent );
						break;

					case 'wrapU':
					case 'wrapV':

						// some files have values for wrapU/wrapV which become NaN via parseInt

						if ( child.textContent.toUpperCase() === 'TRUE' ) {

							data.technique[ child.nodeName ] = 1;

						} else if ( child.textContent.toUpperCase() === 'FALSE' ) {

							data.technique[ child.nodeName ] = 0;

						} else {

							data.technique[ child.nodeName ] = parseInt( child.textContent );

						}

						break;

				}

			}

		}

		function parseEffectExtra( xml ) {

			const data = {};

			for ( let i = 0, l = xml.childNodes.length; i < l; i ++ ) {

				const child = xml.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				switch ( child.nodeName ) {

					case 'technique':
						data.technique = parseEffectExtraTechnique( child );
						break;

				}

			}

			return data;

		}

		function parseEffectExtraTechnique( xml ) {

			const data = {};

			for ( let i = 0, l = xml.childNodes.length; i < l; i ++ ) {

				const child = xml.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				switch ( child.nodeName ) {

					case 'double_sided':
						data[ child.nodeName ] = parseInt( child.textContent );
						break;

				}

			}

			return data;

		}

		function buildEffect( data ) {

			return data;

		}

		function getEffect( id ) {

			return getBuild( library.effects[ id ], buildEffect );

		}

		// material

		function parseMaterial( xml ) {

			const data = {
				name: xml.getAttribute( 'name' )
			};

			for ( let i = 0, l = xml.childNodes.length; i < l; i ++ ) {

				const child = xml.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				switch ( child.nodeName ) {

					case 'instance_effect':
						data.url = parseId( child.getAttribute( 'url' ) );
						break;

				}

			}

			library.materials[ xml.getAttribute( 'id' ) ] = data;

		}

		function getTextureLoader( image ) {

			let loader;

			let extension = image.slice( ( image.lastIndexOf( '.' ) - 1 >>> 0 ) + 2 ); // http://www.jstips.co/en/javascript/get-file-extension/
			extension = extension.toLowerCase();

			switch ( extension ) {

				case 'tga':
					loader = tgaLoader;
					break;

				default:
					loader = textureLoader;

			}

			return loader;

		}

		function buildMaterial( data ) {

			const effect = getEffect( data.url );
			const technique = effect.profile.technique;
			const extra = effect.profile.extra;

			let material;

			switch ( technique.type ) {

				case 'phong':
				case 'blinn':
					material = new three.MeshPhongMaterial();
					break;

				case 'lambert':
					material = new three.MeshLambertMaterial();
					break;

				default:
					material = new three.MeshBasicMaterial();
					break;

			}

			material.name = data.name || '';

			function getTexture( textureObject ) {

				const sampler = effect.profile.samplers[ textureObject.id ];
				let image = null;

				// get image

				if ( sampler !== undefined ) {

					const surface = effect.profile.surfaces[ sampler.source ];
					image = getImage( surface.init_from );

				} else {

					console.warn( 'THREE.ColladaLoader: Undefined sampler. Access image directly (see #12530).' );
					image = getImage( textureObject.id );

				}

				// create texture if image is avaiable

				if ( image !== null ) {

					const loader = getTextureLoader( image );

					if ( loader !== undefined ) {

						const texture = loader.load( image );

						const extra = textureObject.extra;

						if ( extra !== undefined && extra.technique !== undefined && isEmpty( extra.technique ) === false ) {

							const technique = extra.technique;

							texture.wrapS = technique.wrapU ? three.RepeatWrapping : three.ClampToEdgeWrapping;
							texture.wrapT = technique.wrapV ? three.RepeatWrapping : three.ClampToEdgeWrapping;

							texture.offset.set( technique.offsetU || 0, technique.offsetV || 0 );
							texture.repeat.set( technique.repeatU || 1, technique.repeatV || 1 );

						} else {

							texture.wrapS = three.RepeatWrapping;
							texture.wrapT = three.RepeatWrapping;

						}

						return texture;

					} else {

						console.warn( 'THREE.ColladaLoader: Loader for texture %s not found.', image );

						return null;

					}

				} else {

					console.warn( 'THREE.ColladaLoader: Couldn\'t create texture with ID:', textureObject.id );

					return null;

				}

			}

			const parameters = technique.parameters;

			for ( const key in parameters ) {

				const parameter = parameters[ key ];

				switch ( key ) {

					case 'diffuse':
						if ( parameter.color ) material.color.fromArray( parameter.color );
						if ( parameter.texture ) material.map = getTexture( parameter.texture );
						break;
					case 'specular':
						if ( parameter.color && material.specular ) material.specular.fromArray( parameter.color );
						if ( parameter.texture ) material.specularMap = getTexture( parameter.texture );
						break;
					case 'bump':
						if ( parameter.texture ) material.normalMap = getTexture( parameter.texture );
						break;
					case 'ambient':
						if ( parameter.texture ) material.lightMap = getTexture( parameter.texture );
						break;
					case 'shininess':
						if ( parameter.float && material.shininess ) material.shininess = parameter.float;
						break;
					case 'emission':
						if ( parameter.color && material.emissive ) material.emissive.fromArray( parameter.color );
						if ( parameter.texture ) material.emissiveMap = getTexture( parameter.texture );
						break;

				}

			}

			//

			let transparent = parameters[ 'transparent' ];
			let transparency = parameters[ 'transparency' ];

			// <transparency> does not exist but <transparent>

			if ( transparency === undefined && transparent ) {

				transparency = {
					float: 1
				};

			}

			// <transparent> does not exist but <transparency>

			if ( transparent === undefined && transparency ) {

				transparent = {
					opaque: 'A_ONE',
					data: {
						color: [ 1, 1, 1, 1 ]
					} };

			}

			if ( transparent && transparency ) {

				// handle case if a texture exists but no color

				if ( transparent.data.texture ) {

					// we do not set an alpha map (see #13792)

					material.transparent = true;

				} else {

					const color = transparent.data.color;

					switch ( transparent.opaque ) {

						case 'A_ONE':
							material.opacity = color[ 3 ] * transparency.float;
							break;
						case 'RGB_ZERO':
							material.opacity = 1 - ( color[ 0 ] * transparency.float );
							break;
						case 'A_ZERO':
							material.opacity = 1 - ( color[ 3 ] * transparency.float );
							break;
						case 'RGB_ONE':
							material.opacity = color[ 0 ] * transparency.float;
							break;
						default:
							console.warn( 'THREE.ColladaLoader: Invalid opaque type "%s" of transparent tag.', transparent.opaque );

					}

					if ( material.opacity < 1 ) material.transparent = true;

				}

			}

			//

			if ( extra !== undefined && extra.technique !== undefined && extra.technique.double_sided === 1 ) {

				material.side = three.DoubleSide;

			}

			return material;

		}

		function getMaterial( id ) {

			return getBuild( library.materials[ id ], buildMaterial );

		}

		// camera

		function parseCamera( xml ) {

			const data = {
				name: xml.getAttribute( 'name' )
			};

			for ( let i = 0, l = xml.childNodes.length; i < l; i ++ ) {

				const child = xml.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				switch ( child.nodeName ) {

					case 'optics':
						data.optics = parseCameraOptics( child );
						break;

				}

			}

			library.cameras[ xml.getAttribute( 'id' ) ] = data;

		}

		function parseCameraOptics( xml ) {

			for ( let i = 0; i < xml.childNodes.length; i ++ ) {

				const child = xml.childNodes[ i ];

				switch ( child.nodeName ) {

					case 'technique_common':
						return parseCameraTechnique( child );

				}

			}

			return {};

		}

		function parseCameraTechnique( xml ) {

			const data = {};

			for ( let i = 0; i < xml.childNodes.length; i ++ ) {

				const child = xml.childNodes[ i ];

				switch ( child.nodeName ) {

					case 'perspective':
					case 'orthographic':

						data.technique = child.nodeName;
						data.parameters = parseCameraParameters( child );

						break;

				}

			}

			return data;

		}

		function parseCameraParameters( xml ) {

			const data = {};

			for ( let i = 0; i < xml.childNodes.length; i ++ ) {

				const child = xml.childNodes[ i ];

				switch ( child.nodeName ) {

					case 'xfov':
					case 'yfov':
					case 'xmag':
					case 'ymag':
					case 'znear':
					case 'zfar':
					case 'aspect_ratio':
						data[ child.nodeName ] = parseFloat( child.textContent );
						break;

				}

			}

			return data;

		}

		function buildCamera( data ) {

			let camera;

			switch ( data.optics.technique ) {

				case 'perspective':
					camera = new three.PerspectiveCamera(
						data.optics.parameters.yfov,
						data.optics.parameters.aspect_ratio,
						data.optics.parameters.znear,
						data.optics.parameters.zfar
					);
					break;

				case 'orthographic':
					let ymag = data.optics.parameters.ymag;
					let xmag = data.optics.parameters.xmag;
					const aspectRatio = data.optics.parameters.aspect_ratio;

					xmag = ( xmag === undefined ) ? ( ymag * aspectRatio ) : xmag;
					ymag = ( ymag === undefined ) ? ( xmag / aspectRatio ) : ymag;

					xmag *= 0.5;
					ymag *= 0.5;

					camera = new three.OrthographicCamera(
						- xmag, xmag, ymag, - ymag, // left, right, top, bottom
						data.optics.parameters.znear,
						data.optics.parameters.zfar
					);
					break;

				default:
					camera = new three.PerspectiveCamera();
					break;

			}

			camera.name = data.name || '';

			return camera;

		}

		function getCamera( id ) {

			const data = library.cameras[ id ];

			if ( data !== undefined ) {

				return getBuild( data, buildCamera );

			}

			console.warn( 'THREE.ColladaLoader: Couldn\'t find camera with ID:', id );

			return null;

		}

		// light

		function parseLight( xml ) {

			let data = {};

			for ( let i = 0, l = xml.childNodes.length; i < l; i ++ ) {

				const child = xml.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				switch ( child.nodeName ) {

					case 'technique_common':
						data = parseLightTechnique( child );
						break;

				}

			}

			library.lights[ xml.getAttribute( 'id' ) ] = data;

		}

		function parseLightTechnique( xml ) {

			const data = {};

			for ( let i = 0, l = xml.childNodes.length; i < l; i ++ ) {

				const child = xml.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				switch ( child.nodeName ) {

					case 'directional':
					case 'point':
					case 'spot':
					case 'ambient':

						data.technique = child.nodeName;
						data.parameters = parseLightParameters( child );

				}

			}

			return data;

		}

		function parseLightParameters( xml ) {

			const data = {};

			for ( let i = 0, l = xml.childNodes.length; i < l; i ++ ) {

				const child = xml.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				switch ( child.nodeName ) {

					case 'color':
						const array = parseFloats( child.textContent );
						data.color = new three.Color().fromArray( array );
						break;

					case 'falloff_angle':
						data.falloffAngle = parseFloat( child.textContent );
						break;

					case 'quadratic_attenuation':
						const f = parseFloat( child.textContent );
						data.distance = f ? Math.sqrt( 1 / f ) : 0;
						break;

				}

			}

			return data;

		}

		function buildLight( data ) {

			let light;

			switch ( data.technique ) {

				case 'directional':
					light = new three.DirectionalLight();
					break;

				case 'point':
					light = new three.PointLight();
					break;

				case 'spot':
					light = new three.SpotLight();
					break;

				case 'ambient':
					light = new three.AmbientLight();
					break;

			}

			if ( data.parameters.color ) light.color.copy( data.parameters.color );
			if ( data.parameters.distance ) light.distance = data.parameters.distance;

			return light;

		}

		function getLight( id ) {

			const data = library.lights[ id ];

			if ( data !== undefined ) {

				return getBuild( data, buildLight );

			}

			console.warn( 'THREE.ColladaLoader: Couldn\'t find light with ID:', id );

			return null;

		}

		// geometry

		function parseGeometry( xml ) {

			const data = {
				name: xml.getAttribute( 'name' ),
				sources: {},
				vertices: {},
				primitives: []
			};

			const mesh = getElementsByTagName( xml, 'mesh' )[ 0 ];

			// the following tags inside geometry are not supported yet (see https://github.com/mrdoob/three.js/pull/12606): convex_mesh, spline, brep
			if ( mesh === undefined ) return;

			for ( let i = 0; i < mesh.childNodes.length; i ++ ) {

				const child = mesh.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				const id = child.getAttribute( 'id' );

				switch ( child.nodeName ) {

					case 'source':
						data.sources[ id ] = parseSource( child );
						break;

					case 'vertices':
						// data.sources[ id ] = data.sources[ parseId( getElementsByTagName( child, 'input' )[ 0 ].getAttribute( 'source' ) ) ];
						data.vertices = parseGeometryVertices( child );
						break;

					case 'polygons':
						console.warn( 'THREE.ColladaLoader: Unsupported primitive type: ', child.nodeName );
						break;

					case 'lines':
					case 'linestrips':
					case 'polylist':
					case 'triangles':
						data.primitives.push( parseGeometryPrimitive( child ) );
						break;

					default:
						console.log( child );

				}

			}

			library.geometries[ xml.getAttribute( 'id' ) ] = data;

		}

		function parseSource( xml ) {

			const data = {
				array: [],
				stride: 3
			};

			for ( let i = 0; i < xml.childNodes.length; i ++ ) {

				const child = xml.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				switch ( child.nodeName ) {

					case 'float_array':
						data.array = parseFloats( child.textContent );
						break;

					case 'Name_array':
						data.array = parseStrings( child.textContent );
						break;

					case 'technique_common':
						const accessor = getElementsByTagName( child, 'accessor' )[ 0 ];

						if ( accessor !== undefined ) {

							data.stride = parseInt( accessor.getAttribute( 'stride' ) );

						}

						break;

				}

			}

			return data;

		}

		function parseGeometryVertices( xml ) {

			const data = {};

			for ( let i = 0; i < xml.childNodes.length; i ++ ) {

				const child = xml.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				data[ child.getAttribute( 'semantic' ) ] = parseId( child.getAttribute( 'source' ) );

			}

			return data;

		}

		function parseGeometryPrimitive( xml ) {

			const primitive = {
				type: xml.nodeName,
				material: xml.getAttribute( 'material' ),
				count: parseInt( xml.getAttribute( 'count' ) ),
				inputs: {},
				stride: 0,
				hasUV: false
			};

			for ( let i = 0, l = xml.childNodes.length; i < l; i ++ ) {

				const child = xml.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				switch ( child.nodeName ) {

					case 'input':
						const id = parseId( child.getAttribute( 'source' ) );
						const semantic = child.getAttribute( 'semantic' );
						const offset = parseInt( child.getAttribute( 'offset' ) );
						const set = parseInt( child.getAttribute( 'set' ) );
						const inputname = ( set > 0 ? semantic + set : semantic );
						primitive.inputs[ inputname ] = { id: id, offset: offset };
						primitive.stride = Math.max( primitive.stride, offset + 1 );
						if ( semantic === 'TEXCOORD' ) primitive.hasUV = true;
						break;

					case 'vcount':
						primitive.vcount = parseInts( child.textContent );
						break;

					case 'p':
						primitive.p = parseInts( child.textContent );
						break;

				}

			}

			return primitive;

		}

		function groupPrimitives( primitives ) {

			const build = {};

			for ( let i = 0; i < primitives.length; i ++ ) {

				const primitive = primitives[ i ];

				if ( build[ primitive.type ] === undefined ) build[ primitive.type ] = [];

				build[ primitive.type ].push( primitive );

			}

			return build;

		}

		function checkUVCoordinates( primitives ) {

			let count = 0;

			for ( let i = 0, l = primitives.length; i < l; i ++ ) {

				const primitive = primitives[ i ];

				if ( primitive.hasUV === true ) {

					count ++;

				}

			}

			if ( count > 0 && count < primitives.length ) {

				primitives.uvsNeedsFix = true;

			}

		}

		function buildGeometry( data ) {

			const build = {};

			const sources = data.sources;
			const vertices = data.vertices;
			const primitives = data.primitives;

			if ( primitives.length === 0 ) return {};

			// our goal is to create one buffer geometry for a single type of primitives
			// first, we group all primitives by their type

			const groupedPrimitives = groupPrimitives( primitives );

			for ( const type in groupedPrimitives ) {

				const primitiveType = groupedPrimitives[ type ];

				// second, ensure consistent uv coordinates for each type of primitives (polylist,triangles or lines)

				checkUVCoordinates( primitiveType );

				// third, create a buffer geometry for each type of primitives

				build[ type ] = buildGeometryType( primitiveType, sources, vertices );

			}

			return build;

		}

		function buildGeometryType( primitives, sources, vertices ) {

			const build = {};

			const position = { array: [], stride: 0 };
			const normal = { array: [], stride: 0 };
			const uv = { array: [], stride: 0 };
			const uv2 = { array: [], stride: 0 };
			const color = { array: [], stride: 0 };

			const skinIndex = { array: [], stride: 4 };
			const skinWeight = { array: [], stride: 4 };

			const geometry = new three.BufferGeometry();

			const materialKeys = [];

			let start = 0;

			for ( let p = 0; p < primitives.length; p ++ ) {

				const primitive = primitives[ p ];
				const inputs = primitive.inputs;

				// groups

				let count = 0;

				switch ( primitive.type ) {

					case 'lines':
					case 'linestrips':
						count = primitive.count * 2;
						break;

					case 'triangles':
						count = primitive.count * 3;
						break;

					case 'polylist':

						for ( let g = 0; g < primitive.count; g ++ ) {

							const vc = primitive.vcount[ g ];

							switch ( vc ) {

								case 3:
									count += 3; // single triangle
									break;

								case 4:
									count += 6; // quad, subdivided into two triangles
									break;

								default:
									count += ( vc - 2 ) * 3; // polylist with more than four vertices
									break;

							}

						}

						break;

					default:
						console.warn( 'THREE.ColladaLoader: Unknow primitive type:', primitive.type );

				}

				geometry.addGroup( start, count, p );
				start += count;

				// material

				if ( primitive.material ) {

					materialKeys.push( primitive.material );

				}

				// geometry data

				for ( const name in inputs ) {

					const input = inputs[ name ];

					switch ( name )	{

						case 'VERTEX':
							for ( const key in vertices ) {

								const id = vertices[ key ];

								switch ( key ) {

									case 'POSITION':
										const prevLength = position.array.length;
										buildGeometryData( primitive, sources[ id ], input.offset, position.array );
										position.stride = sources[ id ].stride;

										if ( sources.skinWeights && sources.skinIndices ) {

											buildGeometryData( primitive, sources.skinIndices, input.offset, skinIndex.array );
											buildGeometryData( primitive, sources.skinWeights, input.offset, skinWeight.array );

										}

										// see #3803

										if ( primitive.hasUV === false && primitives.uvsNeedsFix === true ) {

											const count = ( position.array.length - prevLength ) / position.stride;

											for ( let i = 0; i < count; i ++ ) {

												// fill missing uv coordinates

												uv.array.push( 0, 0 );

											}

										}

										break;

									case 'NORMAL':
										buildGeometryData( primitive, sources[ id ], input.offset, normal.array );
										normal.stride = sources[ id ].stride;
										break;

									case 'COLOR':
										buildGeometryData( primitive, sources[ id ], input.offset, color.array );
										color.stride = sources[ id ].stride;
										break;

									case 'TEXCOORD':
										buildGeometryData( primitive, sources[ id ], input.offset, uv.array );
										uv.stride = sources[ id ].stride;
										break;

									case 'TEXCOORD1':
										buildGeometryData( primitive, sources[ id ], input.offset, uv2.array );
										uv.stride = sources[ id ].stride;
										break;

									default:
										console.warn( 'THREE.ColladaLoader: Semantic "%s" not handled in geometry build process.', key );

								}

							}

							break;

						case 'NORMAL':
							buildGeometryData( primitive, sources[ input.id ], input.offset, normal.array );
							normal.stride = sources[ input.id ].stride;
							break;

						case 'COLOR':
							buildGeometryData( primitive, sources[ input.id ], input.offset, color.array );
							color.stride = sources[ input.id ].stride;
							break;

						case 'TEXCOORD':
							buildGeometryData( primitive, sources[ input.id ], input.offset, uv.array );
							uv.stride = sources[ input.id ].stride;
							break;

						case 'TEXCOORD1':
							buildGeometryData( primitive, sources[ input.id ], input.offset, uv2.array );
							uv2.stride = sources[ input.id ].stride;
							break;

					}

				}

			}

			// build geometry

			if ( position.array.length > 0 ) geometry.setAttribute( 'position', new three.Float32BufferAttribute( position.array, position.stride ) );
			if ( normal.array.length > 0 ) geometry.setAttribute( 'normal', new three.Float32BufferAttribute( normal.array, normal.stride ) );
			if ( color.array.length > 0 ) geometry.setAttribute( 'color', new three.Float32BufferAttribute( color.array, color.stride ) );
			if ( uv.array.length > 0 ) geometry.setAttribute( 'uv', new three.Float32BufferAttribute( uv.array, uv.stride ) );
			if ( uv2.array.length > 0 ) geometry.setAttribute( 'uv2', new three.Float32BufferAttribute( uv2.array, uv2.stride ) );

			if ( skinIndex.array.length > 0 ) geometry.setAttribute( 'skinIndex', new three.Float32BufferAttribute( skinIndex.array, skinIndex.stride ) );
			if ( skinWeight.array.length > 0 ) geometry.setAttribute( 'skinWeight', new three.Float32BufferAttribute( skinWeight.array, skinWeight.stride ) );

			build.data = geometry;
			build.type = primitives[ 0 ].type;
			build.materialKeys = materialKeys;

			return build;

		}

		function buildGeometryData( primitive, source, offset, array ) {

			const indices = primitive.p;
			const stride = primitive.stride;
			const vcount = primitive.vcount;

			function pushVector( i ) {

				let index = indices[ i + offset ] * sourceStride;
				const length = index + sourceStride;

				for ( ; index < length; index ++ ) {

					array.push( sourceArray[ index ] );

				}

			}

			const sourceArray = source.array;
			const sourceStride = source.stride;

			if ( primitive.vcount !== undefined ) {

				let index = 0;

				for ( let i = 0, l = vcount.length; i < l; i ++ ) {

					const count = vcount[ i ];

					if ( count === 4 ) {

						const a = index + stride * 0;
						const b = index + stride * 1;
						const c = index + stride * 2;
						const d = index + stride * 3;

						pushVector( a ); pushVector( b ); pushVector( d );
						pushVector( b ); pushVector( c ); pushVector( d );

					} else if ( count === 3 ) {

						const a = index + stride * 0;
						const b = index + stride * 1;
						const c = index + stride * 2;

						pushVector( a ); pushVector( b ); pushVector( c );

					} else if ( count > 4 ) {

						for ( let k = 1, kl = ( count - 2 ); k <= kl; k ++ ) {

							const a = index + stride * 0;
							const b = index + stride * k;
							const c = index + stride * ( k + 1 );

							pushVector( a ); pushVector( b ); pushVector( c );

						}

					}

					index += stride * count;

				}

			} else {

				for ( let i = 0, l = indices.length; i < l; i += stride ) {

					pushVector( i );

				}

			}

		}

		function getGeometry( id ) {

			return getBuild( library.geometries[ id ], buildGeometry );

		}

		// kinematics

		function parseKinematicsModel( xml ) {

			const data = {
				name: xml.getAttribute( 'name' ) || '',
				joints: {},
				links: []
			};

			for ( let i = 0; i < xml.childNodes.length; i ++ ) {

				const child = xml.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				switch ( child.nodeName ) {

					case 'technique_common':
						parseKinematicsTechniqueCommon( child, data );
						break;

				}

			}

			library.kinematicsModels[ xml.getAttribute( 'id' ) ] = data;

		}

		function buildKinematicsModel( data ) {

			if ( data.build !== undefined ) return data.build;

			return data;

		}

		function getKinematicsModel( id ) {

			return getBuild( library.kinematicsModels[ id ], buildKinematicsModel );

		}

		function parseKinematicsTechniqueCommon( xml, data ) {

			for ( let i = 0; i < xml.childNodes.length; i ++ ) {

				const child = xml.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				switch ( child.nodeName ) {

					case 'joint':
						data.joints[ child.getAttribute( 'sid' ) ] = parseKinematicsJoint( child );
						break;

					case 'link':
						data.links.push( parseKinematicsLink( child ) );
						break;

				}

			}

		}

		function parseKinematicsJoint( xml ) {

			let data;

			for ( let i = 0; i < xml.childNodes.length; i ++ ) {

				const child = xml.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				switch ( child.nodeName ) {

					case 'prismatic':
					case 'revolute':
						data = parseKinematicsJointParameter( child );
						break;

				}

			}

			return data;

		}

		function parseKinematicsJointParameter( xml ) {

			const data = {
				sid: xml.getAttribute( 'sid' ),
				name: xml.getAttribute( 'name' ) || '',
				axis: new three.Vector3(),
				limits: {
					min: 0,
					max: 0
				},
				type: xml.nodeName,
				static: false,
				zeroPosition: 0,
				middlePosition: 0
			};

			for ( let i = 0; i < xml.childNodes.length; i ++ ) {

				const child = xml.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				switch ( child.nodeName ) {

					case 'axis':
						const array = parseFloats( child.textContent );
						data.axis.fromArray( array );
						break;
					case 'limits':
						const max = child.getElementsByTagName( 'max' )[ 0 ];
						const min = child.getElementsByTagName( 'min' )[ 0 ];

						data.limits.max = parseFloat( max.textContent );
						data.limits.min = parseFloat( min.textContent );
						break;

				}

			}

			// if min is equal to or greater than max, consider the joint static

			if ( data.limits.min >= data.limits.max ) {

				data.static = true;

			}

			// calculate middle position

			data.middlePosition = ( data.limits.min + data.limits.max ) / 2.0;

			return data;

		}

		function parseKinematicsLink( xml ) {

			const data = {
				sid: xml.getAttribute( 'sid' ),
				name: xml.getAttribute( 'name' ) || '',
				attachments: [],
				transforms: []
			};

			for ( let i = 0; i < xml.childNodes.length; i ++ ) {

				const child = xml.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				switch ( child.nodeName ) {

					case 'attachment_full':
						data.attachments.push( parseKinematicsAttachment( child ) );
						break;

					case 'matrix':
					case 'translate':
					case 'rotate':
						data.transforms.push( parseKinematicsTransform( child ) );
						break;

				}

			}

			return data;

		}

		function parseKinematicsAttachment( xml ) {

			const data = {
				joint: xml.getAttribute( 'joint' ).split( '/' ).pop(),
				transforms: [],
				links: []
			};

			for ( let i = 0; i < xml.childNodes.length; i ++ ) {

				const child = xml.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				switch ( child.nodeName ) {

					case 'link':
						data.links.push( parseKinematicsLink( child ) );
						break;

					case 'matrix':
					case 'translate':
					case 'rotate':
						data.transforms.push( parseKinematicsTransform( child ) );
						break;

				}

			}

			return data;

		}

		function parseKinematicsTransform( xml ) {

			const data = {
				type: xml.nodeName
			};

			const array = parseFloats( xml.textContent );

			switch ( data.type ) {

				case 'matrix':
					data.obj = new three.Matrix4();
					data.obj.fromArray( array ).transpose();
					break;

				case 'translate':
					data.obj = new three.Vector3();
					data.obj.fromArray( array );
					break;

				case 'rotate':
					data.obj = new three.Vector3();
					data.obj.fromArray( array );
					data.angle = three.MathUtils.degToRad( array[ 3 ] );
					break;

			}

			return data;

		}

		// physics

		function parsePhysicsModel( xml ) {

			const data = {
				name: xml.getAttribute( 'name' ) || '',
				rigidBodies: {}
			};

			for ( let i = 0; i < xml.childNodes.length; i ++ ) {

				const child = xml.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				switch ( child.nodeName ) {

					case 'rigid_body':
						data.rigidBodies[ child.getAttribute( 'name' ) ] = {};
						parsePhysicsRigidBody( child, data.rigidBodies[ child.getAttribute( 'name' ) ] );
						break;

				}

			}

			library.physicsModels[ xml.getAttribute( 'id' ) ] = data;

		}

		function parsePhysicsRigidBody( xml, data ) {

			for ( let i = 0; i < xml.childNodes.length; i ++ ) {

				const child = xml.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				switch ( child.nodeName ) {

					case 'technique_common':
						parsePhysicsTechniqueCommon( child, data );
						break;

				}

			}

		}

		function parsePhysicsTechniqueCommon( xml, data ) {

			for ( let i = 0; i < xml.childNodes.length; i ++ ) {

				const child = xml.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				switch ( child.nodeName ) {

					case 'inertia':
						data.inertia = parseFloats( child.textContent );
						break;

					case 'mass':
						data.mass = parseFloats( child.textContent )[ 0 ];
						break;

				}

			}

		}

		// scene

		function parseKinematicsScene( xml ) {

			const data = {
				bindJointAxis: []
			};

			for ( let i = 0; i < xml.childNodes.length; i ++ ) {

				const child = xml.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				switch ( child.nodeName ) {

					case 'bind_joint_axis':
						data.bindJointAxis.push( parseKinematicsBindJointAxis( child ) );
						break;

				}

			}

			library.kinematicsScenes[ parseId( xml.getAttribute( 'url' ) ) ] = data;

		}

		function parseKinematicsBindJointAxis( xml ) {

			const data = {
				target: xml.getAttribute( 'target' ).split( '/' ).pop()
			};

			for ( let i = 0; i < xml.childNodes.length; i ++ ) {

				const child = xml.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				switch ( child.nodeName ) {

					case 'axis':
						const param = child.getElementsByTagName( 'param' )[ 0 ];
						data.axis = param.textContent;
						const tmpJointIndex = data.axis.split( 'inst_' ).pop().split( 'axis' )[ 0 ];
						data.jointIndex = tmpJointIndex.substr( 0, tmpJointIndex.length - 1 );
						break;

				}

			}

			return data;

		}

		function buildKinematicsScene( data ) {

			if ( data.build !== undefined ) return data.build;

			return data;

		}

		function getKinematicsScene( id ) {

			return getBuild( library.kinematicsScenes[ id ], buildKinematicsScene );

		}

		function setupKinematics() {

			const kinematicsModelId = Object.keys( library.kinematicsModels )[ 0 ];
			const kinematicsSceneId = Object.keys( library.kinematicsScenes )[ 0 ];
			const visualSceneId = Object.keys( library.visualScenes )[ 0 ];

			if ( kinematicsModelId === undefined || kinematicsSceneId === undefined ) return;

			const kinematicsModel = getKinematicsModel( kinematicsModelId );
			const kinematicsScene = getKinematicsScene( kinematicsSceneId );
			const visualScene = getVisualScene( visualSceneId );

			const bindJointAxis = kinematicsScene.bindJointAxis;
			const jointMap = {};

			for ( let i = 0, l = bindJointAxis.length; i < l; i ++ ) {

				const axis = bindJointAxis[ i ];

				// the result of the following query is an element of type 'translate', 'rotate','scale' or 'matrix'

				const targetElement = collada.querySelector( '[sid="' + axis.target + '"]' );

				if ( targetElement ) {

					// get the parent of the transform element

					const parentVisualElement = targetElement.parentElement;

					// connect the joint of the kinematics model with the element in the visual scene

					connect( axis.jointIndex, parentVisualElement );

				}

			}

			function connect( jointIndex, visualElement ) {

				const visualElementName = visualElement.getAttribute( 'name' );
				const joint = kinematicsModel.joints[ jointIndex ];

				visualScene.traverse( function ( object ) {

					if ( object.name === visualElementName ) {

						jointMap[ jointIndex ] = {
							object: object,
							transforms: buildTransformList( visualElement ),
							joint: joint,
							position: joint.zeroPosition
						};

					}

				} );

			}

			const m0 = new three.Matrix4();

			kinematics = {

				joints: kinematicsModel && kinematicsModel.joints,

				getJointValue: function ( jointIndex ) {

					const jointData = jointMap[ jointIndex ];

					if ( jointData ) {

						return jointData.position;

					} else {

						console.warn( 'THREE.ColladaLoader: Joint ' + jointIndex + ' doesn\'t exist.' );

					}

				},

				setJointValue: function ( jointIndex, value ) {

					const jointData = jointMap[ jointIndex ];

					if ( jointData ) {

						const joint = jointData.joint;

						if ( value > joint.limits.max || value < joint.limits.min ) {

							console.warn( 'THREE.ColladaLoader: Joint ' + jointIndex + ' value ' + value + ' outside of limits (min: ' + joint.limits.min + ', max: ' + joint.limits.max + ').' );

						} else if ( joint.static ) {

							console.warn( 'THREE.ColladaLoader: Joint ' + jointIndex + ' is static.' );

						} else {

							const object = jointData.object;
							const axis = joint.axis;
							const transforms = jointData.transforms;

							matrix.identity();

							// each update, we have to apply all transforms in the correct order

							for ( let i = 0; i < transforms.length; i ++ ) {

								const transform = transforms[ i ];

								// if there is a connection of the transform node with a joint, apply the joint value

								if ( transform.sid && transform.sid.indexOf( jointIndex ) !== - 1 ) {

									switch ( joint.type ) {

										case 'revolute':
											matrix.multiply( m0.makeRotationAxis( axis, three.MathUtils.degToRad( value ) ) );
											break;

										case 'prismatic':
											matrix.multiply( m0.makeTranslation( axis.x * value, axis.y * value, axis.z * value ) );
											break;

										default:
											console.warn( 'THREE.ColladaLoader: Unknown joint type: ' + joint.type );
											break;

									}

								} else {

									switch ( transform.type ) {

										case 'matrix':
											matrix.multiply( transform.obj );
											break;

										case 'translate':
											matrix.multiply( m0.makeTranslation( transform.obj.x, transform.obj.y, transform.obj.z ) );
											break;

										case 'scale':
											matrix.scale( transform.obj );
											break;

										case 'rotate':
											matrix.multiply( m0.makeRotationAxis( transform.obj, transform.angle ) );
											break;

									}

								}

							}

							object.matrix.copy( matrix );
							object.matrix.decompose( object.position, object.quaternion, object.scale );

							jointMap[ jointIndex ].position = value;

						}

					} else {

						console.log( 'THREE.ColladaLoader: ' + jointIndex + ' does not exist.' );

					}

				}

			};

		}

		function buildTransformList( node ) {

			const transforms = [];

			const xml = collada.querySelector( '[id="' + node.id + '"]' );

			for ( let i = 0; i < xml.childNodes.length; i ++ ) {

				const child = xml.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				let array, vector;

				switch ( child.nodeName ) {

					case 'matrix':
						array = parseFloats( child.textContent );
						const matrix = new three.Matrix4().fromArray( array ).transpose();
						transforms.push( {
							sid: child.getAttribute( 'sid' ),
							type: child.nodeName,
							obj: matrix
						} );
						break;

					case 'translate':
					case 'scale':
						array = parseFloats( child.textContent );
						vector = new three.Vector3().fromArray( array );
						transforms.push( {
							sid: child.getAttribute( 'sid' ),
							type: child.nodeName,
							obj: vector
						} );
						break;

					case 'rotate':
						array = parseFloats( child.textContent );
						vector = new three.Vector3().fromArray( array );
						const angle = three.MathUtils.degToRad( array[ 3 ] );
						transforms.push( {
							sid: child.getAttribute( 'sid' ),
							type: child.nodeName,
							obj: vector,
							angle: angle
						} );
						break;

				}

			}

			return transforms;

		}

		// nodes

		function prepareNodes( xml ) {

			const elements = xml.getElementsByTagName( 'node' );

			// ensure all node elements have id attributes

			for ( let i = 0; i < elements.length; i ++ ) {

				const element = elements[ i ];

				if ( element.hasAttribute( 'id' ) === false ) {

					element.setAttribute( 'id', generateId() );

				}

			}

		}

		const matrix = new three.Matrix4();
		const vector = new three.Vector3();

		function parseNode( xml ) {

			const data = {
				name: xml.getAttribute( 'name' ) || '',
				type: xml.getAttribute( 'type' ),
				id: xml.getAttribute( 'id' ),
				sid: xml.getAttribute( 'sid' ),
				matrix: new three.Matrix4(),
				nodes: [],
				instanceCameras: [],
				instanceControllers: [],
				instanceLights: [],
				instanceGeometries: [],
				instanceNodes: [],
				transforms: {}
			};

			for ( let i = 0; i < xml.childNodes.length; i ++ ) {

				const child = xml.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				let array;

				switch ( child.nodeName ) {

					case 'node':
						data.nodes.push( child.getAttribute( 'id' ) );
						parseNode( child );
						break;

					case 'instance_camera':
						data.instanceCameras.push( parseId( child.getAttribute( 'url' ) ) );
						break;

					case 'instance_controller':
						data.instanceControllers.push( parseNodeInstance( child ) );
						break;

					case 'instance_light':
						data.instanceLights.push( parseId( child.getAttribute( 'url' ) ) );
						break;

					case 'instance_geometry':
						data.instanceGeometries.push( parseNodeInstance( child ) );
						break;

					case 'instance_node':
						data.instanceNodes.push( parseId( child.getAttribute( 'url' ) ) );
						break;

					case 'matrix':
						array = parseFloats( child.textContent );
						data.matrix.multiply( matrix.fromArray( array ).transpose() );
						data.transforms[ child.getAttribute( 'sid' ) ] = child.nodeName;
						break;

					case 'translate':
						array = parseFloats( child.textContent );
						vector.fromArray( array );
						data.matrix.multiply( matrix.makeTranslation( vector.x, vector.y, vector.z ) );
						data.transforms[ child.getAttribute( 'sid' ) ] = child.nodeName;
						break;

					case 'rotate':
						array = parseFloats( child.textContent );
						const angle = three.MathUtils.degToRad( array[ 3 ] );
						data.matrix.multiply( matrix.makeRotationAxis( vector.fromArray( array ), angle ) );
						data.transforms[ child.getAttribute( 'sid' ) ] = child.nodeName;
						break;

					case 'scale':
						array = parseFloats( child.textContent );
						data.matrix.scale( vector.fromArray( array ) );
						data.transforms[ child.getAttribute( 'sid' ) ] = child.nodeName;
						break;

					case 'extra':
						break;

					default:
						console.log( child );

				}

			}

			if ( hasNode( data.id ) ) {

				console.warn( 'THREE.ColladaLoader: There is already a node with ID %s. Exclude current node from further processing.', data.id );

			} else {

				library.nodes[ data.id ] = data;

			}

			return data;

		}

		function parseNodeInstance( xml ) {

			const data = {
				id: parseId( xml.getAttribute( 'url' ) ),
				materials: {},
				skeletons: []
			};

			for ( let i = 0; i < xml.childNodes.length; i ++ ) {

				const child = xml.childNodes[ i ];

				switch ( child.nodeName ) {

					case 'bind_material':
						const instances = child.getElementsByTagName( 'instance_material' );

						for ( let j = 0; j < instances.length; j ++ ) {

							const instance = instances[ j ];
							const symbol = instance.getAttribute( 'symbol' );
							const target = instance.getAttribute( 'target' );

							data.materials[ symbol ] = parseId( target );

						}

						break;

					case 'skeleton':
						data.skeletons.push( parseId( child.textContent ) );
						break;

				}

			}

			return data;

		}

		function buildSkeleton( skeletons, joints ) {

			const boneData = [];
			const sortedBoneData = [];

			let i, j, data;

			// a skeleton can have multiple root bones. collada expresses this
			// situtation with multiple "skeleton" tags per controller instance

			for ( i = 0; i < skeletons.length; i ++ ) {

				const skeleton = skeletons[ i ];

				let root;

				if ( hasNode( skeleton ) ) {

					root = getNode( skeleton );
					buildBoneHierarchy( root, joints, boneData );

				} else if ( hasVisualScene( skeleton ) ) {

					// handle case where the skeleton refers to the visual scene (#13335)

					const visualScene = library.visualScenes[ skeleton ];
					const children = visualScene.children;

					for ( let j = 0; j < children.length; j ++ ) {

						const child = children[ j ];

						if ( child.type === 'JOINT' ) {

							const root = getNode( child.id );
							buildBoneHierarchy( root, joints, boneData );

						}

					}

				} else {

					console.error( 'THREE.ColladaLoader: Unable to find root bone of skeleton with ID:', skeleton );

				}

			}

			// sort bone data (the order is defined in the corresponding controller)

			for ( i = 0; i < joints.length; i ++ ) {

				for ( j = 0; j < boneData.length; j ++ ) {

					data = boneData[ j ];

					if ( data.bone.name === joints[ i ].name ) {

						sortedBoneData[ i ] = data;
						data.processed = true;
						break;

					}

				}

			}

			// add unprocessed bone data at the end of the list

			for ( i = 0; i < boneData.length; i ++ ) {

				data = boneData[ i ];

				if ( data.processed === false ) {

					sortedBoneData.push( data );
					data.processed = true;

				}

			}

			// setup arrays for skeleton creation

			const bones = [];
			const boneInverses = [];

			for ( i = 0; i < sortedBoneData.length; i ++ ) {

				data = sortedBoneData[ i ];

				bones.push( data.bone );
				boneInverses.push( data.boneInverse );

			}

			return new three.Skeleton( bones, boneInverses );

		}

		function buildBoneHierarchy( root, joints, boneData ) {

			// setup bone data from visual scene

			root.traverse( function ( object ) {

				if ( object.isBone === true ) {

					let boneInverse;

					// retrieve the boneInverse from the controller data

					for ( let i = 0; i < joints.length; i ++ ) {

						const joint = joints[ i ];

						if ( joint.name === object.name ) {

							boneInverse = joint.boneInverse;
							break;

						}

					}

					if ( boneInverse === undefined ) {

						// Unfortunately, there can be joints in the visual scene that are not part of the
						// corresponding controller. In this case, we have to create a dummy boneInverse matrix
						// for the respective bone. This bone won't affect any vertices, because there are no skin indices
						// and weights defined for it. But we still have to add the bone to the sorted bone list in order to
						// ensure a correct animation of the model.

						boneInverse = new three.Matrix4();

					}

					boneData.push( { bone: object, boneInverse: boneInverse, processed: false } );

				}

			} );

		}

		function buildNode( data ) {

			const objects = [];

			const matrix = data.matrix;
			const nodes = data.nodes;
			const type = data.type;
			const instanceCameras = data.instanceCameras;
			const instanceControllers = data.instanceControllers;
			const instanceLights = data.instanceLights;
			const instanceGeometries = data.instanceGeometries;
			const instanceNodes = data.instanceNodes;

			// nodes

			for ( let i = 0, l = nodes.length; i < l; i ++ ) {

				objects.push( getNode( nodes[ i ] ) );

			}

			// instance cameras

			for ( let i = 0, l = instanceCameras.length; i < l; i ++ ) {

				const instanceCamera = getCamera( instanceCameras[ i ] );

				if ( instanceCamera !== null ) {

					objects.push( instanceCamera.clone() );

				}

			}

			// instance controllers

			for ( let i = 0, l = instanceControllers.length; i < l; i ++ ) {

				const instance = instanceControllers[ i ];
				const controller = getController( instance.id );
				const geometries = getGeometry( controller.id );
				const newObjects = buildObjects( geometries, instance.materials );

				const skeletons = instance.skeletons;
				const joints = controller.skin.joints;

				const skeleton = buildSkeleton( skeletons, joints );

				for ( let j = 0, jl = newObjects.length; j < jl; j ++ ) {

					const object = newObjects[ j ];

					if ( object.isSkinnedMesh ) {

						object.bind( skeleton, controller.skin.bindMatrix );
						object.normalizeSkinWeights();

					}

					objects.push( object );

				}

			}

			// instance lights

			for ( let i = 0, l = instanceLights.length; i < l; i ++ ) {

				const instanceLight = getLight( instanceLights[ i ] );

				if ( instanceLight !== null ) {

					objects.push( instanceLight.clone() );

				}

			}

			// instance geometries

			for ( let i = 0, l = instanceGeometries.length; i < l; i ++ ) {

				const instance = instanceGeometries[ i ];

				// a single geometry instance in collada can lead to multiple object3Ds.
				// this is the case when primitives are combined like triangles and lines

				const geometries = getGeometry( instance.id );
				const newObjects = buildObjects( geometries, instance.materials );

				for ( let j = 0, jl = newObjects.length; j < jl; j ++ ) {

					objects.push( newObjects[ j ] );

				}

			}

			// instance nodes

			for ( let i = 0, l = instanceNodes.length; i < l; i ++ ) {

				objects.push( getNode( instanceNodes[ i ] ).clone() );

			}

			let object;

			if ( nodes.length === 0 && objects.length === 1 ) {

				object = objects[ 0 ];

			} else {

				object = ( type === 'JOINT' ) ? new three.Bone() : new three.Group();

				for ( let i = 0; i < objects.length; i ++ ) {

					object.add( objects[ i ] );

				}

			}

			object.name = ( type === 'JOINT' ) ? data.sid : data.name;
			object.matrix.copy( matrix );
			object.matrix.decompose( object.position, object.quaternion, object.scale );

			return object;

		}

		const fallbackMaterial = new three.MeshBasicMaterial( { color: 0xff00ff } );

		function resolveMaterialBinding( keys, instanceMaterials ) {

			const materials = [];

			for ( let i = 0, l = keys.length; i < l; i ++ ) {

				const id = instanceMaterials[ keys[ i ] ];

				if ( id === undefined ) {

					console.warn( 'THREE.ColladaLoader: Material with key %s not found. Apply fallback material.', keys[ i ] );
					materials.push( fallbackMaterial );

				} else {

					materials.push( getMaterial( id ) );

				}

			}

			return materials;

		}

		function buildObjects( geometries, instanceMaterials ) {

			const objects = [];

			for ( const type in geometries ) {

				const geometry = geometries[ type ];

				const materials = resolveMaterialBinding( geometry.materialKeys, instanceMaterials );

				// handle case if no materials are defined

				if ( materials.length === 0 ) {

					if ( type === 'lines' || type === 'linestrips' ) {

						materials.push( new three.LineBasicMaterial() );

					} else {

						materials.push( new three.MeshPhongMaterial() );

					}

				}

				// regard skinning

				const skinning = ( geometry.data.attributes.skinIndex !== undefined );

				// choose between a single or multi materials (material array)

				const material = ( materials.length === 1 ) ? materials[ 0 ] : materials;

				// now create a specific 3D object

				let object;

				switch ( type ) {

					case 'lines':
						object = new three.LineSegments( geometry.data, material );
						break;

					case 'linestrips':
						object = new three.Line( geometry.data, material );
						break;

					case 'triangles':
					case 'polylist':
						if ( skinning ) {

							object = new three.SkinnedMesh( geometry.data, material );

						} else {

							object = new three.Mesh( geometry.data, material );

						}

						break;

				}

				objects.push( object );

			}

			return objects;

		}

		function hasNode( id ) {

			return library.nodes[ id ] !== undefined;

		}

		function getNode( id ) {

			return getBuild( library.nodes[ id ], buildNode );

		}

		// visual scenes

		function parseVisualScene( xml ) {

			const data = {
				name: xml.getAttribute( 'name' ),
				children: []
			};

			prepareNodes( xml );

			const elements = getElementsByTagName( xml, 'node' );

			for ( let i = 0; i < elements.length; i ++ ) {

				data.children.push( parseNode( elements[ i ] ) );

			}

			library.visualScenes[ xml.getAttribute( 'id' ) ] = data;

		}

		function buildVisualScene( data ) {

			const group = new three.Group();
			group.name = data.name;

			const children = data.children;

			for ( let i = 0; i < children.length; i ++ ) {

				const child = children[ i ];

				group.add( getNode( child.id ) );

			}

			return group;

		}

		function hasVisualScene( id ) {

			return library.visualScenes[ id ] !== undefined;

		}

		function getVisualScene( id ) {

			return getBuild( library.visualScenes[ id ], buildVisualScene );

		}

		// scenes

		function parseScene( xml ) {

			const instance = getElementsByTagName( xml, 'instance_visual_scene' )[ 0 ];
			return getVisualScene( parseId( instance.getAttribute( 'url' ) ) );

		}

		function setupAnimations() {

			const clips = library.clips;

			if ( isEmpty( clips ) === true ) {

				if ( isEmpty( library.animations ) === false ) {

					// if there are animations but no clips, we create a default clip for playback

					const tracks = [];

					for ( const id in library.animations ) {

						const animationTracks = getAnimation( id );

						for ( let i = 0, l = animationTracks.length; i < l; i ++ ) {

							tracks.push( animationTracks[ i ] );

						}

					}

					animations.push( new three.AnimationClip( 'default', - 1, tracks ) );

				}

			} else {

				for ( const id in clips ) {

					animations.push( getAnimationClip( id ) );

				}

			}

		}

		// convert the parser error element into text with each child elements text
		// separated by new lines.

		function parserErrorToText( parserError ) {

			let result = '';
			const stack = [ parserError ];

			while ( stack.length ) {

				const node = stack.shift();

				if ( node.nodeType === Node.TEXT_NODE ) {

					result += node.textContent;

				} else {

					result += '\n';
					stack.push.apply( stack, node.childNodes );

				}

			}

			return result.trim();

		}

		if ( text.length === 0 ) {

			return { scene: new three.Scene() };

		}

		const xml = new three._default.polyfill.DOMParser().parseFromString( text, 'application/xml' );

		const collada = getElementsByTagName( xml, 'COLLADA' )[ 0 ];

		const parserError = xml.getElementsByTagName( 'parsererror' )[ 0 ];
		if ( parserError !== undefined ) {

			// Chrome will return parser error with a div in it

			const errorElement = getElementsByTagName( parserError, 'div' )[ 0 ];
			let errorText;

			if ( errorElement ) {

				errorText = errorElement.textContent;

			} else {

				errorText = parserErrorToText( parserError );

			}

			console.error( 'THREE.ColladaLoader: Failed to parse collada file.\n', errorText );

			return null;

		}

		// metadata

		const version = collada.getAttribute( 'version' );
		console.log( 'THREE.ColladaLoader: File version', version );

		const asset = parseAsset( getElementsByTagName( collada, 'asset' )[ 0 ] );
		const textureLoader = new three.TextureLoader( this.manager );
		textureLoader.setPath( this.resourcePath || path ).setCrossOrigin( this.crossOrigin );

		let tgaLoader;

		if ( TGALoader ) {

			tgaLoader = new TGALoader( this.manager );
			tgaLoader.setPath( this.resourcePath || path );

		}

		//

		const animations = [];
		let kinematics = {};
		let count = 0;

		//

		const library = {
			animations: {},
			clips: {},
			controllers: {},
			images: {},
			effects: {},
			materials: {},
			cameras: {},
			lights: {},
			geometries: {},
			nodes: {},
			visualScenes: {},
			kinematicsModels: {},
			physicsModels: {},
			kinematicsScenes: {}
		};

		parseLibrary( collada, 'library_animations', 'animation', parseAnimation );
		parseLibrary( collada, 'library_animation_clips', 'animation_clip', parseAnimationClip );
		parseLibrary( collada, 'library_controllers', 'controller', parseController );
		parseLibrary( collada, 'library_images', 'image', parseImage );
		parseLibrary( collada, 'library_effects', 'effect', parseEffect );
		parseLibrary( collada, 'library_materials', 'material', parseMaterial );
		parseLibrary( collada, 'library_cameras', 'camera', parseCamera );
		parseLibrary( collada, 'library_lights', 'light', parseLight );
		parseLibrary( collada, 'library_geometries', 'geometry', parseGeometry );
		parseLibrary( collada, 'library_nodes', 'node', parseNode );
		parseLibrary( collada, 'library_visual_scenes', 'visual_scene', parseVisualScene );
		parseLibrary( collada, 'library_kinematics_models', 'kinematics_model', parseKinematicsModel );
		parseLibrary( collada, 'library_physics_models', 'physics_model', parsePhysicsModel );
		parseLibrary( collada, 'scene', 'instance_kinematics_scene', parseKinematicsScene );

		buildLibrary( library.animations, buildAnimation );
		buildLibrary( library.clips, buildAnimationClip );
		buildLibrary( library.controllers, buildController );
		buildLibrary( library.images, buildImage );
		buildLibrary( library.effects, buildEffect );
		buildLibrary( library.materials, buildMaterial );
		buildLibrary( library.cameras, buildCamera );
		buildLibrary( library.lights, buildLight );
		buildLibrary( library.geometries, buildGeometry );
		buildLibrary( library.visualScenes, buildVisualScene );

		setupAnimations();
		setupKinematics();

		const scene = parseScene( getElementsByTagName( collada, 'scene' )[ 0 ] );
		scene.animations = animations;

		if ( asset.upAxis === 'Z_UP' ) {

			scene.quaternion.setFromEuler( new three.Euler( - Math.PI / 2, 0, 0 ) );

		}

		scene.scale.multiplyScalar( asset.unit );

		return {
			get animations() {

				console.warn( 'THREE.ColladaLoader: Please access animations over scene.animations now.' );
				return animations;

			},
			kinematics: kinematics,
			library: library,
			scene: scene
		};

	}

}

function _optionalChain$5(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
class DemoColladaLoader extends Demo {
  async init() {
    const { camera } = this.deps;

    camera.position.set(8, 10, 8);
    camera.lookAt(0, 3, 0);

    const loader = new ColladaLoader();
    const collada = await loader.loadAsync(
      baseUrl$2 + '/models/collada/elf/elf.dae',
    );
    this.add(collada.scene);
    const ambientLight = new three.AmbientLight(0xcccccc, 0.4);
    this.add(ambientLight);

    const directionalLight = new three.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 0).normalize();
    this.add(directionalLight);

    this.addControl();
  }
  update() {
    _optionalChain$5([this, 'access', _ => _.orbitControl, 'optionalAccess', _2 => _2.update, 'call', _3 => _3()]);
  }
  dispose() {
    this.reset();
  }
}

class VTKLoader extends three.Loader {

	constructor( manager ) {

		super( manager );

	}

	load( url, onLoad, onProgress, onError ) {

		const scope = this;

		const loader = new three.FileLoader( scope.manager );
		loader.setPath( scope.path );
		loader.setResponseType( 'arraybuffer' );
		loader.setRequestHeader( scope.requestHeader );
		loader.setWithCredentials( scope.withCredentials );
		loader.load( url, function ( text ) {

			try {

				onLoad( scope.parse( text ) );

			} catch ( e ) {

				if ( onError ) {

					onError( e );

				} else {

					console.error( e );

				}

				scope.manager.itemError( url );

			}

		}, onProgress, onError );

	}

	parse( data ) {

		function parseASCII( data ) {

			// connectivity of the triangles
			var indices = [];

			// triangles vertices
			var positions = [];

			// red, green, blue colors in the range 0 to 1
			var colors = [];

			// normal vector, one per vertex
			var normals = [];

			var result;

			// pattern for detecting the end of a number sequence
			var patWord = /^[^\d.\s-]+/;

			// pattern for reading vertices, 3 floats or integers
			var pat3Floats = /(\-?\d+\.?[\d\-\+e]*)\s+(\-?\d+\.?[\d\-\+e]*)\s+(\-?\d+\.?[\d\-\+e]*)/g;

			// pattern for connectivity, an integer followed by any number of ints
			// the first integer is the number of polygon nodes
			var patConnectivity = /^(\d+)\s+([\s\d]*)/;

			// indicates start of vertex data section
			var patPOINTS = /^POINTS /;

			// indicates start of polygon connectivity section
			var patPOLYGONS = /^POLYGONS /;

			// indicates start of triangle strips section
			var patTRIANGLE_STRIPS = /^TRIANGLE_STRIPS /;

			// POINT_DATA number_of_values
			var patPOINT_DATA = /^POINT_DATA[ ]+(\d+)/;

			// CELL_DATA number_of_polys
			var patCELL_DATA = /^CELL_DATA[ ]+(\d+)/;

			// Start of color section
			var patCOLOR_SCALARS = /^COLOR_SCALARS[ ]+(\w+)[ ]+3/;

			// NORMALS Normals float
			var patNORMALS = /^NORMALS[ ]+(\w+)[ ]+(\w+)/;

			var inPointsSection = false;
			var inPolygonsSection = false;
			var inTriangleStripSection = false;
			var inPointDataSection = false;
			var inCellDataSection = false;
			var inColorSection = false;
			var inNormalsSection = false;

			var lines = data.split( '\n' );

			for ( var i in lines ) {

				var line = lines[ i ].trim();

				if ( line.indexOf( 'DATASET' ) === 0 ) {

					var dataset = line.split( ' ' )[ 1 ];

					if ( dataset !== 'POLYDATA' ) throw new Error( 'Unsupported DATASET type: ' + dataset );

				} else if ( inPointsSection ) {

					// get the vertices
					while ( ( result = pat3Floats.exec( line ) ) !== null ) {

						if ( patWord.exec( line ) !== null ) break;

						var x = parseFloat( result[ 1 ] );
						var y = parseFloat( result[ 2 ] );
						var z = parseFloat( result[ 3 ] );
						positions.push( x, y, z );

					}

				} else if ( inPolygonsSection ) {

					if ( ( result = patConnectivity.exec( line ) ) !== null ) {

						// numVertices i0 i1 i2 ...
						var numVertices = parseInt( result[ 1 ] );
						var inds = result[ 2 ].split( /\s+/ );

						if ( numVertices >= 3 ) {

							var i0 = parseInt( inds[ 0 ] );
							var i1, i2;
							var k = 1;
							// split the polygon in numVertices - 2 triangles
							for ( var j = 0; j < numVertices - 2; ++ j ) {

								i1 = parseInt( inds[ k ] );
								i2 = parseInt( inds[ k + 1 ] );
								indices.push( i0, i1, i2 );
								k ++;

							}

						}

					}

				} else if ( inTriangleStripSection ) {

					if ( ( result = patConnectivity.exec( line ) ) !== null ) {

						// numVertices i0 i1 i2 ...
						var numVertices = parseInt( result[ 1 ] );
						var inds = result[ 2 ].split( /\s+/ );

						if ( numVertices >= 3 ) {

							var i0, i1, i2;
							// split the polygon in numVertices - 2 triangles
							for ( var j = 0; j < numVertices - 2; j ++ ) {

								if ( j % 2 === 1 ) {

									i0 = parseInt( inds[ j ] );
									i1 = parseInt( inds[ j + 2 ] );
									i2 = parseInt( inds[ j + 1 ] );
									indices.push( i0, i1, i2 );

								} else {

									i0 = parseInt( inds[ j ] );
									i1 = parseInt( inds[ j + 1 ] );
									i2 = parseInt( inds[ j + 2 ] );
									indices.push( i0, i1, i2 );

								}

							}

						}

					}

				} else if ( inPointDataSection || inCellDataSection ) {

					if ( inColorSection ) {

						// Get the colors

						while ( ( result = pat3Floats.exec( line ) ) !== null ) {

							if ( patWord.exec( line ) !== null ) break;

							var r = parseFloat( result[ 1 ] );
							var g = parseFloat( result[ 2 ] );
							var b = parseFloat( result[ 3 ] );
							colors.push( r, g, b );

						}

					} else if ( inNormalsSection ) {

						// Get the normal vectors

						while ( ( result = pat3Floats.exec( line ) ) !== null ) {

							if ( patWord.exec( line ) !== null ) break;

							var nx = parseFloat( result[ 1 ] );
							var ny = parseFloat( result[ 2 ] );
							var nz = parseFloat( result[ 3 ] );
							normals.push( nx, ny, nz );

						}

					}

				}

				if ( patPOLYGONS.exec( line ) !== null ) {

					inPolygonsSection = true;
					inPointsSection = false;
					inTriangleStripSection = false;

				} else if ( patPOINTS.exec( line ) !== null ) {

					inPolygonsSection = false;
					inPointsSection = true;
					inTriangleStripSection = false;

				} else if ( patTRIANGLE_STRIPS.exec( line ) !== null ) {

					inPolygonsSection = false;
					inPointsSection = false;
					inTriangleStripSection = true;

				} else if ( patPOINT_DATA.exec( line ) !== null ) {

					inPointDataSection = true;
					inPointsSection = false;
					inPolygonsSection = false;
					inTriangleStripSection = false;

				} else if ( patCELL_DATA.exec( line ) !== null ) {

					inCellDataSection = true;
					inPointsSection = false;
					inPolygonsSection = false;
					inTriangleStripSection = false;

				} else if ( patCOLOR_SCALARS.exec( line ) !== null ) {

					inColorSection = true;
					inNormalsSection = false;
					inPointsSection = false;
					inPolygonsSection = false;
					inTriangleStripSection = false;

				} else if ( patNORMALS.exec( line ) !== null ) {

					inNormalsSection = true;
					inColorSection = false;
					inPointsSection = false;
					inPolygonsSection = false;
					inTriangleStripSection = false;

				}

			}

			var geometry = new three.BufferGeometry();
			geometry.setIndex( indices );
			geometry.setAttribute( 'position', new three.Float32BufferAttribute( positions, 3 ) );

			if ( normals.length === positions.length ) {

				geometry.setAttribute( 'normal', new three.Float32BufferAttribute( normals, 3 ) );

			}

			if ( colors.length !== indices.length ) {

				// stagger

				if ( colors.length === positions.length ) {

					geometry.setAttribute( 'color', new three.Float32BufferAttribute( colors, 3 ) );

				}

			} else {

				// cell

				geometry = geometry.toNonIndexed();
				var numTriangles = geometry.attributes.position.count / 3;

				if ( colors.length === ( numTriangles * 3 ) ) {

					var newColors = [];

					for ( var i = 0; i < numTriangles; i ++ ) {

						var r = colors[ 3 * i + 0 ];
						var g = colors[ 3 * i + 1 ];
						var b = colors[ 3 * i + 2 ];

						newColors.push( r, g, b );
						newColors.push( r, g, b );
						newColors.push( r, g, b );

					}

					geometry.setAttribute( 'color', new three.Float32BufferAttribute( newColors, 3 ) );

				}

			}

			return geometry;

		}

		function parseBinary( data ) {

			var count, pointIndex, i, numberOfPoints, s;
			var buffer = new Uint8Array( data );
			var dataView = new DataView( data );

			// Points and normals, by default, are empty
			var points = [];
			var normals = [];
			var indices = [];
			var index = 0;

			function findString( buffer, start ) {

				var index = start;
				var c = buffer[ index ];
				var s = [];
				while ( c !== 10 ) {

					s.push( String.fromCharCode( c ) );
					index ++;
					c = buffer[ index ];

				}

				return { start: start,
					end: index,
					next: index + 1,
					parsedString: s.join( '' ) };

			}

			var state, line;

			while ( true ) {

				// Get a string
				state = findString( buffer, index );
				line = state.parsedString;

				if ( line.indexOf( 'DATASET' ) === 0 ) {

					var dataset = line.split( ' ' )[ 1 ];

					if ( dataset !== 'POLYDATA' ) throw new Error( 'Unsupported DATASET type: ' + dataset );

				} else if ( line.indexOf( 'POINTS' ) === 0 ) {
					// Add the points
					numberOfPoints = parseInt( line.split( ' ' )[ 1 ], 10 );

					// Each point is 3 4-byte floats
					count = numberOfPoints * 4 * 3;

					points = new Float32Array( numberOfPoints * 3 );

					pointIndex = state.next;
					for ( i = 0; i < numberOfPoints; i ++ ) {

						points[ 3 * i ] = dataView.getFloat32( pointIndex, false );
						points[ 3 * i + 1 ] = dataView.getFloat32( pointIndex + 4, false );
						points[ 3 * i + 2 ] = dataView.getFloat32( pointIndex + 8, false );
						pointIndex = pointIndex + 12;

					}

					// increment our next pointer
					state.next = state.next + count + 1;

				} else if ( line.indexOf( 'TRIANGLE_STRIPS' ) === 0 ) {

					var numberOfStrips = parseInt( line.split( ' ' )[ 1 ], 10 );
					var size = parseInt( line.split( ' ' )[ 2 ], 10 );
					// 4 byte integers
					count = size * 4;

					indices = new Uint32Array( 3 * size - 9 * numberOfStrips );
					var indicesIndex = 0;

					pointIndex = state.next;
					for ( i = 0; i < numberOfStrips; i ++ ) {

						// For each strip, read the first value, then record that many more points
						var indexCount = dataView.getInt32( pointIndex, false );
						var strip = [];
						pointIndex += 4;
						for ( s = 0; s < indexCount; s ++ ) {

							strip.push( dataView.getInt32( pointIndex, false ) );
							pointIndex += 4;

						}

						// retrieves the n-2 triangles from the triangle strip
						for ( var j = 0; j < indexCount - 2; j ++ ) {

							if ( j % 2 ) {

								indices[ indicesIndex ++ ] = strip[ j ];
								indices[ indicesIndex ++ ] = strip[ j + 2 ];
								indices[ indicesIndex ++ ] = strip[ j + 1 ];

							} else {


								indices[ indicesIndex ++ ] = strip[ j ];
								indices[ indicesIndex ++ ] = strip[ j + 1 ];
								indices[ indicesIndex ++ ] = strip[ j + 2 ];

							}

						}

					}

					// increment our next pointer
					state.next = state.next + count + 1;

				} else if ( line.indexOf( 'POLYGONS' ) === 0 ) {

					var numberOfStrips = parseInt( line.split( ' ' )[ 1 ], 10 );
					var size = parseInt( line.split( ' ' )[ 2 ], 10 );
					// 4 byte integers
					count = size * 4;

					indices = new Uint32Array( 3 * size - 9 * numberOfStrips );
					var indicesIndex = 0;

					pointIndex = state.next;
					for ( i = 0; i < numberOfStrips; i ++ ) {

						// For each strip, read the first value, then record that many more points
						var indexCount = dataView.getInt32( pointIndex, false );
						var strip = [];
						pointIndex += 4;
						for ( s = 0; s < indexCount; s ++ ) {

							strip.push( dataView.getInt32( pointIndex, false ) );
							pointIndex += 4;

						}

						// divide the polygon in n-2 triangle
						for ( var j = 1; j < indexCount - 1; j ++ ) {

							indices[ indicesIndex ++ ] = strip[ 0 ];
							indices[ indicesIndex ++ ] = strip[ j ];
							indices[ indicesIndex ++ ] = strip[ j + 1 ];

						}

					}

					// increment our next pointer
					state.next = state.next + count + 1;

				} else if ( line.indexOf( 'POINT_DATA' ) === 0 ) {

					numberOfPoints = parseInt( line.split( ' ' )[ 1 ], 10 );

					// Grab the next line
					state = findString( buffer, state.next );

					// Now grab the binary data
					count = numberOfPoints * 4 * 3;

					normals = new Float32Array( numberOfPoints * 3 );
					pointIndex = state.next;
					for ( i = 0; i < numberOfPoints; i ++ ) {

						normals[ 3 * i ] = dataView.getFloat32( pointIndex, false );
						normals[ 3 * i + 1 ] = dataView.getFloat32( pointIndex + 4, false );
						normals[ 3 * i + 2 ] = dataView.getFloat32( pointIndex + 8, false );
						pointIndex += 12;

					}

					// Increment past our data
					state.next = state.next + count;

				}

				// Increment index
				index = state.next;

				if ( index >= buffer.byteLength ) {

					break;

				}

			}

			var geometry = new three.BufferGeometry();
			geometry.setIndex( new three.BufferAttribute( indices, 1 ) );
			geometry.setAttribute( 'position', new three.BufferAttribute( points, 3 ) );

			if ( normals.length === points.length ) {

				geometry.setAttribute( 'normal', new three.BufferAttribute( normals, 3 ) );

			}

			return geometry;

		}

		function Float32Concat( first, second ) {

			const firstLength = first.length, result = new Float32Array( firstLength + second.length );

			result.set( first );
			result.set( second, firstLength );

			return result;

		}

		function Int32Concat( first, second ) {

			var firstLength = first.length, result = new Int32Array( firstLength + second.length );

			result.set( first );
			result.set( second, firstLength );

			return result;

		}

		function parseXML( stringFile ) {

			// Changes XML to JSON, based on https://davidwalsh.name/convert-xml-json

			function xmlToJson( xml ) {

				// Create the return object
				var obj = {};

				if ( xml.nodeType === 1 ) { // element

					// do attributes

					if ( xml.attributes ) {

						if ( xml.attributes.length > 0 ) {

							obj[ 'attributes' ] = {};

							for ( var j = 0; j < xml.attributes.length; j ++ ) {

								var attribute = xml.attributes.item( j );
								obj[ 'attributes' ][ attribute.nodeName ] = attribute.nodeValue.trim();

							}

						}

					}

				} else if ( xml.nodeType === 3 ) { // text

					obj = xml.nodeValue.trim();

				}

				// do children
				if ( xml.hasChildNodes() ) {

					for ( var i = 0; i < xml.childNodes.length; i ++ ) {

						var item = xml.childNodes.item( i );
						var nodeName = item.nodeName;

						if ( typeof obj[ nodeName ] === 'undefined' ) {

							var tmp = xmlToJson( item );

							if ( tmp !== '' ) obj[ nodeName ] = tmp;

						} else {

							if ( typeof obj[ nodeName ].push === 'undefined' ) {

								var old = obj[ nodeName ];
								obj[ nodeName ] = [ old ];

							}

							var tmp = xmlToJson( item );

							if ( tmp !== '' ) obj[ nodeName ].push( tmp );

						}

					}

				}

				return obj;

			}

			// Taken from Base64-js
			function Base64toByteArray( b64 ) {

				var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
				var i;
				var lookup = [];
				var revLookup = [];
				var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
				var len = code.length;

				for ( i = 0; i < len; i ++ ) {

					lookup[ i ] = code[ i ];

				}

				for ( i = 0; i < len; ++ i ) {

					revLookup[ code.charCodeAt( i ) ] = i;

				}

				revLookup[ '-'.charCodeAt( 0 ) ] = 62;
				revLookup[ '_'.charCodeAt( 0 ) ] = 63;

				var j, l, tmp, placeHolders, arr;
				var len = b64.length;

				if ( len % 4 > 0 ) {

					throw new Error( 'Invalid string. Length must be a multiple of 4' );

				}

				placeHolders = b64[ len - 2 ] === '=' ? 2 : b64[ len - 1 ] === '=' ? 1 : 0;
				arr = new Arr( len * 3 / 4 - placeHolders );
				l = placeHolders > 0 ? len - 4 : len;

				var L = 0;

				for ( i = 0, j = 0; i < l; i += 4, j += 3 ) {

					tmp = ( revLookup[ b64.charCodeAt( i ) ] << 18 ) | ( revLookup[ b64.charCodeAt( i + 1 ) ] << 12 ) | ( revLookup[ b64.charCodeAt( i + 2 ) ] << 6 ) | revLookup[ b64.charCodeAt( i + 3 ) ];
					arr[ L ++ ] = ( tmp & 0xFF0000 ) >> 16;
					arr[ L ++ ] = ( tmp & 0xFF00 ) >> 8;
					arr[ L ++ ] = tmp & 0xFF;

				}

				if ( placeHolders === 2 ) {

					tmp = ( revLookup[ b64.charCodeAt( i ) ] << 2 ) | ( revLookup[ b64.charCodeAt( i + 1 ) ] >> 4 );
					arr[ L ++ ] = tmp & 0xFF;

				} else if ( placeHolders === 1 ) {

					tmp = ( revLookup[ b64.charCodeAt( i ) ] << 10 ) | ( revLookup[ b64.charCodeAt( i + 1 ) ] << 4 ) | ( revLookup[ b64.charCodeAt( i + 2 ) ] >> 2 );
					arr[ L ++ ] = ( tmp >> 8 ) & 0xFF;
					arr[ L ++ ] = tmp & 0xFF;

				}

				return arr;

			}

			function parseDataArray( ele, compressed ) {

				var numBytes = 0;

				if ( json.attributes.header_type === 'UInt64' ) {

					numBytes = 8;

				}	else if ( json.attributes.header_type === 'UInt32' ) {

					numBytes = 4;

				}


				// Check the format
				if ( ele.attributes.format === 'binary' && compressed ) {

					var rawData, content, byteData, blocks, cSizeStart, headerSize, padding, dataOffsets, currentOffset;

					if ( ele.attributes.type === 'Float32' ) {

						var txt = new Float32Array( );

					} else if ( ele.attributes.type === 'Int64' ) {

						var txt = new Int32Array( );

					}

					// VTP data with the header has the following structure:
					// [#blocks][#u-size][#p-size][#c-size-1][#c-size-2]...[#c-size-#blocks][DATA]
					//
					// Each token is an integer value whose type is specified by "header_type" at the top of the file (UInt32 if no type specified). The token meanings are:
					// [#blocks] = Number of blocks
					// [#u-size] = Block size before compression
					// [#p-size] = Size of last partial block (zero if it not needed)
					// [#c-size-i] = Size in bytes of block i after compression
					//
					// The [DATA] portion stores contiguously every block appended together. The offset from the beginning of the data section to the beginning of a block is
					// computed by summing the compressed block sizes from preceding blocks according to the header.

					rawData = ele[ '#text' ];

					byteData = Base64toByteArray( rawData );

					blocks = byteData[ 0 ];
					for ( var i = 1; i < numBytes - 1; i ++ ) {

						blocks = blocks | ( byteData[ i ] << ( i * numBytes ) );

					}

					headerSize = ( blocks + 3 ) * numBytes;
					padding = ( ( headerSize % 3 ) > 0 ) ? 3 - ( headerSize % 3 ) : 0;
					headerSize = headerSize + padding;

					dataOffsets = [];
					currentOffset = headerSize;
					dataOffsets.push( currentOffset );

					// Get the blocks sizes after the compression.
					// There are three blocks before c-size-i, so we skip 3*numBytes
					cSizeStart = 3 * numBytes;

					for ( var i = 0; i < blocks; i ++ ) {

						var currentBlockSize = byteData[ i * numBytes + cSizeStart ];

						for ( var j = 1; j < numBytes - 1; j ++ ) {

							// Each data point consists of 8 bytes regardless of the header type
							currentBlockSize = currentBlockSize | ( byteData[ i * numBytes + cSizeStart + j ] << ( j * 8 ) );

						}

						currentOffset = currentOffset + currentBlockSize;
						dataOffsets.push( currentOffset );

					}

					for ( var i = 0; i < dataOffsets.length - 1; i ++ ) {

						var data = unzlibSync( byteData.slice( dataOffsets[ i ], dataOffsets[ i + 1 ] ) ); // eslint-disable-line no-undef
						content = data.buffer;

						if ( ele.attributes.type === 'Float32' ) {

							content = new Float32Array( content );
							txt = Float32Concat( txt, content );

						} else if ( ele.attributes.type === 'Int64' ) {

							content = new Int32Array( content );
							txt = Int32Concat( txt, content );

						}

					}

					delete ele[ '#text' ];

					if ( ele.attributes.type === 'Int64' ) {

						if ( ele.attributes.format === 'binary' ) {

							txt = txt.filter( function ( el, idx ) {

								if ( idx % 2 !== 1 ) return true;

							} );

						}

					}

				} else {

					if ( ele.attributes.format === 'binary' && ! compressed ) {

						var content = Base64toByteArray( ele[ '#text' ] );

						//  VTP data for the uncompressed case has the following structure:
						// [#bytes][DATA]
						// where "[#bytes]" is an integer value specifying the number of bytes in the block of data following it.
						content = content.slice( numBytes ).buffer;

					} else {

						if ( ele[ '#text' ] ) {

							var content = ele[ '#text' ].split( /\s+/ ).filter( function ( el ) {

								if ( el !== '' ) return el;

							} );

						} else {

							var content = new Int32Array( 0 ).buffer;

						}

					}

					delete ele[ '#text' ];

					// Get the content and optimize it
					if ( ele.attributes.type === 'Float32' ) {

						var txt = new Float32Array( content );

					} else if ( ele.attributes.type === 'Int32' ) {

						var txt = new Int32Array( content );

					} else if ( ele.attributes.type === 'Int64' ) {

						var txt = new Int32Array( content );

						if ( ele.attributes.format === 'binary' ) {

							txt = txt.filter( function ( el, idx ) {

								if ( idx % 2 !== 1 ) return true;

							} );

						}

					}

				} // endif ( ele.attributes.format === 'binary' && compressed )

				return txt;

			}

			// Main part
			// Get Dom
			var dom = null;

			if ( three._default.polyfill.window.DOMParser ) {

				try {

					dom = ( new three._default.polyfill.DOMParser() ).parseFromString( stringFile, 'text/xml' );

				} catch ( e ) {

					dom = null;

				}

			} else if ( three._default.polyfill.window.ActiveXObject ) {

				try {

					dom = new ActiveXObject( 'Microsoft.XMLDOM' ); // eslint-disable-line no-undef
					dom.async = false;

					if ( ! dom.loadXML( /* xml */ ) ) {

						throw new Error( dom.parseError.reason + dom.parseError.srcText );

					}

				} catch ( e ) {

					dom = null;

				}

			} else {

				throw new Error( 'Cannot parse xml string!' );

			}

			// Get the doc
			var doc = dom.documentElement;
			// Convert to json
			var json = xmlToJson( doc );
			var points = [];
			var normals = [];
			var indices = [];

			if ( json.PolyData ) {

				var piece = json.PolyData.Piece;
				var compressed = json.attributes.hasOwnProperty( 'compressor' );

				// Can be optimized
				// Loop through the sections
				var sections = [ 'PointData', 'Points', 'Strips', 'Polys' ];// +['CellData', 'Verts', 'Lines'];
				var sectionIndex = 0, numberOfSections = sections.length;

				while ( sectionIndex < numberOfSections ) {

					var section = piece[ sections[ sectionIndex ] ];

					// If it has a DataArray in it

					if ( section && section.DataArray ) {

						// Depending on the number of DataArrays

						if ( Object.prototype.toString.call( section.DataArray ) === '[object Array]' ) {

							var arr = section.DataArray;

						} else {

							var arr = [ section.DataArray ];

						}

						var dataArrayIndex = 0, numberOfDataArrays = arr.length;

						while ( dataArrayIndex < numberOfDataArrays ) {

							// Parse the DataArray
							if ( ( '#text' in arr[ dataArrayIndex ] ) && ( arr[ dataArrayIndex ][ '#text' ].length > 0 ) ) {

								arr[ dataArrayIndex ].text = parseDataArray( arr[ dataArrayIndex ], compressed );

							}

							dataArrayIndex ++;

						}

						switch ( sections[ sectionIndex ] ) {

							// if iti is point data
							case 'PointData':

								var numberOfPoints = parseInt( piece.attributes.NumberOfPoints );
								var normalsName = section.attributes.Normals;

								if ( numberOfPoints > 0 ) {

									for ( var i = 0, len = arr.length; i < len; i ++ ) {

										if ( normalsName === arr[ i ].attributes.Name ) {

											var components = arr[ i ].attributes.NumberOfComponents;
											normals = new Float32Array( numberOfPoints * components );
											normals.set( arr[ i ].text, 0 );

										}

									}

								}

								break;

							// if it is points
							case 'Points':

								var numberOfPoints = parseInt( piece.attributes.NumberOfPoints );

								if ( numberOfPoints > 0 ) {

									var components = section.DataArray.attributes.NumberOfComponents;
									points = new Float32Array( numberOfPoints * components );
									points.set( section.DataArray.text, 0 );

								}

								break;

							// if it is strips
							case 'Strips':

								var numberOfStrips = parseInt( piece.attributes.NumberOfStrips );

								if ( numberOfStrips > 0 ) {

									var connectivity = new Int32Array( section.DataArray[ 0 ].text.length );
									var offset = new Int32Array( section.DataArray[ 1 ].text.length );
									connectivity.set( section.DataArray[ 0 ].text, 0 );
									offset.set( section.DataArray[ 1 ].text, 0 );

									var size = numberOfStrips + connectivity.length;
									indices = new Uint32Array( 3 * size - 9 * numberOfStrips );

									var indicesIndex = 0;

									for ( var i = 0, len = numberOfStrips; i < len; i ++ ) {

										var strip = [];

										for ( var s = 0, len1 = offset[ i ], len0 = 0; s < len1 - len0; s ++ ) {

											strip.push( connectivity[ s ] );

											if ( i > 0 ) len0 = offset[ i - 1 ];

										}

										for ( var j = 0, len1 = offset[ i ], len0 = 0; j < len1 - len0 - 2; j ++ ) {

											if ( j % 2 ) {

												indices[ indicesIndex ++ ] = strip[ j ];
												indices[ indicesIndex ++ ] = strip[ j + 2 ];
												indices[ indicesIndex ++ ] = strip[ j + 1 ];

											} else {

												indices[ indicesIndex ++ ] = strip[ j ];
												indices[ indicesIndex ++ ] = strip[ j + 1 ];
												indices[ indicesIndex ++ ] = strip[ j + 2 ];

											}

											if ( i > 0 ) len0 = offset[ i - 1 ];

										}

									}

								}

								break;

							// if it is polys
							case 'Polys':

								var numberOfPolys = parseInt( piece.attributes.NumberOfPolys );

								if ( numberOfPolys > 0 ) {

									var connectivity = new Int32Array( section.DataArray[ 0 ].text.length );
									var offset = new Int32Array( section.DataArray[ 1 ].text.length );
									connectivity.set( section.DataArray[ 0 ].text, 0 );
									offset.set( section.DataArray[ 1 ].text, 0 );

									var size = numberOfPolys + connectivity.length;
									indices = new Uint32Array( 3 * size - 9 * numberOfPolys );
									var indicesIndex = 0, connectivityIndex = 0;
									var i = 0, len = numberOfPolys, len0 = 0;

									while ( i < len ) {

										var poly = [];
										var s = 0, len1 = offset[ i ];

										while ( s < len1 - len0 ) {

											poly.push( connectivity[ connectivityIndex ++ ] );
											s ++;

										}

										var j = 1;

										while ( j < len1 - len0 - 1 ) {

											indices[ indicesIndex ++ ] = poly[ 0 ];
											indices[ indicesIndex ++ ] = poly[ j ];
											indices[ indicesIndex ++ ] = poly[ j + 1 ];
											j ++;

										}

										i ++;
										len0 = offset[ i - 1 ];

									}

								}

								break;

						}

					}

					sectionIndex ++;

				}

				var geometry = new three.BufferGeometry();
				geometry.setIndex( new three.BufferAttribute( indices, 1 ) );
				geometry.setAttribute( 'position', new three.BufferAttribute( points, 3 ) );

				if ( normals.length === points.length ) {

					geometry.setAttribute( 'normal', new three.BufferAttribute( normals, 3 ) );

				}

				return geometry;

			} else {

				throw new Error( 'Unsupported DATASET type' );

			}

		}

		// get the 5 first lines of the files to check if there is the key word binary
		var meta = three.LoaderUtils.decodeText( new Uint8Array( data, 0, 250 ) ).split( '\n' );

		if ( meta[ 0 ].indexOf( 'xml' ) !== - 1 ) {

			return parseXML( three.LoaderUtils.decodeText( data ) );

		} else if ( meta[ 2 ].includes( 'ASCII' ) ) {

			return parseASCII( three.LoaderUtils.decodeText( data ) );

		} else {

			return parseBinary( data );

		}

	}

}

function _optionalChain$4(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
class DemoVTKLoader extends Demo {
  async init() {
    //创建兰伯特材质
    const material = new three.MeshLambertMaterial({
      color: 0x123456,
      side: three.DoubleSide,
    });

    const vtkLoader = new VTKLoader();
    const geometry = await vtkLoader.loadAsync(
      baseUrl$2 + 'models/vtk/bunny.vtk',
    );
    geometry.center();
    geometry.computeVertexNormals();
    const mesh = new three.Mesh(geometry, material);
    console.log(geometry);

    this.add(new three.DirectionalLight(0xffffff, 1));
    this.add(new three.AmbientLight(0xffffff, 1));
    this.add(mesh);
    this.deps.camera.position.z = 0.5;
    this.deps.scene.position.z = 0;

    this.addControl();
  }

  update() {
    _optionalChain$4([this, 'access', _ => _.orbitControl, 'optionalAccess', _2 => _2.update, 'call', _3 => _3()]);
  }

  dispose() {
    this.reset();
  }
}

function _optionalChain$3(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
class DemoVSMShadow extends Demo {
  
  
  
  async init() {
    console.log('小程序VSMShadowMap需要three r131之前版本');
    const { camera, renderer, scene } = this.deps;
    camera.position.set(0, 10, 30);
    scene.fog = new three.Fog(0xcccccc, 50, 100);

    // Lights

    const spotLight = new three.SpotLight(0x888888);
    spotLight.name = 'Spot Light';
    spotLight.angle = Math.PI / 5;
    spotLight.penumbra = 0.3;
    spotLight.position.set(8, 10, 5);
    spotLight.castShadow = true;
    spotLight.shadow.camera.near = 8;
    spotLight.shadow.camera.far = 200;
    spotLight.shadow.mapSize.width = 256;
    spotLight.shadow.mapSize.height = 256;
    spotLight.shadow.bias = -0.002;
    spotLight.shadow.radius = 4;

    const dirLight = new three.DirectionalLight(0xffffff, 1);
    dirLight.name = 'Dir. Light';
    dirLight.position.set(3, 12, 17);
    dirLight.castShadow = true;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 500;
    dirLight.shadow.camera.right = 17;
    dirLight.shadow.camera.left = -17;
    dirLight.shadow.camera.top = 17;
    dirLight.shadow.camera.bottom = -17;
    dirLight.shadow.mapSize.width = 512;
    dirLight.shadow.mapSize.height = 512;
    dirLight.shadow.radius = 4;
    dirLight.shadow.bias = -0.0005;

    const dirGroup = new three.Group();
    dirGroup.add(dirLight);

    this.addControl();
    this.add(new three.AmbientLight(0x444444));
    this.add(dirGroup);
    this.add(spotLight);
    this.add(dirLight);
    this.dirLight = dirLight;
    this.dirGroup = dirGroup;

    // Geometry

    let material = new three.MeshPhongMaterial({
      color: 0x999999,
      shininess: 0,
      specular: 0x222222,
    });

    {
      const geometry = new three.TorusKnotGeometry(25, 8, 75, 20);
      const torusKnot = new three.Mesh(geometry, material);
      torusKnot.scale.multiplyScalar(1 / 18);
      torusKnot.position.y = 3;
      torusKnot.castShadow = true;
      torusKnot.receiveShadow = true;
      this.add(torusKnot);
      this.torusKnot = torusKnot;
    }

    {
      const geometry = new three.CylinderGeometry(0.75, 0.75, 7, 32);
      const pillar1 = new three.Mesh(geometry, material);
      pillar1.position.set(10, 3.5, 10);
      pillar1.castShadow = true;
      pillar1.receiveShadow = true;

      const pillar2 = pillar1.clone();
      pillar2.position.set(10, 3.5, -10);
      const pillar3 = pillar1.clone();
      pillar3.position.set(-10, 3.5, 10);
      const pillar4 = pillar1.clone();
      pillar4.position.set(-10, 3.5, -10);

      this.add(pillar1);
      this.add(pillar2);
      this.add(pillar3);
      this.add(pillar4);
    }

    {
      const geometry = new three.PlaneGeometry(200, 200);
      material = new three.MeshPhongMaterial({
        color: 0x999999,
        shininess: 0,
        specular: 0x111111,
      });

      const ground = new three.Mesh(geometry, material);
      ground.rotation.x = -Math.PI / 2;
      ground.scale.multiplyScalar(3);
      ground.castShadow = true;
      ground.receiveShadow = true;
      this.add(ground);
    }

    // initMisc
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = three.VSMShadowMap;
    renderer.setClearColor(0xcccccc, 1);
    this.orbitControl.target.set(0, 2, 0);
  }

  update() {
    _optionalChain$3([this, 'access', _ => _.orbitControl, 'optionalAccess', _2 => _2.update, 'call', _3 => _3()]);

    const delta = this.deps.clock.getDelta();
    const time = this.deps.clock.getElapsedTime();

    this.torusKnot.rotation.x += 0.25 * delta;
    this.torusKnot.rotation.y += 2 * delta;
    this.torusKnot.rotation.z += 1 * delta;

    this.dirGroup.rotation.y += 0.7 * delta;
    this.dirLight.position.z = 17 + Math.sin(time * 0.001) * 5;
  }

  dispose() {
    this.reset();
    this.dirLight = null;
    this.dirGroup = null;
    this.torusKnot = null;
  }
}

function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain$2(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

class ThreeSpritePlayer {
   __init() {this.currFrame = 0;}
  
  
  
  
  
  
  

  constructor(
     tiles,
     totalFrame,
     row,
     col,
    fps = 24,
    sRGB = true,
  ) {this.tiles = tiles;this.totalFrame = totalFrame;this.row = row;this.col = col;ThreeSpritePlayer.prototype.__init.call(this);
    this.playing = true;
    this.currFrame = 0;
    this.frameGap = 1000 / fps;
    tiles.forEach(texture => {
      // texture.wrapS = 1001; // THREE.ClampToEdgeWrapping;
      // texture.wrapT = 1001; // three.ClampToEdgeWrapping;
      // texture.minFilter = 1006; // THREE.LinearFilter
      texture.repeat.set(1 / this.col, 1 / this.row);

      if (sRGB) texture.encoding = 3001; // THREE.sRGBEncoding
    });
    this.updateOffset();
  }

   stop() {
    this.playing = false;
  }

   play() {
    this.playing = true;
    this.startTime = Date.now();
    this.startFrame = this.currFrame;
  }

   get texture() {
    return this.tiles[this.currTile];
  }

   animate() {
    if (!this.playing || this.totalFrame === 1) return

    const now = Date.now();
    this.startTime = _nullishCoalesce(this.startTime, () => ( now));
    this.startFrame = _nullishCoalesce(this.startFrame, () => ( this.currFrame));
    const nextFrame = this.startFrame + ~~((now - this.startTime) / this.frameGap);
    this.currFrame = nextFrame % this.totalFrame;

    if (nextFrame > this.currFrame) {
      this.startTime = now;
      this.startFrame = this.currFrame;
    }

    this.updateOffset();
  }

   updateOffset() {
    this.currTile = ~~(this.currFrame / (this.col * this.row));
    this.currTileOffset = this.currFrame % (this.col * this.row);

    const texture = this.tiles[this.currTile];
    const tileHeight = 1 / this.row;
    const currentColumn = this.currTileOffset % this.col;
    const currentRow = ~~(this.currTileOffset / this.col);

    if (texture) {
      texture.offset.x = currentColumn / this.col;
      texture.offset.y = 1 - currentRow / this.row - tileHeight;
    }
  }

   dispose() {
    _optionalChain$2([this, 'access', _ => _.mesh, 'optionalAccess', _2 => _2.material, 'access', _3 => _3.dispose, 'call', _4 => _4()]);
    this.tiles.forEach(texture => texture.dispose());
    this.tiles.length = 0;
    this.mesh = null;
  }
}

// const url: Array<string> = new Array<string>(3).fill('').map((v: string, k: number) => `/imgs/output-${k}.png`);

const url = [
  'https://s3.ax1x.com/2021/02/26/yx0ObV.png',
  'https://s3.ax1x.com/2021/02/26/yx0LD0.png',
  'https://s3.ax1x.com/2021/02/26/yx0Hvn.png',
];

const tile = {
  url,
  x: 0,
  y: 0,
  z: -15,
  w: (10 * 358) / 358,
  h: 10,
  col: 2,
  row: 2,
  total: 10,
  fps: 16,
};

class DemoThreeSpritePlayer extends Demo {
  
  

  async init() {
    const { textureLoader } = this.deps;
    const tiles = await Promise.all(tile.url.map(url => textureLoader.loadAsync(url)));
    const spritePlayer = new ThreeSpritePlayer(tiles, tile.total, tile.row, tile.col, tile.fps, true);

    const geometry = new three.PlaneGeometry(tile.w, tile.h);
    const material = new three.MeshBasicMaterial({
      map: spritePlayer.texture,
      transparent: false,
    });
    const mesh = new three.Mesh(geometry, material);
    const boxGeometry = new three.BoxGeometry();
    const box = new three.Mesh(boxGeometry, material);

    box.position.y = -1.2;
    mesh.position.z = -8;
    mesh.position.y = 4;

    this.add(mesh);
    this.add(box);

    this.mesh = mesh;
    this.player = spritePlayer;
  }

  update() {
    this.player.animate();
    // @ts-ignore
    this.mesh.material.map = this.player.texture;
  }

  dispose() {
    this.reset();
    this.player.dispose();
    this.player = null;
    this.mesh = null;
  }
}

/**
 * 设置通过TextureLoad加载从PMREMGenerator生成纹理导出成PNG
 * @param {Texture} texture
 * @param {Boolean} hdr 源文件是否是HDR, LDR设置false
 */
function toEnvMap(texture, hdr = true) {
  if (hdr) {
    texture.format = three.RGBEFormat;
    texture.encoding = three.RGBEEncoding;
  }
  texture.generateMipmaps = false;
  texture.magFilter = three.NearestFilter;
  texture.minFilter = three.NearestFilter;
  texture.type = three.UnsignedByteType;
  texture.mapping = three.CubeUVReflectionMapping;
  texture.name = 'PMREM.cubeUv';
  return texture;
}

function _optionalChain$1(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
class DemoHDRPrefilterTexture extends Demo {
  async init() {
    const { scene, camera } = this.deps;
    const texture = await this.deps.textureLoader.loadAsync(
      // 'https://s3.ax1x.com/2021/02/01/yeci9I.png',
      'https://cdn.static.oppenlab.com/weblf/test/hdr-prefilter.png',
    );
    toEnvMap(texture);
    const geometry = new three.PlaneGeometry(3, 3);
    const material = new three.MeshBasicMaterial({ map: texture });
    const mesh = new three.Mesh(geometry, material);

    this.add(mesh);
    scene.background = texture;
    camera.position.z = 1;

    this.addControl();
  }
  update() {
    _optionalChain$1([this, 'access', _ => _.orbitControl, 'optionalAccess', _2 => _2.update, 'call', _3 => _3()]);
  }
  dispose() {
    this.reset();
  }
}

const _zee = new three.Vector3( 0, 0, 1 );
const _euler = new three.Euler();
const _q0 = new three.Quaternion();
const _q1 = new three.Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) ); // - PI/2 around the x-axis

const _changeEvent = { type: 'change' };

class DeviceOrientationControls extends three.EventDispatcher {

	constructor( object ) {

		super();

		if ( three._default.polyfill.window.isSecureContext === false ) {

			console.error( 'THREE.DeviceOrientationControls: DeviceOrientationEvent is only available in secure contexts (https)' );

		}

		const scope = this;

		const EPS = 0.000001;
		const lastQuaternion = new three.Quaternion();

		this.object = object;
		this.object.rotation.reorder( 'YXZ' );

		this.enabled = true;

		this.deviceOrientation = {};
		this.screenOrientation = 0;

		this.alphaOffset = 0; // radians

		const onDeviceOrientationChangeEvent = function ( event ) {

			scope.deviceOrientation = event;

		};

		const onScreenOrientationChangeEvent = function () {

			scope.screenOrientation = three._default.polyfill.window.orientation || 0;

		};

		// The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

		const setObjectQuaternion = function ( quaternion, alpha, beta, gamma, orient ) {

			_euler.set( beta, alpha, - gamma, 'YXZ' ); // 'ZXY' for the device, but 'YXZ' for us

			quaternion.setFromEuler( _euler ); // orient the device

			quaternion.multiply( _q1 ); // camera looks out the back of the device, not the top

			quaternion.multiply( _q0.setFromAxisAngle( _zee, - orient ) ); // adjust for screen orientation

		};

		this.connect = function () {

			onScreenOrientationChangeEvent(); // run once on load

			// iOS 13+

			if ( three._default.polyfill.window.DeviceOrientationEvent !== undefined && typeof three._default.polyfill.window.DeviceOrientationEvent.requestPermission === 'function' ) {

				three._default.polyfill.window.DeviceOrientationEvent.requestPermission().then( function ( response ) {

					if ( response == 'granted' ) {

						three._default.polyfill.window.addEventListener( 'orientationchange', onScreenOrientationChangeEvent );
						three._default.polyfill.window.addEventListener( 'deviceorientation', onDeviceOrientationChangeEvent );

					}

				} ).catch( function ( error ) {

					console.error( 'THREE.DeviceOrientationControls: Unable to use DeviceOrientation API:', error );

				} );

			} else {

				three._default.polyfill.window.addEventListener( 'orientationchange', onScreenOrientationChangeEvent );
				three._default.polyfill.window.addEventListener( 'deviceorientation', onDeviceOrientationChangeEvent );

			}

			scope.enabled = true;

		};

		this.disconnect = function () {

			three._default.polyfill.window.removeEventListener( 'orientationchange', onScreenOrientationChangeEvent );
			three._default.polyfill.window.removeEventListener( 'deviceorientation', onDeviceOrientationChangeEvent );

			scope.enabled = false;

		};

		this.update = function () {

			if ( scope.enabled === false ) return;

			const device = scope.deviceOrientation;

			if ( device ) {

				const alpha = device.alpha ? three.MathUtils.degToRad( device.alpha ) + scope.alphaOffset : 0; // Z

				const beta = device.beta ? three.MathUtils.degToRad( device.beta ) : 0; // X'

				const gamma = device.gamma ? three.MathUtils.degToRad( device.gamma ) : 0; // Y''

				const orient = scope.screenOrientation ? three.MathUtils.degToRad( scope.screenOrientation ) : 0; // O

				setObjectQuaternion( scope.object.quaternion, alpha, beta, gamma, orient );

				if ( 8 * ( 1 - lastQuaternion.dot( scope.object.quaternion ) ) > EPS ) {

					lastQuaternion.copy( scope.object.quaternion );
					scope.dispatchEvent( _changeEvent );

				}

			}

		};

		this.dispose = function () {

			scope.disconnect();

		};

		this.connect();

	}

}

function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
class DemoDeviceOrientationControls extends Demo {
  

  async init() {
    const { camera, textureLoader } = this.deps;
    this.control = new DeviceOrientationControls(camera);

    const geometry = new three.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);
    const material = new three.MeshBasicMaterial({
      map: await textureLoader.loadAsync('https://s3.ax1x.com/2021/02/26/yx0quq.jpg'),
    });

    const helperGeometry = new three.BoxGeometry(100, 100, 100, 4, 4, 4);
    const helperMaterial = new three.MeshBasicMaterial({
      color: 0xff00ff,
      wireframe: true,
    });

    this.add(new three.Mesh(geometry, material));
    this.add(new three.Mesh(helperGeometry, helperMaterial));
  }

  update() {
    _optionalChain([this, 'access', _ => _.control, 'optionalAccess', _2 => _2.update, 'call', _3 => _3()]);
  }

  dispose() {
    this.reset();
    this.control.disconnect();
    this.control.dispose();
    this.control = null;
  }
}

exports.DemoBVHLoader = DemoBVHLoader;
exports.DemoColladaLoader = DemoColladaLoader;
exports.DemoDeviceOrientationControls = DemoDeviceOrientationControls;
exports.DemoEXRLoader = DemoEXRLoader;
exports.DemoFBXLoader = DemoFBXLoader;
exports.DemoGLTFLoader = DemoGLTFLoader;
exports.DemoHDRPrefilterTexture = DemoHDRPrefilterTexture;
exports.DemoLWOLoader = DemoLWOLoader;
exports.DemoMTLLoader = DemoMTLLoader;
exports.DemoMemoryTest = DemoMemoryTest;
exports.DemoMeshOpt = DemoMeshOpt;
exports.DemoMeshQuantization = DemoMeshQuantization;
exports.DemoOBJLoader = DemoOBJLoader;
exports.DemoPDBLoader = DemoPDBLoader;
exports.DemoRGBELoader = DemoRGBELoader;
exports.DemoSTLLoader = DemoSTLLoader;
exports.DemoSVGLoader = DemoSVGLoader;
exports.DemoTGALoader = DemoTGALoader;
exports.DemoThreeSpritePlayer = DemoThreeSpritePlayer;
exports.DemoVSMShadow = DemoVSMShadow;
exports.DemoVTKLoader = DemoVTKLoader;
exports.GLTFLoader = GLTFLoader;
exports.wechat = wechat;
