function createSaveLoadButtons(that){
  var saveBtn = document.createElement("button");
  saveBtn.textContent = "save all";
  saveBtn.addEventListener("click", function(){
    that.instruments.forEach(function(instrument){
      instrument.saveRows();
    })
  })
  document.body.appendChild(saveBtn);

  var loadBtn = document.createElement("button");
  loadBtn.textContent = "load all";
  loadBtn.addEventListener("click", function(){
    loadBtn.setAttribute("disabled", true);
    that.instruments.forEach(function(instrument){
      instrument.loadRows();
    })
  })
  document.body.appendChild(loadBtn);
}

function createMarkers(that){
  var markerRow = document.createElement("div")
  markerRow.setAttribute("class", "beat-markers");

  for(var i = 0; i < that.steps; i++){
    var marker = document.createElement("div");
    marker.setAttribute("class", "marker");
    if(i % 4 === 0) marker.setAttribute("class", "marker one-beat");
    marker.setAttribute("data-index", i);
    markerRow.appendChild(marker);
  }

  document.body.appendChild(markerRow);
  var clearFix = document.createElement("div");
  clearFix.setAttribute("class", "cf");
  document.body.appendChild(clearFix);
};

function createSlider(that){
  var slider = document.createElement("div");
  slider.setAttribute("class", "bpm-slider");
  var bpmInfo = document.createElement("span");
  bpmInfo.setAttribute("class", "bpm-info");
  bpmInfo.textContent = that.bpm+'bpm';
  var bpmSlider = document.createElement("input");
  bpmSlider.setAttribute("type", "range");
  bpmSlider.setAttribute("min", 5);
  bpmSlider.setAttribute("value", that.bpm);
  bpmSlider.setAttribute("max", 150);
  bpmSlider.oninput = function updateBPM(e){
    window.clearInterval(that.interval);
    that.bpm = e.target.valueAsNumber;
    bpmInfo.textContent = that.bpm + 'bpm';
    that.run();
  };
  slider.appendChild(bpmSlider);
  slider.appendChild(bpmInfo);
  document.body.appendChild(slider);
}

function createKeySelect(that){
  var tonic = document.createElement("select");
  ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"].forEach(function(note){
    var opt = document.createElement("option");
    opt.value = opt.textContent = note;
    tonic.appendChild(opt);
  });

  tonic.addEventListener("change", function(e){
    that.key.tonic = e.target.value + "3";
  })
  document.body.appendChild(tonic);


  var keySelect = document.createElement("select");
  ["major", "minor", "pentMaj", "pentMin"].forEach(function(scale){
    var opt = document.createElement("option");
    opt.value = opt.textContent = scale;
    keySelect.appendChild(opt);
  });

  keySelect.addEventListener("change", function(e){
    that.key.scale = e.target.value;
  })
  document.body.appendChild(keySelect);
}

function createPowerButton(that){
  var powerBtn = document.createElement("button");
  powerBtn.textContent = "|>";
  powerBtn.addEventListener("click", function(){
    if(that.interval){
      window.clearInterval(that.interval);
      that.interval = undefined;
      powerBtn.textContent = "|>";
    } else {
      that.run();
      powerBtn.textContent = "| |";
    }
  })
  document.body.appendChild(powerBtn);
}

function updateMarkers(position, steps){
  lastPosition = position - 1;
  if(lastPosition < 0){
    lastPosition = steps - 1;
  }
  document.querySelector('.marker[data-index="'+lastPosition+'"]').classList.remove('active');

  document.querySelector('.marker[data-index="'+position+'"]').classList.add('active');
}

function createSeqUI(that){
  createMarkers(that);
  createSlider(that);
  createKeySelect(that);
  createPowerButton(that);
  createSaveLoadButtons(that);
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

  var nextInput = document.createElement("input");
  nextInput.setAttribute("type", "text");
  nextInput.setAttribute("class", "nexts");
  nextInput.value = 0;
  nextInput.addEventListener("keyup", function updateProbz(e){
    that.nexts[that.current] = e.target.value.split(",");
  });
  container.appendChild(nextInput);
}

module.exports = {
  updateMarkers: updateMarkers,
  createSeqUI: createSeqUI,
  createDefaultInstrumentUI: createDefaultInstrumentUI
}