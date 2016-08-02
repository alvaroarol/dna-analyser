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

//Show the tools bar. Emptying the DNA textarea before resizing lets the resize animation be smooth (otherwise particularly laggy on chrome)
var showTools = function(){
  if(document.getElementById("right-col").style.display === "block"){
    var DNAtext = document.getElementById("DNA").value;
    document.getElementById("DNA").value = "";
    document.getElementById("right-col").style.display = "none";
    document.getElementById("center-col").style.width = "900px";
    setTimeout(function(){document.getElementById("DNA").value = DNAtext;}, 300);
  }
  else{
    var DNAtext = document.getElementById("DNA").value;
    document.getElementById("DNA").value = "";
    document.getElementById("right-col").style.display = "block";
    document.getElementById("center-col").style.width = "650px";
    setTimeout(function(){document.getElementById("DNA").value = DNAtext;}, 300);
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
  var sequenceLength = sequence.length;
  if((endcut <= 0) || (startcut <= 0)){
    fillToolsResultsBox("Start and End must be positive integers");
  }
  else if((endcut > sequenceLength) || (startcut > sequenceLength)){
    fillToolsResultsBox("Start and End must be within the sequence length");
  }
  else if(startcut > endcut){
    fillToolsResultsBox("Start position cannot be higher than End position");
  }
  else{
    fillToolsResultsBox(sequence.slice(startcut - 1,endcut));
  }
};

/////////////////////////
//PCR primer functions//
////////////////////////
//Count the percentage of GC content (for GC content AND GC clamp conditions)
var getGCContent = function (sequence){
  var gContent = sequence.split("G").length - 1;
  var cContent = sequence.split("C").length - 1;
  return (gContent + cContent) * 100 / sequence.length;
};

//Calculates Tm (melting temperature)
//Based on the standard approximation for sequences longer than 13 nucleotides. This approximation assumes pH is 7.0, concentration of Na+ is 50mM and concentration of primer is 50nM
var calculateTm = function(sequence){
  var gContent = sequence.split("G").length - 1;
  var cContent = sequence.split("C").length - 1;
  var tContent = sequence.split("T").length - 1;
  var aContent = sequence.split("A").length - 1;
  if(sequence.length < 14){
    return (aContent + tContent) * 2 + (gContent + cContent) * 4;
  }
  else{
    return 64.9 + 41 * (gContent + cContent - 16.4) / (aContent + tContent + gContent + cContent);
  }
};

//Find repeats higher than 4 (nucleotides that repeat more than 4 times in a row)
var findRepeats = function(sequence){
  for(var i = 0; i < sequence.length - 4; i ++){
    var repeatArray = [];
    repeatArray[0] = sequence[i];
    repeatArray[1] = sequence[i + 1];
    repeatArray[2] = sequence[i + 2];
    repeatArray[3] = sequence[i + 3];
    repeatArray[4] = sequence[i + 4];
    if(repeatArray.join("").split(repeatArray[0]).length - 1 === 5){
      return 1;
    }
  }
  return 0;
};

//Find pair repeats higher than 4(nucleotide pairs that repeat more than 4 times in a row)
var findPairRepeats = function(sequence){
  for(var i = 0; i <= sequence.length - 10; i ++){
    var repeatArray = [];
    repeatArray[0] = sequence.slice(i, i + 2);
    repeatArray[1] = sequence.slice(i + 2, i + 4);
    repeatArray[2] = sequence.slice(i + 4, i + 6);
    repeatArray[3] = sequence.slice(i + 6, i + 8);
    repeatArray[4] = sequence.slice(i + 8, i + 10);
    if(repeatArray.join("").split(repeatArray[0]).length - 1 === 5){
      return 1;
    }
  }
  return 0;
};

//Main PCR primer function
var pcrAnalyse = function(){
  var primer = document.getElementById("pcrbox").value.split(/[0-9]|\s|\n|\t|\/|\-/g).join("").toUpperCase();
  var primerLength = primer.length;
  if(isSequenceValid(primer)){
    var pcrResults = [];
    pcrResults.push("<b>Primer sequence :</b> " + primer + "<br/><br/>");

    if((primerLength >= 18) && (primerLength <= 30)){
      pcrResults.push("<b>Length :</b> " + primerLength + " nucleotides<br/><br/>");
    }
    else{
      pcrResults.push("<b>Length :</b> <span>" + primerLength + " nucleotides</span><br/><br/>");
    }

    var gcContent = getGCContent(primer);
    if((gcContent >= 40) && (gcContent <= 60)){
      pcrResults.push("<b>GC content :</b> " + gcContent.toFixed(2) + "%<br/><br/>");
    }
    else{
      pcrResults.push("<b>GC content :</b><span> " + gcContent.toFixed(2) + "%</span><br/><br/>");
    }

    gcContent = getGCContent(primer.slice(primerLength - 5, primerLength)) * 5 / 100;
    if(gcContent <= 3){
      pcrResults.push("<b>GC content in last 5 nucleotides :</b> " + gcContent + " nucleotides<br/><br/>");
    }
    else{
      pcrResults.push("<b>GC content in last 5 nucleotides :</b><span> " + gcContent + " nucleotides</span><br/><br/>");
    }

    pcrResults.push("<b>Molecular weight :</b> " + molecularWeight(primer) + " Da<br/><br/>");

    var primerTm = calculateTm(primer).toFixed(2);
    if((primerTm > 52) && (primerTm < 60)){
        pcrResults.push("<b>Melting temperature (basic) :</b> " + primerTm + "°C<br/><br/>");
    }
    else{
      pcrResults.push("<b>Melting temperature (basic) :</b><span> " + primerTm + "°C</span><br/><br/>");
    }

    if(findRepeats(primer)){
      pcrResults.push("<b>Higher than 4 times in a row single repeats :</b> <span>Yes</span>" + "<br/><br/>");
    }
    else{
      pcrResults.push("<b>Higher than 4 times in a row single repeats :</b> " + "No" + "<br/><br/>");
    }

    if(findPairRepeats(primer)){
      pcrResults.push("<b>Higher than 4 times in a row pair repeats :</b> <span style=\"color:red\">Yes</span>" + "<br/><br/>");
    }
    else{
      pcrResults.push("<b>Higher than 4 times in a row pair repeats :</b> " + "No" + "<br/><br/>");
    }

    pcrResults.push("<input type=\"button\" id=\"pcrblastbutton\" value=\"BLAST\" onclick=\"submitBLAST(&quot;pcrbox&quot;)\"/>");

    fillToolsResultsBox(pcrResults.join(""));
  }
  else{
    fillToolsResultsBox("The primer is not a valid DNA sequence.");
  }
};
