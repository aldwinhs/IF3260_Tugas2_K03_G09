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
gl.enable(gl.CULL_FACE);
gl.frontFace(gl.CCW);
gl.cullFace(gl.BACK);

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
var boxVertices = //GANTI PAKE KOORDINAT OBJEKNYA
[ // X, Y, Z           R, G, B
	// Top
	-1.0, 1.0, -1.0,   0.5, 0.5, 0.5,
	-1.0, 1.0, 1.0,    0.5, 0.5, 0.5,
	1.0, 1.0, 1.0,     0.5, 0.5, 0.5,
	1.0, 1.0, -1.0,    0.5, 0.5, 0.5,

	// Left
	-1.0, 1.0, 1.0,    0.75, 0.25, 0.5,
	-1.0, -1.0, 1.0,   0.75, 0.25, 0.5,
	-1.0, -1.0, -1.0,  0.75, 0.25, 0.5,
	-1.0, 1.0, -1.0,   0.75, 0.25, 0.5,

	// Right
	1.0, 1.0, 1.0,    0.25, 0.25, 0.75,
	1.0, -1.0, 1.0,   0.25, 0.25, 0.75,
	1.0, -1.0, -1.0,  0.25, 0.25, 0.75,
	1.0, 1.0, -1.0,   0.25, 0.25, 0.75,

	// Front
	1.0, 1.0, 1.0,    1.0, 0.0, 0.15,
	1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
	-1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
	-1.0, 1.0, 1.0,    1.0, 0.0, 0.15,

	// Back
	1.0, 1.0, -1.0,    0.0, 1.0, 0.15,
	1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
	-1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
	-1.0, 1.0, -1.0,    0.0, 1.0, 0.15,

	// Bottom
	-1.0, -1.0, -1.0,   0.5, 0.5, 1.0,
	-1.0, -1.0, 1.0,    0.5, 0.5, 1.0,
	1.0, -1.0, 1.0,     0.5, 0.5, 1.0,
	1.0, -1.0, -1.0,    0.5, 0.5, 1.0,
];

var boxIndices = //GANTI PAKE INDEXNYA
[
	// Top
	0, 1, 2,
	0, 2, 3,

	// Left
	5, 4, 6,
	6, 4, 7,

	// Right
	8, 9, 10,
	8, 10, 11,

	// Front
	13, 12, 14,
	15, 14, 12,

	// Back
	16, 17, 18,
	16, 18, 19,

	// Bottom
	21, 20, 22,
	22, 20, 23
];

var boxVertexBufferObject = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

var boxIndexBufferObject = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
gl.vertexAttribPointer(
	positionAttribLocation, // Attribute location
	3, // Number of elements per attribute
	gl.FLOAT, // Type of elements
	gl.FALSE,
	6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
	0 // Offset from the beginning of a single vertex to this attribute
);
gl.vertexAttribPointer(
	colorAttribLocation, // Attribute location
	3, // Number of elements per attribute
	gl.FLOAT, // Type of elements
	gl.FALSE,
	6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
	3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
);

gl.enableVertexAttribArray(positionAttribLocation);
gl.enableVertexAttribArray(colorAttribLocation);

// Tell OpenGL state machine which program should be active.
gl.useProgram(program);

var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

var worldMatrix = new Float32Array(16);
var viewMatrix = new Float32Array(16);
// var projMatrix = new Float32Array(16);
// mat4.identity(worldMatrix);
// mat4.lookAt(viewMatrix, [0, 0, -8], [0, 0, 0], [0, 1, 0]);
// mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);

worldMatrix = new Matrix([ //GANTI PAKE MATIX TRANSFORMASI KOORDINAT DUNIA KE KOORDINAT KAMERA (BIASANYA MATRIKS IDENTITAS). GESER KAMERA DISINI
1/2,0,0,0,
0,1/2,0,0,
0,0,1/2,0,
0,0,0,1])
viewMatrix = [ //GANTI PAKE MATRIX TRANSFORMASINYA, PUTER, GESER OBJEK dll
0.7,0,-0.7,0,
0,1,0,0,
0.7,0,0.7,0,
0,0,0,1]
projMatrix = worldMatrix.getProjectionMatrix("Perspective");
// projMatrix = [ //GANTI PAKE MATRIX PROYEKSINYA
// 1,0,0,0,
// 0,1,0,0,
// 0,0,0,0,
// 0,0,0,1]
console.log(projMatrix);


gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix.m);
gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

//
// Main render loop
//
// var identityMatrix = new Matrix();
// mat4.identity(identityMatrix);

gl.clearColor(0.75, 0.85, 0.8, 1.0);
gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);


// Variables
let initialX = 0;
let initialY = 0;
let initialZ = 0;
let initialScaleX = 1;
let initialScaleY = 1;
let initialScaleZ = 1;
let initialRotateX = 0;
let initialRotateY = 0;
let initialRotateZ = 0;

const showHelp = (event) => {
	document.getElementById("modal").style.display = "block";
}

const closeHelp = (event) => {
	document.getElementById("modal").style.display = "none";
}

const translate = () => {
	let x = document.getElementById("translateX").value;
	let y = document.getElementById("translateY").value;
	let z = document.getElementById("translateZ").value;
	worldMatrix.translate(x - initialX, y - initialY, z - initialZ);
	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix.m);
	gl.clearColor(0.75, 0.85, 0.8, 1.0);
	gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
	gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);
	initialX = x;
	initialY = y;
	initialZ = z;
}

const scale = () => {
	let x = document.getElementById("scaleX").value;
	let y = document.getElementById("scaleY").value;
	let z = document.getElementById("scaleZ").value;
	worldMatrix.scale(x/initialScaleX, y/initialScaleY, z/initialScaleZ);
	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix.m);
	gl.clearColor(0.75, 0.85, 0.8, 1.0);
	gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
	gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);
	initialScaleX = x;
	initialScaleY = y;
	initialScaleZ = z;
}

const rotateX = (event) => {
	let angle = event.target.value - initialRotateX;
	worldMatrix.rotateX(angle * Math.PI);
	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix.m);
	gl.clearColor(0.75, 0.85, 0.8, 1.0);
	gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
	gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);
	initialRotateX = event.target.value;
}

const rotateY = (event) => {
	let angle = event.target.value - initialRotateY;
	worldMatrix.rotateY(angle * Math.PI);
	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix.m);
	gl.clearColor(0.75, 0.85, 0.8, 1.0);
	gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
	gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);
	initialRotateY = event.target.value;
}

const rotateZ = (event) => {
	let angle = event.target.value - initialRotateZ;
	worldMatrix.rotateZ(angle * Math.PI);
	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix.m);
	gl.clearColor(0.75, 0.85, 0.8, 1.0);
	gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
	gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);
	initialRotateZ = event.target.value;
}

const projection = (event) => {
	let type = event.target.value;
	projMatrix = worldMatrix.getProjectionMatrix(type);
	console.log(projMatrix);
	gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);
	gl.clearColor(0.75, 0.85, 0.8, 1.0);
	gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
	gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);
}

// Listener
document.getElementById("help").addEventListener("click", showHelp);
document.getElementById("close").addEventListener("click", closeHelp);
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