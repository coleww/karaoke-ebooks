var Sampler = require('./sampler');

var Oscillator = require('openmusic-oscillator');
var Instrument = require('./instrument');

var makeDistortionCurve = require('make-distortion-curve')

// var make_drone = require('drone-e-o-synth')
var make_wobble = require('wobbler')
// var make_tri = require('tri-tri')

var Tuna = require('tunajs')
module.exports = function createInstruments(ac, instrumentData){
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
    if (data.name == 'bounce' || data.name == 'kick') {
      var overdrive = new tuna.Overdrive({
        outputGain:  Math.random() < 0.5 ? 0.5 : 0.35,         //0 to 1+
        drive:  Math.random() < 0.5 ? 0.7 : 0.5,              //0 to 1
        curveAmount: Math.random(),          //0 to 1
        algorithmIndex: ~~(Math.random() * 6),       //0 to 5, selects one of our drive algorithms
        bypass: 0
      });
      wobble = make_wobble(ac)
      distortion.connect(wobble.input())
      wobble.connect(overdrive)
      overdrive.connect(ac.destination)
      wobble.start()
    } else if (data.name == 'solo') {

      var wahwah = new tuna.WahWah({
        automode: true,                //true/false
        baseFrequency: 0.5,            //0 to 1
        excursionOctaves: 2,           //1 to 6
        sweep: 0.2,                    //0 to 1
        resonance: 10,                 //1 to 100
        sensitivity: 0.5,              //-1 to 1
        bypass: 0
      });
      distortion.connect(wahwah)
      wahwah.connect(ac.destination)

    } else if (data.name == 'harm' || data.name == 'snare' || data.name == 'cym') {
      var chorus = new tuna.Chorus({
          rate:  Math.random() < 0.5 ? 1.5 : 2,         //0.01 to 8+
          feedback:  Math.random() < 0.5 ? 0.2 : 0.3,     //0 to 1+
          delay:  Math.random() < 0.5 ? 0.0045 : 0.009,     //0 to 1
          bypass: 0          //the value 1 starts the effect as bypassed, 0 or 1
      });
      distortion.connect(chorus)
      chorus.connect(ac.destination)
    } else if (data.name == 'lead' || data.name == 'hat') {
      var phaser = new tuna.Phaser({
          rate:  Math.random() < 0.5 ? 1.2 : 2,                     //0.01 to 8 is a decent range, but higher values are possible
          depth: Math.random() < 0.5 ? 0.3 : 0.1,                    //0 to 1
          feedback:  Math.random() < 0.5 ? 0.2 : 0.3,                 //0 to 1+
          stereoPhase: 30,               //0 to 180
          baseModulationFrequency: Math.random() < 0.5 ? 700 : 500,  //500 to 1500
          bypass: 0
      });
      distortion.connect(phaser)
      phaser.connect(ac.destination)
    }  else {

      distortion.connect(ac.destination);
    }

    var instrument = new Instrument(player, data, wobble);
    instruments.push(instrument)
  });

  return instruments;
}