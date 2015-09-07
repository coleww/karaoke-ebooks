var data50s = require('./data');
var data80s = require('./blue_mondata');
var xhr = require('xhr')
var constructForMeASongPlease = require('./makeASong')

var flavorStash = {
  'marx': require('./flavors/marx'),
  'smiths': require('./flavors/smiths'),
  'oldies': require('./flavors/oldies'),
  'punk': require('./flavors/punk'),
  'taylor': require('./flavors/taylor'),
}

var Sequencer = require('./src/sequencer');

var host = 'http://karaoke-ebooks.herokuapp.com' //
// var host = 'http://localhost:8000'

document.getElementById('doit').addEventListener('click', function (){
  // HIDE THE ONBOARDING!
  document.getElementById('onboarding').style.display = "none"
  document.getElementById('loading').style.display = "block"
  var username = document.getElementById('uname').value
  xhr({uri: host + "/@" + username, headers: {  "Content-Type": "application/json" }}, function (err, resp, body) {
    if(err){
      throw err
    } else {
      var linesToAdd = JSON.parse(body).data
      var flavors = document.querySelectorAll('input[name=flavors]:checked');
      for (var i = 0; i < flavors.length; i++){
        console.log(flavors[i].value)
        linesToAdd = linesToAdd.concat(flavorStash[flavors[i].value])
      }
      var now = new Date().getTime()
      constructForMeASongPlease(linesToAdd, function (lines) {
        var then = new Date().getTime()
        console.log('WOW that only took ', then - now)
        document.getElementById('loading').style.display = "none"
        var stype = document.querySelector('input[name="songtype"]:checked').value

      // var lines = ['foo', 'bar', 'assssss', 'wjateeeber bruuuuuhhhh', 'cool it!', 'now dance!@@!!!!@']
        var data = (stype == '50s') ? data50s : data80s

        data.key.tonic = document.querySelectorAll('#opts select')[0].value
        data.key.scale = document.querySelectorAll('#opts select')[1].value
        var seq = new Sequencer(data, lines);
        seq.run()
        document.getElementById('bruh').style.display = "inline-block"
        document.getElementById('karaoke').style.display = "inline-block"
      })
    }
  })
})

