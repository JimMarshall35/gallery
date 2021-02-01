class Painting{
	constructor(loader,path="textures/a.jpg",fixedHeight=5,pos=new THREE.Vector3(0,0,0),rot=new THREE.Vector3(0,0,0)){
		this.path = path;
		this.fixedHeight = fixedHeight;
		this.pos = pos;
		this.rot = rot;
		loader.load(
			// resource URL
			path,

			// onLoad callback
			(texture)=>{this.onTexLoad(texture,this)},

			// onProgress callback currently not supported
			undefined,

			// onError callback
			function ( err ) {
				console.error( 'An error happened.' );
			}
		);
	}
	onTexLoad(texture, painting){
		// in this example we create the material when the texture is loaded
		const material = new THREE.MeshBasicMaterial( {
			map: texture
		 } );
		console.log("texture loaded");
		console.log(texture);
		const wh_ratio = texture.image.naturalWidth / texture.image.naturalHeight;

		const width = wh_ratio*painting.fixedHeight;
		const geometry = new THREE.PlaneGeometry(width,painting.fixedHeight,1,1);
		const mesh = new THREE.Mesh(geometry,material);
		mesh.position.set(painting.pos.x,painting.pos.y,painting.pos.z);
		mesh.rotation.set(painting.rot.x,painting.rot.y,painting.rot.z);
		scene.add(mesh);
	}
}
class VideoPainting{
	constructor(id="vid",fixedHeight=5,pos=new THREE.Vector3(0,0,0),rot=new THREE.Vector3(0,0,0)){
		const video = document.getElementById( id );


		this.texture = new THREE.VideoTexture( video );
		console.log(this.texture);
		const material = new THREE.MeshBasicMaterial( {
			map: this.texture
		} );
		const wh_ratio = this.texture.image.videoWidth / this.texture.image.videoHeight;

		const width = wh_ratio*fixedHeight;
		const geometry = new THREE.PlaneGeometry(width,fixedHeight,1,1);//width,fixedHeight,1,1);
		const mesh = new THREE.Mesh(geometry,material);
		mesh.position.set(pos.x,pos.y,pos.z);
		mesh.rotation.set(rot.x,rot.y,rot.z);
		scene.add(mesh);
		this.update();
	}
	update(){
		//this.texture.update();
	}
}