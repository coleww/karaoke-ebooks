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




function run(tick){
  interval = window.setInterval(function(){
    updateMarkers(position, NUM_BEATS);
    instruments.forEach(function(instrument){
      instrument.play(position, ac);
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

installMarkers(NUM_BEATS);
createSlider(run);
createSaveLoadButtons(instruments);
run(tick);
