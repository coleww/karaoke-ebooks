var Sampler = require('./sampler');

var Oscillator = require('openmusic-oscillator');
var Instrument = require('./instrument');

var makeDistortionCurve = require('make-distortion-curve')

// var make_drone = require('drone-e-o-synth')
var make_wobble = require('wobbler')
// var make_tri = require('tri-tri')


module.exports = function createInstruments(ac, instrumentData){
  var instruments = [];

  instrumentData.forEach(function(data){
    var player;
    if(data.type == 'drum'){
      player = new Sampler(ac, 'samples/'+data.name+'.wav');
    } else {

      // ahh so like use the modules here? hmm.
      player = new Oscillator(ac);
      player.type = data.type;
    }

    // TODO:
    // do some magic here to build custom inst nodes easily?

    var gainNode = ac.createGain();

    gainNode.gain.value = data.gain

    var filter = ac.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;

    filter.frequency.value = data.filterFreq



    var distortion = ac.createWaveShaper()
    distortion.curve = makeDistortionCurve(data.distortion)

    player.connect(gainNode);
    gainNode.connect(filter);
    filter.connect(distortion)
    var wobble
    if (data.name == 'bounce') {
      wobble = make_wobble(ac)
      distortion.connect(wobble.input())
      wobble.connect(ac.destination)
      wobble.start()
    } else {

      distortion.connect(ac.destination);
    }

    var instrument = new Instrument(player, data, wobble);
    instruments.push(instrument)
  });

  return instruments;
}