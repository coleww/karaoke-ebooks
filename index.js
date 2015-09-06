var data50s = require('./data');
var data80s = require('./blue_mondata');
var xhr = require('xhr')
var constructForMeASongPlease = require('./makeASong')

// var flavorStash = {
//   'marx': require('./flavors/marx'),
//   'smiths': require('./flavors/smiths'),
//   'oldies': require('./flavors/oldies'),
//   'punk': require('./flavors/punk'),
//   'taylor': require('./flavors/taylor'),
// }

var Sequencer = require('./src/sequencer');

document.getElementById('doit').addEventListener('click', function (){
  // HIDE THE ONBOARDING!
  document.getElementById('onboarding').style.display = "none"
  document.getElementById('loading').style.display = 'visible'
  var username = document.getElementById('uname').value
  xhr({uri: "http://localhost:8000/@" + username, headers: {  }}, function (err, resp, body) {
    if(err){
      throw err
    } else {
      var linesToAdd = JSON.parse(body).data

      var flavors = document.querySelectorAll('input[name=flavors]:checked');
      for (var i = 0; i < flavors.length; i++){
        console.log(flavors[i].value)
        // linesToAdd = linesToAdd.concat(flavorStash[flavors[i].value])
      }
      constructForMeASongPlease(linesToAdd, function (lines) {
        var stype = document.querySelector('input[name="songtype"]:checked').value
        var data = (stype == '50s') ? data50s : data80s
        var seq = new Sequencer(data, lines);
        seq.run()
      })
    }
  })
})

