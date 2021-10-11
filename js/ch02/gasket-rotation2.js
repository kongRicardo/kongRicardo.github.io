"use strict";

const { vec3 } = glMatrix;

var canvas;
var gl;

var points = [];

//var numTimesToSubdivide = document.getElementById('mvalue').value;


function initTriangles(numTimesToSubdivide,theta){
	var numTimesToSubdivide = document.getElementById('mvalue').value;
	var theta = document.getElementById('theta').value;
	var angle = theta;
	theta = theta*Math.PI/180.0;
	console.log("theta is "+theta);
	canvas = document.getElementById( "gl-canvas" );

	
	gl = WebGLUtils.setupWebGL( canvas );
	if( !gl ){
		alert( "WebGL isn't available" );
	}
	//var cxt = canvas.getContext("2d");
	// initialise data for Sierpinski gasket

	// first, initialise the corners of the gasket with three points.
	var vertices = [
		-0.8, -0.5,  0,
		 0, 1.0,  0,
		 0.8, -0.5, 0,	//???
	];

	// var u = vec3.create();
	// vec3.set( u, -1, -1, 0 );
	var u = vec3.fromValues( vertices[0], vertices[1], vertices[2] );
	// var v = vec3.create();
	// vec3.set( v, 0, 1, 0 );
	var v = vec3.fromValues( vertices[3], vertices[4], vertices[5] );
	// var w = vec3.create();
	// vec3.set( w, 1, -1, 0 );
	var w = vec3.fromValues( vertices[6], vertices[7], vertices[8] );



	divideTriangle( u, v, w, numTimesToSubdivide );

	Affine(theta,angle);

	// configure webgl
	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

	// load shaders and initialise attribute buffers
	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );

	//look up uniform locations
	var colorUniformLocation = gl.getUniformLocation(program, "u_color");
	gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);

	// load data into gpu
	var vertexBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( points ), gl.STATIC_DRAW );

	// associate out shader variables with data buffer
	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );

	renderTriangles(theta);
}

function click() {		//??not parameter
	points = [];		//reset
	initTriangles();	//update
};

function triangle( a, b, c ){
	//var k;
	points.push( a[0], a[1], a[2] );
	points.push( b[0], b[1], b[2] );
	points.push( c[0], c[1], c[2] );
	// for( k = 0; k < 3; k++ )
	// 	points.push( a[k] );
	// for( k = 0; k < 3; k++ )
	// 	points.push( b[k] );
	// for( k = 0; k < 3; k++ )
	// 	points.push( c[k] );
}

function divideTriangle( a, b, c, count ){
	// check for end of recursion
	if( count == 0 ){
		triangle( a, b, c );
	}else{
		var ab = vec3.create();
		vec3.lerp( ab, a, b, 0.5 );
		var bc = vec3.create();
		vec3.lerp( bc, b, c, 0.5 );
		var ca = vec3.create();
		vec3.lerp( ca, c, a, 0.5 );

		var m_ab_bc = vec3.create();
		vec3.lerp( m_ab_bc, ab, bc, 0.5 );
		var m_ab_ac = vec3.create();
		vec3.lerp( m_ab_ac, ab, ca, 0.5 );
		var m_ac_bc = vec3.create();
		vec3.lerp( m_ac_bc, ca, bc, 0.5 );

		--count;

		// three new triangles
		divideTriangle( a, ab, ca, count );
		divideTriangle( b, bc, ab, count );
		divideTriangle( c, ca, bc, count );
		//divideTriangle( m_ac_bc, m_ab_ac, m_ab_bc, count );
		divideTriangle( ab, ca, bc, count );
	}
}

function renderTriangles(theta){
	gl.clear( gl.COLOR_BUFFER_BIT );
	var offset = 3;
	var count = 3;
	
	for(var i=0; i<points.length/3; i+=offset){
		gl.drawArrays( gl.LINE_LOOP, i, count );
		//gl.drawArrays( gl.LINE_LOOP, 6, 3 );
	}

}

function Affine(theta,angle) {
	var offset = 3;
	var x = 0;
	var y = 0;
	var d = 0;
	var alpha = 0;

	for(var i=0; i<points.length; i+=offset) {
		//if( i%offset == 1) {
			console.log("x is "+points[i]+", y is "+points[i+1]);
			d = Math.sqrt( Math.abs(points[i]*points[i]) + Math.abs(points[i+1]*points[i+1]) );	//??
			//console.log("d is "+d);
			//console.log("angle is "+angle);
			
			alpha = theta * d;
			console.log("alpha is "+alpha);
			x = points[i]*Math.cos(theta * d) - points[i+1]*Math.sin(theta * d);
			y = points[i]*Math.sin(theta * d) + points[i+1]*Math.cos(theta * d);
			//x += -Math.sin(theta) + Math.cos(theta);
			//y += Math.cos(theta) + Math.sin(theta) -1;

			points[i] = x;
			points[i+1] = y;
		//}
	}
}

function main() {
	var numTimesToSubdivide = document.getElementById('mvalue').value;
	var theta = document.getElementById('theta').value;
	points = [];
	initTriangles(numTimesToSubdivide,theta);


}