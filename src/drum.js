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

  var drum = document.createElement("div");
  drum.setAttribute("class", this.name);

  for(var i = 0; i < this.notes.length; i++){
    var cell = document.createElement("input");
    cell.setAttribute("type", "text")
    cell.setAttribute("class", "drum-prob")
    cell.setAttribute("data-index", i);
    cell.addEventListener("keyup", function updateProbz(e){
      that.notes[~~e.target.dataset.index] = parseFloat(e.target.value);
    });
    drum.appendChild(cell);
  }

  var label = document.createElement("span");
  label.textContent = this.name;
  drum.appendChild(label);

  var saveBtn = document.createElement("button");
  saveBtn.textContent = "save";
  saveBtn.addEventListener("click", function(){
    that.saveRow();
  })
  drum.appendChild(saveBtn);

  var loadBtn = document.createElement("button");
  loadBtn.textContent = "load";
  loadBtn.addEventListener("click", function(){
    that.loadRow();
  })
  drum.appendChild(loadBtn);

  document.body.appendChild(drum);
}

Drum.prototype.loadRow = function(){
  var that = this;
  this.notes = localStorage.getItem(this.name).split(",");
  this.notes.forEach(function(val, i){
    document.querySelector('.'+that.name+' input[data-index="'+i+'"]').value = val;
  });
}

Drum.prototype.saveRow = function(){
  localStorage.setItem(this.name, this.notes.join(","));
}

module.exports = Drum;