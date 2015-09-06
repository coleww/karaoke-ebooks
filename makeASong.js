var pronouncing = require('pronouncing');
var fs = require('fs');
var stops = require('stopwords').english;
var wordfilter = require('wordfilter');

var shuffle = require('array-shuffle')
var makeIsCool = require('iscool')
var isCool = makeIsCool()
var Markov = require('./mrkv');
var m = new Markov(3);

module.exports = function(lines, cb){
  console.log('reddin')
  var s = lines
  console.log('seddding')
  m.seed(s)

  console.log('sedded')


  var theSong = []

  // AH OK HERE SO,
  // generate like, a fuck ton of rhymes
  // then write a function to find matches and put them in buckets?

  gimmeOne()


  cb(theSong)
}

function gimmeOne () {
  var poem
  while(!poem || poem.length > 100 || poem.split("/")[0].length > 55 || poem.split("/")[1].length > 55 || repeater(poem) || boring(poem) || hasStops(poem) || isNotOk(poem)){
    poem = attemptAPoem(m)
  }
  return poem
}

function groupTheMatches (rhymes) {

}

function attemptAPoem(markov){
  var first = m.random(5)
  var second
  var toTry = shuffle(pronouncing.rhymes(first[first.length - 1]))
  toTry.every(function(rhyme){
    if(m.search(rhyme.toLowerCase())){
      console.log(first)
      // got that
      console.log('got dat')
      second = m.fillBack(rhyme.toLowerCase(), 4)
      console.log(second)
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
