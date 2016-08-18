var from = require('from2')
var writer = require('to2')
var duplexify = require('duplexify')
var five = require('johnny-five')
var board = new five.Board({repl: false, debug: false})

module.exports = function () {
  var blueButtonPin = new five.Button(0)
  var redButtonPin = new five.Button(1)
  var blueLEDPin = new five.LED(2)
  var redLEDPin = new five.LED(3)

  return {
    createStream: function () {
      var readableStream = from.obj(function () {})
      blueButtonPin.on('press', function () {
        readableStream.push({
          blueButton: true,
          redButton: false,
        })
      })
      redButtonPin.on('press', function () {
        blueButton = true
        readableStream.push({
          blueButton: false,
          redButton: true,
        })
      })

      var writableStream = writer.obj(function (data, enc, callback) {
        var redLED = data.redLED
        var blueLED = data.blueLED
        if (blueLED) blueLEDPin.on()
        else blueLEDPin.off()
        if (redLED) redLEDPin.on()
        else redLEDPin.off()
        callback()
      })
      return duplexify.obj(writableStream, readableStream)
    }
    board: board
  }
}