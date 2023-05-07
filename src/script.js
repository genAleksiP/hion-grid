import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Use unlit version of the grid model for ignoring all light sources
import hionGrid from './models/hion-grid-unlit.glb?url'
import hionLogo from './models/hion-logo.glb?url'


window.addEventListener( 'DOMContentLoaded', () => {

    // Initialize element variables
    let theCanvas, camera, scene, renderer, hionGridMesh, hionLogoMesh;


    // Define the html canvas element
    theCanvas = document.querySelector("#the3dCanvas");


    // Define the scene, camera and renderer
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100 );
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize( window.innerWidth, window.innerHeight );

    renderer.outputEncoding = THREE.sRGBEncoding;
    theCanvas.appendChild( renderer.domElement );

    camera.position.set( 0.3, 0.25, 0.3 );
    camera.lookAt(2, 2, 1);



    // LOAD GRID FILE
    new GLTFLoader().load( hionGrid,
        function( gltf) {
            hionGridMesh = gltf.scene;
            scene.add( hionGridMesh );
            hionGridMesh.position.set( 0.0, 0.0, 0.0 );
            render();
        }
    );


    // LOAD LOGO FILE
    new GLTFLoader().load( hionLogo,
        function( gltf) {
            hionLogoMesh = gltf.scene;
            scene.add( hionLogoMesh );
            hionLogoMesh.position.set( -0.3, 0.1, -0.3 );
            hionLogoMesh.scale.set( 2.0, 2.0, 2.0 );

            // Convert angle to radian value. p_angle = your angle, example; 90
            // 2 * Math.PI * (p_angle / 360)
            hionLogoMesh.rotation.y = 2 * Math.PI * (45 / 360);

            spinLogo();
            render();
        }
    );


    // POINT LIGHT
    const pointLight = new THREE.PointLight( 0xFFFFFF, 1.4, 100 );
    pointLight.position.set( -0.0, 0.8, 0.7 );
    scene.add( pointLight );


    // ORBIT CONTROLS
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.addEventListener( 'change', render );
    controls.minDistance = 0.05;
    controls.maxDistance = 0.25;
    controls.target.set( -0.0, 0.2, -0.0 );
    controls.update();



    // Add Raycaster for detecting scene mouse click
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    function onClick( event ) {

        // Calculate pointer position in normalized device coordinates. (-1 to +1) for both components
        pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        // Update the picking ray with the camera and pointer position
        raycaster.setFromCamera( pointer, camera );

        // Calculate objects intersecting the picking ray
        const intersects = raycaster.intersectObjects( scene.children );

        // Detect logo element click
        if (intersects[0].object.name === "hion-logoobj") {
            spinLogo();
        }
    }


    // LOGO SPIN ANIMATION
    function spinLogo() {

        hionLogoMesh.rotation.y -= 2 * Math.PI * (1.5 / 360);
        
        if (hionLogoMesh.rotation.y < 2 * Math.PI * (-360 / 360)) {
            hionLogoMesh.rotation.y = 2 * Math.PI * (0 / 360);
        }
    
        renderer.render(scene, camera);
        requestAnimationFrame(spinLogo);
    }


    


    // Resize renderer and update aspect ratio on window resize
    window.addEventListener( 'resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
        render();
    } );


    // Add click event listener. Use Raycaster to detect scene elements
    window.addEventListener( 'click', onClick );




    // Render the scene and camera
    function render() {
        renderer.render( scene, camera );
    }

    render()

} );
       