var from = require('from2')
var writer = require('to2')
var duplexify = require('duplexify')
var NanoTimer = require('nanotimer')
var ljn = require('labjack-nodejs')
var createDeviceObject = ljn.getDevice()
var board = new createDeviceObject()
function err (res) {console.log('Board error: ', res)}
//var EventEmitter = require('events').EventEmitter
// board.open(err, function () {
//   emitter.emit('ready')
//   console.log('helllloooooo')
// })
board.openSync()

module.exports = function () {
  return {
    createStream: function () {
      var readableStream = from.obj(function () {})
      var blueButton = 0
      var redButton = 0
      timer = new NanoTimer()
      timer.setInterval(function () {
        board.readMany(['FIO0', 'FIO2'], err, function(value) {
          if (value[0] === 1 & value[0] !== blueButton) {
            readableStream.push({
              blueButton: true,
              redButton: false,
            })
          }
          if (value[1] === 1 & value[1] !== redButton) {
            readableStream.push({
              blueButton: false,
              redButton: true,
            })
          }
          blueButton = value[0]
          redButton = value[1]
        })
      }, '', '10m')

      var writableStream = writer.obj(function (data, enc, callback) {
        board.writeMany(['FIO1', 'FIO3'], [+data.blueLED, +data.redLED], err, callback)
      })
      return duplexify.obj(writableStream, readableStream)
    },
   }
}