var createSynthUI = require('./UI').createSynthUI;
var int2freq = require("int2freq");

var Synth = function(oscillator, opts){
  this.oscillator = oscillator;
  this.name = opts.name;
  this.type = opts.type;
  this.probs = [];
  this.notes = [];
  this.nexts = [];
  for(var i = 0; i < 6; i++) {
    this.probs.push(Array(16));
    this.notes.push(Array(16));
    this.nexts.push([0]);
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
  synth = createSynthUI(this);

  document.body.appendChild(synth);
}

Synth.prototype.saveRows = function(){
  var probs = this.probs.map(function(prob){
    return prob.join(",");
  });
  var notes = this.notes.map(function(note){
    return note.join("|");
  });
  var nexts = this.nexts.map(function(next){
    return next.join(",");
  });
  localStorage.setItem(this.name+"-probs", probs.join("$"));
  localStorage.setItem(this.name+"-notes", notes.join("$"));
  localStorage.setItem(this.name+"-nexts", nexts.join("$"));
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

  var nextString = localStorage.getItem(this.name+"-nexts");
  if(!nextString) return;
  this.nexts = nextString.split("$").map(function(row){
    return row.split(",");
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

  document.querySelector('.'+this.name+' .nexts').value = this.nexts[this.current].join(",");
  document.querySelector('.'+this.name+' select').value = this.current;
};

Synth.prototype.exportRows = function(){
  return {
    name: this.name,
    type: this.type,
    probs: this.probs,
    notes: this.notes,
    nexts: this.nexts
  }
}

Synth.prototype.toggleMute = function(){
  this.mute = !this.mute;
};

Synth.prototype.next = function(){
  var nexts = this.nexts[this.current];
  this.current = nexts[~~(Math.random() * nexts.length)];
  this.loadRow();
};

module.exports = Synth;