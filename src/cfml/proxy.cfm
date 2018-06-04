<cfset theUrl="#url.url#&_jsonp=#url._jsonp#">
<!--- <cfoutput>#theUrl#</cfoutput> --->
<!--- <cfexit> --->
<cfhttp url="#theUrl#">
<cfheader
    name="Content-Type"
    value="#cfhttp.mimeType#">
<cfoutput>#cfhttp.FileContent#</cfoutput>
