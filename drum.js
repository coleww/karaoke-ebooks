var Drum = function(sampler, name){
  this.sampler = sampler;
  this.name = name;
  this.notes = Array(16);
  this.installRow();
}

Drum.prototype.play = function(pos){
  if(Math.random() < this.notes[pos]){
    this.sampler.start();
  }
}

Drum.prototype.installRow = function(){
  var that = this;

  var drum = document.createElement("div")
  drum.setAttribute("class", name);

  for(var i = 0; i < this.notes.length; i++){
    var cell = document.createElement("input");
    cell.setAttribute("type", "text")
    cell.setAttribute("class", "drum-prob")
    cell.setAttribute("data-index", i);
    cell.addEventListener('keyup', function updateProbz(e){
      that.notes[~~e.target.dataset.index] = parseFloat(e.target.value);
    });
    drum.appendChild(cell);
  }

  document.body.appendChild(drum);
}

Drum.prototype.loadRow = function(notes){
  // notes => array of values
  // replaces this.notes
  // update dom
}

module.exports = Drum;