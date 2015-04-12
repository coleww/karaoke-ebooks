var NUM_BEATS = 16;
var BPM = 120;

var getTick = require('./src/get_tick');

var Sampler = require('./src/sampler');
var Drum = require('./src/drum');

var Oscillator = require('openmusic-oscillator');
var Synth = require('./src/synth');

var UI = require('./src/UI');
var installMarkers = UI.installMarkers;
var updateMarkers = UI.updateMarkers;
var createSaveLoadButtons = UI.createSaveLoadButtons;

var ac = new AudioContext();
var instruments = [];

var drums = ['clap', 'cym', 'hat', 'snare', 'kick'];

drums.forEach(function(drum){
  var sampler = new Sampler(ac, 'samples/'+drum+'.wav');
  sampler.connect(ac.destination);
  var drum = new Drum(sampler, drum);
  instruments.push(drum)
})

var synths = ['triangle', 'sine'];

synths.forEach(function(synth){
  var oscillator = new Oscillator(ac);
  oscillator.type = synth;
  oscillator.connect(ac.destination);
  var synthesizer = new Synth(oscillator, synth);
  instruments.push(synthesizer);
})

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


function createSlider(run){
  var slider = document.createElement("div");
  slider.setAttribute("class", "bpm-slider");
  var bpmInfo = document.createElement("span");
  bpmInfo.setAttribute("class", "bpm-info");
  bpmInfo.textContent = BPM+'bpm';
  var bpmSlider = document.createElement("input");
  bpmSlider.setAttribute("type", "range");
  bpmSlider.setAttribute("min", 20);
  bpmSlider.setAttribute("max", 500);
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
  ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"].forEach(function(note){
    var opt = document.createElement("option");
    opt.value = opt.textContent = note;
    tonic.appendChild(opt);
  });

  tonic.addEventListener("change", function(e){
    key.tonic = e.target.value + "3";
    console.log(key)
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
    console.log(key)
  })
  document.body.appendChild(keySelect);
}

installMarkers(NUM_BEATS);
createSlider(run);
createKeySelect();
createSaveLoadButtons(instruments);
run(tick);
