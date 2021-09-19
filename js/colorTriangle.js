"use strict";

var gl;
var points;

window.onload = function init(){
	var canvas = document.getElementById( "triangle-canvas" );
	gl = WebGLUtils.setupWebGL( canvas );
	if( !gl ){
		alert( "WebGL isn't available" );
	}

	// Three Vertices
/*	var vertices = [
		-1.0, -1.0, 
		 0.0,  1.0, 
		 1.0, -1.0, */
		 /*0.0, -1.0,
		 1.0, -1.0,
		 1.0,  1.0,
		 0.0, -1.0,
		 1.0,  1.0,
		 0.0,  1.0*/
		 /*-0.5, -0.5,
		 0.0, 0.5,
		 0.5, -0.5*/
	//];

	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );

	var verticesColors = new Float32Array([
		-1.0, -1.0, 1.0, 0.0, 0.0,
		 0.0,  1.0, 0.0, 0.0, 1.0,
		 1.0, -1.0, 0.0, 1.0, 0.0,
		]);

	// Create a buffer object
  	var vertexColorBuffer = gl.createBuffer();

  	// Bind the buffer object to target
  	gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  	gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW); 

  	var FSIZE = verticesColors.BYTES_PER_ELEMENT;
  	//Get the storage location of vPosition, assign and enable buffer
 	var vPosition = gl.getAttribLocation( program, "vPosition" );

 	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, FSIZE * 5, 0);
  	gl.enableVertexAttribArray(vPosition);  // Enable the assignment of the buffer object

  	// Get the storage location of a_Position, assign buffer and enable
  	var a_Color = gl.getAttribLocation( program, "a_Color");

  	gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
  	gl.enableVertexAttribArray(a_Color);  // Enable the assignment of the buffer object
 
  	// Unbind the buffer object
  	gl.bindBuffer(gl.ARRAY_BUFFER, null);

  	// Specify the color for clearing <canvas>
  	gl.clearColor(1.0, 1.0, 1.0, 1.0);
 
  	// Clear <canvas>
  	gl.clear(gl.COLOR_BUFFER_BIT);
 
 	// Draw the rectangle
  	gl.drawArrays(gl.TRIANGLES, 0, 3);

	/*// Configure WebGL
	gl.viewport( 0, 0, canvas.width, canvas.height );
	//gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

	// Load shaders and initialize attribute buffers
	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );

	// Load the data into the GPU
	var bufferId = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, verticesColors );
	gl.bufferData( gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW );

	// Associate external shader variables with data buffer
	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, FSIZE * 5, 0 );
	gl.enableVertexAttribArray( vPosition );

	var FSIZE = verticesColors.BYTES_PER_ELEMENT;
	var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
	gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
  	gl.enableVertexAttribArray(a_Color); 

  	gl.bindBuffer( gl.ARRAY_BUFFER, null );

	render();*/
}

function render(){
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear( gl.COLOR_BUFFER_BIT );
	//gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
	gl.drawArrays( gl.TRIANGLES, 0, 3 );
	//gl.drawArrays( gl.TRIANGLE_FANS, 3, 6 );
}