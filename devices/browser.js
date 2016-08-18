var from = require('from2')
var writer = require('to2')
var duplexify = require('duplexify')

module.exports = function () {
  return {
    createStream: function () {
      var readableStream = from.obj(function () {})
      window.clickButton = function(val) {
        var blueButton = (val === 'b')
        var redButton = (val === 'r')
        readableStream.push({
          blueButton: blueButton,
          redButton: redButton,
        })
      }

      var writableStream = writer.obj(function (data, enc, callback) {
        var redLED = data.redLED
        var blueLED = data.blueLED
        if (blueLED) console.log('blue')
        else if (redLED) console.log('red')
        else console.log('white')
        callback()
      })

      return duplexify.obj(writableStream, readableStream)
    }
  }
}