var hardwareStream = require('./')
var hs = hardwareStream('stdin').createStream()

var opts = {}

function updateLED () {
  var blueLED = Math.random() < 0.5
  var redLED = !blueLED
  return {
    blueLED: blueLED,
    redLED: redLED
  }
}


///////////////////////////////////
var through = require('through2')
function createExperimentStream(update, hs) {
  hs.write(update())
  var score = 0
  var prevTime = Date.now()
  
  return through.obj(function (data, enc, callback) {
    var curTime = Date.now()
    var deltaTime = curTime - prevTime
    prevTime = curTime
    if (data.blueLED === data.blueButton && data.redLED === data.redButton) score++
    else score--
    hs.write(update())
    callback(null, {
      data: data,
      score: score,
      time: deltaTime
    })
  })
}
///////////////////////////////////


///////////////////////////////////
var lightningStream = require('lightning-stream')
var from = require('from2')
var duplexify = require('duplexify')
var Lightning = require('lightning.js')

function createGraphStream() {
  var stream = duplexify.obj()
  var lightning = new Lightning()
  function mapping (data) {
    //return {series: [data.score]}
    return [data.score]
  }
  lightning.lineStreaming([0]).then(function (viz) {
    var ls = lightningStream(viz, mapping)
    stream.setWritable(ls)
    viz.open()
  })
  return stream
}
///////////////////////////////////


var timeStream = require('time-stream')
var encoder = require('./encoder')

var ts = timeStream.createWriteStream('test.data', encoder.Data)
var es = createExperimentStream(updateLED, hs)
//var ls = createGraphStream()



var rs = hs.pipe(es)
rs.on('data', console.log)
rs.pipe(ts)


////serialize data stream from hardware
// if (harware.board) {
//   harware.board.on('ready', function () {
//     var hs = harware.createStream()
//     var rs = hs.pipe(es)
//     rs.on('data', console.log)
//     rs.pipe(ts)
//     //rs.pipe(ls)
//   })
// }
// else {
//   var hs = harware.createStream()
//   var rs = hs.pipe(es)
//   rs.on('data', console.log)
//   rs.pipe(ts)
//   //rs.pipe(ls)
// } 


//Replay experiment
// var tsR = require('./replayStream')('test.data', encoder.Data)
// tsR.pipe(ls)
// tsR.on('data', function (data) {
//   console.log(data)
// })






