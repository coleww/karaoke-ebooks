function createSaveLoadButtons(instruments){
  var saveBtn = document.createElement("button");
  saveBtn.textContent = "save all";
  saveBtn.addEventListener("click", function(){
    instruments.forEach(function(instrument){
      instrument.saveRows();
    })
  })
  document.body.appendChild(saveBtn);

  var loadBtn = document.createElement("button");
  loadBtn.textContent = "load all";
  loadBtn.addEventListener("click", function(){
    instruments.forEach(function(instrument){
      instrument.loadRows();
    })
  })
  document.body.appendChild(loadBtn);
}

function createDefaultInstrumentUI(that, container){
  var label = document.createElement("span");
  label.setAttribute("class", "label")
  label.textContent = that.name;
  container.appendChild(label);

  var muteBtn = document.createElement("button");
  muteBtn.textContent = "mute";
  muteBtn.addEventListener("click", function(){
    that.toggleMute();
    if(muteBtn.classList.contains("inactive")){
      muteBtn.classList.remove("inactive");
    } else {
      muteBtn.classList.add("inactive");
    }
  })
  container.appendChild(muteBtn);

  var currentSelect = document.createElement("select");
  currentSelect.addEventListener("change", function updateProbz(e){
    that.current = ~~e.target.value;
    that.loadRow();
  });
  for(var i = 0; i < 6; i++){
    var opt = document.createElement("option");
    opt.value = opt.textContent = i;
    currentSelect.appendChild(opt);
  }
  container.appendChild(currentSelect);
}

module.exports = {
  createSaveLoadButtons: createSaveLoadButtons,
  createDefaultInstrumentUI: createDefaultInstrumentUI
}