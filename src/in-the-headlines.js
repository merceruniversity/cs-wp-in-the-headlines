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
      <div class="carousel">
        ${slidesHtml}
      </div>
    `;
  }

  slideHtml (slideData) {
    console.log(slideData);
    // console.log(slideData.title);
    // console.log(slideData.title.rendered);
    // console.log(slideData._embedded['wp:featuredmedia']);
    let firstFeaturedMedia = slideData._embedded['wp:featuredmedia'][0];
    let headline = slideData.title.rendered;
    // let imageTitle = ``;
    let imageTitle = firstFeaturedMedia.rendered;
    // let imageUrl = ``;
    let imageUrl = firstFeaturedMedia.source_url;
    return `
      <div class="carousel-cell">
        <img alt="${imageTitle}" src="${imageUrl}">
        <h3>${headline}</h3>
      </div>
    `;
  }
}