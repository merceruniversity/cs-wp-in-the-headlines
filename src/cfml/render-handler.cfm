<cfscript>
  /**
  * Author: Todd Sayre
  * Created: 2018-03-09 13:16
  */

  // request.element.isStatic = 0;

  Server.CommonSpot.udf.resources.loadResources('swiper');
  Server.CommonSpot.udf.resources.loadResources('news-mercer-edu-feed');

  if (0 eq ArrayLen(attributes.elementInfo.elementData.propertyValues)) {
    exit;
  }

  properties = attributes.elementInfo.elementData.propertyValues;
</cfscript>

<cfif 0 lt arrayLen(properties)>
  <cfscript>
    values = properties[1].values;

    feedURL = values.feed_url;

    /* Proxy the feed to reduce WP Engine traffic {{{ */
    thisFilePath = GetCurrentTemplatePath();
    thisFileName = getFileFromPath(thisFilePath);
    thisDirectoryPath = replace(thisFilePath, thisFileName, '');
    proxyFileName = 'proxy.cfm';
    proxyPath = '#thisDirectoryPath##proxyFileName#';
    // Convert from file path to URL path
    proxyURL = proxyPath;
    proxyURL = replace(proxyURL, 'E:\commonspot-root\', '');
    proxyURL = replace(proxyURL, '\', '/', 'all');
    proxyURL = 'https://devauthor.mercer.edu/#proxyURL#';
    feedURL = '#proxyURL#?url=#encodeForURL(feedURL)#';
    /* }}} */

    moreNewsLinkText = values.more_news_link_text;
    moreNewsLinkURL = values.more_news_link_url;
  </cfscript>
  <cfoutput>
    <div
      class="in-the-headlines"
      data-url="#feedURL#"></div>
    <div class="in-the-headlines__more-news-wrapper">
      <a class="in-the-headlines__more-news" href="#moreNewsLinkURL#">#moreNewsLinkText#</a>
    </div>
  </cfoutput>
</cfif>
