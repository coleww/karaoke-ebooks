var createDefaultInstrumentUI = require('./UI').createDefaultInstrumentUI;
var int2freq = require("int2freq");

var Synth = function(oscillator, name){
  this.oscillator = oscillator;
  this.name = name;
  this.probs = [];
  this.notes = [];
  for(var i = 0; i < 6; i++) {
    this.probs.push(Array(16));
    this.notes.push(Array(16));
  }
  this.current = 0;
  this.mute = false;
  this.playing = false;
  this.installRow();
}

Synth.prototype.play = function(pos, ac, key){
  if(!this.mute && Math.random() < this.probs[this.current][pos]){
    var noteInt = this.notes[this.current][pos][~~(Math.random() * this.notes[this.current][pos].length)]
    if(!noteInt) noteInt = 0;
    var freq = int2freq(~~noteInt, key);
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
  for(var i = 0; i < this.probs[this.current].length; i++){
    var cell = document.createElement("input");
    cell.setAttribute("type", "text")
    cell.setAttribute("class", "prob")
    cell.setAttribute("data-index", i);
    cell.addEventListener("keyup", function updateProbz(e){
      that.probs[that.current][~~e.target.dataset.index] = parseFloat(e.target.value);
    });
    synthProbs.appendChild(cell);
  }

  var clearFix = document.createElement("div");
  clearFix.setAttribute("class", "cf");
  synthProbs.appendChild(clearFix);

  for(var i = 0; i < this.notes[this.current].length; i++){
    var cell = document.createElement("input");
    cell.setAttribute("type", "text")
    cell.setAttribute("class", "notes")
    cell.setAttribute("data-index", i);
    cell.addEventListener("keyup", function updateProbz(e){
      that.notes[that.current][~~e.target.dataset.index] = e.target.value.split(",");
    });
    synthProbs.appendChild(cell);
  }

  synth.appendChild(synthProbs)

  createDefaultInstrumentUI(this, synth);

  document.body.appendChild(synth);
}

Synth.prototype.saveRows = function(){
  var probs = this.probs.map(function(prob){
    return prob.join(",");
  });
  var notes = this.notes.map(function(note){
    return note.join("|");
  });
  localStorage.setItem(this.name+"-probs", probs.join("$"));
  localStorage.setItem(this.name+"-notes", notes.join("$"));
}

Synth.prototype.loadRows = function(){
  var that = this;
  var probString = localStorage.getItem(this.name+"-probs");
  if(!probString) return;
  this.probs = probString.split("$").map(function(row){
    return row.split(",");
  });


  var notesString = localStorage.getItem(this.name+"-notes");
  if(!notesString) return;
  this.notes = notesString.split("$").map(function(row){
    return row.split("|").map(function(cell){
      return cell.split(",");
    });
  });

  this.loadRow();
};

Synth.prototype.loadRow = function(){
  var that = this;
  this.probs[this.current].forEach(function(val, i){
    document.querySelector('.'+that.name+' input[data-index="'+i+'"].prob').value = val;
  });

  this.notes[this.current].forEach(function(val, i){
    document.querySelector('.'+that.name+' input[data-index="'+i+'"].notes').value = val.join(",");
  });
};

Synth.prototype.toggleMute = function(){
  this.mute = !this.mute;
}

module.exports = Synth;