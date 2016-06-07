var DNAchars = ["A", "C", "G", "T"];

//Table of correspondence between codons and translated amino-acids or STOP
var codonTable = [
  ["Phe", "TTT", "TTC"],
  ["Leu", "TTA", "TTG", "CTT", "CTC", "CTA", "CTG"],
  ["Ile", "ATT", "ATC", "ATA"],
  ["Met", "ATG"],
  ["Val", "GTT", "GTC", "GTA", "GTG"],
  ["Ser", "TCT", "TCC", "TCA", "TCG", "AGT", "AGC"],
  ["Pro", "CCT", "CCC", "CCA", "CCG"],
  ["Thr", "ACT", "ACC", "ACA", "ACG"],
  ["Ala", "GCT", "GCC", "GCA", "GCG"],
  ["Tyr", "TAT", "TAC"],
  ["STOP", "TAA", "TAG", "TGA"],
  ["His", "CAT", "CAC"],
  ["Gln", "CAA", "CAG"],
  ["Asn", "AAT", "AAC"],
  ["Lys", "AAA", "AAG"],
  ["Asp", "GAT", "GAC"],
  ["Glu", "GAA", "GAG"],
  ["Cys", "TGT", "TGC"],
  ["Trp", "TGG"],
  ["Arg", "CGT", "CGC", "CGA", "CGG", "AGA", "AGG"],
  ["Gly", "GGT", "GGC", "GGA", "GGG"]
];

//Checks if the sequence contains unexpected characters
var isSequenceValid = function(sequence){
  for(var i = 0; i < sequence.length; i ++){
    if (!DNAchars.includes(sequence[i])){
      return false;
	  break;
    }
  }
  return true;
};

//Gives the frequency of each nucleotide
var nucleotideFrequency = function(sequence){
  var DNAcharFreq = [];
  for (var i = 0; i < DNAchars.length; i++) {
  //(Number of each nucleotide in sequence / length of sequence * 100).toFixed(2);
    DNAcharFreq[i] = +(((sequence.split(DNAchars[i]).length - 1) / sequence.length) * 100).toFixed(2);
  }
  return DNAcharFreq;
};

//Predicts translation of gene to protein
var translation = function(sequence){
  var trioSequence = sequence.match(/[ATGC]{1,3}/g);
  var translation = [];
  for(var i = 0; i < trioSequence.length; i ++){
    for(var j = 1; j < codonTable.length; j ++){
      if (codonTable[j].includes(trioSequence[i])){
        translation.push(codonTable[j][0]);
        break;
      }
    }
  }
  return translation;
};

//Cuts out the translated sequence between codon start (first Met) to codon STOP
var translationShort = function (protseq){
	
  //Checks if any Met protein in the array
  if(protseq.indexOf("Met") === -1){
    return [];
	
  }else{
    var a = [];
    var b = protseq;
    var loop = 1;
    var proteins = [];
    var start = 0;
	var end = 0;
	
	do{
	  start = b.indexOf("Met");
	  
      //remove all protein before first Met
	  a = b.slice(start, b.length + 1);
	  
	  //get end of current protein interval
	  if(a.indexOf("STOP") === -1){
	    end = a.length + 1;
	    loop = 0;
	  }else{
	    end = a.indexOf("STOP");
	  }
	
	  //get interval between first met and first STOP
      b = a.slice(0, end);
	  proteins.push(b.join(" "));
	
	  //remove all protein before first STOP including the STOP itself
      b = a.slice(end + 1, a.length + 1);
	  a = b;
	  
	  if(b.indexOf("Met") === -1){
		loop = 0;
	  }
    }while(loop);
	
    return proteins;
  }
};

//Writes the result of the function to HTML
var writeToHtml = function(result,title,id,button){
	
  //create a div element and give it an id
  var newdiv = document.createElement("div");
  newdiv.id = id;
  
  //create a p element and set its content
  var newp = document.createElement("p");
  newp.innerHTML = title;
  
  //Create a span element, give it and id and create the result text
  var newspan = document.createElement("span");
  newspan.id = id + "span";
  newspan.innerHTML = result;
  
  //Append the p and text to the div
  newdiv.appendChild(newp);
  newdiv.appendChild(newspan);
  
  //Append the div to the div #results
  document.getElementById("results").appendChild(newdiv);
  
  //If specified and if the result isn't blank, create a show/hide result button (to tidy up the page)
  if(button && (result != "")){        
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
      }else{
        newspan.style.cssText = "display: none;";
        newbutton.innerHTML = "Show";
        newbutton.className = "show";
      }
    });
	
	//Append button to p
    newp.appendChild(newbutton);
  }
};

//Main function
var analyseDNA = function(){
	
  //erases all previous analysis results
  document.getElementById("results").innerHTML = "";
  
  //stores submitted DNA sequence
  var submittedSequence = document.getElementById("DNA").value;
  
  //Formats the sequence to have a continuous series of letters (removes numbers, blanks, hyphens, tabs and line breaks)
  var formattedSequence = submittedSequence.split(/[0-9]|\s|\n|\t|\/|\-/g).join("").toUpperCase();
  
  if(isSequenceValid(formattedSequence)){
    //Formatted Sequence
	writeToHtml(formattedSequence,"Formatted sequence", "formattedseq",1);                         
  
	//Nucleotide Frequency
    writeToHtml(nucleotideFrequency(formattedSequence).join(" "), "Nucleotide frequencies in percentage (A,T,G,C) ", "nucleotidefreq",1);      
  
    var translatedSequences = [
	  translation(formattedSequence), 
	  translation(formattedSequence.slice(1,formattedSequence.length + 1)), 
	  translation(formattedSequence.slice(2,formattedSequence.length + 1)
	];
	
	for(i = 0; i < translatedSequences.length; i++){
      //Translation from first position
      writeToHtml(translatedSequences[i].join(" "), "Translation prediction from first nucleotide position ", "translatedseq" + i, 1);     
	  //Possible protein from first position
      writeToHtml(translationShort(translatedSequences[i]).join("<br/><br/>"),"Possible proteins ", "shorttranslatedseq" + i, 1);     
	}
  }else{
	alert("The sequence contains at least one forbidden, non-nucleotide character!");
  }
};
