protoBuf = require('protocol-buffers')

module.exports = protoBuf(`
  message Data {
    required bool blueButton = 1;
    required bool redButton = 2;    
    required bool blueLED = 3;
    required bool redLED = 4;
    required int32 score = 5;
    required uint32 time = 6;
  }
`)