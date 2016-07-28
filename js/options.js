var options = {
  "formatDNA": true,
  "formatProt" : true,
  "nuclFreq" : true,
  "iCodonFreq": true,
  "molWeight" : true,
  "revComp" : true,
  "cpg" : true,
  "translation" : true,
};

//Loads options into the checkboxes and adds an event listener that saves any change to the options object
for(var i in options){
  var checkBox = document.getElementById(i);
  checkBox.checked = options[i];
  checkBox.addEventListener("click", function(){
    options[this.id] = this.checked;
  });
}

//Selects or unselects all options
var selectAll = function (x){
  for(var i in options){
    if(x){
      document.getElementById(i).checked = true;
      options[i] = true;
    }
    else{
      document.getElementById(i).checked = false;
      options[i] = false;
    }
  }
};
