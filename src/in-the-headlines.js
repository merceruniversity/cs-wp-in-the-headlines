export default class InTheHeadlines {
  constructor (json) {
    this.json = json;
  }

  toHtml () {
    let slidesHtml = this.json;

    slidesHtml = slidesHtml.map((slide) => this.slideHtml(slide));
    // TODO: filter for only articles with featured images
    // console.log(slidesHtml);
    slidesHtml = slidesHtml.join('');
    // console.log(slidesHtml);

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
    console.log(slideData);
    // console.log(slideData.title);
    // console.log(slideData.title.rendered);
    // console.log(slideData._embedded['wp:featuredmedia']);
    // let imageUrl = ``;
    // let imageTitle = ``;
    let headline = slideData.title.rendered;
    let firstFeaturedMedia = slideData._embedded['wp:featuredmedia'][0];
    let imageTitle = firstFeaturedMedia.rendered;
    let imageUrl = firstFeaturedMedia.media_details.sizes.bk620_420.source_url;
    return `
      <div class="swiper-slide">
        <img alt="${imageTitle}" src="${imageUrl}">
        <h3><a href="${slideData.link}">${headline}</a></h3>
      </div>
    `;
  }
}