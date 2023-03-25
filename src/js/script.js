// import {Matrix} from "./Matrix.js"

// Variables
let initialModel = 0;
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
let initialZoom = 60;
let initialRotateC = 0;
let initialProject = "Orthographic";
var initialModelProject = [];

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

var initialVertices = [];

var vertices = [];

var loadedModels = [];

var colors = [];

var indices = [];

// Tell OpenGL state machine which program should be active.
gl.useProgram(program);

var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');
var uNormalMatrix = gl.getUniformLocation(program, "uNormalMatrix");
var shaderUniformLocation = gl.getUniformLocation(program, 'shader');

var projMatrix = new Float32Array(16);
worldMatrix = new Matrix([1,0,0,0,
	0,1,0,0,
	0,0,1,0,
	0,0,0,1])
viewMatrix = new ViewMatrix([1,0,0,0,
	0,1,0,0,
	0,0,1,0,
	0,0,0,1])
var x = -Math.sin(initialRotateC * Math.PI/180) * 0.1;
var z = -Math.cos(initialRotateC * Math.PI/180) * 0.1;
viewMatrix.lookAt(
	[x,0,z],
	[0,0,0],
	[0,1,0]
)
projMatrix = worldMatrix.getProjectionMatrix("Orthographic");

gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix.m);
gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix.m);
gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);
gl.uniformMatrix4fv(uNormalMatrix,gl.FALSE, viewMatrix.m)
gl.uniform1f(shaderUniformLocation, 0.0);

//
// Main render loop
//
render();

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

	const normalBuffer = gl.createBuffer();
	const vertexNormals = calculateNormal(vertices,indices)
  	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertexNormals),gl.STATIC_DRAW)
	const vertexNormal = gl.getAttribLocation(program, "vertNormal")
	gl.enableVertexAttribArray(vertexNormal)
	gl.vertexAttribPointer(
    vertexNormal,
    3,
    gl.FLOAT,
    gl.FALSE,
    0,
    0
  )


 }

// get center of object
function getCenter(vertices) {
	let x = 0;
	let y = 0;
	let z = 0;
	for (let i = 0; i < vertices.length; i += 3) {
		x += vertices[i];
		y += vertices[i + 1];
		z += vertices[i + 2];
	}
	x /= vertices.length / 3;
	y /= vertices.length / 3;
	z /= vertices.length / 3;
	return [x, y, z];
}

function calculateNormal(v,i){
	const n_i = i.length / 3 //x,y,z
	const n_v = v.length / 3 //three point for each face
	var normal = []
	for(var k=0;k<n_v;k++){
		for(var j=0;j<n_i;j++){
			if((k==i[j*3]) || (k==i[j*3+1]) || (k==i[j*3+2])){
				// console.log(k,i[j*3],i[j*3+1],i[j*3+2])
				var v1 = [v[i[j*3]*3],v[i[j*3]*3+1],v[i[j*3]*3+2]]
				var v2 = [v[i[j*3+1]*3],v[i[j*3+1]*3+1],v[i[j*3+1]*3+2]]
				var v3 = [v[i[j*3+2]*3],v[i[j*3+2]*3+1],v[i[j*3+2]*3+2]]
				var a = substract(v1,v2)
				var b = substract(v1,v3)
				normal.push(normalize(cross(a,b)))
				// console.log(v1,v2,v3,a,b,cross(a,b),j)
				break
			}
		}
	}
	// console.log(normal)
	return normal.flat()
}

function substract(c,d){ //from c to d
	return [d[0]-c[0],d[1]-c[1],d[2]-c[2]]
}

function normalize(a){
	const ab = Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2])
	return [a[0]/ab,a[1]/ab,a[2]/ab]
}

function cross(a,b){
	return  [ a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0] ]
}

function dot(a,b){
	return a[0]*b[0] + a[1]*b[1] + a[2]*b[2]
}

// Listener
document.getElementById("help").addEventListener("click", showHelp);
document.getElementById("close").addEventListener("click", closeHelp);
document.getElementById("reset").addEventListener("click", reset);
document.getElementById("model-select").addEventListener("change", selectModel);
document.getElementById("rotating-model").addEventListener("change", rotatingModel);
document.getElementById("shading").addEventListener("change", shading);
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