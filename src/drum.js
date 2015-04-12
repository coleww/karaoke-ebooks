var createDefaultInstrumentUI = require('./UI').createDefaultInstrumentUI;

var Drum = function(sampler, name){
  this.sampler = sampler;
  this.name = name;
  this.probs = Array(16);
  this.mute = false;
  this.installRow();
}

Drum.prototype.play = function(pos){
  if(!this.mute && Math.random() < this.probs[pos]){
    this.sampler.start();
  }
}

Drum.prototype.installRow = function(){
  var that = this;

  var drum = document.createElement("div");
  drum.setAttribute("class", this.name);

  for(var i = 0; i < this.probs.length; i++){
    var cell = document.createElement("input");
    cell.setAttribute("type", "text")
    cell.setAttribute("class", "prob")
    cell.setAttribute("data-index", i);
    cell.addEventListener("keyup", function updateProbz(e){
      that.probs[~~e.target.dataset.index] = parseFloat(e.target.value);
    });
    drum.appendChild(cell);
  }

  createDefaultInstrumentUI(this, drum);

  document.body.appendChild(drum);
}

Drum.prototype.loadRow = function(){
  var that = this;
  var noteString = localStorage.getItem(this.name);
  if(!noteString) return;
  this.probs = noteString.split(",");
  this.probs.forEach(function(val, i){
    if(!isNaN(val)){
      document.querySelector('.'+that.name+' input[data-index="'+i+'"]').value = val;
    }
  });
}

Drum.prototype.saveRow = function(){
  localStorage.setItem(this.name, this.probs.join(","));
}

Drum.prototype.toggleMute = function(){
  this.mute = !this.mute;
}

module.exports = Drum;