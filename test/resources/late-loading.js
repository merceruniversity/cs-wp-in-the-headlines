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

      return '\n      <div class="carousel">\n        ' + slidesHtml + '\n      </div>\n    ';
    }
  }, {
    key: 'slideHtml',
    value: function slideHtml(slideData) {
      console.log(slideData);
      // console.log(slideData.title);
      // console.log(slideData.title.rendered);
      // console.log(slideData._embedded['wp:featuredmedia']);
      var firstFeaturedMedia = slideData._embedded['wp:featuredmedia'][0];
      var headline = slideData.title.rendered;
      // let imageTitle = ``;
      var imageTitle = firstFeaturedMedia.rendered;
      // let imageUrl = ``;
      var imageUrl = firstFeaturedMedia.source_url;
      return '\n      <img alt="' + imageTitle + '" src="' + imageUrl + '">\n      <h3>' + headline + '</h3>\n    ';
    }
  }]);

  return InTheHeadlines;
}();

exports.default = InTheHeadlines;

},{}],3:[function(require,module,exports){
'use strict';

var _inTheHeadlines = require('./in-the-headlines');

var _inTheHeadlines2 = _interopRequireDefault(_inTheHeadlines);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fetchJsonp = require('fetch-jsonp');

fetchJsonp('http://munews.wpengine.com/wp-json/wp/v2/posts?categories=8&_embed', {
  jsonpCallback: '_jsonp'
}).then(function (response) {
  return response.json();
}).then(function (json) {
  console.log('parsed json', json);
  var ith = new _inTheHeadlines2.default(json);
  var ithContainer = document.getElementById('in-the-headlines-container');
  // console.log(ithContainer);
  ithContainer.innerHTML = ith.toHtml();
}).catch(function (ex) {
  console.log('parsing failed', ex);
});

},{"./in-the-headlines":2,"fetch-jsonp":1}]},{},[3]);
