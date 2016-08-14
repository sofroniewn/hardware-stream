var from = require('from2')

module.exports = function () {
  var blueLED = false
  var redLED = false
  return {
    createStream: function () {
      var stream =  from.obj(function () {})
      window.clickButton = function(val) {
        var blueButton = (val === 'b')
        var redButton = (val === 'r')
        stream.push({
          blueButton: blueButton,
          blueLED: blueLED,
          redButton: redButton,
          redLED: redLED,
        })
      }
      return stream
    },
    turnOnLED: function (opts) {
      redLED = opts.redLED
      blueLED = opts.blueLED
      if (blueLED) console.log('blue')
      else if (redLED) console.log('red')
      else console.log('white')
    }
  }
}
