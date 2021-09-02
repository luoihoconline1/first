

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import Stats from 'stats.js'

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );
/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//Clock
const clock = new THREE.Clock()
/**
 * Update all materials
 */
const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
        {
            // child.material.envMap = environmentMap
            child.material.envMapIntensity = debugObject.envMapIntensity
            child.material.needsUpdate = true
            child.castShadow = true
            child.receiveShadow = true
        }
    })
    scene.traverse((child) =>
    {
        if (child.visible == false) {
            console.log(child);
        }
    })
}

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
    'textures/environmentMaps/7/px.jpg',
    'textures/environmentMaps/7/nx.jpg',
    'textures/environmentMaps/7/py.jpg',
    'textures/environmentMaps/7/ny.jpg',
    'textures/environmentMaps/7/pz.jpg',
    'textures/environmentMaps/7/nz.jpg'
])

environmentMap.encoding = THREE.sRGBEncoding

scene.background = environmentMap
scene.environment = environmentMap

debugObject.envMapIntensity = 5
gui.add(debugObject, 'envMapIntensity').min(0).max(10).step(0.001).onChange(updateAllMaterials).setValue(0);
let mixer = null;
/**
 * Models
 */
let object = 1;
gltfLoader.load(
    'models/trial.glb',
    (gltf) =>
    {
        object = gltf.scene
        console.log(gltf);
        mixer = new THREE.AnimationMixer(gltf.scene);
        for (let ani of gltf.animations) {
            let action = mixer.clipAction(ani);
            action.play()
        }
        /*gltf.scene.children[272].children[1].material.emissiveIntensity = 100;
		gltf.scene.children[272].children[2].material.emissiveIntensity = 100;
		gltf.scene.children[272].children[3].material.emissiveIntensity = 10;
		gltf.scene.children[272].children[4].material.emissiveIntensity = 10;
		gltf.scene.children[105].children[5].children[1].material.emissiveIntensity = 10;
		gltf.scene.children[104].children[5].children[1].material.emissiveIntensity = 10;
		/*gltf.scene.children[272].children[3].material.emissive = new THREE.Color({
            isColor: true,
            r: 0.044379,
            g: 1,
            b: 0.215095
        })
		gltf.scene.children[272].children[4].material.emissive = new THREE.Color({
            isColor: true,
            r: 1,
            g: 0.224,
            b: 0.028
        })
        /*gltf.scene.children[11].material.emissiveIntensity = 10;
        gltf.scene.children[11].material.emissive = new THREE.Color({
            isColor: true,
            r: 1,
            g: 0.224,
            b: 0.028
        })
        gltf.scene.children[11].colorWhite = false;
        console.log(gltf);
        mixer = new THREE.AnimationMixer(gltf.scene);
        const action = mixer.clipAction(gltf.animations[1]);
        action.play()*/
        /*Hogwart
        gltf.scene.children[83].children[8].children[2].material.emissiveIntensity = 200;
        gltf.scene.children[83].children[8].children[2].material.emissive = new THREE.Color({
            isColor: true,
            r: 1,
            g: 0.224,
            b: 0.028
        });
        /*Gorija
        gltf.scene.children[16].material.emissiveIntensity = 100;
        gltf.scene.children[53].material.emissiveIntensity = 100;
        gltf.scene.children[52].material.emissiveIntensity = 100;
        gltf.scene.children[29].children[0].material.emissiveIntensity = 500;
        gltf.scene.children[9].children[10].children[0].material.emissiveIntensity = 50;
        console.log(gltf.scene.children[29].children[0].material.emissiveIntensity);*/
        gltf.scene.scale.set(2, 2, 2)
        gltf.scene.position.set(0, - 4, 0)
        gltf.scene.rotation.y = Math.PI * 0.5
        scene.add(gltf.scene)

        gui.add(gltf.scene.rotation, 'y').min(- Math.PI).max(Math.PI).step(0.001).name('rotation')

        updateAllMaterials()
        
		
    }
)




// gltfLoader.load(
//     '/models/hamburger.glb',
//     (gltf) =>
//     {
//         gltf.scene.scale.set(0.3, 0.3, 0.3)
//         gltf.scene.position.set(0, - 1, 0)
//         scene.add(gltf.scene)

//         updateAllMaterials()
//     }
// )

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 2)
directionalLight.castShadow = false
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 3, - 2.25)
scene.add(directionalLight)



gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity').setValue(0)
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001).name('lightX')
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001).name('lightY')
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001).name('lightZ')

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth / 10 * 7,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth / 10 * 7
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 300)
camera.position.set(7, 1, - 2)
//camera.rotation.y = 0.828;
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 1
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/*gui
    .add(renderer, 'toneMapping', {
        No: THREE.NoToneMapping,
        Linear: THREE.LinearToneMapping,
        Reinhard: THREE.ReinhardToneMapping,
        Cineon: THREE.CineonToneMapping,
        ACESFilmic: THREE.ACESFilmicToneMapping
    })
    .onFinishChange(() =>
    {
        renderer.toneMapping = Number(renderer.toneMapping)
        updateAllMaterials()
    })
/*gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001).setValue(1);*/

/**
 * Animate
 */
let previousTime = 0;
const tick = () =>
{
	stats.begin();
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;
	//console.log(deltaTime);


    //Update mixer
    if (mixer !== null) {
        mixer.update(deltaTime);
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
	stats.end();
}

tick()
console.log(scene);

/*var domEvents	= new THREEx.DomEvents(camera, renderer.domElement);

const delay = ms => new Promise(res => setTimeout(res, ms));
const display = async function() {
	await delay(2000);
	controls.update();
	renderer.render(scene, camera)
}
//display();
const left = document.querySelector('.left');
const right = document.querySelector('.right');
left.onclick = function () {
	camera_left()
}
right.onclick = function () {
	camera_right()
}
function camera_left() {
	camera.rotation.y -= 0.01;
	renderer.render(scene, camera)
	console.log(camera.rotation);
}
function camera_right() {
	camera.rotation.y += 0.01;
	renderer.render(scene, camera);
	console.log(camera.rotation);
}*/