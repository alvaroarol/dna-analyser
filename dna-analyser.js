//Formats the sequence to have a continuous series of letters (removes blanks, hyphens and line breaks)
var formatSequence = function(input){
  var formatted = input.split(" ").join("").split("\n").join("").split("-").join("").toUpperCase();
  writeToHtml(formatted,"Formated sequence: ");
  return formatted;
};

//Gives the frequency of each nucleotide
var nucleotideFrequency = function(sequence){
  var a = 0;
  var t = 0;
  var g = 0;
  var c = 0;
  for(var i = 0; i < sequence.length; i ++){
    if(sequence[i] === "A"){
      a ++;
    }
    else if(sequence[i] === "T"){
      t ++;
    }
    else if(sequence[i] === "G"){
      g ++;
    }
    else if(sequence[i] === "C"){
      c ++;
    }
  }
  var aFreq = +((a / sequence.length) * 100).toFixed(2);
  var tFreq = +((t / sequence.length) * 100).toFixed(2);
  var gFreq = +((g / sequence.length) * 100).toFixed(2);
  var cFreq = +((c / sequence.length) * 100).toFixed(2);
  var allFreq = [aFreq,tFreq,gFreq,cFreq];
  writeToHtml(allFreq,"Nucleotide Frequencies in percentage (A,T,G,C): ");
  return allFreq;
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
  var nucleotideFrequencies = nucleotideFrequency(formattedSequence);
};
