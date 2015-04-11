var int2freq = require("int2freq");

var Synth = function(oscillator, name){
  this.oscillator = oscillator;
  this.name = name;
  this.probs = Array(16);
  this.notes = Array(16);
  this.playing = false;
  this.installRow();
}

Synth.prototype.play = function(pos, ac){
  if(Math.random() < this.probs[pos]){
    var noteInt = this.notes[pos][~~(Math.random() * this.notes[pos].length)]
    if(!noteInt) noteInt = 0;
    var freq = int2freq(~~noteInt, {tonic: 'C3', scale: 'major'});
    this.oscillator.frequency.setValueAtTime(freq, ac.currentTime);
    this.oscillator.start();
    this.playing = true;
  } else {
    if(this.playing) this.oscillator.stop(ac.currentTime);
    this.playing = false
  }
}

Synth.prototype.installRow = function(){
  var that = this;

  var synth = document.createElement("div");
  synth.setAttribute("class", this.name);

  var synthProbs = document.createElement("div");
  synthProbs.setAttribute("class", "synth-probs");
  for(var i = 0; i < this.probs.length; i++){
    var cell = document.createElement("input");
    cell.setAttribute("type", "text")
    cell.setAttribute("class", "prob")
    cell.setAttribute("data-index", i);
    cell.addEventListener("keyup", function updateProbz(e){
      that.probs[~~e.target.dataset.index] = parseFloat(e.target.value);
    });
    synthProbs.appendChild(cell);
  }

  var clearFix = document.createElement("div");
  clearFix.setAttribute("class", "cf");
  synthProbs.appendChild(clearFix);

  for(var i = 0; i < this.probs.length; i++){
    var cell = document.createElement("input");
    cell.setAttribute("type", "text")
    cell.setAttribute("class", "notes")
    cell.setAttribute("data-index", i);
    cell.addEventListener("keyup", function updateProbz(e){
      that.notes[~~e.target.dataset.index] = e.target.value.split(",");
    });
    synthProbs.appendChild(cell);
  }

  synth.appendChild(synthProbs)

  var label = document.createElement("span");
  label.setAttribute("class", "label")
  label.textContent = this.name;
  synth.appendChild(label);

  var saveBtn = document.createElement("button");
  saveBtn.textContent = "save";
  saveBtn.addEventListener("click", function(){
    that.saveRow();
  })
  synth.appendChild(saveBtn);

  var loadBtn = document.createElement("button");
  loadBtn.textContent = "load";
  loadBtn.addEventListener("click", function(){
    that.loadRow();
  })
  synth.appendChild(loadBtn);

  document.body.appendChild(synth);
}

Synth.prototype.saveRow = function(position){
  localStorage.setItem(this.name+"-probs", this.probs.join(","));
  localStorage.setItem(this.name+"-notes", this.notes.join("|"));
}

Synth.prototype.loadRow = function(position){
  var that = this;
  var probString = localStorage.getItem(this.name+"-probs");
  if(!probString) return;
  this.probs = probString.split(",");
  this.probs.forEach(function(val, i){
    document.querySelector('.'+that.name+' input[data-index="'+i+'"].prob').value = val;
  });

  var notesString = localStorage.getItem(this.name+"-notes");
  if(!notesString) return;
  this.notes = notesString.split("|").map(function(cell){
    return cell.split(",");
  });
  this.notes.forEach(function(val, i){
    document.querySelector('.'+that.name+' input[data-index="'+i+'"].notes').value = val.join(",");
  });
}
module.exports = Synth;