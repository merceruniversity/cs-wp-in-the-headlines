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
    this.url = json;
  }

  /**
   * Return the articles in an array
   * @return {array} The articles that can be rendered
   */
  getArticles() {
    // let articles = fetchJsonp(this.url, {
    //   jsonpCallback: '_jsonp'
    // }).then((response) => {
    //   return response.json();
    // }).then((json) => {
    //   // console.log('parsed articles', articles);
    //   json = this.filterNoImageArticles(json);
    //   console.log(json, 'articles filtered for just good images');
    //   let usefulData = this.usefulData(json);
    //   console.log(usefulData, 'just the useful data');
    //   return usefulData;
    // }).catch((ex) => {
    //   console.log('parsing failed', ex);
    // });
    // console.log(articles, 'articles in getArticles');
    // return articles;
  }

  /**
   * Returns just the useful parts of the JSON feed
   * @param {object} json
   */
  usefulData (json) {
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
      usefulDatum.imageUrl   = objectGet(datum, '_embedded.wp:featuredmedia[0].media_details.sizes.bk620_420');
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