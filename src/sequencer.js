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
  this.section = data.section || "verse"
  this.sections = data.sections || ["verse", "verse", "verse", "verse", "chorus", "chorus"]
  this.position = 0;
  this.updateInstrumentUI = updateInstrumentUI;
  this.steps = data.steps;
};

Sequencer.prototype.run = function(){
  var that = this;
  var tick = getTick(that.bpm);
  this.interval = window.setInterval(function(){
    that.instruments.forEach(function(instrument){
      if (instrument.name == 'solo' ) {

        if (that.section == 'bridge') instrument.play(that.position, that.ac, that.key, that.section, tick)
      } else {
        instrument.play(that.position, that.ac, that.key, that.section);
      }
    })
    that.position++;
    if(that.position >= that.steps){
      that.instruments.forEach(function(instrument){
        instrument.next(that.section);
      });
      that.position = 0;
      that.section = that.sections.shift()
      // HERE IS WHERE YOU WOULD GRAB THE NEXT RHYME AND SHOVE IT ON?



      if(!that.section) {
        that.stop()
        that.instruments.forEach(function(i){
          if(i.type == 'drum') i.player.stop()
        })
      }
    }
  }, tick);
};

Sequencer.prototype.stop = function(){
  window.clearInterval(this.interval);
};


module.exports = Sequencer;