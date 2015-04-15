var createDrumUI = require('./UI').createDrumUI;

var Drum = function(sampler, opts, gain){
  this.gain = gain;
  this.sampler = sampler;
  this.name = opts.name;
  this.probs = []
  this.nexts = [];
  for(var i = 0; i < 6; i++) {
    this.probs.push(Array(16));
    this.nexts.push([0]);
  }
  this.current = 0;
  this.mute = false;
  this.installRow();
}

Drum.prototype.play = function(pos){
  if(!this.mute && Math.random() < this.probs[this.current][pos]){
    this.sampler.start();
  }
}

Drum.prototype.installRow = function(){
  var drum = createDrumUI(this);

  document.body.appendChild(drum);
}

Drum.prototype.loadRows = function(){
  var that = this;
  var noteString = localStorage.getItem(this.name);
  if(!noteString) return;
  this.probs = noteString.split("$").map(function(row){
    return row.split(",");
  });

  var nextString = localStorage.getItem(this.name+"-nexts");
  if(!nextString) return;
  this.nexts = nextString.split("$").map(function(row){
    return row.split(",");
  });

  this.loadRow();
}

Drum.prototype.loadRow = function(){
  var that = this;
  this.probs[this.current].forEach(function(val, i){
    if(!isNaN(val)){
      document.querySelector('.'+that.name+' input[data-index="'+i+'"]').value = val;
    }
  });

  document.querySelector('.'+this.name+' .nexts').value = this.nexts[this.current].join(",");
  document.querySelector('.'+this.name+' select').value = this.current;
}

Drum.prototype.saveRows = function(){
  var rows = this.probs.map(function(row){
    return row.join(",");
  });
  localStorage.setItem(this.name, rows.join("$"));


  var nexts = this.nexts.map(function(next){
    return next.join(",");
  });
  localStorage.setItem(this.name+"-nexts", nexts.join("$"));
}

Drum.prototype.exportRows = function(){
  return {
    name: this.name,
    probs: this.probs,
    nexts: this.nexts
  }
}

Drum.prototype.toggleMute = function(){
  this.mute = !this.mute;
}

Drum.prototype.updateVolume = function(val){
  this.gain.gain.value = val;
}


Drum.prototype.next = function(){
  var nexts = this.nexts[this.current];
  this.current = nexts[~~(Math.random() * nexts.length)];
  this.loadRow();
};

module.exports = Drum;