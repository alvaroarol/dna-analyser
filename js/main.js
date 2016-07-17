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
      var nucleotideFrequencies = nucleotideFrequency(formattedSequence);
      var nucleotideFrequenciesArray = [];
  		for(var nucleotide in nucleotideFrequencies){
  			nucleotideFrequenciesArray.push(nucleotide + " : " + ((nucleotideFrequencies[nucleotide] / formattedSequence.length) * 100).toFixed(2) + "% (" + nucleotideFrequencies[nucleotide] + ")");
  		}
      nucleotideFrequenciesArray = nucleotideFrequenciesArray.join("<br/>");
    }
    else{
      nucleotideFrequenciesArray = "";
    }

    //Molecular weight
    if(options["molWeight"]){
      var molWeightDNA = molecularWeight(formattedSequence);
      molWeightDNA = molWeightDNA + " Da (" + DaTokDa(molWeightDNA) + " kDa)";
    }
    else{
      var molWeightDNA = "";
    }

    //Reverse, complement and reverse-complement
    if(options["revComp"]){
      var reverseComplementText = reverseComplement(formattedSequence);
      if(options["formatDNA"]){
        for(var elements in reverseComplementText){
          reverseComplementText[elements] = formatSequence(reverseComplementText[elements]);
        }
      }
    }
    else{
      var reverseComplementText = {
        reverse : "",
        complement : "",
        reverse_complement : ""
      };
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
  		var codonFrequencies = [codonFreq(translatedSequences[0]),codonFreq(translatedSequences[1]),codonFreq(translatedSequences[2])];
  		var codonFrequenciesText = [[],[],[]];
  		for(var i = 0; i < codonFrequencies.length; i ++){
  			for(var freq in codonFrequencies[i]){
  				codonFrequenciesText[i].push(freq + " : " + ((codonFrequencies[i][freq] / translatedSequences[i].length) * 100).toFixed(2) + "% (" + codonFrequencies[i][freq] + ")");
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
    drawFrequencies(nucleotideFrequencies,"nucleotidefreq",options["orderGraph"]);
		writeToHtml(molWeightDNA, "molweightDNA");
    writeToHtml(reverseComplementText.reverse, "reverse");
    writeToHtml(reverseComplementText.complement, "complement");
    writeToHtml(reverseComplementText.reverse_complement, "reverse-complement");
		writeToHtml(cpgIslandsText, "cpgislands");
		for(var i = 0; i < translatedSequencesText.length; i ++){
			writeToHtml(translatedSequencesText[i], "translatedseq" + (i+1));
			writeToHtml(codonFrequenciesText[i], "codonfreq" + (i+1));
      drawFrequencies(codonFrequencies[i],"codonfreq" + (i+1),options["orderGraph"]);
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
