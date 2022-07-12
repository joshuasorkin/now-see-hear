
// allows me global access to canvas and it’s width and height properties
var w, width, h, height;
var canvas;

	// this enables me to have many canvases all positioned on top of eachother at 100% width and height of page
function createCanvas(canvas_name){
	canvas = document.createElement('canvas');
	var body = document.querySelector('body');
	body.appendChild(canvas);
	var ctx = canvas.getContext('2d');
	return ctx;
}