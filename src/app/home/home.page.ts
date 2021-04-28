import { Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {


  @ViewChild('domObj') canvasEl: ElementRef;
  _ELEMENT: any;
  camera: any;
  scene;
  renderer;
  geometry;
  material;
  mesh;
  controls;


  loader = new GLTFLoader();
  mouseX = 0;
  mouseY = 0;
  

  instantiateScene() {
    this._ELEMENT = this.canvasEl.nativeElement;
    this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 5000 );
    this.camera.position.x = -120;
    this.camera.position.y = 120;
    this.camera.position.z = 180;

    this.scene = new THREE.Scene();
    
    this.scene.background = new THREE.Color( 0xa0a0a0 );

    this.geometry = new THREE.PlaneGeometry( 1000, 1000 )
    this.material =  new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } );

    this.mesh = new THREE.Mesh( this.geometry, this.material );
    this.mesh.rotation.x = - Math.PI / 2;
    this.mesh.receiveShadow = true;

    this.scene.add( this.mesh );

    // loading model
    this.loader.load('assets/etron.glb', function ( gltf ) {
      var model = gltf.scene;
      this.scene.add( model );

      model.traverse( function ( object ) {

        if ( object.isMesh ) object.castShadow = true;

      } );
    }.bind(this), undefined, function ( error ) {
      console.error( error );
    } );

    /*const loader = new THREE.TextureLoader();
    const texture = loader.load(
      'assets/skybox.jpg',
      () => {
        const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
        rt.fromEquirectangularTexture(this.renderer, texture);
        this.scene.background = rt.texture;
      });*/
    
    
    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    hemiLight.position.set( 0, 500, 0 );
    this.scene.add( hemiLight );

    const dirLight = new THREE.DirectionalLight( 0xffffff );
    dirLight.position.set( -40, 100, 40 );
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 100;
    dirLight.shadow.camera.bottom = -100;
    dirLight.shadow.camera.left = -100;
    dirLight.shadow.camera.right = 100;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 200;
    this.scene.add( dirLight );

    
    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.shadowMap.enabled = true;
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    //this.renderer.setAnimationLoop( this.animation );
    this._ELEMENT.appendChild( this.renderer.domElement );
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // Failed attempt for limiting orbitcontrols
    /*var minPan = new THREE.Vector3( -600, -600, -600 );
    var maxPan = new THREE.Vector3( 600, 600, 600 );
    var _v = new THREE.Vector3();
    
    this.controls.addEventListener("change", function() {
        _v.copy(this.controls.target);
        this.controls.target.clamp(minPan, maxPan);
        _v.sub(this.controls.target);
        this.camera.position.sub(_v);
    }.bind(this));*/
      
    window.addEventListener( 'resize', this.onWindowResize.bind(this), false );

  }

  private _animate (time) : void {
    requestAnimationFrame((time) =>
    {
        this._animate(time);
    });
    this.renderer.render( this.scene, this.camera );
  }

  onWindowResize(){
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize( window.innerWidth, window.innerHeight );
  }

  renderAnimation() : void
  {
      this._animate(0); 
  }

  ionViewDidEnter(){
    this.instantiateScene();
    this.renderAnimation();
  }
}
