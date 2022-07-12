// sound.js

navigator.mediaDevices.getUserMedia({ audio: true })
.then(stream => {
    const audioCtx = new AudioContext();

    const width = 1500;
    const height = 1500;
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    let analyzer;
    let bufferLength;
    canvas.width = width;
    canvas.height = height;

    function handleError(err) {
        console.log('You must give access to your mic in order to proceed');
    }
    
    async function getAudio() {
        const stream = await navigator.mediaDevices
            .getUserMedia({ audio: true } )
            .catch(handleError);
        const audioCtx = new AudioContext();
        analyzer = audioCtx.createAnalyser();
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyzer);
        // How much data should we collect
        analyzer.fftSize = 32768;
        // pull the data off the audio
        const timeData = new Uint8Array(analyzer.frequencyBinCount);
        console.log(timeData);
        const frequencyData = new Uint8Array(analyzer.frequencyBinCount);
        console.log(frequencyData);
        drawTimeData(timeData);
    }
    getAudio();

    function drawTimeData(timeData){
        analyzer.getByteTimeDomainData(timeData);
        ctx.clearRect(0,0,width,height);
        ctx.lineWidth = 10;
        ctx.strokeStyle = "#ffc600";
        ctx.beginPath();
        bufferLength = analyzer.frequencyBinCount;
        const sliceWidth = width / bufferLength;
        let x = 0;
        timeData.forEach((data,i) =>{
            const v = data / 128;
            const y = (v * height) / 2
            if (i === 0) {
                ctx.moveTo(x,y);
            }
            else{
                ctx.lineTo(x,y);
            }
            x += sliceWidth;
        });
        console.log(ctx.strokeStyle);
        ctx.stroke();
        requestAnimationFrame(()=>drawTimeData(timeData));
    }
});