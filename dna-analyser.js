//Molecular weight of each nucleotide
var DNAchars = {
	"A" : 330.22,
	"T" : 321.21,
	"G" : 346.22,
	"C" : 306.19
};

//Table of correspondence between codons and translated amino-acids or STOP
var codonTable = {
	"Phe" : ["TTT","TTC"],
	"Leu" : ["TTA", "TTG", "CTT", "CTC", "CTA", "CTG"],
	"Ile" : ["ATT", "ATC", "ATA"],
	"Met" : ["ATG"],
	"Val" : ["GTT", "GTC", "GTA", "GTG"],
	"Ser" : ["TCT", "TCC", "TCA", "TCG", "AGT", "AGC"],
	"Pro" : ["CCT", "CCC", "CCA", "CCG"],
	"Thr" : ["ACT", "ACC", "ACA", "ACG"],
	"Ala" : ["GCT", "GCC", "GCA", "GCG"],
	"Tyr" : ["TAT", "TAC"],
	"STOP" : ["TAA", "TAG", "TGA"],
	"His" : ["CAT", "CAC"],
	"Gln" : ["CAA", "CAG"],
	"Asn" : ["AAT", "AAC"],
	"Lys" : ["AAA", "AAG"],
	"Asp" : ["GAT", "GAC"],
	"Glu" : ["GAA", "GAG"],
	"Cys" : ["TGT", "TGC"],
	"Trp" : ["TGG"],
	"Arg" : ["CGT", "CGC", "CGA", "CGG", "AGA", "AGG"],
	"Gly" : ["GGT", "GGC", "GGA", "GGG"]
};

//Checks if the sequence contains unexpected characters
var isSequenceValid = function(sequence){
	for(var i = 0; i < sequence.length; i ++){
		if (!Object.keys(DNAchars).includes(sequence[i])){
			return false;
		}
	}
	return true;
};

//Gives the frequency of each nucleotide
var nucleotideFrequency = function(sequence){
	DNAcharFreq = [];
	for (var nucleotide in DNAchars){
		//(Number of each nucleotide in sequence / length of sequence * 100).toFixed(2);
		DNAcharFreq.push(nucleotide + " : " + (((sequence.split(nucleotide).length - 1) / sequence.length) * 100).toFixed(2) + "% (" + (sequence.split(nucleotide).length - 1) + ")");
	}
	return DNAcharFreq;
};

//Predicts translation of gene to protein
var translation = function(sequence){
	//Cuts the sequence in pieces of three nucleotides ( = codons)
	var trioSequence = sequence.match(/[ATGC]{1,3}/g);
	var translation = [];
	//Loops through the codons in the sequence
	for(var i = 0; i < trioSequence.length; i ++){
		var breakCheck = 0;
		//Loops through the codon table to find the correspondent amino-acid
		for(var aminoacid in codonTable){
			for(var codon in codonTable[aminoacid]){
				if (trioSequence[i].includes(codonTable[aminoacid][codon])){
					translation.push(aminoacid);
					breakCheck = 1;
					break;
				}
			}
			if(breakCheck){
				break;
			}
		}
	}
	return translation;
};

//Cuts out the translated sequence between codon start (first Met) to codon STOP
var translationShort = function (protseq){
	//If the translated sequence doesn't contain a start codon (Met), return nothing
	if(protseq.indexOf("Met") === -1){
		return [];
	}
	else{
		var a = [];
		var b = protseq;
		var loop = 1;
		var proteins = [];
		var start = 0;
		var end = 0;

		do{
			start = b.indexOf("Met");
			//Remove the translated sequence before first Met
			a = b.slice(start, b.length + 1);
			//If there isn't a STOP codon after the previously found Met, the protein ends at the end of the sequence
			if(a.indexOf("STOP") === -1){
				end = a.length + 1;
				loop = 0;
			}
			//Else, find the STOP codon of the current protein
			else{
				end = a.indexOf("STOP");
			}
			//Add the protein found from Met to STOP into the protein array
			b = a.slice(0, end);
			proteins.push(b.join(" "));
			//Remove everything before the last used STOP codong(including the STOP itself), for next loop iteration
			b = a.slice(end + 1, a.length + 1);
			a = b;
			//If there isn't any Met left after that, end the loop
			if(b.indexOf("Met") === -1){
				loop = 0;
			}
		} while(loop);
		return proteins;
	}
};

//Finds the most common codon and its frequency
var commonCodon = function(codonSequence){
  codonCount = {};
  frequentCodon = ["",0];
  for(var i = 0; i < codonSequence.length; i ++){
    //Add the codon to the counting object if it isn't already
    if(!codonCount[codonSequence[i]]){
      codonCount[codonSequence[i]] = 0;
    }
    //Add a count to the correspondent codon in the counting object
    codonCount[codonSequence[i]] ++;
    //If the codon has more counts than the previous most counted codon, make it the most counted codon
    if(codonCount[codonSequence[i]] > frequentCodon[1]){
      frequentCodon = [codonSequence[i],codonCount[codonSequence[i]]];
    }
  }
  return frequentCodon;
};

//Finds CpG islands (200bp regions with GC content higher than 50% and a ratio of observed/expected CpG dimers higer than 60%)
var findCpGIslands = function(sequence){
	cpgArray = [];
	//Checks if the sequence has at least 200 bp
	if(sequence.length >= 200){
		//Moves the 200 bp window across the sequence 1 bp at a time
		for(var i = 0; i < sequence.length - 200; i ++){
			windowNucleotides = {};
			cpgPairs = 0;
			//Reads every nucleotide in the 200 bp window
			for(var j = 0; j < 200; j++){
				//If the nucleotide hasn't been counted once yet, add it to the object
				if(!windowNucleotides[sequence[i+j]]){
					windowNucleotides[sequence[i+j]] = 0;
				}
				//Add a count to the correspondent nucleotide in the object
				windowNucleotides[sequence[i+j]] ++;
				//Count the CpG pairs
				if((sequence[i+j] === "C") && (sequence[i+j+1] === "G")){
					cpgPairs ++;
				}
			}
			//Checks if content in GC is > 50%
			if(windowNucleotides["C"] + windowNucleotides["G"] > windowNucleotides["A"] + windowNucleotides["T"]){
				//Checks if obs/exp ratio is > 60%
				if(cpgPairs / ((windowNucleotides["C"] * windowNucleotides["G"]) / 200) > 0.6){
					cpgArray.push("start : " + (i + 1) + " / end : " + (i + 200));
				}
			}
		}
	}
	return cpgArray;
};

//Calculates the total nuclear weight of the sequence
var molecularWeight = function(sequence){
	var totalWeight = [];
	totalWeight[0] = 0;
	totalWeight[1] = 0;
	//Cycles through the entire sequence
	for(var i = 0; i < sequence.length; i++){
		//Looks at the molecular weight of the nucleotide in the DNAchars array and adds it to the total
		for(var nucleotide in DNAchars){
			if(sequence[i] === nucleotide){
				totalWeight[0] += DNAchars[nucleotide];
				break;
			}
		}
	}
	//totalWeight[0] is in Da, totalWeight[1] is in kDa
	totalWeight[1] = (totalWeight[0] / 1000).toFixed(2);
	return totalWeight;
};

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
		//Format Sequence
		writeToHtml(formattedSequence,"Formatted sequence ", "formattedseq",1);
		//Nucleotide Frequency
		writeToHtml(nucleotideFrequency(formattedSequence).join("<br/>"), "Nucleotide frequencies ", "nucleotidefreq", 1);
		//Molecular weigth
		var molWeightDNA = molecularWeight(formattedSequence);
		writeToHtml(molWeightDNA[0].toFixed(2) + " Da" + " (" + molWeightDNA[1] + " kDa)","Molecular weight ","molweightDNA", 1);
		//CpG Islands
		writeToHtml(findCpGIslands(formattedSequence).join("<br/>"), "CpG islands (200 bp intervals) ", "cpgislands", 1);
		//Translations for 3 possible starting positions
		var translatedSequences = [
			translation(formattedSequence),
			translation(formattedSequence.slice(1, formattedSequence.length + 1)),
			translation(formattedSequence.slice(2, formattedSequence.length + 1))
		];
		var positionStrings = ["first","second","third"];
		for(var i = 0; i < translatedSequences.length; i++){
			//Translation
			writeToHtml(translatedSequences[i].join(" "), "Translation prediction from " + positionStrings[i] + " reading frame ", "translatedseq" + (i+1), 1);
      //Most frequent codon
			var mostFreqCodon = commonCodon(translatedSequences[i]);
      writeToHtml(mostFreqCodon.join(" : ") + " times " + "&emsp;&emsp;" + ((mostFreqCodon[1] / translatedSequences[i].length) * 100 ).toFixed(2) + "%", "Most frequent codon ", "frequentcodon" + (i+1), 1);
			//Possible protein
			writeToHtml(translationShort(translatedSequences[i]).join("<br/><br/>"), "Possible proteins (translated sequences between Met and STOP) ", "shorttranslatedseq" + (i+1), 1);
		}
	}
	//If there are non-nucleotide characters, abort and warn user
	else{
		alert("The sequence contains at least one forbidden character! (See description above input box)");
	}
};
