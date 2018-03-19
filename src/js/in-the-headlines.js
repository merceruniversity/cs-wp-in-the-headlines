/**
 * @author Todd Sayre
 */

/** Class rendering the markup for the element */
export default class InTheHeadlines {
  /**
   * Creates the class just to render out the HTML
   * @param {array} articles - The articles processed from JSONP
   */
  constructor (articles) {
    this.articles = articles;
  }

  toHtml () {
    let slidesHtml = this.articles;
    // console.log(slidesHtml, 'slidesHtml in toHtml');

    slidesHtml = slidesHtml.map((slide) => this.slideHtml(slide));
    slidesHtml = slidesHtml.join('');

    return `
      <!-- Slider main container -->
      <div class="swiper-container">
      
        <!-- Additional required wrapper -->
        <div class="swiper-wrapper">
          <!-- Slides -->
          ${slidesHtml}
        </div>
     
        <div class="in-the-headlines__controls">
          <div class="in-the-headlines__button in-the-headlines__button--prev">
            <span class="visually-hidden">Previous Page of Articles</span>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 14.83 24" width="14.83"><path d="M14.83 21.17L5.66 12l9.17-9.17L12 0 0 12l12 12z"></path><path d="M-16-12h48v48h-48z" fill="none"></path></svg>
          </div>
          <div class="in-the-headlines__pagination"></div>
          <div class="in-the-headlines__button in-the-headlines__button--next">
            <span class="visually-hidden">Next Page of Articles</span>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 14.83 24" width="14.83"><path d="M0 21.17L9.17 12 0 2.83 2.83 0l12 12-12 12z"></path><path d="M-17.17-12h48v48h-48z" fill="none"></path></svg>
          </div>
        </div>
        
      </div>
    `;
  }

  slideHtml (slideData) {
    return `
      <div class="swiper-slide">
        <div class="in-the-headlines__slide">
          <a class="in-the-headlines__link in-the-headlines__link--image" href="${slideData.articleUrl}">
            <img class="in-the-headlines__image"
                alt="${slideData.imageAlt}"
                src="${slideData.imageUrl}"
                width="${slideData.imageWidth}"
                height="${slideData.imageHeight}">
          </a>
          <h3 class="in-the-headlines__headline">
            <a class="in-the-headlines__link in-the-headlines__link--headline" href="${slideData.articleUrl}">${slideData.headline}</a>
          </h3>
        </div>
      </div>
    `;
  }
}