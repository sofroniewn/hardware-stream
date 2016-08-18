var ljn = require('labjack-nodejs')
var createDeviceObject = ljn.getDevice()
var board = new createDeviceObject()
console.log('trying....')

function err (res) {console.log('Board error: ', res)}
board.open(err, function () {
  console.log('helllloooooo')
})
