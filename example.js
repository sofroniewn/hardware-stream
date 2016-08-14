var hardwareStream = require('./')

var opts = {}
var hs = hardwareStream('stdin')

var stream = hs.createStream()

function updateLED () {
  var blueLED = Math.random() < 0.5
  var redLED = !blueLED
  hs.turnOnLED({
    blueLED: blueLED,
    redLED: redLED
  })
}


///////////////////////////////////
var through = require('through2')
function createExperimentStream(update) {
  update()
  var score = 0
  var prevTime = Date.now()
  
  return through.obj(function (data, enc, callback) {
    var curTime = Date.now()
    var deltaTime = curTime - prevTime
    prevTime = curTime
    if (data.blueLED === data.blueButton && data.redLED === data.redButton) score++
    else score--
    update()
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




var ls = createGraphStream()
var encoder = require('./encoder')

////serialize data stream from hardware
// var timeStream = require('time-stream')
// var ts = timeStream.createWriteStream('test.data', encoder.Data)
// var exp = stream.pipe(createExperimentStream(updateLED))
// exp.on('data', console.log)
// exp.pipe(ts)
// exp.pipe(ls)

  




//Replay experiment
var tsR = require('./replayStream')('test.data', encoder.Data)
tsR.pipe(ls)
tsR.on('data', function (data) {
  console.log(data)
})






