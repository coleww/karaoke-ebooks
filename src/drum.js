var createDefaultInstrumentUI = require('./UI').createDefaultInstrumentUI;

var Drum = function(sampler, name){
  this.sampler = sampler;
  this.name = name;
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
  var that = this;

  var drum = document.createElement("div");
  drum.setAttribute("class", this.name);

  for(var i = 0; i < this.probs[this.current].length; i++){
    var cell = document.createElement("input");
    cell.setAttribute("type", "text")
    cell.setAttribute("class", "prob")
    cell.setAttribute("data-index", i);
    cell.addEventListener("keyup", function updateProbz(e){
      that.probs[that.current][~~e.target.dataset.index] = parseFloat(e.target.value);
    });
    drum.appendChild(cell);
  }

  createDefaultInstrumentUI(this, drum);

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

Drum.prototype.toggleMute = function(){
  this.mute = !this.mute;
}


Drum.prototype.next = function(){
  var nexts = this.nexts[this.current];
  this.current = nexts[~~(Math.random() * nexts.length)];
  this.loadRow();
};

module.exports = Drum;