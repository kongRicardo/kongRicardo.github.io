"use strict";

var gl;
var points;

var vertices = [
		-0.5, 0.70, 
		 -0.5, -0.70, 

		 -0.4, 0.8,
		 0.4, 0.8,

		 0.5, 0.7,
		 0.5, -0.7,

		 0.4, -0.8,
		 -0.4, -0.8		//lines
];

var r = Math.random(), g = Math.random(), b = Math.random();

window.onload = function init(){
	var canvas = document.getElementById( "canvas" );
	gl = WebGLUtils.setupWebGL( canvas );
	if( !gl ){
		alert( "WebGL isn't available" );
	}

	// Three Vertices
	// var vertices = [
	// 	-0.5, 0.70, 
	// 	 -0.5, -0.70, 

	// 	 -0.4, 0.8,
	// 	 0.4, 0.8,

	// 	 0.5, 0.7,
	// 	 0.5, -0.7,

	// 	 0.4, -0.8,
	// 	 -0.4, -0.8		//lines

	// 	//0.4, 0.7,	//circle radian
	// 	//0.4, -0.7,

	// 	//0.0, -0.6,	//circle start
	// 	 /*0.0, -1.0,
	// 	 1.0, -1.0,
	// 	 1.0,  1.0,
	// 	 0.0, -1.0,
	// 	 1.0,  1.0,
	// 	 0.0,  1.0*/
	// 	 /*-0.5, -0.5,
	// 	 0.0, 0.5,
	// 	 0.5, -0.5*/
	// ];

	//circle radian
	//p1
	var n = 100;
	var r = 0.1;
	var theta = 0;
	vertices.push(0.4, 0.7);
	//vertices.push(r * Math.sin(theta) + 0.4,r * Math.cos(theta) + 0.7)
	for(var i = 0; i < n; i++) {
		if(i == 0){
			var x = r * Math.sin(theta) + 0.4;
    		var y = r * Math.cos(theta) + 0.7;
    		vertices.push(x, y);
    	} else{
    		theta += Math.PI/200.0;
    		var x = r * Math.sin(theta) + 0.4;
    		var y = r * Math.cos(theta) + 0.7;
    		vertices.push(x, y);
    	}
	}
	vertices.push(r * Math.sin(Math.PI/2) + 0.4,r * Math.cos(Math.PI/2) + 0.7)
	console.log("vertices[4] is "+vertices[4]);

	//p2
	var n = 100;
	var r = 0.1;
	var theta = Math.PI/2;
	vertices.push(0.4, -0.7);
	for(var i = 0; i < n; i++) {
		if(i == 0){
			var x = r * Math.sin(theta) + 0.4;
    		var y = r * Math.cos(theta) - 0.7;
    		vertices.push(x, y);
    	} else{
    		theta += Math.PI/200.0;
    		var x = r * Math.sin(theta) + 0.4;
    		var y = r * Math.cos(theta) - 0.7;
    		vertices.push(x, y);
    	}
	}
	vertices.push(r * Math.sin(Math.PI) + 0.4,r * Math.cos(Math.PI) - 0.7)

	//p3
	var n = 100;
	var r = 0.1;
	var theta = Math.PI;
	vertices.push(-0.4, -0.7);
	for(var i = 0; i < n; i++) {
		if(i == 0){
			var x = r * Math.sin(theta) - 0.4;
    		var y = r * Math.cos(theta) - 0.7;
    		vertices.push(x, y);
    	} else{
    		theta += Math.PI/200.0;
    		var x = r * Math.sin(theta) - 0.4;
    		var y = r * Math.cos(theta) - 0.7;
    		vertices.push(x, y);
    	}
	}
	vertices.push(r * Math.sin(3*Math.PI/2) - 0.4,r * Math.cos(3*Math.PI/2) - 0.7)


	//p4
	var n = 100;
	var r = 0.1;
	var theta = 3*Math.PI/2;
	vertices.push(-0.4, 0.7);
	for(var i = 0; i < n; i++) {
		if(i == 0){
			var x = r * Math.sin(theta) - 0.4;
    		var y = r * Math.cos(theta) + 0.7;
    		vertices.push(x, y);
    	} else{
    		theta += Math.PI/200.0;
    		var x = r * Math.sin(theta) - 0.4;
    		var y = r * Math.cos(theta) + 0.7;
    		vertices.push(x, y);
    	}
	}
	vertices.push(r * Math.sin(2*Math.PI) - 0.4,r * Math.cos(2*Math.PI) + 0.7)


	//rectangle1
	vertices.push(
		-0.5, 0.7,
		-0.5, -0.7,
		0.5, 0.7,
		0.5, -0.7
	);

	//rectangle_low
	vertices.push(
		-0.4, -0.7,
		-0.4, -0.8,
		0.4, -0.7,
		0.4, -0.8
	);

	//rectangle_top
	vertices.push(
		-0.4, 0.7,
		-0.4, 0.8,
		0.4, 0.7,
		0.4, 0.8
	);

	//continue..
	inside();

	// var N = 100;
	// //var vertexData = [0.0, 0.0];
	// var r = 0.10;
	// vertices.push(0.0, -0.6);
	// for (var i = 0; i <= 100; i++) {
 //    	var theta = i * 2 * Math.PI / 100;
 //    	var x = r * Math.sin(theta);
 //    	var y = r * Math.cos(theta) - 0.6;
 //    	vertices.push(x, y);
	// }

	// Configure WebGL
	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( r, g, b, 1.0 );


	// Load shaders and initialize attribute buffers
	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );


	// Load the data into the GPU
	var bufferId = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );
	//gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertexData ), gl.STATIC_DRAW );

	// Associate external shader variables with data buffer
	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );

	//look up uniform locations
	var colorUniformLocation = gl.getUniformLocation(program, "u_color");
	


	var count = 0;
	//render(count);
	//gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertexData ), gl.STATIC_DRAW );
	//gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);

	gl.clear( gl.COLOR_BUFFER_BIT );
	var offset = 0;
	
	//gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
	//lines
	gl.uniform4f(colorUniformLocation, 1, 1, 1, 1);
	gl.drawArrays( gl.LINES, 0, 8 );

	//p1
	gl.uniform4f(colorUniformLocation, 1, 1, 1, 1);
	gl.drawArrays(gl.TRIANGLE_FAN, 8, 102);
	console.log("vertices[16] is "+vertices[16]);

	//p2
	gl.uniform4f(colorUniformLocation, 1, 1, 1, 1);
	gl.drawArrays(gl.TRIANGLE_FAN, 110, 102);
	console.log("vertices[218] is "+vertices[218]);

	//p3
	gl.uniform4f(colorUniformLocation, 1, 1, 1, 1);
	gl.drawArrays(gl.TRIANGLE_FAN, 212, 102);
	console.log("vertices[420] is "+vertices[420]);

	//p4
	gl.uniform4f(colorUniformLocation, 1, 1, 1, 1);
	gl.drawArrays(gl.TRIANGLE_FAN, 314, 102);
	console.log("vertices[622] is "+vertices[622]);

	//rectangle1
	gl.uniform4f(colorUniformLocation, 1, 1, 1, 1);
	gl.drawArrays(gl.TRIANGLE_STRIP, 416, 4);
	console.log("vertices[824] is "+vertices[825]);

	//rectangle_low
	gl.uniform4f(colorUniformLocation, 1, 1, 1, 1);
	gl.drawArrays(gl.TRIANGLE_STRIP, 420, 4);
	console.log("vertices[824] is "+vertices[825]);

	//rectangle_top
	gl.uniform4f(colorUniformLocation, 1, 1, 1, 1);
	gl.drawArrays(gl.TRIANGLE_STRIP, 424, 4);
	console.log("vertices[824] is "+vertices[825]);

	//inside_c
	inside_c(colorUniformLocation);
	


	//console.log("count1 is "+count);
	//offset = 4;
	//count = vertices.length/2 - offset;
	// gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);
	// gl.drawArrays(gl.TRIANGLE_FAN, 4, 102);
	//console.log("count2 is "+count);
}

function render(count){
	gl.clear( gl.COLOR_BUFFER_BIT );
	var off = 0;
	console.log("count is "+count);
	//gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
	gl.drawArrays( gl.TRIANGLE_STRIP, off, count/2 );
	//gl.drawArrays( gl.TRIANGLE_FANS, 3, 6 );
}

function inside() {
	//first
	vertices.push(
		//lines
		-0.4, -0.3,
		-0.4, 0.6,

		-0.3, 0.7,
		0.3, 0.7,

		0.4, 0.6,
		0.4, -0.3,

		-0.3, -0.4,
		0.3, -0.4
	);

	//p1
	var n = 100;
	var r = 0.1;
	var theta = 0;
	vertices.push(0.3, 0.6);
	//vertices.push(r * Math.sin(theta) + 0.4,r * Math.cos(theta) + 0.7)
	for(var i = 0; i < n; i++) {
		if(i == 0){
			var x = r * Math.sin(theta) + 0.3;
    		var y = r * Math.cos(theta) + 0.6;
    		vertices.push(x, y);
    	} else{
    		theta += Math.PI/200.0;
    		var x = r * Math.sin(theta) + 0.3;
    		var y = r * Math.cos(theta) + 0.6;
    		vertices.push(x, y);
    	}
	}
	vertices.push(r * Math.sin(Math.PI/2) + 0.3,r * Math.cos(Math.PI/2) + 0.6)
	console.log("vertices[4] is "+vertices[4]);

	//p2
	var n = 100;
	var r = 0.1;
	var theta = Math.PI/2;
	vertices.push(0.3, -0.6);
	for(var i = 0; i < n; i++) {
		if(i == 0){
			var x = r * Math.sin(theta) + 0.3;
    		var y = r * Math.cos(theta) - 0.6;
    		vertices.push(x, y);
    	} else{
    		theta += Math.PI/200.0;
    		var x = r * Math.sin(theta) + 0.3;
    		var y = r * Math.cos(theta) - 0.6;
    		vertices.push(x, y);
    	}
	}
	vertices.push(r * Math.sin(Math.PI) + 0.3,r * Math.cos(Math.PI) - 0.6)

	//p3
	var n = 100;
	var r = 0.1;
	var theta = Math.PI;
	vertices.push(-0.3, -0.6);
	for(var i = 0; i < n; i++) {
		if(i == 0){
			var x = r * Math.sin(theta) - 0.3;
    		var y = r * Math.cos(theta) - 0.6;
    		vertices.push(x, y);
    	} else{
    		theta += Math.PI/200.0;
    		var x = r * Math.sin(theta) - 0.3;
    		var y = r * Math.cos(theta) - 0.6;
    		vertices.push(x, y);
    	}
	}
	vertices.push(r * Math.sin(3*Math.PI/2) - 0.3,r * Math.cos(3*Math.PI/2) - 0.6)


	//p4
	var n = 100;
	var r = 0.1;
	var theta = 3*Math.PI/2;
	vertices.push(-0.3, 0.6);
	for(var i = 0; i < n; i++) {
		if(i == 0){
			var x = r * Math.sin(theta) - 0.3;
    		var y = r * Math.cos(theta) + 0.6;
    		vertices.push(x, y);
    	} else{
    		theta += Math.PI/200.0;
    		var x = r * Math.sin(theta) - 0.3;
    		var y = r * Math.cos(theta) + 0.6;
    		vertices.push(x, y);
    	}
	}
	vertices.push(r * Math.sin(2*Math.PI) - 0.3,r * Math.cos(2*Math.PI) + 0.6)


	//rectangle1
	vertices.push(
		-0.4, 0.6,
		-0.4, -0.6,
		0.4, 0.6,
		0.4, -0.6
	);

	//rectangle_low
	vertices.push(
		-0.3, -0.6,
		-0.3, -0.7,
		0.3, -0.6,
		0.3, -0.7
	);

	//rectangle_top
	vertices.push(
		-0.3, 0.6,
		-0.3, 0.7,
		0.3, 0.6,
		0.3, 0.7
	);

}

function inside_c(colorUniformLocation) {
	//lines
	gl.uniform4f(colorUniformLocation, r, g, b, 1);
	gl.drawArrays( gl.LINES, 428, 8 );
	console.log("vertices[856] is "+vertices[857]);

	//p1
	gl.uniform4f(colorUniformLocation, r, g, b, 1);
	gl.drawArrays(gl.TRIANGLE_FAN, 436, 102);
	console.log("vertices[16] is "+vertices[16]);

	//p2
	gl.uniform4f(colorUniformLocation, r, g, b, 1);
	gl.drawArrays(gl.TRIANGLE_FAN, 538, 102);
	console.log("vertices[218] is "+vertices[218]);

	//p3
	gl.uniform4f(colorUniformLocation, r, g, b, 1);
	gl.drawArrays(gl.TRIANGLE_FAN, 640, 102);
	console.log("vertices[420] is "+vertices[420]);

	//p4
	gl.uniform4f(colorUniformLocation, r, g, b, 1);
	gl.drawArrays(gl.TRIANGLE_FAN, 742, 102);
	console.log("vertices[622] is "+vertices[622]);

	//rectangle1
	gl.uniform4f(colorUniformLocation, r, g, b, 1);
	gl.drawArrays(gl.TRIANGLE_STRIP, 844, 4);
	console.log("vertices[824] is "+vertices[825]);

	//rectangle_low
	gl.uniform4f(colorUniformLocation, r, g, b, 1);
	gl.drawArrays(gl.TRIANGLE_STRIP, 848, 4);
	console.log("vertices[824] is "+vertices[825]);

	//rectangle_top
	gl.uniform4f(colorUniformLocation, r, g, b, 1);
	gl.drawArrays(gl.TRIANGLE_STRIP, 852, 4);
	console.log("vertices[824] is "+vertices[825]);
	
}
