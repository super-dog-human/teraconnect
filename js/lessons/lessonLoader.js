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
    const bones = {};
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
                        object.material.transparent = true;
                        object.material.alphaTest = 0.5;
                    }
                } else if (object.isBone) {
                    bones[object.name] = object;
                }
            });
            scene.add(vrm.scene);

            setAnimations(vrm.scene);
            animate();

//            const skeletonHelper = new THREE.SkeletonHelper(vrm.scene);
//            scene.add(skeletonHelper);
        } );

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setClearColor(new THREE.Color(0xEEEEEE));
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.gammaOutput = true;
        dom = renderer.domElement;

        window.addEventListener('resize', onWindowResize, false);
        window.onbeforeunload = function(e) {
            scene.remove(scene.children)
            return;
        };
    }

    function setAnimations(vrm) {
        // initial arm positions.
        bones.J_Adj_L_UpperArm.parent.rotateZ(70 * Math.PI / 180);
        bones.J_Adj_R_UpperArm.parent.rotateZ(-70 * Math.PI / 180);

        const breathBones = [bones.J_Bip_C_Head, bones.J_Adj_C_UpperChest, bones.J_Adj_C_Spine];
        const breathKeypoints = [
            {
                keys: [
                    // head
                    {
                        rot: [0, 0, 0, 1],
                        time: 0,
                    },
                    {
                        rot: [-0.01, 0, 0, 1],
                        time: 1,
                    },
                    {
                        rot: [0, 0, 0, 1],
                        time: 2,
                    },
                    {
                        rot: [0.01, 0, 0, 1],
                        time: 3,
                    },
                    {
                        rot: [0, 0, 0, 1],
                        time: 4,
                    },
                    {
                        rot: [-0.01, 0, 0, 1],
                        time: 5,
                    },
                    {
                        rot: [0, 0, 0, 1],
                        time: 6,
                    },

                ]
            },
            {
                // upper chest
                keys: [
                    {
                        scl: [1, 1, 1],
                        rot: [0, 0, 0, 1],
                        time: 0,
                    },
                    {
                        scl: [1.02, 1, 1.02],
                        rot: [0.05, 0, 0, 1],
                        time: 3,
                    },
                    {
                        scl: [1, 1, 1],
                        rot: [0, 0, 0, 1],
                        time: 6,
                    }
                ],
            },
            {
                // spine
                keys: [
                    {
                        rot: [0, 0, 0, 1],
                        time: 0,
                    },
                    {
                        rot: [0, 1, 0, 1],
                        time: 3,
                    },
                    {
                        rot: [0, 0, 0, 1],
                        time: 6,
                    }
                ]
            }
        ];
        const breathClip = THREE.AnimationClip.parseAnimation({
            name: "breath",
            hierarchy: breathKeypoints,
          }, breathBones);

        const skin = vrm.children[1].children[0];
        animationMixer = new THREE.AnimationMixer(skin);
        animationAction = animationMixer.clipAction(breathClip);
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