var http = require("http")
var url = require("url")

var Twit = require('twit')

  var MemJS = require("memjs").Client
  memjs = MemJS.create();



var twit_configs = {
    "consumer_key": process.env.consumer_key,
    "consumer_secret": process.env.consumer_secret,
    app_only_auth:        true
  }
var T = new Twit(twit_configs)

var server = http.createServer(function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Request-Method', 'OPTIONS, GET')
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization, Token, Auth-Token, Email')

  if ( req.method === 'OPTIONS' ) {
    res.writeHead(200)
    res.end()
    return
  }

  // example.com/colewillsea
  // just use the desired username as the path
  var earl = url.parse(req.url, true)
  var uname = earl.pathname.substr(1)
  var username = (uname.match(/^@/)) ? uname.substr(1) : ''
  username = (username.match(/\/$/)) ? username.substr(0, username.length - 1) : username
  var doItReally = !(username.indexOf('?') == -1)
  if (doItReally) username.replace('?', '')
  console.log('request for: ', username)

  if (!!username && username.length) {
    if (earl.query && earl.query.deeper) {
      doThatThang(username, function (data) {
        console.log('got #: ', data.length)
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({data: data}));
      }, doItReally, true)
    } else {
      doThatThang(username, function (data) {
        console.log('got #: ', data.length)
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({data: data}));
      }, doItReally)
    }

  } else if (!!earl.query.target && !!earl.query.source) {
    T.get('friendships/show', {target_screen_name: earl.query.target, source_screen_name: earl.query.source}, function (err, datum, response) {
      if (err) {
        console.log("BORK", dats)
        throw err
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({data: datum}));
      }
    })
  } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end("HEYYYYYYYYYYYYYSSSSSSSUP? WHAT U DOING HERE?");
  }
})

server.listen(process.env.PORT || 8000)
console.log('listening on: ', process.env.PORT || 8000)

function doThatThang(username, cb, doItReally, godeeper) {

    memjs.get(username, function(err, value) {
      if (!value || doItReally) {
        getThemTweets(username, function (tweets) {
            cb(tweets)
          }, godeeper)
      } else {
        console.log(value)

      }
    })
  }




function getThemTweets(username, cb, goDeeper) {
  collectSomeData(username, 'statuses/user_timeline', true, function (a, id) {
    collectSomeData(username, 'statuses/user_timeline', id, function (b, id2) {
      collectSomeData(username, 'statuses/user_timeline', id2, function (c, id3) {
        collectSomeData(username, 'statuses/user_timeline', id3, function (d, id4) {
          collectSomeData(username, 'statuses/user_timeline', id4, function (e, id5) {
            var userTweets = [].concat(a).concat(b).concat(c).concat(d).concat(e)
            if (!goDeeper) {
              cb(userTweets)
            } else {
              collectSomeData(username, 'favorites/list', true, function (a1, i1d) {
                collectSomeData(username, 'favorites/list', i1d, function (b1, i1d2) {
                  collectSomeData(username, 'favorites/list', i1d2, function (c1, i1d3) {
                    collectSomeData(username, 'favorites/list', i1d3, function (d1, i1d4) {
                      collectSomeData(username, 'favorites/list', i1d4, function (e1, i1d5) {
                        collectSomeData(username, 'users/show', null, function (userData) {
                          var userFaves = [].concat(a).concat(b1).concat(c1).concat(d1).concat(e1)
                          cb({
                            tweets: userTweets,
                            // ownedLists: userOwnedLists,
                            // memberLists: userMemberLists,
                            faves: userFaves,
                            show: userData
                          })
                        })
                      })
                    })
                  })
                })
              })
            }
          })
        })
      })
    })
  })
}

function collectSomeData (username, endpoint, maxId, cb) {
  var dats =  {screen_name: username, count: 200}
  if(typeof maxId == 'string') dats.max_id = maxId

  T.get(endpoint, dats, function (err, datum, response) {
    if (err) {
      console.log("BORK", err)
      throw err
    } else if (!datum.length) {
      cb([], maxId)
    } else {
      if (maxId) {
        cb(datum, datum[datum.length - 1].id_str)
      } else {
        cb(datum)
      }
    }
  })
}