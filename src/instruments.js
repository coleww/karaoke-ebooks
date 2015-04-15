var Sampler = require('./sampler');
var Drum = require('./drum');

var Oscillator = require('openmusic-oscillator');
var Synth = require('./synth');

module.exports = function createInstruments(ac, drums, synths){
  var instruments = [];

  drums.forEach(function(drum){
    var sampler = new Sampler(ac, 'samples/'+drum.name+'.wav');
    sampler.connect(ac.destination);
    var drum = new Drum(sampler, drum);
    instruments.push(drum)
  });

  synths.forEach(function(synth){
    var oscillator = new Oscillator(ac);
    oscillator.type = synth.type;
    oscillator.connect(ac.destination);
    var synthesizer = new Synth(oscillator, synth);
    instruments.push(synthesizer);
  });

  return instruments;
}