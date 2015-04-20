function createUI(that){
  createInstrumentUI(that)
  createMarkers(that);
  createSlider(that);
  createKeySelect(that);
  createPowerButton(that);
  createSaveLoadButtons(that);
}

function updateSeqUI(position, steps){
  lastPosition = position - 1;
  if(lastPosition < 0){
    lastPosition = steps - 1;
  }
  document.querySelector('.marker[data-index="'+lastPosition+'"]').classList.remove('active');

  document.querySelector('.marker[data-index="'+position+'"]').classList.add('active');
}

function updateInstrumentUI(){
  var that = this;
  that.probs[that.current].forEach(function(val, i){
    document.querySelector('.'+that.name+' input[data-index="'+i+'"].prob').value = val;
  });

  if(that.type !== "drum"){
    that.notes[that.current].forEach(function(val, i){
      document.querySelector('.'+that.name+' input[data-index="'+i+'"].notes').value = val.join(",");
    });
  }

  document.querySelector('.'+that.name+' .nexts').value = that.nexts[that.current].join(",");
  document.querySelector('.'+that.name+' select').value = that.current;
  document.querySelector('.'+that.name+' .volume').value = that.gain.gain.value;
  document.querySelector('.'+that.name+' .filter').value = that.filter.frequency.value;
}

function createInstrumentUI(that){
  that.instruments.forEach(function(instrument){
    inst = instrument.type !== "drum" ? createSynthUI(instrument) : createDrumUI(instrument);
    document.body.appendChild(inst);
  });
}

function createSaveLoadButtons(that){
  var saveBtn = document.createElement("button");
  saveBtn.textContent = "save";
  saveBtn.addEventListener("click", function(){
    that.instruments.forEach(function(instrument){
      instrument.saveRows();
    })
  })
  document.body.appendChild(saveBtn);

  var loadBtn = document.createElement("button");
  loadBtn.textContent = "load";
  loadBtn.addEventListener("click", function(){
    loadBtn.setAttribute("disabled", true);
    that.instruments.forEach(function(instrument){
      instrument.loadRows();
    })
  })
  document.body.appendChild(loadBtn);

  var exportBtn = document.createElement("button");
  exportBtn.textContent = "export";
  exportBtn.addEventListener("click", function(){
    var state = that.getState();

    var download = document.createElement('a');
    download.textContent = "X";
    var data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
    download.setAttribute('href', data)
    document.body.appendChild(download)
  })
  document.body.appendChild(exportBtn);
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
    that.bpm = e.target.valueAsNumber;
    bpmInfo.textContent = that.bpm + 'bpm';

    var wasPlaying = !!that.interval;
    if(wasPlaying) {
      window.clearInterval(that.interval);
      that.run();
    }
  };
  slider.appendChild(bpmSlider);
  slider.appendChild(bpmInfo);
  document.body.appendChild(slider);
}

function createKeySelect(that){
  var keySelect = document.createElement("div");
  keySelect.setAttribute("class", "key-select")
  var tonic = document.createElement("select");
  ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"].forEach(function(note){
    var opt = document.createElement("option");
    opt.value = opt.textContent = note;
    tonic.appendChild(opt);
  });

  tonic.addEventListener("change", function(e){
    that.key.tonic = e.target.value + "3";
  })

  keySelect.appendChild(tonic);


  var key = document.createElement("select");
  ["major", "minor", "pentMaj", "pentMin"].forEach(function(scale){
    var opt = document.createElement("option");
    opt.value = opt.textContent = scale;
    key.appendChild(opt);
  });

  key.addEventListener("change", function(e){
    that.key.scale = e.target.value;
  })

  keySelect.appendChild(key);

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



function createDefaultInstrumentUI(that, container){
  var label = document.createElement("span");
  label.setAttribute("class", "label")
  label.textContent = that.name;
  container.appendChild(label);

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

  var volSlider = document.createElement("input");
  volSlider.setAttribute("type", "range");
  volSlider.setAttribute("class", "volume");
  volSlider.setAttribute("min", 0);
  volSlider.setAttribute("value", that.gain.gain.value);
  volSlider.setAttribute("step", 0.05);
  volSlider.setAttribute("max", 1);
  volSlider.oninput = function updateVolume(e){
    that.updateVolume(e.target.valueAsNumber);
  };
  container.appendChild(volSlider);

  var filterSlider = document.createElement("input");
  filterSlider.setAttribute("type", "range");
  filterSlider.setAttribute("class", "filter");
  filterSlider.setAttribute("min", 0);
  filterSlider.setAttribute("value", 350);
  filterSlider.setAttribute("max", 10000);
  filterSlider.oninput = function updateFilter(e){
    that.updateFilter(e.target.valueAsNumber);
  };
  container.appendChild(filterSlider);
}

function createSynthUI(that){
  var synth = document.createElement("div");
  synth.setAttribute("class", that.name);

  var synthProbs = document.createElement("div");
  synthProbs.setAttribute("class", "synth-probs");
  for(var i = 0; i < that.probs[that.current].length; i++){
    var cell = document.createElement("input");
    cell.setAttribute("type", "text")
    cell.setAttribute("class", "prob")
    if(i%4==0) cell.setAttribute("class", "prob one-beat");
    cell.setAttribute("data-index", i);
    cell.addEventListener("keyup", function updateProbz(e){
      that.probs[that.current][~~e.target.dataset.index] = parseFloat(e.target.value);
    });
    synthProbs.appendChild(cell);
  }

  var clearFix = document.createElement("div");
  clearFix.setAttribute("class", "cf");
  synthProbs.appendChild(clearFix);

  for(var i = 0; i < that.notes[that.current].length; i++){
    var cell = document.createElement("input");
    cell.setAttribute("type", "text")
    cell.setAttribute("class", "notes")
    if(i%4==0) cell.setAttribute("class", "notes one-beat");
    cell.setAttribute("data-index", i);
    cell.addEventListener("keyup", function updateProbz(e){
      that.notes[that.current][~~e.target.dataset.index] = e.target.value.split(",");
    });
    synthProbs.appendChild(cell);
  }

  synth.appendChild(synthProbs)
  createDefaultInstrumentUI(that, synth);
  return synth;
}

function createDrumUI(that){
  var drum = document.createElement("div");
  drum.setAttribute("class", that.name);

  for(var i = 0; i < that.probs[that.current].length; i++){
    var cell = document.createElement("input");
    cell.setAttribute("type", "text")
    cell.setAttribute("class", "prob")
    if(i%4==0) cell.setAttribute("class", "prob one-beat")
    cell.setAttribute("data-index", i);
    cell.addEventListener("keyup", function updateProbz(e){
      that.probs[that.current][~~e.target.dataset.index] = parseFloat(e.target.value);
    });
    drum.appendChild(cell);
  }

  createDefaultInstrumentUI(that, drum);
  return drum;
}

module.exports = {
  updateSeqUI: updateSeqUI,
  updateInstrumentUI: updateInstrumentUI,
  createUI: createUI
}