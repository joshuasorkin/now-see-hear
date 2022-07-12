// sound.js

navigator.mediaDevices.getUserMedia({ audio: true })
.then(stream => {
    const audioCtx = new AudioContext();

    const width = 1500;
    const height = 400;
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
        analyzer.fftSize = 2 ** 10;
        // pull the data off the audio
        const timeData = new Uint8Array(analyzer.frequencyBinCount);
        //console.log(timeData);
        const frequencyData = new Uint8Array(analyzer.frequencyBinCount);
        //console.log(frequencyData);
        drawTimeData(timeData);
        drawFrequency(frequencyData);
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
            const [h,s,l] = [360 / (v * 360) - 0.5, 0.8, 0.5];
            const [r, g, b] = hslToRgb(h, s, l);
            ctx.strokeStyle = `rgb(${r},${g},${b})`;
            if (i === 0) {
                ctx.moveTo(x,y);
            }
            else{
                ctx.lineTo(x,y);
            }
            x += sliceWidth;
        });
        ctx.stroke();
        requestAnimationFrame(()=>{
            drawTimeData(timeData);
        });
    }

    function drawFrequency(frequencyData){
        analyzer.getByteFrequencyData(frequencyData);
        const barWidth = (width / bufferLength) * 2.5;
        console.log({barWidth});
        let x = 0;
        frequencyData.forEach((frequency) => {
            const percent = frequency / 255;
            const barHeight = height * percent;
            const [h,s,l] = [360 / (percent * 360) - 0.5, 0.8, 0.5];
            const [r, g, b] = hslToRgb(h, s, l);
            ctx.fillStyle = `rgb(${r},${g},${b})`;
            ctx.fillRect(
                x,
                height - barHeight,
                barWidth,
                barHeight
            );

            /*
            ctx.strokeStyle = `rgb(${r},${g},${b})`;
            ctx.beginPath();
            let vert = height-barHeight;
            ctx.moveTo(x,vert);
            let y_new = vert;
            while(vert < height){
                y_new += rand(barWidth);
                x_temp = x+rand(barWidth);
                console.log(`${x_temp} ${y_new}`)
                ctx.lineTo(x_temp,y_new);
            }
            */
            x += barWidth;
        });
        
        requestAnimationFrame(()=>{
            drawFrequency(frequencyData);
        })
    }

    function hslToRgb(h, s, l) {
        let r;
        let g;
        let b;
        if (s == 0) {
          r = g = b = l; // achromatic
        } else {
          const hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
          };
          const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          const p = 2 * l - q;
          r = hue2rgb(p, q, h + 1 / 3);
          g = hue2rgb(p, q, h);
          b = hue2rgb(p, q, h - 1 / 3);
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
      }

      function rand(maxInt){
        return Math.floor(Math.random() * maxInt);
      }
});