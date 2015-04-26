var createInstruments = require('./instruments');

function getTick(bpm){
  return ((60 * 1000) / bpm) / 4;
}

var Sequencer = function(data, updateInstrumentUI){
  this.ac = new AudioContext();
  this.bpm = data.bpm;
  this.instruments = createInstruments(this.ac, data.instruments, updateInstrumentUI);
  this.interval = null;
  this.key = data.key;
  this.position = 0;
  this.updateInstrumentUI = updateInstrumentUI;
  this.steps = data.steps;
};

Sequencer.prototype.run = function(){
  var that = this;
  var tick = getTick(that.bpm);
  this.interval = window.setInterval(function(){
    that.instruments.forEach(function(instrument){
      instrument.play(that.position, that.ac, that.key);
    })
    that.position++;
    if(that.position >= that.steps){
      that.instruments.forEach(function(instrument){
        instrument.next();
      });
      that.position = 0;
    }
  }, tick);
};

Sequencer.prototype.stop = function(){
  window.clearInterval(this.interval);
};

Sequencer.prototype.getState = function(){
  var instruments = [];
  this.instruments.forEach(function(instrument){
    instruments.push(instrument.exportRows());
  })

  return {
    instruments: instruments,
    bpm: this.bpm,
    key: this.key,
    steps: this.steps
  }
}

Sequencer.prototype.loadData = function(data){
  this.stop();
  document.body.innerHTML = ""

  // THIS IS DOWNRIGHT AWFUL...BUT IT WORKS...¯\_(ツ)_/¯

  var UI = require('./UI');
  var updateInstrumentUI = UI.updateInstrumentUI;
  var createUI = UI.createUI;

  var Sequencer = require('./sequencer');
  var seq = new Sequencer(data, updateInstrumentUI);
  createUI(seq);
  seq.instruments.forEach(function(inst){
    inst.updateUI();
  })

  var keyUi = document.querySelectorAll('.key-select select');
  keyUi.item(0).value = data.key.tonic.slice(0, - 1);
  keyUi.item(1).value = data.key.scale;
  document.querySelector('.bpm-slider input').value = data.bpm;
  document.querySelector('.bpm-info').textContent = data.bpm + 'bpm;'
}

module.exports = Sequencer;