//Formats the sequence for a better display with blocks of 10, line-breaks every 60 nucleotides and an index before each line
var formatSequence = function(sequence){
	var spacedSequence = [];
	spacedSequence.push(Array(7).join("&nbsp") + 1 + " ");
	for(var i = 0; i < sequence.length; i++){
		var spaces = 7 - i.toString().length;
		if((i + 1) % 60 === 0){
			spacedSequence.push(sequence[i] + "<br/>" + Array(spaces + 1).join("&nbsp;") + (i + 2) + " ");
		}
		else if((i + 1) % 10 === 0){
			spacedSequence.push(sequence[i] + " ");
		}
		else{
			spacedSequence.push(sequence[i]);
		}
	}
	return spacedSequence.join("");
};

//Writes the result of the function to HTML
var writeToHtml = function(result, divId, formattable){
	//optional argument
	formattable = formattable || 0;

	//check if we want to format the result
	if(formattable && ((options["formatDNA"] && isSequenceValid(result)) || (options["formatProt"] && isSequenceValid(result) === false))){
		//if result is an object format each of it's elements
		if (typeof result === 'object'){
			for(var i = 0; i < result.length; i++){
				result[i] = formatSequence(result[i]);
			}
		}
		else{
			result = formatSequence(result);
		}
	}
	
	if(typeof result === 'object'){
		result = result.join("<div id=\"hr\"></div>");
	}

	document.getElementById(divId + "span").innerHTML = "";
	if(result != ""){
		//Write the result text to the span
		document.getElementById(divId + "span").innerHTML = result;
		document.getElementById(divId + "span").style.display = "none";
		//Set the button values
		document.getElementById(divId + "button").value = "Show";
		document.getElementById(divId + "button").className = "showbutton";
		//Display the div
		document.getElementById(divId).style.display = "block";
	}
	else{
		document.getElementById(divId).style.display = "none";
	}
};

//Switches the div and button between hide and show
var showHideButton = function(divId, buttonId){
	if(document.getElementById(buttonId).className === "showbutton"){
		document.getElementById(divId + "span").style.display = "block";
		document.getElementById(buttonId).value = "Hide";
		document.getElementById(buttonId).className = "hidebutton";
	}
	else{
		document.getElementById(divId + "span").style.display = "none";
		document.getElementById(buttonId).value = "Show";
		document.getElementById(buttonId).className = "showbutton";
	}
};

//Toggles the visibility of the about div when clicking the "about" button or the "x" close button
document.getElementById("about").style.display = "none";
var toggleAbout = function(){
	if(document.getElementById("about").style.display === "none"){
		document.getElementById("about").style.display = "block";
	}
	else{
		document.getElementById("about").style.display = "none";
	}
};

var startAnalyse = function(){
  if(document.getElementById("DNA").value.length > 3){
    //Changes cursor to waiting cursor and shows "working" in timer div
    document.getElementById("mask").style.display = "block";
    document.getElementById("timer").innerHTML = "Working...";
    //Launches main function
    setTimeout("analyseDNA()", 10);
    //Reverts waiting cursor back to normal
    setTimeout("document.getElementById(\"mask\").style.display = \"none\";", 10);
  }
};

//Opens a new page/tab at NCBI's BLAST (blastn suite) with the sequence in the textarea
var submitBLAST = function (id){
  var sequence = document.getElementById(id).value;
  var blastWindow = window.open("http://blast.ncbi.nlm.nih.gov/Blast.cgi?PAGE=Nucleotides&PROGRAM=blastn&PAGE_TYPE=BlastSearch&BLAST_SPEC=&QUERY=" + sequence);
};

//Returns an array of the ordered object keys by decreasing value
var orderObject = function(object){
  return Object.keys(object).sort(function(a,b){return object[a]-object[b]}).reverse();
};

/////////////////
//Main function//
/////////////////
var analyseDNA = function(){
	//Gets starting time (for execution time)
	var localTime = new Date();
	var startingTime = localTime.getTime();
	
	//Empty page contents
	var divsList = [
		"nucleotidefreq", 
		"nucleotidepairfreq", 
		"individualcodonfreq", 
		"molweightDNA", 
		"complement", 
		"reverse", 
		"reverse-complement", 
		"translatedseq1", 
		"translatedseq2", 
		"translatedseq3", 
		"codonfreq1", 
		"codonfreq2", 
		"codonfreq3", 
		"shorttranslatedseq1", 
		"shorttranslatedseq2", 
		"shorttranslatedseq3", 
		"cpgislands"
	];
	
	for(var i = 0; i < divsList.length; i++){
		document.getElementById(divsList[i] + "span").innerHTML = "";
		document.getElementById(divsList[i]).style.display = "none";
	}

	//Gets submitted DNA sequence and formats it to have a continuous series of letters (removes numbers, blanks, hyphens, tabs and line breaks)
	var submittedSequence = document.getElementById("DNA").value;
	var formattedSequence = submittedSequence.split(/[0-9]|\s|\n|\t|\/|\-/g).join("").toUpperCase();

	//If sequence hasn't got any non-nucleotide characters, analyse it
	if(isSequenceValid(formattedSequence)){
		//Sequence input
		writeToHtml(formattedSequence, "formattedseq", true);

		var formattedSequenceLength = formattedSequence.length;

		//Nucleotide frequency
		if(options["nuclFreq"]){
			var nucleotideFrequencies = countOccurences(formattedSequence, DNAchars);
			var nucleotideFrequenciesArray = [];
			var orderNuclFreq = orderObject(nucleotideFrequencies);
			for(var x in orderNuclFreq){
				var nucleotideCount = orderNuclFreq[x];
				var nucleotideF = nucleotideFrequencies[nucleotideCount];
				nucleotideFrequenciesArray.push(nucleotideCount + " : " + ((nucleotideF / formattedSequenceLength) * 100).toFixed(2) + "% (" + nucleotideF + ")");
			}
			nucleotideFrequenciesArray = nucleotideFrequenciesArray.join("<br/>");

			var nucleotidePairFrequencies = countOccurences(formattedSequence, nucleotidePairs);
			var nucleotidePairFrequenciesArray = [];
			var orderNuclPairFreq = orderObject(nucleotidePairFrequencies);
			for(var x in orderNuclPairFreq){
				var nucleotideCount = orderNuclPairFreq[x];
				var nucleotideF = nucleotidePairFrequencies[orderNuclPairFreq[x]];
				nucleotidePairFrequenciesArray.push(nucleotideCount + " : " + ((nucleotideF / (formattedSequenceLength - 1)) * 100).toFixed(2) + "% (" + nucleotideF + ")");
			}
			nucleotidePairFrequenciesArray = nucleotidePairFrequenciesArray.join("<br/>");

			writeToHtml(nucleotideFrequenciesArray, "nucleotidefreq");
			drawFrequencies(nucleotideFrequencies, "nucleotidefreq");
			writeToHtml(nucleotidePairFrequenciesArray, "nucleotidepairfreq");
			drawFrequencies(nucleotidePairFrequencies, "nucleotidepairfreq");
		}

		//Individual codon frequencies
		if(options["iCodonFreq"]){
			var individualCodonRef = {};
			var individualCodonFreq = countOccurences(formattedSequence, nucleotideTriplets);
			var individualCodonFrequenciesText = [];
			var orderICodonFreq = orderObject(individualCodonFreq);
			for(var x = 0; x < orderICodonFreq.length; x ++){
				var codon = orderICodonFreq[x];
				var codonCount = individualCodonFreq[codon];
				var text = codon + " : " + (codonCount * 100 / (formattedSequenceLength - 2)).toFixed(2) + "% (" + codonCount + ")";
				if((x === 0) || (x === 22) || (x === 44)){
					text = "<div class=\"icodondiv\">" + text + "<br/>";
				}
				else if((x === 63) || (x === 21) || (x === 43)){
					text += "</div>";
				}
				else{
					text += "<br/>";
				}
				individualCodonFrequenciesText.push(text);
			}
			writeToHtml(individualCodonFrequenciesText.join(""), "individualcodonfreq");
		}
		
		//Molecular weight
		if(options["molWeight"]){
			var molWeightDNA = molecularWeight(formattedSequence);
			molWeightDNA = molWeightDNA + " Da (" + DaTokDa(molWeightDNA) + " kDa)";
			writeToHtml(molWeightDNA, "molweightDNA");
		}
		
		//CpG islands
		if(options["cpg"]){
			var cpgIslands = findCpGIslands(formattedSequence);
			var cpgIslandsText = [];
			var cpgIslandsBasicLength = cpgIslands[0].length;
			if((cpgIslands[0] != undefined) && (cpgIslandsBasicLength != 0) && (cpgIslands[0][0] != undefined)){
				for(var i = 0; i < cpgIslandsBasicLength - 1; i ++){
					cpgIslandsText.push("Start : " + cpgIslands[0][i] + " / End : " + cpgIslands[1][i]);
				}
				cpgIslandsText = cpgIslandsText.join("<br/>");
			}
			else{
				cpgIslandsText = "No CpG Islands found";
			}
			writeToHtml(cpgIslandsText, "cpgislands");
		}

		// Translation prediction, codon frequencies and possible proteins
		if(options["translation"]){
			var translatedSequences = [
				translation(formattedSequence).join(""),
				translation(formattedSequence.slice(1, formattedSequenceLength + 1)).join(""),
				translation(formattedSequence.slice(2, formattedSequenceLength + 1)).join("")
			];

			var codonFrequencies = [
				countOccurences(translatedSequences[0], codonTable),
				countOccurences(translatedSequences[1], codonTable),
				countOccurences(translatedSequences[2], codonTable)
			];

			var codonFrequenciesText = [[], [], []];
			for(var i = 0; i < codonFrequencies.length; i++){
				var orderCodonFreq = orderObject(codonFrequencies[i]);
				for(var x in orderCodonFreq){
					codonFrequenciesText[i].push(orderCodonFreq[x] + " : " + ((codonFrequencies[i][orderCodonFreq[x]] / translatedSequences[i].length) * 100).toFixed(2) + "% (" + codonFrequencies[i][orderCodonFreq[x]] + ")");
				}
				codonFrequenciesText[i] = codonFrequenciesText[i].join("<br/>");
			}

			var possibleProtein = [
				translationShort(translatedSequences[0].split("")),
				translationShort(translatedSequences[1].split("")),
				translationShort(translatedSequences[2].split(""))
			];

			for(var i = 0; i < translatedSequences.length; i++){
				writeToHtml(translatedSequences[i], "translatedseq" + (i + 1), true);
				writeToHtml(codonFrequenciesText[i], "codonfreq" + (i + 1));
				drawFrequencies(codonFrequencies[i], "codonfreq" + (i + 1));
				writeToHtml(possibleProtein[i], "shorttranslatedseq" + (i + 1), true);
			}
		}

		//Reverse, complement and reverse complement sequences
		if(options["revComp"]){
			var complementText = complementSequence(formattedSequence);
			var reverseText = reverseSequence(formattedSequence);
			var reverseComplementText = reverseSequence(complementText);
			writeToHtml(complementText, "complement", true);
			writeToHtml(reverseText, "reverse", true);
			writeToHtml(reverseComplementText, "reverse-complement", true);
		}

		//Gets ending time and computes total execution time
		var localTime = new Date();
		var endingTime = localTime.getTime();
		document.getElementById("timer").innerHTML = "Done... Execution time : " + ((endingTime - startingTime) / 1000) + " s";
	}

	//If there are non-nucleotide characters, abort and warn user
	else{
		alert("The sequence contains at least one forbidden character! (See description above input box)");
	}
};
