/**
 * @author Todd Sayre
 */

'use strict';

import MuNewsFeed from './mu-news-feed';
import InTheHeadlines from './in-the-headlines';

const fetchJsonp = require('fetch-jsonp');

let initSwiper = function(instance) {
  let container = instance.querySelectorAll('.swiper-container');

  let options = {};
  // Matt likes it when it loops
  options.grabCursor = true;
  options.loop = true;
  options.paginationClickable = true;
  options.slidesPerView = 4;
  options.slidesPerGroup = 4;
  options.spaceBetween = 40;

  // Pagination 'pips'
  options.pagination = '.in-the-headlines__pagination';

  // Navigation 'Previous' & 'Next' buttons
  options.nextButton = '.in-the-headlines__button--next';
  options.prevButton = '.in-the-headlines__button--prev';

  // Breakpoints synchronized with Bootstrap
  options.breakpoints = {};
  // When window width is < 1200
  options.breakpoints[1199] = {};
  options.breakpoints[1199].slidesPerView = 3;
  options.breakpoints[1199].slidesPerGroup = 3;
  options.breakpoints[1199].spaceBetween = 30;
  // When window width is < 992px
  options.breakpoints[991] = {};
  options.breakpoints[991].slidesPerView = 2;
  options.breakpoints[991].slidesPerGroup = 2;
  options.breakpoints[991].spaceBetween = 20;
  // When window width is < 768px
  options.breakpoints[767] = {};
  options.breakpoints[767].slidesPerView = 2;
  options.breakpoints[767].slidesPerGroup = 2;
  options.breakpoints[767].spaceBetween = 10;

  let mySwiper = new Swiper (container, options);
};

let renderInstance = function(instance) {
  // console.log(instance);
  let url = instance.getAttribute('data-url');
  // console.log(url);
  fetchJsonp(url, {
    jsonpCallback: '_jsonp',
    timeout: 30000
  }).then((response) => {
    return response.json();
  }).then((json) => {
    // console.log('parsed articles', articles);
    let munf = new MuNewsFeed(json);
    let articles = munf.getArticles();
    let ith = new InTheHeadlines(articles);
    instance.innerHTML = ith.toHtml();
    initSwiper(instance);
  }).catch((ex) => {
    console.log('parsing failed', ex);
  });
  // initSwiper(instance);
};

let onDomLoad = function() {
  let instances = document.querySelectorAll('.in-the-headlines');
  instances.forEach(instance => renderInstance(instance));
};

document.addEventListener('DOMContentLoaded', onDomLoad);
