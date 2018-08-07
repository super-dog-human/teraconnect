import axios from 'axios';
import * as THREE from 'three';
import './VRMLoader';
import './OrbitControls'

const API_URL        = "https://api.teraconnect.org/";
const LESSON_API_URL = API_URL + "lessons/{lessonID}";
const AVATAR_API_URL = API_URL + "avatars/{avatarID}/url";

export default function (lessonID) {
    const lessonURL = LESSON_API_URL.replace("{lessonID}", lessonID);
    return axios.get(lessonURL)
        .then((response) => {
            const avatarID = response.data.avatar.id;
            const avatarURL = AVATAR_API_URL.replace("{avatarID}", avatarID);
            return axios.get(avatarURL);
        })
        .then((response) => {
            const avatarFileURL = response.data.signed_url;
            return avatarDOM(avatarFileURL);
        })
        .catch((err) => {
            console.error(err);
        });
}

function avatarDOM(avatarURL) {
    let controls, dom, camera, scene, renderer;

    init();
    animate();
    return dom;

    function init() {
        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 20 );
        camera.position.set(0, 1.6, - 2.2);

        controls = new THREE.OrbitControls(camera);
        controls.target.set(0, 0.9, 0);
        controls.update();

        scene = new THREE.Scene();

        const light = new THREE.HemisphereLight(0xbbbbff, 0x444422);
        light.position.set(0, 1, 0);
        scene.add(light);

        const loader = new THREE.VRMLoader();
        loader.load(avatarURL, function (vrm) {
            vrm.scene.traverse(function (object) {
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        console.log("is array.");
                        for (var i = 0, il = object.material.length; i < il; i ++) {
                            const material = new THREE.MeshBasicMaterial();
                            THREE.Material.prototype.copy.call(material, object.material[i]);
                            material.color.copy(object.material[i].color);
                            material.map = object.material[ i ].map;
                            material.lights = false;
                            object.material[i] = material;
                        }
                    } else {
                        const material = new THREE.MeshBasicMaterial();
                        THREE.Material.prototype.copy.call(material, object.material);
                        material.color.copy(object.material.color);
                        material.map = object.material.map;
                        material.lights = false;
                        material.alphaTest = 0.1;
                        object.material = material;
                    }
                } else {
                    console.log(object);
                }
            } );
            scene.add(vrm.scene);
            vrm.scene.position.z += 1;
            console.log('loaded.');
        } );

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setClearColor(new THREE.Color(0xEEEEEE));
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.gammaOutput = true;
        dom = renderer.domElement;
        window.addEventListener('resize', onWindowResize, false);
    }

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }
}