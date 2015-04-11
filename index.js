var NUM_BEATS = 16;

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

function run(){
  window.setInterval(function(){
    updateMarkers(position, NUM_BEATS);
    instruments.forEach(function(instrument){
      instrument.play(position);
    })
    position++;
    if(position >= 16){
      position = 0;
    }
  }, 500);
};

installMarkers(NUM_BEATS);
run();
