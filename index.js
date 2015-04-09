// var int2freq = require('int2freq');

var SamplePlayer = require('openmusic-sample-player');
var ac = new AudioContext();

var player = SamplePlayer(ac);
player.connect(ac.destination);


var request = new XMLHttpRequest();
request.open('GET', 'samples/clap.wav', true);
request.responseType = 'arraybuffer';

request.onload = function() {
  ac.decodeAudioData(request.response, onBufferLoaded, onBufferLoadError);
};

request.send();

function onBufferLoaded(buffer) {
  player.buffer = buffer;
  run();
}

function onBufferLoadError(err) {
  console.error('oh no', err);
}







var position = 0;
var notes = [0, 0, 0, 0];
var inputs = document.querySelectorAll('input[type="text"]')

for(var i=0;i<inputs.length;i++){
  inputs[i].addEventListener('keyup', function updateProbz(e){
    notes[~~e.target.dataset.index] = parseFloat(e.target.value);
  });
}






function run(){
  window.setInterval(function(){
    console.log("BONG")
    if(Math.random() < notes[position]){
      player.start();
    }
    position++;
    if(position > 3){
      position = 0;
    }
  }, 500)
}