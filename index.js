console.log("v1.1.3")
var data50s = require('./songs/data');
var xhr = require('xhr')
var constructForMeASongPlease = require('./rhymeSrc/makeASong')
var loadSample2Buff = require('load-sample-2-buff')
var SamplePlayer = require('openmusic-sample-player')
var Sequencer = require('./audioSrc/sequencer');
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
      var now = new Date().getTime()
      constructForMeASongPlease(linesToAdd, function (lines) {
        var then = new Date().getTime()
        console.log('WOW that only took ', then - now)
        document.getElementById('loading').style.display = "none"

        var data = data50s

        data.key.tonic = 'C2'
        data.key.scale = 'major'
        var seq = new Sequencer(data, lines);
        seq.run()
        document.getElementById('bruh').style.display = "inline-block"
        document.getElementById('karaoke').style.display = "inline-block"
      })
    }
  })
})

