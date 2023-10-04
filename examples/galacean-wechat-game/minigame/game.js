'use strict';

var galacean = require('./chunks/galacean.js');

function _classCallCheck$7(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var Platform = function Platform() {
    _classCallCheck$7(this, Platform);
};

function _classCallCheck$6(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var $Blob = function $Blob(parts) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
        type: "image/jpeg"
    };
    _classCallCheck$6(this, $Blob);
    this.parts = parts;
    this.options = options;
    // 安卓微信不支持image/jpg的解析, 需改为image/jpeg
    options.type = options.type.replace("jpg", "jpeg");
};

/*
 * base64-arraybuffer
 * https://github.com/niklasvh/base64-arraybuffer
 *
 * Copyright (c) 2012 Niklas von Hertzen
 * Licensed under the MIT license.
 */ var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
// Use a lookup table to find the index.
var lookup = new Uint8Array(256);
for(var i = 0; i < chars.length; i++){
    lookup[chars.charCodeAt(i)] = i;
}
// 快一点
function encode(arrayBuffer) {
    var base64 = "";
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
        base64 += chars[a] + chars[b] + "==";
    } else if (byteRemainder == 2) {
        chunk = bytes[mainLength] << 8 | bytes[mainLength + 1];
        a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
        b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4
        // Set the 2 least significant bits to zero
        c = (chunk & 15) << 2; // 15    = 2^4 - 1
        base64 += chars[a] + chars[b] + chars[c] + "=";
    }
    return base64;
}

function _classCallCheck$5(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _instanceof$2(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
var $URL = /*#__PURE__*/ function() {
    function $URL() {
        _classCallCheck$5(this, $URL);
    }
    var _proto = $URL.prototype;
    _proto.createObjectURL = function createObjectURL(obj) {
        if (_instanceof$2(obj, $Blob)) {
            // 更好的方式，使用wx.fileSystemManager写入临时文件来获取url，但是需要手动管理临时文件
            var base64 = encode(obj.parts[0]);
            var url = "data:".concat(obj.options.type, ";base64,").concat(base64);
            return url;
        }
        return "";
    };
    _proto.revokeObjectURL = function revokeObjectURL() {};
    return $URL;
}();

/**
 * A lookup table for atob(), which converts an ASCII character to the
 * corresponding six-bit number.
 */ var keystr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
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
    data = data.replace(/[ \t\n\f\r]/g, "");
    // "If data's length divides by 4 leaving no remainder, then: if data ends
    // with one or two U+003D (=) code points, then remove them from data."
    if (data.length % 4 === 0) {
        data = data.replace(/==?$/, "");
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
        return "";
    }
    // "Let output be an empty byte sequence."
    var output = "";
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
    } else if (accumulatedBits === 18) {
        buffer >>= 2;
        output += String.fromCharCode((buffer & 0xff00) >> 8);
        output += String.fromCharCode(buffer & 0xff);
    }
    // "Return output."
    return output;
}

function _classCallCheck$4(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var _events = new WeakMap();
var Touch = function Touch(touch) {
    _classCallCheck$4(this, Touch);
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
        _classCallCheck$4(this, $EventTarget);
        _events.set(this, {});
    }
    var _proto = $EventTarget.prototype;
    _proto.addEventListener = function addEventListener(type, listener) {
        var events = _events.get(this);
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
    };
    _proto.removeEventListener = function removeEventListener(type, listener) {
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
    };
    _proto.dispatchEvent = function dispatchEvent() {
        var event = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
            type: ""
        };
        if (typeof event.preventDefault !== "function") {
            event.preventDefault = function() {};
        }
        if (typeof event.stopPropagation !== "function") {
            event.stopPropagation = function() {};
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
        if (typeof this["on".concat(event.type)] === "function") {
            // @ts-ignore
            this["on".concat(event.type)].call(this, event);
        }
    };
    _proto.releasePointerCapture = function releasePointerCapture() {};
    _proto.setPointerCapture = function setPointerCapture() {};
    return $EventTarget;
}();

function copyProperties(target, source) {
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = Object.getOwnPropertyNames(source)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var key = _step.value;
            if (key !== "constructor" && key !== "prototype" && key !== "name") {
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
function createImage$1(canvas) {
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
 * Module dependencies.
 */ /**
 * Expose `parse`.
 */ /**
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
            root: tag(),
            isXML: true
        };
    };
    var declaration = /**
   * Declaration.
   */ function declaration() {
        var m = match(/^<\?xml\s*/);
        if (!m) return;
        // tag
        var node = {
            attributes: {},
            children: []
        };
        // attributes
        while(!(eos() || is("?>"))){
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
        return "";
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
        return val.replace(/^['"]|['"]$/g, "");
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
    xml = xml.replace(/<!--[\s\S]*?-->/g, "");
    return document();
    /**
   * Tag.
   */ function tag() {
        var m = match(/^<([\w-:.]+)\s*/);
        if (!m) return;
        // name
        var node = {
            name: m[1],
            attributes: {},
            children: []
        };
        // attributes
        while(!(eos() || is(">") || is("?>") || is("/>"))){
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

function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
function _classCallCheck$3(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
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
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function walkTree(node, processer) {
    processer(node);
    node.children.forEach(function(i) {
        return walkTree(i, processer);
    });
}
var $DOMParser = /*#__PURE__*/ function() {
    function $DOMParser() {
        _classCallCheck$3(this, $DOMParser);
    }
    var _proto = $DOMParser.prototype;
    _proto.parseFromString = function parseFromString(str) {
        var xml = parse(str);
        var nodeBase = {
            // @ts-ignore
            hasAttribute: function hasAttribute(key) {
                // @ts-ignore
                return this.attributes[key] !== undefined;
            },
            // @ts-ignore
            getAttribute: function getAttribute(key) {
                // @ts-ignore
                return this.attributes[key];
            },
            getElementsByTagName: function getElementsByTagName(tag) {
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
            node.style = new Proxy((node.attributes.style || "").split(";").reduce(function(acc, curr) {
                if (curr) {
                    var ref = _slicedToArray(curr.split(":"), 2), key = ref[0], value = ref[1];
                    acc[key.trim()] = value.trim();
                }
                return acc;
            }, {}), {
                get: function get(target, key) {
                    return target[key] || "";
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
    };
    return $DOMParser;
}();

function _classCallCheck$2(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _instanceof$1(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
var $TextDecoder = /*#__PURE__*/ function() {
    function $TextDecoder() {
        _classCallCheck$2(this, $TextDecoder);
    }
    var _proto = $TextDecoder.prototype;
    /**
   * 不支持 UTF-8 code points 大于 1 字节
   * @see https://stackoverflow.com/questions/17191945/conversion-between-utf-8-arraybuffer-and-string
   * @param {Uint8Array|ArrayBuffer} uint8Array
   */ _proto.decode = function decode(input) {
        var uint8Array = _instanceof$1(input, ArrayBuffer) ? new Uint8Array(input) : input;
        // from threejs LoaderUtils.js
        var s = "";
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
    };
    return $TextDecoder;
}();

// @ts-nocheck
function _assertThisInitialized$1(self) {
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
function isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Date.prototype.toString.call(Reflect.construct(Date, [], function() {}));
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
            if (Class) _setPrototypeOf$1(instance, Class.prototype);
            return instance;
        };
    }
    return _construct.apply(null, arguments);
}
function _getPrototypeOf$1(o) {
    _getPrototypeOf$1 = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf$1(o);
}
function _inherits$3(subClass, superClass) {
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
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
}
function _possibleConstructorReturn$1(self, call) {
    if (call && (_typeof$1(call) === "object" || typeof call === "function")) {
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
var _typeof$1 = function(obj) {
    "@swc/helpers - typeof";
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
            return _construct(Class, arguments, _getPrototypeOf$1(this).constructor);
        }
        Wrapper.prototype = Object.create(Class.prototype, {
            constructor: {
                value: Wrapper,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        return _setPrototypeOf$1(Wrapper, Class);
    };
    return _wrapNativeSuper(Class);
}
function _isNativeReflectConstruct$1() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
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
var _requestHeader = new WeakMap();
var _responseHeader = new WeakMap();
var _requestTask = new WeakMap();
function _triggerEvent(type) {
    var event = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    event.target = event.target || this;
    if (typeof this["on".concat(type)] === "function") {
        this["on".concat(type)].call(this, event);
    }
}
function _changeReadyState(readyState) {
    var event = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    this.readyState = readyState;
    event.readyState = readyState;
    _triggerEvent.call(this, "readystatechange", event);
}
function _isRelativePath(url) {
    return !/^(http|https|ftp|wxfile):\/\/.*/i.test(url);
}
var $XMLHttpRequest = /*#__PURE__*/ function(EventTarget) {
    _inherits$3($XMLHttpRequest, EventTarget);
    var _super = _createSuper$1($XMLHttpRequest);
    function $XMLHttpRequest() {
        _classCallCheck$1(this, $XMLHttpRequest);
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
        _this.responseType = "text";
        _this.dataType = "string";
        _this.responseXML = null;
        _this.status = 0;
        _this.statusText = "";
        _this.upload = {};
        _this.withCredentials = false;
        _requestHeader.set(_assertThisInitialized$1(_this), {
            "content-type": "application/x-www-form-urlencoded"
        });
        _responseHeader.set(_assertThisInitialized$1(_this), {});
        return _this;
    }
    var _proto = $XMLHttpRequest.prototype;
    _proto.abort = function abort() {
        var myRequestTask = _requestTask.get(this);
        if (myRequestTask) {
            myRequestTask.abort();
        }
    };
    _proto.getAllResponseHeaders = function getAllResponseHeaders() {
        var responseHeader = _responseHeader.get(this);
        return Object.keys(responseHeader).map(function(header) {
            return "".concat(header, ": ").concat(responseHeader[header]);
        }).join("\n");
    };
    _proto.getResponseHeader = function getResponseHeader(header) {
        return _responseHeader.get(this)[header];
    };
    _proto.open = function open(method, url /* async, user, password 这几个参数在小程序内不支持*/ ) {
        this._method = method;
        this._url = url;
        _changeReadyState.call(this, $XMLHttpRequest.OPENED);
    };
    _proto.overrideMimeType = function overrideMimeType() {};
    _proto.send = function send() {
        var data = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
        var _this = this;
        if (this.readyState !== $XMLHttpRequest.OPENED) {
            throw new Error("Failed to execute 'send' on 'XMLHttpRequest': The object's state must be OPENED.");
        } else {
            var url = this._url;
            var header = _requestHeader.get(this);
            var responseType = this.responseType;
            var dataType = this.dataType;
            var relative = _isRelativePath(url);
            var encoding;
            if (responseType === "arraybuffer") ; else {
                encoding = "utf8";
            }
            if (responseType === "json") {
                dataType = "json";
                responseType = "text";
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
                if (typeof data !== "string" && !_instanceof(data, ArrayBuffer) && dataType !== "json") {
                    try {
                        data = JSON.stringify(data);
                    } catch (e) {}
                }
                _this.status = statusCode;
                if (header) {
                    _responseHeader.set(_this, header);
                }
                _triggerEvent.call(_this, "loadstart");
                _changeReadyState.call(_this, $XMLHttpRequest.HEADERS_RECEIVED);
                _changeReadyState.call(_this, $XMLHttpRequest.LOADING);
                _this.response = data;
                if (_instanceof(data, ArrayBuffer)) {
                    Object.defineProperty(_this, "responseText", {
                        enumerable: true,
                        configurable: true,
                        get: function get() {
                            throw "InvalidStateError : responseType is " + this.responseType;
                        }
                    });
                } else {
                    _this.responseText = data;
                }
                _changeReadyState.call(_this, $XMLHttpRequest.DONE);
                _triggerEvent.call(_this, "load");
                _triggerEvent.call(_this, "loadend");
            };
            var onFail = function(param) {
                var errMsg = param.errMsg;
                // TODO 规范错误
                if (resolved) return;
                resolved = true;
                if (errMsg.indexOf("abort") !== -1) {
                    _triggerEvent.call(_this, "abort");
                } else {
                    _triggerEvent.call(_this, "error", {
                        message: errMsg
                    });
                }
                _triggerEvent.call(_this, "loadend");
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
                    options["encoding"] = encoding;
                }
                fs.readFile(options);
                return;
            }
            // IOS在某些情况下不会触发onSuccess...
            var usePatch = responseType === "arraybuffer" && this.runtime === "ios" && $XMLHttpRequest.useFetchPatch;
            wx.request({
                data: data,
                url: url,
                method: this._method.toUpperCase(),
                header: header,
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
                        data: data,
                        url: url,
                        method: this._method,
                        header: header,
                        dataType: dataType,
                        responseType: responseType,
                        enableCache: true,
                        success: onSuccess,
                        fail: onFail
                    });
                }, $XMLHttpRequest.fetchPatchDelay);
            }
        }
    };
    _proto.setRequestHeader = function setRequestHeader(header, value) {
        var myHeader = _requestHeader.get(this);
        myHeader[header] = value;
        _requestHeader.set(this, myHeader);
    };
    _proto.addEventListener = function addEventListener(type, listener) {
        var _this = this;
        if (typeof listener !== "function") {
            return;
        }
        this["on" + type] = function() {
            var event = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
            event.target = event.target || _this;
            listener.call(_this, event);
        };
    };
    _proto.removeEventListener = function removeEventListener(type, listener) {
        if (this["on" + type] === listener) {
            this["on" + type] = null;
        }
    };
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

/// <reference types="minigame-api-typings" />
/// <reference types="@types/offscreencanvas" />
function _assertThisInitialized(self) {
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
function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
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
    if (superClass) _setPrototypeOf(subClass, superClass);
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
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
function ownKeys$1(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _objectSpreadProps(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys$1(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
        return call;
    }
    return _assertThisInitialized(self);
}
function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _setPrototypeOf(o, p);
}
var _typeof = function(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
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
var wxGame$1 = wx;
function OffscreenCanvas$1() {
    // @ts-ignore
    return wxGame$1.createOffscreenCanvas();
}
var WechatGamePlatform$1 = /*#__PURE__*/ function(Platform) {
    _inherits$2(WechatGamePlatform, Platform);
    var _super = _createSuper(WechatGamePlatform);
    function WechatGamePlatform(canvas, width, height) {
        _classCallCheck(this, WechatGamePlatform);
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
        var systemInfo = wxGame$1.getSystemInfoSync();
        var isAndroid = systemInfo.platform === "android";
        // @ts-ignore
        _this.canvas = canvas;
        _this.canvasW = width === undefined ? canvas.width : width;
        _this.canvasH = height === undefined ? canvas.height : height;
        _this.canvasRect.width = _this.canvasW;
        _this.canvasRect.height = _this.canvasH;
        var document = {
            createElementNS: function createElementNS(_, type) {
                if (type === "canvas") return canvas;
                if (type === "img") return createImage$1(wxGame$1);
            },
            createElement: function createElement(type) {
                if (type === "canvas") return canvas;
                if (type === "img") return createImage$1(wxGame$1);
            }
        };
        var Image = function() {
            return createImage$1(wxGame$1);
        };
        var URL = new $URL();
        var window = {
            innerWidth: systemInfo.windowWidth,
            innerHeight: systemInfo.windowHeight,
            devicePixelRatio: systemInfo.pixelRatio,
            AudioContext: function AudioContext() {},
            requestAnimationFrame: requestAnimationFrame,
            cancelAnimationFrame: cancelAnimationFrame,
            DeviceOrientationEvent: {
                requestPermission: function requestPermission() {
                    return Promise.resolve("granted");
                }
            },
            URL: URL,
            Image: Image,
            DOMParser: $DOMParser,
            TextDecoder: $TextDecoder,
            performance: Date
        };
        [
            canvas,
            document,
            window
        ].forEach(function(i) {
            // @ts-ignore
            var old = i.__proto__;
            // @ts-ignore
            i.__proto__ = {};
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
            OffscreenCanvas: OffscreenCanvas$1,
            // @ts-expect-error
            URL: URL,
            Image: Image,
            // @ts-expect-error
            performance: Date,
            atob: atob,
            global: window,
            createImageBitmap: undefined,
            cancelAnimationFrame: window.cancelAnimationFrame,
            requestAnimationFrame: window.requestAnimationFrame
        };
        _this.patchCanvas();
        _this.onDeviceMotionChange = function(e) {
            e.type = "deviceorientation";
            if (isAndroid) {
                e.alpha *= -1;
                e.beta *= -1;
                e.gamma *= -1;
            }
            window.dispatchEvent(e);
        };
        var dispatchEvent = function(e) {
            return _this.dispatchTouchEvent(e);
        };
        if (systemInfo.platform != "devtools" || WechatGamePlatform.DEVTOOLS_USE_NATIVE_EVENT) {
            wxGame$1.onTouchMove(dispatchEvent);
            wxGame$1.onTouchStart(dispatchEvent);
            wxGame$1.onTouchEnd(dispatchEvent);
        }
        return _this;
    }
    var _proto = WechatGamePlatform.prototype;
    _proto.patchCanvas = function patchCanvas() {
        var _this = this;
        var ref = this, canvasH = ref.canvasH, canvasW = ref.canvasW, canvas = ref.canvas;
        Object.defineProperty(canvas, "style", {
            get: function get() {
                return {
                    width: this.width + "px",
                    height: this.height + "px"
                };
            }
        });
        Object.defineProperty(canvas, "clientHeight", {
            get: function get() {
                return canvasH || this.height;
            }
        });
        Object.defineProperty(canvas, "clientWidth", {
            get: function get() {
                return canvasW || this.width;
            }
        });
        // @ts-ignore
        canvas.getBoundingClientRect = function() {
            return _this.canvasRect;
        };
    };
    // 某些情况下IOS会不success不触发。。。
    _proto.patchXHR = function patchXHR() {
        $XMLHttpRequest.useFetchPatch = true;
        return this;
    };
    _proto.enableDeviceOrientation = function enableDeviceOrientation(interval) {
        var _this = this;
        return new Promise(function(resolve, reject) {
            wxGame$1.onDeviceMotionChange(_this.onDeviceMotionChange);
            wxGame$1.startDeviceMotionListening({
                interval: interval,
                success: function(e) {
                    resolve(e);
                    _this.enabledDeviceMotion = true;
                },
                fail: reject
            });
        });
    };
    _proto.disableDeviceOrientation = function disableDeviceOrientation() {
        var _this = this;
        return new Promise(function(resolve, reject) {
            wxGame$1.offDeviceMotionChange(_this.onDeviceMotionChange);
            _this.enabledDeviceMotion && wxGame$1.stopDeviceMotionListening({
                success: function() {
                    resolve(true);
                    _this.enabledDeviceMotion = false;
                },
                fail: reject
            });
        });
    };
    _proto.dispatchTouchEvent = function dispatchTouchEvent() {
        var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
            touches: [],
            changedTouches: [],
            timeStamp: 0,
            type: ""
        };
        var target = _objectSpread({}, this);
        // 微信小程序type会多on
        var type = e.type.replace("on", "");
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
            type: type,
            cancelBubble: false,
            cancelable: false
        };
        this.canvas.dispatchEvent(event);
        if (changedTouches.length) {
            var touch = changedTouches[0];
            var pointerEvent = {
                clientX: touch.clientX,
                clientY: touch.clientY,
                pageX: touch.pageX,
                pageY: touch.pageY,
                offsetX: touch.pageX,
                offsetY: touch.pageY,
                pointerId: touch.identifier,
                // to fix oasis controls https://www.w3.org/TR/uievents/#dom-mouseevent-buttons
                buttons: 1,
                type: {
                    touchstart: "pointerdown",
                    touchmove: "pointermove",
                    touchend: "pointerup"
                }[type] || "",
                pointerType: "touch"
            };
            this.canvas.dispatchEvent(pointerEvent);
            if (type === "touchend") this.canvas.dispatchEvent(_objectSpreadProps(_objectSpread({}, pointerEvent), {
                type: "pointerout"
            }));
        }
    };
    _proto.dispose = function dispose() {
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
    };
    return WechatGamePlatform;
}(Platform);
WechatGamePlatform$1.DEVTOOLS_USE_NATIVE_EVENT = true;

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
function createVideo(module) {
    var video = module.createVideo();
    video.addEventListener = function(name, cb) {
        return video["on".concat(name)] = cb.bind(video);
    };
    video.removeEventListener = function(name) {
        return video["on".concat(name)] = null;
    };
    return video;
}

function _class_call_check$1(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
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
function _create_class$1(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties$1(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties$1(Constructor, staticProps);
    return Constructor;
}
function _define_property$1(obj, key, value) {
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
var $FontFaceSet = /*#__PURE__*/ function() {
    function $FontFaceSet() {
        _class_call_check$1(this, $FontFaceSet);
        _define_property$1(this, "fontfaces", void 0);
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/FontFaceSet/loading_event) */ _define_property$1(this, "onloading", void 0);
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/FontFaceSet/loadingdone_event) */ _define_property$1(this, "onloadingdone", void 0);
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/FontFaceSet/loadingerror_event) */ _define_property$1(this, "onloadingerror", void 0);
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/FontFaceSet/ready) */ _define_property$1(this, "ready", void 0);
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/FontFaceSet/status) */ _define_property$1(this, "status", void 0);
        this.fontfaces = {};
    }
    _create_class$1($FontFaceSet, [
        {
            key: "getHashCode",
            value: function getHashCode(font) {
                return font.weight + " " + font.family;
            }
        },
        {
            key: "add",
            value: function add(font) {
                this.fontfaces[this.getHashCode(font)] = font;
            }
        },
        {
            key: "delete",
            value: function _delete(font) {
                delete this.fontfaces[this.getHashCode(font)];
            }
        },
        {
            key: "check",
            value: function check() {
                for(var key in this.fontfaces){
                    if (!this.fontfaces[key].loaded) return false;
                }
                return true;
            }
        }
    ]);
    return $FontFaceSet;
}();

/// <reference types="minigame-api-typings" />
/// <reference types="@types/offscreencanvas" />
function _assert_this_initialized$1(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
}
function _class_call_check(instance, Constructor) {
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
function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _define_property(obj, key, value) {
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
function _get_prototype_of(o) {
    _get_prototype_of = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _get_prototype_of(o);
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
    if (superClass) _set_prototype_of$1(subClass, superClass);
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _possible_constructor_return(self, call) {
    if (call && (_type_of(call) === "object" || typeof call === "function")) {
        return call;
    }
    return _assert_this_initialized$1(self);
}
function _set_prototype_of$1(o, p) {
    _set_prototype_of$1 = Object.setPrototypeOf || function setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _set_prototype_of$1(o, p);
}
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
function _is_native_reflect_construct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
        return true;
    } catch (e) {
        return false;
    }
}
function _create_super(Derived) {
    var hasNativeReflectConstruct = _is_native_reflect_construct();
    return function _createSuperInternal() {
        var Super = _get_prototype_of(Derived), result;
        if (hasNativeReflectConstruct) {
            var NewTarget = _get_prototype_of(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else {
            result = Super.apply(this, arguments);
        }
        return _possible_constructor_return(this, result);
    };
}
var wxGame = wx;
// 微信小游戏创建离屏画布接口变成了createOffScreenCanvas
function OffscreenCanvas() {
    // @ts-ignore
    if (wxGame.createOffscreenCanvas === undefined) {
        return wxGame.createOffScreenCanvas();
    } else {
        return wxGame.createOffscreenCanvas();
    }
}
var WechatGamePlatform = /*#__PURE__*/ function(WechatGamePlatformBase1) {
    _inherits$1(WechatGamePlatform, WechatGamePlatformBase1);
    var _super = _create_super(WechatGamePlatform);
    function WechatGamePlatform(canvas, width, height) {
        _class_call_check(this, WechatGamePlatform);
        var _this;
        _this = _super.call(this, canvas, width, height);
        _define_property(_assert_this_initialized$1(_this), "fonts", void 0);
        _this.polyfill.document["createElement"] = function(type) {
            if (type === "canvas") return canvas;
            if (type === "img") return createImage(wxGame);
            if (type === "video") return createVideo(wxGame);
        };
        _this.fonts = new $FontFaceSet();
        _this.polyfill.document["fonts"] = _this.fonts;
        _this.polyfill.window["Blob"] = $Blob;
        _this.polyfill.Blob = _this.polyfill.window["Blob"];
        _this.polyfill.OffscreenCanvas = OffscreenCanvas;
        _this.polyfill.$defaultWebGLExtensions = {
            OES_vertex_array_object: null
        };
        _this.polyfill.HTMLCanvasElement = canvas.constructor;
        canvas.focus = function() {};
        return _this;
    }
    _create_class(WechatGamePlatform, [
        {
            key: "dispatchTouchEvent",
            value: function dispatchTouchEvent() {
                var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
                    touches: [],
                    changedTouches: [],
                    timeStamp: 0,
                    type: ""
                };
                var target = _object_spread({}, this);
                // 微信小程序type会多on
                var type = e.type.replace("on", "");
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
                    type: type,
                    cancelBubble: false,
                    cancelable: false
                };
                this.canvas.dispatchEvent(event);
                if (changedTouches.length) {
                    var touch = changedTouches[0];
                    var pointerEvent = {
                        clientX: touch.clientX,
                        clientY: touch.clientY,
                        pageX: touch.pageX,
                        pageY: touch.pageY,
                        offsetX: touch.pageX,
                        offsetY: touch.pageY,
                        pointerId: touch.identifier,
                        // to fix oasis controls https://www.w3.org/TR/uievents/#dom-mouseevent-buttons
                        buttons: 1,
                        type: {
                            touchstart: "pointerdown",
                            touchmove: "pointermove",
                            touchend: "pointerup",
                            touchcancel: "pointercancel"
                        }[type] || "",
                        pointerType: "touch"
                    };
                    this.canvas.dispatchEvent(pointerEvent);
                    // call pointerleave if touchend after pointerup.
                    if (type === "touchend") {
                        this.canvas.dispatchEvent(_object_spread_props(_object_spread({}, pointerEvent), {
                            type: "pointerleave"
                        }));
                    }
                }
            }
        }
    ]);
    return WechatGamePlatform;
}(WechatGamePlatform$1);

function _set_prototype_of(o, p) {
    _set_prototype_of = Object.setPrototypeOf || function setPrototypeOf(o, p) {
        o.__proto__ = p;

        return o;
    };

    return _set_prototype_of(o, p);
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });

    if (superClass) _set_prototype_of(subClass, superClass);
}

var ControlHandlerType;
(function(ControlHandlerType) {
    ControlHandlerType[ControlHandlerType["None"] = 0] = "None";
    ControlHandlerType[ControlHandlerType["ROTATE"] = 1] = "ROTATE";
    ControlHandlerType[ControlHandlerType["ZOOM"] = 2] = "ZOOM";
    ControlHandlerType[ControlHandlerType["PAN"] = 4] = "PAN";
    ControlHandlerType[ControlHandlerType["All"] = 7] = "All";
})(ControlHandlerType || (ControlHandlerType = {}));

/**
 *  Static interface implement decorator.
 *  https://stackoverflow.com/questions/13955157/how-to-define-static-property-in-typescript-interface
 */ function StaticInterfaceImplement() {
    return function(constructor) {
    };
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

var ControlFreeKeyboard = /*#__PURE__*/ function() {
    function ControlFreeKeyboard() {}
    ControlFreeKeyboard.onUpdateHandler = function onUpdateHandler(input) {
        if (input.isKeyHeldDown(galacean.Keys.ArrowLeft) || input.isKeyHeldDown(galacean.Keys.KeyA) || input.isKeyHeldDown(galacean.Keys.ArrowUp) || input.isKeyHeldDown(galacean.Keys.KeyW) || input.isKeyHeldDown(galacean.Keys.ArrowDown) || input.isKeyHeldDown(galacean.Keys.KeyS) || input.isKeyHeldDown(galacean.Keys.ArrowRight) || input.isKeyHeldDown(galacean.Keys.KeyD)) {
            return ControlHandlerType.PAN;
        } else {
            return ControlHandlerType.None;
        }
    };
    ControlFreeKeyboard.onUpdateDelta = function onUpdateDelta(control, outDelta) {
        var movementSpeed = control.movementSpeed, input = control.input;
        outDelta.x = outDelta.y = outDelta.z = 0;
        if (input.isKeyHeldDown(galacean.Keys.ArrowLeft) || input.isKeyHeldDown(galacean.Keys.KeyA)) {
            outDelta.x -= movementSpeed;
        }
        if (input.isKeyHeldDown(galacean.Keys.ArrowRight) || input.isKeyHeldDown(galacean.Keys.KeyD)) {
            outDelta.x += movementSpeed;
        }
        if (input.isKeyHeldDown(galacean.Keys.ArrowUp) || input.isKeyHeldDown(galacean.Keys.KeyW)) {
            outDelta.z -= movementSpeed;
        }
        if (input.isKeyHeldDown(galacean.Keys.ArrowDown) || input.isKeyHeldDown(galacean.Keys.KeyS)) {
            outDelta.z += movementSpeed;
        }
    };
    return ControlFreeKeyboard;
}();
ControlFreeKeyboard = __decorate([
    StaticInterfaceImplement()
], ControlFreeKeyboard);

var _ControlFreePointer;
var DeltaType$1;
(function(DeltaType) {
    DeltaType[DeltaType["Moving"] = 0] = "Moving";
    DeltaType[DeltaType["Distance"] = 1] = "Distance";
    DeltaType[DeltaType["None"] = 2] = "None";
})(DeltaType$1 || (DeltaType$1 = {}));
var ControlFreePointer = (_ControlFreePointer = /*#__PURE__*/ function() {
    function ControlFreePointer() {}
    ControlFreePointer.onUpdateHandler = function onUpdateHandler(input) {
        ++this._frameIndex;
        if (input.pointers.length === 1) {
            if (input.isPointerHeldDown(galacean.PointerButton.Primary)) {
                this._updateType(ControlHandlerType.ROTATE, 0);
            } else {
                var deltaPosition = input.pointers[0].deltaPosition;
                if ((deltaPosition.x !== 0 || deltaPosition.y !== 0) && input.isPointerUp(galacean.PointerButton.Primary)) {
                    this._updateType(ControlHandlerType.ROTATE, 0);
                } else {
                    this._updateType(ControlHandlerType.None, 2);
                }
            }
        } else {
            this._updateType(ControlHandlerType.None, 2);
        }
        return this._handlerType;
    };
    ControlFreePointer.onUpdateDelta = function onUpdateDelta(control, outDelta) {
        var _this = this, frameIndex = _this._frameIndex;
        switch(this._deltaType){
            case 0:
                if (this._lastUsefulFrameIndex === frameIndex - 1) {
                    var deltaPosition = control.input.pointers[0].deltaPosition;
                    outDelta.x = deltaPosition.x;
                    outDelta.y = deltaPosition.y;
                } else {
                    outDelta.x = 0;
                    outDelta.y = 0;
                }
                break;
        }
        this._lastUsefulFrameIndex = frameIndex;
    };
    ControlFreePointer._updateType = function _updateType(handlerType, deltaType) {
        if (this._handlerType !== handlerType || this._deltaType !== deltaType) {
            this._handlerType = handlerType;
            this._deltaType = deltaType;
            this._lastUsefulFrameIndex = -1;
        }
    };
    return ControlFreePointer;
}(), function() {
    _ControlFreePointer._deltaType = 0;
}(), function() {
    _ControlFreePointer._handlerType = ControlHandlerType.None;
}(), function() {
    _ControlFreePointer._frameIndex = 0;
}(), function() {
    _ControlFreePointer._lastUsefulFrameIndex = -1;
}(), _ControlFreePointer);
ControlFreePointer = __decorate([
    StaticInterfaceImplement()
], ControlFreePointer);

// Prevent gimbal lock.
var ESP = galacean.MathUtil.zeroTolerance;
// Spherical.
var Spherical = /*#__PURE__*/ function() {
    function Spherical(radius, phi, theta) {
        this.radius = radius;
        this.phi = phi;
        this.theta = theta;
        this._matrix = new galacean.Matrix();
        this._matrixInv = new galacean.Matrix();
        this.radius = radius !== undefined ? radius : 1.0;
        this.phi = phi !== undefined ? phi : 0;
        this.theta = theta !== undefined ? theta : 0;
    }
    var _proto = Spherical.prototype;
    _proto.makeSafe = function makeSafe() {
        var count = Math.floor(this.phi / Math.PI);
        this.phi = galacean.MathUtil.clamp(this.phi, count * Math.PI + ESP, (count + 1) * Math.PI - ESP);
        return this;
    };
    _proto.set = function set(radius, phi, theta) {
        this.radius = radius;
        this.phi = phi;
        this.theta = theta;
        return this;
    };
    _proto.setYAxis = function setYAxis(up) {
        var xAxis = Spherical._xAxis, yAxis = Spherical._yAxis, zAxis = Spherical._zAxis;
        if (galacean.Vector3.equals(xAxis.set(1, 0, 0), yAxis.copyFrom(up).normalize())) {
            xAxis.set(0, 1, 0);
        }
        galacean.Vector3.cross(xAxis, yAxis, zAxis);
        zAxis.normalize();
        galacean.Vector3.cross(yAxis, zAxis, xAxis);
        var _this__matrix = this._matrix, es = _this__matrix.elements;
        es[0] = xAxis.x, es[1] = xAxis.y, es[2] = xAxis.z;
        es[4] = yAxis.x, es[5] = yAxis.y, es[6] = yAxis.z;
        es[8] = zAxis.x, es[9] = zAxis.y, es[10] = zAxis.z;
        var _this__matrixInv = this._matrixInv, eInv = _this__matrixInv.elements;
        eInv[0] = xAxis.x, eInv[4] = xAxis.y, eInv[8] = xAxis.z;
        eInv[1] = yAxis.x, eInv[5] = yAxis.y, eInv[9] = yAxis.z;
        eInv[2] = zAxis.x, eInv[6] = zAxis.y, eInv[10] = zAxis.z;
    };
    _proto.setFromVec3 = function setFromVec3(value, atTheBack) {
        if (atTheBack === void 0) atTheBack = false;
        value.transformNormal(this._matrixInv);
        this.radius = value.length();
        if (this.radius === 0) {
            this.theta = 0;
            this.phi = 0;
        } else {
            if (atTheBack) {
                this.phi = 2 * Math.PI - Math.acos(galacean.MathUtil.clamp(value.y / this.radius, -1, 1));
                this.theta = Math.atan2(-value.x, -value.z);
            } else {
                this.phi = Math.acos(galacean.MathUtil.clamp(value.y / this.radius, -1, 1));
                this.theta = Math.atan2(value.x, value.z);
            }
        }
        return this;
    };
    _proto.setToVec3 = function setToVec3(value) {
        var _this = this, radius = _this.radius, phi = _this.phi, theta = _this.theta;
        var sinPhiRadius = Math.sin(phi) * radius;
        this.phi -= Math.floor(this.phi / Math.PI / 2) * Math.PI * 2;
        value.set(sinPhiRadius * Math.sin(theta), radius * Math.cos(phi), sinPhiRadius * Math.cos(theta));
        value.transformNormal(this._matrix);
        return this.phi > Math.PI;
    };
    return Spherical;
}();
(function() {
    Spherical._xAxis = new galacean.Vector3();
})();
(function() {
    Spherical._yAxis = new galacean.Vector3();
})();
(function() {
    Spherical._zAxis = new galacean.Vector3();
})();

function _assert_this_initialized(self) {
    if (self === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");

    return self;
}

/**
 * The camera's roaming controller, can move up and down, left and right, and rotate the viewing angle.
 */ var FreeControl = /*#__PURE__*/ function(Script) {
    _inherits(FreeControl, Script);
    function FreeControl(entity) {
        var _this;
        _this = Script.call(this, entity) || this;
        _this.inputDevices = [
            ControlFreeKeyboard,
            ControlFreePointer
        ];
        /** Movement distance per second, the unit is the unit before MVP conversion. */ _this.movementSpeed = 1.0;
        /** Rotate speed. */ _this.rotateSpeed = 1.0;
        /** Simulate a ground. */ _this.floorMock = true;
        /** Simulated ground height. */ _this.floorY = 0;
        _this._spherical = new Spherical();
        _this._tempVec = new galacean.Vector3();
        _this._atTheBack = false;
        _this._topVec = new galacean.Vector3(0, 1, 0);
        _this._bottomVec = new galacean.Vector3(0, -1, 0);
        _this.input = _this.engine.inputManager;
        var transform = _this._cameraTransform = entity.transform;
        /** Init spherical. */ var _$_assert_this_initialized = _assert_this_initialized(_this), tempVec = _$_assert_this_initialized._tempVec, spherical = _$_assert_this_initialized._spherical;
        galacean.Vector3.transformByQuat(tempVec.set(0, 0, -1), transform.rotationQuaternion, tempVec);
        spherical.setFromVec3(tempVec, _this._atTheBack);
        return _this;
    }
    var _proto = FreeControl.prototype;
    _proto.onUpdate = function onUpdate(deltaTime) {
        if (this.enabled === false) return;
        ControlHandlerType.None;
        var _this = this, delta = _this._tempVec;
        var _this1 = this, inputDevices = _this1.inputDevices, input = _this1.input;
        for(var i = inputDevices.length - 1; i >= 0; i--){
            var handler = inputDevices[i];
            var handlerType = handler.onUpdateHandler(input);
            if (handlerType) {
                handler.onUpdateDelta(this, delta);
                switch(handlerType){
                    case ControlHandlerType.ROTATE:
                        this._rotate(delta);
                        break;
                    case ControlHandlerType.PAN:
                        this._pan(delta, deltaTime);
                        break;
                }
            }
        }
        if (this.floorMock) {
            var position = this._cameraTransform.position;
            if (position.y !== this.floorY) {
                this._cameraTransform.setPosition(position.x, this.floorY, position.z);
            }
        }
    };
    _proto._pan = function _pan(moveDelta, delta) {
        var actualMoveSpeed = delta * this.movementSpeed;
        moveDelta.normalize().scale(actualMoveSpeed);
        this._cameraTransform.translate(moveDelta, true);
    };
    _proto._rotate = function _rotate(moveDelta) {
        if (moveDelta.x !== 0 || moveDelta.y !== 0) {
            var canvas = this.engine.canvas;
            var deltaAlpha = -moveDelta.x * 180 / canvas.width;
            var deltaPhi = moveDelta.y * 180 / canvas.height;
            this._spherical.theta += galacean.MathUtil.degreeToRadian(deltaAlpha);
            this._spherical.phi += galacean.MathUtil.degreeToRadian(deltaPhi);
            this._spherical.makeSafe();
            this._atTheBack = this._spherical.setToVec3(this._tempVec);
            galacean.Vector3.add(this._cameraTransform.position, this._tempVec, this._tempVec);
            this._atTheBack ? this._cameraTransform.lookAt(this._tempVec, this._bottomVec) : this._cameraTransform.lookAt(this._tempVec, this._topVec);
        }
    };
    return FreeControl;
}(galacean.Script);

var ControlKeyboard = /*#__PURE__*/ function() {
    function ControlKeyboard() {}
    ControlKeyboard.onUpdateHandler = function onUpdateHandler(input) {
        if (input.isKeyHeldDown(galacean.Keys.ArrowLeft) || input.isKeyHeldDown(galacean.Keys.ArrowRight) || input.isKeyHeldDown(galacean.Keys.ArrowUp) || input.isKeyHeldDown(galacean.Keys.ArrowDown)) {
            return ControlHandlerType.PAN;
        } else {
            return ControlHandlerType.None;
        }
    };
    ControlKeyboard.onUpdateDelta = function onUpdateDelta(control, outDelta) {
        var keyPanSpeed = control.keyPanSpeed, input = control.input;
        outDelta.x = outDelta.y = 0;
        if (input.isKeyHeldDown(galacean.Keys.ArrowLeft)) {
            outDelta.x += keyPanSpeed;
        }
        if (input.isKeyHeldDown(galacean.Keys.ArrowRight)) {
            outDelta.x -= keyPanSpeed;
        }
        if (input.isKeyHeldDown(galacean.Keys.ArrowUp)) {
            outDelta.y += keyPanSpeed;
        }
        if (input.isKeyHeldDown(galacean.Keys.ArrowDown)) {
            outDelta.y -= keyPanSpeed;
        }
    };
    return ControlKeyboard;
}();
ControlKeyboard = __decorate([
    StaticInterfaceImplement()
], ControlKeyboard);

var _ControlPointer;
var DeltaType;
(function(DeltaType) {
    DeltaType[DeltaType["Moving"] = 0] = "Moving";
    DeltaType[DeltaType["Distance"] = 1] = "Distance";
    DeltaType[DeltaType["None"] = 2] = "None";
})(DeltaType || (DeltaType = {}));
var ControlPointer = (_ControlPointer = /*#__PURE__*/ function() {
    function ControlPointer() {}
    ControlPointer.onUpdateHandler = function onUpdateHandler(input) {
        ++this._frameIndex;
        var pointers = input.pointers;
        switch(pointers.length){
            case 1:
                if (input.isPointerHeldDown(galacean.PointerButton.Secondary)) {
                    this._updateType(ControlHandlerType.PAN, 0);
                } else if (input.isPointerHeldDown(galacean.PointerButton.Auxiliary)) {
                    this._updateType(ControlHandlerType.ZOOM, 0);
                } else if (input.isPointerHeldDown(galacean.PointerButton.Primary)) {
                    this._updateType(ControlHandlerType.ROTATE, 0);
                } else {
                    // When `onPointerMove` happens on the same frame as `onPointerUp`
                    // Need to record the movement of this frame
                    var deltaPosition = input.pointers[0].deltaPosition;
                    if (deltaPosition.x !== 0 && deltaPosition.y !== 0) {
                        if (input.isPointerUp(galacean.PointerButton.Secondary)) {
                            this._updateType(ControlHandlerType.PAN, 0);
                        } else if (input.isPointerUp(galacean.PointerButton.Auxiliary)) {
                            this._updateType(ControlHandlerType.ZOOM, 0);
                        } else if (input.isPointerUp(galacean.PointerButton.Primary)) {
                            this._updateType(ControlHandlerType.ROTATE, 0);
                        } else {
                            this._updateType(ControlHandlerType.None, 2);
                        }
                    } else {
                        this._updateType(ControlHandlerType.None, 2);
                    }
                }
                break;
            case 2:
                this._updateType(ControlHandlerType.ZOOM, 1);
                break;
            case 3:
                this._updateType(ControlHandlerType.PAN, 0);
                break;
            default:
                this._updateType(ControlHandlerType.None, 2);
                break;
        }
        return this._handlerType;
    };
    ControlPointer.onUpdateDelta = function onUpdateDelta(control, outDelta) {
        var _this = this, frameIndex = _this._frameIndex;
        switch(this._deltaType){
            case 0:
                outDelta.x = 0;
                outDelta.y = 0;
                if (this._lastUsefulFrameIndex === frameIndex - 1) {
                    var pointers = control.input.pointers;
                    var length = pointers.length;
                    for(var i = length - 1; i >= 0; i--){
                        var deltaPosition = pointers[i].deltaPosition;
                        outDelta.x += deltaPosition.x;
                        outDelta.y += deltaPosition.y;
                    }
                    outDelta.x /= length;
                    outDelta.y /= length;
                }
                break;
            case 1:
                var pointers1 = control.input.pointers;
                var pointer1 = pointers1[0];
                var pointer2 = pointers1[1];
                var curDistance = galacean.Vector2.distance(pointer1.position, pointer2.position);
                if (this._lastUsefulFrameIndex === frameIndex - 1) {
                    outDelta.set(0, this._distanceOfPointers - curDistance, 0);
                } else {
                    outDelta.set(0, 0, 0);
                }
                this._distanceOfPointers = curDistance;
                break;
        }
        this._lastUsefulFrameIndex = frameIndex;
    };
    ControlPointer._updateType = function _updateType(handlerType, deltaType) {
        if (this._handlerType !== handlerType || this._deltaType !== deltaType) {
            this._handlerType = handlerType;
            this._deltaType = deltaType;
            this._lastUsefulFrameIndex = -1;
        }
    };
    return ControlPointer;
}(), function() {
    _ControlPointer._deltaType = 2;
}(), function() {
    _ControlPointer._handlerType = ControlHandlerType.None;
}(), function() {
    _ControlPointer._frameIndex = 0;
}(), function() {
    _ControlPointer._lastUsefulFrameIndex = -1;
}(), function() {
    _ControlPointer._distanceOfPointers = 0;
}(), _ControlPointer);
ControlPointer = __decorate([
    StaticInterfaceImplement()
], ControlPointer);

var ControlWheel = /*#__PURE__*/ function() {
    function ControlWheel() {}
    ControlWheel.onUpdateHandler = function onUpdateHandler(input) {
        var wheelDelta = input.wheelDelta;
        if (wheelDelta.x === 0 && wheelDelta.y === 0 && wheelDelta.z === 0) {
            return ControlHandlerType.None;
        } else {
            return ControlHandlerType.ZOOM;
        }
    };
    ControlWheel.onUpdateDelta = function onUpdateDelta(control, outDelta) {
        outDelta.copyFrom(control.input.wheelDelta);
    };
    return ControlWheel;
}();
ControlWheel = __decorate([
    StaticInterfaceImplement()
], ControlWheel);

/**
 * @title Scene Fog
 * @category Scene
 */

async function initScene(engine) {
  const scene = engine.sceneManager.activeScene;

  // Set background color to cornflowerblue
  const cornflowerblue = new galacean.Color(130 / 255, 163 / 255, 255 / 255);
  scene.background.solidColor = cornflowerblue;

  // Set fog
  scene.fogMode = galacean.FogMode.ExponentialSquared;
  scene.fogDensity = 0.015;
  scene.fogEnd = 200;
  scene.fogColor = cornflowerblue;

  const rootEntity = scene.createRootEntity();

  // Create light entity and component
  const lightEntity = rootEntity.createChild("light");
  lightEntity.transform.setPosition(0, 0.7, 0.5);
  lightEntity.transform.lookAt(new galacean.Vector3(0, 0, 0));

  // Enable light cast shadow
  const directLight = lightEntity.addComponent(galacean.DirectLight);
  directLight.shadowType = galacean.ShadowType.SoftLow;

  // Add ambient light
  const ambientLight = await engine.resourceManager.load({
    url: "https://gw.alipayobjects.com/os/bmw-prod/09904c03-0d23-4834-aa73-64e11e2287b0.bin",
    type: galacean.AssetType.Env,
  });
  scene.ambientLight = ambientLight;

  // Add model
  const glTFResource = await engine.resourceManager.load(
    "https://gw.alipayobjects.com/os/OasisHub/19748279-7b9b-4c17-abdf-2c84f93c54c8/oasis-file/1670226408346/low_poly_scene_forest_waterfall.gltf"
  );
  rootEntity.addChild(glTFResource.defaultSceneRoot);
}

function initBulletScreen(engine) {
  class TextBarrageAnimation extends galacean.Script {constructor(...args) { super(...args); TextBarrageAnimation.prototype.__init.call(this);TextBarrageAnimation.prototype.__init2.call(this);TextBarrageAnimation.prototype.__init3.call(this);TextBarrageAnimation.prototype.__init4.call(this); }
    // prettier-ignore
    static __initStatic() {this.words = [ "GALACEAN", "galacean", "HELLO", "hello", "WORLD", "world", "TEXT", "text", "PEACE", "peace", "LOVE", "love", "abcdefg", "hijklmn", "opqrst", "uvwxyz", "ABCDEFG", "HIJKLMN", "OPQRST", "UVWXYZ", "~!@#$", "%^&*", "()_+" ];}
    static __initStatic2() {this.colors = [
      new galacean.Color(1, 1, 1, 1),
      new galacean.Color(1, 0, 0, 1),
      new galacean.Color(0, 1, 0.89, 1),
    ];}
  
    
     __init() {this.priorityOffset = 0;}
  
     __init2() {this._speed = 0;}
     __init3() {this._range = 0;}
     __init4() {this._isPlaying = false;}
    

    
  
    play() {
      this._isPlaying = true;
    }
  
    onStart() {
      this._textRenderer = this.entity.getComponent(galacean.TextRenderer);
      const { bounds } = this._textRenderer;
      this._range = -bounds.max.x + bounds.min.x;
      this.screenPoint = new galacean.Vector3(0, 0, -this.camera.entity.transform.position.z);
      this._reset(true);
    }
  
    onUpdate(dt) {
      if (this._isPlaying) {
        this.screenPoint.x += this._speed * dt;
        if (this.screenPoint.x < this._range) {
          this._reset(false);
        }
        camera.screenToWorldPoint(this.screenPoint, this.entity.transform.position);
        this.entity.transform.rotation = this.camera.entity.transform.rotation;
      }
    }
  
     _reset(isFirst) {
      const textRenderer = this._textRenderer;
      const { words, colors } = TextBarrageAnimation;
  
      // Reset priority for renderer
      textRenderer.priority += this.priorityOffset;
  
      // Reset the text to render
      const wordLastIndex = words.length - 1;
      textRenderer.text = `${words[getRandomNum(0, wordLastIndex)]} ${
        words[getRandomNum(0, wordLastIndex)]
      } ${getRandomNum(0, 99)}`;
  
      // Reset color
      textRenderer.color = colors[getRandomNum(0, colors.length - 1)];
  
      // Reset position
      if (isFirst) {
        this.screenPoint.x = getRandomNum(-0.5*engine.canvas.width, 0.5*engine.canvas.width);
      } else {
        const { bounds } = textRenderer;
        this.screenPoint.x =
          engine.canvas.width +
          bounds.max.x -
          bounds.min.x;
      }
      this.screenPoint.y = getRandomNum(0, engine.canvas.height);
      camera.screenToWorldPoint(this.screenPoint, this.entity.transform.position);
  
      // Reset speed
      this._speed = getRandomNum(-500, -200);
    }
  } TextBarrageAnimation.__initStatic(); TextBarrageAnimation.__initStatic2();
  
  function getRandomNum(min, max) {
    const range = max - min;
    const rand = Math.random();
    return min + Math.round(rand * range);
  }
  const scene = engine.sceneManager.activeScene;
  const rootEntity = scene.getRootEntity();
  
  // Create camera
  const camera = rootEntity.findByName("camera").getComponent(galacean.Camera);

  // Create text barrage
  const textCount = 50;
  for (let i = 0; i < textCount; ++i) {
    const textEntity = rootEntity.createChild();

    // Init text renderer
    const textRenderer = textEntity.addComponent(galacean.TextRenderer);
    textRenderer.font = galacean.Font.createFromOS(engine, "Arial");
    textRenderer.fontSize = 36;
    textRenderer.priority = i;
    textRenderer.horizontalAlignment = galacean.TextHorizontalAlignment.Right;

    // Init and reset text barrage animation
    const barrage = textEntity.addComponent(TextBarrageAnimation);
    barrage.camera = camera;
    barrage.priorityOffset = textCount;
    barrage.play();
  }
}

function Demo(canvas) {
  galacean.WebGLEngine.create({ canvas: canvas }).then(async engine => {
      engine.canvas.resizeByClientSize();

      const scene = engine.sceneManager.activeScene;
      const rootEntity = scene.createRootEntity();

      // Create camera entity and components
      const cameraEntity = rootEntity.createChild("camera");
      cameraEntity.transform.setPosition(-6, 2, -22);
      cameraEntity.transform.rotate(new galacean.Vector3(0, -110, 0));
      cameraEntity.addComponent(galacean.Camera);
      cameraEntity.addComponent(FreeControl).floorMock = false;
    
      initScene(engine);
      initBulletScreen(engine);

      engine.run();
    }
  );
}

function Main() {
  const canvas = wx.createCanvas();
  galacean.PlatformManager.set(new WechatGamePlatform(canvas));

  // Demo1(canvas);
  // Demo2(canvas);
  // Demo3(canvas);
  // Demo4(canvas);
  // Demo5(canvas);
  // Demo6(canvas);
  // Demo7(canvas);
  // Demo8(canvas);
  Demo(canvas);
}

Main();
