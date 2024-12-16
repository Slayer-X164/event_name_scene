import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

//scene
const scene = new THREE.Scene();

//camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5);

//lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

//gltf model loader
const loader = new GLTFLoader();
let model; // Declare model in wider scope to access in animate
loader.load(
  '/scene.gltf',
  function (gltf) {
    model = gltf.scene;
    // Center the model
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);
    scene.add(model);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    console.error('An error happened:', error);
  }
);

//renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('canvas'),
  antialias: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);

//controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = false; // Disable zoom

//handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate(){
  requestAnimationFrame(animate);
  if (model) {
    model.rotation.y -= 0.003; // Add slow rotation
  }
  controls.update();
  renderer.render(scene, camera);
}
animate();


//svg animation

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {

      entry.target.querySelectorAll('path').forEach(path => {
        path.style.animation = 'none';
        path.offsetHeight;
        path.style.animation = 'textAnimation 4s ease-in-out alternate forwards';
      });
    }
  });
}, {
  threshold: 0.5
});

const eventNameContainer = document.querySelector('.event_name_container');
if (eventNameContainer) {
  observer.observe(eventNameContainer);
}
//loader
const preloader= ()=>{
  const loaderContainer = document.querySelector('.loader-content')
  const main = document.querySelector('main')

  window.addEventListener("load",()=>{
    loaderContainer.classList.add('hidden')
    main.classList.add('visible')
  })
}
preloader()
