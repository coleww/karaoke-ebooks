var Sampler = require('./sampler');

var Oscillator = require('openmusic-oscillator');
var Instrument = require('./instrument');

module.exports = function createInstruments(ac, drums, synths){
  var instruments = [];

  drums.forEach(function(drum){
    var sampler = new Sampler(ac, 'samples/'+drum.name+'.wav');
    var gainNode = ac.createGain();
    sampler.connect(gainNode);
    var filter = ac.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000;
    gainNode.connect(filter);
    filter.connect(ac.destination);
    var drum = new Instrument(sampler, drum, gainNode, filter);
    instruments.push(drum)
  });

  synths.forEach(function(synth){
    var oscillator = new Oscillator(ac);
    oscillator.type = synth.type;
    var gainNode = ac.createGain();
    oscillator.connect(gainNode);
    var filter = ac.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000;
    gainNode.connect(filter);
    filter.connect(ac.destination);
    var synthesizer = new Instrument(oscillator, synth, gainNode, filter);
    instruments.push(synthesizer);
  });

  return instruments;
}