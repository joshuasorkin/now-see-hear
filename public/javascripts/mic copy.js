

function Microphone (_fft) {
  this.audioContext = new AudioContext();
  this.getRMS = function () {
    console.log("get rms");
  }

  return this;

  };

  var Mic = new Microphone();
