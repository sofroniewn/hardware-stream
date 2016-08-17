var from = require('from2')
var writer = require('to2')
var duplexify = require('duplexify')
var chalk = require('chalk')

module.exports = function () {
  return {
    createStream: function () {
      var readableStream = from.obj(function () {})
      process.stdin.on('data', function (data) {
        var blueButton = (data.toString().trim() === 'b')
        var redButton = (data.toString().trim() === 'r')
        readableStream.push({
          blueButton: blueButton,
          redButton: redButton,
        })
      })

      var writableStream = writer.obj(function (data, enc, callback) {
        var redLED = data.writeData.redLED
        var blueLED = data.writeData.blueLED
        if (blueLED) console.log(chalk.bgBlue('  '))
        else if (redLED) console.log(chalk.bgRed('  '))
        else console.log(chalk.bgWhite('  '))
        callback()
      })

      return duplexify.obj(writableStream, readableStream)
    }
  }
}