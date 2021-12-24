"use strict";

const{vec3, vec4, mat3, mat4, quat} = glMatrix;

var canvas;
var gl;

var beam = false;
var numOfSubdivides = 6;

var points = [];
var color;

var va = vec4.fromValues(0.0, 0.0, -1.0, 1);
var vb = vec4.fromValues(0.0, 0.942809, 0.333333, 1);
var vc = vec4.fromValues(-0.816479, -0.471405, 0.333333, 1);
var vd = vec4.fromValues(0.816479, -0.471405, 0.333333, 1);

var vBuffer = null;
var vPosition = null;
var cBuffer = null;
var vColor = null;

var radius = 6.0;
var theta = 0.0;
var phi = 0.0;
var near = 0.01;
var far = 200;
// var radius = 30.0;
// var theta = 45.0;
// var phi = 45.0;
var stept = 5.0 * Math.PI / 180.0;

var fovy = 45.0 * Math.PI/180.0;
var left = -2.0;
var right = 2.0;
var ytop = 2.0;
var bottom = -2.0;

var pnear = 0.01;
var pfar = 20;

var dxt = 0.0;
var dyt = 0.0;
var dzt = 0.0;
var step = 0.2;

var dx = 0.0;
var dy = 0.0;
var dz = 0.0;

var dxz = 0;
var dyz = 0;
var dzz = 0;

var eye;
var at = vec3.fromValues(0.0, 0.0, 0.0);
var up = vec3.fromValues(0.0, 1.0, 0.0);

var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;

var currentKey = [];

/* variables for interface control */
var projectionType = 1; // default is Orthographic(1), Perspective(2)
var drawType = 1; // default is WireFrame(1), Solid(2)
var viewType = [0]; // default is orthographic frontview(1), leftView(2), topView(3), isoview(4)
var viewcnt = 0; // view count default = 0, in orthographic or perspective mode

var changePos = 1; // default is Object(1), camera(2)

var currentColor = vec4.create();

var program = null;

// add deam
var normals = [];
var normalLoc = null;

var materialKaLoc = null;
var materialKdLoc = null;
var materialKsLoc = null;

var ambientProdLoc = null;
var diffuseProdLoc = null;
var specularProdLoc = null;

var modelViewMatrixLoc = null;
var projectionMatrixLoc = null;
var normalMatrixLoc = null;

var lightPositionLoc = null;
var shininessLoc = null;

var iBuffer = null;
var nBuffer = null;

var lightPosition = vec4.create();
var lightAmbient = vec4.create();
var lightDiffuse = vec4.create();
var lightSpecular = vec4.create();

var mka = 1.0;
var mkd = 1.0;
var mks = 1.0;
var mksh = 128;

var materialAmbient = vec4.create();
var materialDiffuse = vec4.create();
var materialSpecular = vec4.create();
var materialShininess = 1.0;

var clearColor = vec4.fromValues(0.7, 0.7, 0.7, 1.0);

var materialKa = 1.0;
var materialKd = 1.0;
var materialKs = 1.0;

var modelViewMatrix = mat4.create();
var projectionMatrix = mat4.create();
var normalMatrix = mat3.create(); 

// move object
function handleKeyDown() {
	var key = event.keyCode;
	event.preventDefault();
	// console.log(event);
	currentKey[key] = true;
	switch (key) {
		case 65: //left//a
			dx -= step;
			document.getElementById("xpos").value = dx;
			break;
		case 68: // right//d
			dx += step;
			document.getElementById("xpos").value = dx;
			break;
		case 87: // up//w
			dy += step;
			document.getElementById("ypos").value = dy;
			break;
		case 83: // down//s
			dy -= step;
			document.getElementById("ypos").value = dy;
			break;
		case 90: // a//z
			dz += step;
			document.getElementById("zpos").value = dz;
			break;
		case 88: // d//x
			dz -= step;
			document.getElementById("zpos").value = dz;
			break;
		case 72: // h//xtheta-
			dxt -= stept;
			document.getElementById("xrot").value = dxt;
			break;
		case 75: // k//xtheta+
			dxt += stept;
			document.getElementById("xrot").value = dxt;
			break;
		case 85: // u//ytheta+
			dyt += stept;
			document.getElementById("yrot").value = dyt;
			break;
		case 74: // j//ytheta-
			dyt -= stept;
			document.getElementById("yrot").value = dyt;
			break;
		case 78: // n//ztheta+
			dzt -= stept;
			document.getElementById("zrot").value = dzt;
			break;
		case 77: // m//ztheta-
			dzt += stept;
			document.getElementById("zrot").value = dzt;
			break;
		case 39: // xzoom+// →
			dxz += step;
			document.getElementById("xzoom").value=dxz;
			console.log(document.getElementById("xzoom").value);
			break;
		case 37: // xzoom-// ←
			dxz -= step;
			document.getElementById("xzoom").value=dxz;
			console.log(document.getElementById("xzoom").value);
			break;
		case 38: // yzoom+// ↑
			dyz += step;
			document.getElementById("yzoom").value=dyz;
			break;
		case 40: // yzoom-// ↓
			dyz -= step;
			document.getElementById("yzoom").value=dyz;
			break;
		case 190: // zzoom+// ,
			dzz += step;
			document.getElementById("zzoom").value=dzz;
			break;
		case 188: // zzoom-// .
			dzz -= step;
			document.getElementById("zzoom").value=dzz;
			break;
		case 100: case 52: // 4 // theta--
			theta += stept;
			document.getElementById("theta").value=theta;
			break;
		case 102: case 54: // 6 // theta++
			theta -= stept;
			document.getElementById("theta").value=theta;
			break;
		case 104: case 56: // 8 // phi++
			phi += stept;
			document.getElementById("phi").value=phi;
			break;
		case 98: case 50: // 2 // phi--
			phi -= stept;
			document.getElementById("phi").value=phi;
			break;
		case 107: case 61: // + // radius ++
			radius += step;
			document.getElementById("radius").value=radius;
			break;
		case 109: case 173: // - // radius --
			radius -= step;
			document.getElementById("radius").value=radius;
			break;
		case 82: // r//reset
			dx = dy = dz = 0;
			dxt = dyt = dzt = 0;
			dxz = dyz = dzz = 0;
			theta = phi = 0.0;
			radius = 6.0;
			document.getElementById("xpos").value = dx;
			document.getElementById("ypos").value = dy;
			document.getElementById("zpos").value = dz;			
			document.getElementById("xrot").value = dxt;
			document.getElementById("yrot").value = dyt;
			document.getElementById("zrot").value = dzt;
			document.getElementById("xzoom").value = dxz;
			document.getElementById("yzoom").value = dyz;
			document.getElementById("zzoom").value = dzz;
			document.getElementById("theta").value = theta;
			document.getElementById("phi").value = phi;
			document.getElementById("radius").value = radius;
			break;
	}
	// requestAnimFrame(render);
	buildModelViewProj();
}

function handleKeyUp() {
	currentKey[event.keyCode] = false;
}


function handleMouseDown(event) {
	mouseDown = true;
	lastMouseX = event.clientX;
	lastMouseY = event.clientY;
}

function handleMouseUp(event) {
	mouseDown = false;
}

function handleMouseMove(event) {
	if (!mouseDown)
		return;

	var newX = event.clientX;
	var newY = event.clientY;

	var deltaX = (newX - lastMouseX);
	var d = deltaX;
	theta = theta - parseFloat(d);

	var deltaY = (newY - lastMouseY);
	d = deltaY;
	phi = phi - parseFloat(d);

	lastMouseX = newX;
	lastMouseY = newY;
	buildModelViewProj();
}

function checkInput(){
	var ptype = document.getElementById("ortho").checked;
	if(ptype) {
		projectionType = 1;
	}else{
		if(document.getElementById("persp").checked)
			projectionType = 2;
	}

	var dtype = document.getElementById("wire").checked;
	if(dtype){
		drawType = 1;
	}else{
		if(document.getElementById("solid").checked)
			drawType = 2;
	}

	var hexcolor = document.getElementById("objcolor").value.substring(1);
	var rgbHex = hexcolor.match(/.{1,2}/g);
	currentColor = vec4.fromValues( 
		parseInt(rgbHex[0], 16)/255.0,
		parseInt(rgbHex[1], 16)/255.0,
		parseInt(rgbHex[2], 16)/255.0,
		1.0
	);
}


function restoreSliderValue(changePos){
	if(changePos == 1){
		$(".cameraBox").css("display", "none");
	}
	if(changePos == 2){
		$(".cameraBox").css("display", "table-row");
	}
}
 
function triangle(a, b, c) {
	points.push(a[0], a[1], a[2], a[3]);
	points.push(b[0], b[1], b[2], b[3]);
	points.push(c[0], c[1], c[2], c[3]);

	// add beam
	var t1 = vec4.create();
	vec4.subtract(t1, b, a);
	var t2 = vec4.create();
	vec4.subtract(t2, c, a);
	
	var n = vec4.create();
	var n1 = vec3.create();
	vec3.cross(n1, vec3.fromValues(t1[0], t1[1], t1[2]), vec3.fromValues(t2[0], t2[1], t2[3]));
	vec3.normalize(n1, n1);
	vec4.set(n, n1[0], n1[1], n1[2], 0.0);
	
	normals.push(n[0], n[1], n[2], 0.0);
	normals.push(n[0], n[1], n[2], 0.0);
	normals.push(n[0], n[1], n[2], 0.0);

}

function divideTriangle(a, b, c, n) {
	if (n > 0) {
		var ab = vec4.create();
		vec4.lerp(ab, a, b, 0.5);
		var abt = vec3.fromValues(ab[0], ab[1], ab[2]);
		vec3.normalize(abt, abt);
		vec4.set(ab, abt[0], abt[1], abt[2], 1.0);

		var bc = vec4.create();
		vec4.lerp(bc, b, c, 0.5);
		var bct = vec3.fromValues(bc[0], bc[1], bc[2]);
		vec3.normalize(bct, bct);
		vec4.set(bc, bct[0], bct[1], bct[2], 1.0);

		var ac = vec4.create();
		vec4.lerp(ac, a, c, 0.5);
		var act = vec3.fromValues(ac[0], ac[1], ac[2]);
		vec3.normalize(act, act);
		vec4.set(ac, act[0], act[1], act[2], 1.0);

		divideTriangle(a, ab, ac, n - 1);
		divideTriangle(ab, b, bc, n - 1);
		divideTriangle(bc, c, ac, n - 1);
		divideTriangle(ab, bc, ac, n - 1);
	} else {
		triangle(a, b, c);
	}
}

function divideTetra(a, b, c, d, n) {
	divideTriangle(a, b, c, n);
	divideTriangle(d, c, b, n);
	divideTriangle(a, d, b, n);
	divideTriangle(a, c, d, n);
}

window.onload = function initSphere() {
	canvas = document.getElementById("gl-canvas");

	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) {
		alert("WebGL isn't available");
	}

	gl.viewport(0, 0, canvas.width, canvas.width);
	gl.clearColor(0.7, 0.7, 0.7, 1.0);
	
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	
	updateProgram("vertex-Pshader", "fragment-Pshader");

	// $('#conBeam').click(function(){
	// 	if($("#beamNeed").html() == '光照需要'){
	// 		$("#beamNeed").html('光照不需要');
	// 		beam = false;
	// 	}else {
	// 		$("#beamNeed").html('光照需要');
	// 		beam = true;
	// 	}
	// });
	
	$("select").click(function(){
		var id = $("select").val()
		// console.log(id);
		id = parseInt(id);
		switch(id){
		  case 1:
			// console.log("1");
			updateProgram("vertex-Pshader", "fragment-Pshader");
			initInterface();
			initCoefficients();
			buildModelViewProj();
			break;
		  case 2:
			// console.log("2");
			updateProgram("vertex-Gshader", "fragment-Gshader");
			initInterface();
			initCoefficients();
			buildModelViewProj();
			break;  
		}
	});
	
	checkInput();
	initInterface();
	initCoefficients();
	
	buildModelViewProj();
}

function updateProgram(vertShader, fragShader){
	program = initShaders(gl, vertShader, fragShader);
	gl.useProgram(program);
}

function initInterface(){
	initShapeVal();
	initBeamVal();
	
	vBuffer = gl.createBuffer();
	
	// 初始化球体上四个顶点，x=rsin(theta)cos(phi),y=rsin(theta)sin(phi),z=rcos(theta)
	divideTetra(va, vb, vc, vd, numOfSubdivides);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
	
	vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	var bcolor = [];
	for(var i=0; i<points.length; i++)
		bcolor.push(currentColor[0], currentColor[1], currentColor[2], currentColor[3]);

	if(cBuffer == null) 
		cBuffer = gl.createBuffer();

	// setColors
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bcolor), gl.STATIC_DRAW);

	vColor = gl.getAttribLocation(program, "vColor");
	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray( vColor );
	
	modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
	projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
	
	// add beam 
	nBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

	normalLoc = gl.getAttribLocation(program, "vNormal");	
	gl.vertexAttribPointer(normalLoc, 4, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray(normalLoc);

	// retrieve the location of the uniform variables of the shader
	ambientProdLoc = gl.getUniformLocation(program, "ambientProduct");
	diffuseProdLoc = gl.getUniformLocation(program, "diffuseProduct");
	specularProdLoc = gl.getUniformLocation(program, "specularProduct");

	normalMatrixLoc = gl.getUniformLocation(program, "normalMatrix");

	lightPositionLoc = gl.getUniformLocation(program, "lightPosition");
	shininessLoc = gl.getUniformLocation(program, "shininess");

	materialKaLoc = gl.getUniformLocation(program, "materialKa");
	materialKdLoc = gl.getUniformLocation(program, "materialKd");
	materialKsLoc = gl.getUniformLocation(program, "materialKs");
	
	document.onkeydown = handleKeyDown;
	document.onkeyup = handleKeyUp;

	canvas.onmousedown = handleMouseDown;
	document.onmouseup = handleMouseUp;
	document.onmousemove = handleMouseMove;	
}

function updateColor(){
	var bcolor = [];
	for (var i = 0; i < points.length; i++)
		bcolor.push(currentColor[0], currentColor[1], currentColor[2], currentColor[3]);

	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bcolor), gl.STATIC_DRAW);

	vColor = gl.getAttribLocation(program, "vColor",);
	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vColor);
}

function buildModelViewProj(){
	if(projectionType == 1){
		mat4.ortho(projectionMatrix, left, right, bottom, ytop, near, far);
		// mat4.ortho( pMatrix, oleft, oright, oybottom, oytop, onear, ofar );
	}else{
		var aspect = 1;
		mat4.perspective(projectionMatrix, fovy, aspect, pnear, pfar);
		//mat4.frustum( pMatrix, pleft, pright, pybottom, pytop, pnear, pfar );
	}

	eye = vec3.fromValues(radius * Math.sin(theta) * Math.cos(phi),
		radius * Math.sin(theta) * Math.sin(phi),
		radius * Math.cos(theta));

	mat4.lookAt(modelViewMatrix, eye, at, up);
	mat4.translate(modelViewMatrix, modelViewMatrix, vec3.fromValues(dx, dy, dz));
	mat4.rotateX(modelViewMatrix, modelViewMatrix, dxt);
	mat4.rotateY(modelViewMatrix, modelViewMatrix, dyt);
	mat4.rotateZ(modelViewMatrix, modelViewMatrix, dzt);

	// mat4.ortho(projectionMatrix, left, right, bottom, ytop, near, far);

	gl.uniformMatrix4fv(modelViewMatrixLoc, false, new Float32Array(modelViewMatrix));
	gl.uniformMatrix4fv(projectionMatrixLoc, false, new Float32Array(projectionMatrix));
	var zoomLoc = gl.getUniformLocation(program, "zoom");
	gl.uniform3fv(zoomLoc, [dxz, dyz, dzz]);	
	
	// add beam
	var ambientProduct = vec4.create();
	vec4.multiply(ambientProduct, lightAmbient, materialAmbient);
	
	var diffuseProduct = vec4.create();
	vec4.multiply(diffuseProduct, lightDiffuse, materialDiffuse);
	
	var specularProduct = vec4.create();
	vec4.multiply(specularProduct, lightSpecular, materialSpecular);
	
	mat3.fromMat4(normalMatrix, modelViewMatrix);
	
	gl.uniform4fv(ambientProdLoc, new Float32Array(ambientProduct));
	gl.uniform4fv(diffuseProdLoc, new Float32Array(diffuseProduct));
	gl.uniform4fv(specularProdLoc, new Float32Array(specularProduct));
	gl.uniform4fv(lightPositionLoc, new Float32Array(lightPosition));
	gl.uniform1f(shininessLoc, materialShininess);
	gl.uniform1f(materialKaLoc, materialKa);
	gl.uniform1f(materialKdLoc, materialKd);
	gl.uniform1f(materialKsLoc, materialKs);
	gl.uniformMatrix3fv(normalMatrixLoc, false, new Float32Array(normalMatrix));

	render();
}

function render() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	if(drawType == 1){
		gl.drawArrays(gl.LINES, 0, points.length/4);   
	}else {
		gl.drawArrays(gl.TRIANGLES, 0, points.length/4);   
	}

	// requestAnimFrame(render);
}

function initShapeVal(){
	var projradios = document.getElementsByName("projtype");
	for (var i = 0; i < projradios.length; i++) {
		projradios[i].addEventListener("click", function (event) {
			var value = this.value;
			if (this.checked) {
				projectionType = parseInt(value);
			}
			buildModelViewProj();
		});
	}
	
	var drawradios = document.getElementsByName("drawtype");
	for (var i = 0; i < drawradios.length; i++) {
		drawradios[i].addEventListener("click", function (event) {
			var value = this.value;
			if (this.checked) {
				drawType = parseInt(value);
			}
			render();
		});
	}
	
	document.getElementById("objcolor").addEventListener("input", function (event) {
		var hexcolor = this.value.substring(1);
		var rgbHex = hexcolor.match(/.{1,2}/g);
		currentColor = vec4.fromValues(
			parseInt(rgbHex[0], 16) * 1.0 / 255.0,
			parseInt(rgbHex[1], 16) * 1.0 / 255.0,
			parseInt(rgbHex[2], 16) * 1.0 / 255.0,
			1.0
		);
		updateColor();
		render();
	});
	
	document.getElementById("xpos").addEventListener("input", function(event){
		dx = this.value;
		buildModelViewProj();
	});
	document.getElementById("ypos").addEventListener("input", function(event){
		dy = this.value;
		buildModelViewProj();
	});
	document.getElementById("zpos").addEventListener("input", function(event){
		dz = this.value;
		buildModelViewProj();
	});
	
	document.getElementById("xrot").addEventListener("input", function(event){
		dxt = this.value;
		buildModelViewProj();
	});
	document.getElementById("yrot").addEventListener("input", function(event){
		dyt = this.value;
		buildModelViewProj();
	});
	document.getElementById("zrot").addEventListener("input",function(event){
		dzt = this.value;
		buildModelViewProj();
	});/* 
	document.getElementById("theta").addEventListener("input",function(event){
		theta = this.value;
		buildModelViewProj();
	});
	document.getElementById("phi").addEventListener("input",function(event){
		phi = this.value;
		buildModelViewProj();
	});
	document.getElementById("radius").addEventListener("input",function(event){
		radius = this.value;
		buildModelViewProj();
	}); */
	
	var postypeRadio = document.getElementsByName("posgrp");
	for (var i = 0; i < postypeRadio.length; i++) {
		postypeRadio[i].addEventListener("click", function (event) {
			var value = this.value;
			if (this.checked) {
				changePos = parseInt(value);
				restoreSliderValue(changePos);
			}
		});
	}
}

function initBeamVal(){
	document.getElementById("slider-ka").addEventListener("input", function(event){
		var vka = event.target.value;
		materialKa = parseFloat(vka);
		document.getElementById("slider-ka-value").innerHTML = materialKa;
		buildModelViewProj();
	});
	
	document.getElementById("slider-kd").addEventListener("input", function(event){
		var vkd = event.target.value;
		materialKd = parseFloat(vkd);
		document.getElementById("slider-kd-value").innerHTML = materialKd;
		buildModelViewProj();
	});
	
	document.getElementById("slider-ks").addEventListener("input", function(event){
		var vks = event.target.value;
		materialKs = parseFloat(vks);
		document.getElementById("slider-ks-value").innerHTML = materialKs;
		buildModelViewProj();
	});
	
	document.getElementById("slider-sh").addEventListener("input", function(event){
		var vksh = event.target.value;
		materialShininess = parseInt(vksh);
		document.getElementById("slider-sh-value").innerHTML = materialShininess;
		buildModelViewProj();
	});
	
	document.getElementById("ka-color").addEventListener("input", function(event){
		var hexcolor = event.target.value.substring(1);
		var rgbHex = hexcolor.match(/.{1,2}/g);
		materialAmbient = vec4.fromValues(
			parseInt(rgbHex[0], 16) * 1.0 / 255.0,
			parseInt(rgbHex[1], 16) * 1.0 / 255.0,
			parseInt(rgbHex[2], 16) * 1.0 / 255.0,
			1.0
		);
		buildModelViewProj();
	});
	
	document.getElementById("kd-color").addEventListener("input", function (event) {
		var hexcolor = event.target.value.substring(1);
		var rgbHex = hexcolor.match(/.{1,2}/g);
		materialDiffuse = vec4.fromValues(
			parseInt(rgbHex[0], 16) * 1.0 / 255.0,
			parseInt(rgbHex[1], 16) * 1.0 / 255.0,
			parseInt(rgbHex[2], 16) * 1.0 / 255.0,
			1.0
		);
		buildModelViewProj();
	});
	
	document.getElementById("ks-color").addEventListener("input", function (event) {
		var hexcolor = event.target.value.substring(1);
		var rgbHex = hexcolor.match(/.{1,2}/g);
		materialSpecular = vec4.fromValues(
			parseInt(rgbHex[0], 16) * 1.0 / 255.0,
			parseInt(rgbHex[1], 16) * 1.0 / 255.0,
			parseInt(rgbHex[2], 16) * 1.0 / 255.0,
			1.0
		);
		buildModelViewProj();
	});
	
	document.getElementById("bk-color").addEventListener("input", function (event) {
		//var hexcolor = document.getElementById("bk-color").value.substring(1);
		var hexcolor = event.target.value.substring(1);
		var rgbHex = hexcolor.match(/.{1,2}/g);
		clearColor = vec4.fromValues(
			parseInt(rgbHex[0], 16) * 1.0 / 255.0,
			parseInt(rgbHex[1], 16) * 1.0 / 255.0,
			parseInt(rgbHex[2], 16) * 1.0 / 255.0,
			1.0
		);
	});
	
	document.getElementById("lt-ambient-color").addEventListener("input", function(event){
		var hexcolor = event.target.value.substring(1);
		var rgbHex = hexcolor.match(/.{1,2}/g);
		lightAmbient = vec4.fromValues(
			parseInt(rgbHex[0], 16) * 1.0 / 255.0,
			parseInt(rgbHex[1], 16) * 1.0 / 255.0,
			parseInt(rgbHex[2], 16) * 1.0 / 255.0,
			1.0
		);
	});
	
	document.getElementById("lt-diffuse-color").addEventListener("input", function (event) {
		var hexcolor = event.target.value.substring(1);
		var rgbHex = hexcolor.match(/.{1,2}/g);
		lightDiffuse = vec4.fromValues(
			parseInt(rgbHex[0], 16) * 1.0 / 255.0,
			parseInt(rgbHex[1], 16) * 1.0 / 255.0,
			parseInt(rgbHex[2], 16) * 1.0 / 255.0,
			1.0
		);
	});
	
	document.getElementById("lt-specular-color").addEventListener("input", function (event) {
		var hexcolor = event.target.value.substring(1);
		var rgbHex = hexcolor.match(/.{1,2}/g);
		lightSpecular = vec4.fromValues(
			parseInt(rgbHex[0], 16) * 1.0 / 255.0,
			parseInt(rgbHex[1], 16) * 1.0 / 255.0,
			parseInt(rgbHex[2], 16) * 1.0 / 255.0,
			1.0
		);
	});
	
	document.getElementById("slider-x").addEventListener("input", function(event){
		var lx = parseFloat(event.target.value);
		lightPosition[0] = lx;
		document.getElementById("slider-x-value").innerHTML = lx;
	});
	
	document.getElementById("slider-y").addEventListener("input", function (event) {
		var ly = parseFloat(event.target.value);
		lightPosition[1] = ly;
		document.getElementById("slider-y-value").innerHTML = ly;
	});
	
	document.getElementById("slider-z").addEventListener("input", function (event) {
		var lz = parseFloat(event.target.value);
		lightPosition[2] = lz;
		document.getElementById("slider-z-value").innerHTML = lz;
	});
}

function initCoefficients() {
	// // modeVal: use vert and frag shadders
	// var d = parseInt( document.getElementById("select_shader_id").value );
	// modeVal = d;

	// // colorMode: ambient + diffuse + specular
	// d = parseInt( document.getElementById( "select_color_id" ).value );
	// colorMode = d;

	// material
	mka = parseFloat(document.getElementById("slider-ka").value);
	materialKa = mka;

	mkd = parseFloat(document.getElementById("slider-kd").value);
	materialKd = mkd;

	mks = parseFloat(document.getElementById("slider-ks").value);
	materialKs = mks;

	materialShininess = parseInt(document.getElementById("slider-sh").value);

	// set material color
	var ambhexcolor = document.getElementById("ka-color").value.substring(1).match(/.{1,2}/g);
	materialAmbient = vec4.fromValues(
		parseInt(ambhexcolor[0], 16) * 1.0 / 255.0,
		parseInt(ambhexcolor[1], 16) * 1.0 / 255.0,
		parseInt(ambhexcolor[2], 16) * 1.0 / 255.0,
		1.0
	);

	var difhexcolor = document.getElementById("kd-color").value.substring(1).match(/.{1,2}/g);
	materialDiffuse = vec4.fromValues(
		parseInt(difhexcolor[0], 16) * 1.0 / 255.0,
		parseInt(difhexcolor[1], 16) * 1.0 / 255.0,
		parseInt(difhexcolor[2], 16) * 1.0 / 255.0,
		1.0
	);

	var spehexcolor = document.getElementById("ks-color").value.substring(1).match(/.{1,2}/g);
	materialSpecular = vec4.fromValues(
		parseInt(spehexcolor[0], 16) * 1.0 / 255.0,
		parseInt(spehexcolor[1], 16) * 1.0 / 255.0,
		parseInt(spehexcolor[2], 16) * 1.0 / 255.0,
		1.0
	);

	var ltx = parseFloat(document.getElementById("slider-x").value);
	var lty = parseFloat(document.getElementById("slider-y").value);
	var ltz = parseFloat(document.getElementById("slider-z").value);
	lightPosition = vec4.fromValues(ltx, lty, ltz, 1.0);

	// set light color
	var lambhexcolor = document.getElementById("lt-ambient-color").value.substring(1).match(/.{1,2}/g);
	lightAmbient = vec4.fromValues(
		parseInt(lambhexcolor[0], 16) * 1.0 / 255.0,
		parseInt(lambhexcolor[1], 16) * 1.0 / 255.0,
		parseInt(lambhexcolor[2], 16) * 1.0 / 255.0,
		1.0
	);

	var ldifhexcolor = document.getElementById("lt-diffuse-color").value.substring(1).match(/.{1,2}/g);
	lightDiffuse = vec4.fromValues(
		parseInt(ldifhexcolor[0], 16) * 1.0 / 255.0,
		parseInt(ldifhexcolor[1], 16) * 1.0 / 255.0,
		parseInt(ldifhexcolor[2], 16) * 1.0 / 255.0,
		1.0
	);

	var lspehexcolor = document.getElementById("lt-specular-color").value.substring(1).match(/.{1,2}/g);
	lightSpecular = vec4.fromValues(
		parseInt(lspehexcolor[0], 16) * 1.0 / 255.0,
		parseInt(lspehexcolor[1], 16) * 1.0 / 255.0,
		parseInt(lspehexcolor[2], 16) * 1.0 / 255.0,
		1.0
	);

	var cchexcolor = document.getElementById("bk-color").value.substring(1).match(/.{1,2}/g);
	clearColor = vec4.fromValues(
		parseInt(cchexcolor[0], 16) * 1.0 / 255.0,
		parseInt(cchexcolor[1], 16) * 1.0 / 255.0,
		parseInt(cchexcolor[2], 16) * 1.0 / 255.0,
		1.0
	);
}




