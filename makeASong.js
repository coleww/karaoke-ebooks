var pronouncing = require('pronouncing');
var fs = require('fs');
var stops = require('stopwords').english;
var wordfilter = require('wordfilter');

var shuffle = require('array-shuffle')
var makeIsCool = require('iscool')
var isCool = makeIsCool()
var Markov = require('./mrkv')
var times = require('call-n-times')
var levenshtein = require('fast-levenshtein');
var sample = require('array-sample')
var sortBy = require('sort-array')
var flatten = require('flatten-array')
var inRange = require('in-range');

module.exports = function(lines, cb){
  var m = new Markov(3);
  m.seed(lines)
  console.log('seediddled')
  cb(makeADamnSong(m))
}

function gimmeOne (m) {
  var poem
  while(!poem || poem.length > 100 || poem.split("/")[0].length > 55 || poem.split("/")[1].length > 55 || repeater(poem) || boring(poem) || hasStops(poem) || isNotOk(poem)){
    poem = attemptAPoem(m)
  }
  return poem
}

function gimmeSomeOoohs () {
  var oohs = [["whooooa oooooooh ooooohhhh yeahhh!", "mmmhmmmmmmmmm yeahhhhh!"], ["ooooooooooooooooo", "oooooooEEEEEEEEooooooooo"], ["mmmmmmmmmmmmmm", "mmmmmmmmmmMMMMMMMMMmmmmmmm"], ["ugh ugh what yeah ugh check it out", "*whispers 'MAYBACH MUSIC'*"], ["DANG SON WHERE'D U FIND THIS?", "*AIR RAID SIREN*"], ["uh huh ugh yeah", "cmon check it out"], ["YOUNG MOOLAH BAY BEE", "ok im going back in:"]]
  var vox = []
  var oo = sample(oohs)
  vox.push(oo[0])
  vox.push(oo[1])
  return vox
}

function makeADamnSong (m) {
  var attempts = times(function(){return gimmeOne(m)}, 500)

  var theSong = []

  var matches = sortBy(groupTheMatches(attempts), 'length')
  var main = matches[0]
  var chorus = []
  if(matches.length > 1) {
    chorus = findTheChorus(flatten(matches.slice(1)))
    if(!chorus.length) {
       chorus = matches[1]
    }
 } else {
    chorus = findTheChorus(main)
    if(!chorus.length) {
       chorus = main
    }
 }



  // the intro
  theSong.push(gimmeSomeOoohs())

// TRY to find kinda similar strings FOR THE CHORUS!!!


  var c1 = chorus.pop()
  var c2 = chorus.pop()
  var c3 = chorus.pop()



  theSong.push(main.pop())
  theSong.push(main.pop())

  // FIRST CHORUS!
  theSong.push(c1)
  theSong.push(c2)

  theSong.push(main.pop())
  theSong.push(main.pop())

  // SECOND CHORUS!
  theSong.push(c1)
  theSong.push(c3)

  // the bridge]
  theSong.push(gimmeSomeOoohs())
  theSong.push(gimmeSomeOoohs())
  theSong.push(gimmeSomeOoohs())

  // FINAL CHORUS!
  theSong.push(c2)
  theSong.push(c3)
  theSong.push(c1)
  theSong.push(chorus.pop()[0])
//   32! well, 6 for the bridge, 2 for the intro
//   22!
//   in a b a b c b
// 2 4 4 4 4 6 6


  return flatten(theSong)
}

function findTheChorus (matches) {
  // chorus defined as the set of things with the most levehnstein similarity.
    // var distance = levenshtein.get('back', 'book');
    // hmmm
    var choruses = []

  matches.forEach(function(m, i, arr) {
    arr.slice(i).forEach(function(w){
       if (inRange(levenshtein.get(w, m), 5, 12)){
        choruses.push([w, m])
       }
    })
  })

    return choruses
}

function groupTheMatches (rhymes) {
  var the_stack = rhymes
  var groups = []
  while(the_stack.length){
    var group = []
    var r = the_stack.pop()
    group.push(r)
    var ws = r.split(" ")
    var last = ws[ws.length - 1]
    var rhymes = pronouncing.rhymes(last)
    if(rhymes && rhymes.length){
      var to_delete = []
      var matchees = the_stack.forEach(function(s, i){
        var ss = s.split(" ")
        var lastss = ss[ss.length - 1]
        if (rhymes.indexOf(lastss.toLowerCase()) !== -1) {
          group.push(s)
          to_delete.push(i)
        }
      })
    }
    to_delete.forEach(function(i){
      the_stack.splice(i, 1)
    })

    groups.push(arrayUnique(group))
  }
  return groups
}

function attemptAPoem(m){
  var first = m.random(5 + (~~(Math.random() * 3)))
  var second
  var toTry = shuffle(pronouncing.rhymes(first[first.length - 1]))
  toTry.every(function(rhyme){
    if(m.search(rhyme.toLowerCase())){
      // got that
      second = m.fillBack(rhyme.toLowerCase(), 4 + (~~(Math.random() * 3)))
      // console.log(first.join(" "), second.join(" "))
      // console.log(toTry, first[first.length - 1], rhyme, second)
      return false
    } else {
      return true
    }
  })
  return second && first.join(" ") + '/' + second.join(" ")
}

function boring(poem){
  //  if the lines are not all longer than 3 words
  var pos = poem.split("/")
  return !pos.every(function(po){
    return po.split(" ")[po.split(" ").length - 1].length > 3
  })
}

function repeater(poem){
  //  if the lines repeat a word that is 3 chars or longer
  var pos = poem.split("/")
    return !pos.every(function(po){
        var p = po.split(" ").filter(function(p){return p.length > 2})
    return arrayUnique(p).length == p.length
  })
  // return false // if it repeats
}

function hasStops(poem){
    // if the last word of the lines are not stop words
    var pos = poem.split("/")
    return !pos.every(function(po){
        var ps = po.split(" ").filter(function(p){return p.length})
        return stops.indexOf(ps[ps.length - 1]) == -1
    })
}

function isNotOk(poem){

    return wordfilter.blacklisted(poem) && !isCool(poem)
}

var arrayUnique = function(a) {
    return a.reduce(function(p, c) {
        if (p.indexOf(c) < 0) p.push(c);
        return p;
    }, []);
};
