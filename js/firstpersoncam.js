function degrees2rads(degrees) {
	return degrees * (Math.PI/180.0);
}

class FirstPersonCam{
	constructor(
		yaw=-90.0, 
		pitch=0.0
	){
		this.position = new THREE.Vector3(0,0,5);
		this.up = new THREE.Vector3(0,1,0);
		this.worldUp = new THREE.Vector3(0,1,0);
		this.front = new THREE.Vector3(0,0,-1);
		this.right = new THREE.Vector3();
		this.camera = new THREE.PerspectiveCamera(
			45,                                        // FOV angle
			window.innerWidth / window.innerHeight,    // aspect ratio
			0.02,                                       // near plane
			1000                                       // far plane
		);

		this.yaw = yaw;
		this.pitch = pitch;

		this.speed = 30;
		this.sensitivity = 0.1;
		this.zoom = 45.0;

		this.updateCamera();
	}
	setpos(x,y,z){
		this.position = new THREE.Vector3(x,y,z);
		this.updateCamera();
	}
	setlvlfloorplan(floorplan){
		this.floorplan = floorplan;
		this.currentCell = this.getTileAtPos(this.position);
		console.log(this.currentCell);
	}
	processMouse(xoffset,yoffset,constrainpitch=true){
		xoffset *= this.sensitivity;
		yoffset *= this.sensitivity;

		this.yaw += xoffset;
		this.pitch += -yoffset;

		if (constrainpitch)
		{
			if (this.pitch > 89.0)
				this.pitch = 89.0;
			if (this.pitch < -89.0)
				this.pitch = -89.0;
		}

		this.updateCamera();
	}
	update(delta){
		for(let i=0; i<keys.length; i++){
			this.processKeyBoard(keys[i],delta);
		}
	}
	processKeyBoard(dir,delta){
		let velocity = this.speed*delta;
		let  mfront = new THREE.Vector3(this.front.x,0,this.front.z);
		mfront.normalize();
		let mright = new THREE.Vector3();
		mright.crossVectors(mfront, this.worldUp);
		mright.normalize();
		let mvec;
		if(dir == "w"){
			mvec = mfront.multiplyScalar(velocity);
		}
		else if(dir == "s"){
			mvec = mfront.multiplyScalar(-velocity);
		}
		else if(dir == "a"){
			mvec = mright.multiplyScalar(-velocity);
		}
		else if(dir == "d"){
			mvec = mright.multiplyScalar(velocity);
		}
		else{
			return;
		}

		this.position.add(mvec);
		
		this.currentCell = this.getTileAtPos(this.position);
		switch(this.currentCell){
			case ' ':
			case '*':
				this.position.add(mvec.multiplyScalar(-1));
				this.currentCell = this.getTileAtPos(this.position);
				break;
			case ' ':
				break;
		}

		this.updateCamera();

	}
	getTileAtPos(pos){
		try{
			let char = this.floorplan.map[Math.round(pos.z/this.floorplan.tilesize)][Math.round(pos.x/this.floorplan.tilesize)];
			return char;
		}
		catch(e){
			return " ";
		}
	}
	updateCamera(){
		this.updateCameraVectors();
		this.camera.position.x = this.position.x;
		this.camera.position.y = this.position.y;
		this.camera.position.z = this.position.z;
		let target = new THREE.Vector3();
		target.addVectors(this.position, this.front);

		this.camera.lookAt(target);
		this.camera.updateProjectionMatrix();

	}
	updateCameraVectors(){
		// calculate the new Front vector
		this.front.x = Math.cos(degrees2rads(this.yaw)) * Math.cos(degrees2rads(this.pitch));
		this.front.y = Math.sin(degrees2rads(this.pitch));
		this.front.z = Math.sin(degrees2rads(this.yaw)) * Math.cos(degrees2rads(this.pitch));
		this.front.normalize();
		// also re-calculate the Right and Up vector
		this.right.crossVectors(this.front, this.worldUp);
		this.right.normalize();
		this.up.crossVectors(this.right, this.front);
		this.up.normalize();
	}
}