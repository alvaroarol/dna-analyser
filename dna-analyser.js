//Writes the result of the function to HTML
var writeToHtml = function(result,title,id,button){
	if(result != ""){
		//Create a div element and give it an id
		var newdiv = document.createElement("div");
		newdiv.id = id;
		//Create a p element and set its content
		var newp = document.createElement("p");
		newp.innerHTML = title;
		//Create a span element, give it an id and create the result text
		var newspan = document.createElement("span");
		newspan.id = id + "span";
		newspan.innerHTML = result;
		//Append the p and text to the div
		newdiv.appendChild(newp);
		newdiv.appendChild(newspan);
		//Append the div to the div #results
		document.getElementById("results").appendChild(newdiv);
		//If specified and if the result isn't blank, create a show/hide result button (to tidy up the page)
		if(button){
			//Create button, class and text
			var newbutton = document.createElement("button");
			newbutton.className = "show";
			newbutton.innerHTML = "Show";
			//Onclick calls a function that switches the button and span between show and hide
			newbutton.addEventListener("click", function(){
				if(newbutton.className === "show"){
					newspan.style.cssText = "display: block;";
					newbutton.innerHTML = "Hide";
					newbutton.className = "hide";
				}
				else{
					newspan.style.cssText = "display: none;";
					newbutton.innerHTML = "Show";
					newbutton.className = "show";
				}
			});
			//Append button to p
			newp.appendChild(newbutton);
		}
	}
};


//Main function
var analyseDNA = function(){
	//Erases all previous analysis results
	document.getElementById("results").innerHTML = "";
	//Gets submitted DNA sequence
	var submittedSequence = document.getElementById("DNA").value;
	//Formats the sequence to have a continuous series of letters (removes numbers, blanks, hyphens, tabs and line breaks)
	var formattedSequence = submittedSequence.split(/[0-9]|\s|\n|\t|\/|\-/g).join("").toUpperCase();
	//If sequence hasn't got any non-nucleotide characters, analyse it
	if(isSequenceValid(formattedSequence)){
		//Format Sequence for display
		writeToHtml(formatSequence(formattedSequence),"Formatted sequence ", "formattedseq",1);
		//Nucleotide Frequency
		writeToHtml(nucleotideFrequency(formattedSequence).join("<br/>"), "Nucleotide frequencies ", "nucleotidefreq", 1);
		//Molecular weigth
		var molWeightDNA = molecularWeight(formattedSequence);
		writeToHtml(molWeightDNA[0].toFixed(2) + " Da" + " (" + molWeightDNA[1] + " kDa)","Molecular weight ","molweightDNA", 1);
		//CpG Islands
		writeToHtml(findCpGIslands(formattedSequence).join("<br/>"), "CpG islands (200 bp intervals minimum) ", "cpgislands", 1);
		//Translations for 3 possible starting positions
		var translatedSequences = [
			translation(formattedSequence),
			translation(formattedSequence.slice(1, formattedSequence.length + 1)),
			translation(formattedSequence.slice(2, formattedSequence.length + 1))
		];
		var positionStrings = ["first","second","third"];
		for(var i = 0; i < translatedSequences.length; i++){
			//Translation
			writeToHtml(formatSequence(translatedSequences[i]) + "<br/><br/>" + translatedSequences[i].length + " codon(s)", "Translation prediction from " + positionStrings[i] + " reading frame ", "translatedseq" + (i+1), 1);
			//Most frequent codon
			var mostFreqCodon = commonCodon(translatedSequences[i]);
			writeToHtml(mostFreqCodon.join(" : ") + " time(s) " + "&emsp;&emsp;" + ((mostFreqCodon[1] / translatedSequences[i].length) * 100 ).toFixed(2) + "%", "Most frequent codon ", "frequentcodon" + (i+1), 1);
			//Possible protein
			writeToHtml(translationShort(translatedSequences[i]).join("<div id=\"hr\"></div>"), "Possible proteins (translated sequences between Met and STOP) ", "shorttranslatedseq" + (i+1), 1);
		}
	}
	//If there are non-nucleotide characters, abort and warn user
	else{
		alert("The sequence contains at least one forbidden character! (See description above input box)");
	}
};
