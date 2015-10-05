console.log("v1.1.1")


var data50s = require('./songs/data');
var data80s = require('./songs/blue_mondata');
var xhr = require('xhr')
var constructForMeASongPlease = require('./rhymeSrc/makeASong')



var Sequencer = require('./audioSrc/sequencer');

var host = 'http://karaoke-ebooks.herokuapp.com' //
// var host = 'http://localhost:8000'



document.getElementById('doit').addEventListener('click', function (){
  // HIDE THE ONBOARDING!
  console.log("WOW")
  loading.style.display = "block"
  onboarding.style.display = "none"
  window.setTimeout(function(){
    var linesToAdd = require('./flavors/horses')
    var now = new Date().getTime()
    constructForMeASongPlease(linesToAdd, function (lines) {
      var then = new Date().getTime()
      console.log('WOW that only took ', then - now)
      document.getElementById('loading').style.display = "none"

      var data = data50s
      var seq = new Sequencer(data, lines);

      document.getElementById('bruh').style.display = "inline-block"
      document.getElementById('karaoke').style.display = "inline-block"
      seq.run()
    })
  }, 500)

})

