var drums = [
  {
    name: 'clap'
  },
  {
    name: 'cym'
  },
  {
    name: 'hat'
  },
  {
    name: 'snare'
  },
  {
    name: 'kick'
  }
];
var synths = [
  {
    name: 'tri',
    type: 'triangle'
  },
  {
    name: 'sin',
    type: 'sine'
  }
];

var key = {
  tonic: 'C3',
  scale: 'major'
};

var STEPS = 16;
var BPM = 120;

var ac = new AudioContext();
var createInstruments = require('./src/instruments');
var instruments = createInstruments(ac, drums, synths);

var updateMarkers = require('./src/UI').updateMarkers;
var Sequencer = require('./src/sequencer');
var seq = new Sequencer(instruments, ac, BPM, STEPS, key, updateMarkers)
var createSeqUI = require('./src/UI').createSeqUI;
createSeqUI(seq);
