/**
 * @author Todd Sayre
 */

const objectHas = require('object-has');
const objectGet = require('object-get');

/**
 * Turns the WP API JSONP URL into an array of
 */
export default class MuNewsFeed {
  /**
   * Create a news feed
   * @param {string} json - The URL to the JSONP feed
   */
  constructor(json) {
    let tmpJson = json;
    tmpJson = this.filterNoImageArticles(tmpJson);
    this.json = tmpJson;
  }

  /**
   * Return the articles in an array
   * @return {array} The articles that can be rendered
   */
  getArticles() {
    return this.usefulData(this.json);
  }

  /**
   * Returns just the useful parts of the JSON feed
   * @param {object} json
   */
  usefulData (json) {
    console.log(json, 'json in usefulData');
    return json.map((datum) => {
      let imageAlt = objectGet(datum, '_embedded.wp:featuredmedia[0].alt_text');
      if (0 === imageAlt.length) {
        imageAlt = objectGet(datum, '_embedded.wp:featuredmedia[0].caption.rendered');
      }
      if (0 === imageAlt.length) {
        imageAlt = objectGet(datum, '_embedded.wp:featuredmedia[0].title.rendered');
      }
      let usefulDatum = {};
      usefulDatum.articleUrl = objectGet(datum, 'link');
      usefulDatum.headline   = objectGet(datum, 'title.rendered');
      usefulDatum.imageUrl   = objectGet(datum, '_embedded.wp:featuredmedia[0].media_details.sizes.bk620_420.source_url');
      usefulDatum.imageAlt   = imageAlt;
      return usefulDatum;
    });
  }

  /**
   * Return only the articles with appropriately-sized images
   * @param {object} json - The WP API JSON feed
   * @returns {object}
   */
  filterNoImageArticles (json) {
    return json.filter((post) => {
      return objectHas(post, '_embedded.wp:featuredmedia[0].media_details.sizes.bk620_420');
    });
  }
}