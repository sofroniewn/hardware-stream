var from = require('from2')
var writer = require('to2')
var chalk = require('chalk')

module.exports = function () {
  var blueLED = false
  var redLED = false
  return {
    createReadStream: function () {
      var stream = from.obj(function () {})
      process.stdin.on('data', function (data) {
        var blueButton = (data.toString().trim() === 'b')
        var redButton = (data.toString().trim() === 'r')
        stream.push({
          blueButton: blueButton,
          blueLED: blueLED,
          redButton: redButton,
          redLED: redLED,
        })
      })
      return stream
    },
    createWriteStream: function () {
      return writer.obj(function (data, enc, callback) {
        redLED = data.redLED
        blueLED = data.blueLED
        if (blueLED) console.log(chalk.bgBlue('  '))
        else if (redLED) console.log(chalk.bgRed('  '))
        else console.log(chalk.bgWhite('  '))
        callback()
      })
    }
  }
}
