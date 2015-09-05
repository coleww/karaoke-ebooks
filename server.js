var http = require("http")
var url = require("url")
var levelup = require('level')
var db = levelup('./tweetdb')
var Twit = require('twit')

var T = new Twit({
  // CONFIG STUFF HERE YO!
})

var server = http.createServer(function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Request-Method', '*')
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET')
  res.setHeader('Access-Control-Allow-Headers', '*')

  if ( req.method === 'OPTIONS' ) {
    res.writeHead(200)
    res.end()
    return
  }

  // example.com/colewillsea
  // just use the desired username as the path
  var username = url.parse(req.url).pathname.substr(1)
  doThatThang(username, function (data) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({data: data}));
  })
})
server().listen(process.env.PORT || 8000)

function doThatThang(username, cb) {
  db.get(username, function (err, value) {
    if (err) {
      if (err.notFound) {
        hitTheTwitter(username, function (data) {
          db.put(username, data)
          cb(data)
        })
      } else {
        throw err
      }
    } else {
      cb(value)
    }
  })
}

function hitTheTwitter(username, cb) {
  collectSomeData(username, null, function (a, id) {
    collectSomeData(username, id, function (b, id2) {
      collectSomeData(username, id2, function (c, id3) {
        collectSomeData(username, id3, function (d, id4) {
          collectSomeData(username, id4, function (e, id5) {
            cb([].concat(a).concat(b).concat(c).concat(d).concat(e))
          })
        })
      })
    })
  })
}

function collectSomeData (username, maxId, cb) {
  var max = maxId || 999999999999999999999999999
  T.get('statuses/user_timeline', {screen_name: username, count: 200, max_id: max, trim_user: true}, function (err, datum, response) {
    if (err) {
      throw err
    } else {
      cb(datum.map(function(t){return t.text.split(" ").filter(function(w){return !w.match(/\./)}).join(" ")}), datum[datum.length - 1].id_str)
    }
  })
}
















