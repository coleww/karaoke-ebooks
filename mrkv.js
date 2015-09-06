var eachCons = require('each-cons')
var shuffle = require('array-shuffle')
Array.prototype.sample = require('array-sample')

var Markov = function(n){
  this.chain = {}
  this.n = n
  this.keys = []
  this.map = {}
}

Markov.prototype.seed = function(lines){
  var that = this
  lines.forEach(function(line){


    // MASSAGE THE HECK OUT OF THAT LINE FIRST!


    var words = line.split(" ").filter(function(w){return !w.match(/\./) && !w.match('@') && !w.match('#')})

    // GOOD ENOUGH! YEAH!



    eachCons(words, that.n + 1).forEach(function(marklet){
      var key = marklet.slice(0, that.n).join("|")
      if(!that.chain[key]) that.chain[key] = []
      that.chain[key].push(marklet[marklet.length - 1])
      that.map[marklet[marklet.length - 1]] = true
    })
  })

}

Markov.prototype.random = function(n){
  var res = [].concat(Object.keys(this.chain).sample().split("|"))
  var done = false
  while(res.length < n && !done){
    if(Object.keys(this.chain).indexOf(res.slice(res.length - this.n).join("|")) !== -1){

      res.push(this.chain[res.slice(res.length - this.n).join("|")].sample())
    } else {
      done = true
    }
  }
  return res
}

Markov.prototype.backward = function(key){
  var that = this
  var next
  shuffle(Object.keys(this.chain)).every(function(k){

    if(that.chain[k].indexOf(key) !== -1){
      next = k.split("|")
      return false
    } else {
      return true
    }
  })
  return next
}

Markov.prototype.fillBack = function(key, n){
  var res = [key]
  var done = false
  while(res.length < n && !done){
    var next = this.backward(key)
    if(next){
      res = next.concat(res)
    } else {
      done = true
    }
  }
  return res
}

Markov.prototype.search = function(key){
  return this.map[key]
}

Markov.prototype.gimme = function(key, n){
  var result = [key]
  var done = false
  while(result.length < n && !done) {
    if(!this.search(result[0])){
      done = true
    } else {
      result = this.backward(result[0]).concat(result)
    }
  }
  return result.join(" ")
}

module.exports = Markov