var Sampler = require('./sampler');

var Oscillator = require('openmusic-oscillator');
var Instrument = require('./instrument');


module.exports = function createInstruments(ac, instrumentData, updateUI){
  var instruments = [];

  instrumentData.forEach(function(data){
    var player;
    if(data.type == 'drum'){
      player = new Sampler(ac, 'samples/'+data.name+'.wav');
    } else {
      player = new Oscillator(ac);
      player.type = data.type;
    }

    // TODO:
    // do some magic here to build custom inst nodes easily?

    var gainNode = ac.createGain();

    var filter = ac.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000;

    player.connect(gainNode);
    gainNode.connect(filter);
    filter.connect(ac.destination);

    var instrument = new Instrument(player, data, gainNode, filter, updateUI);
    instruments.push(instrument)
  });

  return instruments;
}