//Loads saved results to the list
var loadOldSaved = function(){
	var oldSavedArray = Object.keys(localStorage);
	for(var i = 0; i < oldSavedArray.length; i ++){
		var option = document.createElement("option");
		option.text = oldSavedArray[i];
		document.getElementById("selectsave").add(option);
	}
};

//Tests if localStorage still has enough space
var testStorage = function(value) {
  try{
    localStorage.setItem("testRemainingSpace",value);
		localStorage.removeItem("testRemainingSpace");
    return true;
  }
	catch (e) {
    return false;
  }
};

//Saves the results locally
var saveResults = function(){
	if(testStorage(document.getElementById("results").outerHTML)){
		var saveName = document.getElementById("savename").value;
		if(saveName != ""){
			localStorage.setItem(saveName,document.getElementById("results").outerHTML);
			var option = document.createElement("option");
			option.text = saveName;
			document.getElementById("selectsave").add(option);
		}
	}
	else{
		var storageUsed = (JSON.stringify(localStorage).length / (1024*1024)).toFixed(1);
		alert("The results you are trying to save exceed the remaining local storage. \nUsed space : " + storageUsed + " MB. \nTry erasing older saves to free space.");
	}
};

//Loads the results locally
var loadResults = function(){
	var loadName = document.getElementById("selectsave").value;
	if(loadName != ""){
		var openWindow = window.open();
		openWindow.document.write("<script type=\"text/javascript\" src=\"dna-analyser.js\"></script><link rel=\"stylesheet\" type=\"text/css\" href=\"index.css\"/>");
		openWindow.document.write("<div><h1>" + loadName + "</h1></div>");
		openWindow.document.write(localStorage.getItem(loadName));
	}
};

//Deletes entry in saved results
var deleteEntry = function(){
	var deleteName = document.getElementById("selectsave").value;
	if((deleteName != "") && (confirm("Are you sure you want to delete " + deleteName))){
		localStorage.removeItem(deleteName);
		document.getElementById("selectsave").remove(document.getElementById("selectsave").selectedIndex);
	}
};

//Loads sequence from a text file
var loadFromFile = function(){
  var fileInput = document.getElementById("loadfromfilebutton").files[0];
	if(fileInput.type.match("text.*")){
  	var reader = new FileReader();
  	reader.onload = function(event){
    	document.getElementById("DNA").value = event.target.result;
  	}
  	reader.readAsText(fileInput);
	}
	else{
		alert(fileInput.name + " is not a valid text file!")
	}
};

//Loads example sequence
var loadExample = function(){
  document.getElementById("DNA").value = exampleSeq;
};

var exampleSeq = "taacatacttattgtttttaactactcgttttccattcgactcatcacgctccccccccccccccccccccttatccgttccgttcgacgtatttcgttgtctaatttctgacgtaacttgttccctgttaagtaccgtttatggcctatactccggtatttaaaacgacgacgattccaccgtaaagccgtcaaccagatgaacgacctcgctcgttatatttttccggcaaaatccctatttccgattcgcttagtgctaccgacgctatatcgttccgcaattcctcgagatcatcgatttcttctccggcgacgtctcaagtttttccgttacaacgcgatctatcctgtaaattcgaccgcgctcattctcacgttttatacattgcgcagttgattacgctaaataatccgctgactgttaccttccctgttagattcgcgcattataaactacttactttaacaaacgattttcacagtttaatttctgcgatgacgtctaactcttcagttttaaccgataacaaccttctcgacacttcgtttcttataccatcctcgttatccatacccattcttaaatttctcactactattctctttacaaccacattagctctaatcttacatctaatttctatacataaaatgctccttctgctgtatgtttctctttctcataattacatttttaattactaaatccctcatccctcccacccatctattccaccatcaaggttatacaccatgtattactgtaaaacccactaatattaattgtcaccgatattaaacgaaattcattcacacaaatttcattaattaccttttcttattaattgcatatgtactctacatatactcaaccaactaaaaatcgatattttacatttgatttctaatgtaccccacaactttcttgctttatgattgaacttagctttataataatagttatttaccctaacgcatatactcttatccttatatgaaccttgcttatttgttagatttatccaatctaaaccacagataatatcccttctcttacttcattttattatcaccattttcacttcttcctagatatatacaattatataactctattaccacattttcccttaactttctgttctgcactattatatttactctttttctaaaaccttcttaactttttcagatgca"
