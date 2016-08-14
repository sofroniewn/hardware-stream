protoBuf = require('protocol-buffers')

module.exports = protoBuf(`
  message Data {
    required RawData data=1;
    required int32 score=2;
    required uint32 time=3;
  }
  message RawData {
    required bool blueLED = 1;
    required bool blueButton = 2;
    required bool redLED = 3;
    required bool redButton = 4;
  }
`)