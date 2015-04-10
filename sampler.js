var SamplePlayer = require('openmusic-sample-player');

module.exports = function(ac, path){
  var player = SamplePlayer(ac);

  var request = new XMLHttpRequest();
  request.open('GET', path, true);
  request.responseType = 'arraybuffer';

  request.onload = function() {
    ac.decodeAudioData(request.response, onBufferLoaded, onBufferLoadError);
  };

  request.send();

  function onBufferLoaded(buffer) {
    player.buffer = buffer;
  }

  function onBufferLoadError(err) {
    console.error('oh no', err);
  }

  return player;
}