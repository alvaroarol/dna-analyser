//Saves the results locally
var saveResults = function(){
	var saveName = document.getElementById("savename").value;
	if(saveName != ""){
		localStorage.setItem(saveName,document.getElementById("results").outerHTML);
		var option = document.createElement("option");
		option.text = saveName;
		document.getElementById("selectsave").add(option);
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

//Writes the result of the function to HTML
var writeToHtml = function(result,divId){
	document.getElementById(divId + "span").innerHTML = "";
	if(result != ""){
		//Write the result text to the span
		document.getElementById(divId + "span").innerHTML = result;
		document.getElementById(divId + "span").style.display = "none";
		//Set the button values
		document.getElementById(divId + "button").value = "Show";
		document.getElementById(divId + "button").className = "show";
		//Display the div
		document.getElementById(divId).style.display = "block";
	}
	else{
		document.getElementById(divId).style.display = "none";
	}
};

//Switches the div and button between hide and show
var showHideButton = function(divId,buttonId){
	if(document.getElementById(buttonId).className === "show"){
		document.getElementById(divId + "span").style.display = "block";
		document.getElementById(buttonId).value = "Hide";
		document.getElementById(buttonId).className = "hide";
	}
	else{
		document.getElementById(divId + "span").style.display = "none";
		document.getElementById(buttonId).value = "Show";
		document.getElementById(buttonId).className = "show";
	}
};

//Main function
var analyseDNA = function(){
	//Gets submitted DNA sequence
	var submittedSequence = document.getElementById("DNA").value;
	//Formats the sequence to have a continuous series of letters (removes numbers, blanks, hyphens, tabs and line breaks)
	var formattedSequence = submittedSequence.split(/[0-9]|\s|\n|\t|\/|\-/g).join("").toUpperCase();
	//If sequence hasn't got any non-nucleotide characters, analyse it
	if(isSequenceValid(formattedSequence)){
		//Analyse
		var formattedSequenceText = formatSequence(formattedSequence);
		var nucleotideFrequencies = nucleotideFrequency(formattedSequence);
		var nucleotideFrequenciesArray = [];
		for(var nucleotide in nucleotideFrequencies){
			nucleotideFrequenciesArray.push(nucleotide + " : " + ((nucleotideFrequencies[nucleotide] / formattedSequence.length) * 100).toFixed(2) + "% (" + nucleotideFrequencies[nucleotide] + ")");
		}
		var molWeightDNA = molecularWeight(formattedSequence);
		var cpgIslands = findCpGIslands(formattedSequence);
		var cpgIslandsText = [];
		if((cpgIslands != "none") && (cpgIslands[0][0] != undefined)){
			for(var i = 0; i < cpgIslands[0].length - 1; i ++){
				cpgIslandsText.push("Start : " + cpgIslands[0][i] + " / End : " + cpgIslands[1][i]);
			}
		}
		else{
			cpgIslandsText = [""];
		}
		var translatedSequences = [
			translation(formattedSequence),
			translation(formattedSequence.slice(1, formattedSequence.length + 1)),
			translation(formattedSequence.slice(2, formattedSequence.length + 1))
		];
		var codonFrequencies = [codonFreq(translatedSequences[0]),codonFreq(translatedSequences[1]),codonFreq(translatedSequences[2])];
		var codonFrequenciesText = [[],[],[]];
		for(var i = 0; i < codonFrequencies.length; i ++){
			for(var freq in codonFrequencies[i]){
				codonFrequenciesText[i].push(freq + " : " + ((codonFrequencies[i][freq] / translatedSequences[i].length) * 100).toFixed(2) + "% (" + codonFrequencies[i][freq] + ")");
			}
		}
		var possibleProtein = [translationShort(translatedSequences[0]),translationShort(translatedSequences[1]),translationShort(translatedSequences[2])];
		var possibleProteinText = [[],[],[]];
		for(var i = 0; i < possibleProtein.length; i ++){
			for(var j = 0; j < possibleProtein[i].length; j ++){
				possibleProteinText[i][j] = formatSequence(possibleProtein[i][j]);
			}
		}

		//Display results on the page
		writeToHtml(formattedSequenceText, "formattedseq");
		writeToHtml(nucleotideFrequenciesArray.join("<br/>"), "nucleotidefreq");
		writeToHtml(molWeightDNA[0].toFixed(2) + " Da (" + molWeightDNA[1] + " kDa)", "molweightDNA");
		writeToHtml(cpgIslandsText.join("<br/>"), "cpgislands");
		for(var i = 0; i < translatedSequences.length; i ++){
			writeToHtml(formatSequence(translatedSequences[i]), "translatedseq" + (i+1));
			writeToHtml(codonFrequenciesText[i].join("<br/>"), "codonfreq" + (i+1));
			writeToHtml(possibleProteinText[i].join("<div id=\"hr\"></div>"), "shorttranslatedseq" + (i+1));
		}
	}
	//If there are non-nucleotide characters, abort and warn user
	else{
		alert("The sequence contains at least one forbidden character! (See description above input box)");
	}
};
