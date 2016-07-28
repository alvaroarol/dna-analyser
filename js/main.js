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
  return spacedSequence.join("")
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
		document.getElementById(divId + "button").className = "showbutton";
		//Display the div
		document.getElementById(divId).style.display = "block";
	}
	else{
		document.getElementById(divId).style.display = "none";
	}
};

//Switches the div and button between hide and show
var showHideButton = function(divId,buttonId){
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
  //Changes cursor to waiting cursor
  document.getElementById("mask").style.display = "block";
  //Launches main function
  setTimeout("analyseDNA()", 10);
  //Reverts waiting cursor back to normal
  setTimeout("document.getElementById(\"mask\").style.display = \"none\";",10);
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
////////////////
var analyseDNA = function(){
  //Gets starting time (for execution time)
  var localTime = new Date();
  var startingTime = localTime.getTime();

	//Gets submitted DNA sequence and formats it to have a continuous series of letters (removes numbers, blanks, hyphens, tabs and line breaks)
	var submittedSequence = document.getElementById("DNA").value;
	var formattedSequence = submittedSequence.split(/[0-9]|\s|\n|\t|\/|\-/g).join("").toUpperCase();

	//If sequence hasn't got any non-nucleotide characters, analyse it
	if(isSequenceValid(formattedSequence)){

		//Sequence input
    if(options["formatDNA"]){
		  var formattedSequenceText = formatSequence(formattedSequence);
    }
    else{
      var formattedSequenceText = formattedSequence;
    }

    //Nucleotide frequency
    if(options["nuclFreq"]){
      var nucleotideFrequencies = countOccurences(formattedSequence, DNAchars);
      var nucleotideFrequenciesArray = [];
      var orderNuclFreq = orderObject(nucleotideFrequencies);
  		for(var x in orderNuclFreq){
  			nucleotideFrequenciesArray.push(orderNuclFreq[x] + " : " + ((nucleotideFrequencies[orderNuclFreq[x]] / formattedSequence.length) * 100).toFixed(2) + "% (" + nucleotideFrequencies[orderNuclFreq[x]] + ")");
  		}
      nucleotideFrequenciesArray = nucleotideFrequenciesArray.join("<br/>");

      var nucleotidePairFrequencies = countOccurences(formattedSequence, nucleotidePairFreq);
      var nucleotidePairFrequenciesArray = [];
      var orderNuclPairFreq = orderObject(nucleotidePairFrequencies);
      for(var x in orderNuclPairFreq){
        nucleotidePairFrequenciesArray.push(orderNuclPairFreq[x] + " : " + ((nucleotidePairFrequencies[orderNuclPairFreq[x]] / (formattedSequence.length - 1)) * 100).toFixed(2) + "% (" + nucleotidePairFrequencies[orderNuclPairFreq[x]] + ")");
      }
      nucleotidePairFrequenciesArray = nucleotidePairFrequenciesArray.join("<br/>");
    }
    else{
      nucleotideFrequenciesArray = "";
      nucleotidePairFrequenciesArray = "";
    }

    //Individual codon frequencies
    if(options["iCodonFreq"]){
      var individualCodonRef = {};
      //Creates the object reference for countOccurences
      for(ref in codonTable){
        for(var i = 0; i < codonTable[ref].length; i ++){
          individualCodonRef[codonTable[ref][i]] = 0;
        }
      }
      var individualCodonFreq = countOccurences(formattedSequence, individualCodonRef);
      var individualCodonFrequenciesText = [];
      var orderICodonFreq = orderObject(individualCodonFreq);
      for(var x = 0; x < orderICodonFreq.length; x ++){
        if((x === 0) || (x === 22) || (x === 44)){
          individualCodonFrequenciesText.push("<div class=\"icodondiv\">" + orderICodonFreq[x] + " : " + (individualCodonFreq[orderICodonFreq[x]] * 100 / (formattedSequence.length - 2)).toFixed(2) + "% (" + individualCodonFreq[orderICodonFreq[x]] + ")<br/>");
        }
        else if((x === 63) || (x === 21) || (x === 43)){
          individualCodonFrequenciesText.push(orderICodonFreq[x] + " : " + (individualCodonFreq[orderICodonFreq[x]] * 100 / (formattedSequence.length - 2)).toFixed(2) + "% (" + individualCodonFreq[orderICodonFreq[x]] + ")</div>");
        }
        else{
          individualCodonFrequenciesText.push(orderICodonFreq[x] + " : " + (individualCodonFreq[orderICodonFreq[x]] * 100 / (formattedSequence.length - 2)).toFixed(2) + "% (" + individualCodonFreq[orderICodonFreq[x]] + ")<br/>");
        }
      }
      individualCodonFrequenciesText = individualCodonFrequenciesText.join("");
    }
    else{
      individualCodonFrequenciesText = "";
    }

    //Molecular weight
    if(options["molWeight"]){
      var molWeightDNA = molecularWeight(formattedSequence);
      molWeightDNA = molWeightDNA + " Da (" + DaTokDa(molWeightDNA) + " kDa)";
    }
    else{
      var molWeightDNA = "";
    }

    if(options["revComp"]){
      if(options["formatDNA"]){
        var complement = complementSequence(formattedSequence);
        var reverseText = formatSequence(reverseSequence(formattedSequence));
        var complementText = formatSequence(complement);
        var reverseComplementText = formatSequence(reverseSequence(complement));
      }
      else{
        var reverseText = reverseSequence(formattedSequence);
        var complementText = complementSequence(formattedSequence);
        var reverseComplementText = reverseSequence(complementText);
      }
    }
    else{
      var reverseText = "";
      var complementText = "";
      var reverseComplementText = "";
    }

    //CpG islands
    if(options["cpg"]){
      var cpgIslands = findCpGIslands(formattedSequence);
  		var cpgIslandsText = [];
  		if((cpgIslands[0] != undefined) && (cpgIslands[0].length != 0) && (cpgIslands[0][0] != undefined)){
  			for(var i = 0; i < cpgIslands[0].length - 1; i ++){
  				cpgIslandsText.push("Start : " + cpgIslands[0][i] + " / End : " + cpgIslands[1][i]);
  			}
        cpgIslandsText = cpgIslandsText.join("<br/>");
  		}
  		else{
  			cpgIslandsText = "";
  		}
    }
    else{
      cpgIslandsText = "";
    }

    // Translation prediction, codon frequencies and possible proteins
    if(options["translation"]){
      var translatedSequences = [
  			translation(formattedSequence),
  			translation(formattedSequence.slice(1, formattedSequence.length + 1)),
  			translation(formattedSequence.slice(2, formattedSequence.length + 1))
  		];

      if(options["formatProt"]){
        var translatedSequencesText = [];
        for(var i = 0; i < translatedSequences.length; i ++){
          translatedSequencesText[i] = formatSequence(translatedSequences[i]);
        }
      }
      else{
        var translatedSequencesText = [];
        for(var i = 0; i < translatedSequences.length; i ++){
          translatedSequencesText[i] = translatedSequences[i].join("");
        }
      }

  		var codonFrequencies = [countOccurences(translatedSequences[0].join(""), codonTable), countOccurences(translatedSequences[1].join(""), codonTable), countOccurences(translatedSequences[2].join(""), codonTable)];
  		var codonFrequenciesText = [[],[],[]];
  		for(var i = 0; i < codonFrequencies.length; i ++){
        var orderCodonFreq = orderObject(codonFrequencies[i]);
  			for(var x in orderCodonFreq){
  				codonFrequenciesText[i].push(orderCodonFreq[x] + " : " + ((codonFrequencies[i][orderCodonFreq[x]] / translatedSequences[i].length) * 100).toFixed(2) + "% (" + codonFrequencies[i][orderCodonFreq[x]] + ")");
  			}
        codonFrequenciesText[i] = codonFrequenciesText[i].join("<br/>");
  		}

  		var possibleProtein = [translationShort(translatedSequences[0]),translationShort(translatedSequences[1]),translationShort(translatedSequences[2])];
  		var possibleProteinText = [[],[],[]];
      if(options["formatProt"]){
        for(var i = 0; i < possibleProtein.length; i ++){
    			for(var j = 0; j < possibleProtein[i].length; j ++){
    				possibleProteinText[i][j] = formatSequence(possibleProtein[i][j]);
    			}
          possibleProteinText[i] = possibleProteinText[i].join("<div id=\"hr\"></div>");
    		}
      }
      else{
        for(var i = 0; i < possibleProtein.length; i ++){
          possibleProteinText[i] = possibleProtein[i].join("<div id=\"hr\"></div>");
        }
      }
    }
    else{
        translatedSequencesText = ["","",""];
        codonFrequenciesText = ["","",""];
        codonFrequencies = ["","",""];
        possibleProteinText = ["","",""];
    }

		//Display results on the page
    writeToHtml(formattedSequenceText, "formattedseq");
	  writeToHtml(nucleotideFrequenciesArray, "nucleotidefreq");
    drawFrequencies(nucleotideFrequencies,"nucleotidefreq");
    writeToHtml(nucleotidePairFrequenciesArray, "nucleotidepairfreq");
    drawFrequencies(nucleotidePairFrequencies,"nucleotidepairfreq");
    writeToHtml(individualCodonFrequenciesText, "individualcodonfreq");
	  writeToHtml(molWeightDNA, "molweightDNA");
    writeToHtml(reverseText, "reverse");
    writeToHtml(complementText, "complement");
    writeToHtml(reverseComplementText, "reverse-complement");
	  writeToHtml(cpgIslandsText, "cpgislands");
	  for(var i = 0; i < translatedSequencesText.length; i++){
		  writeToHtml(translatedSequencesText[i], "translatedseq" + (i+1));
		  writeToHtml(codonFrequenciesText[i], "codonfreq" + (i+1));
		  drawFrequencies(codonFrequencies[i], "codonfreq" + (i+1));
		  writeToHtml(possibleProteinText[i], "shorttranslatedseq" + (i+1));
  	}

    //Gets ending time and computes total execution time
    var localTime = new Date();
    var endingTime = localTime.getTime();
    document.getElementById("timer").innerHTML = "Execution time : " + ((endingTime - startingTime) / 1000) + " s";

  }

	//If there are non-nucleotide characters, abort and warn user
	else{
		alert("The sequence contains at least one forbidden character! (See description above input box)");
	}
};
