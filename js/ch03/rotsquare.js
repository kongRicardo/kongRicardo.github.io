"use strict";

var canvas;
var gl;
var direction = 1;

var theta = 0.0;
var thetaLoc;
var delay = 200;
var speed = 50;
var n_de = delay+speed;

var vertices1 = [
		 0,  1,  0,
		-1,  0,  0,
		 1,  0,  0,
		 0, -1,  0
	];
var vertices2 = [
		 0,  1.0,  0,
		 Math.cos(210 * Math.PI / 180.0), Math.sin(210 * Math.PI / 180.0),  0,
		 Math.cos(-30 * Math.PI / 180.0), Math.sin(-30 * Math.PI / 180.0),  0
		 //0, -1,  0
	];

var vertices = [];

console.log("test");
document.getElementById('controls_shard').onclick = function(num) {
		switch(num.target.index) {
			case 0:
				vertices = vertices1;
				break;
			case 1:
				vertices = vertices2;
				break;
		}
	}

function changeDir() {
	direction *= -1;
}

function initRotSquare(){
	
	canvas = document.getElementById( "rot-canvas" );
	gl = WebGLUtils.setupWebGL( canvas, "experimental-webgl" );
	if( !gl ){
		alert( "WebGL isn't available" );
	}

	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

	var program = initShaders( gl, "rot-v-shader", "rot-f-shader" );
	gl.useProgram( program );

	var vertices1 = [
		 0,  1,  0,
		-1,  0,  0,
		 1,  0,  0,
		 0, -1,  0
	];
	var vertices2 = [
		 0,  1.0,  0,
		 Math.cos(210 * Math.PI / 180.0), Math.sin(210 * Math.PI / 180.0),  0,
		 Math.cos(-30 * Math.PI / 180.0), Math.sin(-30 * Math.PI / 180.0),  0
		 //0, -1,  0
	];


	var colorUniformLocation = gl.getUniformLocation(program, "u_color");
	gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);

	var bufferId = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );

	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );

	thetaLoc = gl.getUniformLocation( program, "theta" );

	document.getElementById('controls').onclick = function(num) {
		switch(num.target.index) {
			case 0:
				direction *= -1;
				break;
			case 1:
				delay /= 2;
				break;
			case 2:
				delay *= 2;
				break;
		}
	}

	document.getElementById( "speedcon" ).onchange = function( event ){
		speed = 100 - event.target.value;
	}

	renderSquare();
}

function renderSquare(){
	gl.clear( gl.COLOR_BUFFER_BIT );
	
	// set uniform values
	theta += 0.1 * direction;
	if( theta > 2 * Math.PI )
		theta -= (2 * Math.PI);
	
	gl.uniform1f( thetaLoc, theta );

	gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
	//console.log("test");
	//gl.drawArrays( gl.TRIANGLES, 0, 3 );

	// update and render
	//window.requestAnimFrame( renderSquare );

	// update and render

	n_de = delay*0.2+speed*0.8-50;
	setTimeout( function (){ requestAnimFrame( renderSquare ); }, n_de );
}

function main() {

	initRotSquare();
}
