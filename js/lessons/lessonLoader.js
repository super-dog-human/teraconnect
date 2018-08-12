import axios from 'axios';
import * as THREE from 'three';
import './GLTFLoader';
import './OrbitControls'

const API_URL        = "https://api.teraconnect.org/";
const LESSON_API_URL = API_URL + "lessons/{lessonID}";
const AVATAR_API_URL = API_URL + "avatars/{avatarID}/url";

let animationAction, animationMixer;

export default function (lessonID) {
    const lessonURL = LESSON_API_URL.replace("{lessonID}", lessonID);
    return axios.get(lessonURL)
        .then((response) => {
            const avatarID = response.data.avatar.id;
            const avatarURL = AVATAR_API_URL.replace("{avatarID}", avatarID);
            return axios.get(avatarURL);
        })
        .then((response) => {
//            const avatarFileURL = response.data.signed_url;
            const avatarFileURL = `http://localhost:1234/bdiuotgrbj8g00l9t3ng.vrm`;
            return avatarDOM(avatarFileURL);
        })
        .catch((err) => {
            console.error(err);
        });
}

function switchAnimation(isPlaying) {
    if (isPlaying) animationAction.play();
}

function jumpAnimationAt(timeSec) {

}

function avatarDOM(avatarURL) {
    const boneNames = ["J_Bip_C_Head", "J_Adj_L_UpperArm", "J_Bip_L_LowerArm", "J_Adj_R_UpperArm", "J_Bip_R_LowerArm"];
    const clock = new THREE.Clock();
    let controls, dom, camera, scene, renderer;

    init();
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

        const loader = new THREE.GLTFLoader();
        loader.load(avatarURL, (vrm) => {
            vrm.scene.traverse(function (object) {
                if (object.material) {
                    if (!Array.isArray(object.material)) {
                        object.material.alphaTest = 0.1;
                    }
                }
            });
            scene.add(vrm.scene);

            setAnimation(vrm.scene);
            animate();
        } );

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setClearColor(new THREE.Color(0xEEEEEE));
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.gammaOutput = true;
        dom = renderer.domElement;

        window.addEventListener('resize', onWindowResize, false);
    }

    function setAnimation(vrm) {
        const skin = vrm.children[1].children[0];
        const bones = skin.skeleton.bones.filter((b) => {
            return boneNames.includes(b.name);
        });

        const clip = THREE.AnimationClip.parseAnimation({
            hierarchy: [
                {
                    length: 2,
                    keys: [
                        {
                            rot: [-0, 0, 0, 1],
                            time: 0,
                        },
                        {
                            rot: [-0, 2, 0, 1],
                            time: 1,
                        },
                        {
                            rot: [-0, 0, 0, 1],
                            time: 2,
                        }
                    ],
                },
            ]
          }, bones);

        animationMixer = new THREE.AnimationMixer(skin);
        animationAction = animationMixer.clipAction(clip);
        animationAction.play();
    }

    function animate() {
        requestAnimationFrame(animate);
        animationMixer.update(clock.getDelta());
        renderer.render(scene, camera);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }
}