<cfscript>

/**
 * Author: Todd Sayre
 * Created: 2018-03-09 13:16
 */

Server.CommonSpot.udf.resources.loadResources('flickity');

InTheHeadlines = new InTheHeadlines(attributes);

writeOutput(InTheHeadlines.toHTML());

</cfscript>