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

  let mySwiper = new Swiper (container, options);
};

let renderInstance = function(instance) {
  // console.log(instance);
  let url = instance.getAttribute('data-url');
  // console.log(url);
  fetchJsonp(url, {
    jsonpCallback: '_jsonp',
    timeout: 10000
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
