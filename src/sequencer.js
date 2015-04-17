var createInstruments = require('./instruments');

function getTick(bpm){
  return ((60 * 1000) / bpm) / 4;
}

var Sequencer = function(instrumentData, bpm, steps, key, updateUI){
  this.ac = new AudioContext();
  this.bpm = bpm;
  this.instruments = createInstruments(this.ac, instrumentData);
  this.interval = null;
  this.key = key;
  this.position = 0;
  this.updateUI = updateUI;
  this.steps = steps;
};

Sequencer.prototype.run = function(){
  var that = this;
  var tick = getTick(that.bpm);
  this.interval = window.setInterval(function(){
    that.updateUI(that.position, that.steps);
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

Sequencer.prototype.getState = function(){
  var instruments = [];
  this.instruments.forEach(function(instrument){
    instruments.push(instrument.exportRows());
  })

  return {
    instruments: instruments,
    bpm: this.bpm,
    key: this.key
  }
}

module.exports = Sequencer;