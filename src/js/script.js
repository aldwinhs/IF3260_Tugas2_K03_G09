// import {Matrix} from "./Matrix.js"

var vertexShaderText = 
[
'precision mediump float;',
'',
'attribute vec3 vertPosition;',
'attribute vec3 vertColor;',
'varying vec3 fragColor;',
'uniform mat4 mWorld;',
'uniform mat4 mView;',
'uniform mat4 mProj;',
'',
'void main()',
'{',
'  fragColor = vertColor;',
'  gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',
'}'
].join('\n');

var fragmentShaderText =
[
'precision mediump float;',
'',
'varying vec3 fragColor;',
'void main()',
'{',
'  gl_FragColor = vec4(fragColor, 1.0);',
'}'
].join('\n');

console.log('This is working');

var canvas = document.getElementById('canvas');
var gl = canvas.getContext('webgl');

if (!gl) {
	console.log('WebGL not supported, falling back on experimental-webgl');
	gl = canvas.getContext('experimental-webgl');
}

if (!gl) {
	alert('Your browser does not support WebGL');
}

gl.clearColor(0.75, 0.85, 0.8, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
gl.enable(gl.DEPTH_TEST);
// gl.enable(gl.CULL_FACE);
// gl.frontFace(gl.CCW);
// gl.cullFace(gl.BACK);

//
// Create shaders
// 
var vertexShader = gl.createShader(gl.VERTEX_SHADER);
var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

gl.shaderSource(vertexShader, vertexShaderText);
gl.shaderSource(fragmentShader, fragmentShaderText);

gl.compileShader(vertexShader);
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
	console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
}

gl.compileShader(fragmentShader);
if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
	console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
}

var program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
	console.error('ERROR linking program!', gl.getProgramInfoLog(program));
}
gl.validateProgram(program);
if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
	console.error('ERROR validating program!', gl.getProgramInfoLog(program));
}

//
// Create buffer
//
var vertices = [
];

var colors = [
];

var indices = [
];

// Tell OpenGL state machine which program should be active.
gl.useProgram(program);

var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

var worldMatrix = new Float32Array(16);
var viewMatrix = new Float32Array(16);
var projMatrix = new Float32Array(16);
worldMatrix = new Matrix([1,0,0,0,
	0,1,0,0,
	0,0,1,0,
	0,0,0,1])
viewMatrix = new ViewMatrix([1,0,0,0,
	0,1,0,0,
	0,0,1,0,
	0,0,0,1])
projMatrix = worldMatrix.getProjectionMatrix("Orthographic");

gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix.m);
gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix.m);
gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

//
// Main render loop
//
render();


// Variables
let rotating = false;
let initialX = 0;
let initialY = 0;
let initialZ = 0;
let initialScaleX = 1;
let initialScaleY = 1;
let initialScaleZ = 1;
let initialRotateX = 0;
let initialRotateY = 0;
let initialRotateZ = 0;
let initialZoom = 1;
let initialRotateC = 0;

function render() {
	// Vertex Buffer
	const vertex_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	const position = gl.getAttribLocation(program, `vertPosition`);
	gl.enableVertexAttribArray(position);
	gl.vertexAttribPointer(
		position, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);
 
	// Color Buffer
	const color_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	const color = gl.getAttribLocation(program, `vertColor`);
	gl.enableVertexAttribArray(color);
	gl.vertexAttribPointer(
		color, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);
 
	// Index Buffer
	const index_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
 
	// Draw
	gl.clearColor(0.75, 0.85, 0.8, 1.0);
	gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
	gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
 }

// Listener
document.getElementById("help").addEventListener("click", showHelp);
document.getElementById("close").addEventListener("click", closeHelp);
document.getElementById("reset").addEventListener("click", reset);
document.getElementById("rotating-model").addEventListener("change", rotatingModel);
document.getElementById("translateX").addEventListener("input", translate);
document.getElementById("translateY").addEventListener("input", translate);
document.getElementById("translateZ").addEventListener("input", translate);
document.getElementById("scaleX").addEventListener("input", scale);
document.getElementById("scaleY").addEventListener("input", scale);
document.getElementById("scaleZ").addEventListener("input", scale);
document.getElementById("rotationX").addEventListener("input", rotateX);
document.getElementById("rotationY").addEventListener("input", rotateY);
document.getElementById("rotationZ").addEventListener("input", rotateZ);
document.getElementById("projection").addEventListener("input", projection);
document.getElementById("load").addEventListener("click", load);
document.getElementById("save").addEventListener("click", save);
document.getElementById("cameraRadius").addEventListener("input", radiusC);
document.getElementById("cameraRotate").addEventListener("input", rotateC);