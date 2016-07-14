//Adds click() function to Firefox
if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){
  HTMLElement.prototype.click = function() {
  var evt = this.ownerDocument.createEvent('MouseEvents');
  evt.initMouseEvent('click', true, true, this.ownerDocument.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
  this.dispatchEvent(evt);
  };
}

var formatForDownload = function(){
  //Create html page with show/hide button script (showHideButton function compressed with http://jscompress.com/)
  var results = ["<script>var showHideButton=function(e,t){\"show\"===document.getElementById(t).className?(document.getElementById(e+\"span\").style.display=\"block\",document.getElementById(t).value=\"Hide\",document.getElementById(t).className=\"hide\"):(document.getElementById(e+\"span\").style.display=\"none\",document.getElementById(t).value=\"Show\",document.getElementById(t).className=\"show\")};</script>"];
  //Add css style (index.css compressed with https://cssminifier.com/)
  results.push("<style>body{font-family:calibri;}#hr{width:550px;margin-left:0;margin-top:5px;margin-bottom:5px;border-style:dotted;border-width:1px}#complement,#formattedseq,#reverse,#reverse-complement,#shorttranslatedseq1,#shorttranslatedseq2,#shorttranslatedseq3,#translatedseq1,#translatedseq2,#translatedseq3{word-wrap:break-word}#cpgislands,#formattedseq,#molweightDNA,#nucleotidefreq,#reverse-complement,#shorttranslatedseq3{display:none;border-bottom-style:solid;border-width:1px}#cpgislandsspan,#formattedseqspan,#molweightDNAspan,#nucleotidefreqspan{padding-bottom:20px}#codonfreq1,#codonfreq2,#codonfreq3,#complement,#reverse,#shorttranslatedseq1,#shorttranslatedseq2,#translatedseq1,#translatedseq2,#translatedseq3{display:none}#reverse-complement span,#shorttranslatedseq3 span{padding-bottom:10px}#codonfreq1span,#codonfreq2span,#codonfreq3span,#complementspan,#cpgislandsspan,#formattedseqspan,#molweightDNAspan,#nucleotidefreqspan,#reverse-complementspan,#reversespan,#shorttranslatedseq1span,#shorttranslatedseq2span,#shorttranslatedseq3span,#translatedseq1span,#translatedseq2span,#translatedseq3span{font-family:monospace;font-size:13px;display:none}#cpgislands p,#formattedseq p,#molweightDNA p,#nucleotidefreq p,#translatedseq1 p,#translatedseq2 p,#translatedseq3 p{font-weight:700}#codonfreq1 p,#codonfreq2 p,#codonfreq3 p,#complement p,#reverse p,#reverse-complement p,#shorttranslatedseq1 p,#shorttranslatedseq2 p,#shorttranslatedseq3 p{font-weight:700;padding-left:10px;border-left-style:solid;border-left-width:1px}#codonfreq1span,#codonfreq2span,#codonfreq3span,#complementspan,#reverse-complementspan,#reversespan,#shorttranslatedseq1span,#shorttranslatedseq2span,#shorttranslatedseq3span{padding-left:10px}</style>");
  //Add results
  results.push(document.getElementById("results").outerHTML);
  //Join the script, style and results into a single element array (requirement to create blob)
  var resultsArray = [results.join("")];
  return resultsArray;
};


var downloadResults = function(){
  //Create blob of the results
  var blob = new Blob(formatForDownload());
  //Create URL of blob
  var url = URL.createObjectURL(blob);
  //Create clickable link that downloads the blob via the blob url
  var link = document.createElement("a");
  link.href = url;
  //Default download name is date + .html
  var localTime = new Date();
  link.download = localTime.getFullYear() + "-" + ("0" + (localTime.getMonth() + 1)).slice(-2) + "-" + ("0" + localTime.getDate()).slice(-2) + "_results.html";
  link.click();
};
