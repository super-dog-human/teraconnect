import * as THREE from 'three';
import './GLTFLoader';
import * as Const from '../common/constants';

export default class LessonAvatar {
    constructor() {
        this.poseKey = {};
        this.bones = {};
        this.poseHistories = [];
        this.camera;
        this.scene;
        this.renderer;
        this.skin;
        this.animationMixer;
        this.isSpeaking;
        this.accuracyThresholdMin = 0.7;
        this.rad70 = 1.2217304763960306;
        this.rad90 = 1.5707963267948966;
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
        const defaultIndex = AvatarFacial.indexOf('MouthNeutral');
        const defaultMorph = this.skin.geometry.morphAttributes.normal[defaultIndex];

        const mouthAIndex = AvatarFacial.indexOf('MouthA');
        const mouthMorph = this.skin.geometry.morphAttributes.normal[mouthAIndex];
        const animationClip = THREE.AnimationClip.CreateFromMorphTargetSequence('lipSync', [defaultMorph, mouthMorph], 30);
        this.animationMixer.clipAction(animationClip).setDuration(0.4);
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
        this.animationMixer.update(deltaTime);
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
                this.changeFacial('MouthA', 0);
            }
        });

        this.isSpeaking = isSpeaking;
    }

    changeFacial(facialName, score=1) {
        if (facialName == 'Default') {
            this.skin.morphTargetInfluences.fill(0);
        } else {
            const index = AvatarFacial.indexOf(facialName);
            this.skin.morphTargetInfluences[index] = score;
        }
    }

    moveBones(pose, time) {
        for (let part in pose) {
            if (part == 'score') continue;
            if (!pose[part]) continue;
            if (pose[part].score >= this.accuracyThresholdMin) continue;
            pose[part] = null;
        }

        reflectionPoseToArms(this, pose.leftElbow, pose.leftShoulder, pose.leftWrist, 'left');
        reflectionPoseToArms(this, pose.rightElbow, pose.rightShoulder, pose.rightWrist, 'right');
        reflectionPoseToNeck(this, pose.nose, pose.leftEar, pose.rightEar);

        function reflectionPoseToArms(self, elbow, shoulder, wrist, side) {
            if (!elbow || !shoulder || !wrist) return;

            const shoulderZRad = (side == 'left') ?
                Math.atan2(elbow.x - shoulder.x, elbow.y - shoulder.y) - self.rad90 :
                Math.atan2(shoulder.x - elbow.x, shoulder.y - elbow.y) - self.rad90;

            const elbowZRad = (side == 'left') ?
                Math.atan2(elbow.x - wrist.x, elbow.y - wrist.y) + self.rad90 - shoulderZRad :
                Math.atan2(wrist.x - elbow.x, wrist.y - elbow.y) + self.rad90 - shoulderZRad;

            const elbowXRad = (Math.abs(elbowZRad) > self.rad90 || Math.abs(elbowZRad) > 0 ) ? Math.PI : 0;
            const parmXRad  = (Math.abs(elbowZRad) > self.rad90) ? -self.rad90 : 0;

            if (side == 'left') {
                self.bones.J_Adj_L_UpperArm.parent.rotation.z = -shoulderZRad;
                self.bones.J_Bip_L_LowerArm.rotation.z        = elbowZRad;
                self.bones.J_Bip_L_LowerArm.rotation.x        = elbowXRad;
                self.bones.J_Bip_L_LowerArm.rotation.y        = -0.5;
                self.bones.J_Bip_L_Hand.rotation.x            = parmXRad;
            } else {
                self.bones.J_Adj_R_UpperArm.parent.rotation.z = -shoulderZRad;
                self.bones.J_Bip_R_LowerArm.rotation.z        = elbowZRad;
                self.bones.J_Bip_R_LowerArm.rotation.x        = -elbowXRad;
                self.bones.J_Bip_R_LowerArm.rotation.y        = 0.5;
                self.bones.J_Bip_R_Hand.rotation.x            = parmXRad;
            }
        }

        function reflectionPoseToNeck(self, nose, leftEar, rightEar) {
            if (!nose && !leftEar && !rightEar) return;

            if (nose && rightEar && leftEar) {
                const rightFaceLength = nose.x - rightEar.x;
                const leftFaceLength = leftEar.x - nose.x;
                const faceAngleRatio = (rightFaceLength > leftFaceLength) ?
                    1 - (leftFaceLength / rightFaceLength) :
                    -1 + (rightFaceLength / leftFaceLength);

                self.bones.J_Bip_C_Neck.rotation.y = Math.round(faceAngleRatio * 10) / 10;
            }

            /*
                leftEar
                leftEye
                nose
                rightEar
                rightEye
            */
        }

/*
        this.poseHistory.leftElbows.push({ rot: bone.leftElbows.rotation, time: time });
*/
    }

    createDom(avatarURL, container) {
        const domSize = this.domSize(container);
        this.camera = new THREE.PerspectiveCamera(45, domSize.width / domSize.height, 1, 10);
        this.camera.position.set(0, 1.2, -2.2);
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

            // initialize arm positions
            this.bones.J_Adj_L_UpperArm.parent.rotateZ(this.rad70);
            this.bones.J_Adj_R_UpperArm.parent.rotateZ(-this.rad70);

            // set upper arm bones to top level.
            this.skin.skeleton.bones.push(this.bones.J_Adj_L_UpperArm.parent, this.bones.J_Adj_R_UpperArm.parent);
            const defaultMatrix4 = new THREE.Matrix4();
            defaultMatrix4.set(1, 0, 0, 0, 0, 1, -0, 0, -0, 0, 1, 0, 0, 0, 0, 1); // this is sloppy values.
            this.skin.skeleton.boneInverses.push(defaultMatrix4, defaultMatrix4);

            this.scene.add(vrm.scene);

            this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(domSize.width, domSize.height);
            this.renderer.gammaOutput = true;
            this.renderer.render(this.scene, this.camera);

            return this.renderer.domElement;
        });
    }

    updateSize(container) {
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
        this.scene.remove(this.scene.children);
    }
}

class AvatarFacial {
    static indexOf(facialName) {
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
        ].indexOf(facialName);
    }
}