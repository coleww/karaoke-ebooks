var instrumentData = [
  {
    name: 'clap',
    type: 'drum'
  },
  {
    name: 'cym',
    type: 'drum'
  },
  {
    name: 'hat',
    type: 'drum'
  },
  {
    name: 'snare',
    type: 'drum'
  },
  {
    name: 'kick',
    type: 'drum'
  },
  {
    name: 'tri',
    type: 'triangle'
  },
  {
    name: 'sin',
    type: 'sine'
  }
];


var BPM = 120;

var STEPS = 16;

var key = {
  tonic: 'C3',
  scale: 'major'
};


var updateMarkers = require('./src/UI').updateMarkers;

var Sequencer = require('./src/sequencer');
var seq = new Sequencer(instrumentData, BPM, STEPS, key, updateMarkers)

var createSeqUI = require('./src/UI').createSeqUI;
createSeqUI(seq);
