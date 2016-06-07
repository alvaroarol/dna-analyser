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
  var newdiv = document.createElement("div");                //Create a div element
  newdiv.id = id;                //Give the div element an id
  var newp = document.createElement("p");      //Create a p element
  newp.innerHTML = title;        //Create the title
  var newspan = document.createElement("span");              //Create a span element
  newspan.id = id + "span";                    //Give the span element an id
  newspan.innerHTML = result;                  //Create the result text
  newdiv.appendChild(newp);                    //Append the p to the div
  newdiv.appendChild(newspan);                 //Append the text span to the div
  document.getElementById("results").appendChild(newdiv);    //Append the div to div "results"
  if(button && (result != "")){                //If specified and if the result isn't blank, create a show/hide result button (to tidy up the page)
    var newbutton = document.createElement("button");        //Create button
    newbutton.className = "show";
    newbutton.innerHTML = "Show";              //Create button text
    newbutton.addEventListener("click", function(){          //Onclick calls a function that switches the button and span between show and hide
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
    newp.appendChild(newbutton);               //Append button to p
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
    var nucleotideFrequencies = nucleotideFrequency(formattedSequence).join(" ");
    writeToHtml(nucleotideFrequencies,"Nucleotide frequencies in percentage (A,T,G,C) ", "nucleotidefreq",1);      
  
    var translatedSequence1 = translation(formattedSequence);
    writeToHtml(translatedSequence1.join(" "),"Translation prediction from first nucleotide position ", "translatedseq1",1);     //Translation from first position
    writeToHtml(translationShort(translatedSequence1).join("<br/><br/>"),"Possible proteins ", "shorttranslatedseq1",1);                 //Possible protein from first position
  
    var translatedSequence2 = translation(formattedSequence.slice(1,formattedSequence.length + 1));
    writeToHtml(translatedSequence2.join(" "),"Translation prediction from second nucleotide position ", "translatedseq2",1);    //Translation from second position
    writeToHtml(translationShort(translatedSequence2).join("<br/><br/>"),"Possible proteins ", "shorttranslatedseq2",1);                 //Possible protein from second position
  
    var translatedSequence3 = translation(formattedSequence.slice(2,formattedSequence.length + 1));
    writeToHtml(translatedSequence3.join(" "),"Translation prediction from third nucleotide position ", "translatedseq3",1);      //Translation from third position
    writeToHtml(translationShort(translatedSequence3).join("<br/><br/>"),"Possible proteins ", "shorttranslatedseq3",1);                //Possible protein from second position
	
  }else{
	alert("The sequence contains at least one forbidden, non-nucleotide character!");
  }
};
