function installMarkers(num){
  var markerRow = document.createElement("div")
  markerRow.setAttribute("class", "beat-markers");

  for(var i = 0; i < num; i++){
    var marker = document.createElement("div");
    marker.setAttribute("class", "marker")
    marker.setAttribute("data-index", i);
    markerRow.appendChild(marker);
  }

  document.body.appendChild(markerRow);
  var clearFix = document.createElement("div");
  clearFix.setAttribute("class", "cf");
  document.body.appendChild(clearFix);
};

function updateMarkers(position, num){
  lastPosition = position - 1;
  if(lastPosition < 0){
    lastPosition = num - 1;
  }
  document.querySelector('.marker[data-index="'+lastPosition+'"]').classList.remove('active');

  document.querySelector('.marker[data-index="'+position+'"]').classList.add('active');
}

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
  muteBtn.setAttribute("class", "active");
  muteBtn.addEventListener("click", function(){
    that.toggleMute();
  })
  container.appendChild(muteBtn);
}

module.exports = {
  installMarkers: installMarkers,
  updateMarkers: updateMarkers,
  createSaveLoadButtons: createSaveLoadButtons,
  createDefaultInstrumentUI: createDefaultInstrumentUI
}