# PROBLUMZ
-----------------------------

a probability based web audio sequencer

uses a variety of [openmusic modules][https://github.com/openmusic] for web audio stuff and [int2freq][https://github.com/coleww/int2freq] for "random" frequency selection.


```
// install dependencies
npm install

// start watchify
npm run watch
// start local server
python -m SimpleHTTPServer
```

TODO:
how2deploy2gh-pages?
tonic/key selector
start/stop buttons
instrument mute
save single "patterns"
link single patterns with probabilities, i.e, A => [A, A, A, B] // transition to B 1/4 of the time
change patterns to probable pattern
global comparator "flip" (< <=> >) [use helper to decide whether to play or not]
global freq "flip" (0.25 <=> -0.25) [multiply by -1/+1 before getting freq]