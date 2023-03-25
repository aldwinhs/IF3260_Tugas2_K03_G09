const showHelp = (event) => {
	document.getElementById("modal").style.display = "block";
}

const closeHelp = (event) => {
	document.getElementById("modal").style.display = "none";
}

const reset = (event) => {

	worldMatrix.m = [
		1,0,0,0,
		0,1,0,0,
		0,0,1,0,
		0,0,0,1
	];

	projMatrix = worldMatrix.getProjectionMatrix("Orthographic", initialZoom);

	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix.m);
	gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);
	

	// Reset sliders
	document.getElementById("translateX").value = 0;
	document.getElementById("translateY").value = 0;
	document.getElementById("translateZ").value = 0;	
	document.getElementById("scaleX").value = 1;
	document.getElementById("scaleY").value = 1;
	document.getElementById("scaleZ").value = 1;
	document.getElementById("rotationX").value = 0;
	document.getElementById("rotationY").value = 0;
	document.getElementById("rotationZ").value = 0;
	document.getElementById("cameraRotate").value = 0;
	document.getElementById("cameraRadius").value = 60;
	document.getElementById("projection").selectedIndex = 0;

	// Reset initial values
	initialX = 0;
	initialY = 0;
	initialZ = 0;
	initialScaleX = 1;
	initialScaleY = 1;
	initialScaleZ = 1;
	initialRotateX = 0;
	initialRotateY = 0;
	initialRotateZ = 0;
	initialZoom = 60; 
	initialRotateC = 0;
	initialProject = "Orthographic";

	var x = -Math.sin(initialRotateC * Math.PI/180) * 0.1;
	var z = -Math.cos(initialRotateC * Math.PI/180) * 0.1;
	viewMatrix.lookAt(
		[x,0,z],
		[0,0,0],
		[0,1,0]
	)
	viewMatrix.m[14] = 0;
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix.m);
	gl.uniformMatrix4fv(uNormalMatrix,gl.FALSE, viewMatrix.m)

	let index = document.getElementById("model-select").value

	// Reset Vertices
	for(let i = 0; i < vertices.length; i++) {
		vertices[i] = initialVertices[index][i];
	}

	render();
}

const selectModel = (event) => {
	let index = event.target.value;
	let selectedProjection = document.getElementById("projection");
	worldMatrix.m = [
		1,0,0,0,
		0,1,0,0,
		0,0,1,0,
		0,0,0,1
	];

	viewMatrix.m = [
		1,0,0,0,
		0,1,0,0,
		0,0,1,0,
		0,0,0,1
	];
	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix.m);
	
	vertices = loadedModels[index].vertices;
	colors = loadedModels[index].colors;
	indices = loadedModels[index].indices;
	loadedModels[initialModel].projection = document.getElementById("projection").value;
	
	if(loadedModels[index].projection == "Perspective") {
		selectedProjection.selectedIndex = 2;
		viewMatrix.m[14] = -2;
		gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix.m);
		gl.uniformMatrix4fv(uNormalMatrix,gl.FALSE, viewMatrix.m)
	} else {
		if(loadedModels[index].projection == "Orthographic") {
			selectedProjection.selectedIndex = 0;
		} else {
			selectedProjection.selectedIndex = 1;
		}
		viewMatrix.m[14] = 0;
		gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix.m);
		gl.uniformMatrix4fv(uNormalMatrix,gl.FALSE, viewMatrix.m)
	}

	projMatrix = worldMatrix.getProjectionMatrix(loadedModels[index].projection, initialZoom);
	gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

	initialModel = index;
	render();
}

const animateRotation = () => {
	angle = 0.005 * Math.PI;
	center = getCenter(vertices);
	worldMatrix.rotateX(angle, center);
    worldMatrix.rotateY(angle/4, center);
    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix.m);
    render();
	if(rotating) {
		requestAnimationFrame(animateRotation);
	}
}

const rotatingModel = (event) => {
	if(event.target.value == "on") {
		rotating = true;
		requestAnimationFrame(animateRotation);
	}else {
		rotating = false;
	}
}

const translate = () => {
	let x = document.getElementById("translateX").value - initialX;
	let y = document.getElementById("translateY").value - initialY;
	let z = document.getElementById("translateZ").value - initialZ;

	console.log(x);
	
    // worldMatrix.translate(x - initialX, y - initialY, z - initialZ)
    // gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix.m)

	for(let i = 0; i < vertices.length; i+=3) {
		vertices[i] += x;
		vertices[i+1] += y;
		vertices[i+2] += z;
	}

	render();
	initialX += x;
	initialY += y;
	initialZ += z;
}

const scale = () => {
	let x = document.getElementById("scaleX").value / initialScaleX;
	let y = document.getElementById("scaleY").value / initialScaleY;
	let z = document.getElementById("scaleZ").value / initialScaleZ;
	

	for(let i = 0; i < vertices.length; i+=3) {
		vertices[i] = vertices[i] * x;
		vertices[i+1] = vertices[i+1] * y;
		vertices[i+2] = vertices[i+2] * z;
	}

    render();

	initialScaleX = x * initialScaleX;
	initialScaleY = y * initialScaleY;
	initialScaleZ = z * initialScaleZ;
}

const rotateX = (event) => {
	let angle = event.target.value - initialRotateX;

    let center = getCenter(vertices);

	for(let i = 0; i < vertices.length; i+=3) {
		let x = vertices[i] - center[0];
        let y = vertices[i+1] - center[1];
        let z = vertices[i+2] - center[2];

        let newX = x;
        let newY = y * Math.cos(angle * Math.PI) - z * Math.sin(angle * Math.PI);
        let newZ = y * Math.sin(angle * Math.PI) + z * Math.cos(angle * Math.PI);

        vertices[i] = newX + center[0];
        vertices[i+1] = newY + center[1];
        vertices[i+2] = newZ + center[2];
	}

    render();

	initialRotateX = event.target.value;
}

const rotateY = (event) => {
	let angle = event.target.value - initialRotateY;
	
    let center = getCenter(vertices);

	for(let i = 0; i < vertices.length; i+=3) {
		let x = vertices[i] - center[0];
		let y = vertices[i+1] - center[1];
		let z = vertices[i+2] - center[2];

		let newX = x * Math.cos(angle * Math.PI) + z * Math.sin(angle * Math.PI);
		let newY = y;
		let newZ = -x * Math.sin(angle * Math.PI) + z * Math.cos(angle * Math.PI);

		vertices[i] = newX + center[0];
		vertices[i+1] = newY + center[1];
		vertices[i+2] = newZ + center[2];
	}

    render();

    initialRotateY = event.target.value;
}

const rotateZ = (event) => {
	let angle = event.target.value - initialRotateZ;
	
    let center = getCenter(vertices);

	for(let i = 0; i < vertices.length; i+=3) {
		let x = vertices[i] - center[0];
		let y = vertices[i+1] - center[1];
		let z = vertices[i+2] - center[2];

		let newX = x * Math.cos(angle * Math.PI) - y * Math.sin(angle * Math.PI);
		let newY = x * Math.sin(angle * Math.PI) + y * Math.cos(angle * Math.PI);
		let newZ = z;

		vertices[i] = newX + center[0];
		vertices[i+1] = newY + center[1];
		vertices[i+2] = newZ + center[2];
	}

    render();

    initialRotateZ = event.target.value;
}

const radiusC = (event) => {
	let zoom = event.target.value;
	projMatrix = worldMatrix.getProjectionMatrix(initialProject, zoom);
	if (initialProject == "Perspective"){
		viewMatrix.m[14] = -2;
		gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix.m);
		gl.uniformMatrix4fv(uNormalMatrix,gl.FALSE, viewMatrix.m)
	} else {
		viewMatrix.m[14] = 0;
		gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix.m);
		gl.uniformMatrix4fv(uNormalMatrix,gl.FALSE, viewMatrix.m)
	}
	gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);
	render();
	initialZoom = event.target.value;
}

const projection = (event) => {
	let type = event.target.value;
	projMatrix = worldMatrix.getProjectionMatrix(type, initialZoom);
	if (type == "Perspective"){
		viewMatrix.m[14] = -2;
		gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix.m);
		gl.uniformMatrix4fv(uNormalMatrix,gl.FALSE, viewMatrix.m)
	} else {
		viewMatrix.m[14] = 0;
		gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix.m);
		gl.uniformMatrix4fv(uNormalMatrix,gl.FALSE, viewMatrix.m)
	}
	gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);
	render();
	initialProject = type;
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

		let selectedProjection = document.getElementById("projection");

		// Reset values
		document.getElementById("translateX").value = 0;
		document.getElementById("translateY").value = 0;
		document.getElementById("translateZ").value = 0;	
		document.getElementById("scaleX").value = 1;
		document.getElementById("scaleY").value = 1;
		document.getElementById("scaleZ").value = 1;
		document.getElementById("rotationX").value = 0;
		document.getElementById("rotationY").value = 0;
		document.getElementById("rotationZ").value = 0;
		document.getElementById("cameraRotate").value = 0;
		document.getElementById("cameraRadius").value = 60;

		// Reset initial values
		initialX = 0;
		initialY = 0;
		initialZ = 0;
		initialScaleX = 1;
		initialScaleY = 1;
		initialScaleZ = 1;
		initialRotateX = 0;
		initialRotateY = 0;
		initialRotateZ = 0;
		initialZoom = 60; 
		initialRotateC = 0;
		initialProject = "Orthographic";

		if (model.models[0].projection == "Perspective"){
			selectedProjection.selectedIndex = 2;
			viewMatrix.m[14] = -2;
			gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix.m);
			gl.uniformMatrix4fv(uNormalMatrix,gl.FALSE, viewMatrix.m)
		} else {
			if(model.models[0].projection == "Orthographic"){
				selectedProjection.selectedIndex = 0;
			}else{
				selectedProjection.selectedIndex = 1;
			}
			viewMatrix.m[14] = 0;
			gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix.m);
			gl.uniformMatrix4fv(uNormalMatrix,gl.FALSE, viewMatrix.m)
		}

		// Set projection matrix
		projMatrix = worldMatrix.getProjectionMatrix(model.models[0].projection, initialZoom);
		gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

		// Set loaded models
		loadedModels = model.models;

		initialVertices = [];

		// Set Initial
		for (let i = 0; i < loadedModels.length; i++){
			initialVertices.push([...loadedModels[i].vertices]);
		}

		// Set model
		vertices = loadedModels[0].vertices;
		indices = loadedModels[0].indices;
		colors = loadedModels[0].colors;

		// Set selections
		document.getElementById("model-select").innerHTML = "";
		for (let i = 0; i < loadedModels.length; i++){
			let option = document.createElement("option");
			option.text = loadedModels[i].name;
			option.value = i;
			document.getElementById("model-select").add(option);
		}

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
		"models" : loadedModels
	}

	let a = document.createElement("a");
	let file = new Blob([JSON.stringify(model)], {type: "text/plain"});
	a.href = URL.createObjectURL(file);
	a.download = filename + ".json";
	a.click();

	document.getElementById("saveFileName").value = "";

}

const rotateC = (event) => {
	let angle = event.target.value;
	viewMatrix.moveCamera(angle, 0.1);
	if (initialProject == "Perspective"){
		viewMatrix.m[14] = -2;
	}
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix.m);
	gl.uniformMatrix4fv(uNormalMatrix,gl.FALSE, viewMatrix.m)
	render();
	initialRotateC = event.target.value;
}

const shading = (event) => {
	if(event.target.value == "on") {
		var shaderUniformLocation = gl.getUniformLocation(program, 'shader');
		gl.uniform1f(shaderUniformLocation, 1.0);
		render();
	}else {
		var shaderUniformLocation = gl.getUniformLocation(program, 'shader');
		gl.uniform1f(shaderUniformLocation, 0.0);
		render();
	}
}