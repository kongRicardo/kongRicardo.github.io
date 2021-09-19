"use strict";

var gl;
var points;

window.onload = function init(){
	var canvas = document.getElementById( "rectangle-canvas" );
	gl = WebGLUtils.setupWebGL( canvas );
	if( !gl ){
		alert( "WebGL isn't available" );
	}

	// Three Vertices
	var vertices = [
/*		-1.0, -1.0, 
		 0.0,  1.0, 
		 1.0, -1.0, 
*/
	/*	 -1.0, -1.0, 
		 -1.0,  1.0, 
		 1.0, 1.0,
		 1.0, -1.0,*/

		 0.0, -1.0,
		 1.0, -1.0,
		 1.0,  1.0,
		 0.0, -1.0,
		 1.0,  1.0,
		 0.0,  1.0,
	/*	 -0.5, -0.5,
		 0.0, 0.5,
		 0.5, -0.5*/
	];

	// Configure WebGL
	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

	// Load shaders and initialize attribute buffers
	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );

	// Load the data into the GPU
	var bufferId = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );

	//look up uniform locations
	 var colorUniformLocation = gl.getUniformLocation(program, "u_color");

	// Associate external shader variables with data buffer
	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );

	//render();
	gl.clear( gl.COLOR_BUFFER_BIT );
	gl.uniform4f(colorUniformLocation, 0, 0, 1, 1);
	gl.drawArrays( gl.TRIANGLES, 0, 6 );

	//Triangle start
	vertices = [
		0, -1,
		-1, 1,
		-1, -1,
	];
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );
	gl.uniform4f(colorUniformLocation, 1, 0, 0.5, 1);
	gl.drawArrays( gl.TRIANGLES, 0, 3 );
}

function render(){
	gl.clear( gl.COLOR_BUFFER_BIT );
	//gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
	gl.drawArrays( gl.TRIANGLES, 0, 6 );
	//gl.drawArrays( gl.TRIANGLE_FANS, 3, 6 );
}