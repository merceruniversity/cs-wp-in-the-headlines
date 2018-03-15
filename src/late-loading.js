'use strict';

const fetchJsonp = require('fetch-jsonp');

import InTheHeadlines from './in-the-headlines';

fetchJsonp('http://munews.wpengine.com/wp-json/wp/v2/posts?categories=8&_embed', {
  jsonpCallback: '_jsonp'
}).then(function(response) {
  return response.json();
}).then(function(json) {
  console.log('parsed json', json);
  let ith = new InTheHeadlines(json);
  let ithContainer = document.getElementById('in-the-headlines-container');
  // console.log(ithContainer);
  ithContainer.innerHTML = ith.toHtml();
}).catch(function(ex) {
  console.log('parsing failed', ex);
});
