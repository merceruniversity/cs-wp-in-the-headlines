<cfhttp url="#url.url#">
<cfheader
    name="Content-Type"
    value="text/javascript">
<cfoutput>#cfhttp.FileContent#</cfoutput>
