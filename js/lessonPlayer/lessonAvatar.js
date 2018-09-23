import * as THREE from 'three';
import '../common/GLTFLoader';
import * as Const from '../common/constants';

export default class LessonAvatar {
    constructor() {
        this.poseKey = {};
        this.bones = {};
        this.camera;
        this.scene;
        this.renderer;
        this.skin;
        this.moveDirection;
        this.animationMixer;
        this.isSpeaking = false;
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
            this.bones.J_Bip_C_UpperChest.children[0],
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
        Object.keys(this.poseKey).forEach((key) => {
            if (this.poseKey[key].length == 0) return;

            let bone;
            let clipName = '';

            switch(key) {
                case 'leftHands':
                    bone     = this.bones.J_Bip_L_Hand;
                    clipName = 'leftHands';
                    break;
                case 'rightHands':
                    bone     = this.bones.J_Bip_R_Hand;
                    clipName = 'rightHands';
                    break;
                case 'leftShoulders':
                    bone     = this.bones.J_Bip_L_UpperArm;
                    clipName = 'leftShoulders';
                    break;
                case 'rightShoulders':
                    bone     = this.bones.J_Bip_R_UpperArm;
                    clipName = 'rightShoulders';
                    break;
                case 'leftElbows':
                    bone     = this.bones.J_Bip_L_LowerArm;
                    clipName = 'leftElbows';
                    break;
                case 'rightElbows':
                    bone     = this.bones.J_Bip_R_LowerArm;
                    clipName = 'rightElbows';
                    break;
                case 'necks':
                    bone     = this.bones.J_Bip_C_Neck;
                    clipName = 'necks';
                    break;
                case 'coreBodies':
                    bone     = this.bones.Position;
                    clipName = 'coreBodies';
                    break;
            }

            const poseKeys = [{ keys: this.poseKey[key] }];
            const poseClip = THREE.AnimationClip.parseAnimation({
                name:      clipName,
                hierarchy: poseKeys,
            }, [bone]);

            const action = this.animationMixer.clipAction(poseClip);
            action.setLoop(THREE.LoopOnce);
        });
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
                const actionName = action.getClip().name;
                if (actionName == 'lipSync' && !this.isSpeaking) return;

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
                this.changeFace('MouthA', 0);
                action.paused = false;
                action.play();
            } else {
                action.paused = true;
                this.changeFace('MouthA', 0);
            }
        });

        this.isSpeaking = isSpeaking;
    }

    resetAnimation() {
        this.isSpeaking = false;

        this.animationMixer._actions.forEach((action) => {
            if (action.getClip().name == 'lipSync') return;
            action.reset();
        });
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
            } else if (part == 'leftArm') {
                this.bones.J_Bip_L_UpperArm.rotation.z = pose[part].shoulderZ;
                this.bones.J_Bip_L_LowerArm.rotation.x = pose[part].elbowX;
                this.bones.J_Bip_L_LowerArm.rotation.z = pose[part].elbowZ;
                this.bones.J_Bip_L_LowerArm.rotation.y = -0.5;
                this.bones.J_Bip_L_Hand.rotation.x     = pose[part].parmX;
            } else if (part == 'rightArm') {
                this.bones.J_Bip_R_UpperArm.rotation.z = pose[part].shoulderZ;
                this.bones.J_Bip_R_LowerArm.rotation.x = pose[part].elbowX;
                this.bones.J_Bip_R_LowerArm.rotation.z = pose[part].elbowZ;
                this.bones.J_Bip_R_LowerArm.rotation.y = 0.5;
                this.bones.J_Bip_R_Hand.rotation.x     = pose[part].parmX;
            }
        }

        if (!('leftArm' in pose)) {
            this.initBonePosition('left');
        }

        if (!('rightArm' in pose)) {
            this.initBonePosition('right');
        }
    }

    movePosition(deltaTime) {
        if (!this.moveDirection) return;

        const position = this.bones.Position.position;

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
        return this.bones.Position.position;
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
            this.skin = vrm.scene.children[0]; // store face skin.

            vrm.scene.traverse((object) => {
                if (object.isBone) {
                    this.bones[object.name] = object;
                }
            });

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
        this.bones.Position.rotation.set(0, Math.PI, 0);
        this.bones.Position.position.set(0, 0, 85);
    }

    initBonePosition(side='all') {
        if (side == 'left' || side == 'all') {
            this.bones.J_Bip_L_UpperArm.rotation.z = Const.RAD_70;
            this.bones.J_Bip_L_LowerArm.rotation.set(0, 0, 0);
            this.bones.J_Bip_L_Hand.rotation.set(0, 0, 0);
        }

        if (side == 'right' || side == 'all') {
            this.bones.J_Bip_R_UpperArm.rotation.z = -Const.RAD_70;
            this.bones.J_Bip_R_LowerArm.rotation.set(0, 0, 0);
            this.bones.J_Bip_R_Hand.rotation.set(0, 0, 0);
        }

        if (side == 'all') {
            this.bones.J_Bip_C_Neck.rotation.set(0, 0, 0);
        }
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