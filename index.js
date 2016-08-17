var stdin = require('./devices/stdin')
var browser = require('./devices/browser')

module.exports = function (device) {
  switch (device) {
    case 'stdin': return stdin()
    case 'johnny-five': return johnnyFive()
    case 'browser': return browser()
    default: throw new Error('unknown device')
  }
}