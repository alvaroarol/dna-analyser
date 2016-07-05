//Fixes "includes" method incompatibility for IE
if (!Array.prototype.includes) {
  Array.prototype.includes = function() {
      'use strict';
     return Array.prototype.indexOf.apply(this, arguments) !== -1;
 };
}

//Molecular weight of each nucleotide (in Da)
var DNAchars = {
	"A" : 330.22,
	"T" : 321.21,
	"G" : 346.22,
	"C" : 306.19
};

//Table of correspondence between codons and translated amino-acids (or STOP)
var codonTable = {
	"F" : ["TTT","TTC"],
	"L" : ["TTA", "TTG", "CTT", "CTC", "CTA", "CTG"],
	"I" : ["ATT", "ATC", "ATA"],
	"M" : ["ATG"],
	"V" : ["GTT", "GTC", "GTA", "GTG"],
	"S" : ["TCT", "TCC", "TCA", "TCG", "AGT", "AGC"],
	"P" : ["CCT", "CCC", "CCA", "CCG"],
	"T" : ["ACT", "ACC", "ACA", "ACG"],
	"A" : ["GCT", "GCC", "GCA", "GCG"],
	"Y" : ["TAT", "TAC"],
	"*" : ["TAA", "TAG", "TGA"],
	"H" : ["CAT", "CAC"],
	"Q" : ["CAA", "CAG"],
	"N" : ["AAT", "AAC"],
	"K" : ["AAA", "AAG"],
	"D" : ["GAT", "GAC"],
	"E" : ["GAA", "GAG"],
	"C" : ["TGT", "TGC"],
	"W" : ["TGG"],
	"R" : ["CGT", "CGC", "CGA", "CGG", "AGA", "AGG"],
	"G" : ["GGT", "GGC", "GGA", "GGG"]
};

//Formats the sequence for a better display
var formatSequence = function(sequence){
  var spacedSequence = [];
  spacedSequence.push(Array(7).join("&nbsp") + 1 + " ");
  for(var i = 0; i < sequence.length; i ++){
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

//Checks if the sequence contains unexpected characters
var isSequenceValid = function(sequence){
	for(var i = 0; i < sequence.length; i ++){
		if (!Object.keys(DNAchars).includes(sequence[i])){
			return false;
		}
	}
	return true;
};

//Gives the count of each nucleotide
var nucleotideFrequency = function(sequence){
	DNAcharFreq = {};
	for (var nucleotide in DNAchars){
		//(Number of each nucleotide in sequence / length of sequence * 100).toFixed(2);
		DNAcharFreq[nucleotide] = sequence.split(nucleotide).length - 1;
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

//Cuts out the translated sequence between codon start (first codon Met ("M")) to codon STOP ("*")
var translationShort = function (codonseq){
	var a = [];
	var b = codonseq;
	var codons = [];
	var start = 0;
	var end = 0;
		
	//If the translated sequence doesn't contain a start codon ("M"), stop loop
	while(b.indexOf("M") != -1){
		start = b.indexOf("M");
		//Remove the translated sequence before first Met
		a = b.slice(start, b.length + 1);
		//If there isn't a STOP codon after the previously found Met, the protein ends at the end of the sequence
		if(a.indexOf("*") === -1){
			end = a.length + 1;
		}
		//Else, find the STOP codon of the current protein
		else{
			end = a.indexOf("*");
		}
		//Add the protein found from Met to STOP into the protein array
		b = a.slice(0, end);
		codons.push(b.join(""));
		//Remove everything before the last used STOP codon (including the STOP itself), for next loop iteration
		b = a.slice(end + 1, a.length + 1);
		a = b;
	};
	return codons;
};

//Counts the quantity of each codon
var codonFreq = function(codonSequence){
  var codonCount = {};
  for(var i = 0; i < codonSequence.length; i ++){
    //Add the codon to the counting object if it isn't already in it
    if(!codonCount[codonSequence[i]]){
      codonCount[codonSequence[i]] = 0;
    }
    //Add a count to the correspondent codon in the counting object
    codonCount[codonSequence[i]] ++;
  }
  return codonCount;
};

//Finds CpG islands (200bp regions with GC content higher than 50% and a ratio of observed/expected CpG dimers higer than 60%)
var findCpGIslands = function(sequence){
  var cpgArrayStart = [];
  var cpgArrayStop = [];
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
					cpgArrayStart.push(i + 1);
          cpgArrayStop.push(i + 200);
				}
			}
		}
	}
  else{
    return "none";
  }
  //Puts CpG islands together if they're successive
  var cpgArrayStopNew = [];
  var cpgArrayStartNew = [];
  cpgArrayStartNew[0] = cpgArrayStart[0];
  for(var k = 0; k < cpgArrayStop.length; k ++){
    if(cpgArrayStop[k] != cpgArrayStop[k+1] - 1){
      cpgArrayStopNew.push(cpgArrayStop[k]);
      cpgArrayStartNew.push(cpgArrayStart[k+1]);
    }
  }
  //Returns an array containing both arrays (starting and ending positions of cpg islands)
	return [cpgArrayStartNew,cpgArrayStopNew];
};

//Converts DaTokDa
var DaTokDa = function(Da){
	kDa = (Da / 1000).toFixed(2);
	return kDa;
}

//Calculates the total molecular weight of the sequence
var molecularWeight = function(sequence){
	var totalWeight = 0;
	//Looks at the molecular weight of the nucleotide in the DNAchars array and adds it to the total
	for(var i = 0; i < sequence.length; i++){
		totalWeight += DNAchars[sequence[i]];
	}

	return (totalWeight.toFixed(2));
};
