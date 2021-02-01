
var loader;
function loadLevelFromJSON(){
	loader = new THREE.TextureLoader();
	$.getJSON("data/level.json", function(json) {
		let lvl = json.lvl;
		console.log(json); // this will show the info it in firebug console
		loadroom(lvl);
		loadskybox(lvl);
	    loadlights(lvl);
	    loadshapes(lvl);
	    loadpaintings(lvl);
	}).fail(function(e){
		console.log("failed");
		console.log(e);
	})
}
function loadskybox(lvl){
	let sloader = new THREE.CubeTextureLoader();
	let texture = sloader.load([
    	
    	lvl.skybox.front,
    	lvl.skybox.back,
    	lvl.skybox.up,
    	lvl.skybox.down,
    	lvl.skybox.right,
    	lvl.skybox.left,
    	
    ]);
    scene.background = texture;
}
function loadlights(lvl){
	for(let i=0; i<lvl.lights.length; i++){
    	let jsonlight =  lvl.lights[i];
    	let colourint;
    	switch(jsonlight.type){
    		case "PointLight":
    			colourint = parseInt(jsonlight.colour, 16);
		    	let light = new THREE.PointLight(colourint, jsonlight.intensity, jsonlight.distance);
				light.position.set(jsonlight.pos.x,jsonlight.pos.y,jsonlight.pos.z);
				scene.add(light);
				break;
			case "DirectionalLight":
				colourint = parseInt(jsonlight.colour, 16);
				const directionalLight = new THREE.DirectionalLight( colourint, jsonlight.intensity );
				directionalLight.position.set(jsonlight.pos.x,jsonlight.pos.y,jsonlight.pos.z);
				scene.add( directionalLight );
				break;
    	}
    }
}
function loadshapes(lvl){
	let cellsize = lvl.floorplan.tilesize;
	for(let i=0; i<lvl.shapes.length; i++){
    	let jsonshape = lvl.shapes[i];
    	let pos;
    	if(jsonshape.pos != undefined){
    		pos = jsonshape.pos;
    	}
    	else{
    		pos = {x: jsonshape.cell.x*cellsize, y:jsonshape.y, z:jsonshape.cell.z*cellsize};
    	}
    	let geometry;
    	let material;
    	switch(jsonshape.type){
    		case "sphere":
    			geometry = new THREE.SphereGeometry(jsonshape.radius, jsonshape.width_segments, jsonshape.height_segments);
    			break;
    		case "torusknot":
    			geometry = new THREE.TorusKnotGeometry(jsonshape.radius, jsonshape.tube);	
    			break;
    		case "text":
    			continue;
    			break;
    		default:
    			console.error("invalid geometry type");
    			break;

    	}
    	switch(jsonshape.material.type){
    		case "lambert":
    			let colourint = parseInt(jsonshape.material.colour,16);
    			material = new THREE.MeshLambertMaterial({color: colourint});
    			break;
    		default:
    			console.error("invalid material type "+jsonshape.material.type);
    			break;		
    	}
    	let mesh = new THREE.Mesh(geometry,material);
    	mesh.position.set(pos.x,pos.y,pos.z);
    	mesh.rotation.set(degrees2rads(jsonshape.rot.x),degrees2rads(jsonshape.rot.y),degrees2rads(jsonshape.rot.z));
    	scene.add(mesh);

    }
}
function loadpaintings(lvl){
	let cellsize = lvl.floorplan.tilesize;
	for(let i=0; i<lvl.paintings.length; i++){

    	let painting = lvl.paintings[i];
    	let pos, rot;
		if(painting.pos != undefined){
			pos = new THREE.Vector3(painting.pos.x,painting.pos.y,painting.pos.z);
		}
		else{
			pos = new THREE.Vector3(painting.cell.x*cellsize, 0, painting.cell.z*cellsize);
		}
		if(painting.rot != undefined){
			rot = new THREE.Vector3(degrees2rads(painting.rot.x),degrees2rads(painting.rot.y),degrees2rads(painting.rot.z));
		}
		if(painting.side != undefined){
			switch(painting.side){
				case "front":
					pos.add(new THREE.Vector3(0,0,-((cellsize/2)+0.1)));
					rot = new THREE.Vector3(0,degrees2rads(180),0);
					break;
				case "back":
					pos.add(new THREE.Vector3(0,0,((cellsize/2)+0.1)));
					rot = new THREE.Vector3(0,0,0);
					break;
				case "left":
					pos.add(new THREE.Vector3(-((cellsize/2)+0.1),0,0));
					rot = new THREE.Vector3(0,degrees2rads(270),0);
					break;
				case "right":
					pos.add(new THREE.Vector3(((cellsize/2)+0.1),0,0));
					rot = new THREE.Vector3(0,degrees2rads(90),0);
					break;
			}
		}
    	if(painting.video){
    		videos.push(new VideoPainting(painting.id,painting.fixedheight,pos,rot));
    	}
    	else{
    		paintings.push(new Painting(loader, painting.path,painting.fixedheight,pos,rot));
    	}
    	
    }
}
function loadroom(lvl){

	let map = lvl.floorplan.map;
	let tilesize = lvl.floorplan.tilesize;
	let wallheight = lvl.floorplan.wallheight;
	for(let i=0; i<map.length;i++){
		let row = map[i];
		for(let j=0; j<row.length; j++){
			let char = row[j];
			let pos = new THREE.Vector3(j*tilesize,0,i*tilesize);
			let geometry, material, mesh;
			switch(char){
				case '*':
					geometry = new THREE.BoxGeometry(tilesize,wallheight,tilesize);
					material = new THREE.MeshLambertMaterial( {color: 0xffffff} );
					mesh = new THREE.Mesh( geometry, material );
					mesh.position.set(pos.x,pos.y,pos.z);
					scene.add( mesh );
					break;
				case '_':
					geometry = new THREE.BoxGeometry(tilesize,1,tilesize);
					material = new THREE.MeshLambertMaterial( {color: 0xffffff} );
					mesh = new THREE.Mesh( geometry, material );
					mesh.position.set(pos.x,-10.5,pos.z);
					scene.add( mesh );
					break;
				case 's':
					geometry = new THREE.BoxGeometry(tilesize,1,tilesize);
					material = new THREE.MeshLambertMaterial( {color: 0xffffff} );
					mesh = new THREE.Mesh( geometry, material );
					mesh.position.set(pos.x,-10.5,pos.z);
					scene.add( mesh );
					camera.setpos(pos.x,pos.y,pos.z);
					break;
			}
		}
	}
	camera.setlvlfloorplan(lvl.floorplan);
}