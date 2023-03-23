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
// mat4.identity(worldMatrix);
// mat4.lookAt(viewMatrix, [0, 0, -8], [0, 0, 0], [0, 1, 0]);
// mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);

// worldMatrix = new Matrix([ //GANTI PAKE MATIX TRANSFORMASI KOORDINAT DUNIA KE KOORDINAT KAMERA (BIASANYA MATRIKS IDENTITAS). GESER KAMERA DISINI
// 1/2,0,0,0,
// 0,1/2,0,0,
// 0,0,1/2,0,
// 0,0,0,1])
worldMatrix = new Matrix([1,0,0,0,
	0,1,0,0,
	0,0,1,0,
	0,0,0,1])
// viewMatrix = [ //GANTI PAKE MATRIX TRANSFORMASINYA, PUTER, GESER OBJEK dll
// 0.7,0,-0.7,0,
// 0,1,0,0,
// 0.7,0,0.7,0,
// 0,0,0,1]
viewMatrix = [1,0,0,0,
0,1,0,0,
0,0,1,0,
0,0,0,1]
projMatrix = worldMatrix.getProjectionMatrix("Orthographic");

gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix.m);
gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

//
// Main render loop
//
render();


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
	render();
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
	render();
	initialScaleX = x;
	initialScaleY = y;
	initialScaleZ = z;
}

const rotateX = (event) => {
	let angle = event.target.value - initialRotateX;
	worldMatrix.rotateX(angle * Math.PI);
	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix.m);
	render();
	initialRotateX = event.target.value;
}

const rotateY = (event) => {
	let angle = event.target.value - initialRotateY;
	worldMatrix.rotateY(angle * Math.PI);
	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix.m);
	render();
	initialRotateY = event.target.value;
}

const rotateZ = (event) => {
	let angle = event.target.value - initialRotateZ;
	worldMatrix.rotateZ(angle * Math.PI);
	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix.m);
	render();
	initialRotateZ = event.target.value;
}

const projection = (event) => {
	let type = event.target.value;
	projMatrix = worldMatrix.getProjectionMatrix(type);
	gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);
	render();
}

const load = (event) => {
	const file = document.getElementById('file').files[0];
	if (file == undefined){
		alert("No file selected");
		return;
	}

	const reader = new FileReader();
	reader.readAsText(file, "UTF-8");
	reader.onload = (event) => {
		// Parse JSON
		const model = JSON.parse(event.target.result);

		// Get HTML elements
		document.getElementById("translateX").value = model.state.translation[0];
		document.getElementById("translateY").value = model.state.translation[1];
		document.getElementById("translateZ").value = model.state.translation[2];
		document.getElementById("scaleX").value = model.state.scale[0];
		document.getElementById("scaleY").value = model.state.scale[1];
		document.getElementById("scaleZ").value = model.state.scale[2];
		document.getElementById("rotationX").value = model.state.rotation[0];
		document.getElementById("rotationY").value = model.state.rotation[1];
		document.getElementById("rotationZ").value = model.state.rotation[2];

		// Set initial values
		initialX = model.state.translation[0];
		initialY = model.state.translation[1];
		initialZ = model.state.translation[2];
		initialScaleX = model.state.scale[0];
		initialScaleY = model.state.scale[1];
		initialScaleZ = model.state.scale[2];
		initialRotateX = model.state.rotation[0];
		initialRotateY = model.state.rotation[1];
		initialRotateZ = model.state.rotation[2];

		// Set projection
		projMatrix = worldMatrix.getProjectionMatrix(model.state.projection);
		gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

		// Set world matrix
		worldMatrix.m = model.state.worldMatrix;
		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix.m);

		// Set view matrix
		viewMatrix = model.state.viewMatrix;
		gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);

		// Set model

		vertices = model.vertices;
		indices = model.indices;
		colors = model.colors;
		render();
	}
}

const save = (event) => {
	
	// Get File Name
	let filename = document.getElementById("saveFileName").value;
	if (!filename){
		alert("Please enter a file name");
		return;
	}

	const model = {
		vertices: vertices,
		indices: indices,
		colors: colors,
		state: {
			translation: [initialX, initialY, initialZ],
			scale: [initialScaleX, initialScaleY, initialScaleZ],
			rotation: [initialRotateX, initialRotateY, initialRotateZ],
			worldMatrix: worldMatrix.m,
			viewMatrix: viewMatrix,
			projection: document.getElementById("projection").value
		}
	}

	let a = document.createElement("a");
	let file = new Blob([JSON.stringify(model)], {type: "text/plain"});
	a.href = URL.createObjectURL(file);
	a.download = filename + ".json";
	a.click();

	document.getElementById("saveFileName").value = "";

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
document.getElementById("load").addEventListener("click", load);
document.getElementById("save").addEventListener("click", save);