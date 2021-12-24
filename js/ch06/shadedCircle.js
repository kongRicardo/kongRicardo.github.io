"use strict";

const {
    vec3,
    vec4,
    mat4
} = glMatrix;

var canvas;
var gl;

var program;

var points = [];
var index = 0;
var normals = [];

//  circle
var va = vec4.fromValues(0.0, 0.0, -1.0, 1);
var vb = vec4.fromValues(0.0, 0.942809, 0.333333, 1);
var vc = vec4.fromValues(-0.816479, -0.471405, 0.333333, 1);
var vd = vec4.fromValues(0.816479, -0.471405, 0.333333, 1);
var numOfSubdivides = 7;
//

var lightPosition = vec4.fromValues(1.0, 1.0, 1.0, 0.0);
var lightAmbient = vec4.fromValues(0.3, 0.3, 0.3, 1.0);
var lightDiffuse = vec4.fromValues(1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4.fromValues(1.0, 1.0, 1.0, 1.0);

var materialAmbient = vec4.fromValues(1.0, 0.0, 1.0, 1.0);
var materialDiffuse = vec4.fromValues(1.0, 0.8, 0.0, 1.0);
var materialSpecular = vec4.fromValues(1.0, 0.8, 0.0, 1.0);
var materialShininess = 60.0;

var ambientColor, diffuseColor, specularColor;
var modelViewMatrix, projectionMatrix;
var viewerPos;

var thetaLoc;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = 0;
var theta = [0, 0, 0];
var flag = true;

var currentKey = [];

function handleKeyDown(event) {
    var key = event.keyCode;
    currentKey[key] = true;
    switch (key) {
        case 65: // a // select x axis
            axis = xAxis;
            break;
        case 66: // b // select y axis
            axis = yAxis;
            break;
        case 67: // c // select z axis
            axis = zAxis;
            break;
        case 82: // r // toggle rotate
            flag = !flag;
        case 86: // v //increase divide
            numOfSubdivides++;
            console.log("numOfSubdivides is " + numOfSubdivides);
            if(numOfSubdivides == 9)
                numOfSubdivides = 9;
            index = 0;
            points = [];
            
            divideTetra(va, vb, vc, vd, numOfSubdivides);
            gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
            break;
        case 66: // b  //decrease divide
            console.log("numOfSubdivides is " + numOfSubdivides);
            if (numOfSubdivides)
                numOfSubdivides--;
            index = 0;
            points = [];
            
            divideTetra(va, vb, vc, vd, numOfSubdivides);
            gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
            break;
    }
    requestAnimFrame(render);
}

function handleKeyUp(event) {
    currentKey[event.keyCode] = false;
}

function makeColorCube() {
    var vertices = [
        vec4.fromValues(-0.5, -0.5, 0.5, 1.0),
        vec4.fromValues(-0.5, 0.5, 0.5, 1.0),
        vec4.fromValues(0.5, 0.5, 0.5, 1.0),
        vec4.fromValues(0.5, -0.5, 0.5, 1.0),
        vec4.fromValues(-0.5, -0.5, -0.5, 1.0),
        vec4.fromValues(-0.5, 0.5, -0.5, 1.0),
        vec4.fromValues(0.5, 0.5, -0.5, 1.0),
        vec4.fromValues(0.5, -0.5, -0.5, 1.0)
    ];

    var vertexColors = [
        vec4.fromValues(0.0, 0.0, 0.0, 1.0),
        vec4.fromValues(1.0, 0.0, 0.0, 1.0),
        vec4.fromValues(1.0, 1.0, 0.0, 1.0),
        vec4.fromValues(0.0, 1.0, 0.0, 1.0),
        vec4.fromValues(0.0, 0.0, 1.0, 1.0),
        vec4.fromValues(1.0, 0.0, 1.0, 1.0),
        vec4.fromValues(0.0, 1.0, 1.0, 1.0),
        vec4.fromValues(1.0, 1.0, 1.0, 1.0)
    ];

    var faces = [
        1, 0, 3, 1, 3, 2, //正
        2, 3, 7, 2, 7, 6, //右
        3, 0, 4, 3, 4, 7, //底
        6, 5, 1, 6, 1, 2, //顶
        4, 5, 6, 4, 6, 7, //背
        5, 4, 0, 5, 0, 1 //左
    ];

    for (var i = 0; i < faces.length; i += 3) {
        var v1 = vec4.create();
        var v2 = vec4.create();
        vec4.subtract(v1, vertices[faces[i + 1]], vertices[faces[i]]);
        vec4.subtract(v2, vertices[faces[i + 2]], vertices[faces[i + 1]]);
        var normal = vec3.create();
        vec3.cross(normal, vec3.fromValues(v1[0], v1[1], v1[2]), vec3.fromValues(v2[0], v2[1], v2[2]));
        vec3.normalize(normal, normal);

        points.push(vertices[faces[i]][0], vertices[faces[i]][1], vertices[faces[i]][2], vertices[faces[i]][3]);
        points.push(vertices[faces[i + 1]][0], vertices[faces[i + 1]][1], vertices[faces[i + 1]][2], vertices[faces[i + 1]][3]);
        points.push(vertices[faces[i + 2]][0], vertices[faces[i + 2]][1], vertices[faces[i + 2]][2], vertices[faces[i + 2]][3]);

        normals.push(normal[0], normal[1], normal[2]);
        normals.push(normal[0], normal[1], normal[2]);
        normals.push(normal[0], normal[1], normal[2]);
        //var id = Math.floor(i/6);
        //colors.push( vertexColors[id][0], vertexColors[id][1], vertexColors[id][2], vertexColors[id][3] );
    }
}

function triangle(a, b, c) {
    points.push(a[0], a[1], a[2], a[3]);
    points.push(b[0], b[1], b[2], b[3]);
    points.push(b[0], b[1], b[2], b[3]);
    points.push(c[0], c[1], c[2], c[3]);
    points.push(c[0], c[1], c[2], c[3]);
    points.push(a[0], a[1], a[2], a[3]);
    index += 6;
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

function initCube() {
    console.log("test");
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);


    // load shaders and initialize attribute buffers
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    //makeColorCube();
    divideTetra(va, vb, vc, vd, numOfSubdivides);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);

    viewerPos = vec3.fromValues(0.0, 0.0, -20.0);

    projectionMatrix = mat4.create();
    mat4.ortho(projectionMatrix, -1, 1, -1, 1, -100, 100);

    var ambientProduct = vec4.create();
    vec4.multiply(ambientProduct, lightAmbient, materialAmbient);
    var diffuseProduct = vec4.create();
    vec4.multiply(diffuseProduct, lightDiffuse, materialDiffuse);
    var specularProduct = vec4.create();
    vec4.multiply(specularProduct, lightSpecular, materialSpecular);

    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), new Float32Array(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), new Float32Array(diffuseProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), new Float32Array(specularProduct));

    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), new Float32Array(lightPosition));

    gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess);

    gl.uniformMatrix4fv(gl.getUniformLocation(program, "projectionMatrix"), false, new Float32Array(projectionMatrix));

    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;

    document.getElementById("ButtonX").onclick = function(){axis = xAxis;};
    document.getElementById("ButtonY").onclick = function(){axis = yAxis;};
    document.getElementById("ButtonZ").onclick = function(){axis = zAxis;};
    document.getElementById("ButtonT").onclick = function(){flag = !flag;};

    render();
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (flag)
        theta[axis] += 0.20;

    modelViewMatrix = mat4.create();
    mat4.rotateZ(modelViewMatrix, modelViewMatrix, theta[zAxis]*Math.PI/180.0);
    mat4.rotateY(modelViewMatrix, modelViewMatrix, theta[yAxis]*Math.PI/180.0);
    mat4.rotateX(modelViewMatrix, modelViewMatrix, theta[xAxis]*Math.PI/180.0);

    gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelViewMatrix"), false, new Float32Array(modelViewMatrix));

    gl.drawArrays(gl.LINES, 0, points.length / 4);

    requestAnimFrame(render);
}

window.onload = function main() {
    initCube();
}