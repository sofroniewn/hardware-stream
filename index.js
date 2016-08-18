var stdin = require('./devices/stdin')
var browser = require('./devices/browser')
var labjack = require('./devices/labjack')

module.exports = function (device) {
  switch (device) {
    case 'stdin': return stdin()
    case 'johnny-five': return johnnyFive()
    case 'browser': return browser()
    case 'labjack': return labjack()
    default: throw new Error('unknown device')
  }
}