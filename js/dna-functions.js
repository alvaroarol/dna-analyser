//Molecular weight of each nucleotide (in Da)
var DNAchars = {
	"A" : {molWeight: 313.21,	complement: "T"},
	"T" : {molWeight: 304.2,	complement: "A"},
	"G" : {molWeight: 329.21,	complement: "C"},
	"C" : {molWeight: 289.18,	complement: "G"}
};

//Possible ngram generator needed for these 2 references
//Nucleotide pairs array for reference for countOccurences
var nucleotidePairs = [
	"AA", "AT", "AG", "AC",
	"TA", "TT", "TG", "TC",
	"GA", "GT", "GG", "GC",
	"CA", "CT", "CG", "CC"
];

//Nucleotide triplets array for reference for countOccurences
var nucleotideTriplets = [
	"TTT", "TTA", "ATT", "TTC", "TAT", "TAA", "TCT", "CTT",
	"ATA", "TAC", "CCC", "ACT", "TCC", "AAC", "CAT", "CTC",
	"AAT", "CTA", "ACC", "GTT", "AAA", "ATC", "CCT", "TCA",
	"ACA", "CGA", "CAC", "GAT", "CCA", "CGT", "TGT", "ACG",
	"CCG", "TCG", "CAA", "CGC", "GCT", "GAC", "CTG", "TTG",
	"GTA", "ATG", "TGC", "TGA", "GCA", "AGA", "TAG", "AGT",
	"CAG", "GCG", "GTC", "GAA", "AAG", "GGC", "CGG", "AGC",
	"GGT", "GCC", "AGG", "TGG", "GAG", "GTG", "GGG", "GGA"
];

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

//Checks if the sequence contains unexpected characters
var isSequenceValid = function(sequence){
	for(var i = 0; i < sequence.length; i ++){
		if(Object.keys(DNAchars).indexOf(sequence[i]) === -1){
			return false;
		}
	}
	return true;
};

//Counts each key in "reference" object within the "sequence" parameter
var countOccurences = function(sequence, reference){
	var occurenceTable = {};
	
	//convert object to array
	if(Array.isArray(reference)){
		var keys = reference;
	}
	else if(typeof reference === 'object'){
		var keys = Object.keys(reference);
	}
	
	for(var i = 0; i < keys.length; i++){
		character = keys[i];
		if(character === "*"){ 
			var characterRegExp = new RegExp("\\*", "g");
		}
		else{
			var characterRegExp = new RegExp(character, "g");
		}
		var results = [];
		var matches;
		while(matches = characterRegExp.exec(sequence)){
			results.push(matches[0]);
			characterRegExp.lastIndex -= (matches[0].length - 1);
		}
		occurenceTable[character] = results.length;
	}
	
	return occurenceTable;
};

//Predicts translation of gene to protein
var translation = function(sequence){
	var translation = [];
	//Cuts the sequence in pieces of three nucleotides ( = codons)
	var trioSequence = sequence.match(/[ATGC]{1,3}/g);
	//Loops through the codons in the sequence
	for(var i = 0; i < trioSequence.length; i ++){
		//Loops through the codon table to find the correspondent amino-acid
		for(var aminoacid in codonTable){
			if(codonTable[aminoacid].indexOf(trioSequence[i]) != -1){
				translation.push(aminoacid);
				break;
			}
		}
	}
	return translation;
};

//Cuts out the translated sequence between codon start (first M codon) to codon STOP (*)
var translationShort = function(codonseq){
	var a = [];
	var b = codonseq;
	var codons = [];
	var start = 0;
	var end = 0;

	//If the translated sequence doesn't contain a start codon (M), stop loop
	while(b.indexOf("M") != -1){
		start = b.indexOf("M");
		//Remove the translated sequence before first M
		a = b.slice(start, b.length + 1);
		var aLength = a.length;
		//If there isn't a STOP codon after the previously found M, the protein ends at the end of the sequence
		if(a.indexOf("*") === -1){
			end = aLength + 1;
		}
		//Else, find the STOP codon of the current protein
		else{
			end = a.indexOf("*");
		}
		//Add the protein found from M to STOP into the protein array
		b = a.slice(0, end);
		codons.push(b.join(""));
		//Remove everything before the last used STOP codon (including the STOP itself), for next loop iteration
		b = a.slice(end + 1, aLength + 1);
		a = b;
	};
	return codons;
};

//Finds CpG islands (200bp regions with GC content higher than 50% and a ratio of observed/expected CpG dimers higher than 60%)
var findCpGIslands = function(sequence){
	//Checks if the sequence has at least 200 bp
	var sequenceLength = sequence.length;
	
	if(sequenceLength < 200){
		return [];
	}
	else{
		var start = [];
		var end = [];
		//first 200 bp sequence
		var intervalSeq = sequence.slice(0, 200);
		//nucleotide count for a
		var intervalFreq = countOccurences(intervalSeq, DNAchars);
		//Counts "CG" pairs in a;
		var cpgPairs = (intervalSeq.match(/CG/g) || []).length;
		//update a, b and cpgPairs for each new nucleotide
		for(var i = 0; i < sequenceLength - 200; i ++){
			if(i > 0){
				//remove left most nucleotide from current count array
				intervalFreq[sequence[i - 1]]--;
				//remove 1 from cpgPairs count if relevant
				if(sequence[i - 1] === "C" && sequence[i] === "G"){
					cpgPairs--;
				}
				//add right most nucleotide to current count array
				intervalFreq[sequence[i + 200]]++;
				if(sequence[i + 200] === "G" && sequence[i + 200 - 1] === "C"){
					cpgPairs++;
				}
			}
			//Checks if content in GC is > 50% and CpG obs/exp is > 60% and, if true, adds start/end positions to the arrays
			if((intervalFreq["C"] + intervalFreq["G"] > intervalFreq["A"] + intervalFreq["T"]) && (cpgPairs / ((intervalFreq["C"] * intervalFreq["G"]) / 200) > 0.6)){
				start.push(i + 1);
				end.push(i + 200);
			}
		}
		//Puts CpG islands together if they're successive
		var endNew = [];
		var startNew = [];
		startNew[0] = start[0];
		for(var i = 0; i < end.length; i++){
			if(end[i] != end[i + 1] - 1){
				endNew.push(end[i]);
				startNew.push(start[i + 1]);
			}
		}
		//Returns an array containing both arrays (starting and ending positions of cpg islands)
		return [startNew, endNew];
	}
};

//Converts DaTokDa
var DaTokDa = function(Da){
	kDa = (Da / 1000).toFixed(2);
	return kDa;
};

//Calculates the total molecular weight of the sequence
var molecularWeight = function(sequence){
	var totalWeight = 0;
	//Looks at the molecular weight of the nucleotide in the DNAchars array and adds it to the total
	for(var i = 0; i < sequence.length; i++){
		totalWeight += DNAchars[sequence[i]].molWeight;
	}
	totalWeight += 79;
	return (totalWeight.toFixed(2));
};

//reverses a sequence or string: "ABCD" => "DCBA"
var reverseSequence = function(sequence){
	return sequence.split("").reverse().join("");
};

//Returns complement sequence
var complementSequence = function(sequence){
	var complementArray = [];
	for(var i = 0; i < sequence.length; i++){
		complementArray.push(DNAchars[sequence[i]].complement);
	}
	return complementArray.join("");
};
