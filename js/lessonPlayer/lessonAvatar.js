import * as THREE from 'three';
import './GLTFLoader';
import * as Const from '../common/constants';

export default class LessonAvatar {
    constructor() {
        this.poseKey = {};
        this.bones = {};
        this.camera;
        this.scene;
        this.renderer;
        this.skin;
        this.positionObject;
        this.moveDirection;
        this.animationMixer;
        this.isSpeaking;
    }

    setDefaultAnimation() {
        this.animationMixer = new THREE.AnimationMixer(this.skin);
        this.setBreathAnimation();
        this.setLipSyncAnimation();
    }

    loadRecordedAnimation(poseKey) {
        this.poseKey = poseKey;
        this.setRecordedAnimation();
    }

    setBreathAnimation() {
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
                // this.animationMixer
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

    setLipSyncAnimation () {
        const defaultIndex = AvatarFace.indexOf('MouthNeutral');
        const defaultMorph = this.skin.geometry.morphAttributes.normal[defaultIndex];

        const mouthAIndex = AvatarFace.indexOf('MouthA');
        const mouthMorph = this.skin.geometry.morphAttributes.normal[mouthAIndex];
        const animationClip = THREE.AnimationClip.CreateFromMorphTargetSequence('lipSync', [defaultMorph, mouthMorph], 30);
        this.animationMixer.clipAction(animationClip).setDuration(0.4);
    }

    setRecordedAnimation() {
        const poseBones = [];
        const poseKeys = [];

        Object.keys(this.poseKey).forEach((key) => {
            if (this.poseKey[key].length == 0) return;

            switch(key) {
                case 'leftHands':
                    poseBones.push(this.bones.J_Bip_L_Hand);
                    break;
                case 'rightHands':
                    poseBones.push(this.bones.J_Bip_R_Hand);
                    break;
                case 'leftShoulders':
                    poseBones.push(this.bones.J_Adj_L_UpperArm.parent);
                    break;
                case 'rightShoulders':
                    poseBones.push(this.bones.J_Adj_R_UpperArm.parent);
                    break;
                case 'leftElbows':
                    poseBones.push(this.bones.J_Bip_L_LowerArm);
                    break;
                case 'rightElbows':
                    poseBones.push(this.bones.J_Bip_R_LowerArm);
                    break;
                case 'necks':
                    poseBones.push(this.bones.J_Bip_C_Neck);
                    break;
                case 'coreBodies':
                    poseBones.push(this.positionObject);
                    break;
            }

            poseKeys.push({ keys: this.poseKey[key] });
        });

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
        this.animationMixer.update(deltaTime);
        this.movePosition(deltaTime);
        this.renderer.render(this.scene, this.camera);
    }

    play(isStart) {
        if (isStart) {
            this.animationMixer._actions.forEach((action) => {
                if (action.getClip().name == 'lipSync' && !this.isSpeaking) return;
                action.paused = false;
                action.play();
            });
        } else {
            this.animationMixer._actions.forEach((action) => {
                action.paused = true;
            });
        }
    }

    playLipSync(isSpeaking) {
        this.animationMixer._actions.forEach((action) => {
            if (action.getClip().name != 'lipSync') return;

            if (isSpeaking) {
                action.paused = false;
                action.play();
            } else {
                action.paused = true;
                this.changeFace('MouthA', 0);
            }
        });

        this.isSpeaking = isSpeaking;
    }

    changeFace(faceName, score=1) {
        this.skin.morphTargetInfluences.fill(0);
        if (faceName == 'Default') {
            return;
        } else {
            const index = AvatarFace.indexOf(faceName);
            this.skin.morphTargetInfluences[index] = score;
        }
    }

    moveBones(pose) {
        for (let part of Object.keys(pose)) {
            if (part == 'neck') {
                this.bones.J_Bip_C_Neck.rotation.y = pose[part].neckY;
            } else if (part == 'body') {
                this.bones.J_Bip_C_Neck.parent.parent.position.x = pose[part].x;
                this.bones.J_Bip_C_Neck.parent.parent.position.y = pose[part].y;
            } else if (part == 'leftArm') {
                this.bones.J_Adj_L_UpperArm.parent.rotation.z = pose[part].shoulderZ;
                this.bones.J_Bip_L_LowerArm.rotation.x        = pose[part].elbowX;
                this.bones.J_Bip_L_LowerArm.rotation.z        = pose[part].elbowZ;
                this.bones.J_Bip_L_LowerArm.rotation.y        = -0.5;
                this.bones.J_Bip_L_Hand.rotation.x            = pose[part].parmX;
            } else if (part == 'rightArm') {
                this.bones.J_Adj_R_UpperArm.parent.rotation.z = pose[part].shoulderZ;
                this.bones.J_Bip_R_LowerArm.rotation.x        = pose[part].elbowX;
                this.bones.J_Bip_R_LowerArm.rotation.z        = pose[part].elbowZ;
                this.bones.J_Bip_R_LowerArm.rotation.y        = 0.5;
                this.bones.J_Bip_R_Hand.rotation.x            = pose[part].parmX;
            }
        }
    }

    movePosition(deltaTime) {
        if (!this.moveDirection) return;

        const position = this.positionObject.position;

        if (this.moveDirection == 'left' || this.moveDirection == 'right') {
            let newX = (this.moveDirection == 'left') ? -deltaTime : deltaTime;
            newX += position.x;
            if (newX >= -2.7 && newX <= 2.7) {
                position.x = newX;
            } else {
                this.moveDirection = null;
                return;
            }
        }

        if (this.moveDirection == 'front' || this.moveDirection == 'back') {
            let newZ = (this.moveDirection == 'front') ? deltaTime : -deltaTime;
            newZ *= 100;
            newZ += position.z;
            if (newZ >= 0 && newZ <= 140) {
                position.z = newZ;
            } else {
                this.moveDirection = null;
                return;
            }
        }
    }

    moveTo(direction) {
        if (direction == 'stop') {
            this.moveDirection = null;
            return;
        }

        this.moveDirection = direction;
    }

    currentPosition() {
        return this.positionObject.position;
    }

    createDom(avatarURL, container) {
        const domSize = this.domSize(container);
        this.camera = new THREE.PerspectiveCamera(1, domSize.width / domSize.height, 1, 200);
        this.camera.position.set(0, 1.4, 150);
        this.camera.lookAt(new THREE.Vector3(0, 1.1, 0));

        this.scene = new THREE.Scene();
        const light = new THREE.AmbientLight(0xbbbbff);
        light.position.set(0, 1, 0);
        this.scene.add(light);

        return new Promise((resolve) => {
            new THREE.GLTFLoader().load(
                avatarURL, (vrm) => { resolve(vrm); }
            );
        }).then((vrm) =>{
            this.skin = vrm.scene.children[1];

            vrm.scene.traverse((object) => {
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

            // set upper arm bones to top level.
            this.positionObject = this.bones.J_Adj_C_Chest.parent.parent.parent.parent; // wtf
            this.skin.skeleton.bones.push(this.bones.J_Adj_L_UpperArm.parent, this.bones.J_Adj_R_UpperArm.parent, this.positionObject);
            const defaultMatrix4 = new THREE.Matrix4();
            defaultMatrix4.set(1, 0, 0, 0, 0, 1, -0, 0, -0, 0, 1, 0, 0, 0, 0, 1); // this is sloppy values.
            this.skin.skeleton.boneInverses.push(defaultMatrix4, defaultMatrix4, defaultMatrix4);

            this.initAvatarPosition();
            this.initBonePosition();

            this.scene.add(vrm.scene);

            this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(domSize.width, domSize.height);
            this.renderer.gammaOutput = true;
            this.renderer.render(this.scene, this.camera);

            return this.renderer.domElement;
        });
    }

    initAvatarPosition() {
        this.movePositions = [0, 0, 0];
        this.positionObject.rotation.set(0, Math.PI, 0);
        this.positionObject.position.set(0, 0, 85);
    }

    initBonePosition() {
        this.bones.J_Adj_L_UpperArm.parent.rotation.z = Const.RAD_70;
        this.bones.J_Adj_R_UpperArm.parent.rotation.z = -Const.RAD_70;
        this.bones.J_Bip_L_LowerArm.rotation.set(0, 0, 0);
        this.bones.J_Bip_R_LowerArm.rotation.set(0, 0, 0);
        this.bones.J_Bip_L_Hand.rotation.set(0, 0, 0);
        this.bones.J_Bip_R_Hand.rotation.set(0, 0, 0);
        this.bones.J_Bip_C_Neck.rotation.set(0, 0, 0);
    }

    updateSize(container) {
        if (!container) return; // for resized before rendering completed.
        const size = this.domSize(container);
        this.renderer.setSize(size.width, size.height);
    }

    domSize(container) {
        let playerWidth, playerHeight;
        if (container.clientHeight / container.clientWidth > Const.RATIO_16_TO_9) {
            playerWidth  = container.clientWidth;
            playerHeight = Math.round(container.clientWidth * Const.RATIO_16_TO_9);
        } else {
            playerWidth  = Math.round(container.clientHeight / Const.RATIO_16_TO_9);
            playerHeight = container.clientHeight;
        }

        return { width: playerWidth, height: playerHeight };
    }

    clearBeforeUnload() {
        if (this.scene) {
            this.scene.remove(this.scene.children);
        }
    }
}

class AvatarFace {
    static indexOf(faceName) {
        return [
            'AllAngry',
            'AllFun',
            'AllJoy',
            'AllSorrow',
            'AllSurprised',
            'BrwAngry',
            'BrwFun',
            'BrwJoy',
            'BrwSorrow',
            'BrwSurprised',
            'EyeNatural',
            'EyeAngry',
            'EyeClose',
            'EyeCloseR',
            'EyeCloseL',
            'EyeJoy',
            'EyeJoyR',
            'EyeJoyL',
            'EyeSorrow',
            'EyeSurprised',
            'EyeExtra',
            'MouthClose',
            'MouthUp',
            'MouthDown',
            'MouthAngry',
            'MouthSmall',
            'MouthLarge',
            'MouthNeutral',
            'MouthFun',
            'MouthJoy',
            'MouthSorrow',
            'MouthSurprised',
            'MouthA',
            'MouthI',
            'MouthU',
            'MouthE',
            'MouthO',
            'Fung1',
            'Fung1Low',
            'Fung1Up',
            'Fung2',
            'Fung2Low',
            'Fung2Up',
            'EyeExtraOn',
        ].indexOf(faceName);
    }
}