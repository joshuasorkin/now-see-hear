var ctx = createCanvas("canvas1");
//ctx.background(235);

function draw() {
    var s = Mic.getRMS();
    ctx.fillStyle = rgb(s*2);
    ctx.HfillEllipse(w/2,h/2,s*5,s*5);
    console.log("i just drew something");
}