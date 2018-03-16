/**
 * @author Todd Sayre
 */

'use strict';

import MuNewsFeed from './mu-news-feed';
import InTheHeadlines from './in-the-headlines';

const fetchJsonp = require('fetch-jsonp');

// let renderSwiper = function(instance) {
//   let container = instance.querySelectorAll('.swiper-container');
//   let options = {
//     // Optional parameters
//     loop: true,
//
//     // If we need pagination
//     pagination: {
//       el: '.swiper-pagination',
//     },
//
//     // Navigation arrows
//     navigation: {
//       nextEl: '.swiper-button-next',
//       prevEl: '.swiper-button-prev',
//     },
//
//     // And if we need scrollbar
//     //scrollbar: {
//     //  el: '.swiper-scrollbar',
//     //},
//
//     // Default parameters
//     slidesPerView: 4,
//     spaceBetween: 40,
//
//     // Responsive breakpoints
//     breakpoints: {
//
//       // when window width is <= 1440px
//       1440: {
//         slidesPerView: 3,
//         spaceBetween: 30
//       },
//
//       // when window width is <= 1024px
//       1024: {
//         slidesPerView: 2,
//         spaceBetween: 20
//       },
//
//       // when window width is <= 768px
//       768: {
//         slidesPerView: 1,
//         spaceBetween: 10
//       }
//     }
//   }
//   let mySwiper = new Swiper (container, options);
// };

let renderInstance = function(instance) {
  console.log(instance);
  let url = instance.getAttribute('data-url');
  // console.log(url);
  fetchJsonp(url, {
    jsonpCallback: '_jsonp'
  }).then((response) => {
    return response.json();
  }).then((json) => {
    // console.log('parsed articles', articles);
    let munf = MuNewsFeed(json);
    articles = munf.getArticles();
    let ith = InTheHeadlines(articles);
    instance.innerHTML = ith.toHtml();
    // TODO: initSwiper
  }).catch((ex) => {
    console.log('parsing failed', ex);
  });
  console.log(articles, 'articles in getArticles');
  return articles;
  let munf = new MuNewsFeed(url);
  let articles = munf.getArticles();
  let ith = new InTheHeadlines(articles);
  instance.innerHTML = ith.toHtml();
  // renderSwiper(instance);
};

let onDomLoad = function() {
  let instances = document.querySelectorAll('.in-the-headlines');
  instances.forEach(instance => renderInstance(instance));
};

document.addEventListener('DOMContentLoaded', onDomLoad);
