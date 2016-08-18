var hardwareStream = require('./')
var harware = hardwareStream('labjack').createStream()

function updateLED () {
  var blueLED = Math.random() < 0.5
  var redLED = !blueLED
  return {
    blueLED: blueLED,
    redLED: redLED
  }
}

//////////////////////////////////////////////////////////////////////
var through = require('through2')
function createExperimentStream(update, initial) {
  var writeData = initial
  var score = 0
  var prevTime = Date.now()
  
  return through.obj(function (data, enc, callback) {
    var curTime = Date.now()
    var deltaTime = curTime - prevTime
    prevTime = curTime
    if (writeData.blueLED === data.blueButton && writeData.redLED === data.redButton) score++
    else score--
    writeData = update()
    callback(null, {
      blueButton: data.blueButton,
      redButton: data.redButton,
      blueLED: writeData.blueLED,
      redLED: writeData.redLED,
      score: score,
      time: deltaTime
    })
  })
}

//////////////////////////////////////////////////////////////////////
var lightningStream = require('lightning-stream')
var from = require('from2')
var duplexify = require('duplexify')
var Lightning = require('lightning.js')

function createVisulaizationStream() {
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

//////////////////////////////////////////////////////////////////////
//var graph = createVisulaizationStream()

var encoder = require('./encoder')
var loggingStream = require('time-stream')
var log = loggingStream.createWriteStream('test.data', encoder.Data)

var initial = updateLED()
var expt = createExperimentStream(updateLED, initial)
harware.write(initial)

var results = harware.pipe(expt)
results.on('data', console.log)
results.pipe(harware)
results.pipe(log)
//results.pipe(graph)

//////////////////////////////////////////////////////////////////////
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




////////////////////////////////////////////////////////////////////////////////////////////////////
// two bits of awkardness
//   - one is how to initialize hardware. should create experiment stream take an update function???
//   - one is how to wait for johnny-five board to be initialized, or labjack - use open-sync???
//
// get something working with johnny-five AND lab-jack
//
// create hardware-stream-2choice module
// create experiment-stream-2AFC module
// create visualization-stream-line module
// create replay-stream module, add rate parameter.
//
////////////////////////////////////////////////////////////////////////////////////////////////////

// create harware-stream-mVR module
// this module has as its readable stream xVel, yVel, responses
// this modules has as its writable stream wallDist, reward, lapNumber

// create visualization-stream-mVR module
// this module accepts a maze during its construction and is a writable stream with wallDist and mazePos

// create experiment-stream-mVR module
// this module accepts a maze during its construction and returns a through stream that takes inputs, moves player
// taking collisions into account, and returns wallDist and mazePos, and reward, and lapNumber




