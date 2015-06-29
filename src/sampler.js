var SamplePlayer = require('openmusic-sample-player')
var loadSample2Buff = require('load-sample-2-buff')

module.exports = function(ac, path){
  var player = SamplePlayer(ac)

  loadSample2Buff(ac, path, function(buffer){
    player.buffer = buffer
  })

  return player;
}