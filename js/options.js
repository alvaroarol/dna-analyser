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

//Loads options into the checkboxes and adds an event listener that saves any change to the options object
for(var i in options){
  var checkBox = document.getElementById(i);
  checkBox.checked = options[i];
  document.getElementById(i).addEventListener("click", function(){
    options[this.id] = this.checked;
  });
}
