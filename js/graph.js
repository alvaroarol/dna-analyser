var drawFrequencies = function(object,id){
  //Create canvas
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");
  canvas.height = 200;
  canvas.style.background = "white";
  //Get the highest value in the object
  var maxValue = 0;
  var totalValueSum = 0;
  for(var x in object){
    if(object[x] > maxValue){
      maxValue = object[x];
    }
    totalValueSum += object[x];
  }
  //Set the quantity of bars to draw (number of object keys) and set a graph width accordingly
  var barCount = Object.keys(object).length;
  canvas.width = barCount * 50; //10 width for each bar + 5 spacing on each side
  //Draw the bars
  var keyCount = 0;
  for(var x in object){
    //Draw highest bar(s) in red, others in blue
    if(object[x] === maxValue){
      context.fillStyle = "red";
    }
    else{
      context.fillStyle = "blue";
    }
    //Draw Bar
    context.fillRect(5 + keyCount * 50, 180, 40, - Math.floor(object[x] * 160 / maxValue));
    //Write nucleotide
    context.fillStyle = "black";
    context.font = "20px monospace";
    context.textBaseline="middle";
    context.textAlign="center";
    context.fillText(x,5 + keyCount * 50 + 20, 192);
    //Write percentage
    context.fillStyle = "black";
    context.font = "13px monospace";
    context.fillText((object[x] * 100 / totalValueSum).toFixed(2) + "%",5 + keyCount * 50 + 20, 10 + 160 - Math.floor(object[x] * 158 / maxValue));
    keyCount ++;
  }
  //Transform canvas into an image
  var dataURL = canvas.toDataURL("image/png");
  var canvasImage = document.createElement("img");
  canvasImage.src = dataURL;
  document.getElementById(id + "span").innerHTML += "<br/>";
  document.getElementById(id + "span").appendChild(canvasImage);
  //document.body.appendChild(canvas);
};
