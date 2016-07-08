var options = {
  "Format DNA sequence": true,
  "Format protein sequence" : true,
  "Nucleotide frequency" : true,
  "Molecular weight" : true,
  "CpG islands" : true,
  "Translation prediction" : true,
};

var openOptions = function(){
  //Open a new page for the options
  var openWindow = window.open();
  //Add all the options checkboxes with their stored value
  for(var i in options){
    var checkBox = openWindow.document.createElement("input");
    checkBox.id = i;
    checkBox.type = "checkbox";
    checkBox.checked = options[i];
    var checkBoxDiv = openWindow.document.createElement("div");
    checkBoxDiv.id = i + "div";
    var DivText = openWindow.document.createTextNode(i);
    checkBoxDiv.appendChild(checkBox);
    checkBoxDiv.appendChild(DivText);
    openWindow.document.body.appendChild(checkBoxDiv);
    //Event listener to save changes in options
    checkBox.addEventListener("click", function(){
      options[this.id] = this.checked;
    });
  }
  //Add a close window option
  var optionsButton = openWindow.document.createElement("button");
  optionsButton.innerHTML = "Save";
  optionsButton.onclick = (function(){openWindow.close();});
  openWindow.document.body.appendChild(optionsButton);
};
