var int2freq = require("int2freq");

var Instrument = function(player, opts, gain, filter, updateUI){
  this.player = player;
  this.gain = gain;
  this.filter = filter;
  this.name = opts.name;
  this.type = opts.type;
  // console.log(opts)
  this.probs = opts.probs || [];
  this.notes = opts.notes || [];
  this.nexts = opts.nexts || [];
  if(!this.probs.length){
    // console.log("burp")
    for(var i = 0; i < 6; i++) {
      this.probs.push(Array(16));
      this.notes.push(Array(16));
      this.nexts.push([i]);
    }
  }
  this.current = 0;
  this.playing = false;
  this.updateUI = updateUI;//.bind(this);
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
      // TODO:
      // WRAP THIS BUSINESS?
      this.player.frequency.setValueAtTime(freq, ac.currentTime);
      this.player.start();
      this.playing = true;
    } else {
      this.player.start();
    }
  } else {
    if(this.type !== "drum"){
      // TODO:
      // ADSR?
      if(this.playing) this.player.stop(ac.currentTime);
      this.playing = false
    }
  }
}

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
  if(!same) this.updateUI();
};

module.exports = Instrument;