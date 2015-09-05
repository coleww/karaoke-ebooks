# KARAOKE EBOOKS





















:notes: [a probabilistic audio sequencer](http://coleww.github.io/problumz/) :speaker:

usually a sequencer is all like `[X][ ][X][ ]` which means play on the first and third beat but not the second or fourth, whereas this sequencer is all like `[0.44][0.732][1][0]` which means there is a 44% chance of playing on the first beat and a 73.2% chance of playing on the second, and the third beat will totally play whereas the fourth will never ever ever. similarly for the synthesizers instead of being all like `imagine a sparkling row of piano keys` they are more like `[0,0,1][ ][-1][ ]` which, given a tonic note of C3 and the major key, means that on the first beat there is a 66.6666666666666666% chance of a C3 playing and a 33.333333333333333333% chance of a D3 playing, and on the second beat nothing will play, and the third beat will definitely play a B2 note, followed by another beat of nothing.

-----------------------------

uses a variety of [openmusic modules](https://github.com/openmusic) for web audio stuff and [int2freq](https://github.com/coleww/int2freq) for "random" frequency selection.

------------------------------

### DEV:
```
# install dependencies
npm install

# start watchify
npm run watch

# start local server
python -m SimpleHTTPServer
```

