var data = {
  instruments: [
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
  ],
  key: {
    tonic: 'C3',
    scale: 'major'
  },
  bpm: 120,
  steps: 16
};

var UI = require('./src/UI');
var updateSeqUI = UI.updateSeqUI;
var updateInstrumentUI = UI.updateInstrumentUI;
var createUI = UI.createUI;

var Sequencer = require('./src/sequencer');
var seq = new Sequencer(data, updateSeqUI, updateInstrumentUI);
createUI(seq);
