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
    let controls, dom, camera, scene, renderer, skinnedMeshes;

    init();
    animate();
    return dom;

    function init() {
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 20);
        camera.position.set(0, 1.6, - 2.2);

        controls = new THREE.OrbitControls(camera);
        controls.target.set(0, 1, 0);
        controls.update();

        scene = new THREE.Scene();

        const light = new THREE.AmbientLight(0xbbbbff);
        light.position.set(0, 1, 0);
        scene.add(light);

        const loader = new THREE.VRMLoader();
        loader.load(avatarURL, function (vrm) {
            vrm.scene.traverse(function (object) {
                if (object.material) {
                    if (!Array.isArray(object.material)) {
                        object.material.alphaTest = 0.1;
                    }
                }
            });
            scene.add(vrm.scene);
            skinnedMeshes = vrm.scene.children[1].children;

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

        if (skinnedMeshes != undefined) {
            skinnedMeshes.forEach((skin) => {
                skin.skeleton.bones.forEach((bone) => {
//                    console.log(bone.name);
//                    bone.rotation.y = 0.5;
                });
            });
        }
        renderer.render(scene, camera);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }
}