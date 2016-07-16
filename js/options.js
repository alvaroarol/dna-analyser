var options = {
  "formatDNA": true,
  "formatProt" : true,
  "nuclFreq" : true,
  "molWeight" : true,
  "cpg" : true,
  "translation" : true,
  "revComp" : true,
  "orderGraph" : true
};

var openOptions = function(){
  document.getElementById("checkBoxDiv").style.display = "block";
  for(var i in options){
    var checkBox = document.getElementById(i);
    checkBox.checked = options[i];
  }
};

var closeOptions = function(){
  document.getElementById("checkBoxDiv").style.display = "none";
  for(var i in options){
    var checkBox = document.getElementById(i);
    options[i] = checkBox.checked;
  }
};
