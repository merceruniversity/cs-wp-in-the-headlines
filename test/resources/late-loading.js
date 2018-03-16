(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod);
    global.fetchJsonp = mod.exports;
  }
})(this, function (exports, module) {
  'use strict';

  var defaultOptions = {
    timeout: 5000,
    jsonpCallback: 'callback',
    jsonpCallbackFunction: null
  };

  function generateCallbackFunction() {
    return 'jsonp_' + Date.now() + '_' + Math.ceil(Math.random() * 100000);
  }

  function clearFunction(functionName) {
    // IE8 throws an exception when you try to delete a property on window
    // http://stackoverflow.com/a/1824228/751089
    try {
      delete window[functionName];
    } catch (e) {
      window[functionName] = undefined;
    }
  }

  function removeScript(scriptId) {
    var script = document.getElementById(scriptId);
    if (script) {
      document.getElementsByTagName('head')[0].removeChild(script);
    }
  }

  function fetchJsonp(_url) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    // to avoid param reassign
    var url = _url;
    var timeout = options.timeout || defaultOptions.timeout;
    var jsonpCallback = options.jsonpCallback || defaultOptions.jsonpCallback;

    var timeoutId = undefined;

    return new Promise(function (resolve, reject) {
      var callbackFunction = options.jsonpCallbackFunction || generateCallbackFunction();
      var scriptId = jsonpCallback + '_' + callbackFunction;

      window[callbackFunction] = function (response) {
        resolve({
          ok: true,
          // keep consistent with fetch API
          json: function json() {
            return Promise.resolve(response);
          }
        });

        if (timeoutId) clearTimeout(timeoutId);

        removeScript(scriptId);

        clearFunction(callbackFunction);
      };

      // Check if the user set their own params, and if not add a ? to start a list of params
      url += url.indexOf('?') === -1 ? '?' : '&';

      var jsonpScript = document.createElement('script');
      jsonpScript.setAttribute('src', '' + url + jsonpCallback + '=' + callbackFunction);
      if (options.charset) {
        jsonpScript.setAttribute('charset', options.charset);
      }
      jsonpScript.id = scriptId;
      document.getElementsByTagName('head')[0].appendChild(jsonpScript);

      timeoutId = setTimeout(function () {
        reject(new Error('JSONP request to ' + _url + ' timed out'));

        clearFunction(callbackFunction);
        removeScript(scriptId);
        window[callbackFunction] = function () {
          clearFunction(callbackFunction);
        };
      }, timeout);

      // Caught if got 404/500
      jsonpScript.onerror = function () {
        reject(new Error('JSONP request to ' + _url + ' failed'));

        clearFunction(callbackFunction);
        removeScript(scriptId);
        if (timeoutId) clearTimeout(timeoutId);
      };
    });
  }

  // export as global function
  /*
  let local;
  if (typeof global !== 'undefined') {
    local = global;
  } else if (typeof self !== 'undefined') {
    local = self;
  } else {
    try {
      local = Function('return this')();
    } catch (e) {
      throw new Error('polyfill failed because global object is unavailable in this environment');
    }
  }
  local.fetchJsonp = fetchJsonp;
  */

  module.exports = fetchJsonp;
});
},{}],2:[function(require,module,exports){
'use strict';

var isArray    = require('is-array');
var isWindow   = require('is-window');
var isFunction = require('is-function');


module.exports = function (obj) {

  if (!obj) {
    return false;
  }

  if (isArray(obj)) {
    return true;
  }

  if (isFunction(obj) || isWindow(obj)) {
    return false;
  }

  obj = Object(obj);

  var length = 'length' in obj && obj.length;

  if (obj.nodeType === 1 && length) {
    return true;
  }

  return length === 0 ||
    typeof length === 'number' && length > 0 && ( length - 1 ) in obj;
};

},{"is-array":3,"is-function":4,"is-window":10}],3:[function(require,module,exports){

/**
 * isArray
 */

var isArray = Array.isArray;

/**
 * toString
 */

var str = Object.prototype.toString;

/**
 * Whether or not the given `val`
 * is an array.
 *
 * example:
 *
 *        isArray([]);
 *        // > true
 *        isArray(arguments);
 *        // > false
 *        isArray('');
 *        // > false
 *
 * @param {mixed} val
 * @return {bool}
 */

module.exports = isArray || function (val) {
  return !! val && '[object Array]' == str.call(val);
};

},{}],4:[function(require,module,exports){
module.exports = isFunction

var toString = Object.prototype.toString

function isFunction (fn) {
  var string = toString.call(fn)
  return string === '[object Function]' ||
    (typeof fn === 'function' && string !== '[object RegExp]') ||
    (typeof window !== 'undefined' &&
     // IE8 and below
     (fn === window.setTimeout ||
      fn === window.alert ||
      fn === window.confirm ||
      fn === window.prompt))
};

},{}],5:[function(require,module,exports){
'use strict';

var isNil = require('is-nil');

var MAX_SAFE_INTEGER = 9007199254740991;

module.exports = function (value, length) {

  value  = (typeof value === 'number' || /^(?:0|[1-9]\d*)$/.test(value)) ? +value : -1;
  length = isNil(length) ? MAX_SAFE_INTEGER : length;

  return value > -1 && value % 1 === 0 && value < length;
};

},{"is-nil":7}],6:[function(require,module,exports){
'use strict';

var MAX_SAFE_INTEGER = 9007199254740991;

module.exports = function (value) {

  return typeof value === 'number'
    && value > -1
    && value % 1 === 0
    && value <= MAX_SAFE_INTEGER; // max safe integer
};

},{}],7:[function(require,module,exports){
'use strict';

module.exports = function (obj) {

  return obj == null;
};

},{}],8:[function(require,module,exports){
"use strict";

module.exports = function isObject(x) {
	return typeof x === "object" && x !== null;
};

},{}],9:[function(require,module,exports){
'use strict';

var toStr = Object.prototype.toString;
var hasSymbols = typeof Symbol === 'function' && typeof Symbol() === 'symbol';

if (hasSymbols) {
	var symToStr = Symbol.prototype.toString;
	var symStringRegex = /^Symbol\(.*\)$/;
	var isSymbolObject = function isSymbolObject(value) {
		if (typeof value.valueOf() !== 'symbol') { return false; }
		return symStringRegex.test(symToStr.call(value));
	};
	module.exports = function isSymbol(value) {
		if (typeof value === 'symbol') { return true; }
		if (toStr.call(value) !== '[object Symbol]') { return false; }
		try {
			return isSymbolObject(value);
		} catch (e) {
			return false;
		}
	};
} else {
	module.exports = function isSymbol(value) {
		// this environment does not support Symbols.
		return false;
	};
}

},{}],10:[function(require,module,exports){
'use strict';

module.exports = function (obj) {

  if (obj == null) {
    return false;
  }

  var o = Object(obj);

  return o === o.window;
};

},{}],11:[function(require,module,exports){
'use strict';

var isNil       = require('is-nil');
var toPath      = require('to-path');
var isIndex     = require('is-index');
var isLength    = require('is-length');
var isArrayLike = require('is-array-like');

function hasOwn(object, key) {
  // Avoid a bug in IE 10-11 where objects with a [[Prototype]] of `null`,
  // that are composed entirely of index properties, return `false` for
  // `hasOwnProperty` checks of them.
  return Object.prototype.hasOwnProperty.call(object, key) ||
    (typeof object === 'object' && key in object && Object.getPrototypeOf(object) === null);
}

module.exports = function (object, path) {

  if (isNil(object)) {
    return false;
  }

  var paths  = toPath(path);
  var index  = -1;
  var length = paths.length;

  var key;
  var result;

  while (++index < length) {

    key    = paths[index];
    result = !isNil(object) && hasOwn(object, key);

    if (!result) {
      break;
    }

    object = object[key];
  }


  if (result) {
    return result;
  }


  length = object ? object.length : 0;

  return !!length && isLength(length) && isIndex(key, length) && isArrayLike(object);

};

},{"is-array-like":2,"is-index":5,"is-length":6,"is-nil":7,"to-path":12}],12:[function(require,module,exports){
'use strict';

var isNil       = require('is-nil');
var isSymbol    = require('is-symbol');
var isArrayLike = require('is-array-like');
var toString    = require('to-str');

var rePropName   = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]/g;
var reEscapeChar = /\\(\\)?/g;


function toKey(key) {
  return (typeof key === 'string' || isSymbol(key))
    ? key
    : ('' + key);
}


module.exports = function (value) {

  if (isNil(value)) {
    return [];
  }

  if (isSymbol(value)) {
    return [value];
  }


  var result = [];

  if (typeof value !== 'string' && isArrayLike(value)) {
    for (var i = 0, l = value.length; i < l; i++) {
      result.push(toKey(value[i]));
    }
    return result;
  }


  toString(value)
    .replace(rePropName, function (match, number, quote, string) {
      result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
    });

  return result;
};

},{"is-array-like":2,"is-nil":7,"is-symbol":9,"to-str":13}],13:[function(require,module,exports){
'use strict';

/* global Symbol */

var isNil      = require('is-nil');
var isSymbol   = require('is-symbol');
var isObject   = require('is-object');
var isFunction = require('is-function');

module.exports = function (value) {

  if (typeof value === 'string') {
    return value;
  }

  if (isNil(value)) {
    return '';
  }

  if (isSymbol(value)) {
    return Symbol.prototype.toString.call(value);
  }

  if (isObject(value) && isFunction(value.toString)) {
    return value.toString();
  }

  var result = '' + value;

  return (result === '0' && (1 / value) === -1 / 0) ? '-0' : result;
};

},{"is-function":4,"is-nil":7,"is-object":8,"is-symbol":9}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var InTheHeadlines = function () {
  function InTheHeadlines(json) {
    _classCallCheck(this, InTheHeadlines);

    this.json = json;
  }

  _createClass(InTheHeadlines, [{
    key: 'toHtml',
    value: function toHtml() {
      var _this = this;

      var slidesHtml = this.json;

      slidesHtml = slidesHtml.map(function (slide) {
        return _this.slideHtml(slide);
      });
      // TODO: filter for only articles with featured images
      // console.log(slidesHtml);
      slidesHtml = slidesHtml.join('');
      // console.log(slidesHtml);

      return '\n      <!-- Slider main container -->\n      <div class="swiper-container">\n        <!-- Additional required wrapper -->\n        <div class="swiper-wrapper">\n          <!-- Slides -->\n          ' + slidesHtml + '\n        </div>\n        \n        <!-- If we need pagination -->\n        <div class="swiper-pagination"></div>\n     \n        <!-- If we need navigation buttons -->\n        <div class="swiper-button-prev"></div>\n        <div class="swiper-button-next"></div>\n        \n      </div>\n    ';
    }
  }, {
    key: 'slideHtml',
    value: function slideHtml(slideData) {
      console.log(slideData);
      // console.log(slideData.title);
      // console.log(slideData.title.rendered);
      // console.log(slideData._embedded['wp:featuredmedia']);
      // let imageUrl = ``;
      // let imageTitle = ``;
      var headline = slideData.title.rendered;
      var firstFeaturedMedia = slideData._embedded['wp:featuredmedia'][0];
      var imageTitle = firstFeaturedMedia.rendered;
      var imageUrl = firstFeaturedMedia.media_details.sizes.bk620_420.source_url;
      return '\n      <div class="swiper-slide">\n        <img alt="' + imageTitle + '" src="' + imageUrl + '">\n        <h3><a href="' + slideData.link + '">' + headline + '</a></h3>\n      </div>\n    ';
    }
  }]);

  return InTheHeadlines;
}();

exports.default = InTheHeadlines;

},{}],15:[function(require,module,exports){
'use strict';

var _inTheHeadlines = require('./in-the-headlines');

var _inTheHeadlines2 = _interopRequireDefault(_inTheHeadlines);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fetchJsonp = require('fetch-jsonp');
var objectHas = require('object-has');

var renderSwiper = function renderSwiper(instance) {
  var container = instance.querySelectorAll('.swiper-container');
  var options = {
    // Optional parameters
    loop: true,

    // If we need pagination
    pagination: {
      el: '.swiper-pagination'
    },

    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },

    // And if we need scrollbar
    //scrollbar: {
    //  el: '.swiper-scrollbar',
    //},

    // Default parameters
    slidesPerView: 4,
    spaceBetween: 40,

    // Responsive breakpoints
    breakpoints: {

      // when window width is <= 1440px
      1440: {
        slidesPerView: 3,
        spaceBetween: 30
      },

      // when window width is <= 1024px
      1024: {
        slidesPerView: 2,
        spaceBetween: 20
      },

      // when window width is <= 768px
      768: {
        slidesPerView: 1,
        spaceBetween: 10
      }
    }
  };
  var mySwiper = new Swiper(container, options);
};

var renderInstance = function renderInstance(instance) {
  console.log(instance);
  var url = instance.getAttribute('data-url');
  fetchJsonp(url, {
    jsonpCallback: '_jsonp'
  }).then(function (response) {
    return response.json();
  }).then(function (json) {
    console.log('parsed json', json);
    json = filterNoImageArticles(json);
    var ith = new _inTheHeadlines2.default(json);
    // console.log(ithContainer);
    instance.innerHTML = ith.toHtml();
    renderSwiper(instance);
  }).catch(function (ex) {
    console.log('parsing failed', ex);
  });
};

var onDomLoad = function onDomLoad() {
  var instances = document.querySelectorAll('.in-the-headlines');
  instances.forEach(function (instance) {
    return renderInstance(instance);
  });
};

var filterNoImageArticles = function filterNoImageArticles(posts) {
  return posts.filter(function (post) {
    console.log(post);
    console.log(objectHas(post, '_embedded.wp:featuredmedia'));
    console.log(objectHas(post, '_embedded.wp:featuredmedia[0].media_details.sizes.bk620_420'));
    return objectHas(post, '_embedded.wp:featuredmedia[0].media_details.sizes.bk620_420');
  });
};

document.addEventListener('DOMContentLoaded', onDomLoad);

},{"./in-the-headlines":14,"fetch-jsonp":1,"object-has":11}]},{},[15]);
