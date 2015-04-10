// var int2freq = require('int2freq');

var Sampler = require('./sampler');
var ac = new AudioContext();

var player = new Sampler(ac, 'samples/clap.wav');

player.connect(ac.destination);









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

  run();