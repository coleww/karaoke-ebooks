// var int2freq = require('int2freq');

var Sampler = require('./sampler');
var Drum = require('./drum');

var ac = new AudioContext();

var player = new Sampler(ac, 'samples/clap.wav');
player.connect(ac.destination);
var instrument = new Drum(player, 'clap');

var position = 0;

function run(){
  window.setInterval(function(){
    console.log("BONG")

    instrument.play(position);

    position++;
    if(position >= 16){
      position = 0;
    }
  }, 500)
}

run();