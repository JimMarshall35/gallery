var scene,camera,renderer;
var last,delta;
var paintings = [];
var videos = [];
var keys = [];      //keys currently held down
document.body.onload = function(){

	scene = new THREE.Scene();

	camera = new FirstPersonCam();
	//camera.position.z = 5;
	console.log(camera);
	renderer = new THREE.WebGLRenderer({antialias:true});
	renderer.setClearColor("red");
	renderer.setSize(window.innerWidth,window.innerHeight);
	document.body.appendChild(renderer.domElement);

	setupEventListeners();
	loadLevelFromJSON();
	last = new Date().getTime();
	loop = function(){
		let now = new Date().getTime();
		delta = (now - last)/1000;
		last = now;
		camera.update(delta);
		renderer.render(scene,camera.camera);
		window.requestAnimationFrame(loop);
	}
	window.requestAnimationFrame(loop);
}
function setupEventListeners(){
	window.addEventListener("resize",()=>{
		renderer.setSize(window.innerWidth,window.innerHeight);
		camera.camera.aspect = window.innerWidth / window.innerHeight;
		camera.camera.updateProjectionMatrix();
	});
	window.addEventListener("mousemove",handleMouseMove);
	window.addEventListener("keypress", handleKeyboard);

	window.addEventListener("keydown", handlekeydown);
	window.addEventListener("keyup", handlekeyup);
}

function handleMouseMove(e){
	camera.processMouse(e.movementX,e.movementY);
}

function handleKeyboard(e){
	switch(e.key){

		case 'f':
			renderer.domElement.requestPointerLock();
			break;
		case 'p':
			for (var i = 0; i < videos.length; i++) {
				videos[i].texture.image.play();
			}
			break;
	}
}

function handlekeydown(e){
	if(!keys.includes(e.key)){
		keys.push(e.key);
	}
}
function handlekeyup(e){
	const index = keys.indexOf(e.key);
	if (index > -1) {
	  keys.splice(index, 1);
	}
}