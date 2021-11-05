//kong 2021_11_03
//rev 2021_11_05
//Learning and Sharing Thechnology

"use strict";
const {
    vec2,
    vec3,
    vec4
} = glMatrix;

var canvas;
var gl;
var cBuffer,vBuffer;

//
var numVertices = 0;
//var index_c = 0;
//cube
var cubeStart = new Array();
var offsetCube = new Array();
var scaleCube = new Array();
var thetaCube = new Array();
//triangle
var numsTriangle = new Array();
var offsetTriangle = new Array();
var scaleTriangle = new Array();
var thetaTriangle = new Array();
var flagTriangle = new Array();
//scaleTriangle.push(vec3.fromValues(0.2, 0.2, 0.2));
var scale_t = 0.55;
//var triangle_p = [];
//var triangle_c = [];

//rectangle
var numsRectangle = new Array();
var offsetRectangle = new Array();
var scaleRectangle = new Array();
var thetaRectangle = new Array();
var scale_rect = 0.2;
var speed = 0.05;

//circle
var numsCircle = new Array();
var offsetCircle = new Array();
var scaleCircle = new Array();
var thetaCircle = new Array();
var cntCircle = new Array();
var speedOffset = new Array();
var flagX = new Array();
var flagY = new Array();
var speed_circle = 0.01;
var edge = 180;


var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
//
var theta = [0,0,0];
var thetaLoc;
var offset = [0,0,0];
var offsetLoc;
var scale = [1,1,1];
var scaleLoc;

//category
var category = 0;
var categoryLoc;

//offset position
var pos = [0,0,0];

//
var NUMVERTICES = 1000000;

//
var colors = vec4.fromValues(0.0, 0.5, 1.0, 1.0);

//--------------------------inin start---------------------
window.onload = function init() {
    canvas = document.getElementById("rtcb-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    //
    //makeCube();
    //makeTriangle();

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    // load shaders and initialize attribute buffer
    var program = initShaders(gl, "rtvshader", "rtfshader");
    gl.useProgram(program);
    //two
    // var program1 = initShaders(gl, "rtvshader", "rtfshader");
    // gl.useProgram(program1);

    //color
    cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, NUMVERTICES, gl.STATIC_DRAW);
    //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangle_c), gl.STATIC_DRAW);
    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    //vertices
    vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, NUMVERTICES, gl.STATIC_DRAW);
    //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangle_p), gl.STATIC_DRAW);

    //Location a_Position
    var a_Position = gl.getAttribLocation(program, "a_Position");
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    //
    thetaLoc = gl.getUniformLocation(program, "theta");
    gl.uniform3fv(thetaLoc, theta);
    offsetLoc = gl.getUniformLocation(program, "offset");
    gl.uniform3fv(offsetLoc, offset);
    scaleLoc = gl.getUniformLocation(program, "scale");
    gl.uniform3fv(scaleLoc, scale);

    //add event
    addEvent();

    render();
}
//--------------------------init end------------------------

//------------------------add event start-------------------
function addEvent() {
    document.getElementById("xbutton").onclick = function () {
        axis = xAxis;
    }
    document.getElementById("ybutton").onclick = function () {
        axis = yAxis;
    }
    document.getElementById("zbutton").onclick = function () {
        axis = zAxis;
    }  

    document.getElementById("cube").onclick = function () {
        category = 1;
    }
    document.getElementById("triangle").onclick = function () {
        category = 2;
    }
    document.getElementById("rectangle").onclick = function () {
        category = 3;
    }
    document.getElementById("circle").onclick = function () {
        category = 4;
    }

    //
    canvas.addEventListener("click", function(event){
        var brect = canvas.getBoundingClientRect();
        var cX = event.clientX - brect.left;
        var cY = event.clientY - brect.top;
        pos = vec3.fromValues(2 * cX / canvas.width - 1, 1 - 2 * cY / canvas.height, 0.0);  //vec3 -> 3 float is a overall!!!
        // pos[0] = 2 * cX / canvas.width - 1;
        // pos[1] = 1 - 2 * cY / canvas.height;
        // pos[2] = 0.0;

        console.log("pos is "+pos);
        offset = pos;
        //console.log("points is "+points.length);
        // console.log("offset is "+offset);
        // //scale = [0.1,0.1,0.1];
        // //console.log("scale is "+scale);
        // var c = [Math.random(), Math.random(), Math.random(), 1];
        // triangle_c = c;
        // console.log("colors is "+triangle_c);

        //
        switch(category){
            case 0:

                break;
            case 1:
                setCube(pos);
                break;
            case 2:
                setTriangle(pos);
                break;
            case 3:
                setRectangle(pos);
                break;
            case 4:
                setCircle(pos);
                break;
        }


    });

    document.getElementById("_scale").onclick = function (event) {
        //scaleTriangle.push(vec3.fromValues(event.target.value,event.target.value,event.target.value));
        //offset[0] = event.target.value;
        scale_t = event.target.value;
    }

    document.getElementById("_color").onclick = function(event) {
        var color = event.target.value;
        var R = parseInt(color[1], 16) * 16 + parseInt(color[2], 16);
        var G = parseInt(color[3], 16) * 16 + parseInt(color[4], 16);
        var B = parseInt(color[5], 16) * 16 + parseInt(color[6], 16);
        R /= 255.0;
        G /= 255.0;
        B /= 255.0;
        colors = vec4.fromValues(R, G, B, 1.0);
    }

    document.getElementById("scale_r").onchange = function (event) {
        scale_rect = event.target.value;
    }
    document.getElementById("speed").onchange = function (event) {
        speed = event.target.value/10;
    }
    document.getElementById("speed_circle").onchange = function (event) {
        speed_circle = event.target.value/10;
    }
    document.getElementById("edge").onchange = function (event) {
        edge = event.target.value;
    }
    document.getElementById("clear").onclick = function(){ clear() }
}
//----------------------------add event end----------------------------

function makeCube(position) {
    cubeStart.push(numVertices);
    var vertices = [
        glMatrix.vec3.fromValues(-0.5, -0.5, 0.5),
        glMatrix.vec3.fromValues(-0.5, 0.5, 0.5),
        glMatrix.vec3.fromValues(0.5, 0.5, 0.5),
        glMatrix.vec3.fromValues(0.5, -0.5, 0.5),
        glMatrix.vec3.fromValues(-0.5, -0.5, -0.5),
        glMatrix.vec3.fromValues(-0.5, 0.5, -0.5),
        glMatrix.vec3.fromValues(0.5, 0.5, -0.5),
        glMatrix.vec3.fromValues(0.5, -0.5, -0.5),
    ];

    var vertexColors = [
        glMatrix.vec4.fromValues(0.0, 0.0, 0.0, 1.0),
        glMatrix.vec4.fromValues(1.0, 0.0, 0.0, 1.0),
        glMatrix.vec4.fromValues(1.0, 1.0, 0.0, 1.0),
        glMatrix.vec4.fromValues(0.0, 1.0, 0.0, 1.0),
        glMatrix.vec4.fromValues(0.0, 0.0, 1.0, 1.0),
        glMatrix.vec4.fromValues(1.0, 0.0, 1.0, 1.0),
        glMatrix.vec4.fromValues(0.0, 1.0, 1.0, 1.0),
        glMatrix.vec4.fromValues(1.0, 1.0, 1.0, 1.0)
    ];

    var faces = [
        1, 0, 3, 2, //正
        2, 3, 7, 6, //右
        3, 0, 4, 7, //底
        6, 5, 1, 2, //顶
        4, 5, 6, 7, //背
        5, 4, 0, 1  //左
    ];
    
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    for (var i = 0; i < faces.length; i++) {
        //points.push(vertices[faces[i]][0], vertices[faces[i]][1], vertices[faces[i]][2]);
        gl.bufferSubData(gl.ARRAY_BUFFER, (numVertices+i)*12, new Float32Array(vertices[faces[i]]));
        //colors.push(vertexColors[Math.floor(i / 6)][0], vertexColors[Math.floor(i / 6)][1], vertexColors[Math.floor(i / 6)][2], vertexColors[Math.floor(i / 6)][3]);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    for(var i=0; i<faces.length; i++) {
        gl.bufferSubData(gl.ARRAY_BUFFER, (numVertices+i)*16, new Float32Array(vertexColors[faces[i]]) );
    }
    numVertices += 24;
}

function makeTriangle() { 
    numsTriangle.push(numVertices);
    var vertices = [
        vec3.fromValues(-0.8, -0.5,  0.0),
        vec3.fromValues(0.0, 1.0,  0.0),
        vec3.fromValues(0.8, -0.5, 0.0),
    ];

    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    for(var i=0; i<vertices.length; i++){
        gl.bufferSubData(gl.ARRAY_BUFFER, (numVertices+i)*12, new Float32Array(vertices[i]) );
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    for(var i=0; i<vertices.length; i++){
        gl.bufferSubData(gl.ARRAY_BUFFER, (numVertices+i)*16, new Float32Array(colors) );
    }
    numVertices += 3;
}

function makeRectangle() {
    numsRectangle.push(numVertices);
    var vertices = [
        vec3.fromValues(0.0, 1.0,  0.0),
        vec3.fromValues(-1.0, 0.0,  0.0),
        vec3.fromValues(1.0, 0.0, 0.0),
        vec3.fromValues(0.0, -1.0, 0.0),
    ];

    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    for(var i=0; i<vertices.length; i++){
        gl.bufferSubData(gl.ARRAY_BUFFER, (numVertices+i)*12, new Float32Array(vertices[i]) );
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    for(var i=0; i<vertices.length; i++){
        gl.bufferSubData(gl.ARRAY_BUFFER, (numVertices+i)*16, new Float32Array(colors) );
    }
    numVertices += 4;
}



//set cube
var cubeCount = 0;
function setCube(position) {
    makeCube(position);
    var scaleC = [0.2, 0.2, 0.2];
    scaleCube.push(scaleC);
    offsetCube.push(position);
    thetaCube.push(vec3.fromValues(1.0, 1.0, 0.0));
    console.log("position is "+position);
    //offset[offset.length] = position;
    // console.log("cubeCount is "+cubeCount);
    // console.log("cubeStart is "+cubeStart+", len is "+cubeStart.length);
    // console.log("offsetCube is "+offsetCube+", len is "+offsetCube.length);
    // console.log("offsetCube[0] is "+offsetCube[0]);
    // console.log("scaleCube[0] is "+scaleCube[0]);
    //for(int i=0; i<cubeStart.length; i++)
    // console.log("offsetCube[0] is "+offsetCube[0]);
    // console.log("offsetCube[1] is "+offsetCube[1+3]);
    // console.log("offsetCube[2] is "+offsetCube[2+3]);
    // console.log("cubeStart[0] is "+cubeStart[0]);
    //offset = position;

}
//set triangle
function setTriangle(position) {
    
    offsetTriangle.push(position);
    console.log("scale_t is "+scale_t);
    scaleTriangle.push(vec3.fromValues(scale_t*1.0, scale_t*1.0, 1.0));
    flagTriangle.push(1);
    thetaTriangle.push(vec3.fromValues(0.0, 0.0, 0.0));
    makeTriangle();
    //scale = [0.2,0.2,0.2];
}

function setRectangle(position) {
    makeRectangle();
    offsetRectangle.push(position);
    scaleRectangle.push(vec3.fromValues(0.2, 0.2, 1.0));
    thetaRectangle.push(vec3.fromValues(0.0, 0.0, 0.0));
    console.log(thetaRectangle);
    console.log(offsetRectangle);
    console.log(scaleRectangle);
}

function setCircle(position) {
    var angle = Math.random()*360 * Math.PI /180.0;
    numsCircle.push(numVertices);
    offsetCircle.push(position);
    scaleCircle.push(vec3.fromValues(0.2, 0.2, 1.0));
    thetaCircle.push(vec3.fromValues(0.0, 0.0, 0.0));
    speedOffset.push(vec3.fromValues( Math.cos(angle), Math.sin(angle), 0) );
    flagX.push(1);
    flagY.push(1);
    var cnt = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    var e = 360/edge;
    var pi = Math.PI;
    for(var i=0; i<=360; i += e){
        var beta = i*pi/180;
        var tmp = vec3.fromValues(Math.cos(beta), Math.sin(beta), 0.0);
        gl.bufferSubData(gl.ARRAY_BUFFER, (numVertices+cnt)*12, new Float32Array(tmp));
        cnt++;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    for(var i=0; i<cnt; i++){
        gl.bufferSubData(gl.ARRAY_BUFFER, (numVertices+i)*16, new Float32Array(colors));
    }
    cntCircle.push(cnt);
    numVertices += cnt;

    console.log("cnt is "+cnt);
    console.log(offsetCircle);
    console.log(scaleCircle);
    console.log(speedOffset);
    console.log("flagx is "+flagX);
    console.log("flagY is "+flagY);

}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //theta[axis] += 0.05;
    //
    //console.log("category2 is "+category);
    

    //translation effect all
    //gl.uniform3fv(thetaLoc, theta);
    //gl.uniform3fv(offsetLoc, offset);
    //console.log("offsetLoc is "+offsetLoc);
   // gl.uniform3fv(scaleLoc, scale);

    //cube
    for(var i=0; i<cubeStart.length; i++){
        thetaCube[i][axis] += 0.05;
        gl.uniform3fv(offsetLoc, offsetCube[i]);
        //console.log(offsetCube[i]);
        gl.uniform3fv(scaleLoc, scaleCube[i]);
        gl.uniform3fv(thetaLoc, thetaCube[i]);
        for(var j=cubeStart[i]; j<24+cubeStart[i]; j+=4 )
            gl.drawArrays(gl.TRIANGLE_FAN, j, 4); //only triangle not cube!!
        
        //gl.uniform3fv(offsetLoc, offset);
    } 

    //Triangle
    for(var i=0; i<numsTriangle.length; i++){
        scaleTriangle[i][0] += flagTriangle[i] * 0.003;
        scaleTriangle[i][1] += flagTriangle[i] * 0.003;

        if (scaleTriangle[i][0] > 1.3 * scale_t) {
            scaleTriangle[i][0] = 1.3 * scale_t;
            scaleTriangle[i][1] = 1.3 * scale_t;
            flagTriangle[i] *= -1;
        } else if (scaleTriangle[i][0] < 0.6 * scale_t) {
            scaleTriangle[i][0] = 0.6 * scale_t;
            scaleTriangle[i][1] = 0.6 * scale_t;
            flagTriangle[i] *= -1;
        }
        // scaleTriangle[i][0] += scaleTriangle[i][0]*0.01;
        // scaleTriangle[i][1] += scaleTriangle[i][1]*0.01;
        // if(scaleTriangle[i][0] > 0.8) {
        //     scaleTriangle[i][0] = 0.8;
        //     scaleTriangle[i][1] = 0.8;
        //     scaleTriangle *= -1;
        // }else if(scaleTriangle[i][0]<0.2) {
        //     scaleTriangle[i][0] = 0.2;
        //     scaleTriangle[i][0] = 0.2;
        //     scaleTriangle *= -1;
        // }
        gl.uniform3fv(thetaLoc, thetaTriangle[i]);
        gl.uniform3fv(offsetLoc, offsetTriangle[i]);
        gl.uniform3fv(scaleLoc, scaleTriangle[i]);
        //for(var j=numsTriangle[i]; j<numsTriangle[i]+3; j += 3 )
        gl.drawArrays(gl.TRIANGLES, numsTriangle[i], 3);
    }

    //rectangle
    for(var i=0; i<numsRectangle.length; i++){
        thetaRectangle[i][2] += speed;
        scaleRectangle[i][0] = scale_rect;
        scaleRectangle[i][1] = scale_rect;

        gl.uniform3fv(thetaLoc, thetaRectangle[i]);
        gl.uniform3fv(offsetLoc, offsetRectangle[i]);
        gl.uniform3fv(scaleLoc, scaleRectangle[i]);
        gl.drawArrays(gl.TRIANGLE_STRIP, numsRectangle[i], 4);
    }

    //circle
    for(var i=0; i<numsCircle.length; i++){
        offsetCircle[i][0] += flagX[i]*speedOffset[i][0]*speed_circle;
        offsetCircle[i][1] += flagY[i]*speedOffset[i][1]*speed_circle;
        if(offsetCircle[i][0]>1 || offsetCircle[i][0]<-1)
            flagX[i] *= -1;
        if(offsetCircle[i][1]>1 || offsetCircle[i][1]<-1)
            flagY[i] *= -1;
        gl.uniform3fv(scaleLoc, scaleCircle[i]);
        gl.uniform3fv(offsetLoc, offsetCircle[i]);
        gl.uniform3fv(thetaLoc, thetaCircle[i]);
        gl.drawArrays(gl.TRIANGLE_FAN, numsCircle[i], cntCircle[i]);
    }


    //triangle
    //gl.drawArrays(gl.TRIANGLES, 0, triangle_p);
    //console.log(triangle_p);
    requestAnimFrame(render);
}

function clear() {
    numVertices = 0;
    
    cubeStart = new Array();
    offsetCube = new Array();
    scaleCube = new Array();
    thetaCube = new Array();
   
    numsTriangle = new Array();
    offsetTriangle = new Array();
    scaleTriangle = new Array();
    thetaTriangle = new Array();
    flagTriangle = new Array();
    scale_t = 0.55;
    
    numsRectangle = new Array();
    offsetRectangle = new Array();
    scaleRectangle = new Array();
    thetaRectangle = new Array();
    scale_rect = 0.2;
    speed = 0.05;

    //circle
    numsCircle = new Array();
    offsetCircle = new Array();
    scaleCircle = new Array();
    thetaCircle = new Array();
    cntCircle = new Array();
    speedOffset = new Array();
    flagX = new Array();
    flagY = new Array();
    speed_circle = 0.01;
    edge = 180;


    xAxis = 0;
    yAxis = 1;
    zAxis = 2;

    axis = 0;
    //
    theta = [0,0,0];
    thetaLoc;
    offset = [0,0,0];
    offsetLoc;
    scale = [1,1,1];
    scaleLoc;

    //category
    category = 0;
    categoryLoc;

    //offset position
    pos = [0,0,0];


    colors = vec4.fromValues(0.0, 0.5, 1.0, 1.0);
}