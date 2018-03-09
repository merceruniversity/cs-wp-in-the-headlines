# cs-wp-in-the-headlines
A CommonSpot element to render news articles for the In The Headlines section of homepages from a JSONP feed from WordPress.

- [jQuery](https://jquery.com/)
- [Swiper](http://idangero.us/swiper/)

## Sample Markup

```html

  <div class="NewsArticleInTheHeadlines">

    <div class="NewsArticleInTheHeadlines-container">

      <div class="swiper-container">

        <div class="swiper-wrapper">

          <!-- Begin Slide 1 -->
          <div class="swiper-slide">
            <div class="NewsArticleInTheHeadlines-slide">
              <a class="NewsArticleInTheHeadlines-link" href="http://theangrypolicecaptain.com/" title="Mercer Innovation Center Names Inaugural Class of Mercer Innovation Fellows">
                <div class="NewsArticleInTheHeadlines-image swiper-lazy" data-background="./assets/images/MIC.jpg">
                  <div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
                  <div class="NewsArticleInTheHeadlines-imagePlaceholder" style="background-image: url(./assets/images/MIC_thumbnail.jpg);"></div>
                </div>
                <h3 class="NewsArticleInTheHeadlines-headline">
                  Mercer Innovation Center Names Inaugural Class of Mercer Innovation Fellows
                </h3>
              </a>
            </div>
          </div>
          <!-- End Slide 1 -->

        </div><!-- .swiper-wrapper -->

        <div class="NewsArticleInTheHeadlines-navigation">
          <div class="NewsArticleInTheHeadlines-buttonOutside">
            <button class="NewsArticleInTheHeadlines-button NewsArticleInTheHeadlines-button--prev" type="button">
              <span class="NewsArticleInTheHeadlines-buttonText">Previous</span>
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewbox="0 0 14.83 24" width="14.83">
                <path d="M14.83 21.17L5.66 12l9.17-9.17L12 0 0 12l12 12z"/><path d="M-16-12h48v48h-48z" fill="none"/>
              </svg>
            </button>
          </div>
          <div class="NewsArticleInTheHeadlines-paginationOutside">
            <div class="NewsArticleInTheHeadlines-pagination"></div>
          </div>
          <div class="NewsArticleInTheHeadlines-buttonOutside">
            <button class="NewsArticleInTheHeadlines-button NewsArticleInTheHeadlines-button--next" type="button">
              <span class="NewsArticleInTheHeadlines-buttonText">Next</span>
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewbox="0 0 14.83 24" width="14.83">
                <path d="M0 21.17L9.17 12 0 2.83 2.83 0l12 12-12 12z"/><path d="M-17.17-12h48v48h-48z" fill="none"/>
              </svg>
            </button>
          </div>
        </div>

      </div><!-- .swiper-container -->

    </div><!-- .NewsArticleInTheHeadlines-container -->

  </div><!-- .NewsArticleInTheHeadlines -->

```