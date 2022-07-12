function Microphone (_fft) {
    let FFT_SIZE = _fft || 1024;
    this.spectrum = [];
    this.volume = this.vol = 0;
    this.peak_volume = 0;
    let self = this;
    let audioContext = new AudioContext();
    let SAMPLE_RATE = audioContext.sampleRate;

    //test for browser compatibility with AudioContext and getUserMedia
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;

    //wait for microphone to initialize
    window.addEventListener('load',init,false);

    function init() {
        try {
            startMic(new AudioContext());
        }
        catch (e) {
            console.error(e);
            alert('Web Audio API is not supported in this browser.');
        }
    }

    function startMic(context) {
        navigator.getUserMedia({audio:true},processSound,error);

        function processSound(stream){
            //analyser extracts audio data (eg frequency, waveform)
            let analyser = context.createAnalyser();
            analyser.smoothingTimeConstant = 0.2;
            analyser.fftSize = FFT_SIZE;

            let node = context.createScriptProcessor(FFT_SIZE*2,1,1);
            node.onaudioprocess = function () {
                //binCount returns array which is half the FFT_SIZE
                self.spectrum = new Uint8Array(analyser.frequencyBinCount);
                //getByteFrequency returns amplitude for each bin
                analyser.getByteFrequencyData(self.spectrum);
                //getByteTimeDomainData gets volumes over the sample time
                //analyser.getByteTimeDomainData(self.spectrum);
                self.vol = self.getRMS(self.spectrum);
                //get peak - a hack when our volumes are low
                if (self.vol > self.peak_volume)
                    self.peak_volume = self.vol;
                self.volume = self.vol;

            }

            var input = context.createMediaStreamSource(stream);
            input.connect(analyser);
            analyser.connect(node);
            node.connect(context.destination);
        }

        function error(){
            console.log(arguments);
        }
    }

    //Sound Utilities//
    this.getRMS = function (spectrum) {
        var rms = 0;
        for (var i = 0; i< vols.length; i++){
            rms += spectrum[i] * spectrum[i];
        }
        rms /= spectrum.length;
        rms = Math.sqrt(rms);
        return rms;
    }

    return this;

}

var Mic = new Microphone();

var ctx = createCanvas("canvas1");
ctx.background(235);

function draw() {
    var s = getRMS();
    ctx.fillStyle = rgb(s*2);
    ctx.HfillEllipse(w/2,h/2,s*5,s*5);
}
