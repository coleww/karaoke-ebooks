var Sampler = require('./sampler');

var Oscillator = require('openmusic-oscillator');
var Instrument = require('./instrument');

var makeDistortionCurve = require('make-distortion-curve')

// var make_drone = require('drone-e-o-synth')
var make_wobble = require('wobbler')
// var make_tri = require('tri-tri')



var Tuna = require('tunajs')
module.exports = function createInstruments(ac, instrumentData){

var bigGain = ac.createGain();

    bigGain.gain.value = 0.75

require('openmusic-slider').register('openmusic-slider');

var coolSlider = document.createElement('openmusic-slider');
coolSlider.min = 0
coolSlider.max = 1
coolSlider.step = 0.05
coolSlider.value = 0.75
coolSlider.addEventListener('change', function(e){
  bigGain.gain.value = parseFloat(e.target.value)

})
volume.appendChild(coolSlider);


  var instruments = [];
  var tuna = new Tuna(ac);
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

    gainNode.gain.value = data.gain - 0.2

    var filter = ac.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;

    filter.frequency.value = data.filterFreq



    var distortion = ac.createWaveShaper()
    distortion.curve = makeDistortionCurve(data.distortion)

    player.connect(gainNode);
    gainNode.connect(filter);
    filter.connect(distortion)
    // var wobble
    // if (data.name == 'bounce') {
    //   // var overdrive = new tuna.Overdrive({
    //   //   outputGain:  Math.random() < 0.5 ? 0.5 : 0.35,         //0 to 1+
    //   //   drive:  Math.random() < 0.5 ? 0.7 : 0.5,              //0 to 1
    //   //   curveAmount: Math.random(),          //0 to 1
    //   //   algorithmIndex: ~~(Math.random() * 6),       //0 to 5, selects one of our drive algorithms
    //   //   bypass: 0
    //   // });
    //   wobble = make_wobble(ac)
    //   distortion.connect(wobble.input())
    //   wobble.connect(bigGain)
    //   wobble.start()
    // }  else {

      distortion.connect(bigGain)
    // }

    var instrument = new Instrument(player, data);
    instruments.push(instrument)
  });
  bigGain.connect(ac.destination)
  return instruments;
}