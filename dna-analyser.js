//Formats the sequence to have a continuous series of letters (removes blanks, hyphens and line breaks)
var formatSequence = function(input){
  var formatted = input.split(" ").join("").split("\n").join("").split("-").join("").toUpperCase();
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

//Writes the result of the function to HTML
var writeToHtml = function(result,sentence){
  var newdiv = document.createElement("div");                            // Create a div element
  var newtext = document.createTextNode(sentence + result);              // Create the text
  newdiv.appendChild(newtext);                                           // Append the text to the div
  document.getElementById("results").appendChild(newdiv);                // Append the div to <body>
};

//Main function
var analyseDNA = function(){
  document.getElementById("results").innerHTML = "";
  var submittedSequence = document.getElementById("DNA").value; //stores submitted DNA sequence
  var formattedSequence = formatSequence(submittedSequence);
  writeToHtml(formattedSequence,"Formatted sequence: ");
  if(isSequenceValid(formattedSequence) === false){
    alert("Unexpected character in sequence!");
    return;
  }
  var nucleotideFrequencies = nucleotideFrequency(formattedSequence);
  writeToHtml(nucleotideFrequencies,"Nucleotide Frequencies in percentage (A,T,G,C): ");
};
