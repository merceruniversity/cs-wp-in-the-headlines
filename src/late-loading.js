'use strict';

const fetchJsonp = require('fetch-jsonp');

import InTheHeadlines from './in-the-headlines';

let renderSwiper = function(instance) {
  let container = instance.querySelectorAll('.swiper-container');
  let options = {
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
  }
  let mySwiper = new Swiper (container, options);
}

let renderInstance = function(instance) {
  console.log(instance);
  let url = instance.getAttribute('data-url');
  fetchJsonp(url, {
    jsonpCallback: '_jsonp'
  }).then(function(response) {
    return response.json();
  }).then(function(json) {
    console.log('parsed json', json);
    let ith = new InTheHeadlines(json);
    // console.log(ithContainer);
    instance.innerHTML = ith.toHtml();
    renderSwiper(instance);
  }).catch(function(ex) {
    console.log('parsing failed', ex);
  });
}

let onDomLoad = function() {
  let inTheHeadlines = document.querySelectorAll('.in-the-headlines');
  inTheHeadlines.forEach(instance => renderInstance(instance));
}

document.addEventListener('DOMContentLoaded', onDomLoad);
