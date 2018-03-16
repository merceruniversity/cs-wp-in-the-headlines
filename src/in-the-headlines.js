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
    console.log(slidesHtml, 'slidesHtml in toHtml');

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
        
        <!-- If we need pagination -->
        <div class="swiper-pagination"></div>
     
        <!-- If we need navigation buttons -->
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
        
      </div>
    `;
  }

  slideHtml (slideData) {
    return `
      <div class="swiper-slide">
        <img alt="${imageAlt}" src="${imageUrl}">
        <h3><a href="${articleUrl}">${headline}</a></h3>
      </div>
    `;
  }
}