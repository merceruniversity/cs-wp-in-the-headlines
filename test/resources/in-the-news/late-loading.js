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
'use strict'

/**
 * Access nested property values at any depth with a simple expression.
 *
 * @module object-get
 * @typicalname objectGet
 * @example
 * ```js
 * const objectGet = require('object-get')
 *
 * const colour = objectGet(mammal, 'fur.appearance.colour')
 * const text = objectGet(el, 'children[2].children[1].children[1].textContent')
 * ```
 *
 * Helps avoid long logical expressions like:
 *
 * ```js
 * const colour = mammal && mammal.fur && mammal.fur.appearance && mammal.fur.appearance.colour
 * ```
 */
module.exports = objectGet

/**
 * Returns the value at the given property.
 *
 * @param {object} - the input object
 * @param {string} - the property accessor expression. 
 * @returns {*}
 * @alias module:object-get
 * @example
 * > objectGet({ animal: 'cow' }, 'animal')
 * 'cow'
 *
 * > objectGet({ animal: { mood: 'lazy' } }, 'animal')
 * { mood: 'lazy' }
 *
 * > objectGet({ animal: { mood: 'lazy' } }, 'animal.mood')
 * 'lazy'
 *
 * > objectGet({ animal: { mood: 'lazy' } }, 'animal.email')
 * undefined
 */
function objectGet (object, expression) {
  if (!(object && expression)) throw new Error('both object and expression args are required')
  return expression.trim().split('.').reduce(function (prev, curr) {
    var arr = curr.match(/(.*?)\[(.*?)\]/)
    if (arr) {
      return prev && prev[arr[1]][arr[2]]
    } else {
      return prev && prev[curr]
    }
  }, object)
}

},{}],12:[function(require,module,exports){
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

},{"is-array-like":2,"is-index":5,"is-length":6,"is-nil":7,"to-path":13}],13:[function(require,module,exports){
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

},{"is-array-like":2,"is-nil":7,"is-symbol":9,"to-str":14}],14:[function(require,module,exports){
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

},{"is-function":4,"is-nil":7,"is-object":8,"is-symbol":9}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @author Todd Sayre
 */

/** Class rendering the markup for the element */
var InTheHeadlines = function () {
  /**
   * Creates the class just to render out the HTML
   * @param {array} articles - The articles processed from JSONP
   */
  function InTheHeadlines(articles) {
    _classCallCheck(this, InTheHeadlines);

    this.articles = articles;
  }

  _createClass(InTheHeadlines, [{
    key: 'toHtml',
    value: function toHtml() {
      var _this = this;

      var slidesHtml = this.articles;
      // console.log(slidesHtml, 'slidesHtml in toHtml');

      slidesHtml = slidesHtml.map(function (slide) {
        return _this.slideHtml(slide);
      });
      slidesHtml = slidesHtml.join('');

      return '\n      <!-- Slider main container -->\n      <div class="swiper-container">\n      \n        <!-- Additional required wrapper -->\n        <div class="swiper-wrapper">\n          <!-- Slides -->\n          ' + slidesHtml + '\n        </div>\n     \n        <!-- If we need navigation buttons -->\n        <div class="in-the-headlines__button in-the-headlines__button--prev">\n            <span class="visually-hidden">Previous Page of Articles</span>\n            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 14.83 24" width="14.83"><path d="M14.83 21.17L5.66 12l9.17-9.17L12 0 0 12l12 12z"></path><path d="M-16-12h48v48h-48z" fill="none"></path></svg>\n        </div>\n        <div class="in-the-headlines__button in-the-headlines__button--next">\n            <span class="visually-hidden">Next Page of Articles</span>\n            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 14.83 24" width="14.83"><path d="M0 21.17L9.17 12 0 2.83 2.83 0l12 12-12 12z"></path><path d="M-17.17-12h48v48h-48z" fill="none"></path></svg>\n        </div>\n        \n        <!-- If we need pagination -->\n        <div class="in-the-headlines__pagination"></div>\n        \n      </div>\n    ';
    }
  }, {
    key: 'slideHtml',
    value: function slideHtml(slideData) {
      return '\n      <div class="swiper-slide">\n        <div class="in-the-headlines__slide">\n          <a class="in-the-headlines__link in-the-headlines__link--image" href="' + slideData.articleUrl + '">\n            <img class="in-the-headlines__image"\n                    alt="' + slideData.imageAlt + '"\n                    src="' + slideData.imageUrl + '"\n                    width="' + slideData.imageWidth + '"\n                    height="' + slideData.imageHeight + '">\n          </a>\n          <h3 class="in-the-headlines__headline">\n            <a class="in-the-headlines__link in-the-headlines__link--headline" href="' + slideData.articleUrl + '">' + slideData.headline + '</a>\n          </h3>\n        </div>\n      </div>\n    ';
    }
  }]);

  return InTheHeadlines;
}();

exports.default = InTheHeadlines;

},{}],16:[function(require,module,exports){
/**
 * @author Todd Sayre
 */

'use strict';

var _muNewsFeed = require('./mu-news-feed');

var _muNewsFeed2 = _interopRequireDefault(_muNewsFeed);

var _inTheHeadlines = require('./in-the-headlines');

var _inTheHeadlines2 = _interopRequireDefault(_inTheHeadlines);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fetchJsonp = require('fetch-jsonp');

var initSwiper = function initSwiper(instance) {
  var container = instance.querySelectorAll('.swiper-container');

  var options = {};
  // Matt likes it when it loops
  options.loop = true;
  options.slidesPerView = 4;
  options.spaceBetween = 40;

  // Pagination 'pips'
  options.pagination = {};
  options.pagination.el = '.swiper-pagination';

  // Navigation 'Previous' & 'Next' buttons
  options.navigation = {};
  options.navigation.nextEl = '.in-the-headlines__button--next';
  options.navigation.prevEl = '.in-the-headlines__button--prev';

  // For a responsive design
  options.breakpoints = {};
  // When window width is <= 1440px
  options.breakpoints[1440] = {};
  options.breakpoints[1440].slidesPerView = 3;
  options.breakpoints[1440].spaceBetween = 30;
  // When window width is <= 1024px
  options.breakpoints[1024] = {};
  options.breakpoints[1024].slidesPerView = 2;
  options.breakpoints[1024].spaceBetween = 20;
  // When window width is <= 768px
  options.breakpoints[768] = {};
  options.breakpoints[768].slidesPerView = 1;
  options.breakpoints[768].spaceBetween = 10;

  var mySwiper = new Swiper(container, options);
};

var renderInstance = function renderInstance(instance) {
  // console.log(instance);
  var url = instance.getAttribute('data-url');
  // console.log(url);
  fetchJsonp(url, {
    jsonpCallback: '_jsonp',
    timeout: 10000
  }).then(function (response) {
    return response.json();
  }).then(function (json) {
    // console.log('parsed articles', articles);
    var munf = new _muNewsFeed2.default(json);
    var articles = munf.getArticles();
    var ith = new _inTheHeadlines2.default(articles);
    instance.innerHTML = ith.toHtml();
    initSwiper(instance);
  }).catch(function (ex) {
    console.log('parsing failed', ex);
  });
  // initSwiper(instance);
};

var onDomLoad = function onDomLoad() {
  var instances = document.querySelectorAll('.in-the-headlines');
  instances.forEach(function (instance) {
    return renderInstance(instance);
  });
};

document.addEventListener('DOMContentLoaded', onDomLoad);

},{"./in-the-headlines":15,"./mu-news-feed":17,"fetch-jsonp":1}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @author Todd Sayre
 */

var objectHas = require('object-has');
var objectGet = require('object-get');

/**
 * Turns the WP API JSONP URL into an array of
 */

var MuNewsFeed = function () {
  /**
   * Create a news feed
   * @param {string} json - The URL to the JSONP feed
   */
  function MuNewsFeed(json) {
    _classCallCheck(this, MuNewsFeed);

    var tmpJson = json;
    tmpJson = this.filterNoImageArticles(tmpJson);
    this.json = tmpJson;
  }

  /**
   * Return the articles in an array
   * @return {array} The articles that can be rendered
   */


  _createClass(MuNewsFeed, [{
    key: 'getArticles',
    value: function getArticles() {
      return this.usefulData(this.json);
    }

    /**
     * Returns just the useful parts of the JSON feed
     * @param {object} json
     */

  }, {
    key: 'usefulData',
    value: function usefulData(json) {
      // console.log(json, 'json in usefulData');
      return json.map(function (datum) {
        var imageAlt = objectGet(datum, '_embedded.wp:featuredmedia[0].alt_text');
        if (0 === imageAlt.length) {
          imageAlt = objectGet(datum, '_embedded.wp:featuredmedia[0].caption.rendered');
        }
        if (0 === imageAlt.length) {
          imageAlt = objectGet(datum, '_embedded.wp:featuredmedia[0].title.rendered');
        }
        var usefulDatum = {};
        usefulDatum.articleUrl = objectGet(datum, 'link');
        usefulDatum.headline = objectGet(datum, 'title.rendered');
        usefulDatum.imageUrl = objectGet(datum, '_embedded.wp:featuredmedia[0].media_details.sizes.bk620_420.source_url');
        usefulDatum.imageAlt = imageAlt;
        usefulDatum.imageWidth = objectGet(datum, '_embedded.wp:featuredmedia[0].media_details.sizes.bk620_420.width');
        usefulDatum.imageHeight = objectGet(datum, '_embedded.wp:featuredmedia[0].media_details.sizes.bk620_420.height');
        return usefulDatum;
      });
    }

    /**
     * Return only the articles with appropriately-sized images
     * @param {object} json - The WP API JSON feed
     * @returns {object}
     */

  }, {
    key: 'filterNoImageArticles',
    value: function filterNoImageArticles(json) {
      return json.filter(function (post) {
        return objectHas(post, '_embedded.wp:featuredmedia[0].media_details.sizes.bk620_420');
      });
    }
  }]);

  return MuNewsFeed;
}();

exports.default = MuNewsFeed;

},{"object-get":11,"object-has":12}]},{},[16]);
