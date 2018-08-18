import * as THREE from 'three';
import './GLTFLoader';
import './OrbitControls'

export default class LessonAvatar {
    constructor() {
        this.clock = new THREE.Clock();
        this.lesson = {};
        this.material = {};
        this.bones = {};
        this.controls;
        this.camera;
        this.scene;
        this.renderer;
        this.skin;
        this.animationMixer;
    }

    loadLesson(lesson, material) {
        this.lesson   = lesson;
        this.material = material;

        this.animationMixer = new THREE.AnimationMixer(this.skin);
        this.setDefaultAnimation();
        this.setRecordAnimation();

        this.animate();
    }

    setDefaultAnimation() {
        // initial arm positions
        const rad70 = 1.2217304763960306;
        this.bones.J_Adj_L_UpperArm.parent.rotateZ(rad70);
        this.bones.J_Adj_R_UpperArm.parent.rotateZ(-rad70);

        // breathing animation
        const breathBones = [
            this.bones.J_Bip_C_Head,
            this.bones.J_Adj_C_UpperChest,
            this.bones.J_Adj_C_Spine,
        ];

        const breathKeys = [
            {
                // head
                keys: [
                    { rot: [0, 0, 0, 1],     time: 0, },
                    { rot: [-0.01, 0, 0, 1], time: 1, },
                    { rot: [0, 0, 0, 1],     time: 2, },
                    { rot: [0.01, 0, 0, 1],  time: 3, },
                    { rot: [0, 0, 0, 1],     time: 4, },
                    { rot: [-0.01, 0, 0, 1], time: 5, },
                    { rot: [0, 0, 0, 1],     time: 6, },
                ]
            },
            {
                // upper chest
                keys: [
                    { scl: [1, 1, 1],       rot: [0, 0, 0, 1],    time: 0, },
                    { scl: [1.02, 1, 1.02], rot: [0.05, 0, 0, 1], time: 3, },
                    { scl: [1, 1, 1],       rot: [0, 0, 0, 1],    time: 6, },
                ],
            },
            {
                // spine
                keys: [
                    { rot: [0, 0, 0, 1], time: 0, },
                    { rot: [0, 1, 0, 1], time: 3, },
                    { rot: [0, 0, 0, 1], time: 6, },
                ]
            },
        ];

        const breathClip = THREE.AnimationClip.parseAnimation({
            name: "breath",
            hierarchy: breathKeys,
        }, breathBones);

        this.animationMixer.clipAction(breathClip);
    }

    setRecordAnimation() {
        const poseBones = [
            this.bones.J_Adj_L_UpperArm.parent,
            this.bones.J_Adj_R_UpperArm.parent,
            this.bones.J_Bip_L_LowerArm,
            this.bones.J_Bip_R_LowerArm,
        ];

        const poseKeys = [];
        poseKeys.push({ keys: this.lesson.poseKey.leftShoulders });
        poseKeys.push({ keys: this.lesson.poseKey.rightShoulders });
        poseKeys.push({ keys: this.lesson.poseKey.leftElbows });
        poseKeys.push({ keys: this.lesson.poseKey.rightElbows });

        const poseClip = THREE.AnimationClip.parseAnimation({
            name: "pose",
            hierarchy: poseKeys,
        }, poseBones);

        this.animationMixer.clipAction(poseClip);
    }

    play(isStart) {
        if (isStart) {
            this.animationMixer._actions.forEach((action) => {
                action.paused = false;
                action.play();
            });
        } else {
            this.animationMixer._actions.forEach((action) => {
                action.paused = true;
            });
        }
        //this.animationMixer.stopAllAction();
    }

    jumpAnimationAt(timeSec) {
        this.animationAction.startAt(timeSec);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.animationMixer.update(this.clock.getDelta());
        // show graphics / texts
        this.renderer.render(this.scene, this.camera);
    }

    createDom(avatarURL) {
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 20);
        this.camera.position.set(0, 1.6, - 2.2);

        this.controls = new THREE.OrbitControls(this.camera);
        this.controls.target.set(0, 1, 0);
        this.controls.update();

        this.scene = new THREE.Scene();
        window.onbeforeunload = () => {
            this.scene.remove(this.scene.children)
            return;
        };

        const light = new THREE.AmbientLight(0xbbbbff);
        light.position.set(0, 1, 0);
        this.scene.add(light);

        return new Promise((resolve) => {
            new THREE.GLTFLoader().load(
                avatarURL, (vrm) => { resolve(vrm); }
            );
        }).then((vrm) =>{
            this.skin = vrm.scene.children[1].children[0];

            vrm.scene.traverse((object) => {
                if (object.material) {
                    if (!Array.isArray(object.material)) {
                        object.material.transparent = true;
                        object.material.alphaTest = 0.5;
                    }
                } else if (object.isBone) {
                    this.bones[object.name] = object;
                }
            });

            // set upper arm bones to top level.
            const boneInverses = this.skin.skeleton.boneInverses;
            const defaultMatrix4 = new THREE.Matrix4();
            defaultMatrix4.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);
            boneInverses.push(defaultMatrix4, defaultMatrix4);

            const bones = this.skin.skeleton.bones;
            bones.push(this.bones.J_Adj_L_UpperArm.parent, this.bones.J_Adj_R_UpperArm.parent);
            this.skin.skeleton = new THREE.Skeleton(bones, boneInverses);

            this.scene.add(vrm.scene);

            this.renderer = new THREE.WebGLRenderer({ antialias: true });
            this.renderer.setClearColor(new THREE.Color(0xFFFFFF));
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.gammaOutput = true;

            return this.renderer.domElement;
        });
    }
}


/*
var texture = new THREE.TextureLoader().load('path/to/file.jpg',
(tex) => { // 読み込み完了時
    // 縦横比を保って適当にリサイズ
    const w = 5;
    const h = tex.image.height/(tex.image.width/w);

    // 平面
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshPhongMaterial( { map:texture } );
    const plane = new THREE.Mesh( geometry, material );
    plane.scale.set(w, h, 1);
    scene.add( plane );
});
*/