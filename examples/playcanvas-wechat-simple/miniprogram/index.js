'use strict';

var oasis = require('./chunks/oasis.js');

function _classCallCheck$8(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var Platform = function Platform() {
    _classCallCheck$8(this, Platform);
};

function _classCallCheck$7(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var $Blob = function $Blob(parts) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
        type: 'image/jpeg'
    };
    _classCallCheck$7(this, $Blob);
    this.parts = parts;
    this.options = options;
    // 安卓微信不支持image/jpg的解析, 需改为image/jpeg
    options.type = options.type.replace('jpg', 'jpeg');
};

/*
 * base64-arraybuffer
 * https://github.com/niklasvh/base64-arraybuffer
 *
 * Copyright (c) 2012 Niklas von Hertzen
 * Licensed under the MIT license.
 */ var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
// Use a lookup table to find the index.
var lookup = new Uint8Array(256);
for(var i1 = 0; i1 < chars.length; i1++){
    lookup[chars.charCodeAt(i1)] = i1;
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
    for(var i = 0; i < mainLength; i = i + 3){
        // Combine the three bytes into a single integer
        chunk = bytes[i] << 16 | bytes[i + 1] << 8 | bytes[i + 2];
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
    } else if (byteRemainder == 2) {
        chunk = bytes[mainLength] << 8 | bytes[mainLength + 1];
        a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
        b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4
        // Set the 2 least significant bits to zero
        c = (chunk & 15) << 2; // 15    = 2^4 - 1
        base64 += chars[a] + chars[b] + chars[c] + '=';
    }
    return base64;
}

function _classCallCheck$6(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties$5(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass$5(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties$5(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties$5(Constructor, staticProps);
    return Constructor;
}
function _instanceof$2(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
var $URL = /*#__PURE__*/ function() {
    function $URL() {
        _classCallCheck$6(this, $URL);
    }
    _createClass$5($URL, [
        {
            key: "createObjectURL",
            value: function createObjectURL(obj) {
                if (_instanceof$2(obj, $Blob)) {
                    // 更好的方式，使用wx.fileSystemManager写入临时文件来获取url，但是需要手动管理临时文件
                    var base64 = encode(obj.parts[0]);
                    var url = "data:".concat(obj.options.type, ";base64,").concat(base64);
                    return url;
                }
                return '';
            }
        },
        {
            key: "revokeObjectURL",
            value: function revokeObjectURL() {
            }
        }
    ]);
    return $URL;
}();

/**
 * A lookup table for atob(), which converts an ASCII character to the
 * corresponding six-bit number.
 */ var keystr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
function atobLookup(chr) {
    var index = keystr.indexOf(chr);
    // Throw exception if character is not in the lookup string; should not be hit in tests
    return index < 0 ? undefined : index;
}
/**
 * Implementation of atob() according to the HTML and Infra specs, except that
 * instead of throwing INVALID_CHARACTER_ERR we return null.
 */ function atob(data) {
    // Web IDL requires DOMStrings to just be converted using ECMAScript
    // ToString, which in our case amounts to using a template literal.
    data = "".concat(data);
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
    var output = '';
    // "Let buffer be an empty buffer that can have bits appended to it."
    //
    // We append bits via left-shift and or.  accumulatedBits is used to track
    // when we've gotten to 24 bits.
    var buffer = 0;
    var accumulatedBits = 0;
    // "Let position be a position variable for data, initially pointing at the
    // start of data."
    //
    // "While position does not point past the end of data:"
    for(var i = 0; i < data.length; i++){
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
            output += String.fromCharCode((buffer & 16711680) >> 16);
            output += String.fromCharCode((buffer & 65280) >> 8);
            output += String.fromCharCode(buffer & 255);
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
    } else if (accumulatedBits === 18) {
        buffer >>= 2;
        output += String.fromCharCode((buffer & 65280) >> 8);
        output += String.fromCharCode(buffer & 255);
    }
    // "Return output."
    return output;
}

function _classCallCheck$5(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties$4(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass$4(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties$4(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties$4(Constructor, staticProps);
    return Constructor;
}
var _events = new WeakMap();
var Touch = function Touch(touch) {
    _classCallCheck$5(this, Touch);
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
};
var $EventTarget = /*#__PURE__*/ function() {
    function $EventTarget() {
        _classCallCheck$5(this, $EventTarget);
        _events.set(this, {
        });
    }
    _createClass$4($EventTarget, [
        {
            key: "addEventListener",
            value: function addEventListener(type, listener) {
                var events = _events.get(this);
                if (!events) {
                    events = {
                    };
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
        },
        {
            key: "removeEventListener",
            value: function removeEventListener(type, listener) {
                var events = _events.get(this);
                if (events) {
                    var listeners = events[type];
                    if (listeners && listeners.length > 0) {
                        for(var i = listeners.length; i--; i > 0){
                            if (listeners[i] === listener) {
                                listeners.splice(i, 1);
                                break;
                            }
                        }
                    }
                }
            }
        },
        {
            key: "dispatchEvent",
            value: function dispatchEvent() {
                var event = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
                    type: ''
                };
                if (typeof event.preventDefault !== 'function') {
                    event.preventDefault = function() {
                    };
                }
                if (typeof event.stopPropagation !== 'function') {
                    event.stopPropagation = function() {
                    };
                }
                var events = _events.get(this);
                if (events) {
                    var listeners = events[event.type];
                    if (listeners) {
                        for(var i = 0; i < listeners.length; i++){
                            listeners[i](event);
                        }
                    }
                }
                // @ts-ignore
                if (typeof this["on".concat(event.type)] === 'function') {
                    // @ts-ignore
                    this["on".concat(event.type)].call(this, event);
                }
            }
        },
        {
            key: "releasePointerCapture",
            value: function releasePointerCapture() {
            }
        },
        {
            key: "setPointerCapture",
            value: function setPointerCapture() {
            }
        }
    ]);
    return $EventTarget;
}();

function copyProperties(target, source) {
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = Object.getOwnPropertyNames(source)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var key = _step.value;
            if (key !== 'constructor' && key !== 'prototype' && key !== 'name') {
                var desc = Object.getOwnPropertyDescriptor(source, key);
                desc && Object.defineProperty(target, key, desc);
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
}
function createImage(canvas) {
    var img = canvas.createImage();
    img.addEventListener = function(name, cb) {
        return img["on".concat(name)] = cb.bind(img);
    };
    img.removeEventListener = function(name) {
        return img["on".concat(name)] = null;
    };
    return img;
}

/**
 * Parse the given string of `xml`.
 *
 * @param {String} xml
 * @return {Object}
 * @api public
 */ function parse(xml) {
    var document = /**
   * XML document.
   */ function document() {
        return {
            declaration: declaration(),
            root: tag()
        };
    };
    var declaration = /**
   * Declaration.
   */ function declaration() {
        var m = match(/^<\?xml\s*/);
        if (!m) return;
        // tag
        var node = {
            attributes: {
            },
            children: []
        };
        // attributes
        while(!(eos() || is('?>'))){
            var attr = attribute();
            if (!attr) return node;
            node.attributes[attr.name] = attr.value;
        }
        match(/\?>\s*/);
        // remove DOCTYPE
        // <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
        //      "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
        match(/<!DOCTYPE[^>]*>\s/);
        return node;
    };
    var content = /**
   * Text content.
   */ function content() {
        var m = match(/^([^<]*)/);
        if (m) return m[1];
        return '';
    };
    var attribute = /**
   * Attribute.
   */ function attribute() {
        var m = match(/([\w:-]+)\s*=\s*("[^"]*"|'[^']*'|\w+)\s*/);
        if (!m) return;
        return {
            name: m[1],
            value: strip(m[2])
        };
    };
    var strip = /**
   * Strip quotes from `val`.
   */ function strip(val) {
        return val.replace(/^['"]|['"]$/g, '');
    };
    var match = /**
   * Match `re` and advance the string.
   */ function match(re) {
        var m = xml.match(re);
        if (!m) return;
        xml = xml.slice(m[0].length);
        return m;
    };
    var eos = /**
   * End-of-source.
   */ function eos() {
        return xml.length == 0;
    };
    var is = /**
   * Check for `prefix`.
   */ function is(prefix) {
        return xml.indexOf(prefix) == 0;
    };
    xml = xml.trim();
    // strip comments
    xml = xml.replace(/<!--[\s\S]*?-->/g, '');
    return document();
    /**
   * Tag.
   */ function tag() {
        var m = match(/^<([\w-:.]+)\s*/);
        if (!m) return;
        // name
        var node = {
            name: m[1],
            attributes: {
            },
            children: []
        };
        // attributes
        while(!(eos() || is('>') || is('?>') || is('/>'))){
            var attr = attribute();
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
        var child;
        while(child = tag()){
            node.children.push(child);
        }
        // closing
        match(/^<\/[\w-:.]+>\s*/);
        return node;
    }
}

function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
function _classCallCheck$4(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties$3(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass$3(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties$3(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties$3(Constructor, staticProps);
    return Constructor;
}
function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;
    try {
        for(var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
}
function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}
function walkTree(node, processer) {
    processer(node);
    node.children.forEach(function(i) {
        return walkTree(i, processer);
    });
}
var $DOMParser = /*#__PURE__*/ function() {
    function $DOMParser() {
        _classCallCheck$4(this, $DOMParser);
    }
    _createClass$3($DOMParser, [
        {
            key: "parseFromString",
            value: function parseFromString(str) {
                var xml = parse(str);
                var nodeBase = {
                    // @ts-ignore
                    hasAttribute: function(key) {
                        // @ts-ignore
                        return this.attributes[key] !== undefined;
                    },
                    // @ts-ignore
                    getAttribute: function(key) {
                        // @ts-ignore
                        return this.attributes[key];
                    },
                    getElementsByTagName: function(tag) {
                        // 看了dae的文件结构，xml的节点不算庞大，所以还能接受
                        var result = [];
                        // @ts-ignore
                        this.childNodes.forEach(function(i) {
                            return walkTree(i, function(node) {
                                return tag === node.name && result.push(node);
                            });
                        });
                        return result;
                    }
                };
                // patch xml
                xml.root && walkTree(xml.root, function(node) {
                    node.nodeType = 1;
                    node.nodeName = node.name;
                    node.style = new Proxy((node.attributes.style || '').split(';').reduce(function(acc, curr) {
                        if (curr) {
                            var ref = _slicedToArray(curr.split(':'), 2), key = ref[0], value = ref[1];
                            acc[key.trim()] = value.trim();
                        }
                        return acc;
                    }, {
                    }), {
                        get: function(target, key) {
                            return target[key] || '';
                        }
                    });
                    node.textContent = node.content;
                    node.childNodes = node.children;
                    // @ts-ignore
                    node.__proto__ = nodeBase;
                });
                var out = {
                    documentElement: xml.root,
                    childNodes: [
                        xml.root
                    ]
                };
                // @ts-ignore
                out.__proto__ = nodeBase;
                return out;
            }
        }
    ]);
    return $DOMParser;
}();

function _classCallCheck$3(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties$2(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass$2(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties$2(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties$2(Constructor, staticProps);
    return Constructor;
}
function _instanceof$1(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
var $TextDecoder = /*#__PURE__*/ function() {
    function $TextDecoder() {
        _classCallCheck$3(this, $TextDecoder);
    }
    _createClass$2($TextDecoder, [
        {
            /**
   * 不支持 UTF-8 code points 大于 1 字节
   * @see https://stackoverflow.com/questions/17191945/conversion-between-utf-8-arraybuffer-and-string
   * @param {Uint8Array|ArrayBuffer} uint8Array
   */ key: "decode",
            value: function decode(input) {
                var uint8Array = _instanceof$1(input, ArrayBuffer) ? new Uint8Array(input) : input;
                // from threejs LoaderUtils.js
                var s = '';
                // Implicitly assumes little-endian.
                for(var i = 0, il = uint8Array.length; i < il; i++){
                    s += String.fromCharCode(uint8Array[i]);
                }
                try {
                    // merges multi-byte utf-8 characters.
                    return decodeURIComponent(escape(s));
                } catch (e) {
                    // see #16358
                    return s;
                }
            // return String.fromCharCode.apply(null, uint8Array);
            }
        }
    ]);
    return $TextDecoder;
}();

var $performance = {
    now: function() {
        return Date.now();
    }
};

// @ts-nocheck
function _assertThisInitialized$3(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
}
function _classCallCheck$2(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Date.prototype.toString.call(Reflect.construct(Date, [], function() {
        }));
        return true;
    } catch (e) {
        return false;
    }
}
function _construct(Parent, args, Class) {
    if (isNativeReflectConstruct()) {
        _construct = Reflect.construct;
    } else {
        _construct = function _construct(Parent, args, Class) {
            var a = [
                null
            ];
            a.push.apply(a, args);
            var Constructor = Function.bind.apply(Parent, a);
            var instance = new Constructor();
            if (Class) _setPrototypeOf$3(instance, Class.prototype);
            return instance;
        };
    }
    return _construct.apply(null, arguments);
}
function _defineProperties$1(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass$1(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties$1(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties$1(Constructor, staticProps);
    return Constructor;
}
function _getPrototypeOf$2(o) {
    _getPrototypeOf$2 = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf$2(o);
}
function _inherits$2(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    if (superClass) _setPrototypeOf$3(subClass, superClass);
}
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
}
function _possibleConstructorReturn$2(self, call) {
    if (call && (_typeof$2(call) === "object" || typeof call === "function")) {
        return call;
    }
    return _assertThisInitialized$3(self);
}
function _setPrototypeOf$3(o, p) {
    _setPrototypeOf$3 = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _setPrototypeOf$3(o, p);
}
var _typeof$2 = function(obj) {
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;
    _wrapNativeSuper = function _wrapNativeSuper(Class) {
        if (Class === null || !_isNativeFunction(Class)) return Class;
        if (typeof Class !== "function") {
            throw new TypeError("Super expression must either be null or a function");
        }
        if (typeof _cache !== "undefined") {
            if (_cache.has(Class)) return _cache.get(Class);
            _cache.set(Class, Wrapper);
        }
        function Wrapper() {
            return _construct(Class, arguments, _getPrototypeOf$2(this).constructor);
        }
        Wrapper.prototype = Object.create(Class.prototype, {
            constructor: {
                value: Wrapper,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        return _setPrototypeOf$3(Wrapper, Class);
    };
    return _wrapNativeSuper(Class);
}
function _isNativeReflectConstruct$2() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
        }));
        return true;
    } catch (e) {
        return false;
    }
}
function _createSuper$2(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct$2();
    return function _createSuperInternal() {
        var Super = _getPrototypeOf$2(Derived), result;
        if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf$2(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else {
            result = Super.apply(this, arguments);
        }
        return _possibleConstructorReturn$2(this, result);
    };
}
var _requestHeader = new WeakMap();
var _responseHeader = new WeakMap();
var _requestTask = new WeakMap();
function _triggerEvent(type) {
    var event = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
    };
    event.target = event.target || this;
    if (typeof this["on".concat(type)] === 'function') {
        this["on".concat(type)].call(this, event);
    }
}
function _changeReadyState(readyState) {
    var event = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
    };
    this.readyState = readyState;
    event.readyState = readyState;
    _triggerEvent.call(this, 'readystatechange', event);
}
function _isRelativePath(url) {
    return !/^(http|https|ftp|wxfile):\/\/.*/i.test(url);
}
var $XMLHttpRequest = /*#__PURE__*/ function(EventTarget) {
    _inherits$2($XMLHttpRequest, EventTarget);
    var _super = _createSuper$2($XMLHttpRequest);
    function $XMLHttpRequest() {
        _classCallCheck$2(this, $XMLHttpRequest);
        var _this;
        _this = _super.call(this);
        _this.runtime = wx.getSystemInfoSync().platform;
        /*
     * TODO 这一批事件应该是在 XMLHttpRequestEventTarget.prototype 上面的
     */ _this.onabort = null;
        _this.onerror = null;
        _this.onload = null;
        _this.onloadstart = null;
        _this.onprogress = null;
        _this.ontimeout = null;
        _this.onloadend = null;
        _this.onreadystatechange = null;
        _this.readyState = 0;
        _this.response = null;
        _this.responseText = null;
        _this.responseType = 'text';
        _this.dataType = 'string';
        _this.responseXML = null;
        _this.status = 0;
        _this.statusText = '';
        _this.upload = {
        };
        _this.withCredentials = false;
        _requestHeader.set(_assertThisInitialized$3(_this), {
            'content-type': 'application/x-www-form-urlencoded'
        });
        _responseHeader.set(_assertThisInitialized$3(_this), {
        });
        return _this;
    }
    _createClass$1($XMLHttpRequest, [
        {
            key: "abort",
            value: function abort() {
                var myRequestTask = _requestTask.get(this);
                if (myRequestTask) {
                    myRequestTask.abort();
                }
            }
        },
        {
            key: "getAllResponseHeaders",
            value: function getAllResponseHeaders() {
                var responseHeader = _responseHeader.get(this);
                return Object.keys(responseHeader).map(function(header) {
                    return "".concat(header, ": ").concat(responseHeader[header]);
                }).join('\n');
            }
        },
        {
            key: "getResponseHeader",
            value: function getResponseHeader(header) {
                return _responseHeader.get(this)[header];
            }
        },
        {
            key: "open",
            value: function open(method, url /* async, user, password 这几个参数在小程序内不支持*/ ) {
                this._method = method;
                this._url = url;
                _changeReadyState.call(this, $XMLHttpRequest.OPENED);
            }
        },
        {
            key: "overrideMimeType",
            value: function overrideMimeType() {
            }
        },
        {
            key: "send",
            value: function send() {
                var data1 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : '';
                if (this.readyState !== $XMLHttpRequest.OPENED) {
                    throw new Error("Failed to execute 'send' on 'XMLHttpRequest': The object's state must be OPENED.");
                } else {
                    var _this = this;
                    var url = this._url;
                    var header1 = _requestHeader.get(this);
                    var responseType = this.responseType;
                    var dataType = this.dataType;
                    var relative = _isRelativePath(url);
                    var encoding;
                    if (responseType === 'arraybuffer') ; else {
                        encoding = 'utf8';
                    }
                    if (responseType === 'json') {
                        dataType = 'json';
                        responseType = 'text';
                    }
                    delete this.response;
                    this.response = null;
                    var resolved = false;
                    var onSuccess = function(param) {
                        var data = param.data, statusCode = param.statusCode, header = param.header;
                        // console.log('onSuccess', url);
                        if (resolved) return;
                        resolved = true;
                        statusCode = statusCode === undefined ? 200 : statusCode;
                        if (typeof data !== 'string' && !_instanceof(data, ArrayBuffer) && dataType !== 'json') {
                            try {
                                data = JSON.stringify(data);
                            } catch (e) {
                            }
                        }
                        _this.status = statusCode;
                        if (header) {
                            _responseHeader.set(_this, header);
                        }
                        _triggerEvent.call(_this, 'loadstart');
                        _changeReadyState.call(_this, $XMLHttpRequest.HEADERS_RECEIVED);
                        _changeReadyState.call(_this, $XMLHttpRequest.LOADING);
                        _this.response = data;
                        if (_instanceof(data, ArrayBuffer)) {
                            Object.defineProperty(_this, 'responseText', {
                                enumerable: true,
                                configurable: true,
                                get: function get() {
                                    throw 'InvalidStateError : responseType is ' + this.responseType;
                                }
                            });
                        } else {
                            _this.responseText = data;
                        }
                        _changeReadyState.call(_this, $XMLHttpRequest.DONE);
                        _triggerEvent.call(_this, 'load');
                        _triggerEvent.call(_this, 'loadend');
                    };
                    var onFail = function(param) {
                        var errMsg = param.errMsg;
                        // TODO 规范错误
                        if (resolved) return;
                        resolved = true;
                        if (errMsg.indexOf('abort') !== -1) {
                            _triggerEvent.call(_this, 'abort');
                        } else {
                            _triggerEvent.call(_this, 'error', {
                                message: errMsg
                            });
                        }
                        _triggerEvent.call(_this, 'loadend');
                        if (relative) {
                            // 用户即使没监听error事件, 也给出相应的警告
                            console.warn(errMsg);
                        }
                    };
                    if (relative) {
                        var fs = wx.getFileSystemManager();
                        var options = {
                            filePath: url,
                            success: onSuccess,
                            fail: onFail
                        };
                        if (encoding) {
                            options['encoding'] = encoding;
                        }
                        fs.readFile(options);
                        return;
                    }
                    // IOS在某些情况下不会触发onSuccess...
                    var usePatch = responseType === 'arraybuffer' && this.runtime === 'ios' && $XMLHttpRequest.useFetchPatch;
                    wx.request({
                        data: data1,
                        url: url,
                        method: this._method.toUpperCase(),
                        header: header1,
                        dataType: dataType,
                        responseType: responseType,
                        enableCache: false,
                        success: onSuccess,
                        // success: usePatch ? undefined : onSuccess,
                        fail: onFail
                    });
                    if (usePatch) {
                        setTimeout(function() {
                            wx.request({
                                data: data1,
                                url: url,
                                method: this._method,
                                header: header1,
                                dataType: dataType,
                                responseType: responseType,
                                enableCache: true,
                                success: onSuccess,
                                fail: onFail
                            });
                        }, $XMLHttpRequest.fetchPatchDelay);
                    }
                }
            }
        },
        {
            key: "setRequestHeader",
            value: function setRequestHeader(header, value) {
                var myHeader = _requestHeader.get(this);
                myHeader[header] = value;
                _requestHeader.set(this, myHeader);
            }
        },
        {
            key: "addEventListener",
            value: function addEventListener(type, listener) {
                var _this = this;
                if (typeof listener !== 'function') {
                    return;
                }
                this['on' + type] = function() {
                    var event = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
                    };
                    event.target = event.target || _this;
                    listener.call(_this, event);
                };
            }
        },
        {
            key: "removeEventListener",
            value: function removeEventListener(type, listener) {
                if (this['on' + type] === listener) {
                    this['on' + type] = null;
                }
            }
        }
    ]);
    return $XMLHttpRequest;
}(_wrapNativeSuper($EventTarget));
// TODO 没法模拟 HEADERS_RECEIVED 和 LOADING 两个状态
$XMLHttpRequest.UNSEND = 0;
$XMLHttpRequest.OPENED = 1;
$XMLHttpRequest.HEADERS_RECEIVED = 2;
$XMLHttpRequest.LOADING = 3;
$XMLHttpRequest.DONE = 4;
// 某些情况下IOS会不success不触发。。。
$XMLHttpRequest.useFetchPatch = false;
$XMLHttpRequest.fetchPatchDelay = 200;

/// <reference types="@types/wechat-miniprogram" />
function _assertThisInitialized$2(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
}
function _classCallCheck$1(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _getPrototypeOf$1(o) {
    _getPrototypeOf$1 = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf$1(o);
}
function _inherits$1(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    if (superClass) _setPrototypeOf$2(subClass, superClass);
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {
        };
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
function _possibleConstructorReturn$1(self, call) {
    if (call && (_typeof$1(call) === "object" || typeof call === "function")) {
        return call;
    }
    return _assertThisInitialized$2(self);
}
function _setPrototypeOf$2(o, p) {
    _setPrototypeOf$2 = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _setPrototypeOf$2(o, p);
}
var _typeof$1 = function(obj) {
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
function _isNativeReflectConstruct$1() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
        }));
        return true;
    } catch (e) {
        return false;
    }
}
function _createSuper$1(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct$1();
    return function _createSuperInternal() {
        var Super = _getPrototypeOf$1(Derived), result;
        if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf$1(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else {
            result = Super.apply(this, arguments);
        }
        return _possibleConstructorReturn$1(this, result);
    };
}
function OffscreenCanvas() {
    // @ts-ignore
    return wx.createOffscreenCanvas();
}
var WechatPlatform$1 = /*#__PURE__*/ function(Platform) {
    _inherits$1(WechatPlatform, Platform);
    var _super = _createSuper$1(WechatPlatform);
    function WechatPlatform(canvas, width, height) {
        _classCallCheck$1(this, WechatPlatform);
        var _this;
        _this = _super.call(this);
        _this.enabledDeviceMotion = false;
        _this.canvasRect = {
            width: 0,
            height: 0,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        };
        var systemInfo = wx.getSystemInfoSync();
        var isAndroid = systemInfo.platform === 'android';
        // @ts-ignore
        _this.canvas = canvas;
        _this.canvasW = width === undefined ? canvas.width : width;
        _this.canvasH = height === undefined ? canvas.height : height;
        _this.canvasRect.width = _this.canvasW;
        _this.canvasRect.height = _this.canvasH;
        var document = {
            createElementNS: function(_, type) {
                if (type === 'canvas') return canvas;
                if (type === 'img') return createImage(canvas);
            },
            body: {
            }
        };
        var img = createImage(canvas);
        var Image = function() {
            return createImage(canvas);
        };
        var URL = new $URL();
        var window = {
            innerWidth: systemInfo.windowWidth,
            innerHeight: systemInfo.windowHeight,
            devicePixelRatio: systemInfo.pixelRatio,
            AudioContext: function AudioContext() {
            },
            requestAnimationFrame: _this.canvas.requestAnimationFrame,
            cancelAnimationFrame: _this.canvas.cancelAnimationFrame,
            DeviceOrientationEvent: {
                requestPermission: function() {
                    return Promise.resolve('granted');
                }
            },
            URL: URL,
            Image: Image,
            DOMParser: $DOMParser,
            TextDecoder: $TextDecoder,
            Blob: $Blob,
            performance: $performance
        };
        [
            canvas,
            document,
            window,
            document.body
        ].forEach(function(i) {
            // @ts-ignore
            var old = i.__proto__;
            // @ts-ignore
            i.__proto__ = {
            };
            // @ts-ignore
            i.__proto__.__proto__ = old;
            // @ts-ignore
            copyProperties(i.__proto__, $EventTarget.prototype);
        });
        _this.polyfill = {
            window: window,
            document: document,
            // @ts-expect-error
            Blob: $Blob,
            // @ts-expect-error
            DOMParser: $DOMParser,
            // @ts-expect-error
            TextDecoder: $TextDecoder,
            // @ts-expect-error
            XMLHttpRequest: $XMLHttpRequest,
            // @ts-expect-error
            OffscreenCanvas: OffscreenCanvas,
            // @ts-expect-error
            URL: URL,
            Image: Image,
            HTMLImageElement: img.constructor,
            atob: atob,
            createImageBitmap: undefined,
            cancelAnimationFrame: window.cancelAnimationFrame,
            requestAnimationFrame: window.requestAnimationFrame,
            performance: window.performance
        };
        _this.patchCanvas();
        _this.onDeviceMotionChange = function(e) {
            e.type = 'deviceorientation';
            if (isAndroid) {
                e.alpha *= -1;
                e.beta *= -1;
                e.gamma *= -1;
            }
            window.dispatchEvent(e);
        };
        return _this;
    }
    _createClass(WechatPlatform, [
        {
            key: "patchCanvas",
            value: function patchCanvas() {
                var _this = this;
                var ref = this, canvasH = ref.canvasH, canvasW = ref.canvasW, canvas = ref.canvas;
                Object.defineProperty(this.canvas, 'style', {
                    get: function() {
                        return {
                            width: this.width + 'px',
                            height: this.height + 'px'
                        };
                    }
                });
                Object.defineProperty(this.canvas, 'clientHeight', {
                    get: function() {
                        return canvasH || this.height;
                    }
                });
                Object.defineProperty(this.canvas, 'clientWidth', {
                    get: function() {
                        return canvasW || this.width;
                    }
                });
                // @ts-ignore
                canvas.ownerDocument = this.document;
                // @ts-ignore
                canvas.getBoundingClientRect = function() {
                    return _this.canvasRect;
                };
                // @ts-ignore
                canvas._getContext = this.canvas.getContext;
                canvas.getContext = function getContext() {
                    var _canvas;
                    if (arguments[0] !== 'webgl') return null;
                    // @ts-ignore
                    return (_canvas = canvas)._getContext.apply(_canvas, arguments);
                };
            }
        },
        {
            // 某些情况下IOS会不success不触发。。。
            key: "patchXHR",
            value: function patchXHR() {
                $XMLHttpRequest.useFetchPatch = true;
                return this;
            }
        },
        {
            key: "enableDeviceOrientation",
            value: function enableDeviceOrientation(interval) {
                var _this = this;
                return new Promise(function(resolve, reject) {
                    var _this1 = _this;
                    wx.onDeviceMotionChange(_this.onDeviceMotionChange);
                    wx.startDeviceMotionListening({
                        interval: interval,
                        success: function(e) {
                            resolve(e);
                            _this1.enabledDeviceMotion = true;
                        },
                        fail: reject
                    });
                });
            }
        },
        {
            key: "disableDeviceOrientation",
            value: function disableDeviceOrientation() {
                var _this = this;
                return new Promise(function(resolve, reject) {
                    var _this2 = _this;
                    wx.offDeviceMotionChange(_this.onDeviceMotionChange);
                    _this.enabledDeviceMotion && wx.stopDeviceMotionListening({
                        success: function() {
                            resolve(true);
                            _this2.enabledDeviceMotion = false;
                        },
                        fail: reject
                    });
                });
            }
        },
        {
            key: "dispatchTouchEvent",
            value: function dispatchTouchEvent() {
                var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
                    touches: [],
                    changedTouches: [],
                    timeStamp: 0,
                    type: ''
                };
                var target = _objectSpread({
                }, this);
                var changedTouches = e.changedTouches.map(function(touch) {
                    return new Touch(touch);
                });
                var event = {
                    changedTouches: changedTouches,
                    touches: e.touches.map(function(touch) {
                        return new Touch(touch);
                    }),
                    targetTouches: Array.prototype.slice.call(e.touches.map(function(touch) {
                        return new Touch(touch);
                    })),
                    timeStamp: e.timeStamp,
                    target: target,
                    currentTarget: target,
                    type: e.type,
                    cancelBubble: false,
                    cancelable: false
                };
                this.canvas.dispatchEvent(event);
                if (changedTouches.length) {
                    var touch1 = changedTouches[0];
                    var pointerEvent = {
                        pageX: touch1.pageX,
                        pageY: touch1.pageY,
                        offsetX: touch1.pageX,
                        offsetY: touch1.pageY,
                        pointerId: touch1.identifier,
                        type: {
                            touchstart: 'pointerdown',
                            touchmove: 'pointermove',
                            touchend: 'pointerup'
                        }[e.type] || '',
                        pointerType: 'touch'
                    };
                    this.canvas.dispatchEvent(pointerEvent);
                }
            }
        },
        {
            key: "dispose",
            value: function dispose() {
                this.disableDeviceOrientation();
                // 缓解ios内存泄漏, 前后进出页面多几次，降低pixelRatio也可行
                this.canvas.width = 0;
                this.canvas.height = 0;
                // @ts-ignore
                if (this.canvas) this.canvas.ownerDocument = null;
                // @ts-ignore
                this.onDeviceMotionChange = null;
                // @ts-ignore
                this.canvas = null;
            }
        }
    ]);
    return WechatPlatform;
}(Platform);

/// <reference types="wechat-miniprogram" />
function _assertThisInitialized$1(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    if (superClass) _setPrototypeOf$1(subClass, superClass);
}
function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
        return call;
    }
    return _assertThisInitialized$1(self);
}
function _setPrototypeOf$1(o, p) {
    _setPrototypeOf$1 = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _setPrototypeOf$1(o, p);
}
var _typeof = function(obj) {
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
        }));
        return true;
    } catch (e) {
        return false;
    }
}
function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
        var Super = _getPrototypeOf(Derived), result;
        if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else {
            result = Super.apply(this, arguments);
        }
        return _possibleConstructorReturn(this, result);
    };
}
var WechatPlatform = /*#__PURE__*/ function(WechatPlatformBase) {
    _inherits(WechatPlatform, WechatPlatformBase);
    var _super = _createSuper(WechatPlatform);
    function WechatPlatform(canvas, width, height) {
        _classCallCheck(this, WechatPlatform);
        var _this;
        _this = _super.call(this, canvas, width, height);
        _this.polyfill.$defaultWebGLExtensions = {
            OES_vertex_array_object: null
        };
        _this.polyfill.HTMLCanvasElement = canvas.constructor;
        return _this;
    }
    return WechatPlatform;
}(WechatPlatform$1);

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

var ESP$1 = oasis.MathUtil.zeroTolerance; // Spherical.

var Spherical = /*#__PURE__*/function () {
  function Spherical(radius, phi, theta) {
    this.radius = void 0;
    this.phi = void 0;
    this.theta = void 0;
    this.radius = radius !== undefined ? radius : 1.0;
    this.phi = phi !== undefined ? phi : 0;
    this.theta = theta !== undefined ? theta : 0;
  }

  var _proto = Spherical.prototype;

  _proto.set = function set(radius, phi, theta) {
    this.radius = radius;
    this.phi = phi;
    this.theta = theta;
    return this;
  };

  _proto.makeSafe = function makeSafe() {
    this.phi = oasis.MathUtil.clamp(this.phi, ESP$1, Math.PI - ESP$1);
    return this;
  };

  _proto.setFromVec3 = function setFromVec3(v3) {
    this.radius = v3.length();

    if (this.radius === 0) {
      this.theta = 0;
      this.phi = 0;
    } else {
      this.theta = Math.atan2(v3.x, v3.z);
      this.phi = Math.acos(oasis.MathUtil.clamp(v3.y / this.radius, -1, 1));
    }

    return this;
  };

  _proto.setToVec3 = function setToVec3(v3) {
    var sinPhiRadius = Math.sin(this.phi) * this.radius;
    v3.x = sinPhiRadius * Math.sin(this.theta);
    v3.y = Math.cos(this.phi) * this.radius;
    v3.z = sinPhiRadius * Math.cos(this.theta);
    return this;
  };

  return Spherical;
}();

/**
 * The camera's track controller, can rotate, zoom, pan, support mouse and touch events.
 */
var OrbitControl = /*#__PURE__*/function (_Script) {
  _inheritsLoose(OrbitControl, _Script);

  /** The radian of automatic rotation per second. */
  function OrbitControl(entity) {
    var _this;

    _this = _Script.call(this, entity) || this;
    _this.camera = void 0;
    _this.domElement = void 0;
    _this.mainElement = void 0;
    _this.fov = void 0;
    _this.target = void 0;
    _this.up = void 0;
    _this.minDistance = void 0;
    _this.maxDistance = void 0;
    _this.minZoom = void 0;
    _this.maxZoom = void 0;
    _this.enableDamping = void 0;
    _this.zoomFactor = void 0;
    _this.enableRotate = void 0;
    _this.keyPanSpeed = void 0;
    _this.minPolarAngle = void 0;
    _this.maxPolarAngle = void 0;
    _this.minAzimuthAngle = void 0;
    _this.maxAzimuthAngle = void 0;
    _this.enableZoom = void 0;
    _this.dampingFactor = void 0;
    _this.zoomSpeed = void 0;
    _this.enablePan = void 0;
    _this.autoRotate = void 0;
    _this.autoRotateSpeed = Math.PI;
    _this.rotateSpeed = void 0;
    _this.enableKeys = void 0;
    _this.keys = void 0;
    _this.mouseButtons = void 0;
    _this.touchFingers = void 0;
    _this.STATE = void 0;
    _this.mouseUpEvents = void 0;
    _this.constEvents = void 0;
    _this._position = void 0;
    _this._offset = void 0;
    _this._spherical = void 0;
    _this._sphericalDelta = void 0;
    _this._sphericalDump = void 0;
    _this._zoomFrag = void 0;
    _this._scale = void 0;
    _this._panOffset = void 0;
    _this._isMouseUp = void 0;
    _this._vPan = void 0;
    _this._state = void 0;
    _this._rotateStart = void 0;
    _this._rotateEnd = void 0;
    _this._rotateDelta = void 0;
    _this._panStart = void 0;
    _this._panEnd = void 0;
    _this._panDelta = void 0;
    _this._zoomStart = void 0;
    _this._zoomEnd = void 0;
    _this._zoomDelta = void 0;
    _this.camera = entity; // @ts-ignore
    // @todo In the future, the dependence on html elements will be removed and realized through the input of the packaging engine.

    _this.mainElement = _this.engine.canvas._webCanvas;
    _this.domElement = oasis.PlatformManager.polyfill.document;
    _this.fov = 45; // Target position.

    _this.target = new oasis.Vector3(); // Up vector

    _this.up = new oasis.Vector3(0, 1, 0);
    /**
     * The minimum distance, the default is 0.1, should be greater than 0.
     */

    _this.minDistance = 0.1;
    /**
     * The maximum distance, the default is infinite, should be greater than the minimum distance
     */

    _this.maxDistance = Infinity;
    /**
     * Minimum zoom speed, the default is 0.0.
     * @member {Number}
     */

    _this.minZoom = 0.0;
    /**
     * Maximum zoom speed, the default is positive infinity.
     */

    _this.maxZoom = Infinity;
    /**
     * The minimum radian in the vertical direction, the default is 0 radian, the value range is 0 - Math.PI.
     */

    _this.minPolarAngle = 0;
    /**
     * The maximum radian in the vertical direction, the default is Math.PI, and the value range is 0 - Math.PI.
     */

    _this.maxPolarAngle = Math.PI;
    /**
     * The minimum radian in the horizontal direction, the default is negative infinity.
     */

    _this.minAzimuthAngle = -Infinity;
    /**
     * The maximum radian in the horizontal direction, the default is positive infinity.
     */

    _this.maxAzimuthAngle = Infinity;
    /**
     * Whether to enable camera damping, the default is true.
     */

    _this.enableDamping = true;
    /**
     * Rotation damping parameter, default is 0.1 .
     */

    _this.dampingFactor = 0.1;
    /**
     * Zoom damping parameter, default is 0.2 .
     */

    _this.zoomFactor = 0.2;
    /**
     * Whether to enable zoom, the default is true.
     */

    _this.enableZoom = true;
    /**
     * Camera zoom speed, the default is 1.0.
     */

    _this.zoomSpeed = 1.0;
    /**
     * Whether to enable rotation, the default is true.
     */

    _this.enableRotate = true;
    /**
     * Rotation speed, default is 1.0 .
     */

    _this.rotateSpeed = 1.0;
    /**
     * Whether to enable translation, the default is true.
     */

    _this.enablePan = true;
    /**
     * Keyboard translation speed, the default is 7.0 .
     */

    _this.keyPanSpeed = 7.0;
    /**
     * Whether to automatically rotate the camera, the default is false.
     */

    _this.autoRotate = false;
    /**
     * Whether to enable keyboard.
     */

    _this.enableKeys = false;
    _this.keys = {
      LEFT: 37,
      UP: 38,
      RIGHT: 39,
      BOTTOM: 40
    }; // Control keys.

    _this.mouseButtons = {
      ORBIT: 0,
      ZOOM: 1,
      PAN: 2
    };
    _this.touchFingers = {
      ORBIT: 1,
      ZOOM: 2,
      PAN: 3
    }; // Reuse objects to prevent excessive stack allocation.
    // update

    _this._position = new oasis.Vector3();
    _this._offset = new oasis.Vector3();
    _this._spherical = new Spherical();
    _this._sphericalDelta = new Spherical();
    _this._sphericalDump = new Spherical();
    _this._zoomFrag = 0;
    _this._scale = 1;
    _this._panOffset = new oasis.Vector3();
    _this._isMouseUp = true; // pan

    _this._vPan = new oasis.Vector3(); // state

    _this._rotateStart = new oasis.Vector2();
    _this._rotateEnd = new oasis.Vector2();
    _this._rotateDelta = new oasis.Vector2();
    _this._panStart = new oasis.Vector2();
    _this._panEnd = new oasis.Vector2();
    _this._panDelta = new oasis.Vector2();
    _this._zoomStart = new oasis.Vector2();
    _this._zoomEnd = new oasis.Vector2();
    _this._zoomDelta = new oasis.Vector2();
    _this.STATE = {
      NONE: -1,
      ROTATE: 0,
      ZOOM: 1,
      PAN: 2,
      TOUCH_ROTATE: 3,
      TOUCH_ZOOM: 4,
      TOUCH_PAN: 5
    };
    _this._state = _this.STATE.NONE;
    _this.constEvents = [{
      type: "mousedown",
      listener: _this.onMouseDown.bind(_assertThisInitialized(_this))
    }, {
      type: "wheel",
      listener: _this.onMouseWheel.bind(_assertThisInitialized(_this))
    }, {
      type: "keydown",
      listener: _this.onKeyDown.bind(_assertThisInitialized(_this)),
      element: oasis.PlatformManager.polyfill.window
    }, {
      type: "touchstart",
      listener: _this.onTouchStart.bind(_assertThisInitialized(_this))
    }, {
      type: "touchmove",
      listener: _this.onTouchMove.bind(_assertThisInitialized(_this))
    }, {
      type: "touchend",
      listener: _this.onTouchEnd.bind(_assertThisInitialized(_this))
    }, {
      type: "contextmenu",
      listener: _this.onContextMenu.bind(_assertThisInitialized(_this))
    }];
    _this.mouseUpEvents = [{
      type: "mousemove",
      listener: _this.onMouseMove.bind(_assertThisInitialized(_this))
    }, {
      type: "mouseup",
      listener: _this.onMouseUp.bind(_assertThisInitialized(_this))
    }];

    _this.constEvents.forEach(function (ele) {
      if (ele.element) {
        ele.element.addEventListener(ele.type, ele.listener, false);
      } else {
        _this.mainElement.addEventListener(ele.type, ele.listener, false);
      }
    });

    return _this;
  }

  var _proto = OrbitControl.prototype;

  _proto.onDisable = function onDisable() {
    var element = this.domElement === oasis.PlatformManager.polyfill.document ? this.domElement.body : this.domElement;
    this.mainElement.removeEventListener(this.mouseUpEvents[0].type, this.mouseUpEvents[0].listener, false);
    element.removeEventListener(this.mouseUpEvents[1].type, this.mouseUpEvents[1].listener, false);
  };

  _proto.onDestroy = function onDestroy() {
    var _this2 = this;

    this.constEvents.forEach(function (ele) {
      if (ele.element) {
        ele.element.removeEventListener(ele.type, ele.listener, false);
      } else {
        _this2.mainElement.removeEventListener(ele.type, ele.listener, false);
      }
    });
    var element = this.domElement === oasis.PlatformManager.polyfill.document ? this.domElement.body : this.domElement;
    this.mainElement.removeEventListener(this.mouseUpEvents[0].type, this.mouseUpEvents[0].listener, false);
    element.removeEventListener(this.mouseUpEvents[1].type, this.mouseUpEvents[1].listener, false);
  };

  _proto.onUpdate = function onUpdate(dtime) {
    if (!this.enabled) return;
    var position = this.camera.transform.position;
    position.cloneTo(this._offset);

    this._offset.subtract(this.target);

    this._spherical.setFromVec3(this._offset);

    if (this.autoRotate && this._state === this.STATE.NONE) {
      this.rotateLeft(this.getAutoRotationAngle(dtime));
    }

    this._spherical.theta += this._sphericalDelta.theta;
    this._spherical.phi += this._sphericalDelta.phi;
    this._spherical.theta = Math.max(this.minAzimuthAngle, Math.min(this.maxAzimuthAngle, this._spherical.theta));
    this._spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this._spherical.phi));

    this._spherical.makeSafe();

    if (this._scale !== 1) {
      this._zoomFrag = this._spherical.radius * (this._scale - 1);
    }

    this._spherical.radius += this._zoomFrag;
    this._spherical.radius = Math.max(this.minDistance, Math.min(this.maxDistance, this._spherical.radius));
    this.target.add(this._panOffset);

    this._spherical.setToVec3(this._offset);

    this.target.cloneTo(this._position);

    this._position.add(this._offset);

    this.camera.transform.position = this._position;
    this.camera.transform.lookAt(this.target, this.up);

    if (this.enableDamping === true) {
      this._sphericalDump.theta *= 1 - this.dampingFactor;
      this._sphericalDump.phi *= 1 - this.dampingFactor;
      this._zoomFrag *= 1 - this.zoomFactor;

      if (this._isMouseUp) {
        this._sphericalDelta.theta = this._sphericalDump.theta;
        this._sphericalDelta.phi = this._sphericalDump.phi;
      } else {
        this._sphericalDelta.set(0, 0, 0);
      }
    } else {
      this._sphericalDelta.set(0, 0, 0);

      this._zoomFrag = 0;
    }

    this._scale = 1;

    this._panOffset.setValue(0, 0, 0);
  }
  /**
   * Get the radian of automatic rotation.
   */
  ;

  _proto.getAutoRotationAngle = function getAutoRotationAngle(dtime) {
    return this.autoRotateSpeed / 1000 * dtime;
  }
  /**
   * Get zoom value.
   */
  ;

  _proto.getZoomScale = function getZoomScale() {
    return Math.pow(0.95, this.zoomSpeed);
  }
  /**
   * Rotate to the left by a certain radian.
   * @param radian - Radian value of rotation
   */
  ;

  _proto.rotateLeft = function rotateLeft(radian) {
    this._sphericalDelta.theta -= radian;

    if (this.enableDamping) {
      this._sphericalDump.theta = -radian;
    }
  }
  /**
   * Rotate to the right by a certain radian.
   * @param radian - Radian value of rotation
   */
  ;

  _proto.rotateUp = function rotateUp(radian) {
    this._sphericalDelta.phi -= radian;

    if (this.enableDamping) {
      this._sphericalDump.phi = -radian;
    }
  }
  /**
   * Pan left.
   */
  ;

  _proto.panLeft = function panLeft(distance, worldMatrix) {
    var e = worldMatrix.elements;

    this._vPan.setValue(e[0], e[1], e[2]);

    this._vPan.scale(distance);

    this._panOffset.add(this._vPan);
  }
  /**
   * Pan right.
   */
  ;

  _proto.panUp = function panUp(distance, worldMatrix) {
    var e = worldMatrix.elements;

    this._vPan.setValue(e[4], e[5], e[6]);

    this._vPan.scale(distance);

    this._panOffset.add(this._vPan);
  }
  /**
   * Pan.
   * @param deltaX - The amount of translation from the screen distance in the x direction
   * @param deltaY - The amount of translation from the screen distance in the y direction
   */
  ;

  _proto.pan = function pan(deltaX, deltaY) {
    // perspective only
    var position = this.camera.position;
    position.cloneTo(this._vPan);

    this._vPan.subtract(this.target);

    var targetDistance = this._vPan.length();

    targetDistance *= this.fov / 2 * (Math.PI / 180);
    this.panLeft(-2 * deltaX * (targetDistance / this.mainElement.clientHeight), this.camera.transform.worldMatrix);
    this.panUp(2 * deltaY * (targetDistance / this.mainElement.clientHeight), this.camera.transform.worldMatrix);
  }
  /**
   * Zoom in.
   */
  ;

  _proto.zoomIn = function zoomIn(zoomScale) {
    // perspective only
    this._scale *= zoomScale;
  }
  /**
   * Zoom out.
   */
  ;

  _proto.zoomOut = function zoomOut(zoomScale) {
    // perspective only
    this._scale /= zoomScale;
  }
  /**
   * Rotation parameter update on mouse click.
   */
  ;

  _proto.handleMouseDownRotate = function handleMouseDownRotate(event) {
    this._rotateStart.setValue(event.clientX, event.clientY);
  }
  /**
   * Zoom parameter update on mouse click.
   */
  ;

  _proto.handleMouseDownZoom = function handleMouseDownZoom(event) {
    this._zoomStart.setValue(event.clientX, event.clientY);
  }
  /**
   * Pan parameter update on mouse click.
   */
  ;

  _proto.handleMouseDownPan = function handleMouseDownPan(event) {
    this._panStart.setValue(event.clientX, event.clientY);
  }
  /**
   * Rotation parameter update when the mouse moves.
   */
  ;

  _proto.handleMouseMoveRotate = function handleMouseMoveRotate(event) {
    this._rotateEnd.setValue(event.clientX, event.clientY);

    oasis.Vector2.subtract(this._rotateEnd, this._rotateStart, this._rotateDelta);
    this.rotateLeft(2 * Math.PI * (this._rotateDelta.x / this.mainElement.clientWidth) * this.rotateSpeed);
    this.rotateUp(2 * Math.PI * (this._rotateDelta.y / this.mainElement.clientHeight) * this.rotateSpeed);

    this._rotateEnd.cloneTo(this._rotateStart);
  }
  /**
   * Zoom parameters update when the mouse moves.
   */
  ;

  _proto.handleMouseMoveZoom = function handleMouseMoveZoom(event) {
    this._zoomEnd.setValue(event.clientX, event.clientY);

    oasis.Vector2.subtract(this._zoomEnd, this._zoomStart, this._zoomDelta);

    if (this._zoomDelta.y > 0) {
      this.zoomOut(this.getZoomScale());
    } else if (this._zoomDelta.y < 0) {
      this.zoomIn(this.getZoomScale());
    }

    this._zoomEnd.cloneTo(this._zoomStart);
  }
  /**
   * Pan parameters update when the mouse moves.
   */
  ;

  _proto.handleMouseMovePan = function handleMouseMovePan(event) {
    this._panEnd.setValue(event.clientX, event.clientY);

    oasis.Vector2.subtract(this._panEnd, this._panStart, this._panDelta);
    this.pan(this._panDelta.x, this._panDelta.y);

    this._panEnd.cloneTo(this._panStart);
  }
  /**
   * Zoom parameter update when the mouse wheel is scrolled.
   */
  ;

  _proto.handleMouseWheel = function handleMouseWheel(event) {
    if (event.deltaY < 0) {
      this.zoomIn(this.getZoomScale());
    } else if (event.deltaY > 0) {
      this.zoomOut(this.getZoomScale());
    }
  }
  /**
   * Pan parameter update when keyboard is pressed.
   */
  ;

  _proto.handleKeyDown = function handleKeyDown(event) {
    switch (event.keyCode) {
      case this.keys.UP:
        this.pan(0, this.keyPanSpeed);
        break;

      case this.keys.BOTTOM:
        this.pan(0, -this.keyPanSpeed);
        break;

      case this.keys.LEFT:
        this.pan(this.keyPanSpeed, 0);
        break;

      case this.keys.RIGHT:
        this.pan(-this.keyPanSpeed, 0);
        break;
    }
  }
  /**
   * Rotation parameter update when touch is dropped.
   */
  ;

  _proto.handleTouchStartRotate = function handleTouchStartRotate(event) {
    this._rotateStart.setValue(event.touches[0].pageX, event.touches[0].pageY);
  }
  /**
   * Zoom parameter update when touch down.
   */
  ;

  _proto.handleTouchStartZoom = function handleTouchStartZoom(event) {
    var dx = event.touches[0].pageX - event.touches[1].pageX;
    var dy = event.touches[0].pageY - event.touches[1].pageY;
    var distance = Math.sqrt(dx * dx + dy * dy);

    this._zoomStart.setValue(0, distance);
  }
  /**
   * Update the translation parameter when touch down.
   */
  ;

  _proto.handleTouchStartPan = function handleTouchStartPan(event) {
    this._panStart.setValue(event.touches[0].pageX, event.touches[0].pageY);
  }
  /**
   * Rotation parameter update when touch to move.
   */
  ;

  _proto.handleTouchMoveRotate = function handleTouchMoveRotate(event) {
    this._rotateEnd.setValue(event.touches[0].pageX, event.touches[0].pageY);

    oasis.Vector2.subtract(this._rotateEnd, this._rotateStart, this._rotateDelta);
    this.rotateLeft(2 * Math.PI * this._rotateDelta.x / this.mainElement.clientWidth * this.rotateSpeed);
    this.rotateUp(2 * Math.PI * this._rotateDelta.y / this.mainElement.clientHeight * this.rotateSpeed);

    this._rotateEnd.cloneTo(this._rotateStart);
  }
  /**
   * Zoom parameter update when touch to move.
   */
  ;

  _proto.handleTouchMoveZoom = function handleTouchMoveZoom(event) {
    var dx = event.touches[0].pageX - event.touches[1].pageX;
    var dy = event.touches[0].pageY - event.touches[1].pageY;
    var distance = Math.sqrt(dx * dx + dy * dy);

    this._zoomEnd.setValue(0, distance);

    oasis.Vector2.subtract(this._zoomEnd, this._zoomStart, this._zoomDelta);

    if (this._zoomDelta.y > 0) {
      this.zoomIn(this.getZoomScale());
    } else if (this._zoomDelta.y < 0) {
      this.zoomOut(this.getZoomScale());
    }

    this._zoomEnd.cloneTo(this._zoomStart);
  }
  /**
   * Pan parameter update when touch moves.
   */
  ;

  _proto.handleTouchMovePan = function handleTouchMovePan(event) {
    this._panEnd.setValue(event.touches[0].pageX, event.touches[0].pageY);

    oasis.Vector2.subtract(this._panEnd, this._panStart, this._panDelta);
    this.pan(this._panDelta.x, this._panDelta.y);

    this._panEnd.cloneTo(this._panStart);
  }
  /**
   * Total handling of mouse down events.
   */
  ;

  _proto.onMouseDown = function onMouseDown(event) {
    if (this.enabled === false) return;
    event.preventDefault();
    this._isMouseUp = false;

    switch (event.button) {
      case this.mouseButtons.ORBIT:
        if (this.enableRotate === false) return;
        this.handleMouseDownRotate(event);
        this._state = this.STATE.ROTATE;
        break;

      case this.mouseButtons.ZOOM:
        if (this.enableZoom === false) return;
        this.handleMouseDownZoom(event);
        this._state = this.STATE.ZOOM;
        break;

      case this.mouseButtons.PAN:
        if (this.enablePan === false) return;
        this.handleMouseDownPan(event);
        this._state = this.STATE.PAN;
        break;
    }

    if (this._state !== this.STATE.NONE) {
      var element = this.domElement === oasis.PlatformManager.polyfill.document ? this.domElement.body : this.domElement;
      this.mainElement.addEventListener(this.mouseUpEvents[0].type, this.mouseUpEvents[0].listener, false);
      element.addEventListener(this.mouseUpEvents[1].type, this.mouseUpEvents[1].listener, false);
    }
  }
  /**
   * Total handling of mouse movement events.
   */
  ;

  _proto.onMouseMove = function onMouseMove(event) {
    if (this.enabled === false) return;
    event.preventDefault();

    switch (this._state) {
      case this.STATE.ROTATE:
        if (this.enableRotate === false) return;
        this.handleMouseMoveRotate(event);
        break;

      case this.STATE.ZOOM:
        if (this.enableZoom === false) return;
        this.handleMouseMoveZoom(event);
        break;

      case this.STATE.PAN:
        if (this.enablePan === false) return;
        this.handleMouseMovePan(event);
        break;
    }
  }
  /**
   * Total handling of mouse up events.
   */
  ;

  _proto.onMouseUp = function onMouseUp() {
    var _this3 = this;

    if (this.enabled === false) return;
    this._isMouseUp = true;
    this.mouseUpEvents.forEach(function (ele) {
      var element = _this3.domElement === oasis.PlatformManager.polyfill.document ? _this3.domElement.body : _this3.domElement;
      element.removeEventListener(ele.type, ele.listener, false);

      _this3.mainElement.removeEventListener(ele.type, ele.listener, false);
    });
    this._state = this.STATE.NONE;
  }
  /**
   * Total handling of mouse wheel events.
   */
  ;

  _proto.onMouseWheel = function onMouseWheel(event) {
    if (this.enabled === false || this.enableZoom === false || this._state !== this.STATE.NONE && this._state !== this.STATE.ROTATE) return;
    event.preventDefault();
    event.stopPropagation();
    this.handleMouseWheel(event);
  }
  /**
   * Total handling of keyboard down events.
   */
  ;

  _proto.onKeyDown = function onKeyDown(event) {
    if (this.enabled === false || this.enableKeys === false || this.enablePan === false) return;
    this.handleKeyDown(event);
  }
  /**
   * Total handling of touch start events.
   */
  ;

  _proto.onTouchStart = function onTouchStart(event) {
    if (this.enabled === false) return;
    this._isMouseUp = false;

    switch (event.touches.length) {
      case this.touchFingers.ORBIT:
        if (this.enableRotate === false) return;
        this.handleTouchStartRotate(event);
        this._state = this.STATE.TOUCH_ROTATE;
        break;

      case this.touchFingers.ZOOM:
        if (this.enableZoom === false) return;
        this.handleTouchStartZoom(event);
        this._state = this.STATE.TOUCH_ZOOM;
        break;

      case this.touchFingers.PAN:
        if (this.enablePan === false) return;
        this.handleTouchStartPan(event);
        this._state = this.STATE.TOUCH_PAN;
        break;

      default:
        this._state = this.STATE.NONE;
    }
  }
  /**
   * Total handling of touch movement events.
   */
  ;

  _proto.onTouchMove = function onTouchMove(event) {
    if (this.enabled === false) return;
    event.preventDefault();
    event.stopPropagation();

    switch (event.touches.length) {
      case this.touchFingers.ORBIT:
        if (this.enableRotate === false) return;
        if (this._state !== this.STATE.TOUCH_ROTATE) return;
        this.handleTouchMoveRotate(event);
        break;

      case this.touchFingers.ZOOM:
        if (this.enableZoom === false) return;
        if (this._state !== this.STATE.TOUCH_ZOOM) return;
        this.handleTouchMoveZoom(event);
        break;

      case this.touchFingers.PAN:
        if (this.enablePan === false) return;
        if (this._state !== this.STATE.TOUCH_PAN) return;
        this.handleTouchMovePan(event);
        break;

      default:
        this._state = this.STATE.NONE;
    }
  }
  /**
   * Total handling of touch end events.
   */
  ;

  _proto.onTouchEnd = function onTouchEnd() {
    if (this.enabled === false) return;
    this._isMouseUp = true;
    this._state = this.STATE.NONE;
  }
  /**
   * Context event hiding.
   */
  ;

  _proto.onContextMenu = function onContextMenu(event) {
    if (this.enabled === false) return;
    event.preventDefault();
  };

  return OrbitControl;
}(oasis.Script);

function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
Page({
  disposing: false,
  platform: null ,
  engine: null ,

  onReady() {
    wx.createSelectorQuery()
      .select('#gl')
      .node()
      .exec(res => {
        const canvas = res[0].node;

        this.platform = new WechatPlatform(canvas);
        console.log(this.platform);
        oasis.PlatformManager.set(this.platform);

        const engine = new oasis.WebGLEngine(canvas);
        engine.canvas.resizeByClientSize();

        const rootEntity = engine.sceneManager.activeScene.createRootEntity();

        const cameraEntity = rootEntity.createChild('camera');
        cameraEntity.addComponent(oasis.Camera);
        cameraEntity.transform.setPosition(3, 3, 3);
        cameraEntity.addComponent(OrbitControl);

        engine.sceneManager.activeScene.ambientLight.diffuseSolidColor.setValue(1, 1, 1, 1);

        engine.resourceManager
          .load(
            'https://gw.alipayobjects.com/os/OasisHub/267000040/9994/%25E5%25BD%2592%25E6%25A1%25A3.gltf',
          )
          .then(gltf => {
            rootEntity.addChild(gltf.defaultSceneRoot);
          });

        engine.run();
        this.engine = engine;
      });
  },

  onUnload() {
    this.disposing = true;
    oasis.PlatformManager.dispose();
    _optionalChain([this, 'access', _ => _.engine, 'optionalAccess', _2 => _2.destroy, 'call', _3 => _3()]);
  },

  onTX(e) {
    this.platform.dispatchTouchEvent(e);
  },
});
