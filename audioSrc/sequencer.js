var createInstruments = require('./instruments');

function getTick(bpm){
  return ((60 * 1000) / bpm) / 4;
}

var Sequencer = function(data, lines){
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  this.ac = new AudioContext();
  this.bpm = data.bpm;
  this.instruments = createInstruments(this.ac, data.instruments);
  this.interval = null;
  this.key = data.key;
  this.lines = lines
  console.log('SNOW: ', this.lines.length)
  console.log(this.lines)
  this.section = data.section || "intro"
  this.sections = data.sections || ["verse", "verse", "verse", "verse", "chorus", "chorus"]
  this.position = 0;
  this.steps = data.steps;
  this.savedLik = 'ooooweeeeooooo'
};

Sequencer.prototype.run = function(){
  document.getElementById("karaoke").textContent = this.lines.shift()
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
    document.getElementById("done").style.width = 100 - (100 * (parseFloat(that.position) / that.steps)) - 5 + "%"

    document.getElementById("doing").style.width = (100 * parseFloat(that.position) / that.steps) - 5 + "%"

    if (that.position == ~~(that.steps / 2)){
      var msg = new SpeechSynthesisUtterance(that.savedLik);
      // msg.rate = 0.75x
      window.speechSynthesis.speak(msg);
    } else if(that.position >= that.steps) {
      that.instruments.forEach(function(instrument){
        instrument.next(that.section);
      });
      that.position = 0;
      that.section = that.sections.shift()



      // HERE IS WHERE YOU WOULD GRAB THE NEXT RHYME AND SHOVE IT ON?
      var lik = that.lines.shift()
      console.log(lik)
      that.savedLik = lik.split("/")[1]
      // UMMM if there isn't one then i think u should stop? i guess?
      // TODO
      // DOTHIS
      // ITS REALLY BAD

      // EXCEPT NOT ON THE INTRO OR BRIDGE, PUT SOME LIKE "OHHHHH YEAHHH WHOOOO HOOOOO AT RANDOM THERE INSTEAD!"
      if (that.section == 'bridge'){

      document.getElementById("karaoke").textContent = "SOLO: " + lik.split("/").join("  /  ")  + " :SOLO"
      } else {

      document.getElementById("karaoke").textContent = lik.split("/").join("  /  ")
      }
      console.log('.')
      var msg = new SpeechSynthesisUtterance(lik.split("/")[0]);
      msg.rate = 0.8
      window.speechSynthesis.speak(msg);

      var inter
      var ii = 0
      // inter = window.setInterval(function(){

        // HMMM kill
        // console.log('.')
      //   if(ii == 16) window.clearInterval(inter)
      // }, tick / 16.0)
      // ..../ hmm set interval to updat ethe progress bar, and then wipe it on next run?


      // UMMM how to animate the singing...hmmm...there could be magic here...
      // OH SHIT A PROGRESS BAR DOES THIS EXACTLY! SET IT ON A TIMER FOR THE LENGTH OF THE THING, THEN DUMP IT.
      // FUCK YEAH FUCK YEAH SCIENCE

      if(!that.section) {
        that.stop()
        that.instruments.forEach(function(i){
          if(i.type !== 'drum') {
            i.player.frequency.value = 500
            i.player.stop(0)
          }
        })
      }
    }
  }, tick);
};

Sequencer.prototype.stop = function(){
  window.clearInterval(this.interval);
};


module.exports = Sequencer;