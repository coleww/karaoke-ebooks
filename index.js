var STEPS = 16;
var BPM = 120;

var updateMarkers = require('./src/UI').updateMarkers;
var createSeqUI = require('./src/UI').createSeqUI;

var createInstruments = require('./src/instruments');

var ac = new AudioContext();
var drums = ['clap', 'cym', 'hat', 'snare', 'kick'];
var synths = ['triangle', 'sine'];
var instruments = createInstruments(ac, drums, synths);

var Sequencer = require('./src/sequencer');

var key = {tonic: 'C3', scale: 'major'};
var seq = new Sequencer(instruments, ac, BPM, STEPS, key, updateMarkers)

createSeqUI(seq);
