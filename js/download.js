var formatForDownload = function(){
  //Create html page with show/hide button script
  var results = [
  "<script>"+
  "var showHideButton = function(divId,buttonId){"+
  "if(document.getElementById(buttonId).className === \"show\"){"+
  	"document.getElementById(divId + \"span\").style.display = \"block\";"+
  	"document.getElementById(buttonId).value = \"Hide\";"+
  	"document.getElementById(buttonId).className = \"hide\";"+
  	"}"+
  	"else{"+
  	"document.getElementById(divId + \"span\").style.display = \"none\";"+
  	"document.getElementById(buttonId).value = \"Show\";"+
  	"document.getElementById(buttonId).className = \"show\";"+
  	"}"+
  "};"+
  "</script>"
  ]
  //Add css style
  results.push("<style>body{font-family:monospace;}p{font-family:\"calibri\";font-weight:bold;}#hr{width:550px;margin-left:0px;margin-top:5px;margin-bottom:5px;border-style:dotted;border-width:1px;}#formattedseq,#nucleotidefreq,#cpgislands,#molweightDNA,#shorttranslatedseq3,#reverse-complement{border-bottom-style:solid;border-width:1px;}#formattedseq,#translatedseq1,#translatedseq2,#translatedseq3,#shorttranslatedseq1,#shorttranslatedseq2,#shorttranslatedseq3,#reverse,#complement,#reverse-complement{word-wrap:break-word;}</style>");
  //Add results
  results.push(document.getElementById("results").outerHTML);
  var resultsArray = [results.join("")];
  return resultsArray;
};


var downloadResults = function(){
  //Create blob of the results (blob must be an array)
  var blobArray = [formatForDownload()];
  var blob = new Blob(blobArray);
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
