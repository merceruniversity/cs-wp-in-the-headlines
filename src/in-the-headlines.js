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
        <div class="in-the-headlines__prev">
            <span class="sr-only">Previous</span>
            <!-- SVG -->
        </div>
        <div class="in-the-headlines__next">
            <span class="sr-only">Next</span>
            <!-- SVG -->
        </div>
        
      </div>
    `;
  }

  slideHtml (slideData) {
    return `
      <div class="swiper-slide">
        <div class="in-the-headlines__slide">
          <a class="in-the-headlines__image-link" href="${slideData.articleUrl}">
            <img class="in-the-headlines__image" alt="${slideData.imageAlt}" src="${slideData.imageUrl}">
          </a>
          <h3 class="in-the-headlines__headline">
            <a class="in-the-headlines__headline-link" href="${slideData.articleUrl}">${slideData.headline}</a>
          </h3>
        </div>
      </div>
    `;
  }
}