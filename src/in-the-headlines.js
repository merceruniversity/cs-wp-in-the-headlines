export default class InTheHeadlines {
  constructor (json) {
    this.json = json;
  }

  toHtml () {
    let slidesHtml = this.json;

    slidesHtml = slidesHtml.map((slide) => this.slideHtml(slide));
    console.log(slidesHtml);
    slidesHtml = slidesHtml.join('');
    console.log(slidesHtml);

    return `
      <div class="carousel">
        ${slidesHtml}
      </div>
    `;
  }

  slideHtml (slideData) {
    console.log(slideData);
    console.log(slideData.title);
    console.log(slideData.title.rendered);
    let headline = slideData.title.rendered;
    return `
      <h3>${headline}</h3>
    `;
  }
}