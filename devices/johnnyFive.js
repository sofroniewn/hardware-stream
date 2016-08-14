var from = require('from2')
var five = require('johnny-five')
var board = new five.Board({repl: false, debug: false})

module.exports = function () {
  var blueLED = false
  var redLED = false
  return {
    createStream: function () {
      var stream =  from.obj(function () {})
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
    turnOnLED: function (opts) {
      redLED = opts.redLED
      blueLED = opts.blueLED
      if (blueLED) console.log(chalk.bgBlue('  '))
      else if (redLED) console.log(chalk.bgRed('  '))
      else console.log(chalk.bgWhite('  '))
    }
  }
}


////////// or do johnny-five on button press, get data, edit and then push stream
////////// replace the console.log inside turnOnLED with LED on calls