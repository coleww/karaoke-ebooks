var http = require("http")
var url = require("url")

var Twit = require('twit')

var live = process.env.do_it

if (live) {
  var MemJS = require("memjs").Client
  memjs = MemJS.create();
} else {
  var levelup = require('level')
  var db = levelup('./tweetdb')
}


var twit_configs
if (live) {
  twit_configs = {
    "consumer_key": process.env.consumer_key,
    "consumer_secret": process.env.consumer_secret,
    app_only_auth:        true
  }
} else {
  twit_configs = require('./tooter')
}
var T = new Twit(twit_configs)

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
  var uname = url.parse(req.url).pathname.substr(1)
  var username = (uname.match(/^@/)) ? uname.substr(1) : ''

  console.log('request for: ', username)
  if(!!username) {
    doThatThang(username, function (data) {
      console.log('got #: ', data.length)
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({data: data}));
    })
  } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end("HEYYYYYYYYYYYYYSSSSSSSUP? WHAT U DOING HERE?");
  }
})

server.listen(process.env.PORT || 8000)
console.log('listening on: ', process.env.PORT || 8000)

function doThatThang(username, cb) {
  if (live) {
    memjs.get(username, function(err, value) {
      if (!value) {
        hitTheTwitter(username, function (data) {
            var dats = data.filter(function(t){
              return !t.match('@Botgle') // lol
            }).map(function(t){
              return t.split(" ").filter(function(w){
                return !w.match(/\.|@|#/)
              }).join(" ")
            })
            memjs.set(username, dats.join("|||"))
            cb(dats)
          })
      } else {
        cb(value.split("|||"))
      }
    })
  } else {
    db.get(username, function (err, value) {
      if (err) {
        if (err.notFound) {
          hitTheTwitter(username, function (data) {
            var dats = data.filter(function(t){
              return !t.match('@Botgle') // lol
            }).map(function(t){
              return t.split(" ").filter(function(w){
                return !w.match(/\.|@|#/)
              }).join(" ")
            })
            db.put(username, dats.join("|||"))
            cb(dats)
          })
        } else {
          throw err
        }
      } else {
        console.log(value.length, typeof value)
        cb(value.split("|||"))
      }
    })
  }
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
  var dats =  {screen_name: username, count: 200, trim_user: true}
  if(maxId) dats.max_id = maxId

  T.get('statuses/user_timeline', dats, function (err, datum, response) {
    if (err) {
      console.log("BORK", dats)
      throw err
    } else {
      console.log(';ast one:', datum[datum.length - 1])
      cb(datum.map(function(t){return t.text}), datum[datum.length - 1].id_str)
    }
  })
}
