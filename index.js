var NUM_BEATS = 16;
var BPM = 120;

var Sampler = require('./sampler');
var Drum = require('./drum');

var Markers = require('./markers');
var installMarkers = Markers.installMarkers;
var updateMarkers = Markers.updateMarkers;

var ac = new AudioContext();
var instruments = [];

var drums = ['clap', 'cym', 'htom', 'ltom'];

drums.forEach(function(drum){
  var sampler = new Sampler(ac, 'samples/'+drum+'.wav');
  sampler.connect(ac.destination);
  var drum = new Drum(sampler, 'clap');
  instruments.push(drum)
})

var position = 0;

var interval;

var tick = getTick(BPM);

function getTick(bpm){
  return (60 * 1000) / bpm;
}


function run(tick){
  interval = window.setInterval(function(){
    updateMarkers(position, NUM_BEATS);
    instruments.forEach(function(instrument){
      instrument.play(position);
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
run(tick);
