protoBuf = require('protocol-buffers')

module.exports = protoBuf(`
  message Data {
    required ReadData readData=1;
    required WriteData writeData=2;
    required ExptData exptData=3;
  }
  message ReadData {
    required bool blueButton = 1;
    required bool redButton = 2;
  }
  message WriteData {
    required bool blueLED = 1;
    required bool redLED = 2;
  }
  message ExptData {
    required int32 score = 1;
    required uint32 time = 2;
  }
`)