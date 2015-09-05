var data50s = require('./data');
var data80s = require('./blue_mondata');
var request = require('xhr')
var constructForMeASongPlease = require('./makeASong')
var updateInstrumentUI = function(){
  // umm make a wavy animation
}
var createUI = function(seq) {
// umm build the buttons? oh gotta add a tweety module too. err, thats on the backend? input and start button, maybe a checkbox for adding in other flavor

// OH either you can do 50s ice cream changes or 80s blue monday
}

var flavorStash = {
  'marx': require('./flavors/marx'),
  'smiths': require('./flavors/smiths'),
  'oldies': require('./flavors/oldies'),
  'punk': require('./flavors/punk'),
  'taylor': require('./flavors/taylor'),
}

var Sequencer = require('./src/sequencer');

document.getElementById('doit').on('click', function (){
  // HIDE THE ONBOARDING!
  document.getElementById('onboarding').style.display = "none"

  var username = document.getElementById('uname').value
  xhr({
      uri: "someserver/" + username,
      headers: {
          "Content-Type": "application/json"
      }
  }, function (err, resp, body) {
    if(err){
      throw err
    } else {
      var linesToAdd = body.data


      var flavors = document.querySelectorAll('input[name=flavors]:checked');
      for (var i = 0; i < flavors.length; i++){
        linesToAdd = linesToAdd.concat(flavorStash[flavors[i].value])
      }

      var lines = constructForMeASongPlease(linesToAdd)


      var stype = document.querySelector('input[name="songtype"]:checked').value
      var data = (stype == '50s') ? data50s : data80s
      var seq = new Sequencer(data, updateInstrumentUI, lines);
      seq.run()


    }
  })






})

