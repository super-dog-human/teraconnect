import * as THREE from 'three';
import './GLTFLoader';
import './OrbitControls'

export default class LessonAvatar {
    constructor() {
        this.poseKey = {};
        this.bones = {};
        this.controls;
        this.camera;
        this.scene;
        this.renderer;
        this.skin;
        this.animationMixer;
    }

    loadLesson(poseKey) {
        this.poseKey = poseKey;

        this.animationMixer = new THREE.AnimationMixer(this.skin);
        this.setDefaultAnimation();
        this.setBlinkAnimation();
        this.setRecordedAnimation();
    }

    setDefaultAnimation() {
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

    setBlinkAnimation() {
        /*
        const morphTargets = this.skin.geometry.morphAttributes.normal.slice(2, 5);
        const blinkClip = THREE.AnimationClip.CreateFromMorphTargetSequence('blink', morphTargets, 30);
        this.animationMixer.clipAction(blinkClip).setDuration(5);
        */
    }

    setRecordedAnimation() {
        const poseBones = [
            this.bones.J_Adj_L_UpperArm.parent,
            this.bones.J_Adj_R_UpperArm.parent,
            this.bones.J_Bip_L_LowerArm,
            this.bones.J_Bip_R_LowerArm,
        ];

        const poseKeys = [
            { keys: this.poseKey.leftShoulders },
            { keys: this.poseKey.rightShoulders },
            { keys: this.poseKey.leftElbows },
            { keys: this.poseKey.rightElbows },
        ];

        const poseClip = THREE.AnimationClip.parseAnimation({
            name: "pose",
            hierarchy: poseKeys,
        }, poseBones);

        this.animationMixer.clipAction(poseClip);
    }

    jumpAnimationAt(timeSec) {
        this.animationMixer._actions.forEach((action) => {
            action.startAt(timeSec);
        });
    }

    animate(deltaTime) {
        const indexes = [2, 12];
        this.morphTargets.forEach((target) => {
            indexes.forEach((i) => {
                const influence = target.morphTargetInfluences[i];
                if (influence >= 1) {
                    target.morphTargetInfluences[i] = 0;
                } else {
                    target.morphTargetInfluences[i] += 0.01;
                }
            });
        });

        this.animationMixer.update(deltaTime);
        this.renderer.render(this.scene, this.camera);
    }

    play(isStart) {
        if (isStart) {
            // FIXME shouldn't use _actions property
            this.animationMixer._actions.forEach((action) => {
                action.paused = false;
                action.play();
            });
        } else {
            this.animationMixer._actions.forEach((action) => {
                action.paused = true;
            });
        }
    }

    createDom(avatarURL, domWidth, domHeight) {
        this.camera = new THREE.PerspectiveCamera(45, domWidth / domHeight, 0.25, 20);
        this.camera.position.set(0, 1.4, -2.2);

        this.controls = new THREE.OrbitControls(this.camera);
        this.controls.target.set(0, 1, 0);
        this.controls.update();

        this.scene = new THREE.Scene();
        const light = new THREE.AmbientLight(0xbbbbff);
        light.position.set(0, 1, 0);
        this.scene.add(light);

        return new Promise((resolve) => {
            new THREE.GLTFLoader().load(
                avatarURL, (vrm) => { resolve(vrm); }
            );
        }).then((vrm) =>{
            this.skin = vrm.scenes[0].children[1];

            vrm.scenes.forEach((scene) => {
                scene.traverse((object) => {
                    if (object.isBone) this.bones[object.name] = object;
                    if (!object.material) return;

                    if (Array.isArray(object.material)) {
                        object.material.forEach((material) => {
                            material.alphaTest = 0.5;
                        });
                    } else {
                        object.material.alphaTest = 0.5;
                    }
                });
            });

            this.morphTargets = [];
            this.recursionBoneAllocation([vrm.scene], this.morphTargets);

            // initialize arm positions
            const rad70 = 1.2217304763960306;
            this.bones.J_Adj_L_UpperArm.parent.rotateZ(rad70);
            this.bones.J_Adj_R_UpperArm.parent.rotateZ(-rad70);

            // set upper arm bones to top level.
            this.skin.skeleton.bones.push(this.bones.J_Adj_L_UpperArm.parent, this.bones.J_Adj_R_UpperArm.parent);
            const defaultMatrix4 = new THREE.Matrix4();
            defaultMatrix4.set(1, 0, 0, 0, 0, 1, -0, 0, -0, 0, 1, 0, 0, 0, 0, 1); // this is sloppy values.
            this.skin.skeleton.boneInverses.push(defaultMatrix4, defaultMatrix4);

            this.scene.add(vrm.scene);

            this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(domWidth, domHeight);
            this.renderer.gammaOutput = true;
            this.renderer.render(this.scene, this.camera);

            return this.renderer.domElement;
        });
    }

    recursionBoneAllocation(objects, morphTargets) {
        objects.forEach(object => {
            if (typeof object.morphTargetInfluences !== "undefined") {
                morphTargets.push(object);
            }

            if (!   object.children) return;
            if (object.children.length > 0) {
                this.recursionBoneAllocation(object.children, morphTargets);
            }
        });
    }

    updateSize(width, height) {
        this.renderer.setSize(width, height);
    }

    clearBeforeUnload() {
        this.scene.remove(this.scene.children);
    }
}