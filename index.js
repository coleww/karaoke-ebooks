var NUM_BEATS = 16;
var BPM = 120;

var getTick = require('./src/get_tick');

var Markers = require('./src/markers');
var installMarkers = Markers.installMarkers;
var updateMarkers = Markers.updateMarkers;
var createSaveLoadButtons = require('./src/UI').createSaveLoadButtons;

var createInstruments = require('./src/instruments');

var ac = new AudioContext();
var drums = ['clap', 'cym', 'hat', 'snare', 'kick'];
var synths = ['triangle', 'sine'];
var instruments = createInstruments(ac, drums, synths);

var position = 0;

var interval;

var tick = getTick(BPM);


var key = {tonic: 'C3', scale: 'major'};

function run(tick){
  interval = window.setInterval(function(){
    updateMarkers(position, NUM_BEATS);
    instruments.forEach(function(instrument){
      instrument.play(position, ac, key);
    })
    position++;
    if(position >= 16){
      position = 0;
    }
  }, tick);
};


function createSlider(){
  var slider = document.createElement("div");
  slider.setAttribute("class", "bpm-slider");
  var bpmInfo = document.createElement("span");
  bpmInfo.setAttribute("class", "bpm-info");
  bpmInfo.textContent = BPM+'bpm';
  var bpmSlider = document.createElement("input");
  bpmSlider.setAttribute("type", "range");
  bpmSlider.setAttribute("min", 5);
  bpmSlider.setAttribute("max", 250);
  bpmSlider.oninput = function updateBPM(e){
    window.clearInterval(interval);
    bpm = e.target.valueAsNumber;
    bpmInfo.textContent = bpm + 'bpm';
    tick = getTick(bpm);
    run(tick);
  };
  slider.appendChild(bpmSlider);
  slider.appendChild(bpmInfo);
  document.body.appendChild(slider);
}

function createKeySelect(){
  var tonic = document.createElement("select");
  ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"].forEach(function(note){
    var opt = document.createElement("option");
    opt.value = opt.textContent = note;
    tonic.appendChild(opt);
  });

  tonic.addEventListener("change", function(e){
    key.tonic = e.target.value + "3";
  })
  document.body.appendChild(tonic);


  var keySelect = document.createElement("select");
  ["major", "minor", "pentMaj", "pentMin"].forEach(function(scale){
    var opt = document.createElement("option");
    opt.value = opt.textContent = scale;
    keySelect.appendChild(opt);
  });

  keySelect.addEventListener("change", function(e){
    key.scale = e.target.value;
  })
  document.body.appendChild(keySelect);
}

function createPowerButton(){
    var powerBtn = document.createElement("button");
    powerBtn.textContent = "|>";
    powerBtn.addEventListener("click", function(){
    if(interval){
      window.clearInterval(interval);
      interval = undefined;
      powerBtn.textContent = "|>";
    } else {
      run(tick);
      powerBtn.textContent = "| |";
    }
  })
  document.body.appendChild(powerBtn);
}

installMarkers(NUM_BEATS);
createSlider();
createKeySelect();
createPowerButton();
createSaveLoadButtons(instruments);

// run(tick);
