function createSaveLoadButtons(instruments){
  var saveBtn = document.createElement("button");
  saveBtn.textContent = "save all";
  saveBtn.addEventListener("click", function(){
    instruments.forEach(function(instrument){
      instrument.saveRow();
    })
  })
  document.body.appendChild(saveBtn);

  var loadBtn = document.createElement("button");
  loadBtn.textContent = "load all";
  loadBtn.addEventListener("click", function(){
    instruments.forEach(function(instrument){
      instrument.loadRow();
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
}

module.exports = {
  createSaveLoadButtons: createSaveLoadButtons,
  createDefaultInstrumentUI: createDefaultInstrumentUI
}