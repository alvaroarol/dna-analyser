//Table of correspondence between codons and translated amino-acids or STOP
var codonTable = [["Phe","TTT","TTC"],
                  ["Leu","TTA","TTG","CTT","CTC","CTA","CTG"],
                  ["Ile","ATT","ATC","ATA"],
                  ["Met","ATG"],
                  ["Val","GTT","GTC","GTA","GTG"],
                  ["Ser","TCT","TCC","TCA","TCG","AGT","AGC"],
                  ["Pro","CCT","CCC","CCA","CCG"],
                  ["Thr","ACT","ACC","ACA","ACG"],
                  ["Ala","GCT","GCC","GCA","GCG"],
                  ["Tyr","TAT","TAC"],
                  ["STOP","TAA","TAG","TGA"],
                  ["His","CAT","CAC"],
                  ["Gln","CAA","CAG"],
                  ["Asn","AAT","AAC"],
                  ["Lys","AAA","AAG"],
                  ["Asp","GAT","GAC"],
                  ["Glu","GAA","GAG"],
                  ["Cys","TGT","TGC"],
                  ["Trp","TGG"],
                  ["Arg","CGT","CGC","CGA","CGG","AGA","AGG"],
                  ["Gly","GGT","GGC","GGA","GGG"]];

//Formats the sequence to have a continuous series of letters (removes numbers, blanks, hyphens, tabs and line breaks)
var formatSequence = function(input){
  var formatted = input.split(/[0-9]|\s|\n|\t|\/|\-/g).join("").toUpperCase();
  return formatted;
};

//Checks if the sequence contains unexpected characters
var isSequenceValid = function(sequence){
  var validChar = "A T G C";
  for(var i = 0; i < sequence.length; i ++){
    if (!validChar.includes(sequence[i])){
      return false;
    }
  }
};

//Gives the frequency of each nucleotide
var nucleotideFrequency = function(sequence){
  var DNAchars = ["A", "C", "G", "T"];
  var DNAcharCount = [];
  var DNAcharFreq = [];
  for (var i = 0; i < DNAchars.length; i++) {
    DNAcharCount[i] = sequence.split(DNAchars[i]).length - 1;
    DNAcharFreq[i] = +((DNAcharCount[i] / sequence.length) * 100).toFixed(2);
  }
  return DNAcharFreq;
};

//Predicts translation of gene to protein
var translation = function(sequence){
  var trioSequence = sequence.match(/[ATGC]{1,3}/g);
  var translation = [];
  for(var i = 0; i < trioSequence.length; i ++){
    for(var j = 0; j < codonTable.length; j ++){
      for(var k = 1; k < codonTable[j].length; k ++){
        if(trioSequence[i] === codonTable[j][k]){
          translation.push(codonTable[j][0]);
        }
      }
    }
  }
  return translation;
};

//Cuts out the translated sequence between codon start (first Met) to codon STOP
var translationShort = function (protseq){
  if(protseq.indexOf("Met") === -1){
    return [];
  }
  var start = protseq.indexOf("Met");
  var a = protseq.slice(start,protseq.length +1);
  if(a.indexOf("STOP") === -1){
    var end = a.length;
  }
  else{
    var end = a.indexOf("STOP");
  }
  var b = a.slice(0,end);
  return b;
};

//Writes the result of the function to HTML
var writeToHtml = function(result,title,id,button){
  var newdiv = document.createElement("div");                //Create a div element
  newdiv.id = id;                                            //Give the div element an id
  var newp = document.createElement("p");                    //Create a p element
  var newtitle = document.createTextNode(title);             //Create the title
  var newspan = document.createElement("span");              //Create a span element
  var newresult = document.createTextNode(result);           //Create the result text
  newp.appendChild(newtitle);                                //Append the title to the p
  newdiv.appendChild(newp);                                  //Append the p to the div
  newspan.appendChild(newresult);                            //Append the result text to the span
  newdiv.appendChild(newspan);                               //Append the text span to the div
  document.getElementById("results").appendChild(newdiv);    //Append the div to div id "results"
  if(button){                                                //If specified, create a show result button (to tidy up the page)
    var newbutton = document.createElement("button");
    var newbuttontext = document.createTextNode("Show");
    newbutton.appendChild(newbuttontext);
    newbutton.addEventListener("click", function(){newspan.style.cssText = "display: block;"});
    newp.appendChild(newbutton);
  }
};

//Main function
var analyseDNA = function(){
  document.getElementById("results").innerHTML = "";                      //erases all previous analysis results
  var submittedSequence = document.getElementById("DNA").value;           //stores submitted DNA sequence
  var formattedSequence = formatSequence(submittedSequence);
  if(isSequenceValid(formattedSequence) === false){                       //Returns error if the input contains non-nucleotide elements
    alert("The sequence contains at least one forbidden character!");
    return;
  }
  writeToHtml(formattedSequence,"Formatted sequence: ","formattedseq",1);

  var nucleotideFrequencies = nucleotideFrequency(formattedSequence).join(" ");
  writeToHtml(nucleotideFrequencies,"Nucleotide frequencies in percentage (A,T,G,C): ","nucleotidefreq");

  var translatedSequence1 = translation(formattedSequence);
  writeToHtml(translatedSequence1.join(" "),"Translation prediction from first nucleotide position: ","translatedseq1",1);
  writeToHtml(translationShort(translatedSequence1).join(" "),"Possible protein:","shorttranslatedseq1",1);

  var translatedSequence2 = translation(formattedSequence.slice(1,formattedSequence.length + 1));
  writeToHtml(translatedSequence2.join(" "),"Translation prediction from second nucleotide position: ","translatedseq2",1);
  writeToHtml(translationShort(translatedSequence2).join(" "),"Possible protein: ","shorttranslatedseq2",1);

  var translatedSequence3 = translation(formattedSequence.slice(2,formattedSequence.length + 1));
  writeToHtml(translatedSequence3.join(" "),"Translation prediction from third nucleotide position: ","translatedseq3",1);
  writeToHtml(translationShort(translatedSequence3).join(" "),"Possible protein: ","shorttranslatedseq3",1);
};
