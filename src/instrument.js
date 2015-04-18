var createSynthUI = require('./UI').createSynthUI;
var createDrumUI = require('./UI').createDrumUI;
var int2freq = require("int2freq");

var Instrument = function(player, opts, gain, filter){
  this.player = player;
  this.gain = gain;
  this.filter = filter;
  this.name = opts.name;
  this.type = opts.type;
  this.probs = opts.probs || [];
  this.notes = opts.notes || [];
  this.nexts = opts.nexts || [];
  if(!this.probs.length){
    for(var i = 0; i < 6; i++) {
      this.probs.push(Array(16));
      this.notes.push(Array(16));
      this.nexts.push([i]);
    }
  }
  this.current = 0;
  this.playing = false;
  this.installRow();
  if(opts.gain){
    this.updateVolume(opts.gain);
  }
  if(opts.freq){
    this.updateFilter(opts.freq);
  }
}

Instrument.prototype.play = function(pos, ac, key){
  if(Math.random() < this.probs[this.current][pos]){
    if(this.type !== "drum"){
      var noteInt = this.notes[this.current][pos][~~(Math.random() * this.notes[this.current][pos].length)]
      if(!noteInt) noteInt = 0;
      var freq = int2freq(~~noteInt, key);
      this.player.frequency.setValueAtTime(freq, ac.currentTime);
      this.player.start();
      this.playing = true;
    } else {
      this.player.start();
    }
  } else {
    if(this.type !== "drum"){
      if(this.playing) this.player.stop(ac.currentTime);
      this.playing = false
    }
  }
}

Instrument.prototype.installRow = function(){
  inst = this.type !== "drum" ? createSynthUI(this) : createDrumUI(this);

  document.body.appendChild(inst);
}

Instrument.prototype.saveRows = function(){
  var probs = this.probs.map(function(prob){
    return prob.join(",");
  });
  localStorage.setItem(this.name+"-probs", probs.join("$"));

  if(this.type !== "drum"){
    var notes = this.notes.map(function(note){
      return note.join("|");
    });

    localStorage.setItem(this.name+"-notes", notes.join("$"));
  }

  var nexts = this.nexts.map(function(next){
    return next.join(",");
  });
  localStorage.setItem(this.name+"-nexts", nexts.join("$"));

  localStorage.setItem(this.name+"-gain", this.gain.gain.value);
  localStorage.setItem(this.name+"-freq", this.filter.frequency.value);
}

Instrument.prototype.loadRows = function(){
  var that = this;
  var probString = localStorage.getItem(this.name+"-probs");
  if(!probString) return;
  this.probs = probString.split("$").map(function(row){
    return row.split(",");
  });

  if(this.type !== "drum"){
    var notesString = localStorage.getItem(this.name+"-notes");
    if(!notesString) return;
    this.notes = notesString.split("$").map(function(row){
      return row.split("|").map(function(cell){
        return cell.split(",");
      });
    });
  }

  var nextString = localStorage.getItem(this.name+"-nexts");
  if(!nextString) return;
  this.nexts = nextString.split("$").map(function(row){
    return row.split(",");
  });

  this.updateVolume(localStorage.getItem(this.name+"-gain"));
  this.updateFilter(localStorage.getItem(this.name+"-freq"));

  this.loadRow();
};

Instrument.prototype.loadRow = function(){
  var that = this;
  this.probs[this.current].forEach(function(val, i){
    document.querySelector('.'+that.name+' input[data-index="'+i+'"].prob').value = val;
  });

  if(this.type !== "drum"){
    this.notes[this.current].forEach(function(val, i){
      document.querySelector('.'+that.name+' input[data-index="'+i+'"].notes').value = val.join(",");
    });
  }

  document.querySelector('.'+this.name+' .nexts').value = this.nexts[this.current].join(",");
  document.querySelector('.'+this.name+' select').value = this.current;
  document.querySelector('.'+this.name+' .volume').value = this.gain.gain.value;
  document.querySelector('.'+this.name+' .filter').value = this.filter.frequency.value;
};

Instrument.prototype.exportRows = function(){
  return {
    name: this.name,
    type: this.type,
    probs: this.probs,
    notes: this.notes,
    nexts: this.nexts,
    gain: this.gain.gain.value,
    freq: this.filter.frequency.value
  }
}


Instrument.prototype.updateVolume = function(val){
  this.gain.gain.value = val;
}

Instrument.prototype.updateFilter = function(val){
  this.filter.frequency.value = val;
}

Instrument.prototype.next = function(){
  var nexts = this.nexts[this.current];
  var next = nexts[~~(Math.random() * nexts.length)];
  var same = next === this.current;
  this.current = next;
  if(!same) this.loadRow();
};

module.exports = Instrument;