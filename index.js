var data = require('./data');

var updateInstrumentUI = function(){
  // umm make a wavy animation
}
var createUI = function(seq) {
// umm build the buttons? oh gotta add a tweety module too. err, thats on the backend? input and start button, maybe a checkbox for adding in other flavor

// OH either you can do 50s ice cream changes or 80s blue monday
}


var Sequencer = require('./src/sequencer');
var seq = new Sequencer(data, updateInstrumentUI);
seq.run()
