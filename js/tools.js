var proteinNotation = {
  "Cys": "C",
  "Ser": "S",
  "Thr": "T",
  "Pro": "P",
  "Ala": "A",
  "Gly": "G",
  "Asn": "N",
  "Asp": "D",
  "Glu": "E",
  "Gln": "Q",
  "His": "H",
  "Arg": "R",
  "Lys": "K",
  "Met": "M",
  "Ile": "I",
  "Leu": "L",
  "Val": "V",
  "Phe": "F",
  "Tyr": "Y",
  "Trp": "W",
  "***": "*"
};

//Show the tools bar
var showTools = function(){
  if(document.getElementById("right-col").style.display === "none"){
    document.getElementById("right-col").style.display = "block";
    document.getElementById("left-col").style.display = "block";
    document.getElementById("center-col").style.width = "650px";
  }
  else{
    document.getElementById("right-col").style.display = "none";
    document.getElementById("left-col").style.display = "none";
    document.getElementById("center-col").style.width = "1125px";
  }
};

//Close the results box
var closeToolsResults = function(){
  document.getElementById("toolsresultsbox").innerHTML = "";
  document.getElementById("toolsresults").style.display = "none";
};

//Fill the results box and display it
var fillToolsResultsBox = function(content){
  document.getElementById("toolsresultsbox").innerHTML = content;
  document.getElementById("toolsresults").style.display = "block";
  //Selects all text automatically when clicking on the box, for easier copy and paste
  document.getElementById("toolsresultsbox").addEventListener("dblclick",function(){
    var range = document.createRange();
    range.selectNodeContents(document.getElementById("toolsresultsbox"));
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  });
};

//Format the DNA sequence to FASTA
var formatFasta = function(){
  var sequence = document.getElementById("formattingbox").value;
  var sequenceFasta = sequence.split(/[0-9]|\s|\n|\t|\/|\-/g).join("").toUpperCase();
  fillToolsResultsBox(sequenceFasta);
};

//Format the DNA sequence to indexed
var formatIndexed = function(){
  var sequence = document.getElementById("formattingbox").value.split(/[0-9]|\s|\n|\t|\/|\-/g).join("").toUpperCase();
  var sequenceIndexed = formatSequence(sequence);
  fillToolsResultsBox(sequenceIndexed);
};

//Format the protein sequence to 1 letter notation
var formatOneLetter = function(){
  var sequence = document.getElementById("formattingbox").value.split(/[0-9]|\s|\n|\t|\/|\-{1,3}/g).join("").match(/[a-zA-Z\*]{1,3}/g);
  var sequenceOneLetter = [];
  for(var i in sequence){
    sequenceOneLetter.push(proteinNotation[sequence[i]]);
  }
  fillToolsResultsBox(sequenceOneLetter.join(""));
};

//Format the protein sequence to 3 letter notation
var formatThreeLetter = function(){
  var sequence = document.getElementById("formattingbox").value.split(/[0-9]|\s|\n|\t|\/|\-{1,3}/g).join("");
  var sequenceThreeLetter = [];
  for(var i in sequence){
    for(var j in proteinNotation){
      if(proteinNotation[j] === sequence[i]){
        sequenceThreeLetter.push(j);
        break;
      }
    }
  }
  fillToolsResultsBox(sequenceThreeLetter.join(""));
};

//Isolate interval from sequence
var isolateInterval = function(){
  var startcut = Number(document.getElementById("startcut").value);
  var endcut = Number(document.getElementById("endcut").value);
  var sequence = document.getElementById("cutbox").value.split(/[0-9]|\s|\n|\t|\/|\-/g).join("").toUpperCase();
  if((endcut <= 0) || (startcut <= 0)){
    fillToolsResultsBox("Start and End must be positive integers");
  }
  else if((endcut > sequence.length) || (startcut > sequence.length)){
    fillToolsResultsBox("Start and End must be within the sequence length");
  }
  else if(startcut > endcut){
    fillToolsResultsBox("Start position cannot be higher than End position");
  }
  else{
    fillToolsResultsBox(sequence.slice(startcut - 1,endcut));
  }
};
