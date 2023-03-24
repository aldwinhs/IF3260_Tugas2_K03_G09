const showHelp = (event) => {
	document.getElementById("modal").style.display = "block";
}

const closeHelp = (event) => {
	document.getElementById("modal").style.display = "none";
}

const reset = () => {
	worldMatrix.m = [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix.m);

	// Reset sliders
	document.getElementById("translateX").value = 0;
	document.getElementById("translateY").value = 0;
	document.getElementById("translateZ").value = 0;
	document.getElementById("scaleX").value = 1;
	document.getElementById("scaleY").value = 1;
	document.getElementById("scaleZ").value = 1;
	document.getElementById("rotateX").value = 0;
	document.getElementById("rotateY").value = 0;
	document.getElementById("rotateZ").value = 0;
}

const animateRotation = () => {
	angle = 0.01 * Math.PI;
	worldMatrix.rotateX(angle);
	worldMatrix.rotateY(angle/4);
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
	let x = document.getElementById("translateX").value;
	let y = document.getElementById("translateY").value;
	let z = document.getElementById("translateZ").value;
	
    for (let i = 0; vertices.length > i; i+=3) {
        vertices[i] += x - initialX;
        vertices[i+1] += y - initialY;
        vertices[i+2] += z - initialZ;
    }    

	render();
	initialX = x;
	initialY = y;
	initialZ = z;
}

const scale = () => {
	let x = document.getElementById("scaleX").value / initialScaleX;
	let y = document.getElementById("scaleY").value / initialScaleY;
	let z = document.getElementById("scaleZ").value / initialScaleZ;
	
    for (let i = 0; vertices.length > i; i+=3) {
        vertices[i] *= x;
        vertices[i+1] *= y;
        vertices[i+2] *= z;
    }

    render();

	initialScaleX = x * initialScaleX;
	initialScaleY = y * initialScaleY;
	initialScaleZ = z * initialScaleZ;
}

const rotateX = (event) => {
	let angle = event.target.value - initialRotateX;

    let center = getCenter(vertices);
	
    for (let i = 0; vertices.length > i; i+=3) {
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

    for (let i = 0; vertices.length > i; i+=3) {
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

    for (let i = 0; vertices.length > i; i+=3) {
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

const zoom = (event) => {
	let zoom = event.target.value/initialZoom;
	worldMatrix.scale(zoom, zoom, zoom);
	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix.m);
	render();
	initialZoom = event.target.value;
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
		document.getElementById("projection").value = model.state.projection;

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
		viewMatrix.m = model.state.viewMatrix;
		gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix.m);

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
			viewMatrix: viewMatrix.m,
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

const radiusC = (event) => {
	let radius = event.target.value;
	viewMatrix.m[15] += parseInt(radius);
	console.log(viewMatrix.m);
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix.m);
	render();
}

const rotateC = (event) => {
	let angle = event.target.value;
	viewMatrix.rotateAroundOrigin(angle*Math.PI/180);
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix.m);
	render();
}