var timeStream = require('time-stream')
var through = require('through2')

module.exports = function (filename, encoder) {
  var tsR = timeStream.createReadStream(filename, encoder)
  var throttle = through.obj(function (data, enc, callback) {
    setTimeout(function () {
      callback(null, data)
    }, data.time/2)
  })
  return tsR.pipe(throttle)
}