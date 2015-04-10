var NUM_BEATS = 16;

var Sampler = require('./sampler');
var Drum = require('./drum');

var Markers = require('./markers');
var installMarkers = Markers.installMarkers;
var updateMarkers = Markers.updateMarkers;

var ac = new AudioContext();

var player = new Sampler(ac, 'samples/clap.wav');
player.connect(ac.destination);

var instrument = new Drum(player, 'clap');

var position = 0;

function run(){
  window.setInterval(function(){
    updateMarkers(position, NUM_BEATS);
    instrument.play(position);
    position++;
    if(position >= 16){
      position = 0;
    }
  }, 500);
};

installMarkers(NUM_BEATS);
run();
