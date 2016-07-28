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
  var results = ["<script>var showHideButton=function(e,t){\"showbutton\"===document.getElementById(t).className?(document.getElementById(e+\"span\").style.display=\"block\",document.getElementById(t).value=\"Hide\",document.getElementById(t).className=\"hidebutton\"):(document.getElementById(e+\"span\").style.display=\"none\",document.getElementById(t).value=\"Show\",document.getElementById(t).className=\"showbutton\")};</script>"];
  //Add css style (index.css compressed with https://cssminifier.com/)
  results.push("<style>body{width:900px;font-family:calibri;font-size:16px;display:block;margin-left:10px;}img{max-width:2000px;}#hr,#nucleotidefreq img{border-style:solid;border-color:#d3d6db}.hide,.monospace{display:none}#nucleotidefreq img{background-color:#fff;border-width:2px}#codonfreq1 img,#codonfreq2 img,#codonfreq3 img,#nucleotidepairfreq img{position:relative;left:-10px;background-color:#fff;border-color:#d3d6db;border-style:solid;border-width:2px}#hr{margin-top:5px;margin-bottom:5px;border-width:1px}.hidebutton,.showbutton{background-color:#3c579d;color:#fff;width:50px;border:none;margin-bottom:10px;margin-top:10px;cursor:pointer}.break-word{word-wrap:break-word}.resulttitle{font-weight:700;margin-top:5px;margin-bottom:5px}.monospace{font-family:monospace;font-size:13px;padding-left:60px}#individualcodonfreqspan{height:350px}.icodondiv{float:left;margin-right:60px}#cpgislands,#individualcodonfreq,#molweightDNA,#nucleotidefreq,#reverse,#translatedseq1,#translatedseq2,#translatedseq3{border-top-style:solid;border-width:1px}#cpgislandsspan,#formattedseqspan,#molweightDNAspan,#nucleotidefreqspan,#reverse-complementspan,#shorttranslatedseq1span,#shorttranslatedseq2span,#shorttranslatedseq3span{padding-bottom:10px}</style>");
  //Add results
  results.push(document.getElementById("results").outerHTML);
  //Add fix for images size
  results.push("<script>for(var i=0;0<document.images.length;i++){document.images[i].style.maxWidth=\"2000px\"};</script>");
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
