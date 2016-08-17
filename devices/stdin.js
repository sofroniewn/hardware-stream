var from = require('from2')
var writer = require('to2')
var duplexify = require('duplexify')
var chalk = require('chalk')

module.exports = function () {
  var blueLED = false
  var redLED = false
  return {
    createStream: function () {
      var readableStream = from.obj(function () {})
      process.stdin.on('data', function (data) {
        var blueButton = (data.toString().trim() === 'b')
        var redButton = (data.toString().trim() === 'r')
        readableStream.push({
          blueButton: blueButton,
          blueLED: blueLED,
          redButton: redButton,
          redLED: redLED,
        })
      })
      var writableStream = writer.obj(function (data, enc, callback) {
        redLED = data.redLED
        blueLED = data.blueLED
        if (blueLED) console.log(chalk.bgBlue('  '))
        else if (redLED) console.log(chalk.bgRed('  '))
        else console.log(chalk.bgWhite('  '))
        callback()
      })
      return duplexify.obj(writableStream, readableStream)
    }
  }
}
