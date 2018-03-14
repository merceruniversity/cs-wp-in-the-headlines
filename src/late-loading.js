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
  var mySwiper = new Swiper ('.swiper-container', {
    // Optional parameters
    loop: true,

    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
    },

    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
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
  });
}).catch(function(ex) {
  console.log('parsing failed', ex);
});
