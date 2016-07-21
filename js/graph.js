var drawFrequencies = function(object,id,order){
  if(object === undefined){
    return
  }
  //Create canvas
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");
  canvas.height = 200;
  canvas.style.background = "white";
  //Get the total sum of values in the object and the maximum value
  var totalValueSum = 0;
  var maxValue = 0;
  for(var x in object){
    if(object[x] > maxValue){
      maxValue = object[x];
    }
    totalValueSum += object[x];
  }
  //Set the quantity of bars to draw (number of object keys) and set a graph width accordingly
  var barCount = Object.keys(object).length;
  canvas.width = barCount * 50; //10 width for each bar + 5 spacing on each side
  //If order is true, order the object to display the bars in decreasing value
  if(order){
    var orderedArray = Object.keys(object).sort(function(a,b){return object[a]-object[b]}).reverse();
  }
  else{
    var orderedArray = Object.keys(object);
  }
  //Draw the bars
  var keyCount = 0;
  for(var x in orderedArray){
    //Percentages higher than 1/N(codons) are shown in deep blue, lower ones are shown in light blue, highest one in red
    if(object[orderedArray[x]] === maxValue){
      context.fillStyle = "red";
    }
    else if((object[orderedArray[x]] * 100 / totalValueSum) > 100 / orderedArray.length){
      context.fillStyle = "blue";
    }
    else{
      context.fillStyle = "cornflowerblue";
    }
    //Draw Bar
    context.fillRect(5 + keyCount * 50, 180, 40, - Math.floor(object[orderedArray[x]] * 160 / maxValue));
    //Write nucleotide
    context.fillStyle = "black";
    context.font = "20px monospace";
    context.textBaseline="middle";
    context.textAlign="center";
    context.fillText(orderedArray[x],5 + keyCount * 50 + 20, 192);
    //Write percentage
    context.fillStyle = "black";
    context.font = "13px monospace";
    context.fillText((object[orderedArray[x]] * 100 / totalValueSum).toFixed(2) + "%",5 + keyCount * 50 + 20, 10 + 160 - Math.floor(object[orderedArray[x]] * 158 / maxValue));
    keyCount ++;
  }
  //Transform canvas into an image
  var dataURL = canvas.toDataURL("image/png");
  var canvasImage = document.createElement("img");
  canvasImage.src = dataURL;
  //Set max width and make an eventlistener on click that zooms in the image
  canvasImage.style.maxWidth = "500px";
  canvasImage.addEventListener("click", function(){
    if(this.style.maxWidth === "500px"){
      this.style.maxWidth = "2000px";
    }
    else{
      this.style.maxWidth = "500px";
    }
    console.log(this.style.maxWidth);
  });
  document.getElementById(id + "span").innerHTML += "<br/><br/>";
  document.getElementById(id + "span").appendChild(canvasImage);
};
